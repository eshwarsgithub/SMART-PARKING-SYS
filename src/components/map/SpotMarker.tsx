'use client';

import { useRouter } from 'next/navigation';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { ParkingLot } from '@/lib/supabase/types';
import { SPOT_COLORS } from '@/lib/constants';

interface LotMarkerProps {
  lot: ParkingLot;
}

function createLotIcon(availableSpots: number, totalSpots: number) {
  const pct = totalSpots > 0 ? availableSpots / totalSpots : 0;
  const color = pct > 0.3 ? SPOT_COLORS.available : pct > 0 ? '#f97316' : SPOT_COLORS.occupied;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="54" viewBox="0 0 44 54">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.5)"/>
        </filter>
      </defs>
      <path d="M22 0C10 0 0 10 0 22c0 16.7 22 32 22 32s22-15.3 22-32C44 10 34 0 22 0z"
        fill="${color}" filter="url(#shadow)"/>
      <circle cx="22" cy="22" r="14" fill="rgba(0,0,0,0.3)"/>
      <text x="22" y="26" text-anchor="middle" fill="white" font-size="12" font-weight="bold" font-family="Arial">${availableSpots}</text>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [44, 54],
    iconAnchor: [22, 54],
    popupAnchor: [0, -54],
  });
}

export function LotMarker({ lot }: LotMarkerProps) {
  const router = useRouter();
  const icon = createLotIcon(lot.available_spots, lot.total_spots);

  return (
    <Marker position={[lot.lat, lot.lng]} icon={icon}>
      <Popup>
        <div className="min-w-[180px] p-1">
          <h3 className="font-semibold text-sm mb-1">{lot.name}</h3>
          <p className="text-xs text-muted-foreground mb-2">{lot.address}</p>
          <div className="flex justify-between text-xs mb-3">
            <span className="text-green-400 font-medium">{lot.available_spots} available</span>
            <span className="text-muted-foreground">{lot.total_spots} total</span>
          </div>
          <button
            onClick={() => router.push(`/map?lot=${lot.id}`)}
            className="w-full bg-primary text-primary-foreground text-xs py-1.5 px-3 rounded font-medium hover:bg-primary/90 transition-colors"
          >
            View Spots
          </button>
        </div>
      </Popup>
    </Marker>
  );
}
