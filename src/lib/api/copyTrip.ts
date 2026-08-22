import { supabase } from '@/lib/supabase/client';

/**
 * Copy a trip (and its stops + scheduled activities) to a new owner.
 * Does NOT copy expenses or share settings.
 */
export async function copyTrip(
  sourceTripId: string,
  targetUserId: string
): Promise<{ newTripId: string | null; error: string | null }> {
  try {
    // 1. Fetch the source trip
    const { data: sourceTrip, error: tripErr } = await supabase
      .from('trips')
      .select('*')
      .eq('id', sourceTripId)
      .single();

    if (tripErr || !sourceTrip) {
      return { newTripId: null, error: 'Could not load source trip data.' };
    }

    // 2. Create the new trip owned by targetUserId
    const { data: newTrip, error: insertErr } = await supabase
      .from('trips')
      .insert({
        user_id: targetUserId,
        name: `Copy of ${sourceTrip.name}`,
        description: sourceTrip.description,
        start_date: sourceTrip.start_date,
        end_date: sourceTrip.end_date,
        cover_image_url: sourceTrip.cover_image_url,
        budget: sourceTrip.budget,
        currency: sourceTrip.currency,
        is_public: false, // always private for copy
      })
      .select('id')
      .single();

    if (insertErr || !newTrip) {
      return { newTripId: null, error: insertErr?.message || 'Failed to create copied trip.' };
    }

    const newTripId = newTrip.id;

    // 3. Fetch source stops
    const { data: sourceStops } = await supabase
      .from('trip_stops')
      .select(`
        id, city_id, stop_order, start_date, end_date, notes,
        trip_activities(
          activity_id, activity_order, activity_date,
          start_time, end_time, actual_cost, notes
        )
      `)
      .eq('trip_id', sourceTripId)
      .order('stop_order', { ascending: true });

    if (!sourceStops || sourceStops.length === 0) {
      return { newTripId, error: null }; // no stops to copy
    }

    // 4. Re-insert stops + activities in order
    for (const stop of sourceStops as any[]) {
      const { data: newStop, error: stopErr } = await supabase
        .from('trip_stops')
        .insert({
          trip_id: newTripId,
          city_id: stop.city_id,
          stop_order: stop.stop_order,
          start_date: stop.start_date,
          end_date: stop.end_date,
          notes: stop.notes,
        })
        .select('id')
        .single();

      if (stopErr || !newStop) continue;

      const activities = stop.trip_activities || [];
      if (activities.length > 0) {
        await supabase.from('trip_activities').insert(
          activities.map((ta: any) => ({
            trip_stop_id: newStop.id,
            activity_id: ta.activity_id,
            activity_order: ta.activity_order,
            activity_date: ta.activity_date,
            start_time: ta.start_time,
            end_time: ta.end_time,
            actual_cost: ta.actual_cost,
            notes: ta.notes,
          }))
        );
      }
    }

    return { newTripId, error: null };
  } catch (err: any) {
    return { newTripId: null, error: err.message || 'Failed to copy trip.' };
  }
}
