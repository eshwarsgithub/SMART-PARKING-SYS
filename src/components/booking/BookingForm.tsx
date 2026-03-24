'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { addHours, addMinutes, format } from 'date-fns';
import { bookingSchema, BookingInput } from '@/lib/validations';
import { ParkingSpot, ParkingLot, PricingRule } from '@/lib/supabase/types';
import { calculateCost, formatCurrency, getDurationMinutes } from '@/lib/pricing';
import { getSpotTypeIcon, getSpotTypeLabel, getSpotStatusBg, formatDuration } from '@/lib/utils';
import { useBooking } from '@/hooks/useBooking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Car, AlertCircle } from 'lucide-react';

interface BookingFormProps {
  spot: ParkingSpot;
  lot: ParkingLot;
  pricingRule?: PricingRule;
  onSuccess?: (bookingId: string) => void;
}

export function BookingForm({ spot, lot, pricingRule, onSuccess }: BookingFormProps) {
  const router = useRouter();
  const { createBooking, loading } = useBooking();
  const [cost, setCost] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const now = new Date();
  const defaultStart = addMinutes(now, 15);
  const defaultEnd = addHours(defaultStart, 2);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      spot_id: spot.id,
      lot_id: lot.id,
      starts_at: format(defaultStart, "yyyy-MM-dd'T'HH:mm"),
      ends_at: format(defaultEnd, "yyyy-MM-dd'T'HH:mm"),
      vehicle_plate: '',
    },
  });

  const startsAt = watch('starts_at');
  const endsAt = watch('ends_at');

  useEffect(() => {
    if (startsAt && endsAt && pricingRule) {
      const start = new Date(startsAt);
      const end = new Date(endsAt);
      if (end > start) {
        const mins = getDurationMinutes(start, end);
        setDuration(mins);
        setCost(calculateCost(start, end, pricingRule.price_per_hour));
      } else {
        setDuration(0);
        setCost(0);
      }
    }
  }, [startsAt, endsAt, pricingRule]);

  const onSubmit = async (data: BookingInput) => {
    const { data: booking, error: _error } = await createBooking({
      ...data,
      starts_at: new Date(data.starts_at).toISOString(),
      ends_at: new Date(data.ends_at).toISOString(),
    });

    if (booking) {
      if (onSuccess) {
        onSuccess(booking.id);
      } else {
        router.push(`/bookings/${booking.id}`);
      }
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Spot info card */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Spot Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getSpotTypeIcon(spot.spot_type)}</span>
              <div>
                <p className="font-semibold">Spot {spot.spot_number}</p>
                <p className="text-sm text-muted-foreground">Floor {spot.floor}</p>
              </div>
            </div>
            <Badge className={getSpotStatusBg(spot.status)}>{spot.status}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-secondary/50 rounded-md p-3">
              <p className="text-muted-foreground text-xs">Type</p>
              <p className="font-medium">{getSpotTypeLabel(spot.spot_type)}</p>
            </div>
            <div className="bg-secondary/50 rounded-md p-3">
              <p className="text-muted-foreground text-xs">Rate</p>
              <p className="font-medium">
                {pricingRule ? `${formatCurrency(pricingRule.price_per_hour)}/hr` : 'Free'}
              </p>
            </div>
          </div>
          <div className="bg-secondary/50 rounded-md p-3 text-sm">
            <p className="text-muted-foreground text-xs mb-1">Location</p>
            <p className="font-medium">{lot.name}</p>
            <p className="text-muted-foreground">{lot.address}</p>
          </div>

          {duration > 0 && (
            <div className="bg-primary/10 border border-primary/30 rounded-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">{formatDuration(duration)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(cost)}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking form */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Reserve This Spot</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register('spot_id')} />
            <input type="hidden" {...register('lot_id')} />

            <div className="space-y-2">
              <Label htmlFor="starts_at" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Start Time
              </Label>
              <Input
                id="starts_at"
                type="datetime-local"
                {...register('starts_at')}
                className="bg-secondary border-border"
              />
              {errors.starts_at && (
                <p className="text-destructive text-xs">{errors.starts_at.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ends_at" className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> End Time
              </Label>
              <Input
                id="ends_at"
                type="datetime-local"
                {...register('ends_at')}
                className="bg-secondary border-border"
              />
              {errors.ends_at && (
                <p className="text-destructive text-xs">{errors.ends_at.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle_plate" className="flex items-center gap-2">
                <Car className="h-4 w-4" /> Vehicle Plate Number
              </Label>
              <Input
                id="vehicle_plate"
                type="text"
                placeholder="KA01AB1234"
                className="bg-secondary border-border uppercase"
                {...register('vehicle_plate')}
              />
              {errors.vehicle_plate && (
                <p className="text-destructive text-xs">{errors.vehicle_plate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions..."
                className="bg-secondary border-border resize-none"
                rows={2}
                {...register('notes')}
              />
            </div>

            {pricingRule && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 p-2 rounded">
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
                Minimum booking: {pricingRule.min_duration_minutes} minutes
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || spot.status !== 'available'}
            >
              {loading ? 'Processing...' : `Confirm Booking${cost > 0 ? ` — ${formatCurrency(cost)}` : ''}`}
            </Button>

            {spot.status !== 'available' && (
              <p className="text-destructive text-sm text-center">
                This spot is currently {spot.status}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
