import TransactionList from './components/transaction-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Crypto Payment Transactions</CardTitle>
          <CardDescription>Manage and view your crypto payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionList />
        </CardContent>
      </Card>
    </main>
  )
}

