-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Parking lots table
CREATE TABLE parking_lots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  total_spots INTEGER NOT NULL DEFAULT 0,
  available_spots INTEGER NOT NULL DEFAULT 0,
  open_time TIME NOT NULL DEFAULT '06:00',
  close_time TIME NOT NULL DEFAULT '22:00',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Parking spots table
CREATE TABLE parking_spots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lot_id UUID REFERENCES parking_lots(id) ON DELETE CASCADE NOT NULL,
  spot_number TEXT NOT NULL,
  floor INTEGER NOT NULL DEFAULT 1,
  spot_type TEXT NOT NULL DEFAULT 'standard' CHECK (spot_type IN ('standard', 'ev', 'handicap', 'motorcycle')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(lot_id, spot_number)
);

-- Pricing rules table
CREATE TABLE pricing_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lot_id UUID REFERENCES parking_lots(id) ON DELETE CASCADE NOT NULL,
  spot_type TEXT NOT NULL CHECK (spot_type IN ('standard', 'ev', 'handicap', 'motorcycle')),
  price_per_hour DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_duration_minutes INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(lot_id, spot_type)
);

-- Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  spot_id UUID REFERENCES parking_spots(id) ON DELETE SET NULL NOT NULL,
  lot_id UUID REFERENCES parking_lots(id) ON DELETE SET NULL NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (ends_at - starts_at))::INTEGER / 60
  ) STORED,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'active', 'completed', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  vehicle_plate TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT no_overlap EXCLUDE USING gist (
    spot_id WITH =,
    tstzrange(starts_at, ends_at) WITH &&
  ) WHERE (status NOT IN ('cancelled'))
);

-- Booking events audit table
CREATE TABLE booking_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_parking_spots_lot_id ON parking_spots(lot_id);
CREATE INDEX idx_parking_spots_status ON parking_spots(status);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_spot_id ON bookings(spot_id);
CREATE INDEX idx_bookings_lot_id ON bookings(lot_id);
CREATE INDEX idx_bookings_starts_at ON bookings(starts_at);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_booking_events_booking_id ON booking_events(booking_id);
