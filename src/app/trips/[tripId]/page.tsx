'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Share2, Plus, ListChecks, Globe, Lock, AlertCircle, ArrowLeft, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { TripSidebar } from '@/components/layout/Sidebar';
import { LoadingState } from '@/components/layout/LoadingState';
import { EmptyState } from '@/components/layout/EmptyState';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { AddStopModal } from '@/components/itinerary/AddStopModal';
import { ShareTripModal } from '@/components/sharing/ShareTripModal';
import { fetchTripById, FormattedTrip } from '@/lib/api/trips';
import { fetchTripStopsWithDetails, deleteTripStop, swapTripStopOrder, EnrichedTripStop } from '@/lib/api/itinerary';
import { fetchTripExpenses } from '@/lib/api/budget';
import { analyzeTripHealth, TripHealthReport } from '@/lib/intelligence/tripHealth';
import { TripIntelligenceCard } from '@/components/intelligence/TripIntelligenceCard';

export default function TripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const resolvedParams = use(params);
  const tripId = resolvedParams.tripId;

  const [trip, setTrip] = useState<FormattedTrip | null>(null);
  const [stops, setStops] = useState<EnrichedTripStop[]>([]);
  const [healthReport, setHealthReport] = useState<TripHealthReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const loadTripData = async () => {
    setIsLoading(true);
    setError(null);
    const [tripRes, stopsRes, expensesRes] = await Promise.all([
      fetchTripById(tripId),
      fetchTripStopsWithDetails(tripId),
      fetchTripExpenses(tripId),
    ]);

    if (tripRes.error || !tripRes.data) {
      setError(tripRes.error || 'Trip not found or unauthorized.');
    } else {
      setTrip(tripRes.data);
      setStops(stopsRes.data || []);
      const report = analyzeTripHealth(tripRes.data, stopsRes.data || [], expensesRes.data || []);
      setHealthReport(report);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadTripData();
  }, [tripId]);

  const handleDeleteStop = async (stopId: string, cityName: string) => {
    if (confirm(`Remove ${cityName} from this trip? All scheduled activities in this stop will also be removed.`)) {
      const { error: delErr } = await deleteTripStop(stopId);
      if (delErr) {
        alert(`Failed to delete stop: ${delErr}`);
      } else {
        loadTripData();
      }
    }
  };

  const handleMoveStop = async (currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= stops.length) return;

    const stopA = { id: stops[currentIndex].id, order: stops[currentIndex].stop_order };
    const stopB = { id: stops[targetIndex].id, order: stops[targetIndex].stop_order };

    const { error: swapErr } = await swapTripStopOrder(tripId, stopA, stopB);
    if (swapErr) {
      alert(`Could not reorder stops: ${swapErr}`);
    } else {
      loadTripData();
    }
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <PageContainer>
          <div className="py-20">
            <LoadingState message="Loading trip itinerary & stops..." />
          </div>
        </PageContainer>
      </AuthGuard>
    );
  }

  if (error || !trip) {
    return (
      <AuthGuard>
        <PageContainer>
          <EmptyState
            icon={<AlertCircle className="h-8 w-8 text-rose-500" />}
            title="Trip Not Accessible"
            description={error || 'The requested trip could not be found or you do not have permission to view it.'}
            action={
              <Link href="/trips">
                <Button variant="primary">
                  <ArrowLeft className="h-4 w-4" />
                  Back to My Trips
                </Button>
              </Link>
            }
          />
        </PageContainer>
      </AuthGuard>
    );
  }

  const statusVariants: Record<FormattedTrip['status'], 'primary' | 'success' | 'warning' | 'secondary'> = {
    planning: 'secondary',
    upcoming: 'primary',
    ongoing: 'success',
    completed: 'secondary',
  };

  const totalActivities = stops.reduce((sum, s) => sum + (s.trip_activities?.length || 0), 0);

  return (
    <AuthGuard>
      <PageContainer>
        <PageHeader
          title={trip.name}
          description={`${trip.startDate} to ${trip.endDate}`}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Trips', href: '/trips' },
            { label: trip.name },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsShareOpen(true)}>
                <Share2 className="h-4 w-4" />
                Share Trip
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsAddStopOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Stop
              </Button>
              <Link href={`/trips/${trip.id}/itinerary`}>
                <Button variant="primary" size="sm">
                  <ListChecks className="h-4 w-4" />
                  Open Itinerary
                </Button>
              </Link>
            </div>
          }
        />

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <TripSidebar tripId={trip.id} tripTitle={trip.name} />

          {/* Content area */}
          <div className="flex-1 space-y-6">
            {healthReport && (
              <TripIntelligenceCard report={healthReport} tripId={trip.id} />
            )}

            {/* Cover Hero Card */}
            <div
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 p-6 sm:p-8 text-white shadow-md"
              style={
                trip.coverImageUrl
                  ? {
                      backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.85)), url(${trip.coverImageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={statusVariants[trip.status]} className="bg-white/20 text-white border-white/30 backdrop-blur-md capitalize">
                  {trip.status}
                </Badge>
                {trip.isPublic ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-200">
                    <Globe className="h-3.5 w-3.5" /> Public Trip
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-slate-200">
                    <Lock className="h-3.5 w-3.5" /> Private Trip
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold">{trip.name}</h2>
              {trip.description && (
                <p className="mt-2 text-xs sm:text-sm text-blue-100 max-w-xl">
                  {trip.description}
                </p>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-4 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Target Budget</span>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {trip.currency} ${trip.budget.toLocaleString()}
                </p>
              </Card>
              <Card className="p-4 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Planned Stops</span>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {stops.length} {stops.length === 1 ? 'City' : 'Cities'}
                </p>
                <span className="text-[11px] text-slate-500">{totalActivities} scheduled activities</span>
              </Card>
              <Card className="p-4 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Travel Timeline</span>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {trip.startDate}
                </p>
                <span className="text-[11px] text-slate-500">to {trip.endDate}</span>
              </Card>
            </div>

            {/* Stops list with ordering controls */}
            <Card className="p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Multi-City Route Sequence</h3>
                  <p className="text-xs text-slate-500">Order of destination cities and duration for this journey</p>
                </div>
                <Button size="sm" variant="primary" onClick={() => setIsAddStopOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Add Stop
                </Button>
              </div>

              {stops.length === 0 ? (
                <EmptyState
                  icon={<MapPin className="h-6 w-6" />}
                  title="No destination stops added yet"
                  description="Add your first city stop to build out your daily schedule and activities."
                  action={
                    <Button variant="primary" size="sm" onClick={() => setIsAddStopOpen(true)}>
                      <Plus className="h-4 w-4" />
                      Add Destination Stop
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {stops.map((stop, idx) => (
                    <div
                      key={stop.id}
                      className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-100 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white text-xs shrink-0">
                          {stop.stop_order}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                              {stop.city?.name}
                            </h4>
                            <span className="text-xs text-slate-500">({stop.city?.country})</span>
                            <Badge variant="secondary" size="sm">
                              {stop.trip_activities?.length || 0} activities
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {stop.start_date} to {stop.end_date}
                            {stop.notes && ` • ${stop.notes}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleMoveStop(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          title="Move Stop Up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveStop(idx, 'down')}
                          disabled={idx === stops.length - 1}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          title="Move Stop Down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStop(stop.id, stop.city?.name || 'this stop')}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          title="Delete Stop"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Add Stop Modal */}
        <AddStopModal
          isOpen={isAddStopOpen}
          onClose={() => setIsAddStopOpen(false)}
          tripId={trip.id}
          tripStartDate={trip.startDate}
          tripEndDate={trip.endDate}
          existingCityIds={stops.map((s) => s.city_id)}
          onStopAdded={loadTripData}
        />

        {/* Share Trip Modal */}
        <ShareTripModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          tripId={trip.id}
          tripName={trip.name}
        />
      </PageContainer>
    </AuthGuard>
  );
}
