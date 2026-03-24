import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const lotId = searchParams.get('lot_id');
    const spotType = searchParams.get('spot_type');
    const status = searchParams.get('status');

    let query = supabase.from('parking_spots').select('*').order('spot_number');

    if (lotId) query = query.eq('lot_id', lotId);
    if (spotType) query = query.eq('spot_type', spotType);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Spots fetch error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
