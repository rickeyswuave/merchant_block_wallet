"use client";

import { useState, useEffect } from 'react';
import TransactionList from './components/transaction-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DisclaimerModal from './components/DisclaimerModal';

export default function Home() {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(true);

  useEffect(() => {
    // Show the disclaimer modal on application launch
    setIsDisclaimerOpen(true);
  }, []);

  const closeDisclaimer = () => {
    setIsDisclaimerOpen(false);
  };

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
      <DisclaimerModal isOpen={isDisclaimerOpen} onClose={closeDisclaimer} />
    </main>
  );
}