import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';

export type ExpenseRow = Database['public']['Tables']['expenses']['Row'];

export interface BudgetBreakdown {
  totalBudget: number;
  currency: string;
  totalExpenses: number;
  totalActivitiesCost: number;
  totalSpent: number;
  remainingBudget: number;
  percentageUsed: number;
  tripDaysCount: number;
  averageCostPerDay: number;
  isOverBudget: boolean;
  categories: {
    name: string;
    key: string;
    amount: number;
    percentage: number;
    color: string;
  }[];
  expenses: ExpenseRow[];
}

export async function fetchTripExpenses(tripId: string): Promise<{ data: ExpenseRow[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('trip_id', tripId)
      .order('expense_date', { ascending: false });

    if (error) return { data: [], error: error.message };
    return { data: data || [], error: null };
  } catch (err: any) {
    return { data: [], error: err.message || 'Failed to fetch expenses' };
  }
}

export async function createExpense(
  tripId: string,
  expense: {
    category: string;
    amount: number;
    description?: string;
    expenseDate?: string;
    currency?: string;
  }
): Promise<{ data: ExpenseRow | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        trip_id: tripId,
        category: expense.category.trim(),
        amount: expense.amount,
        description: expense.description?.trim() || null,
        expense_date: expense.expenseDate || new Date().toISOString().split('T')[0],
        currency: expense.currency || 'USD',
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to create expense' };
  }
}

export async function deleteExpense(expenseId: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId);

    if (error) return { error: error.message };
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to delete expense' };
  }
}

export function computeBudgetMetrics(
  totalBudget: number,
  currency: string,
  startDate: string,
  endDate: string,
  expenses: ExpenseRow[],
  activitiesCosts: { category: string; cost: number }[]
): BudgetBreakdown {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalActivitiesCost = activitiesCosts.reduce((sum, a) => sum + Number(a.cost || 0), 0);
  const totalSpent = totalExpenses + totalActivitiesCost;
  const remainingBudget = totalBudget - totalSpent;
  const percentageUsed = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 999) : 0;
  const isOverBudget = remainingBudget < 0;
  const averageCostPerDay = Math.round(totalSpent / diffDays);

  // Group by categories: transport, stay, activities, meals, misc
  const categoryTotals: Record<string, number> = {
    transport: 0,
    stay: 0,
    activities: totalActivitiesCost,
    meals: 0,
    misc: 0,
  };

  // Map expenses to canonical categories
  expenses.forEach((e) => {
    const c = (e.category || '').toLowerCase();
    if (c.includes('trans') || c.includes('flight') || c.includes('train') || c.includes('bus') || c.includes('car')) {
      categoryTotals.transport += Number(e.amount || 0);
    } else if (c.includes('stay') || c.includes('hotel') || c.includes('accom') || c.includes('hostel') || c.includes('airbnb')) {
      categoryTotals.stay += Number(e.amount || 0);
    } else if (c.includes('food') || c.includes('meal') || c.includes('din') || c.includes('drink') || c.includes('restau')) {
      categoryTotals.meals += Number(e.amount || 0);
    } else if (c.includes('act') || c.includes('tour') || c.includes('ticket') || c.includes('museum')) {
      categoryTotals.activities += Number(e.amount || 0);
    } else {
      categoryTotals.misc += Number(e.amount || 0);
    }
  });

  const grandTotalCategorySum = Object.values(categoryTotals).reduce((a, b) => a + b, 0) || 1;

  const categoryConfigs = [
    { key: 'transport', name: 'Transport & Flights', color: 'bg-cyan-500' },
    { key: 'stay', name: 'Accommodation & Stay', color: 'bg-blue-600' },
    { key: 'activities', name: 'Activities & Tours', color: 'bg-indigo-500' },
    { key: 'meals', name: 'Food & Dining', color: 'bg-amber-500' },
    { key: 'misc', name: 'Shopping & Misc', color: 'bg-purple-500' },
  ];

  const categories = categoryConfigs.map((cfg) => {
    const amt = categoryTotals[cfg.key] || 0;
    const pct = totalSpent > 0 ? Math.round((amt / grandTotalCategorySum) * 100) : 0;
    return {
      name: cfg.name,
      key: cfg.key,
      amount: amt,
      percentage: pct,
      color: cfg.color,
    };
  });

  return {
    totalBudget,
    currency,
    totalExpenses,
    totalActivitiesCost,
    totalSpent,
    remainingBudget,
    percentageUsed,
    tripDaysCount: diffDays,
    averageCostPerDay,
    isOverBudget,
    categories,
    expenses,
  };
}
