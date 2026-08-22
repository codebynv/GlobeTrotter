import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';

export type TripRow = Database['public']['Tables']['trips']['Row'];
export type TripInsert = Database['public']['Tables']['trips']['Insert'];
export type TripUpdate = Database['public']['Tables']['trips']['Update'];

export interface FormattedTrip {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  coverImageUrl: string | null;
  budget: number;
  currency: string;
  isPublic: boolean;
  createdAt: string;
  status: 'planning' | 'upcoming' | 'ongoing' | 'completed';
}

export function computeTripStatus(startDate: string, endDate: string): 'planning' | 'upcoming' | 'ongoing' | 'completed' {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (today < start) {
    return 'upcoming';
  } else if (today >= start && today <= end) {
    return 'ongoing';
  } else {
    return 'completed';
  }
}

export function formatTripRow(row: TripRow): FormattedTrip {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    startDate: row.start_date,
    endDate: row.end_date,
    coverImageUrl: row.cover_image_url,
    budget: Number(row.budget) || 0,
    currency: row.currency || 'USD',
    isPublic: row.is_public || false,
    createdAt: row.created_at,
    status: computeTripStatus(row.start_date, row.end_date),
  };
}

export async function fetchUserTrips(userId: string): Promise<{ data: FormattedTrip[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: true });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data || []).map(formatTripRow), error: null };
  } catch (err: any) {
    return { data: [], error: err.message || 'Failed to fetch trips' };
  }
}

export async function fetchTripById(tripId: string): Promise<{ data: FormattedTrip | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    if (!data) {
      return { data: null, error: 'Trip not found or you do not have permission to view it.' };
    }

    return { data: formatTripRow(data), error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to fetch trip' };
  }
}

export async function createTrip(
  userId: string,
  trip: {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    budget: number;
    currency?: string;
    coverImageUrl?: string;
    isPublic?: boolean;
  }
): Promise<{ data: FormattedTrip | null; error: string | null }> {
  try {
    if (new Date(trip.endDate).getTime() < new Date(trip.startDate).getTime()) {
      return { data: null, error: 'End date must be on or after start date.' };
    }

    const { data, error } = await supabase
      .from('trips')
      .insert({
        user_id: userId,
        name: trip.name.trim(),
        description: trip.description?.trim() || null,
        start_date: trip.startDate,
        end_date: trip.endDate,
        budget: trip.budget || 0,
        currency: trip.currency || 'USD',
        cover_image_url: trip.coverImageUrl?.trim() || null,
        is_public: trip.isPublic ?? false,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: formatTripRow(data), error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to create trip' };
  }
}

export async function deleteTrip(tripId: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to delete trip' };
  }
}
