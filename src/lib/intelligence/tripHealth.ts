/**
 * GlobeTrotter Trip Intelligence Engine
 *
 * Fully deterministic — no external AI. Analyses real Supabase trip data
 * and returns structured health metrics, warnings, and actionable recommendations.
 */

import { FormattedTrip } from '@/lib/api/trips';
import { EnrichedTripStop, EnrichedTripActivity } from '@/lib/api/itinerary';
import { ExpenseRow } from '@/lib/api/budget';

// ─── Types ─────────────────────────────────────────────────────────────────

export type BudgetStatus = 'healthy' | 'warning' | 'over-budget' | 'no-budget';
export type TravelPace = 'relaxed' | 'balanced' | 'packed';
export type RecommendationType = 'budget' | 'density' | 'pace' | 'free-day' | 'general';

export interface DayAnalysis {
  date: string;
  cityName: string;
  activityCount: number;
  totalDurationMinutes: number;
  estimatedCost: number;
  isOverloaded: boolean; // > 4 activities OR > 360 minutes (6h)
  isFree: boolean;       // 0 activities
}

export interface BudgetHealth {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  percentUsed: number;
  dailyAverageSpend: number;
  tripDays: number;
  status: BudgetStatus;
  score: number; // 0–30 contribution
}

export interface ActivityDensity {
  days: DayAnalysis[];
  overloadedDays: DayAnalysis[];
  freeDays: DayAnalysis[];
  totalActivities: number;
  averageActivitiesPerDay: number;
  averageDurationPerDay: number;
  score: number; // 0–25 contribution
}

export interface PaceAnalysis {
  pace: TravelPace;
  numCities: number;
  tripDays: number;
  daysPerCity: number;
  activitiesPerDay: number;
  score: number; // 0–25 contribution
}

export interface ScheduleBalance {
  plannedDays: number;
  freeDayCount: number;
  freeDayRatio: number;
  score: number; // 0–20 contribution
}

export interface Recommendation {
  type: RecommendationType;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  detail: string;
  icon: string;
}

export interface TripHealthReport {
  tripId: string;
  tripName: string;
  healthScore: number; // 0–100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  gradeColor: string;
  budget: BudgetHealth;
  density: ActivityDensity;
  pace: PaceAnalysis;
  schedule: ScheduleBalance;
  recommendations: Recommendation[];
  generatedAt: string;
}

// ─── Core analysis ─────────────────────────────────────────────────────────

/**
 * Entry point. Pass all trip data; returns a fully computed TripHealthReport.
 */
export function analyzeTripHealth(
  trip: FormattedTrip,
  stops: EnrichedTripStop[],
  expenses: ExpenseRow[]
): TripHealthReport {
  const tripDays = computeTripDays(trip.startDate, trip.endDate);

  const budget = analyzeBudget(trip, stops, expenses, tripDays);
  const density = analyzeDensity(trip, stops, tripDays);
  const pace = analyzePace(stops, tripDays, density.averageActivitiesPerDay);
  const schedule = analyzeSchedule(density, tripDays);

  const healthScore = Math.round(
    budget.score + density.score + pace.score + schedule.score
  );

  const { grade, gradeColor } = scoreToGrade(healthScore);

  const recommendations = buildRecommendations(
    trip, budget, density, pace, schedule, stops
  );

  return {
    tripId: trip.id,
    tripName: trip.name,
    healthScore,
    grade,
    gradeColor,
    budget,
    density,
    pace,
    schedule,
    recommendations,
    generatedAt: new Date().toISOString(),
  };
}

// ─── Budget analysis (0–30 pts) ───────────────────────────────────────────

function analyzeBudget(
  trip: FormattedTrip,
  stops: EnrichedTripStop[],
  expenses: ExpenseRow[],
  tripDays: number
): BudgetHealth {
  if (trip.budget <= 0) {
    return {
      totalBudget: 0,
      totalSpent: 0,
      remainingBudget: 0,
      percentUsed: 0,
      dailyAverageSpend: 0,
      tripDays,
      status: 'no-budget',
      score: 15,
    };
  }

  const activityCost = stops.reduce((sum, stop) =>
    sum + (stop.trip_activities || []).reduce((a, ta) => {
      const c = ta.actual_cost !== null && ta.actual_cost !== undefined
        ? Number(ta.actual_cost)
        : Number(ta.activity?.estimated_cost || 0);
      return a + c;
    }, 0), 0
  );

  const expenseCost = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalSpent = activityCost + expenseCost;
  const remainingBudget = trip.budget - totalSpent;
  const percentUsed = Math.round((totalSpent / trip.budget) * 100);
  const dailyAverageSpend = tripDays > 0 ? Math.round(totalSpent / tripDays) : 0;

  let status: BudgetStatus;
  let score: number;

  if (percentUsed > 100) {
    status = 'over-budget';
    score = 0;
  } else if (percentUsed > 80) {
    status = 'warning';
    score = 10;
  } else if (percentUsed > 60) {
    status = 'warning';
    score = 20;
  } else {
    status = 'healthy';
    score = 30;
  }

  return {
    totalBudget: trip.budget,
    totalSpent,
    remainingBudget,
    percentUsed,
    dailyAverageSpend,
    tripDays,
    status,
    score,
  };
}

