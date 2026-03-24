'use client';

import { useState } from 'react';
import { BookingInput } from '@/lib/validations';
import { toast } from 'sonner';

export function useBooking() {
  const [loading, setLoading] = useState(false);

  const createBooking = async (data: BookingInput) => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to create booking');
      }

      toast.success('Booking confirmed!');
      return { data: json, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
      return { data: null, error: message };
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to cancel booking');
      }

      toast.success('Booking cancelled');
      return { data: json, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
      return { data: null, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, cancelBooking, loading };
}
