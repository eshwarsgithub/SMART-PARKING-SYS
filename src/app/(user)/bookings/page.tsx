'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRealtimeBookings } from '@/hooks/useRealtimeBookings';
import { Navbar } from '@/components/shared/Navbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { getBookingStatusBg, formatDateTime, formatDuration } from '@/lib/utils';
import { formatCurrency } from '@/lib/pricing';
import { Calendar, MapPin, Car, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';

const statusStyle: Record<string, string> = {
  confirmed: 'text-blue-400 bg-blue-500/10',
  active:    'text-emerald-400 bg-emerald-500/10',
  completed: 'text-white/35 bg-white/5',
  cancelled: 'text-red-400 bg-red-500/10',
};

export default function BookingsPage() {
  const { user } = useAuth();
  const { bookings, loading } = useRealtimeBookings(user?.id);

  const active = bookings.filter((b) => ['confirmed', 'active'].includes(b.status));
  const past   = bookings.filter((b) => ['completed', 'cancelled'].includes(b.status));

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-white text-3xl mb-1"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
            >
              My Bookings
            </h1>
            <p className="text-white/40 text-sm font-body font-light">Track and manage your reservations</p>
          </div>
          <Link
            href="/map"
            className="liquid-glass-strong rounded-full px-4 py-2 flex items-center gap-1.5 text-white text-sm font-body font-medium hover:bg-white/[0.06] transition-all"
          >
            <Plus className="h-3.5 w-3.5" /> New
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" label="Loading bookings…" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="liquid-glass rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-5">
              <Calendar className="h-7 w-7 text-white/40" />
            </div>
            <h3
              className="text-white text-xl mb-2"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
            >
              No bookings yet
            </h3>
            <p className="text-white/40 text-sm font-body font-light mb-6">Start by finding a parking spot</p>
            <Link
              href="/map"
              className="bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium font-body inline-flex items-center gap-1.5 hover:bg-white/90 transition-all"
            >
              Find Parking
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {active.length > 0 && (
              <section>
                <p className="text-white/35 text-xs font-body font-medium uppercase tracking-widest mb-3">
                  Active &amp; Upcoming
                </p>
                <div className="space-y-2.5">
                  {active.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
                </div>
              </section>
            )}
            {past.length > 0 && (
              <section>
                <p className="text-white/35 text-xs font-body font-medium uppercase tracking-widest mb-3">
                  Past Bookings
                </p>
                <div className="space-y-2.5">
                  {past.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking }: { booking: ReturnType<typeof useRealtimeBookings>['bookings'][number] }) {
  const lot  = booking.parking_spots?.parking_lots;
  const spot = booking.parking_spots;
  const style = statusStyle[booking.status] || 'text-white/35 bg-white/5';

  return (
    <Link href={`/bookings/${booking.id}`}>
      <div className="liquid-glass rounded-2xl p-5 hover:bg-white/[0.03] transition-all cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-body font-medium rounded-full px-2 py-0.5 ${style}`}>
                {booking.status}
              </span>
              <span className="text-white/25 text-[10px] font-body font-light">#{booking.id.slice(-6).toUpperCase()}</span>
            </div>
            <p
              className="text-white truncate"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: '1rem' }}
            >
              {lot?.name}
            </p>
            <p className="text-white/40 text-xs font-body font-light flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" /> Spot {spot?.spot_number} · Floor {spot?.floor}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-white/30 text-xs font-body font-light flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {formatDateTime(booking.starts_at)}
              </span>
              <span className="text-white/30 text-xs font-body font-light flex items-center gap-1">
                <Car className="h-3 w-3" /> {booking.vehicle_plate}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p
              className="text-white"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: '1rem' }}
            >
              {formatCurrency(booking.total_amount)}
            </p>
            <p className="text-white/30 text-xs font-body font-light mt-0.5">{formatDuration(booking.duration_minutes)}</p>
            <ChevronRight className="h-4 w-4 text-white/20 mt-2 ml-auto" />
          </div>
        </div>
      </div>
    </Link>
  );
}
