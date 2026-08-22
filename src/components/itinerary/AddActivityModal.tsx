'use client';

import React, { useState, useEffect } from 'react';
import { Search, Tag, DollarSign, Clock, AlertCircle, Plus } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { fetchActivitiesForCity, addActivityToStop, ActivityRow } from '@/lib/api/itinerary';

export interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripStopId: string;
  cityName: string;
  cityId: string;
  stopStartDate: string;
  stopEndDate: string;
  onActivityAdded: () => void;
}

export function AddActivityModal({
  isOpen,
  onClose,
  tripStopId,
  cityName,
  cityId,
  stopStartDate,
  stopEndDate,
  onActivityAdded,
}: AddActivityModalProps) {
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedActivity, setSelectedActivity] = useState<ActivityRow | null>(null);

  const [activityDate, setActivityDate] = useState(stopStartDate);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [notes, setNotes] = useState('');
  const [actualCost, setActualCost] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ['All', 'Sightseeing', 'Culture', 'Food', 'Adventure', 'Relaxation'];

  useEffect(() => {
    if (isOpen && cityId) {
      loadActivities();
      setSelectedActivity(null);
      setActivityDate(stopStartDate);
      setNotes('');
      setActualCost('');
      setError(null);
    }
  }, [isOpen, cityId, stopStartDate]);

  const loadActivities = async () => {
    setIsLoading(true);
    const { data } = await fetchActivitiesForCity(cityId, search, selectedCategory);
    setActivities(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen && cityId) {
      loadActivities();
    }
  }, [search, selectedCategory]);

  const handleSelect = (act: ActivityRow) => {
    setSelectedActivity(act);
    setActualCost(String(act.estimated_cost || 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedActivity) {
      setError('Please select an activity.');
      return;
    }

    setIsSubmitting(true);
    try {
      const numCost = actualCost !== '' ? Number(actualCost) : Number(selectedActivity.estimated_cost);
      const { error: addError } = await addActivityToStop(tripStopId, selectedActivity.id, {
        activityDate,
        startTime,
        endTime,
        notes,
        actualCost: isNaN(numCost) ? undefined : numCost,
      });

      if (addError) {
        setError(addError);
      } else {
        onActivityAdded();
        onClose();
      }
    } catch {
      setError('Failed to schedule activity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Activity in ${cityName}`} maxWidth="lg">
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Activity Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            1. Select Curated Activity
          </label>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search activity by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-52 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl p-2 space-y-1.5 bg-slate-50/50 dark:bg-slate-900/40">
            {isLoading ? (
              <p className="text-center py-6 text-xs text-slate-400">Loading destination activities...</p>
            ) : activities.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400">No activities found for this city/filter.</p>
            ) : (
              activities.map((act) => {
                const isSelected = selectedActivity?.id === act.id;
                return (
                  <div
                    key={act.id}
                    onClick={() => handleSelect(act)}
                    className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 font-semibold'
                        : 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{act.name}</span>
                        <Badge variant="accent" size="sm" className="capitalize">
                          {act.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{act.description}</p>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        ${act.estimated_cost}
                      </p>
                      {act.duration_minutes && (
                        <p className="text-[11px] text-slate-400">{act.duration_minutes} mins</p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Scheduling Details */}
        {selectedActivity && (
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              2. Schedule Details for {selectedActivity.name}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Date"
                type="date"
                value={activityDate}
                min={stopStartDate}
                max={stopEndDate}
                onChange={(e) => setActivityDate(e.target.value)}
                required
              />
              <Input
                label="Start Time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <Input
                label="End Time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Actual Cost ($ USD)"
                type="number"
                value={actualCost}
                onChange={(e) => setActualCost(e.target.value)}
                placeholder="Estimated cost by default"
              />
              <Input
                label="Activity Notes"
                placeholder="e.g., Confirmation #1092, Meet guide at entrance"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={!selectedActivity}>
            Schedule Activity
          </Button>
        </div>
      </form>
    </Modal>
  );
}
