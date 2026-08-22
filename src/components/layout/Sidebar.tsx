'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Calendar, DollarSign, ListChecks, Share2, ArrowLeft } from 'lucide-react';

export interface TripSidebarProps {
  tripId: string;
  tripTitle?: string;
}

export function TripSidebar({ tripId, tripTitle = 'Trip Overview' }: TripSidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: `/trips/${tripId}`, label: 'Overview', icon: Map, exact: true },
    { href: `/trips/${tripId}/itinerary`, label: 'Itinerary', icon: ListChecks },
    { href: `/trips/${tripId}/budget`, label: 'Budget Planner', icon: DollarSign },
    { href: `/trips/${tripId}/calendar`, label: 'Calendar View', icon: Calendar },
  ];

  const isLinkActive = (href: string, exact: boolean = false) => {
    if (exact) return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60 shadow-xs">
        <Link
          href="/trips"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to All Trips
        </Link>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate mb-3 px-2">
          {tripTitle}
        </h2>
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
