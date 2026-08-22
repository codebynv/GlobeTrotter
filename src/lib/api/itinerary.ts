import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';

export type CityRow = Database['public']['Tables']['cities']['Row'];
export type ActivityRow = Database['public']['Tables']['activities']['Row'];
export type TripStopRow = Database['public']['Tables']['trip_stops']['Row'];
export type TripActivityRow = Database['public']['Tables']['trip_activities']['Row'];

export interface EnrichedTripActivity extends TripActivityRow {
  activity?: ActivityRow | null;
}

export interface EnrichedTripStop extends TripStopRow {
  city: CityRow;
  trip_activities: EnrichedTripActivity[];
}

export async function fetchAllCities(search?: string, region?: string): Promise<{ data: CityRow[]; error: string | null }> {
  try {
    let query = supabase.from('cities').select('*').order('popularity_score', { ascending: false });

    if (region && region !== 'All') {
      query = query.eq('region', region);
    }

    if (search && search.trim()) {
      const s = search.trim();
      query = query.or(`name.ilike.%${s}%,country.ilike.%${s}%`);
    }

    const { data, error } = await query;
    if (error) return { data: [], error: error.message };
    return { data: data || [], error: null };
  } catch (err: any) {
    return { data: [], error: err.message || 'Failed to fetch cities' };
  }
}

export async function fetchActivitiesForCity(
  cityId: string,
  search?: string,
  category?: string
): Promise<{ data: ActivityRow[]; error: string | null }> {
  try {
    let query = supabase.from('activities').select('*').eq('city_id', cityId).order('name', { ascending: true });

    if (category && category !== 'All') {
      query = query.eq('category', category.toLowerCase());
    }

    if (search && search.trim()) {
      query = query.ilike('name', `%${search.trim()}%`);
    }

    const { data, error } = await query;
    if (error) return { data: [], error: error.message };
    return { data: data || [], error: null };
  } catch (err: any) {
    return { data: [], error: err.message || 'Failed to fetch activities' };
  }
}

export async function fetchTripStopsWithDetails(tripId: string): Promise<{ data: EnrichedTripStop[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('trip_stops')
      .select(`
        *,
        city:cities(*),
        trip_activities(
          *,
          activity:activities(*)
        )
      `)
      .eq('trip_id', tripId)
      .order('stop_order', { ascending: true });

    if (error) {
      return { data: [], error: error.message };
    }

    const formatted: EnrichedTripStop[] = (data || []).map((item: any) => ({
      ...item,
      city: item.city,
      trip_activities: (item.trip_activities || []).sort(
        (a: any, b: any) => (a.activity_order || 0) - (b.activity_order || 0)
      ),
    }));

    return { data: formatted, error: null };
  } catch (err: any) {
    return { data: [], error: err.message || 'Failed to fetch trip stops' };
  }
}

export async function createTripStop(
  tripId: string,
  cityId: string,
  startDate: string,
  endDate: string,
  notes?: string
): Promise<{ data: TripStopRow | null; error: string | null }> {
  try {
    // Determine the next stop_order
    const { data: existingStops } = await supabase
      .from('trip_stops')
      .select('stop_order')
      .eq('trip_id', tripId)
      .order('stop_order', { ascending: false })
      .limit(1);

    const nextOrder = existingStops && existingStops.length > 0 ? (existingStops[0].stop_order || 0) + 1 : 1;

    const { data, error } = await supabase
      .from('trip_stops')
      .insert({
        trip_id: tripId,
        city_id: cityId,
        start_date: startDate,
        end_date: endDate,
        stop_order: nextOrder,
        notes: notes?.trim() || null,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to create stop' };
  }
}

export async function updateTripStopDates(
  stopId: string,
  startDate: string,
  endDate: string,
  notes?: string
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('trip_stops')
      .update({
        start_date: startDate,
        end_date: endDate,
        notes: notes !== undefined ? notes?.trim() || null : undefined,
      })
      .eq('id', stopId);

    if (error) return { error: error.message };
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to update stop' };
  }
}

export async function deleteTripStop(stopId: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('trip_stops')
      .delete()
      .eq('id', stopId);

    if (error) return { error: error.message };
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to delete stop' };
  }
}

export async function swapTripStopOrder(
  tripId: string,
  stopA: { id: string; order: number },
  stopB: { id: string; order: number }
): Promise<{ error: string | null }> {
  try {
    // Swap using a temporary offset to satisfy the unique_trip_stop_order constraint
    const tempOrder = 999999;
    await supabase.from('trip_stops').update({ stop_order: tempOrder }).eq('id', stopA.id);
    await supabase.from('trip_stops').update({ stop_order: stopA.order }).eq('id', stopB.id);
    const { error } = await supabase.from('trip_stops').update({ stop_order: stopB.order }).eq('id', stopA.id);

    if (error) return { error: error.message };
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to reorder stops' };
  }
}

export async function addActivityToStop(
  tripStopId: string,
  activityId: string,
  details: {
    activityDate?: string;
    startTime?: string;
    endTime?: string;
    notes?: string;
    actualCost?: number;
  }
): Promise<{ data: TripActivityRow | null; error: string | null }> {
  try {
    const { data: existing } = await supabase
      .from('trip_activities')
      .select('activity_order')
      .eq('trip_stop_id', tripStopId)
      .order('activity_order', { ascending: false })
      .limit(1);

    const nextOrder = existing && existing.length > 0 ? (existing[0].activity_order || 0) + 1 : 1;

    const { data, error } = await supabase
      .from('trip_activities')
      .insert({
        trip_stop_id: tripStopId,
        activity_id: activityId,
        activity_date: details.activityDate || null,
        start_time: details.startTime || null,
        end_time: details.endTime || null,
        notes: details.notes?.trim() || null,
        actual_cost: details.actualCost !== undefined ? details.actualCost : null,
        activity_order: nextOrder,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to assign activity' };
  }
}

export async function removeActivityFromStop(tripActivityId: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('trip_activities')
      .delete()
      .eq('id', tripActivityId);

    if (error) return { error: error.message };
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to remove activity' };
  }
}
