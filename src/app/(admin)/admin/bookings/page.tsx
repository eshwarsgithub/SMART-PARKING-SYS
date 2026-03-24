import { createClient } from '@/lib/supabase/server';
import { getBookingStatusBg, formatDateTime, formatDuration } from '@/lib/utils';
import { formatCurrency } from '@/lib/pricing';
import { AdminBookingActions } from '@/components/admin/AdminBookingActions';

export const dynamic = 'force-dynamic';

const statusStyle: Record<string, string> = {
  confirmed: 'text-blue-400 bg-blue-500/10',
  active:    'text-emerald-400 bg-emerald-500/10',
  completed: 'text-white/35 bg-white/5',
  cancelled: 'text-red-400 bg-red-500/10',
};

export default async function AdminBookingsPage() {
  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, parking_spots(spot_number, floor, parking_lots(name)), profiles(email, full_name)')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-white text-3xl mb-1"
          style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
        >
          All Bookings
        </h1>
        <p className="text-white/40 text-sm font-body font-light">{bookings?.length ?? 0} total bookings</p>
      </div>

      <div className="liquid-glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['ID', 'User', 'Lot / Spot', 'Start', 'Duration', 'Amount', 'Vehicle', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-white/35 text-xs font-body font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings && bookings.length > 0 ? (
                bookings.map((booking) => {
                  const spot    = booking.parking_spots as { spot_number?: string; floor?: number; parking_lots?: { name?: string } } | null;
                  const profile = booking.profiles as { email?: string; full_name?: string } | null;
                  const style   = statusStyle[booking.status] || 'text-white/35 bg-white/5';
                  return (
                    <tr key={booking.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-white/30 text-xs font-mono font-body">
                          {booking.id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white/80 text-sm font-body font-medium">{profile?.full_name || '—'}</p>
                        <p className="text-white/35 text-xs font-body font-light">{profile?.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white/80 text-sm font-body">{spot?.parking_lots?.name}</p>
                        <p className="text-white/35 text-xs font-body font-light">
                          Spot {spot?.spot_number} · F{spot?.floor}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-white/60 text-xs font-body font-light">
                        {formatDateTime(booking.starts_at)}
                      </td>
                      <td className="px-4 py-3 text-white/60 text-xs font-body font-light">
                        {booking.duration_minutes != null ? formatDuration(booking.duration_minutes) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-white text-sm"
                          style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
                        >
                          {formatCurrency(booking.total_amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/50 text-xs font-mono font-body">
                        {booking.vehicle_plate}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-body font-medium rounded-full px-2.5 py-1 ${style}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <AdminBookingActions bookingId={booking.id} currentStatus={booking.status} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center text-white/25 py-16 text-sm font-body font-light">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
