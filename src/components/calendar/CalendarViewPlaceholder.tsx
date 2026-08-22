import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export interface CalendarDayItem {
  day: number;
  dateStr: string;
  hasActivity?: boolean;
  label?: string;
  isToday?: boolean;
}

export function CalendarViewPlaceholder() {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Placeholder 30-day grid
  const days: CalendarDayItem[] = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    dateStr: `2026-06-${String(i + 1).padStart(2, '0')}`,
    hasActivity: [3, 4, 5, 12, 13, 14, 20, 21].includes(i + 1),
    label: i + 1 === 3 ? 'Tokyo Arrival' : i + 1 === 5 ? 'Kyoto Express' : undefined,
    isToday: i + 1 === 15,
  }));

  return (
    <Card className="space-y-6 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">June 2026</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="p-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="p-2">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
        {daysOfWeek.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((item) => (
          <div
            key={item.day}
            className={`min-h-[70px] sm:min-h-[85px] rounded-xl border p-1.5 sm:p-2 flex flex-col justify-between transition-all ${
              item.isToday
                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                : 'border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/30 hover:border-slate-300'
            }`}
          >
            <span
              className={`text-xs font-bold ${
                item.isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {item.day}
            </span>
            {item.hasActivity && (
              <div className="mt-1">
                <span className="block truncate rounded bg-blue-600 px-1 py-0.5 text-[10px] font-medium text-white shadow-xs">
                  {item.label || 'Scheduled'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
