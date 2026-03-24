import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SpotStatus, SpotType, BookingStatus } from './supabase/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSpotStatusColor(status: SpotStatus): string {
  switch (status) {
    case 'available': return 'text-green-400';
    case 'occupied': return 'text-red-400';
    case 'reserved': return 'text-yellow-400';
    case 'maintenance': return 'text-gray-400';
    default: return 'text-gray-400';
  }
}

export function getSpotStatusBg(status: SpotStatus): string {
  switch (status) {
    case 'available': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'occupied': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'reserved': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'maintenance': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

export function getBookingStatusBg(status: BookingStatus | string): string {
  switch (status) {
    case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

export function getSpotTypeLabel(type: SpotType): string {
  switch (type) {
    case 'standard': return 'Standard';
    case 'ev': return 'EV Charging';
    case 'handicap': return 'Accessible';
    case 'motorcycle': return 'Motorcycle';
    default: return type;
  }
}

export function getSpotTypeIcon(type: SpotType): string {
  switch (type) {
    case 'standard': return '🚗';
    case 'ev': return '⚡';
    case 'handicap': return '♿';
    case 'motorcycle': return '🏍️';
    default: return '🚗';
  }
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
