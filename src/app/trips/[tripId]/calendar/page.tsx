'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, Clock, MapPin, DollarSign, ArrowLeft, ChevronLeft, ChevronRight, ListChecks, CalendarDays, Plus } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { TripSidebar } from '@/components/layout/Sidebar';
import { LoadingState } from '@/components/layout/LoadingState';
import { EmptyState } from '@/components/layout/EmptyState';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { fetchTripById, FormattedTrip } from '@/lib/api/trips';
import { fetchTripStopsWithDetails, EnrichedTripStop, EnrichedTripActivity } from '@/lib/api/itinerary';

export default function TripCalendarPage({
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

  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Month navigation
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    const [tripRes, stopsRes] = await Promise.all([
      fetchTripById(tripId),
      fetchTripStopsWithDetails(tripId),
    ]);

    if (tripRes.error || !tripRes.data) {
      setError(tripRes.error || 'Trip not found or unauthorized.');
      setIsLoading(false);
      return;
    }

    setTrip(tripRes.data);
    setStops(stopsRes.data || []);
    setSelectedDate(tripRes.data.startDate);
    setCurrentMonthDate(new Date(tripRes.data.startDate));
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [tripId]);

  if (isLoading) {
    return (
      <AuthGuard>
        <PageContainer>
          <div className="py-20">
            <LoadingState message="Building timeline & calendar..." />
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
            description={error || 'Unable to access calendar.'}
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

  // Create a flattened map of date -> { stop: City, activities: EnrichedTripActivity[] }
  const dateScheduleMap: Record<
    string,
    {
      cityName: string;
      country: string;
      stopOrder: number;
      activities: EnrichedTripActivity[];
    }
  > = {};

  stops.forEach((stop) => {
    const sStart = new Date(stop.start_date);
    const sEnd = new Date(stop.end_date);
    for (let d = new Date(sStart); d <= sEnd; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      if (!dateScheduleMap[dateStr]) {
        dateScheduleMap[dateStr] = {
          cityName: stop.city?.name || 'Destination',
          country: stop.city?.country || '',
          stopOrder: stop.stop_order,
          activities: [],
        };
      }
    }

    // Attach activities
    (stop.trip_activities || []).forEach((ta) => {
      const actDate = ta.activity_date || stop.start_date;
      if (!dateScheduleMap[actDate]) {
        dateScheduleMap[actDate] = {
          cityName: stop.city?.name || 'Destination',
          country: stop.city?.country || '',
          stopOrder: stop.stop_order,
          activities: [],
        };
      }
      dateScheduleMap[actDate].activities.push(ta);
    });
  });

  // Calendar grid calculation for currentMonthDate
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const selectedDateSchedule = selectedDate ? dateScheduleMap[selectedDate] : null;

  return (
    <AuthGuard>
      <PageContainer>
        <PageHeader
          title={`${trip.name} — Schedule & Calendar`}
          description={`${trip.startDate} to ${trip.endDate} • Interactive visual timeline and daily events`}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Trips', href: '/trips' },
            { label: trip.name, href: `/trips/${trip.id}` },
            { label: 'Calendar' },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-750">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    viewMode === 'calendar'
                      ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  Calendar
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    viewMode === 'timeline'
                      ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <ListChecks className="h-3.5 w-3.5" />
                  Timeline
                </button>
              </div>

              <Link href={`/trips/${trip.id}/itinerary`}>
                <Button variant="primary" size="sm">
                  <Plus className="h-4 w-4" />
                  Add to Itinerary
                </Button>
              </Link>
            </div>
          }
        />

        <div className="flex flex-col md:flex-row gap-8">
          <TripSidebar tripId={trip.id} tripTitle={trip.name} />

          <div className="flex-1 space-y-6">
            {viewMode === 'calendar' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar month grid */}
                <Card className="lg:col-span-2 p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{monthName}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" className="p-2" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="p-2" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                      <div key={d} className="py-1">
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                      <div key={`empty-${i}`} className="min-h-[60px] rounded-xl p-1" />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                      const hasSchedule = !!dateScheduleMap[dateStr];
                      const isSelected = selectedDate === dateStr;
                      const isWithinTrip =
                        new Date(dateStr).getTime() >= new Date(trip.startDate).getTime() &&
                        new Date(dateStr).getTime() <= new Date(trip.endDate).getTime();

                      const actCount = dateScheduleMap[dateStr]?.activities.length || 0;

                      return (
                        <div
                          key={dateStr}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`min-h-[70px] sm:min-h-[80px] rounded-xl p-1.5 sm:p-2 flex flex-col justify-between cursor-pointer border transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/50 shadow-xs ring-2 ring-blue-500/20'
                              : isWithinTrip
                              ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 hover:border-slate-300'
                              : 'border-slate-100 bg-slate-50/30 text-slate-400 dark:border-slate-800/40 dark:bg-slate-900/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-bold ${
                                isSelected
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : isWithinTrip
                                  ? 'text-slate-800 dark:text-slate-200'
                                  : 'text-slate-400'
                              }`}
                            >
                              {dayNum}
                            </span>
                            {hasSchedule && (
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                            )}
                          </div>

                          {hasSchedule && (
                            <div className="mt-1 space-y-0.5">
                              <span className="block truncate text-[10px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                                {dateScheduleMap[dateStr].cityName}
                              </span>
                              {actCount > 0 && (
                                <span className="block truncate text-[9px] text-blue-600 dark:text-blue-400 font-medium">
                                  {actCount} {actCount === 1 ? 'activity' : 'activities'}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Selected Day Agenda */}
                <Card className="p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      {selectedDate ? `Schedule for ${selectedDate}` : 'Select a Date'}
                    </h3>
                    {selectedDateSchedule && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Stop #{selectedDateSchedule.stopOrder}: {selectedDateSchedule.cityName}, {selectedDateSchedule.country}
                      </p>
                    )}
                  </div>

                  {!selectedDateSchedule ? (
                    <div className="py-12 text-center text-xs text-slate-400">
                      No stop scheduled on this date. Click any trip date on the calendar to view activities.
                    </div>
                  ) : selectedDateSchedule.activities.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 space-y-3">
                      <p>No activities scheduled for this day in {selectedDateSchedule.cityName}.</p>
                      <Link href={`/trips/${trip.id}/itinerary`}>
                        <Button variant="outline" size="sm">
                          <Plus className="h-3.5 w-3.5" />
                          Add Activity
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {selectedDateSchedule.activities.map((actItem) => {
                        const act = actItem.activity;
                        const cost = actItem.actual_cost !== null && actItem.actual_cost !== undefined ? actItem.actual_cost : act?.estimated_cost || 0;
                        return (
                          <div
                            key={actItem.id}
                            className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3.5 border border-slate-100 dark:border-slate-800 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                                {act?.name || 'Activity'}
                              </span>
                              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                                ${cost}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              {actItem.start_time && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {actItem.start_time}
                                  {actItem.end_time ? ` - ${actItem.end_time}` : ''}
                                </span>
                              )}
                              {act?.category && (
                                <Badge variant="secondary" size="sm" className="capitalize">
                                  {act.category}
                                </Badge>
                              )}
                            </div>
                            {actItem.notes && (
                              <p className="text-[11px] text-slate-500 italic">
                                &quot;{actItem.notes}&quot;
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </div>
            ) : (
              /* Timeline View */
              <div className="space-y-4">
                {Object.keys(dateScheduleMap).length === 0 ? (
                  <EmptyState
                    icon={<CalendarIcon className="h-8 w-8" />}
                    title="No timeline events"
                    description="Add city stops to generate your full itinerary timeline."
                    action={
                      <Link href={`/trips/${trip.id}/itinerary`}>
                        <Button variant="primary">
                          <Plus className="h-4 w-4" />
                          Add Stops to Itinerary
                        </Button>
                      </Link>
                    }
                  />
                ) : (
                  Object.entries(dateScheduleMap)
                    .sort(([dA], [dB]) => new Date(dA).getTime() - new Date(dB).getTime())
                    .map(([dateKey, dayData]) => (
                      <Card key={dateKey} className="p-5 border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                              {dateKey}
                            </span>
                            <span className="text-xs text-slate-500">•</span>
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                              {dayData.cityName}, {dayData.country}
                            </span>
                          </div>
                          <Badge variant="secondary" size="sm">
                            {dayData.activities.length} activities
                          </Badge>
                        </div>

                        {dayData.activities.length === 0 ? (
                          <p className="text-xs text-slate-400 py-1">Free day / travel transfer day.</p>
                        ) : (
                          <div className="space-y-2">
                            {dayData.activities.map((actItem) => {
                              const act = actItem.activity;
                              const cost = actItem.actual_cost !== null && actItem.actual_cost !== undefined ? actItem.actual_cost : act?.estimated_cost || 0;
                              return (
                                <div
                                  key={actItem.id}
                                  className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800/40 p-2.5 text-xs"
                                >
                                  <div className="flex items-center gap-3">
                                    {actItem.start_time && (
                                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                                        <Clock className="h-3 w-3" />
                                        {actItem.start_time}
                                      </span>
                                    )}
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                      {act?.name || 'Activity'}
                                    </span>
                                    {act?.category && (
                                      <Badge variant="outline" size="sm" className="capitalize">
                                        {act.category}
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="font-bold text-slate-800 dark:text-slate-200">
                                    ${cost}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </Card>
                    ))
                )}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </AuthGuard>
  );
}
