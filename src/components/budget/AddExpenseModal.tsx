'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Tag, Calendar, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { createExpense } from '@/lib/api/budget';

export interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  currency: string;
  defaultDate?: string;
  onExpenseAdded: () => void;
}

export function AddExpenseModal({
  isOpen,
  onClose,
  tripId,
  currency,
  defaultDate,
  onExpenseAdded,
}: AddExpenseModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('stay');
  const [expenseDate, setExpenseDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { value: 'stay', label: 'Stay & Accommodation' },
    { value: 'transport', label: 'Transport & Flights' },
    { value: 'activities', label: 'Activities & Sightseeing' },
    { value: 'meals', label: 'Meals & Food' },
    { value: 'misc', label: 'Shopping & Miscellaneous' },
  ];

  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setAmount('');
      setCategory('stay');
      setExpenseDate(defaultDate || new Date().toISOString().split('T')[0]);
      setError(null);
    }
  }, [isOpen, defaultDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numAmount = Number(amount);
    if (!description.trim() || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a description and a valid positive amount.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: expError } = await createExpense(tripId, {
        category,
        amount: numAmount,
        description,
        expenseDate,
        currency,
      });

      if (expError) {
        setError(expError);
      } else {
        onExpenseAdded();
        onClose();
      }
    } catch {
      setError('Failed to record expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Trip Expense" maxWidth="md">
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Expense Item / Description"
          placeholder="e.g., Hotel 3 nights in Tokyo or JR Shinkansen ticket"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label={`Amount (${currency})`}
            type="number"
            placeholder="150"
            step="any"
            icon={<DollarSign className="h-4 w-4" />}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Date of Expense"
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          required
        />

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Log Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
}
