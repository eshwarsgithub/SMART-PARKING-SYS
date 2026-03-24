'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ParkingSpot } from '@/lib/supabase/types';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

const supabase = createClient();

export function useRealtimeSpots(lotId?: string) {
  const [spots, setSpots] = useState<Map<string, ParkingSpot>>(new Map());
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const lotIdRef = useRef(lotId);

  const fetchSpots = useCallback(async () => {
    let query = supabase.from('parking_spots').select('*');
    if (lotIdRef.current) query = query.eq('lot_id', lotIdRef.current);

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching spots:', error.message, error);
      return;
    }

    const map = new Map<string, ParkingSpot>();
    data?.forEach((spot) => map.set(spot.id, spot as ParkingSpot));
    setSpots(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    lotIdRef.current = lotId;
    fetchSpots();

    const channelName = lotId ? `spots-lot-${lotId}` : 'spots-all';

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'parking_spots', filter: lotId ? `lot_id=eq.${lotId}` : undefined },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setSpots((prev) => {
              const next = new Map(prev);
              next.delete(payload.old.id);
              return next;
            });
          } else {
            const spot = payload.new as ParkingSpot;
            setSpots((prev) => new Map(prev).set(spot.id, spot));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setConnectionStatus('connected');
        else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') setConnectionStatus('disconnected');
        else setConnectionStatus('connecting');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lotId, fetchSpots]);

  const spotsArray = Array.from(spots.values());

  return {
    spots: spotsArray,
    spotsMap: spots,
    loading,
    connectionStatus,
    refetch: fetchSpots,
  };
}
