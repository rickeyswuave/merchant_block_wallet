"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from 'lucide-react'

type Transaction = {
  id: string
  sender: string
  amount: number
  amountUSD: number
  status: 'pending' | 'completed' | 'refunded' | 'failed'
  timestamp: string
}

export const columns = (
  setSelectedTransaction: (transaction: Transaction) => void,
  setIsRefundModalOpen: (isOpen: boolean) => void
): ColumnDef<Transaction>[] => [
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date/Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const timestamp = new Date(row.getValue("timestamp"))
      const formatted = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(timestamp)
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "sender",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sender
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount (Sol)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "Sol",
      }).format(amount)
 
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "amountUSD",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount (USD)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amountUSD = parseFloat(row.getValue("amountUSD"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amountUSD)

      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={
          status === 'completed' ? 'default' :
          status === 'pending' ? 'secondary' : 
          status === 'refunded' ? 'outline' : 'destructive'
        }>
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original
      return (
        <Button 
          onClick={() => {
            setSelectedTransaction(transaction)
            setIsRefundModalOpen(true)
          }} 
          disabled={transaction.status !== 'completed'}
        >
          Refund
        </Button>
      )
    },
  },
]

