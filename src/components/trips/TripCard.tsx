'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, DollarSign, ArrowRight, Trash2, Globe, Lock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { FormattedTrip } from '@/lib/api/trips';

export interface TripCardProps {
  trip: FormattedTrip;
  onDelete?: (tripId: string) => void;
}

export function TripCard({ trip, onDelete }: TripCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const statusVariants: Record<FormattedTrip['status'], 'primary' | 'success' | 'warning' | 'secondary'> = {
    planning: 'secondary',
    upcoming: 'primary',
    ongoing: 'success',
    completed: 'secondary',
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${trip.name}"?`)) {
      setIsDeleting(true);
      onDelete?.(trip.id);
    }
  };

  return (
    <Card hoverEffect className="group flex flex-col justify-between overflow-hidden p-0 border border-slate-200 dark:border-slate-800">
      {/* Visual cover banner */}
      <div
        className="relative h-44 w-full bg-gradient-to-br from-blue-700 via-indigo-700 to-cyan-800 p-5 flex flex-col justify-between text-white"
        style={
          trip.coverImageUrl
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.8)), url(${trip.coverImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        <div className="flex items-center justify-between">
          <Badge variant={statusVariants[trip.status]} className="backdrop-blur-md bg-white/20 text-white border-white/30 capitalize">
            {trip.status}
          </Badge>
          <div className="flex items-center gap-1.5">
            {trip.isPublic ? (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/80 text-white backdrop-blur-md">
                <Globe className="h-3 w-3" /> Public
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-800/70 text-slate-200 backdrop-blur-md">
                <Lock className="h-3 w-3" /> Private
              </span>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-600/90 text-white backdrop-blur-md transition-colors cursor-pointer"
                title="Delete Trip"
                aria-label="Delete Trip"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold tracking-tight text-white line-clamp-1">{trip.name}</h3>
          {trip.description && (
            <p className="text-xs text-blue-100 line-clamp-1 mt-1">{trip.description}</p>
          )}
        </div>
      </div>

      {/* Details body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {trip.startDate} to {trip.endDate}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <DollarSign className="h-3.5 w-3.5 text-slate-400" />
              Budget: {trip.currency} ${trip.budget.toLocaleString()}
            </span>
          </div>
        </div>

        <Link
          href={`/trips/${trip.id}`}
          className="inline-flex items-center justify-between w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-950/50 dark:group-hover:text-blue-400 transition-colors"
        >
          <span>View Trip Itinerary</span>
          <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </Card>
  );
}
