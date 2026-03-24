'use client';

import { format } from 'date-fns';
import { Booking } from '@/lib/supabase/types';
import { getBookingStatusBg, formatDuration } from '@/lib/utils';
import { formatCurrency } from '@/lib/pricing';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Car, MapPin, IndianRupee } from 'lucide-react';

interface BookingTimelineProps {
  booking: Booking;
}

export function BookingTimeline({ booking }: BookingTimelineProps) {
  const lot = booking.parking_spots?.parking_lots;
  const spot = booking.parking_spots;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Booking Timeline</h3>
        <Badge className={getBookingStatusBg(booking.status)}>{booking.status}</Badge>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-border" />

        <div className="space-y-6">
          {/* Start */}
          <div className="flex items-start gap-4">
            <div className="h-8 w-8 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center flex-shrink-0 relative z-10">
              <Calendar className="h-3.5 w-3.5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Start</p>
              <p className="font-medium">{format(new Date(booking.starts_at), 'PPp')}</p>
            </div>
          </div>

          {/* End */}
          <div className="flex items-start gap-4">
            <div className="h-8 w-8 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center flex-shrink-0 relative z-10">
              <Clock className="h-3.5 w-3.5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">End</p>
              <p className="font-medium">{format(new Date(booking.ends_at), 'PPp')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="bg-secondary/50 rounded-md p-3 text-sm">
          <p className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
            <Clock className="h-3 w-3" /> Duration
          </p>
          <p className="font-medium">{formatDuration(booking.duration_minutes)}</p>
        </div>
        <div className="bg-secondary/50 rounded-md p-3 text-sm">
          <p className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
            <IndianRupee className="h-3 w-3" /> Amount
          </p>
          <p className="font-medium">{formatCurrency(booking.total_amount)}</p>
        </div>
        {spot && (
          <div className="bg-secondary/50 rounded-md p-3 text-sm">
            <p className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
              <Car className="h-3 w-3" /> Spot
            </p>
            <p className="font-medium">{spot.spot_number} (Floor {spot.floor})</p>
          </div>
        )}
        <div className="bg-secondary/50 rounded-md p-3 text-sm">
          <p className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
            <Car className="h-3 w-3" /> Vehicle
          </p>
          <p className="font-medium">{booking.vehicle_plate}</p>
        </div>
        {lot && (
          <div className="bg-secondary/50 rounded-md p-3 text-sm col-span-2">
            <p className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
              <MapPin className="h-3 w-3" /> Location
            </p>
            <p className="font-medium">{lot.name}</p>
            <p className="text-xs text-muted-foreground">{lot.address}</p>
          </div>
        )}
      </div>
    </div>
  );
}
