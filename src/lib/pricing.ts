import { PricingRule, SpotType } from './supabase/types';

export function calculateCost(
  startsAt: Date,
  endsAt: Date,
  pricePerHour: number
): number {
  const durationMs = endsAt.getTime() - startsAt.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  return Math.round(durationHours * pricePerHour * 100) / 100;
}

export function getPricingForSpot(
  rules: PricingRule[],
  lotId: string,
  spotType: SpotType
): PricingRule | undefined {
  return rules.find((r) => r.lot_id === lotId && r.spot_type === spotType);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getDurationMinutes(startsAt: Date, endsAt: Date): number {
  return Math.floor((endsAt.getTime() - startsAt.getTime()) / (1000 * 60));
}
