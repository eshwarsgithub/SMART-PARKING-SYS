'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Booking } from '@/lib/supabase/types';
import { Navbar } from '@/components/shared/Navbar';
import { BookingTimeline } from '@/components/booking/BookingTimeline';
import { CancelDialog } from '@/components/booking/CancelDialog';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelOpen, setCancelOpen] = useState(false);

  const fetchBooking = useCallback(async () => {
    const res = await fetch(`/api/bookings/${id}`);
    if (res.ok) {
      const data = await res.json();
      setBooking(data);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchBooking(); }, [id, fetchBooking]);

  const canCancel = booking && ['confirmed', 'active'].includes(booking.status);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-32">
          <LoadingSpinner size="lg" label="Loading booking..." />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h2 className="text-xl font-bold mb-2">Booking not found</h2>
          <Link href="/bookings"><Button>Back to Bookings</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/bookings"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> All Bookings
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Booking Details</h1>
              <p className="text-muted-foreground text-sm">ID: {booking.id.slice(-8).toUpperCase()}</p>
            </div>
            {canCancel && (
              <Button variant="destructive" size="sm" onClick={() => setCancelOpen(true)}>
                <XCircle className="h-4 w-4 mr-2" /> Cancel
              </Button>
            )}
          </div>
        </div>

        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <BookingTimeline booking={booking} />
          </CardContent>
        </Card>

        <CancelDialog
          bookingId={booking.id}
          open={cancelOpen}
          onOpenChange={setCancelOpen}
          onSuccess={() => {
            fetchBooking();
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
