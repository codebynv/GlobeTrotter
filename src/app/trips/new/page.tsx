'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, DollarSign, Image as ImageIcon, Globe, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { createTrip } from '@/lib/api/trips';

export default function NewTripPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [budget, setBudget] = useState('2500');
  const [currency, setCurrency] = useState('USD');
  const [isPublic, setIsPublic] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('You must be logged in to create a trip.');
      return;
    }

    if (!name.trim() || !startDate || !endDate) {
      setError('Please fill in the trip name, start date, and end date.');
      return;
    }

    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      setError('End date must be on or after start date.');
      return;
    }

    const numBudget = Number(budget);
    if (isNaN(numBudget) || numBudget < 0) {
      setError('Please enter a valid positive budget amount.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error: createError } = await createTrip(user.id, {
        name,
        description,
        startDate,
        endDate,
        budget: numBudget,
        currency,
        coverImageUrl: coverImageUrl.trim() || undefined,
        isPublic,
      });

      if (createError || !data) {
        setError(createError || 'Failed to create trip.');
      } else {
        router.push(`/trips/${data.id}`);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <PageContainer size="md">
        <PageHeader
          title="Create New Trip"
          description="Set up your destinations, dates, and spending parameters."
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Trips', href: '/trips' },
            { label: 'New Trip' },
          ]}
        />

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 sm:p-8 space-y-5 border border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Trip Overview</h2>

            <Input
              label="Trip Name"
              placeholder="e.g., Grand Japan Discovery or Summer in Scandinavia"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="w-full space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Description / Notes
              </label>
              <textarea
                rows={3}
                placeholder="What is the focus of this journey? (cultural exploration, culinary adventure, road trip...)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </Card>

          <Card className="p-6 sm:p-8 space-y-5 border border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Budget & Appearance</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Target Budget"
                  type="number"
                  placeholder="3500"
                  icon={<DollarSign className="h-4 w-4" />}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>
            </div>

            <Input
              label="Cover Image URL (Optional)"
              placeholder="https://images.unsplash.com/photo-..."
              icon={<ImageIcon className="h-4 w-4" />}
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              helperText="Paste a high-resolution Unsplash or travel photo URL to personalize your trip banner"
            />

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <div>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    {isPublic ? <Globe className="h-4 w-4 text-emerald-600" /> : <Lock className="h-4 w-4 text-slate-400" />}
                    {isPublic ? 'Public Trip (Discoverable)' : 'Private Trip (Only you & shared links)'}
                  </span>
                  <p className="text-xs text-slate-500">
                    {isPublic
                      ? 'Anyone with your link can view this itinerary.'
                      : 'Only you can view and edit this trip unless you generate a share link.'}
                  </p>
                </div>
              </label>
            </div>
          </Card>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Link href="/trips">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Create Trip & Proceed
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </form>
      </PageContainer>
    </AuthGuard>
  );
}
