export const APP_NAME = 'SafePark';
export const APP_DESCRIPTION = 'Smart City Safe Parking System';

export const SPOT_TYPES = ['standard', 'ev', 'handicap', 'motorcycle'] as const;
export const BOOKING_STATUSES = ['confirmed', 'active', 'completed', 'cancelled'] as const;

export const MAP_DEFAULT_CENTER: [number, number] = [12.9716, 77.5946]; // Bangalore
export const MAP_DEFAULT_ZOOM = 13;

export const SPOT_COLORS = {
  available: '#22c55e',
  occupied: '#ef4444',
  reserved: '#eab308',
  maintenance: '#6b7280',
} as const;

export const ADMIN_NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/admin/lots', label: 'Lots', icon: 'MapPin' },
  { href: '/admin/bookings', label: 'Bookings', icon: 'Calendar' },
  { href: '/admin/pricing', label: 'Pricing', icon: 'DollarSign' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'BarChart2' },
] as const;
