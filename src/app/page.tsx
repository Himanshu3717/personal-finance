'use client';

import { useState, useEffect } from 'react';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyExpenseChart from '@/components/MonthlyExpenseChart';
import { Toaster } from "sonner";

// Define the transaction type
interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  createdAt?: string;
}

export default function Home() {
  // Explicitly type the state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await response.json();
      setTransactions(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleTransactionAdded = (newTransaction: Transaction) => {
    if (transactionToEdit) {
      // Update existing transaction
      setTransactions(prevTransactions => 
        prevTransactions.map(t => t._id === newTransaction._id ? newTransaction : t)
      );
      setTransactionToEdit(null);
    } else {
      // Add new transaction
      setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }
      
      setTransactions(prevTransactions => 
        prevTransactions.filter(transaction => transaction._id !== id)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Personal Finance Visualizer</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Error: {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <TransactionForm 
            onTransactionAdded={handleTransactionAdded} 
            transactionToEdit={transactionToEdit} 
          />
        </div>
        
        <div className="lg:col-span-2">
          <MonthlyExpenseChart transactions={transactions} />
        </div>
      </div>
      
      <div className="mb-8">
        <TransactionList 
          transactions={transactions} 
          onEdit={handleEditTransaction} 
          onDelete={handleDeleteTransaction} 
          isLoading={isLoading} 
        />
      </div>
      
      <Toaster />
    </main>
  );
}