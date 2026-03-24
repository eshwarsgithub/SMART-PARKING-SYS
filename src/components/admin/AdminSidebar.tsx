'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, MapPin, Calendar, DollarSign,
  BarChart2, Car, LogOut,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin',           label: 'Dashboard',    icon: LayoutDashboard, exact: true },
  { href: '/admin/lots',      label: 'Parking Lots', icon: MapPin,           exact: false },
  { href: '/admin/bookings',  label: 'Bookings',     icon: Calendar,         exact: false },
  { href: '/admin/pricing',   label: 'Pricing',      icon: DollarSign,       exact: false },
  { href: '/admin/analytics', label: 'Analytics',    icon: BarChart2,        exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-black border-r border-white/[0.06]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2">
          <div className="liquid-glass rounded-full w-8 h-8 flex items-center justify-center">
            <Car className="h-4 w-4 text-white" />
          </div>
          <span
            className="text-white"
            style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: '1.1rem' }}
          >
            SafePark
          </span>
        </Link>
        <p className="text-white/30 text-xs mt-1 font-body font-light pl-10">Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all font-body',
                isActive
                  ? 'liquid-glass-strong text-white font-medium'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/[0.03]'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5 px-2 mb-2">
          <div
            className="h-7 w-7 rounded-full liquid-glass flex items-center justify-center text-white text-xs font-medium shrink-0"
            style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
          >
            {profile?.full_name?.[0] || profile?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-white/80 text-xs font-body font-medium truncate">
              {profile?.full_name || 'Admin'}
            </p>
            <p className="text-white/30 text-[10px] font-body font-light truncate">{profile?.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/35 text-xs font-body hover:text-white/60 hover:bg-white/[0.03] transition-all"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
