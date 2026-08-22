'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Globe,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Copy,
  Check,
  LogIn,
  Share2,
  AlertTriangle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/layout/LoadingState';
import { fetchPublicSharedTrip, PublicSharedTripData } from '@/lib/api/sharing';
import { copyTrip } from '@/lib/api/copyTrip';

export default function SharedTripPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const resolvedParams = use(params);
  const shareToken = resolvedParams.shareId;

  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [sharedData, setSharedData] = useState<PublicSharedTripData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const { data, error: err } = await fetchPublicSharedTrip(shareToken);
      if (err || !data) {
        setError(err || 'This shared trip link is invalid or no longer active.');
      } else {
        setSharedData(data);
      }
      setIsLoading(false);
    }
    load();
  }, [shareToken]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2500);
    });
  };

  const handleCopyTrip = async () => {
    if (!user) {
      // Redirect to login, then return here
      router.push(`/login?returnTo=/shared/${shareToken}`);
      return;
    }

    if (!sharedData) return;

    setIsCopying(true);
    const { newTripId, error: copyErr } = await copyTrip(sharedData.trip.id, user.id);
    setIsCopying(false);

    if (copyErr || !newTripId) {
      alert(`Could not copy trip: ${copyErr}`);
      return;
    }

    setCopySuccess(true);
    setTimeout(() => {
      router.push(`/trips/${newTripId}`);
    }, 1500);
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading || authLoading) {
    return (
      <PageContainer size="md">
        <div className="py-24">
          <LoadingState message="Loading shared itinerary..." />
        </div>
      </PageContainer>
    );
  }

  // ── Error / Expired ──────────────────────────────────────────────────────
  if (error || !sharedData) {
    return (
      <PageContainer size="sm">
        <div className="py-24 flex flex-col items-center justify-center text-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/60">
            <AlertTriangle className="h-8 w-8 text-rose-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Link Unavailable
            </h1>
            <p className="text-sm text-slate-500 max-w-sm">
              {error || 'This share link is invalid, has expired, or has been deactivated by the owner.'}
            </p>
          </div>
          <Link href="/">
            <Button variant="primary">
              <Globe className="h-4 w-4" />
              Explore GlobeTrotter
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const { trip, stops } = sharedData;
  const totalActivities = stops.reduce((sum, s) => sum + (s.trip_activities?.length || 0), 0);
  const totalCost = stops.reduce((sum, s) => {
    return (
      sum +
      (s.trip_activities || []).reduce((a, ta) => {
        const cost =
          ta.actual_cost !== null && ta.actual_cost !== undefined
            ? Number(ta.actual_cost)
            : Number(ta.activity?.estimated_cost || 0);
        return a + cost;
      }, 0)
    );
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top Shared Banner */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <Share2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">Shared Itinerary</span>
              {' '}— read-only public view
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {urlCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Link Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Link
                </>
              )}
            </button>

            {copySuccess ? (
              <div className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">
                <Check className="h-3.5 w-3.5" />
                Trip Copied! Redirecting...
              </div>
            ) : (
              <Button size="sm" variant="primary" onClick={handleCopyTrip} isLoading={isCopying}>
                {user ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Copy to My Trips
                  </>
                ) : (
                  <>
                    <LogIn className="h-3.5 w-3.5" />
                    Sign In to Copy Trip
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Hero */}
      <div
        className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white"
        style={
          trip.cover_image_url
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(10, 15, 45, 0.6), rgba(10, 15, 45, 0.92)), url(${trip.cover_image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex items-center gap-2 mb-5">
            <Badge className="bg-white/15 text-white border-white/25 backdrop-blur-sm text-xs">
              Shared Itinerary
            </Badge>
            {trip.is_public && (
              <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30 backdrop-blur-sm text-xs">
                <Globe className="h-3 w-3 mr-1" />
                Public
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            {trip.name}
          </h1>

          {trip.description && (
            <p className="text-blue-100 text-sm sm:text-base max-w-2xl mb-6 leading-relaxed">
              {trip.description}
            </p>
          )}

          {/* Trip meta chips */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 rounded-xl bg-white/10 backdrop-blur-sm px-3 py-2 text-xs font-medium text-white">
              <Calendar className="h-3.5 w-3.5 text-blue-300" />
              {trip.start_date} → {trip.end_date}
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-white/10 backdrop-blur-sm px-3 py-2 text-xs font-medium text-white">
              <MapPin className="h-3.5 w-3.5 text-blue-300" />
              {stops.length} {stops.length === 1 ? 'City' : 'Cities'}
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-white/10 backdrop-blur-sm px-3 py-2 text-xs font-medium text-white">
              <Sparkles className="h-3.5 w-3.5 text-blue-300" />
              {totalActivities} Activities
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-white/10 backdrop-blur-sm px-3 py-2 text-xs font-medium text-white">
              <DollarSign className="h-3.5 w-3.5 text-blue-300" />
              {trip.currency} ${totalCost.toLocaleString()} est. activity cost
            </div>
          </div>
        </div>
      </div>

      {/* City Route Summary */}
      {stops.length > 0 && (
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center gap-2 flex-wrap">
              {stops.map((stop, idx) => (
                <React.Fragment key={stop.id}>
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shrink-0">
                      {stop.stop_order}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {stop.city?.name}
                    </span>
                    <span className="text-xs text-slate-400">({stop.city?.country})</span>
                  </div>
                  {idx < stops.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Itinerary */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {stops.length === 0 ? (
          <Card className="p-12 text-center border border-slate-200 dark:border-slate-800">
            <MapPin className="mx-auto h-10 w-10 text-slate-300 mb-4" />
            <p className="text-slate-500 text-sm">
              This itinerary has no stops added yet.
            </p>
          </Card>
        ) : (
          stops.map((stop) => (
            <div key={stop.id} className="space-y-4">
              {/* Stop city header */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 font-extrabold text-white text-sm shrink-0 shadow-md shadow-blue-600/30">
                  {stop.stop_order}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {stop.city?.name}
                    <span className="ml-2 text-sm font-normal text-slate-400">{stop.city?.country}</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    {stop.start_date} → {stop.end_date}
                    {stop.notes && <span className="ml-2 italic">• {stop.notes}</span>}
                  </p>
                </div>
              </div>

              {/* City description */}
              {stop.city?.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 ml-13 pl-0 border-l-2 border-blue-200 dark:border-blue-800 pl-4">
                  {stop.city.description}
                </p>
              )}

              {/* Activities */}
              {stop.trip_activities.length === 0 ? (
                <Card className="ml-13 p-6 border border-dashed border-slate-200 dark:border-slate-800 text-center">
                  <p className="text-xs text-slate-400">No activities scheduled for this stop.</p>
                </Card>
              ) : (
                <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 p-0">
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {stop.trip_activities.map((ta, taIdx) => {
                      const act = ta.activity;
                      const cost =
                        ta.actual_cost !== null && ta.actual_cost !== undefined
                          ? Number(ta.actual_cost)
                          : Number(act?.estimated_cost || 0);

                      return (
                        <div
                          key={ta.id}
                          className="flex items-start justify-between gap-4 p-4 sm:p-5 group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <div className="flex items-start gap-3.5">
                            {/* Order badge */}
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0 mt-0.5">
                              {taIdx + 1}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                                  {act?.name || 'Activity'}
                                </span>
                                {act?.category && (
                                  <Badge variant="accent" size="sm" className="capitalize text-[10px]">
                                    {act.category}
                                  </Badge>
                                )}
                              </div>

                              {act?.description && (
                                <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
                                  {act.description}
                                </p>
                              )}

                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                {ta.activity_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {ta.activity_date}
                                  </span>
                                )}
                                {ta.start_time && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {ta.start_time}
                                    {ta.end_time ? ` – ${ta.end_time}` : ''}
                                  </span>
                                )}
                                {act?.duration_minutes && (
                                  <span>{act.duration_minutes} mins</span>
                                )}
                                {ta.notes && (
                                  <span className="italic text-slate-500">&quot;{ta.notes}&quot;</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              ${cost}
                            </p>
                            <p className="text-[10px] text-slate-400">{trip.currency}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Stop cost total */}
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 px-5 py-3">
                    <span className="text-xs text-slate-500 font-medium">
                      {stop.city?.name} Activity Total
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      ${stop.trip_activities.reduce((sum, ta) => {
                        const c = ta.actual_cost !== null && ta.actual_cost !== undefined ? Number(ta.actual_cost) : Number(ta.activity?.estimated_cost || 0);
                        return sum + c;
                      }, 0).toLocaleString()} {trip.currency}
                    </span>
                  </div>
                </Card>
              )}
            </div>
          ))
        )}

        {/* Bottom CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 p-8 text-center text-white shadow-xl shadow-blue-500/20">
          <h3 className="text-xl font-extrabold mb-2">Inspired by this journey?</h3>
          <p className="text-sm text-blue-100 mb-6 max-w-md mx-auto">
            Copy this trip to your account and customize it — add your own stops, schedule activities, and track your budget.
          </p>
          <div className="flex items-center justify-center gap-3">
            {copySuccess ? (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 text-sm font-semibold">
                <Check className="h-4 w-4" />
                Copied! Redirecting to your trips...
              </div>
            ) : (
              <Button
                variant="primary"
                className="bg-white text-blue-700 hover:bg-blue-50 border-white shadow-lg"
                isLoading={isCopying}
                onClick={handleCopyTrip}
              >
                {user ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Copy This Trip to My Account
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign Up Free & Copy Trip
                  </>
                )}
              </Button>
            )}
            {!user && (
              <Link href="/signup">
                <Button
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/15"
                >
                  Create Free Account
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-blue-600 transition-colors font-medium"
          >
            Powered by GlobeTrotter · Plan & Share Your Journey
          </Link>
        </div>
      </div>
    </div>
  );
}
