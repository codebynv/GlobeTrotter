'use client';

import React, { useState, useEffect } from 'react';
import { Search, Compass, MapPin } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { CityCard } from '@/components/explore/CityCard';
import { LoadingState } from '@/components/layout/LoadingState';
import { Input } from '@/components/ui/Input';
import { fetchAllCities, CityRow } from '@/lib/api/itinerary';
import { CityExploreItem } from '@/types';

export default function ExploreCitiesPage() {
  const [cities, setCities] = useState<CityExploreItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const regions = ['All', 'Asia', 'Europe', 'Middle East', 'North America'];

  const loadCities = async () => {
    setIsLoading(true);
    const { data } = await fetchAllCities(search, selectedRegion);
    if (data && data.length > 0) {
      setCities(
        data.map((c) => ({
          id: c.id,
          name: c.name,
          country: c.country,
          tagline: c.description || 'Stunning destination with rich culture and sights.',
          imageUrl: c.image_url || '',
          popularSpots: ['City Center', 'Historical Quarter', 'Local Markets'],
          avgDailyBudget: Math.round(Number(c.cost_index || 1) * 45),
          bestSeason: 'Spring / Autumn',
        }))
      );
    } else {
      // Fallback curated cities for preview
      setCities([
        {
          id: 'city-tokyo',
          name: 'Tokyo',
          country: 'Japan',
          tagline: 'Futuristic neon skyline meets serene traditional shrines.',
          imageUrl: '',
          popularSpots: ['Shibuya Crossing', 'Senso-ji', 'Shinjuku Gyoen', 'Akihabara'],
          avgDailyBudget: 150,
          bestSeason: 'Spring (Mar - May)',
        },
        {
          id: 'city-kyoto',
          name: 'Kyoto',
          country: 'Japan',
          tagline: 'Ancient imperial capital with thousands of classical Buddhist temples.',
          imageUrl: '',
          popularSpots: ['Fushimi Inari', 'Kinkaku-ji', 'Arashiyama', 'Gion District'],
          avgDailyBudget: 130,
          bestSeason: 'Autumn (Oct - Nov)',
        },
        {
          id: 'city-paris',
          name: 'Paris',
          country: 'France',
          tagline: 'The City of Light known for art, haute cuisine, and iconic architecture.',
          imageUrl: '',
          popularSpots: ['Eiffel Tower', 'Louvre Museum', 'Montmartre', 'Seine Cruise'],
          avgDailyBudget: 180,
          bestSeason: 'Late Spring (May - Jun)',
        },
        {
          id: 'city-rome',
          name: 'Rome',
          country: 'Italy',
          tagline: 'An open-air museum of Roman antiquity and Mediterranean culture.',
          imageUrl: '',
          popularSpots: ['Colosseum', 'Vatican Museums', 'Pantheon', 'Trevi Fountain'],
          avgDailyBudget: 140,
          bestSeason: 'Spring (Apr - Jun)',
        },
      ]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCities();
  }, [search, selectedRegion]);

  return (
    <PageContainer>
      <PageHeader
        title="Explore Global Destinations"
        description="Discover top-rated cities, estimated daily budgets, seasonal guides, and landmarks for your next journey."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Explore Cities' }]}
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
        <div className="w-full sm:max-w-md">
          <Input
            placeholder="Search by city or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {regions.map((reg) => (
            <button
              type="button"
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
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

      {isLoading ? (
        <div className="py-16">
          <LoadingState message="Loading destinations..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
