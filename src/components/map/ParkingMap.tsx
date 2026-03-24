'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ParkingLot } from '@/lib/supabase/types';
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM, SPOT_COLORS } from '@/lib/constants';

// Fix Leaflet default marker icons with Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function getLotColor(availableSpots: number, totalSpots: number): string {
  const pct = totalSpots > 0 ? availableSpots / totalSpots : 0;
  if (pct > 0.3) return SPOT_COLORS.available;
  if (pct > 0) return '#f97316';
  return SPOT_COLORS.occupied;
}

function createLotIcon(availableSpots: number, totalSpots: number, distanceKm?: number) {
  const color = getLotColor(availableSpots, totalSpots);
  const distLine = distanceKm != null
    ? `<text x="26" y="40" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-size="7.5" font-family="Arial">${distanceKm < 1 ? Math.round(distanceKm * 1000) + 'm' : distanceKm.toFixed(1) + 'km'}</text>`
    : '';
  const svgHeight = distanceKm != null ? 56 : 48;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="52" height="${svgHeight}" viewBox="0 0 52 ${svgHeight}">
      <circle cx="26" cy="26" r="25" fill="none" stroke="${color}" stroke-opacity="0.3" stroke-width="2"/>
      <circle cx="26" cy="26" r="22" fill="${color}" fill-opacity="0.92"/>
      <circle cx="26" cy="26" r="22" fill="rgba(0,0,0,0.22)"/>
      <text x="26" y="21" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="9" font-weight="600" font-family="Arial">P</text>
      <text x="26" y="32" text-anchor="middle" fill="white" font-size="13" font-weight="700" font-family="Arial">${availableSpots}</text>
      ${distLine}
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [52, svgHeight],
    iconAnchor: [26, svgHeight / 2],
    tooltipAnchor: [0, -30],
  });
}

interface ParkingMapProps {
  lots: ParkingLot[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onLotSelect?: (lotId: string) => void;
  userLocation?: [number, number] | null;
}

export default function ParkingMap({
  lots,
  center,
  zoom,
  height = '100%',
  onLotSelect,
  userLocation,
}: ParkingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  // Reconciliation map: lotId → Marker
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());
  const userDotRef = useRef<L.CircleMarker | null>(null);
  const onLotSelectRef = useRef(onLotSelect);
  onLotSelectRef.current = onLotSelect;

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current as HTMLDivElement & { _leaflet_id?: number };
    if (el._leaflet_id !== undefined) delete el._leaflet_id;
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

    const map = L.map(containerRef.current, {
      center: center ?? MAP_DEFAULT_CENTER,
      zoom: zoom ?? MAP_DEFAULT_ZOOM,
      zoomControl: true,
    });

    // CartoDB Dark Matter tiles — purpose-built for dark UIs, no API key needed
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      markersMapRef.current.forEach((m) => m.remove());
      markersMapRef.current.clear();
      userDotRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pan/zoom when center prop changes (lot selected or geocode result)
  useEffect(() => {
    if (!mapRef.current || !center) return;
    mapRef.current.setView(center, zoom ?? mapRef.current.getZoom(), { animate: true });
  }, [center, zoom]);

  // Reconcile markers: update existing, add new, remove stale
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const existingMap = markersMapRef.current;
    const newIds = new Set(lots.map((l) => l.id));

    // Remove stale markers
    existingMap.forEach((marker, id) => {
      if (!newIds.has(id)) {
        marker.remove();
        existingMap.delete(id);
      }
    });

    lots.forEach((lot) => {
      const distKm = undefined; // filled in by userLocation effect below
      if (existingMap.has(lot.id)) {
        // Update icon only — no DOM flicker
        existingMap.get(lot.id)!.setIcon(createLotIcon(lot.available_spots, lot.total_spots, distKm));
      } else {
        // Create new marker
        const icon = createLotIcon(lot.available_spots, lot.total_spots, distKm);
        const marker = L.marker([lot.lat, lot.lng], { icon }).addTo(map);
        marker.bindTooltip(lot.name, { direction: 'top', offset: [0, -6], className: 'leaflet-dark-tooltip' });
        marker.on('click', () => {
          if (onLotSelectRef.current) {
            onLotSelectRef.current(lot.id);
          }
        });
        existingMap.set(lot.id, marker);
      }
    });
  }, [lots]);

  // Update markers with distance when userLocation changes
  useEffect(() => {
    if (!mapRef.current) return;

    lots.forEach((lot) => {
      const marker = markersMapRef.current.get(lot.id);
      if (!marker) return;
      const distKm = userLocation
        ? haversineKm(userLocation[0], userLocation[1], lot.lat, lot.lng)
        : undefined;
      marker.setIcon(createLotIcon(lot.available_spots, lot.total_spots, distKm));
    });

    // Render/update user location dot
    if (userLocation) {
      if (mapRef.current && !userDotRef.current) {
        userDotRef.current = L.circleMarker(userLocation, {
          radius: 8,
          fillColor: '#3b82f6',
          color: 'rgba(59,130,246,0.4)',
          weight: 8,
          fillOpacity: 1,
        }).addTo(mapRef.current);
        userDotRef.current.bindTooltip('You are here', { direction: 'top', permanent: false });
      } else if (userDotRef.current) {
        userDotRef.current.setLatLng(userLocation);
      }
      mapRef.current?.setView(userLocation, 15, { animate: true });
    } else {
      userDotRef.current?.remove();
      userDotRef.current = null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation]);

  return (
    <div ref={containerRef} style={{ height, width: '100%' }} />
  );
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
