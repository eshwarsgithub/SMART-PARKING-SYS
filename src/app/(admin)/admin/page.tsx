import { createClient } from '@/lib/supabase/server';
import { StatsCard } from '@/components/admin/StatsCard';
import { formatCurrency } from '@/lib/pricing';
import { TrendingUp, MapPin, Calendar, Car } from 'lucide-react';
import { getBookingStatusBg, formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalLots },
    { count: totalBookings },
    { data: recentBookings },
    { data: lots },
  ] = await Promise.all([
    supabase.from('parking_lots').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase
      .from('bookings')
      .select('*, parking_spots(spot_number, parking_lots(name)), profiles(email, full_name)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('parking_lots').select('*').eq('is_active', true),
  ]);

  const { data: revenueData } = await supabase
    .from('bookings').select('total_amount').not('status', 'eq', 'cancelled');

  const totalRevenue = revenueData?.reduce((sum, b) => sum + Number(b.total_amount), 0) ?? 0;
  const availableSpots = lots?.reduce((sum, l) => sum + l.available_spots, 0) ?? 0;
  const totalSpotsCount = lots?.reduce((sum, l) => sum + l.total_spots, 0) ?? 0;
  const occupancyRate = totalSpotsCount > 0
    ? Math.round(((totalSpotsCount - availableSpots) / totalSpotsCount) * 100)
    : 0;

  const statusColors: Record<string, string> = {
    confirmed: 'text-blue-400',
    active: 'text-emerald-400',
    completed: 'text-white/40',
    cancelled: 'text-red-400',
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-white text-3xl mb-1"
          style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
        >
          Dashboard
        </h1>
        <p className="text-white/40 text-sm font-body font-light">Overview of SafePark operations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Revenue" value={formatCurrency(totalRevenue)} change="All time" changeType="positive" icon={TrendingUp} iconColor="text-emerald-400" />
        <StatsCard title="Active Lots" value={totalLots ?? 0} icon={MapPin} iconColor="text-blue-400" />
        <StatsCard title="Total Bookings" value={totalBookings ?? 0} icon={Calendar} iconColor="text-violet-400" />
        <StatsCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          change={`${availableSpots} spots available`}
          changeType={occupancyRate > 80 ? 'negative' : 'positive'}
          icon={Car}
          iconColor="text-orange-400"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent bookings */}
        <div className="liquid-glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-base" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
              Recent Bookings
            </h2>
            <Link href="/admin/bookings" className="liquid-glass rounded-full px-3 py-1 text-white/50 text-xs font-body flex items-center gap-1 hover:text-white transition-colors">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {recentBookings && recentBookings.length > 0 ? (
            <div className="space-y-0">
              {recentBookings.map((booking) => {
                const profile = booking.profiles as { full_name?: string; email?: string } | null;
                const spot = booking.parking_spots as { spot_number?: string; parking_lots?: { name?: string } } | null;
                return (
                  <div key={booking.id} className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
                    <div>
                      <p className="text-white text-sm font-body font-medium">{profile?.full_name || profile?.email}</p>
                      <p className="text-white/35 text-xs font-body font-light mt-0.5">
                        {spot?.parking_lots?.name} · Spot {spot?.spot_number}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-body ${statusColors[booking.status] || 'text-white/40'}`}>
                        {booking.status}
                      </span>
                      <p className="text-white/35 text-xs font-body font-light mt-0.5">
                        {formatCurrency(booking.total_amount)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-white/30 text-sm text-center py-8 font-body font-light">No bookings yet</p>
          )}
        </div>

        {/* Lot occupancy */}
        <div className="liquid-glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-base" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
              Lot Occupancy
            </h2>
            <Link href="/admin/lots" className="liquid-glass rounded-full px-3 py-1 text-white/50 text-xs font-body flex items-center gap-1 hover:text-white transition-colors">
              Manage <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {lots && lots.length > 0 ? (
            <div className="space-y-5">
              {lots.map((lot) => {
                const pct = lot.total_spots > 0
                  ? Math.round(((lot.total_spots - lot.available_spots) / lot.total_spots) * 100) : 0;
                return (
                  <div key={lot.id}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/80 text-xs font-body font-medium truncate">{lot.name}</span>
                      <span className="text-white/35 text-xs font-body font-light ml-2 shrink-0">
                        {lot.available_spots}/{lot.total_spots} free
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-white/25 text-[10px] font-body font-light mt-1">{pct}% occupied</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-white/30 text-sm text-center py-8 font-body font-light">No lots configured</p>
          )}
        </div>
      </div>
    </div>
  );
}
