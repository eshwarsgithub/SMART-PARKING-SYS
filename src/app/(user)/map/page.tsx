'use client';

import { Suspense } from 'react';
import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Navbar } from '@/components/shared/Navbar';
import { MapControls } from '@/components/map/MapControls';
import { SearchBar } from '@/components/map/SearchBar';
import { QuickBookDrawer } from '@/components/map/QuickBookDrawer';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ParkingLot, ParkingSpot, SpotType, PricingRule } from '@/lib/supabase/types';
import { useRealtimeSpots } from '@/hooks/useRealtimeSpots';
import { useRealtimeLots } from '@/hooks/useRealtimeLots';
import { getSpotTypeIcon, haversineKm } from '@/lib/utils';
import { getPricingForSpot, formatCurrency } from '@/lib/pricing';
import { MapPin, ArrowLeft, Navigation, Clock } from 'lucide-react';

const ParkingMap = dynamic(() => import('@/components/map/ParkingMap'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-black">
      <LoadingSpinner size="lg" label="Loading map…" />
    </div>
  ),
});

const statusStyle: Record<string, { dot: string; text: string; card: string }> = {
  available:   { dot: 'bg-emerald-400', text: 'text-emerald-400', card: 'border-emerald-500/20 hover:bg-emerald-500/5 cursor-pointer' },
  occupied:    { dot: 'bg-red-400',     text: 'text-red-400',     card: 'border-white/[0.05] opacity-50 cursor-not-allowed' },
  reserved:    { dot: 'bg-amber-400',   text: 'text-amber-400',   card: 'border-white/[0.05] opacity-50 cursor-not-allowed' },
  maintenance: { dot: 'bg-gray-500',    text: 'text-gray-400',    card: 'border-white/[0.05] opacity-40 cursor-not-allowed' },
};

function SpotCard({
  spot,
  price,
  onClick,
}: {
  spot: ParkingSpot;
  price?: string;
  onClick: () => void;
}) {
  const isAvailable = spot.status === 'available';
  const s = statusStyle[spot.status] || statusStyle.occupied;
  return (
    <button
      onClick={onClick}
      disabled={!isAvailable}
      className={`p-3 rounded-xl border text-left transition-all liquid-glass ${s.card}`}
    >
      <div className="flex justify-between items-start mb-1.5">
        <span className="text-white text-sm font-body font-medium">{spot.spot_number}</span>
        <span className="text-base">{getSpotTypeIcon(spot.spot_type)}</span>
      </div>
      <p className="text-white/35 text-[10px] font-body font-light">Floor {spot.floor}</p>
      <div className="flex items-center gap-1 mt-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        <span className={`text-[10px] font-body ${s.text}`}>{spot.status}</span>
      </div>
      {price && (
        <p className="text-white/25 text-[10px] font-body font-light mt-0.5">{price}</p>
      )}
    </button>
  );
}

