import React from 'react';
import { MapPin, DollarSign, Sun } from 'lucide-react';
import { CityExploreItem } from '@/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface CityCardProps {
  city: CityExploreItem;
  onAddToTrip?: (city: CityExploreItem) => void;
}

export function CityCard({ city, onAddToTrip }: CityCardProps) {
  return (
    <Card hoverEffect className="overflow-hidden p-0 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
      <div className="relative h-48 w-full bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 p-5 flex flex-col justify-between text-white">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="backdrop-blur-md bg-white/20 text-white border-white/30">
            {city.country}
          </Badge>
          <div className="flex items-center gap-1 text-xs bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full text-amber-300">
            <Sun className="h-3 w-3" />
            <span>{city.bestSeason}</span>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{city.name}</h3>
          <p className="text-xs text-indigo-100 line-clamp-1">{city.tagline}</p>
        </div>
      </div>

      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="text-xs text-slate-500 dark:text-slate-400">Popular Highlights:</div>
          <div className="flex flex-wrap gap-1.5">
            {city.popularSpots.map((spot, i) => (
              <span
                key={i}
                className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
              >
                {spot}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400">Est. Daily Budget</span>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">${city.avgDailyBudget}/day</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => onAddToTrip?.(city)}>
            Explore & Add
          </Button>
        </div>
      </div>
    </Card>
  );
}
