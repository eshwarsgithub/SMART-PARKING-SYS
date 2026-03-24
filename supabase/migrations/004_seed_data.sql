-- Seed data: 3 parking lots
INSERT INTO parking_lots (id, name, address, lat, lng, open_time, close_time) VALUES
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Central City Parking', '123 MG Road, Bangalore', 12.9716, 77.5946, '06:00', '23:00'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Tech Park Parking', '456 Outer Ring Road, Bangalore', 12.9352, 77.6245, '07:00', '22:00'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'Airport Parking', '789 Airport Road, Bangalore', 13.1989, 77.7068, '00:00', '23:59');

-- Seed data: Spots for Lot 1 (Central City) - 20 spots
INSERT INTO parking_spots (lot_id, spot_number, floor, spot_type, status) VALUES
  ('a1b2c3d4-0000-0000-0000-000000000001', 'A1', 1, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'A2', 1, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'A3', 1, 'standard', 'occupied'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'A4', 1, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'A5', 1, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'B1', 1, 'ev', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'B2', 1, 'ev', 'occupied'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'C1', 1, 'handicap', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'C2', 1, 'handicap', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'D1', 1, 'motorcycle', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'A6', 2, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'A7', 2, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'A8', 2, 'standard', 'maintenance'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'A9', 2, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'A10', 2, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'B3', 2, 'ev', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'B4', 2, 'ev', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'D2', 2, 'motorcycle', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'D3', 2, 'motorcycle', 'occupied'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'D4', 2, 'motorcycle', 'available');

-- Spots for Lot 2 (Tech Park) - 20 spots
INSERT INTO parking_spots (lot_id, spot_number, floor, spot_type, status) VALUES
  ('a1b2c3d4-0000-0000-0000-000000000002', 'P1', 1, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'P2', 1, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'P3', 1, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'P4', 1, 'standard', 'occupied'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'P5', 1, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'P6', 1, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'P7', 1, 'standard', 'reserved'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'E1', 1, 'ev', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'E2', 1, 'ev', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'H1', 1, 'handicap', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'P8', 2, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'P9', 2, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'P10', 2, 'standard', 'occupied'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'P11', 2, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'P12', 2, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'E3', 2, 'ev', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'M1', 2, 'motorcycle', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'M2', 2, 'motorcycle', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'M3', 2, 'motorcycle', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'H2', 2, 'handicap', 'available');

-- Spots for Lot 3 (Airport) - 20 spots
INSERT INTO parking_spots (lot_id, spot_number, floor, spot_type, status) VALUES
  ('a1b2c3d4-0000-0000-0000-000000000003', 'T1', 1, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'T2', 1, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'T3', 1, 'standard', 'occupied'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'T4', 1, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'T5', 1, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'T6', 1, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'T7', 1, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'T8', 1, 'standard', 'occupied'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'EV1', 1, 'ev', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'EV2', 1, 'ev', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'AC1', 1, 'handicap', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'AC2', 1, 'handicap', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'T9', 2, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'T10', 2, 'standard', 'reserved'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'T11', 2, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'T12', 2, 'standard', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'T13', 2, 'standard', 'maintenance'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'MB1', 2, 'motorcycle', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'MB2', 2, 'motorcycle', 'available'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'MB3', 2, 'motorcycle', 'available');

-- Pricing rules
INSERT INTO pricing_rules (lot_id, spot_type, price_per_hour, min_duration_minutes) VALUES
  ('a1b2c3d4-0000-0000-0000-000000000001', 'standard', 50.00, 30),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'ev', 80.00, 30),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'handicap', 30.00, 30),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'motorcycle', 20.00, 30),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'standard', 60.00, 60),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'ev', 100.00, 60),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'handicap', 40.00, 60),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'motorcycle', 25.00, 30),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'standard', 100.00, 60),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'ev', 150.00, 60),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'handicap', 70.00, 60),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'motorcycle', 50.00, 60);
