'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ParkingLot } from '@/lib/supabase/types';
import { ConnectionStatus } from './useRealtimeSpots';

const supabase = createClient();

export function useRealtimeLots() {
  const [lots, setLots] = useState<Map<string, ParkingLot>>(new Map());
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

  const fetchLots = useCallback(async () => {
    const { data, error } = await supabase
      .from('parking_lots')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching lots:', error.message);
      return;
    }

    const map = new Map<string, ParkingLot>();
    data?.forEach((lot) => map.set(lot.id, lot as ParkingLot));
    setLots(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLots();

    const channel = supabase
      .channel('lots-all')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'parking_lots' },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setLots((prev) => {
              const next = new Map(prev);
              next.delete(payload.old.id);
              return next;
            });
          } else {
            const lot = payload.new as ParkingLot;
            if (lot.is_active) {
              setLots((prev) => new Map(prev).set(lot.id, lot));
            } else {
              setLots((prev) => {
                const next = new Map(prev);
                next.delete(lot.id);
                return next;
              });
            }
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
  }, [fetchLots]);

  return {
    lots: Array.from(lots.values()),
    lotsMap: lots,
    loading,
    connectionStatus,
    refetch: fetchLots,
  };
}
