import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, MapPin, Clock, ChevronRight, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminLotsPage() {
  const supabase = await createClient();
  const { data: lots } = await supabase
    .from('parking_lots').select('*').order('created_at', { ascending: false });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-white text-3xl mb-1"
            style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
          >
            Parking Lots
          </h1>
          <p className="text-white/40 text-sm font-body font-light">Manage your parking facilities</p>
        </div>
        <Link
          href="/admin/lots/new"
          className="bg-white text-black rounded-full px-5 py-2.5 text-sm font-medium font-body flex items-center gap-1.5 hover:bg-white/90 transition-all"
        >
          <Plus className="h-3.5 w-3.5" /> Add Lot
        </Link>
      </div>

      {!lots || lots.length === 0 ? (
        <div className="text-center py-24">
          <div className="liquid-glass rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-5">
            <MapPin className="h-7 w-7 text-white/30" />
          </div>
          <h3
            className="text-white text-xl mb-2"
            style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
          >
            No parking lots yet
          </h3>
          <p className="text-white/40 text-sm font-body font-light mb-6">Create your first parking lot to get started</p>
          <Link
            href="/admin/lots/new"
            className="bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium font-body inline-flex items-center gap-1.5 hover:bg-white/90 transition-all"
          >
            <Plus className="h-3.5 w-3.5" /> Create Lot
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {lots.map((lot) => {
            const pct = lot.total_spots > 0
              ? Math.round(((lot.total_spots - lot.available_spots) / lot.total_spots) * 100) : 0;
            return (
              <Link key={lot.id} href={`/admin/lots/${lot.id}`}>
                <div className="liquid-glass rounded-2xl p-5 hover:bg-white/[0.03] transition-all cursor-pointer group">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <h3
                          className="text-white"
                          style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: '1rem' }}
                        >
                          {lot.name}
                        </h3>
                        <span
                          className={`liquid-glass rounded-full px-2.5 py-0.5 text-[10px] font-body ${
                            lot.is_active ? 'text-emerald-400' : 'text-white/30'
                          }`}
                        >
                          {lot.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-white/35 text-xs font-body font-light flex items-center gap-1 mb-1">
                        <MapPin className="h-3 w-3" /> {lot.address}
                      </p>
                      <p className="text-white/30 text-xs font-body font-light flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {lot.open_time} – {lot.close_time}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p
                        className="text-white text-2xl"
                        style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
                      >
                        {lot.available_spots}
                      </p>
                      <p className="text-white/30 text-xs font-body font-light">of {lot.total_spots} free</p>
                      <div className="h-1 w-20 bg-white/[0.06] rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/20 mt-2 ml-auto group-hover:text-white/50 transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
