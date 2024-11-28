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
  status: 'pending' | 'completed' | 'refunded'
  timestamp: string
}

// This function will be replaced with an actual API call
async function fetchTransactions(): Promise<Transaction[]> {
  // Simulating API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // This is where you'd make your actual API call
  // return await fetch('/api/transactions').then(res => res.json())
  
  // For now, we'll return mock data
  return [
    { id: '1', sender: '0x1234...5678', amount: 0.5, status: 'completed', timestamp: '2023-05-15T10:30:00Z' },
    { id: '2', sender: '0x8765...4321', amount: 1.2, status: 'pending', timestamp: '2023-05-15T11:45:00Z' },
    { id: '3', sender: '0x2468...1357', amount: 0.8, status: 'completed', timestamp: '2023-05-15T09:15:00Z' },
    { id: '4', sender: '0x9876...5432', amount: 2.0, status: 'refunded', timestamp: '2023-05-14T16:20:00Z' },
    { id: '5', sender: '0x3456...7890', amount: 1.5, status: 'pending', timestamp: '2023-05-14T14:55:00Z' },
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
    try {
      const data = await fetchTransactions()
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

