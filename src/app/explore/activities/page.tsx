'use client';

import React, { useState } from 'react';
import { Search, Filter, Compass } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ActivityCard } from '@/components/explore/ActivityCard';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Activity } from '@/types';

export default function ExploreActivitiesPage() {
  const activities: Activity[] = [
    {
      id: 'act-shibuya-sky',
      title: 'Shibuya Sky 360-degree Rooftop Observation',
      category: 'sightseeing',
      location: 'Tokyo, Japan',
      estimatedCost: 22,
      notes: 'Unrivaled sunset views over Shibuya Crossing and Mount Fuji on clear days.',
      status: 'planned',
    },
    {
      id: 'act-fushimi-inari',
      title: 'Fushimi Inari Early Morning Hike',
      category: 'culture',
      location: 'Kyoto, Japan',
      estimatedCost: 0,
      notes: 'Thousands of vermilion torii gates winding up sacred Mount Inari.',
      status: 'planned',
    },
    {
      id: 'act-colosseum-night',
      title: 'Colosseum & Underground Night Access Tour',
      category: 'culture',
      location: 'Rome, Italy',
      estimatedCost: 85,
      notes: 'VIP after-hours access into the gladiatorial underground chambers.',
      status: 'planned',
    },
    {
      id: 'act-louvre-highlights',
      title: 'Louvre Masterpieces Guided Walking Tour',
      category: 'culture',
      location: 'Paris, France',
      estimatedCost: 65,
      notes: 'Skip-the-line guided entrance covering the Mona Lisa, Venus de Milo, and Winged Victory.',
      status: 'planned',
    },
    {
      id: 'act-ramen-workshop',
      title: 'Artisan Ramen & Gyoza Cooking Class',
      category: 'food',
      location: 'Tokyo, Japan',
      estimatedCost: 55,
      notes: 'Hands-on experience making noodles and rich broth from scratch with local chefs.',
      status: 'planned',
    },
    {
      id: 'act-florence-gelato',
      title: 'Florence Secret Food & Gelato Walk',
      category: 'food',
      location: 'Florence, Italy',
      estimatedCost: 40,
      notes: 'Taste authentic Tuscan delicacies, cured meats, local wines, and historical gelato.',
      status: 'planned',
    },
  ];

  const categories = ['All', 'Culture', 'Sightseeing', 'Food', 'Adventure', 'Relaxation'];

  return (
    <PageContainer>
      <PageHeader
        title="Curated Travel Activities"
        description="Discover and bookmark hand-picked experiences, guided tours, culinary walks, and sights to include in your trips."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Activities' }]}
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
        <div className="w-full sm:max-w-md">
          <Input
            placeholder="Search activities, landmarks, cuisine..."
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {categories.map((cat, idx) => (
            <Badge
              key={cat}
              variant={idx === 0 ? 'primary' : 'secondary'}
              className="cursor-pointer py-1.5 px-3"
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </PageContainer>
  );
}
