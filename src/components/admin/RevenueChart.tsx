'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/pricing';

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="liquid-glass rounded-2xl p-6">
      <p
        className="text-white text-base mb-5"
        style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
      >
        Revenue Over Time
      </p>
      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-white/25 text-sm font-body font-light">
          No revenue data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="rgba(99,179,237,1)"  stopOpacity={0.25} />
                <stop offset="95%" stopColor="rgba(99,179,237,1)"  stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Barlow' }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Barlow' }}
              axisLine={false} tickLine={false}
            />
            <Tooltip
              contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: 'rgba(255,255,255,0.8)', fontFamily: 'Barlow', fontSize: 12 }}
              cursor={{ stroke: 'rgba(255,255,255,0.06)' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(val: any) => [formatCurrency(Number(val) || 0), 'Revenue']}
            />
            <Area type="monotone" dataKey="revenue" stroke="rgba(99,179,237,0.8)" strokeWidth={2} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
