'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Car, MapPin, Calendar, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { RealtimeIndicator } from './RealtimeIndicator';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/map',      label: 'Find Parking', icon: MapPin },
  { href: '/bookings', label: 'My Bookings',  icon: Calendar },
  { href: '/profile',  label: 'Profile',       icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, profile, signOut, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="liquid-glass rounded-full w-8 h-8 flex items-center justify-center">
              <Car className="h-4 w-4 text-white" />
            </div>
            <span
              className="text-white hidden sm:inline select-none"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: '1.1rem' }}
            >
              SafePark
            </span>
          </Link>

          {/* Desktop nav */}
          {user && (
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all font-body',
                      active
                        ? 'liquid-glass-strong text-white font-medium'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </Link>
                );
              })}
              {isAdmin && (
                <Link
                  href="/admin"
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all font-body',
                    pathname.startsWith('/admin')
                      ? 'liquid-glass-strong text-white font-medium'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                  )}
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
            </div>
          )}

          {/* Right */}
          <div className="flex items-center gap-3">
            <RealtimeIndicator />
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-white/40 text-xs font-body font-light">
                  {profile?.full_name || profile?.email}
                </span>
                <button
                  onClick={signOut}
                  className="liquid-glass rounded-full w-7 h-7 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-white text-black rounded-full px-4 py-1.5 text-xs font-medium font-body hover:bg-white/90 transition-all"
              >
                Sign In
              </Link>
            )}
            {user && (
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden liquid-glass rounded-full w-8 h-8 flex items-center justify-center text-white"
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {open && user && (
          <div className="md:hidden pb-3 space-y-1 border-t border-white/[0.06] pt-3">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all font-body',
                  pathname.startsWith(href)
                    ? 'liquid-glass text-white font-medium'
                    : 'text-white/50 hover:text-white/80'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-white/50 hover:text-white/80 font-body"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </Link>
            )}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between px-3">
              <span className="text-white/30 text-xs font-body font-light">{profile?.email}</span>
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 text-white/40 text-xs font-body hover:text-white/70"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
