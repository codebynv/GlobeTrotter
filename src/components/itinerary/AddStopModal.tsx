'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Star, Calendar, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { fetchAllCities, createTripStop, CityRow } from '@/lib/api/itinerary';

export interface AddStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  tripStartDate: string;
  tripEndDate: string;
  existingCityIds?: string[];
  onStopAdded: () => void;
}

export function AddStopModal({
  isOpen,
  onClose,
  tripId,
  tripStartDate,
  tripEndDate,
  existingCityIds = [],
  onStopAdded,
}: AddStopModalProps) {
  const [cities, setCities] = useState<CityRow[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCity, setSelectedCity] = useState<CityRow | null>(null);
  const [startDate, setStartDate] = useState(tripStartDate);
  const [endDate, setEndDate] = useState(tripEndDate);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const regions = ['All', 'Asia', 'Europe', 'Middle East', 'North America'];

  useEffect(() => {
    if (isOpen) {
      loadCities();
      setStartDate(tripStartDate);
      setEndDate(tripEndDate);
      setSelectedCity(null);
      setError(null);
      setNotes('');
    }
  }, [isOpen, tripStartDate, tripEndDate]);

  const loadCities = async () => {
    setIsLoading(true);
    const { data } = await fetchAllCities(search, selectedRegion);
    setCities(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadCities();
    }
  }, [search, selectedRegion]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedCity) {
      setError('Please select a destination city.');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please provide start and end dates for this stop.');
      return;
    }

    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      setError('Stop end date must be on or after start date.');
      return;
    }

    if (new Date(startDate).getTime() < new Date(tripStartDate).getTime() || new Date(endDate).getTime() > new Date(tripEndDate).getTime()) {
      setError(`Stop dates must be within trip dates (${tripStartDate} to ${tripEndDate}).`);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: createError } = await createTripStop(tripId, selectedCity.id, startDate, endDate, notes);
      if (createError) {
        setError(createError);
      } else {
        onStopAdded();
        onClose();
      }
    } catch {
      setError('Failed to add stop. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add City Destination Stop" maxWidth="lg">
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {/* City selection step */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            1. Select Destination City
          </label>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search city or country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
              {regions.map((reg) => (
                <button
                  type="button"
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedRegion === reg
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl p-2 space-y-1.5 bg-slate-50/50 dark:bg-slate-900/40">
            {isLoading ? (
              <p className="text-center py-6 text-xs text-slate-400">Loading cities catalog...</p>
            ) : cities.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400">No cities found matching search.</p>
            ) : (
              cities.map((city) => {
                const isSelected = selectedCity?.id === city.id;
                const isAlreadyInTrip = existingCityIds.includes(city.id);
                return (
                  <div
                    key={city.id}
                    onClick={() => setSelectedCity(city)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 font-semibold'
                        : 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold">
                        <MapPin className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{city.name}</span>
                          <span className="text-slate-500">({city.country})</span>
                          {isAlreadyInTrip && (
                            <Badge variant="outline" size="sm" className="text-[10px] py-0 px-1.5">
                              In trip
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{city.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-500">Score: {city.popularity_score}</span>
                      <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                        Cost: {city.cost_index}x
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Dates & Details step */}
        {selectedCity && (
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              2. Schedule Dates for {selectedCity.name}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Stop Start Date"
                type="date"
                value={startDate}
                min={tripStartDate}
                max={tripEndDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <Input
                label="Stop End Date"
                type="date"
                value={endDate}
                min={startDate || tripStartDate}
                max={tripEndDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            <Input
              label="Notes (Optional)"
              placeholder="e.g., Hotel near Central Station, JR Pass transit"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={!selectedCity}>
            Add Stop to Itinerary
          </Button>
        </div>
      </form>
    </Modal>
  );
}
