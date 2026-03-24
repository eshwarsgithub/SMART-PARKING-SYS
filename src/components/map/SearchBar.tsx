'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface GeoResult {
  lat: number;
  lon: number;
  display_name: string;
}

interface SearchBarProps {
  onSelect: (lat: number, lon: number) => void;
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.trim().length < 2) { setResults([]); setOpen(false); return; }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
        const data: GeoResult[] = await res.json();
        setResults(data);
        setOpen(data.length > 0);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (r: GeoResult) => {
    setQuery(r.display_name.split(',')[0]);
    setOpen(false);
    onSelect(r.lat, r.lon);
  };

  const clear = () => { setQuery(''); setResults([]); setOpen(false); inputRef.current?.focus(); };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <div className="liquid-glass rounded-full flex items-center gap-2 px-3 py-2">
        <Search className={`h-3.5 w-3.5 shrink-0 ${loading ? 'text-white/50 animate-pulse' : 'text-white/30'}`} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search location…"
          className="flex-1 bg-transparent text-white text-sm placeholder:text-white/25 focus:outline-none min-w-0"
          style={{ fontFamily: "'Barlow', sans-serif" }}
          onFocus={() => results.length > 0 && setOpen(true)}
        />
        {query && (
          <button onClick={clear} className="text-white/25 hover:text-white/60 transition-colors shrink-0">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 liquid-glass-strong rounded-2xl overflow-hidden z-[500]">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => handleSelect(r)}
              className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors border-b border-white/[0.04] last:border-0"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              <span className="block truncate">{r.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
