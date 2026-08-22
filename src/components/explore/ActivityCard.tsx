import React from 'react';
import { Tag, MapPin, DollarSign, Plus } from 'lucide-react';
import { Activity } from '@/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface ActivityCardProps {
  activity: Activity;
  onAdd?: (activity: Activity) => void;
}

export function ActivityCard({ activity, onAdd }: ActivityCardProps) {
  return (
    <Card hoverEffect className="p-5 flex flex-col justify-between border border-slate-200 dark:border-slate-800">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="accent" size="sm">
            {activity.category}
          </Badge>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            ${activity.estimatedCost}
          </span>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-base">{activity.title}</h4>
          <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <MapPin className="h-3.5 w-3.5" />
            {activity.location}
          </p>
        </div>
        {activity.notes && (
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{activity.notes}</p>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <Button size="sm" variant="secondary" onClick={() => onAdd?.(activity)}>
          <Plus className="h-3.5 w-3.5" />
          Add to Trip
        </Button>
      </div>
    </Card>
  );
}
