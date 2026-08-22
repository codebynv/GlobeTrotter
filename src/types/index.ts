export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  budget: number;
  totalSpent: number;
  status: 'planning' | 'upcoming' | 'ongoing' | 'completed';
  stopsCount: number;
  isShared?: boolean;
}

export interface Activity {
  id: string;
  title: string;
  category: 'sightseeing' | 'food' | 'adventure' | 'culture' | 'relaxation' | 'transport';
  time?: string;
  location: string;
  estimatedCost: number;
  notes?: string;
  status: 'planned' | 'booked' | 'completed';
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  city: string;
  activities: Activity[];
}

export interface CityExploreItem {
  id: string;
  name: string;
  country: string;
  tagline: string;
  imageUrl: string;
  popularSpots: string[];
  avgDailyBudget: number;
  bestSeason: string;
}
