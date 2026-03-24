'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function RealtimeIndicator() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel('health-check').subscribe((status) => {
      setConnected(status === 'SUBSCRIBED');
    });
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="flex items-center gap-1.5 cursor-default" title={connected ? 'Real-time updates active' : 'Connecting…'}>
      <div
        className={`h-1.5 w-1.5 rounded-full transition-colors ${
          connected ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]' : 'bg-white/20'
        }`}
      />
      <span className="text-xs font-body font-light text-white/35 hidden sm:block">
        {connected ? 'Live' : 'Connecting'}
      </span>
    </div>
  );
}