// ─── Activity density analysis (0–25 pts) ────────────────────────────────

function analyzeDensity(
  trip: FormattedTrip,
  stops: EnrichedTripStop[],
  tripDays: number
): ActivityDensity {
  // Build per-date map across all stops
  const dateMap: Record<string, {
    cityName: string;
    activities: EnrichedTripActivity[];
  }> = {};

  stops.forEach((stop) => {
    // Register every date in the stop range
    const sStart = new Date(stop.start_date);
    const sEnd = new Date(stop.end_date);
    for (let d = new Date(sStart); d <= sEnd; d.setDate(d.getDate() + 1)) {
      const ds = d.toISOString().split('T')[0];
      if (!dateMap[ds]) {
        dateMap[ds] = { cityName: stop.city?.name || 'City', activities: [] };
      }
    }

    // Assign activities to their date (or stop start date as fallback)
    (stop.trip_activities || []).forEach((ta) => {
      const actDate = ta.activity_date || stop.start_date;
      if (!dateMap[actDate]) {
        dateMap[actDate] = { cityName: stop.city?.name || 'City', activities: [] };
      }
      dateMap[actDate].activities.push(ta);
    });
  });

  const days: DayAnalysis[] = Object.entries(dateMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { cityName, activities }]) => {
      const totalDurationMinutes = activities.reduce((sum, ta) => {
        return sum + (ta.activity?.duration_minutes || 90); // fallback 90 min
      }, 0);
      const estimatedCost = activities.reduce((sum, ta) => {
        const c = ta.actual_cost !== null && ta.actual_cost !== undefined
          ? Number(ta.actual_cost)
          : Number(ta.activity?.estimated_cost || 0);
        return sum + c;
      }, 0);

      const isOverloaded = activities.length > 4 || totalDurationMinutes > 360;
      const isFree = activities.length === 0;

      return {
        date,
        cityName,
        activityCount: activities.length,
        totalDurationMinutes,
        estimatedCost,
        isOverloaded,
        isFree,
      };
    });

  const overloadedDays = days.filter((d) => d.isOverloaded);
  const freeDays = days.filter((d) => d.isFree);
  const totalActivities = days.reduce((sum, d) => sum + d.activityCount, 0);
  const averageActivitiesPerDay = days.length > 0 ? totalActivities / days.length : 0;
  const averageDurationPerDay = days.length > 0
    ? days.reduce((s, d) => s + d.totalDurationMinutes, 0) / days.length
    : 0;

  // Score: start at 25, deduct for overloaded days
  const overloadPenalty = Math.min(overloadedDays.length * 5, 20);
  const score = Math.max(0, 25 - overloadPenalty);

  return {
    days,
    overloadedDays,
    freeDays,
    totalActivities,
    averageActivitiesPerDay: Math.round(averageActivitiesPerDay * 10) / 10,
    averageDurationPerDay: Math.round(averageDurationPerDay),
    score,
  };
}

// ─── Travel pace analysis (0–25 pts) ─────────────────────────────────────

function analyzePace(
  stops: EnrichedTripStop[],
  tripDays: number,
  averageActivitiesPerDay: number
): PaceAnalysis {
  const numCities = stops.length;
  const daysPerCity = numCities > 0 ? Math.round((tripDays / numCities) * 10) / 10 : tripDays;

  let pace: TravelPace;
  let score: number;

  if (numCities === 0) {
    pace = 'relaxed';
    score = 15;
  } else if (daysPerCity <= 1.5 || averageActivitiesPerDay > 4) {
    pace = 'packed';
    score = 10;
  } else if (daysPerCity >= 4 && averageActivitiesPerDay <= 2) {
    pace = 'relaxed';
    score = 20;
  } else {
    pace = 'balanced';
    score = 25;
  }

  return {
    pace,
    numCities,
    tripDays,
    daysPerCity,
    activitiesPerDay: averageActivitiesPerDay,
    score,
  };
}

// ─── Schedule balance analysis (0–20 pts) ────────────────────────────────

function analyzeSchedule(
  density: ActivityDensity,
  tripDays: number
): ScheduleBalance {
  const plannedDays = density.days.filter((d) => !d.isFree).length;
  const freeDayCount = density.freeDays.length;
  const freeDayRatio = density.days.length > 0
    ? freeDayCount / density.days.length
    : 0;

  // Ideal: at least 50% of days have activities, but not 100% (need rest)
  let score: number;
  if (density.totalActivities === 0) {
    score = 5; // empty schedule
  } else if (freeDayRatio > 0.7) {
    score = 8; // mostly unscheduled
  } else if (freeDayRatio < 0.05 && tripDays > 5) {
    score = 12; // over-packed, no rest days
  } else {
    score = 20; // healthy balance
  }

  return {
    plannedDays,
    freeDayCount,
    freeDayRatio: Math.round(freeDayRatio * 100) / 100,
    score,
  };
}

