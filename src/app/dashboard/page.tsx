'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Map, Calendar, DollarSign, ArrowRight, Compass, Sparkles, AlertCircle } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { TripCard } from '@/components/trips/TripCard';
import { EmptyState } from '@/components/layout/EmptyState';
import { LoadingState } from '@/components/layout/LoadingState';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { fetchUserTrips, deleteTrip, FormattedTrip } from '@/lib/api/trips';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [trips, setTrips] = useState<FormattedTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrips = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    const { data, error: tripErr } = await fetchUserTrips(user.id);
    if (tripErr) {
      setError(tripErr);
    } else {
      setTrips(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadTrips();
  }, [user]);

  const handleDeleteTrip = async (tripId: string) => {
    const { error: delErr } = await deleteTrip(tripId);
    if (delErr) {
      alert(`Could not delete trip: ${delErr}`);
    } else {
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    }
  };

  const totalBudget = trips.reduce((acc, t) => acc + (t.budget || 0), 0);
  const upcomingTripsCount = trips.filter((t) => t.status === 'upcoming' || t.status === 'planning' || t.status === 'ongoing').length;

  return (
    <AuthGuard>
      <PageContainer>
        <PageHeader
          title={`Welcome back, ${profile?.name || user?.email?.split('@')[0] || 'Traveler'}`}
          description="Overview of your active trip plans, destinations, and itinerary milestones."
          actions={
            <Link href="/trips/new">
              <Button variant="primary">
                <Plus className="h-4 w-4" />
                New Trip Plan
              </Button>
            </Link>
          }
        />

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>Failed to load trips: {error}</span>
          </div>
        )}

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="flex items-center gap-4 p-5 border border-slate-200 dark:border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Map className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Trips</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{trips.length} Created</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4 p-5 border border-slate-200 dark:border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Active / Upcoming</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{upcomingTripsCount} Active</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4 p-5 border border-slate-200 dark:border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Planned Budget</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                ${totalBudget.toLocaleString()}
              </p>
            </div>
          </Card>
        </div>

        {/* Trips Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Your Journeys</h2>
            {trips.length > 0 && (
              <Link href="/trips" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All Trips <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="py-12">
              <LoadingState message="Loading your trips..." />
            </div>
          ) : trips.length === 0 ? (
            <EmptyState
              icon={<Compass className="h-8 w-8" />}
              title="No trips created yet"
              description="Start mapping out your next multi-destination adventure with custom itineraries and budget tracking."
              action={
                <Link href="/trips/new">
                  <Button variant="primary">
                    <Plus className="h-4 w-4" />
                    Create Your First Trip
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip} />
              ))}
              <Link
                href="/trips/new"
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center hover:border-blue-500/50 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all min-h-[280px]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-3">
                  <Plus className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Create New Journey</p>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Add destinations, schedule days, and estimate budgets.
                </p>
              </Link>
            </div>
          )}
        </div>
      </PageContainer>
    </AuthGuard>
  );
}
