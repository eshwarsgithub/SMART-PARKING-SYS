import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/pricing';
import { StatsCard } from '@/components/admin/StatsCard';
import { OccupancyChart } from '@/components/admin/OccupancyChart';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { TrendingUp, Car, Calendar, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  const [
    { data: bookings },
    { data: lots },
    { count: userCount },
  ] = await Promise.all([
    supabase.from('bookings').select('total_amount, status, created_at, lot_id').order('created_at', { ascending: true }),
    supabase.from('parking_lots').select('*'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
  ]);

  const completedBookings = bookings?.filter((b) => b.status !== 'cancelled') ?? [];
  const totalRevenue      = completedBookings.reduce((sum, b) => sum + Number(b.total_amount), 0);
  const cancelledCount    = bookings?.filter((b) => b.status === 'cancelled').length ?? 0;

  const revenueByMonth: Record<string, number> = {};
  completedBookings.forEach((b) => {
    const month = new Date(b.created_at).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    revenueByMonth[month] = (revenueByMonth[month] || 0) + Number(b.total_amount);
  });
  const revenueChartData = Object.entries(revenueByMonth).slice(-6)
    .map(([month, revenue]) => ({ month, revenue: Math.round(revenue) }));

  const occupancyData = lots?.map((lot) => ({
    name: lot.name.replace(' Parking', ''),
    available: lot.available_spots,
    occupied: lot.total_spots - lot.available_spots,
    total: lot.total_spots,
  })) ?? [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-white text-3xl mb-1"
          style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
        >
          Analytics
        </h1>
        <p className="text-white/40 text-sm font-body font-light">Revenue and occupancy insights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Revenue"     value={formatCurrency(totalRevenue)} icon={TrendingUp} iconColor="text-emerald-400" changeType="positive" />
        <StatsCard title="Total Bookings"    value={bookings?.length ?? 0}        icon={Calendar}   iconColor="text-blue-400" />
        <StatsCard title="Registered Users"  value={userCount ?? 0}               icon={Users}      iconColor="text-violet-400" />
        <StatsCard
          title="Cancellation Rate"
          value={bookings && bookings.length > 0 ? `${Math.round((cancelledCount / bookings.length) * 100)}%` : '0%'}
          icon={Car}
          iconColor="text-orange-400"
          changeType={cancelledCount > 0 ? 'negative' : 'positive'}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <RevenueChart data={revenueChartData} />
        <OccupancyChart data={occupancyData} />
      </div>
    </div>
  );
}
