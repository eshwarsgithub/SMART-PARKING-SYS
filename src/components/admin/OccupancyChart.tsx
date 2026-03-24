'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface OccupancyChartProps {
  data: { name: string; available: number; occupied: number; total: number }[];
}

export function OccupancyChart({ data }: OccupancyChartProps) {
  return (
    <div className="liquid-glass rounded-2xl p-6">
      <p
        className="text-white text-base mb-5"
        style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
      >
        Lot Occupancy
      </p>
      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-white/25 text-sm font-body font-light">
          No occupancy data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Barlow' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Barlow' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: 'rgba(255,255,255,0.8)', fontFamily: 'Barlow', fontSize: 12 }}
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'Barlow' }} />
            <Bar dataKey="available" fill="rgba(52,211,153,0.7)" radius={[4, 4, 0, 0]} name="Available" />
            <Bar dataKey="occupied"  fill="rgba(239,68,68,0.6)"  radius={[4, 4, 0, 0]} name="Occupied" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
