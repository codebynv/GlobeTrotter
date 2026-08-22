'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { DollarSign, Plus, ArrowLeft, Trash2, AlertTriangle, CheckCircle2, TrendingUp, PieChart } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { TripSidebar } from '@/components/layout/Sidebar';
import { LoadingState } from '@/components/layout/LoadingState';
import { EmptyState } from '@/components/layout/EmptyState';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { AddExpenseModal } from '@/components/budget/AddExpenseModal';
import { fetchTripById, FormattedTrip } from '@/lib/api/trips';
import { fetchTripStopsWithDetails } from '@/lib/api/itinerary';
import { fetchTripExpenses, deleteExpense, computeBudgetMetrics, BudgetBreakdown } from '@/lib/api/budget';

export default function TripBudgetPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const resolvedParams = use(params);
  const tripId = resolvedParams.tripId;

  const [trip, setTrip] = useState<FormattedTrip | null>(null);
  const [budgetData, setBudgetData] = useState<BudgetBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const loadBudgetData = async () => {
    setIsLoading(true);
    setError(null);
    const [tripRes, stopsRes, expRes] = await Promise.all([
      fetchTripById(tripId),
      fetchTripStopsWithDetails(tripId),
      fetchTripExpenses(tripId),
    ]);

    if (tripRes.error || !tripRes.data) {
      setError(tripRes.error || 'Trip not found or unauthorized.');
      setIsLoading(false);
      return;
    }

    setTrip(tripRes.data);

    // Extract activities costs
    const actCosts: { category: string; cost: number }[] = [];
    (stopsRes.data || []).forEach((stop) => {
      (stop.trip_activities || []).forEach((ta) => {
        const cost = ta.actual_cost !== null && ta.actual_cost !== undefined ? Number(ta.actual_cost) : Number(ta.activity?.estimated_cost || 0);
        actCosts.push({
          category: ta.activity?.category || 'activities',
          cost,
        });
      });
    });

    const metrics = computeBudgetMetrics(
      tripRes.data.budget,
      tripRes.data.currency,
      tripRes.data.startDate,
      tripRes.data.endDate,
      expRes.data || [],
      actCosts
    );

    setBudgetData(metrics);
    setIsLoading(false);
  };

  useEffect(() => {
    loadBudgetData();
  }, [tripId]);

  const handleDeleteExpense = async (expId: string, desc: string) => {
    if (confirm(`Delete recorded expense "${desc}"?`)) {
      const { error: delErr } = await deleteExpense(expId);
      if (delErr) {
        alert(`Failed to delete expense: ${delErr}`);
      } else {
        loadBudgetData();
      }
    }
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <PageContainer>
          <div className="py-20">
            <LoadingState message="Calculating trip budget analytics..." />
          </div>
        </PageContainer>
      </AuthGuard>
    );
  }

  if (error || !trip || !budgetData) {
    return (
      <AuthGuard>
        <PageContainer>
          <EmptyState
            title="Trip Not Found"
            description={error || 'Unable to access budget.'}
            action={
              <Link href="/trips">
                <Button variant="primary">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Trips
                </Button>
              </Link>
            }
          />
        </PageContainer>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <PageContainer>
        <PageHeader
          title={`${trip.name} — Budget & Expenses`}
          description={`Track expenses, compare with planned target of ${trip.currency} $${trip.budget.toLocaleString()}, and control costs.`}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Trips', href: '/trips' },
            { label: trip.name, href: `/trips/${trip.id}` },
            { label: 'Budget Planner' },
          ]}
          actions={
            <Button variant="primary" size="sm" onClick={() => setIsAddExpenseOpen(true)}>
              <Plus className="h-4 w-4" />
              Log Expense
            </Button>
          }
        />

        <div className="flex flex-col md:flex-row gap-8">
          <TripSidebar tripId={trip.id} tripTitle={trip.name} />

          <div className="flex-1 space-y-6">
            {/* Over Budget Warning Banner */}
            {budgetData.isOverBudget && (
              <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
                <div>
                  <p className="font-semibold">Over Budget Alert</p>
                  <p className="text-xs mt-0.5">
                    Your scheduled activities and recorded expenses exceed your planned budget by{' '}
                    <span className="font-bold">
                      {budgetData.currency} ${Math.abs(budgetData.remainingBudget).toLocaleString()}
                    </span>.
                  </p>
                </div>
              </div>
            )}

            {/* Budget Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="p-4 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-medium">Total Target Budget</span>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  ${budgetData.totalBudget.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-400">{budgetData.currency}</span>
              </Card>

              <Card className="p-4 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-medium">Total Spent / Allocated</span>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  ${budgetData.totalSpent.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-500">{budgetData.percentageUsed}% of budget</span>
              </Card>

              <Card className="p-4 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-medium">Remaining Funds</span>
                <p
                  className={`text-xl font-bold mt-1 ${
                    budgetData.isOverBudget ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  ${budgetData.remainingBudget.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-500">
                  {budgetData.isOverBudget ? 'Deficit' : 'Available'}
                </span>
              </Card>

              <Card className="p-4 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-medium">Avg Cost / Day</span>
                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                  ${budgetData.averageCostPerDay}
                </p>
                <span className="text-[11px] text-slate-500">{budgetData.tripDaysCount} days total</span>
              </Card>
            </div>

            {/* Category Breakdown Progress */}
            <Card className="p-6 border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                    Category Breakdown
                  </h3>
                  <p className="text-xs text-slate-500">
                    Distribution between stays, transport, dining, and scheduled activities
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <PieChart className="h-4 w-4 text-blue-600" />
                  <span>{budgetData.percentageUsed}% Budget Allocated</span>
                </div>
              </div>

              {/* Progress visual bar */}
              <div className="h-3.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 flex">
                {budgetData.categories.map((cat) =>
                  cat.amount > 0 ? (
                    <div
                      key={cat.key}
                      style={{ width: `${cat.percentage}%` }}
                      className={`${cat.color} h-full transition-all`}
                      title={`${cat.name}: $${cat.amount} (${cat.percentage}%)`}
                    />
                  ) : null
                )}
              </div>

              {/* Category details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {budgetData.categories.map((cat) => (
                  <div
                    key={cat.key}
                    className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-3 w-3 rounded-full ${cat.color}`} />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
                    </div>
                    <div className="text-right text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-100">${cat.amount}</span>
                      <span className="text-[11px] text-slate-400 ml-1.5">({cat.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recorded Expenses Table */}
            <Card className="p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Itemized Expenses Log</h3>
                  <p className="text-xs text-slate-500">Manual expenses logged for this journey</p>
                </div>
                <Button size="sm" variant="primary" onClick={() => setIsAddExpenseOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Log Expense
                </Button>
              </div>

              {budgetData.expenses.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No manual expenses logged yet. Click &quot;Log Expense&quot; to track accommodations, transport tickets, or meals.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {budgetData.expenses.map((expense) => (
                    <div key={expense.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {expense.description}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">
                          {expense.category} • {expense.expense_date}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          ${expense.amount}
                        </span>
                        <button
                          onClick={() => handleDeleteExpense(expense.id, expense.description || 'Expense')}
                          className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Delete Expense"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Add Expense Modal */}
        <AddExpenseModal
          isOpen={isAddExpenseOpen}
          onClose={() => setIsAddExpenseOpen(false)}
          tripId={trip.id}
          currency={trip.currency}
          defaultDate={trip.startDate}
          onExpenseAdded={loadBudgetData}
        />
      </PageContainer>
    </AuthGuard>
  );
}
