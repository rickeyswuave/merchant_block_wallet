"use client"

import { useState, useEffect } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram, Keypair, SendTransactionError } from '@solana/web3.js';
import { decode as bs58Decode } from 'bs58';
import RefundModal from './refund-modal';
import { useToast } from '@/hooks/use-toast';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

type Transaction = {
  id: string;
  sender: string;
  amount: number;
  amountUSD: number;
  status: 'pending' | 'completed' | 'refunded' | 'failed';
  timestamp: string;
};

function convertToCSV(transactions: Transaction[]): string {
  const header = ["ID", "Sender", "Amount (ETH)", "Amount (USD)", "Status", "Timestamp"];
  const rows = transactions.map(txn => [
    txn.id,
    txn.sender,
    txn.amount,
    txn.amountUSD,
    txn.status,
    txn.timestamp,
  ]);
  return [header, ...rows].map(row => row.join(",")).join("\n");
}

function downloadCSV(transactions: Transaction[]) {
  const csvData = convertToCSV(transactions);
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// This function will be replaced with an actual API call
async function fetchTransactions(): Promise<Transaction[]> {
  const response = await fetch('http://localhost:3000/api/transactions/28gKfgTw6xkZiYcJ7vA5KBqKzew3kscYW7UwM5vgRNLb');
  const transactions = await response.json();

  // Transform the transactions to match the Transaction type
  return transactions.map((tx: any) => {
    const amount = Math.abs((tx.meta.postBalances[0] - tx.meta.preBalances[0]) / 1e9); // Convert lamports to SOL and ensure positive
    return {
      id: tx.transaction.signatures[0],
      sender: tx.transaction.message.accountKeys[0].pubkey,
      amount,
      status: 'completed', // You can add logic to determine the status
      timestamp: new Date(tx.blockTime * 1000).toISOString(),
    };
  });
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();

  const loadTransactions = async () => {
    setIsLoading(true);
    console.log('Loading transactions...');
    try {
      const data = await fetchTransactions();
      console.log('Transactions loaded:', data);
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleRefund = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsRefundModalOpen(true);
  };

  const confirmRefund = async (passGasFees: boolean) => {
    if (selectedTransaction) {
      try {
        console.log('Starting refund process...');
        const refundPublicKey = '28gKfgTw6xkZiYcJ7vA5KBqKzew3kscYW7UwM5vgRNLb';
        const refundPrivateKey = '5tNS93EPvaCNDsYUeBAiDWArT1eR15iDjtoQLQnv3Szz7E1o7VsVd8NKYYrXkdHLPmTi2TurmjMvRWic7E5WZ34o';

        console.log('Creating connection...');
        const connection = new Connection('https://rpc.ankr.com/solana_devnet');
        console.log('Connection created:', connection);

        console.log('Fetching latest blockhash...');
        const { blockhash } = await connection.getLatestBlockhash();
        console.log('Latest blockhash:', blockhash);

        console.log('Fetching account balance...');
        const balance = await connection.getBalance(new PublicKey(refundPublicKey));
        console.log('Account balance:', balance);

        console.log('Parsing private key...');
        const senderKeypair = Keypair.fromSecretKey(bs58Decode(refundPrivateKey));
        console.log('Keypair created:', senderKeypair);

        console.log('Creating transaction...');
        const lamports = Math.abs(selectedTransaction.amount * 1e9); // Convert SOL to lamports and ensure positive
        console.log('Amount to transfer (lamports):', lamports);

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: senderKeypair.publicKey,
            toPubkey: new PublicKey(selectedTransaction.sender),
            lamports,
          })
        );
        transaction.recentBlockhash = blockhash;
        console.log('Transaction created:', transaction);

        console.log('Sending transaction...');
        const signature = await connection.sendTransaction(transaction, [senderKeypair]);
        console.log('Transaction sent, signature:', signature);

        console.log('Confirming transaction...');
        await connection.confirmTransaction(signature, 'processed');
        console.log('Transaction confirmed');

        // Update the local state after successful refund
        setTransactions(prevTransactions =>
          prevTransactions.map(t =>
            t.id === selectedTransaction.id ? { ...t, status: 'refunded' } : t
          )
        );
        setIsRefundModalOpen(false);
        toast({
          title: 'Refund Successful',
          description: `Transaction ${selectedTransaction.id} has been refunded.${passGasFees ? ' Gas fees passed to the user.' : ''}`,
        });
      } catch (error) {
        console.error('Failed to process refund:', error);
        if (error instanceof SendTransactionError) {
          console.error('Transaction logs:', error.logs);
        }
        toast({
          title: 'Error',
          description: 'Failed to process refund',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="flex gap-2">
          <Button onClick={loadTransactions} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Refresh'
            )}
          </Button>
          <Button onClick={() => downloadCSV(transactions)} disabled={transactions.length === 0}>
            Export
          </Button>
        </div>
        
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <DataTable<Transaction, unknown> columns={columns(setSelectedTransaction, setIsRefundModalOpen)} data={transactions} />
      )}
      <RefundModal 
        isOpen={isRefundModalOpen} 
        onClose={() => setIsRefundModalOpen(false)}
        onConfirm={confirmRefund}
        transaction={selectedTransaction}
      />
    </>
  )
}