-- ============================================================
-- Migration: Thêm cột vị trí chính xác từ Browser Geolocation
-- Chạy file này trong Supabase SQL Editor
-- ============================================================

ALTER TABLE analytics_ip_cache
  ADD COLUMN IF NOT EXISTS precise_lat      DECIMAL(10,7),
  ADD COLUMN IF NOT EXISTS precise_lon      DECIMAL(10,7),
  ADD COLUMN IF NOT EXISTS precise_district VARCHAR(200),
  ADD COLUMN IF NOT EXISTS precise_ward     VARCHAR(200),
  ADD COLUMN IF NOT EXISTS precise_address  TEXT,
  ADD COLUMN IF NOT EXISTS location_source  VARCHAR(10) DEFAULT 'ip';
  -- location_source: 'ip' (từ ip-api.com), 'gps' (từ browser GPS)

CREATE INDEX IF NOT EXISTS idx_analytics_ip_source ON analytics_ip_cache(location_source);
