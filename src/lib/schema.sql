-- SJC Database Schema for Neon PostgreSQL
-- Matches the Spring Boot JPA entities exactly

-- User accounts
CREATE TABLE IF NOT EXISTS user_account (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL UNIQUE,
  email VARCHAR(120) UNIQUE,
  password_hash VARCHAR(200),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_phone ON user_account(phone);

-- Admin users
CREATE TABLE IF NOT EXISTS admin_user (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(200) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Room categories
CREATE TABLE IF NOT EXISTS room_category (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  capacity INTEGER,
  max_occupancy_per_room INTEGER DEFAULT 2,
  max_extra_beds_per_room INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Room inventory (availability & pricing per date)
CREATE TABLE IF NOT EXISTS room_inventory (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT NOT NULL REFERENCES room_category(id),
  date DATE NOT NULL,
  base_available INTEGER NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  extra_bed_price NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(category_id, date)
);

-- Privilege members (discount card holders)
CREATE TABLE IF NOT EXISTS privilege_member (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES user_account(id),
  card_number VARCHAR(50) NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expiry_date TIMESTAMPTZ,
  issue_channel VARCHAR(10) DEFAULT 'ONLINE',
  issued_by_admin BIGINT REFERENCES admin_user(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Discount rules (per date)
CREATE TABLE IF NOT EXISTS discount_rule (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  room_discount INTEGER CHECK (room_discount BETWEEN 0 AND 100),
  food_discount INTEGER CHECK (food_discount BETWEEN 0 AND 100),
  bar_discount INTEGER CHECK (bar_discount BETWEEN 0 AND 100),
  active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bookings
CREATE TABLE IF NOT EXISTS booking (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES user_account(id),
  privilege_member_id BIGINT REFERENCES privilege_member(id),
  category_id BIGINT NOT NULL REFERENCES room_category(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  rooms INTEGER NOT NULL DEFAULT 1,
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  special_requests TEXT,
  base_amount NUMERIC(12,2) NOT NULL,
  discount_amount NUMERIC(12,2) NOT NULL,
  final_amount NUMERIC(12,2) NOT NULL,
  payment_status VARCHAR(10) NOT NULL DEFAULT 'PENDING',
  payment_ref VARCHAR(120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Booking nights (one row per night per booking, for availability tracking)
CREATE TABLE IF NOT EXISTS booking_night (
  id BIGSERIAL PRIMARY KEY,
  booking_id BIGINT NOT NULL REFERENCES booking(id),
  category_id BIGINT NOT NULL REFERENCES room_category(id),
  date DATE NOT NULL,
  rooms INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(booking_id, date)
);
CREATE INDEX IF NOT EXISTS idx_bn_cat_date ON booking_night(category_id, date);

-- Seed room categories
INSERT INTO room_category (code, name, capacity, max_occupancy_per_room, max_extra_beds_per_room)
VALUES
  ('DELUXE', 'Deluxe Room', 2, 2, 1),
  ('SUPER_DELUXE', 'Super Deluxe', 2, 2, 1),
  ('SUITE', 'Executive Suite Room', 4, 4, 2)
ON CONFLICT (code) DO NOTHING;

-- Add age and nationality columns to user_account (idempotent)
ALTER TABLE user_account ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE user_account ADD COLUMN IF NOT EXISTS nationality VARCHAR(60);

-- Add extra_beds column to booking (idempotent)
ALTER TABLE booking ADD COLUMN IF NOT EXISTS extra_beds INTEGER DEFAULT 0;

-- Set extra_bed_price to 1500 for all inventory rows
UPDATE room_inventory SET extra_bed_price = 1500 WHERE extra_bed_price = 0;

-- Seed room inventory for next 90 days (so bookings work out of the box)
INSERT INTO room_inventory (category_id, date, base_available, base_price, extra_bed_price)
SELECT
  rc.id,
  d::date,
  CASE rc.code
    WHEN 'DELUXE' THEN 10
    WHEN 'SUPER_DELUXE' THEN 8
    WHEN 'SUITE' THEN 5
  END,
  CASE rc.code
    WHEN 'DELUXE' THEN 4500.00
    WHEN 'SUPER_DELUXE' THEN 5500.00
    WHEN 'SUITE' THEN 6500.00
  END,
  1500.00
FROM room_category rc
CROSS JOIN generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', '1 day') d
ON CONFLICT (category_id, date) DO NOTHING;
