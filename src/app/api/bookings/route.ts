import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { bookingSchema } from '@/lib/validations';
import { calculateCost, getPricingForSpot } from '@/lib/pricing';
import type { PricingRule, SpotType } from '@/lib/supabase/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { spot_id, lot_id, starts_at, ends_at, vehicle_plate, notes } = parsed.data;

    // Fetch pricing rule
    const { data: spot } = await supabase
      .from('parking_spots')
      .select('spot_type, status')
      .eq('id', spot_id)
      .single();

    if (!spot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    if (spot.status !== 'available') {
      return NextResponse.json({ error: 'Spot is not available' }, { status: 409 });
    }

    const { data: pricingRules } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('lot_id', lot_id);

    const pricing = getPricingForSpot(
      (pricingRules ?? []) as PricingRule[],
      lot_id,
      spot.spot_type as SpotType
    );
    const total_amount = pricing
      ? calculateCost(new Date(starts_at), new Date(ends_at), pricing.price_per_hour)
      : 0;

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        spot_id,
        lot_id,
        starts_at,
        ends_at,
        total_amount,
        vehicle_plate,
        notes,
        status: 'confirmed',
      })
      .select()
      .single();

    if (error) {
      // Handle exclusion constraint violation (double booking)
      if (error.code === '23P01') {
        return NextResponse.json(
          { error: 'This time slot is already booked. Please choose another.' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    console.error('Booking creation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    // Check admin access if requesting other user's bookings
    if (userId && userId !== user.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    let query = supabase
      .from('bookings')
      .select(`*, parking_spots(*, parking_lots(*)), profiles(*)`)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    } else if (!userId) {
      // Check if admin to decide scope
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        query = query.eq('user_id', user.id);
      }
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Booking fetch error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