// ─── Recommendations ────────────────────────────────────────────────────

function buildRecommendations(
  trip: FormattedTrip,
  budget: BudgetHealth,
  density: ActivityDensity,
  pace: PaceAnalysis,
  schedule: ScheduleBalance,
  stops: EnrichedTripStop[]
): Recommendation[] {
  const recs: Recommendation[] = [];

  // 1. Budget warnings
  if (budget.status === 'over-budget') {
    recs.push({
      type: 'budget',
      severity: 'critical',
      title: 'Over Budget',
      detail: `Your scheduled activities and logged expenses total $${budget.totalSpent.toLocaleString()}, exceeding your $${budget.totalBudget.toLocaleString()} budget by $${Math.abs(budget.remainingBudget).toLocaleString()}. Review expensive activities or increase the budget.`,
      icon: '💸',
    });
  } else if (budget.status === 'warning' && budget.percentUsed > 85) {
    recs.push({
      type: 'budget',
      severity: 'warning',
      title: 'Budget Nearly Exhausted',
      detail: `${budget.percentUsed}% of your budget is allocated. With $${budget.remainingBudget.toLocaleString()} remaining over ${budget.tripDays - (density.days.filter(d => !d.isFree).length)} unscheduled days, you may run short. Consider reviewing high-cost items.`,
      icon: '⚠️',
    });
  }

  // 2. Overloaded day recommendation
  if (density.overloadedDays.length > 0) {
    const worstDay = density.overloadedDays.reduce((a, b) =>
      a.activityCount > b.activityCount ? a : b
    );
    const freeDayExists = density.freeDays.length > 0;
    recs.push({
      type: 'density',
      severity: 'warning',
      title: `Overloaded Day on ${worstDay.date}`,
      detail: `${worstDay.cityName} on ${worstDay.date} has ${worstDay.activityCount} activities (${Math.round(worstDay.totalDurationMinutes / 60)}h scheduled). ${freeDayExists ? `Consider moving 1–2 activities to a free day like ${density.freeDays[0].date} in ${density.freeDays[0].cityName}.` : 'Consider removing or splitting activities across days.'}`,
      icon: '📅',
    });
  }

  // 3. Packed pace recommendation
  if (pace.pace === 'packed' && pace.numCities > 1) {
    recs.push({
      type: 'pace',
      severity: 'warning',
      title: 'Packed Travel Pace',
      detail: `With ${pace.numCities} cities in ${pace.tripDays} days (avg ${pace.daysPerCity} days/city) and ${pace.activitiesPerDay} activities/day, this is an intense itinerary. Consider adding an extra night in at least one city to allow for deeper exploration.`,
      icon: '🚀',
    });
  }

  // 4. Many free days
  if (schedule.freeDayCount >= 3 && density.totalActivities > 0) {
    const freeDayNames = density.freeDays.slice(0, 2).map(d => `${d.date} (${d.cityName})`).join(', ');
    recs.push({
      type: 'free-day',
      severity: 'info',
      title: `${schedule.freeDayCount} Unscheduled Days`,
      detail: `Days like ${freeDayNames} have no activities planned. Visit the Itinerary Planner to browse curated local activities and fill these days.`,
      icon: '📌',
    });
  }

  // 5. No activities at all
  if (density.totalActivities === 0 && stops.length > 0) {
    recs.push({
      type: 'general',
      severity: 'info',
      title: 'No Activities Scheduled Yet',
      detail: `You have ${stops.length} ${stops.length === 1 ? 'city stop' : 'city stops'} planned but no activities scheduled. Open the Itinerary Planner to add curated experiences for each city.`,
      icon: '✨',
    });
  }

  // 6. No stops at all
  if (stops.length === 0) {
    recs.push({
      type: 'general',
      severity: 'info',
      title: 'No City Stops Added',
      detail: 'Add your first destination city on the trip overview page to start building your itinerary. GlobeTrotter has 30 curated cities to discover.',
      icon: '🗺️',
    });
  }

  // Limit to 3 most important (critical > warning > info)
  const priority = { critical: 0, warning: 1, info: 2 };
  return recs
    .sort((a, b) => priority[a.severity] - priority[b.severity])
    .slice(0, 3);
}

// ─── Helpers ────────────────────────────────────────────────────────────

function computeTripDays(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
}

function scoreToGrade(score: number): { grade: 'A' | 'B' | 'C' | 'D' | 'F'; gradeColor: string } {
  if (score >= 85) return { grade: 'A', gradeColor: 'text-emerald-600 dark:text-emerald-400' };
  if (score >= 70) return { grade: 'B', gradeColor: 'text-blue-600 dark:text-blue-400' };
  if (score >= 55) return { grade: 'C', gradeColor: 'text-amber-600 dark:text-amber-400' };
  if (score >= 40) return { grade: 'D', gradeColor: 'text-orange-600 dark:text-orange-400' };
  return { grade: 'F', gradeColor: 'text-rose-600 dark:text-rose-400' };
}
