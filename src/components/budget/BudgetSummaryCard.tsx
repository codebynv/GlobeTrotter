import React from 'react';
import { DollarSign, TrendingUp, AlertCircle, PieChart } from 'lucide-react';
import { Card } from '../ui/Card';

export interface BudgetSummaryProps {
  totalBudget: number;
  totalSpent: number;
  categories?: { name: string; amount: number; percentage: number; color: string }[];
}

export function BudgetSummaryCard({
  totalBudget,
  totalSpent,
  categories = [
    { name: 'Accommodation', amount: 850, percentage: 40, color: 'bg-blue-500' },
    { name: 'Transport', amount: 420, percentage: 20, color: 'bg-cyan-500' },
    { name: 'Food & Dining', amount: 530, percentage: 25, color: 'bg-indigo-500' },
    { name: 'Activities', amount: 300, percentage: 15, color: 'bg-violet-500' },
  ],
}: BudgetSummaryProps) {
  const remaining = totalBudget - totalSpent;
  const percentUsed = Math.min(Math.round((totalSpent / totalBudget) * 100), 100);

  return (
    <Card className="space-y-6 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Budget Analytics</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track and manage spending across stops</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
          <PieChart className="h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
          <p className="text-xs text-slate-500">Total Budget</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">${totalBudget.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
          <p className="text-xs text-slate-500">Spent / Allocated</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">${totalSpent.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
          <p className="text-xs text-slate-500">Remaining</p>
          <p className={`text-lg font-bold ${remaining < 0 ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
            ${remaining.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
          <span>Budget Utilization</span>
          <span>{percentUsed}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 flex">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              style={{ width: `${cat.percentage}%` }}
              className={`${cat.color} h-full transition-all`}
              title={`${cat.name}: $${cat.amount}`}
            />
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="space-y-2.5 pt-2">
        {categories.map((cat, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${cat.color}`} />
              <span className="text-slate-700 dark:text-slate-300">{cat.name}</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">${cat.amount}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
