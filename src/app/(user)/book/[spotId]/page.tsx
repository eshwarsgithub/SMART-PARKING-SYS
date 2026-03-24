import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/shared/Navbar';
import { BookingForm } from '@/components/booking/BookingForm';
import type { ParkingSpot, PricingRule } from '@/lib/supabase/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BookPage({ params }: { params: Promise<{ spotId: string }> }) {
  const { spotId } = await params;
  const supabase = await createClient();

  const [{ data: spot }, { data: pricingRules }] = await Promise.all([
    supabase
      .from('parking_spots')
      .select('*, parking_lots(*)')
      .eq('id', spotId)
      .single(),
    supabase.from('pricing_rules').select('*'),
  ]);

  if (!spot) notFound();

  const lot = spot.parking_lots as Parameters<typeof BookingForm>[0]['lot'];
  const pricingRule = pricingRules?.find(
    (r) => r.lot_id === spot.lot_id && r.spot_type === spot.spot_type
  ) as PricingRule | undefined;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/map"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Map
          </Link>
          <h1 className="text-2xl font-bold">Book Parking Spot</h1>
          <p className="text-muted-foreground">Spot {spot.spot_number} · {lot?.name}</p>
        </div>
        <BookingForm spot={spot as ParkingSpot} lot={lot!} pricingRule={pricingRule} />
      </div>
    </div>
  );
}
