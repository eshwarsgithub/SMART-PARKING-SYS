'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Car, ArrowUpRight, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const NAV_LINKS = [
  { label: 'Find Parking', href: '/map' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
];

export function LandingNavbar() {
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div
        className="max-w-5xl mx-auto flex items-center justify-between gap-4 transition-all duration-300"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="liquid-glass rounded-full w-10 h-10 flex items-center justify-center">
            <Car className="h-5 w-5 text-white" />
          </div>
          <span
            className="font-heading italic text-white text-lg hidden sm:inline select-none"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            SafePark
          </span>
        </Link>

        {/* Desktop center pill */}
        <nav className="hidden md:flex liquid-glass rounded-full px-2 py-1.5 items-center gap-0.5">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="px-3 py-1.5 text-sm text-white/75 hover:text-white transition-colors rounded-full hover:bg-white/5"
              style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400 }}
            >
              {label}
            </Link>
          ))}
          <Link
            href={user ? '/map' : '/login'}
            className="ml-1 bg-white text-black rounded-full px-4 py-1.5 text-sm font-medium hover:bg-white/90 transition-all flex items-center gap-1 shrink-0"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            {user ? 'Dashboard' : 'Get Started'}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden liquid-glass rounded-full w-10 h-10 flex items-center justify-center text-white"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden mt-2 max-w-5xl mx-auto liquid-glass-strong rounded-2xl p-3 space-y-1">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-white/75 text-sm rounded-xl hover:bg-white/5 transition-colors"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              {label}
            </Link>
          ))}
          <Link
            href={user ? '/map' : '/login'}
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 bg-white text-black font-medium text-sm rounded-xl text-center mt-1"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            {user ? 'Dashboard' : 'Get Started'}
          </Link>
          {user && (
            <button
              onClick={() => { signOut(); setOpen(false); }}
              className="w-full px-4 py-2 text-white/40 text-xs text-center"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              Sign out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
