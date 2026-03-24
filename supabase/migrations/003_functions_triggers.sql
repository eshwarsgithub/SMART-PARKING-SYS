-- Function: Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create profile on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function: Sync spot status on booking change
CREATE OR REPLACE FUNCTION handle_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- On new confirmed booking, set spot to reserved
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    UPDATE parking_spots
    SET status = 'reserved', updated_at = NOW()
    WHERE id = NEW.spot_id;

  -- On status change
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    -- Booking becomes active → spot occupied
    IF NEW.status = 'active' THEN
      UPDATE parking_spots
      SET status = 'occupied', updated_at = NOW()
      WHERE id = NEW.spot_id;

    -- Booking completed or cancelled → spot available
    ELSIF NEW.status IN ('completed', 'cancelled') THEN
      UPDATE parking_spots
      SET status = 'available', updated_at = NOW()
      WHERE id = NEW.spot_id;
    END IF;

    -- Log booking event
    INSERT INTO booking_events (booking_id, event_type, old_status, new_status)
    VALUES (NEW.id, 'status_change', OLD.status, NEW.status);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Sync spot status on booking change
CREATE TRIGGER on_booking_status_change
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION handle_booking_status_change();

-- Function: Sync lot available_spots count
CREATE OR REPLACE FUNCTION sync_lot_spot_counts()
RETURNS TRIGGER AS $$
DECLARE
  v_lot_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_lot_id := OLD.lot_id;
  ELSE
    v_lot_id := NEW.lot_id;
  END IF;

  UPDATE parking_lots
  SET
    total_spots = (
      SELECT COUNT(*) FROM parking_spots
      WHERE lot_id = v_lot_id AND status != 'maintenance'
    ),
    available_spots = (
      SELECT COUNT(*) FROM parking_spots
      WHERE lot_id = v_lot_id AND status = 'available'
    ),
    updated_at = NOW()
  WHERE id = v_lot_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Sync lot counts on spot change
CREATE TRIGGER on_spot_status_change
  AFTER INSERT OR UPDATE OR DELETE ON parking_spots
  FOR EACH ROW EXECUTE FUNCTION sync_lot_spot_counts();

-- Function: Updated_at auto-update
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_lots_updated_at BEFORE UPDATE ON parking_lots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_spots_updated_at BEFORE UPDATE ON parking_spots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_pricing_updated_at BEFORE UPDATE ON pricing_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE parking_spots;
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE parking_lots;