function MapContent() {
  const searchParams = useSearchParams();
  const selectedLotId = searchParams.get('lot');
  const router = useRouter();

  const { lots, loading: lotsLoading } = useRealtimeLots();
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<SpotType[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>();
  const [mapZoom, setMapZoom] = useState<number | undefined>();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

  const { spots, loading: spotsLoading } = useRealtimeSpots(selectedLotId || undefined);
  const selectedLot = lots.find((l) => l.id === selectedLotId) ?? null;

  // Fetch pricing rules once
  useEffect(() => {
    createClient()
      .from('pricing_rules')
      .select('*')
      .then(({ data }) => setPricingRules((data as PricingRule[]) || []));
  }, []);

  // Reset floor selection when lot changes
  useEffect(() => { setSelectedFloor(null); }, [selectedLotId]);

  // Center map when lot is selected
  useEffect(() => {
    if (selectedLot) {
      setMapCenter([selectedLot.lat, selectedLot.lng]);
      setMapZoom(16);
    }
  }, [selectedLot]);

  const floors = [...new Set(spots.map((s) => s.floor))].sort((a, b) => a - b);

  const filteredSpots = spots.filter((spot) => {
    if (showAvailableOnly && spot.status !== 'available') return false;
    if (selectedTypes.length > 0 && !selectedTypes.includes(spot.spot_type)) return false;
    if (selectedFloor !== null && spot.floor !== selectedFloor) return false;
    return true;
  });

  const toggleType = (type: SpotType) =>
    setSelectedTypes((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]);

  const handleGeocode = useCallback((lat: number, lon: number) => {
    setMapCenter([lat, lon]);
    setMapZoom(15);
  }, []);

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => {
        setLocating(false);
        import('sonner').then(({ toast }) => toast.error('Location access denied'));
      }
    );
  };

  const availableCount = filteredSpots.filter((s) => s.status === 'available').length;
  const occupancyPct = selectedLot
    ? Math.round(((selectedLot.total_spots - selectedLot.available_spots) / Math.max(selectedLot.total_spots, 1)) * 100)
    : 0;
  const occupancyColor = occupancyPct < 50 ? 'bg-emerald-400' : occupancyPct < 85 ? 'bg-amber-400' : 'bg-red-400';

  const distanceKm = userLocation && selectedLot
    ? haversineKm(userLocation[0], userLocation[1], selectedLot.lat, selectedLot.lng)
    : null;

  const selectedSpotPricing = selectedSpot && selectedLot
    ? getPricingForSpot(pricingRules, selectedLot.id, selectedSpot.spot_type)
    : undefined;

  return (
    <>
      {/* Desktop: flex row. Mobile: flex col (map top, panel bottom) */}
      <div className="flex flex-col md:flex-row h-full overflow-hidden">
        {/* Map area — flex-1 fills remaining space; on mobile with lot selected, h-[50%] caps it */}
        <div className={`flex-1 relative min-h-0 ${selectedLotId ? 'md:flex-1 h-[50%] md:h-auto' : ''}`}>
          {lotsLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-[800] bg-black/70 backdrop-blur-sm">
              <LoadingSpinner size="lg" label="Loading lots…" />
            </div>
          )}

          {/* Overlay controls — z-[750] sits above Leaflet markers (600) and tooltips (650) */}
          <div className="absolute top-4 left-4 right-4 z-[750] flex flex-col gap-2">
            {/* Search + Locate row */}
            <div className="flex items-center gap-2">
              <SearchBar onSelect={handleGeocode} />
              <button
                onClick={handleLocate}
                disabled={locating}
                className="liquid-glass rounded-full w-9 h-9 flex items-center justify-center text-white/60 hover:text-white transition-colors shrink-0"
                title="Find my location"
              >
                <Navigation className={`h-4 w-4 ${locating ? 'animate-pulse text-blue-400' : userLocation ? 'text-blue-400' : ''}`} />
              </button>
            </div>
            {/* Type filters */}
            <MapControls
              selectedTypes={selectedTypes}
              onTypeToggle={toggleType}
              onClearFilters={() => { setSelectedTypes([]); setShowAvailableOnly(false); }}
              showAvailableOnly={showAvailableOnly}
              onToggleAvailable={() => setShowAvailableOnly((p) => !p)}
            />
          </div>

          <ParkingMap
            lots={lots}
            center={mapCenter}
            zoom={mapZoom}
            height="100%"
            onLotSelect={(lotId) => router.push(`/map?lot=${lotId}`)}
            userLocation={userLocation}
          />
        </div>

        {/* Side panel / bottom sheet */}
        {selectedLotId && (
          <div className="
            md:w-72 md:border-l md:border-white/[0.06] md:bg-black md:overflow-y-auto md:flex md:flex-col
            h-[50%] md:h-auto border-t border-white/[0.06] bg-black overflow-y-auto flex flex-col
          ">
            {/* Panel header */}
            <div className="p-4 border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => router.push('/map')}
                  className="liquid-glass rounded-full w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors shrink-0"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <div className="min-w-0 flex-1">
                  <h2
                    className="text-white truncate"
                    style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: '0.95rem' }}
                  >
                    {selectedLot?.name || 'Spots'}
                  </h2>
                  <p className="text-white/35 text-[10px] font-body font-light truncate">{selectedLot?.address}</p>
                </div>
              </div>

              {/* Lot meta: hours + distance */}
              {selectedLot && (
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1 text-white/30 text-[10px] font-body font-light">
                    <Clock className="h-3 w-3" />
                    <span>{selectedLot.open_time} – {selectedLot.close_time}</span>
                  </div>
                  {distanceKm !== null && (
                    <div className="flex items-center gap-1 text-white/30 text-[10px] font-body font-light">
                      <Navigation className="h-3 w-3" />
                      <span>
                        {distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)}km`} away
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Occupancy bar */}
              {selectedLot && (
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-[10px] font-body font-light">
                    <span className="text-white/30">Occupancy</span>
                    <span className="text-white/40">{selectedLot.available_spots} / {selectedLot.total_spots} free</span>
                  </div>
                  <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${occupancyColor}`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Floor tabs */}
              {floors.length > 1 && (
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    onClick={() => setSelectedFloor(null)}
                    className={`px-2.5 py-1 rounded-full text-[10px] transition-all font-body ${
                      selectedFloor === null
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'text-white/35 hover:text-white/60 hover:bg-white/5'
                    }`}
                    style={{ fontFamily: "'Barlow', sans-serif" }}
                  >
                    All
                  </button>
                  {floors.map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFloor(f)}
                      className={`px-2.5 py-1 rounded-full text-[10px] transition-all font-body ${
                        selectedFloor === f
                          ? 'bg-white/10 text-white border border-white/20'
                          : 'text-white/35 hover:text-white/60 hover:bg-white/5'
                      }`}
                      style={{ fontFamily: "'Barlow', sans-serif" }}
                    >
                      Floor {f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Spots grid */}
            {spotsLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <LoadingSpinner label="Loading spots…" />
              </div>
            ) : filteredSpots.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="liquid-glass rounded-full w-12 h-12 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white/30" />
                </div>
                <p className="text-white/35 text-sm font-body font-light">No spots match your filters</p>
              </div>
            ) : (
              <div className="p-3 grid grid-cols-2 gap-2">
                {filteredSpots.map((spot) => {
                  const rule = selectedLot
                    ? getPricingForSpot(pricingRules, selectedLot.id, spot.spot_type)
                    : undefined;
                  return (
                    <SpotCard
                      key={spot.id}
                      spot={spot}
                      price={rule ? `${formatCurrency(rule.price_per_hour)}/hr` : undefined}
                      onClick={() => spot.status === 'available' && setSelectedSpot(spot)}
                    />
                  );
                })}
              </div>
            )}

            {/* Stats footer */}
            {!spotsLoading && filteredSpots.length > 0 && (
              <div className="p-4 border-t border-white/[0.06] flex items-center shrink-0">
                <span className="text-white/30 text-xs font-body font-light">
                  {availableCount} available
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick book drawer */}
      <QuickBookDrawer
        spot={selectedSpot}
        lot={selectedLot}
        pricingRule={selectedSpotPricing}
        onClose={() => setSelectedSpot(null)}
      />
    </>
  );
}

export default function MapPage() {
  return (
    // No overflow-hidden on root — it breaks position:sticky on Navbar inside hidden containers
    <div className="flex flex-col bg-black" style={{ height: '100dvh' }}>
      {/* z-[1100] keeps navbar above Leaflet's highest internal layer (control-container = z-1000) */}
      <div className="shrink-0 relative z-[1100]">
        <Navbar />
      </div>
      <div className="flex-1 min-h-0 relative overflow-hidden">
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <LoadingSpinner size="lg" label="Loading map…" />
          </div>
        }>
          <MapContent />
        </Suspense>
      </div>
    </div>
  );
}
