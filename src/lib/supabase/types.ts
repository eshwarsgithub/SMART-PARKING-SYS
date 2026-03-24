export type SpotType = 'standard' | 'ev' | 'handicap' | 'motorcycle';
export type SpotStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';
export type BookingStatus = 'confirmed' | 'active' | 'completed' | 'cancelled';
export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  total_spots: number;
  available_spots: number;
  open_time: string;
  close_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ParkingSpot {
  id: string;
  lot_id: string;
  spot_number: string;
  floor: number;
  spot_type: SpotType;
  status: SpotStatus;
  created_at: string;
  updated_at: string;
}

export interface PricingRule {
  id: string;
  lot_id: string;
  spot_type: SpotType;
  price_per_hour: number;
  min_duration_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  spot_id: string;
  lot_id: string;
  starts_at: string;
  ends_at: string;
  duration_minutes: number;
  status: BookingStatus;
  total_amount: number;
  vehicle_plate: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  parking_spots?: ParkingSpot & { parking_lots?: ParkingLot };
  parking_lots?: ParkingLot;
  profiles?: Profile;
}

export interface BookingEvent {
  id: string;
  booking_id: string;
  event_type: string;
  old_status: string | null;
  new_status: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}
