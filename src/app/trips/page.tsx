'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Compass, AlertCircle } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { TripCard } from '@/components/trips/TripCard';
import { EmptyState } from '@/components/layout/EmptyState';
import { LoadingState } from '@/components/layout/LoadingState';
import { Button } from '@/components/ui/Button';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { fetchUserTrips, deleteTrip, FormattedTrip } from '@/lib/api/trips';

export default function TripsPage() {
  const { user } = useAuth();
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

  return (
    <AuthGuard>
      <PageContainer>
        <PageHeader
          title="My Trips"
          description="Manage your ongoing and upcoming multi-destination itineraries."
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Trips' }]}
          actions={
            <Link href="/trips/new">
              <Button variant="primary">
                <Plus className="h-4 w-4" />
                New Trip
              </Button>
            </Link>
          }
        />

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="py-16">
            <LoadingState message="Loading your travel plans..." />
          </div>
        ) : trips.length === 0 ? (
          <EmptyState
            icon={<Compass className="h-8 w-8" />}
            title="No trips found"
            description="You haven't planned any trips yet. Create a trip to organize cities, dates, and budgets."
            action={
              <Link href="/trips/new">
                <Button variant="primary">
                  <Plus className="h-4 w-4" />
                  Create New Trip
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip} />
            ))}
          </div>
        )}
      </PageContainer>
    </AuthGuard>
  );
}
