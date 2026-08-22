'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, TrendingUp, Calendar, Zap, DollarSign, MapPin, AlertTriangle, CheckCircle2, Info, XCircle, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  TripHealthReport,
  BudgetStatus,
  TravelPace,
} from '@/lib/intelligence/tripHealth';

// ─── Sub-components ────────────────────────────────────────────────────────

function ScoreRing({ score, grade, gradeColor }: { score: number; grade: string; gradeColor: string }) {
  const circumference = 2 * Math.PI * 38;
  const progress = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-28 h-28 shrink-0">
      <svg className="absolute w-28 h-28 -rotate-90" viewBox="0 0 88 88">
        {/* Track */}
        <circle cx="44" cy="44" r="38" fill="none" stroke="currentColor" strokeWidth="7" className="text-slate-100 dark:text-slate-800" />
        {/* Progress arc */}
        <circle
          cx="44" cy="44" r="38"
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center">
        <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-none">{score}</p>
        <p className={`text-sm font-bold ${gradeColor} leading-none mt-0.5`}>Grade {grade}</p>
      </div>
    </div>
  );
}

function CategoryBar({ label, score, max, color }: { label: string; score: number; max: number; color: string }) {
  const pct = Math.round((score / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600 dark:text-slate-400 font-medium">{label}</span>
        <span className="font-bold text-slate-900 dark:text-slate-100">{score}/{max}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function RecommendationItem({ rec }: { rec: TripHealthReport['recommendations'][0] }) {
  const severityConfig = {
    critical: {
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
      icon: <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />,
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
      icon: <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
      icon: <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />,
    },
  };

  const { bg, icon } = severityConfig[rec.severity];

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-3 ${bg}`}>
      {icon}
      <div className="space-y-0.5 min-w-0">
        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
          {rec.icon} {rec.title}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{rec.detail}</p>
      </div>
    </div>
  );
}

function BudgetStatusBadge({ status }: { status: BudgetStatus }) {
  const cfg = {
    healthy: { label: 'Healthy', variant: 'success' as const },
    warning: { label: 'Warning', variant: 'warning' as const },
    'over-budget': { label: 'Over Budget', variant: 'warning' as const },
    'no-budget': { label: 'No Budget Set', variant: 'secondary' as const },
  };
  const { label, variant } = cfg[status];
  return <Badge variant={variant} size="sm">{label}</Badge>;
}

function PaceBadge({ pace }: { pace: TravelPace }) {
  const cfg = {
    relaxed: { label: '🌿 Relaxed', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' },
    balanced: { label: '⚖️ Balanced', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' },
    packed: { label: '⚡ Packed', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' },
  };
  const { label, color } = cfg[pace];
  return (
    <span className={`inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold ${color}`}>
      {label}
    </span>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export interface TripIntelligenceCardProps {
  report: TripHealthReport;
  tripId: string;
  compact?: boolean;
}

export function TripIntelligenceCard({ report, tripId, compact = false }: TripIntelligenceCardProps) {
  if (compact) {
    // Compact version for dashboard
    return (
      <Card className="p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
        <ScoreRing score={report.healthScore} grade={report.grade} gradeColor={report.gradeColor} />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Trip Intelligence Score
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <BudgetStatusBadge status={report.budget.status} />
            <PaceBadge pace={report.pace.pace} />
            {report.density.overloadedDays.length > 0 && (
              <Badge variant="warning" size="sm">
                {report.density.overloadedDays.length} overloaded day{report.density.overloadedDays.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {report.recommendations.length > 0 && (
            <p className="text-[11px] text-slate-500 line-clamp-1">
              {report.recommendations[0].icon} {report.recommendations[0].title}
            </p>
          )}
        </div>
        <Link href={`/trips/${tripId}`} className="shrink-0">
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </Link>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200 dark:border-slate-800 p-0 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 p-6">
        <div className="flex items-start gap-5">
          <ScoreRing score={report.healthScore} grade={report.grade} gradeColor={report.gradeColor} />
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Brain className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  Trip Intelligence Report
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {report.tripName}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <BudgetStatusBadge status={report.budget.status} />
              <PaceBadge pace={report.pace.pace} />
              {report.density.overloadedDays.length > 0 && (
                <Badge variant="warning" size="sm">
                  {report.density.overloadedDays.length} overloaded {report.density.overloadedDays.length === 1 ? 'day' : 'days'}
                </Badge>
              )}
              {report.density.freeDays.length > 0 && (
                <Badge variant="secondary" size="sm">
                  {report.density.freeDays.length} free {report.density.freeDays.length === 1 ? 'day' : 'days'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Category Scores */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Score Breakdown
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CategoryBar label="Budget Health" score={report.budget.score} max={30} color="bg-blue-500" />
            <CategoryBar label="Activity Density" score={report.density.score} max={25} color="bg-indigo-500" />
            <CategoryBar label="Travel Pace" score={report.pace.score} max={25} color="bg-cyan-500" />
            <CategoryBar label="Schedule Balance" score={report.schedule.score} max={20} color="bg-purple-500" />
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3 text-center border border-slate-100 dark:border-slate-800">
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              {report.budget.percentUsed}%
            </p>
            <p className="text-[10px] text-slate-400">Budget Used</p>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3 text-center border border-slate-100 dark:border-slate-800">
            <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              {report.density.totalActivities}
            </p>
            <p className="text-[10px] text-slate-400">Activities</p>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3 text-center border border-slate-100 dark:border-slate-800">
            <MapPin className="h-4 w-4 text-cyan-600 dark:text-cyan-400 mx-auto mb-1" />
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              {report.pace.numCities}
            </p>
            <p className="text-[10px] text-slate-400">Cities</p>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3 text-center border border-slate-100 dark:border-slate-800">
            <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              {report.density.averageActivitiesPerDay}
            </p>
            <p className="text-[10px] text-slate-400">Acts/Day Avg</p>
          </div>
        </div>

        {/* Recommendations */}
        {report.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Smart Recommendations
            </h4>
            <div className="space-y-2">
              {report.recommendations.map((rec, i) => (
                <RecommendationItem key={i} rec={rec} />
              ))}
            </div>
          </div>
        )}

        {report.recommendations.length === 0 && (
          <div className="flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 p-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                ✅ Excellent Trip Planning!
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                No major issues detected. Your itinerary looks well-balanced and thoughtfully planned.
              </p>
            </div>
          </div>
        )}

        <p className="text-[10px] text-slate-400 text-right">
          Analysis generated from your real trip data · Refreshes on each visit
        </p>
      </div>
    </Card>
  );
}
