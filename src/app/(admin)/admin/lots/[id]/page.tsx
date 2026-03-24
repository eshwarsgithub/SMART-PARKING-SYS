'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ParkingLot, ParkingSpot, SpotType } from '@/lib/supabase/types';
import { useRealtimeSpots } from '@/hooks/useRealtimeSpots';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getSpotStatusBg, getSpotTypeIcon, getSpotTypeLabel } from '@/lib/utils';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Wrench } from 'lucide-react';
import Link from 'next/link';

const STATUS_OPTIONS = ['available', 'occupied', 'reserved', 'maintenance'] as const;

export default function AdminLotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();
  const [lot, setLot] = useState<ParkingLot | null>(null);
  const [loading, setLoading] = useState(true);
  const { spots, loading: spotsLoading } = useRealtimeSpots(id);

  useEffect(() => {
    supabase
      .from('parking_lots')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => { setLot(data); setLoading(false); });
  }, [id]);

  const updateSpotStatus = async (spotId: string, status: string) => {
    const { error } = await supabase
      .from('parking_spots')
      .update({ status })
      .eq('id', spotId);
    if (error) {
      toast.error('Failed to update spot status');
    } else {
      toast.success('Spot status updated');
    }
  };

  const addSpots = async (type: SpotType, count: number) => {
    const existing = spots.filter((s) => s.spot_type === type).length;
    const prefix = { standard: 'S', ev: 'E', handicap: 'H', motorcycle: 'M' }[type];
    const newSpots = Array.from({ length: count }, (_, i) => ({
      lot_id: id,
      spot_number: `${prefix}${existing + i + 1}`,
      floor: 1,
      spot_type: type,
      status: 'available' as const,
    }));

    const { error } = await supabase.from('parking_spots').insert(newSpots);
    if (error) {
      toast.error('Failed to add spots');
    } else {
      toast.success(`Added ${count} ${type} spots`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <LoadingSpinner size="lg" label="Loading lot..." />
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Lot not found</p>
        <Link href="/admin/lots"><Button className="mt-4">Back to Lots</Button></Link>
      </div>
    );
  }

  const byType = spots.reduce((acc, spot) => {
    acc[spot.spot_type] = (acc[spot.spot_type] || []).concat(spot);
    return acc;
  }, {} as Record<SpotType, ParkingSpot[]>);

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/lots" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> All Lots
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{lot.name}</h1>
            <p className="text-muted-foreground">{lot.address}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={lot.is_active ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
              {lot.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <p className="text-sm text-muted-foreground">{lot.available_spots}/{lot.total_spots} available</p>
          </div>
        </div>
      </div>

      {/* Quick add spots */}
      <Card className="border-border bg-card mb-6">
        <CardHeader>
          <CardTitle className="text-base">Add Spots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(['standard', 'ev', 'handicap', 'motorcycle'] as SpotType[]).map((type) => (
              <div key={type} className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addSpots(type, 5)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {getSpotTypeIcon(type)} +5 {getSpotTypeLabel(type)}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spot grid by type */}
      {spotsLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner label="Loading spots..." />
        </div>
      ) : spots.length === 0 ? (
        <div className="text-center py-16">
          <Wrench className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No spots yet. Add some above.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {(Object.entries(byType) as [SpotType, ParkingSpot[]][]).map(([type, typeSpots]) => (
            <Card key={type} className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  {getSpotTypeIcon(type)} {getSpotTypeLabel(type)} ({typeSpots.length} spots)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {typeSpots.map((spot) => (
                    <div key={spot.id} className="bg-secondary/50 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm">{spot.spot_number}</span>
                        <span className="text-xs text-muted-foreground">F{spot.floor}</span>
                      </div>
                      <Select
                        value={spot.status}
                        onValueChange={(val: string | null) => val && updateSpotStatus(spot.id, val)}
                      >
                        <SelectTrigger className={`h-7 text-xs border ${getSpotStatusBg(spot.status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
