'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ParkingLot, PricingRule, SpotType } from '@/lib/supabase/types';
import { getSpotTypeIcon, getSpotTypeLabel } from '@/lib/utils';
import { formatCurrency } from '@/lib/pricing';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

const SPOT_TYPES: SpotType[] = ['standard', 'ev', 'handicap', 'motorcycle'];

const inputCls = 'w-full bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm px-3 py-2 placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-colors font-body h-9';
const labelCls = 'block text-white/40 text-[10px] font-body font-light mb-1.5';

export default function AdminPricingPage() {
  const [lots, setLots] = useState<ParkingLot[]>([]);
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [selectedLot, setSelectedLot] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    Promise.all([
      supabase.from('parking_lots').select('*').eq('is_active', true),
      supabase.from('pricing_rules').select('*'),
    ]).then(([{ data: lotsData }, { data: rulesData }]) => {
      setLots((lotsData as ParkingLot[]) || []);
      setRules((rulesData as PricingRule[]) || []);
      if (lotsData && lotsData.length > 0) setSelectedLot(lotsData[0].id);
      setLoading(false);
    });
  }, []);

  const getRule = (lotId: string, spotType: SpotType) =>
    rules.find((r) => r.lot_id === lotId && r.spot_type === spotType);

  const saveRule = async (lotId: string, spotType: SpotType, pricePerHour: number, minDuration: number) => {
    setSaving(true);
    const existing = getRule(lotId, spotType);
    const { error } = existing
      ? await supabase.from('pricing_rules').update({ price_per_hour: pricePerHour, min_duration_minutes: minDuration }).eq('id', existing.id)
      : await supabase.from('pricing_rules').insert({ lot_id: lotId, spot_type: spotType, price_per_hour: pricePerHour, min_duration_minutes: minDuration });

    if (error) { toast.error('Failed to save pricing rule'); }
    else {
      toast.success('Pricing rule saved');
      const { data } = await supabase.from('pricing_rules').select('*');
      setRules((data as PricingRule[]) || []);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <LoadingSpinner size="lg" label="Loading pricing…" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-white text-3xl mb-1"
          style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
        >
          Pricing Rules
        </h1>
        <p className="text-white/40 text-sm font-body font-light">Set hourly rates per lot and spot type</p>
      </div>

      {/* Lot selector */}
      <div className="mb-6">
        <label className={labelCls}>Select Lot</label>
        <Select value={selectedLot} onValueChange={(val: string | null) => val && setSelectedLot(val)}>
          <SelectTrigger className="w-72 bg-white/[0.04] border-white/10 text-white rounded-xl font-body text-sm h-10 focus:ring-0 focus:border-white/25">
            <SelectValue placeholder="Select a lot" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a0a] border-white/10 text-white rounded-xl">
            {lots.map((lot) => (
              <SelectItem key={lot.id} value={lot.id} className="font-body text-sm text-white/80 focus:bg-white/[0.06] focus:text-white">
                {lot.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedLot && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SPOT_TYPES.map((type) => (
            <PricingRuleCard
              key={type}
              lotId={selectedLot}
              spotType={type}
              existingRule={getRule(selectedLot, type)}
              onSave={saveRule}
              saving={saving}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PricingRuleCard({
  lotId, spotType, existingRule, onSave, saving,
}: {
  lotId: string;
  spotType: SpotType;
  existingRule?: PricingRule;
  onSave: (lotId: string, spotType: SpotType, price: number, min: number) => void;
  saving: boolean;
}) {
  const [price, setPrice] = useState(existingRule?.price_per_hour?.toString() || '');
  const [minDuration, setMinDuration] = useState(existingRule?.min_duration_minutes?.toString() || '30');

  useEffect(() => {
    setPrice(existingRule?.price_per_hour?.toString() || '');
    setMinDuration(existingRule?.min_duration_minutes?.toString() || '30');
  }, [existingRule]);

  const inputCls2 = 'w-full bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm px-3 py-2 placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-colors font-body h-9';
  const labelCls2 = 'block text-white/40 text-[10px] font-body font-light mb-1.5';

  return (
    <div className="liquid-glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{getSpotTypeIcon(spotType)}</span>
        <span
          className="text-white text-sm"
          style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
        >
          {getSpotTypeLabel(spotType)}
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <label className={labelCls2}>Price per Hour (₹)</label>
          <input
            type="number" min="0" step="0.5" placeholder="0.00"
            value={price} onChange={(e) => setPrice(e.target.value)}
            className={inputCls2}
          />
        </div>
        <div>
          <label className={labelCls2}>Min Duration (min)</label>
          <input
            type="number" min="15" max="480" step="15"
            value={minDuration} onChange={(e) => setMinDuration(e.target.value)}
            className={inputCls2}
          />
        </div>
        {price && (
          <p
            className="text-white/50 text-xs font-body"
            style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
          >
            {formatCurrency(parseFloat(price) || 0)}/hr
          </p>
        )}
        <button
          disabled={saving || !price}
          onClick={() => onSave(lotId, spotType, parseFloat(price) || 0, parseInt(minDuration) || 30)}
          className="w-full liquid-glass-strong rounded-full py-2 text-white text-xs font-body font-medium flex items-center justify-center gap-1.5 hover:bg-white/[0.06] transition-all disabled:opacity-40"
        >
          <Save className="h-3 w-3" /> Save
        </button>
      </div>
    </div>
  );
}
