import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

type RefundModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: (passGasFees: boolean) => void
  transaction: { id: string; amount: number; amountUSD: number; timestamp: string } | null
}

export default function RefundModal({ isOpen, onClose, onConfirm, transaction }: RefundModalProps) {
  const [passGasFees, setPassGasFees] = useState(false)

  const handleConfirm = () => {
    onConfirm(passGasFees)
    setPassGasFees(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Refund</DialogTitle>
        </DialogHeader>
        <Card>
          <CardContent className="pt-6">
            <p>Are you sure you want to refund this transaction?</p>
            {transaction && (
              <div className="mt-2">
                <p>Transaction ID: {transaction.id}</p>
                <p>Amount: {transaction.amount} SOL</p>
                <p>AmountUSD: {transaction.amountUSD} SOL</p>
                <p>Date: {formatDate(transaction.timestamp)}</p>
              </div>
            )}
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox id="passGasFees" checked={passGasFees} onCheckedChange={(checked) => setPassGasFees(checked as boolean)} />
              <Label htmlFor="passGasFees">Pass gas fees to the user</Label>
            </div>
          </CardContent>
        </Card>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm Refund</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

