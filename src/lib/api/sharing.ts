import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';

export type TripShareRow = Database['public']['Tables']['trip_shares']['Row'];

// ─── Owner: get all share records for a trip ───────────────────────────────

export async function fetchTripShares(tripId: string): Promise<{ data: TripShareRow[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('trip_shares')
      .select('*')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false });

    if (error) return { data: [], error: error.message };
    return { data: data || [], error: null };
  } catch (err: any) {
    return { data: [], error: err.message || 'Failed to fetch share links' };
  }
}

// ─── Owner: create a new share link ───────────────────────────────────────

export async function createTripShare(tripId: string): Promise<{ data: TripShareRow | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('trip_shares')
      .insert({ trip_id: tripId, is_active: true })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to create share link' };
  }
}

// ─── Owner: toggle active / inactive ─────────────────────────────────────

export async function setTripShareActive(shareId: string, isActive: boolean): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('trip_shares')
      .update({ is_active: isActive })
      .eq('id', shareId);

    if (error) return { error: error.message };
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to update share link' };
  }
}

// ─── Owner: delete a share link ──────────────────────────────────────────

export async function deleteTripShare(shareId: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('trip_shares')
      .delete()
      .eq('id', shareId);

    if (error) return { error: error.message };
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to delete share link' };
  }
}

// ─── Public: resolve a share token → trip + stops + activities ────────────

export interface PublicSharedTripData {
  share: TripShareRow;
  trip: {
    id: string;
    name: string;
    description: string | null;
    start_date: string;
    end_date: string;
    cover_image_url: string | null;
    budget: number;
    currency: string;
    is_public: boolean;
  };
  stops: Array<{
    id: string;
    stop_order: number;
    start_date: string;
    end_date: string;
    notes: string | null;
    city: {
      id: string;
      name: string;
      country: string;
      region: string | null;
      description: string | null;
      image_url: string | null;
    };
    trip_activities: Array<{
      id: string;
      activity_order: number;
      activity_date: string | null;
      start_time: string | null;
      end_time: string | null;
      actual_cost: number | null;
      notes: string | null;
      activity: {
        id: string;
        name: string;
        description: string | null;
        category: string;
        estimated_cost: number | null;
        duration_minutes: number | null;
      } | null;
    }>;
  }>;
}

export async function fetchPublicSharedTrip(
  shareToken: string
): Promise<{ data: PublicSharedTripData | null; error: string | null }> {
  try {
    // Fetch the share record (anon-accessible via RLS when is_active=true and linked trip is public/shared)
    const { data: share, error: shareError } = await supabase
      .from('trip_shares')
      .select('*')
      .eq('share_token', shareToken)
      .eq('is_active', true)
      .single();

    if (shareError || !share) {
      return { data: null, error: 'This share link is invalid, expired, or has been deactivated.' };
    }

    // Check expires_at
    if (share.expires_at && new Date(share.expires_at).getTime() < Date.now()) {
      return { data: null, error: 'This share link has expired.' };
    }

    // Fetch trip data via the trip_id
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id, name, description, start_date, end_date, cover_image_url, budget, currency, is_public')
      .eq('id', share.trip_id)
      .single();

    if (tripError || !trip) {
      return { data: null, error: 'Trip data is no longer accessible.' };
    }

    // Fetch stops with city + activities
    const { data: stopsData, error: stopsError } = await supabase
      .from('trip_stops')
      .select(`
        id,
        stop_order,
        start_date,
        end_date,
        notes,
        city:cities(id, name, country, region, description, image_url),
        trip_activities(
          id,
          activity_order,
          activity_date,
          start_time,
          end_time,
          actual_cost,
          notes,
          activity:activities(id, name, description, category, estimated_cost, duration_minutes)
        )
      `)
      .eq('trip_id', share.trip_id)
      .order('stop_order', { ascending: true });

    if (stopsError) {
      return { data: null, error: stopsError.message };
    }

    const stops = (stopsData || []).map((s: any) => ({
      ...s,
      trip_activities: (s.trip_activities || []).sort(
        (a: any, b: any) => (a.activity_order || 0) - (b.activity_order || 0)
      ),
    }));

    return {
      data: {
        share,
        trip: {
          ...trip,
          budget: Number(trip.budget) || 0,
        },
        stops,
      },
      error: null,
    };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to load shared trip.' };
  }
}
