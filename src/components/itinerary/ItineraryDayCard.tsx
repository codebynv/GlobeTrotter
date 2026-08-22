import React from 'react';
import { Clock, MapPin, DollarSign, CheckCircle2 } from 'lucide-react';
import { Activity, ItineraryDay } from '@/types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export interface ItineraryDayCardProps {
  day: ItineraryDay;
}

export function ItineraryDayCard({ day }: ItineraryDayCardProps) {
  return (
    <Card className="space-y-4 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 font-bold text-white text-xs">
            D{day.dayNumber}
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{day.city}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">{day.date}</p>
          </div>
        </div>
        <Badge variant="secondary" size="sm">
          {day.activities.length} activities
        </Badge>
      </div>

      <div className="space-y-3">
        {day.activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start justify-between rounded-xl bg-slate-50/70 p-3 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-slate-900 dark:text-slate-100">{activity.title}</span>
                <Badge variant="outline" size="sm">
                  {activity.category}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                {activity.time && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {activity.location}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                ${activity.estimatedCost}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
