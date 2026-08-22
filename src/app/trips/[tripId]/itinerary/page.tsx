'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Plus, ListChecks, ArrowLeft, Clock, MapPin, DollarSign, Trash2, Calendar, Sparkles } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { TripSidebar } from '@/components/layout/Sidebar';
import { LoadingState } from '@/components/layout/LoadingState';
import { EmptyState } from '@/components/layout/EmptyState';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { AddStopModal } from '@/components/itinerary/AddStopModal';
import { AddActivityModal } from '@/components/itinerary/AddActivityModal';
import { fetchTripById, FormattedTrip } from '@/lib/api/trips';
import { fetchTripStopsWithDetails, removeActivityFromStop, EnrichedTripStop } from '@/lib/api/itinerary';

export default function TripItineraryPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const resolvedParams = use(params);
  const tripId = resolvedParams.tripId;

  const [trip, setTrip] = useState<FormattedTrip | null>(null);
  const [stops, setStops] = useState<EnrichedTripStop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [activeStopForActivity, setActiveStopForActivity] = useState<EnrichedTripStop | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    const [tripRes, stopsRes] = await Promise.all([
      fetchTripById(tripId),
      fetchTripStopsWithDetails(tripId),
    ]);

    if (tripRes.error || !tripRes.data) {
      setError(tripRes.error || 'Trip not found or unauthorized.');
    } else {
      setTrip(tripRes.data);
      setStops(stopsRes.data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [tripId]);

  const handleRemoveActivity = async (activityAssignmentId: string, activityName: string) => {
    if (confirm(`Remove "${activityName}" from itinerary?`)) {
      const { error: remErr } = await removeActivityFromStop(activityAssignmentId);
      if (remErr) {
        alert(`Failed to remove activity: ${remErr}`);
      } else {
        loadData();
      }
    }
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <PageContainer>
          <div className="py-20">
            <LoadingState message="Loading your daily itinerary..." />
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
            title="Trip Not Found"
            description={error || 'Unable to access itinerary.'}
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

  // Calculate totals
  const totalActivities = stops.reduce((sum, s) => sum + (s.trip_activities?.length || 0), 0);
  const totalEstimatedCost = stops.reduce((sum, s) => {
    return (
      sum +
      (s.trip_activities || []).reduce((actSum, a) => {
        const cost = a.actual_cost !== null && a.actual_cost !== undefined ? Number(a.actual_cost) : Number(a.activity?.estimated_cost || 0);
        return actSum + cost;
      }, 0)
    );
  }, 0);

  return (
    <AuthGuard>
      <PageContainer>
        <PageHeader
          title={`${trip.name} — Itinerary Planner`}
          description={`${trip.startDate} to ${trip.endDate} • ${stops.length} Stops • ${totalActivities} Activities`}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Trips', href: '/trips' },
            { label: trip.name, href: `/trips/${trip.id}` },
            { label: 'Itinerary' },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm" onClick={() => setIsAddStopOpen(true)}>
                <Plus className="h-4 w-4" />
                Add City Stop
              </Button>
            </div>
          }
        />

        <div className="flex flex-col md:flex-row gap-8">
          <TripSidebar tripId={trip.id} tripTitle={trip.name} />

          <div className="flex-1 space-y-6">
            {/* Itinerary Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-4 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Destination Stops</span>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {stops.length} Cities
                </p>
              </Card>
              <Card className="p-4 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Scheduled Activities</span>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {totalActivities} Events
                </p>
              </Card>
              <Card className="p-4 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Total Activity Cost</span>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  ${totalEstimatedCost.toLocaleString()}
                </p>
              </Card>
            </div>

            {/* Stops and Activities Timeline */}
            {stops.length === 0 ? (
              <EmptyState
                icon={<ListChecks className="h-8 w-8" />}
                title="Your itinerary is currently empty"
                description="Add your first city stop to begin scheduling curated sights, food walks, and tours."
                action={
                  <Button variant="primary" onClick={() => setIsAddStopOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Add First City Stop
                  </Button>
                }
              />
            ) : (
              <div className="space-y-6">
                {stops.map((stop) => (
                  <Card key={stop.id} className="overflow-hidden border border-slate-200 dark:border-slate-800 p-0">
                    {/* Stop Header Banner */}
                    <div className="bg-slate-900 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white text-sm shrink-0">
                          {stop.stop_order}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">{stop.city?.name}</h3>
                            <span className="text-xs text-slate-400">({stop.city?.country})</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5">
                            {stop.start_date} to {stop.end_date}
                            {stop.notes && ` • ${stop.notes}`}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white border-none shrink-0"
                        onClick={() => setActiveStopForActivity(stop)}
                      >
                        <Plus className="h-4 w-4" />
                        Add Activity in {stop.city?.name}
                      </Button>
                    </div>

                    {/* Scheduled Activities List */}
                    <div className="p-5 space-y-3">
                      {stop.trip_activities.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                          No activities scheduled for {stop.city?.name} yet. Click &quot;Add Activity&quot; above to explore options.
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                          {stop.trip_activities.map((actItem, actIdx) => {
                            const act = actItem.activity;
                            const cost = actItem.actual_cost !== null && actItem.actual_cost !== undefined ? actItem.actual_cost : act?.estimated_cost || 0;
                            return (
                              <div
                                key={actItem.id}
                                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                                      {act?.name || 'Custom Activity'}
                                    </span>
                                    {act?.category && (
                                      <Badge variant="accent" size="sm" className="capitalize">
                                        {act.category}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                    {actItem.activity_date && (
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {actItem.activity_date}
                                      </span>
                                    )}
                                    {actItem.start_time && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {actItem.start_time}
                                        {actItem.end_time ? ` - ${actItem.end_time}` : ''}
                                      </span>
                                    )}
                                    {act?.duration_minutes && (
                                      <span>({act.duration_minutes} mins)</span>
                                    )}
                                    {actItem.notes && (
                                      <span className="text-slate-600 dark:text-slate-400 italic">
                                        &quot;{actItem.notes}&quot;
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                    ${cost}
                                  </span>
                                  <button
                                    onClick={() => handleRemoveActivity(actItem.id, act?.name || 'Activity')}
                                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                                    title="Remove Activity"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
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
          onStopAdded={loadData}
        />

        {/* Add Activity Modal */}
        {activeStopForActivity && (
          <AddActivityModal
            isOpen={!!activeStopForActivity}
            onClose={() => setActiveStopForActivity(null)}
            tripStopId={activeStopForActivity.id}
            cityName={activeStopForActivity.city?.name || 'City'}
            cityId={activeStopForActivity.city_id}
            stopStartDate={activeStopForActivity.start_date}
            stopEndDate={activeStopForActivity.end_date}
            onActivityAdded={loadData}
          />
        )}
      </PageContainer>
    </AuthGuard>
  );
}
