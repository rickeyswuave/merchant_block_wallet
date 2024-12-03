"use client"

import { useState, useEffect } from 'react'
import RefundModal from './refund-modal'
import { useToast } from '@/hooks/use-toast'
import { DataTable } from './data-table'
import { columns } from './columns'
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'

type Transaction = {
  id: string
  sender: string
  amount: number
  amountUSD: number
  status: 'pending' | 'completed' | 'refunded' | 'failed'
  timestamp: string
}

function convertToCSV(transactions: Transaction[]): string {
  const header = ["ID", "Sender", "Amount (ETH)", "Amount (USD)", "Status", "Timestamp"]
  const rows = transactions.map(txn => [
    txn.id,
    txn.sender,
    txn.amount,
    txn.amountUSD,
    txn.status,
    txn.timestamp,
  ])
  return [header, ...rows].map(row => row.join(",")).join("\n")
}

function downloadCSV(transactions: Transaction[]) {
  const csvData = convertToCSV(transactions)
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "transactions.csv"
  a.click()
  URL.revokeObjectURL(url)
}

// This function will be replaced with an actual API call
// async function fetchTransactions(): Promise<Transaction[]> {
//   const response = await fetch('http://localhost:3000/api/transactions/GA26NywR5aAvs6HswujnfQusBDUSmW6U7rGdrD9GEEM');
//   const transactions = await response.json();

//   // Transform the transactions to match the Transaction type
//   return transactions.map((tx: any) => ({
//     id: tx.transaction.signatures[0],
//     sender: tx.transaction.message.accountKeys[0].toBase58(),
//     amount: (tx.meta.postBalances[0] - tx.meta.preBalances[0]) / 1e9, // Convert lamports to SOL
//     status: 'completed', // You can add logic to determine the status
//     timestamp: new Date(tx.blockTime * 1000).toISOString(),
//   }));
// }

async function fetchTransactions(): Promise<Transaction[]> {
  // Simulating API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock data with amounts in both ETH and USD
  return [
    { id: '1', sender: '0x1234...5678', amount: 0.5, amountUSD: 1000, status: 'completed', timestamp: '2023-05-15T10:30:00Z' },
    { id: '2', sender: '0x8765...4321', amount: 1.2, amountUSD: 2400, status: 'pending', timestamp: '2023-05-15T11:45:00Z' },
    { id: '3', sender: '0x2468...1357', amount: 0.8, amountUSD: 1600, status: 'completed', timestamp: '2023-05-15T09:15:00Z' },
    { id: '4', sender: '0x9876...5432', amount: 2.0, amountUSD: 4000, status: 'refunded', timestamp: '2023-05-14T16:20:00Z' },
    { id: '5', sender: '0x3456...7890', amount: 1.5, amountUSD: 3000, status: 'pending', timestamp: '2023-05-14T14:55:00Z' },
    { id: '6', sender: '0x1234...ABCD', amount: 0.3, amountUSD: 600, status: 'failed', timestamp: '2023-05-13T12:00:00Z' },
    { id: '7', sender: '0xDEAD...BEEF', amount: 2.5, amountUSD: 5000, status: 'failed', timestamp: '2023-05-13T08:45:00Z' },
    { id: '8', sender: '0xFEED...1234', amount: 0.9, amountUSD: 1800, status: 'completed', timestamp: '2023-05-12T19:20:00Z' },
    { id: '9', sender: '0xBEEF...CAFE', amount: 1.8, amountUSD: 3600, status: 'refunded', timestamp: '2023-05-12T15:30:00Z' },
    { id: '10', sender: '0xAAAA...BBBB', amount: 0.7, amountUSD: 1400, status: 'pending', timestamp: '2023-05-12T13:10:00Z' },
    { id: '11', sender: '0x9999...8888', amount: 3.0, amountUSD: 6000, status: 'failed', timestamp: '2023-05-11T11:05:00Z' },
    { id: '12', sender: '0x6666...7777', amount: 1.1, amountUSD: 2200, status: 'completed', timestamp: '2023-05-10T09:30:00Z' },
  ]
}



export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const { toast } = useToast()

  const loadTransactions = async () => {
    setIsLoading(true)
    console.log('Loading transactions...')
    try {
      const data = await fetchTransactions()
      console.log('Transactions loaded:', data)
      setTransactions(data)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      toast({
        title: "Error",
        description: "Failed to load transactions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  // const handleRefund = (transaction: Transaction) => {
  //   setSelectedTransaction(transaction)
  //   setIsRefundModalOpen(true)
  // }

  const confirmRefund = async (passGasFees: boolean) => {
    if (selectedTransaction) {
      // Here we'll' make an API call to process the refund
      // For now, we'll just update the local state
      setTransactions(prevTransactions =>
        prevTransactions.map(t =>
          t.id === selectedTransaction.id ? { ...t, status: 'refunded' } : t
        )
      )
      setIsRefundModalOpen(false)
      toast({
        title: "Refund Successful",
        description: `Transaction ${selectedTransaction.id} has been refunded.${passGasFees ? ' Gas fees passed to the user.' : ''}`,
      })
    }
  }

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
