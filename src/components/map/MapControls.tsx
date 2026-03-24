'use client';

import { SpotType } from '@/lib/supabase/types';
import { getSpotTypeIcon, getSpotTypeLabel } from '@/lib/utils';
import { X } from 'lucide-react';

const SPOT_TYPES: SpotType[] = ['standard', 'ev', 'handicap', 'motorcycle'];

interface MapControlsProps {
  selectedTypes: SpotType[];
  onTypeToggle: (type: SpotType) => void;
  onClearFilters: () => void;
  showAvailableOnly: boolean;
  onToggleAvailable: () => void;
}

export function MapControls({
  selectedTypes,
  onTypeToggle,
  onClearFilters,
  showAvailableOnly,
  onToggleAvailable,
}: MapControlsProps) {
  const hasFilters = selectedTypes.length > 0 || showAvailableOnly;

  return (
    <div className="flex flex-wrap items-center gap-2 liquid-glass rounded-2xl px-3 py-2.5">
      <span
        className="text-xs text-white/30 font-body font-light"
        style={{ fontFamily: "'Barlow', sans-serif" }}
      >
        Filter
      </span>
      {SPOT_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onTypeToggle(type)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all font-body ${
            selectedTypes.includes(type)
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-white/40 hover:text-white/70 hover:bg-white/5'
          }`}
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          <span>{getSpotTypeIcon(type)}</span>
          <span>{getSpotTypeLabel(type)}</span>
        </button>
      ))}
      <button
        onClick={onToggleAvailable}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all font-body ${
          showAvailableOnly
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : 'text-white/40 hover:text-white/70 hover:bg-white/5'
        }`}
        style={{ fontFamily: "'Barlow', sans-serif" }}
      >
        Available only
      </button>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white/30 hover:text-white/60 transition-colors"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          <X className="h-3 w-3" /> Clear
        </button>
      )}
    </div>
  );
}
