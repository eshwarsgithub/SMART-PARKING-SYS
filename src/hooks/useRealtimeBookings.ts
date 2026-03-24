'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Booking } from '@/lib/supabase/types';
import { toast } from 'sonner';

export function useRealtimeBookings(userId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchBookings = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        parking_spots (
          *,
          parking_lots (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return;
    }
    setBookings((data ?? []) as Booking[]);
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchBookings();

    const channel = supabase
      .channel(`bookings-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const updated = payload.new as Booking;
          setBookings((prev) =>
            prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b))
          );

          // Toast notification on status change
          const statusMessages: Record<string, string> = {
            active: 'Your parking session has started!',
            completed: 'Your parking session has ended.',
            cancelled: 'Your booking has been cancelled.',
          };
          if (statusMessages[updated.status]) {
            toast.info(statusMessages[updated.status]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId, fetchBookings]);

  return { bookings, loading, refetch: fetchBookings };
}
