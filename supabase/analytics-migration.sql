-- ============================================================
-- Analytics Migration — Tracking tables cho Analytics Dashboard
-- Chạy file này trong Supabase SQL Editor
-- ============================================================

-- 1. Page Views — theo dõi lượt xem trang/tab/trường
CREATE TABLE IF NOT EXISTS analytics_page_views (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type       VARCHAR(50) NOT NULL, -- 'school_detail', 'school_list', 'advisor', 'compare', 'map', 'extra', 'ebook', 'cost'
  school_slug     VARCHAR(100),         -- NULL nếu không phải school detail
  school_name     VARCHAR(200),         -- Denormalized để query nhanh
  referrer        VARCHAR(500),         -- URL gốc
  session_id      VARCHAR(100),         -- Session định danh
  user_agent      TEXT,
  ip              VARCHAR(45),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_pv_page_type ON analytics_page_views(page_type);
CREATE INDEX IF NOT EXISTS idx_analytics_pv_school ON analytics_page_views(school_slug);
CREATE INDEX IF NOT EXISTS idx_analytics_pv_created ON analytics_page_views(created_at DESC);

-- 2. Search Queries — theo dõi tìm kiếm và filter
CREATE TABLE IF NOT EXISTS analytics_searches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query           TEXT NOT NULL,
  result_count    INTEGER DEFAULT 0,
  has_results     BOOLEAN DEFAULT true,
  filters_used    JSONB,
  search_type     VARCHAR(20) DEFAULT 'text',
  session_id      VARCHAR(100),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_search_query ON analytics_searches(query);
CREATE INDEX IF NOT EXISTS idx_analytics_search_created ON analytics_searches(created_at DESC);

-- 3. Custom Events — theo dõi hành vi người dùng
CREATE TABLE IF NOT EXISTS analytics_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type      VARCHAR(100) NOT NULL,
  event_data      JSONB,
  school_slug     VARCHAR(100),
  session_id      VARCHAR(100),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_ev_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_ev_created ON analytics_events(created_at DESC);

-- 4. User Sessions — theo dõi phiên truy cập
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      VARCHAR(100) UNIQUE NOT NULL,
  ip              VARCHAR(45),
  user_agent      TEXT,
  referrer        VARCHAR(500),
  landing_page    VARCHAR(200),
  page_views      INTEGER DEFAULT 1,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  last_activity   TIMESTAMPTZ DEFAULT NOW(),
  duration_seconds INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_analytics_sess_session ON analytics_sessions(session_id);

-- 5. IP Cache — mỗi IP chỉ lưu 1 dòng (không trùng, không đầy database)
CREATE TABLE IF NOT EXISTS analytics_ip_cache (
  ip              VARCHAR(45) PRIMARY KEY,
  city            VARCHAR(100),
  region          VARCHAR(100),
  country         VARCHAR(100),
  country_code    VARCHAR(5),
  lat             DECIMAL(10,7),
  lon             DECIMAL(10,7),
  isp             VARCHAR(200),
  user_agent      TEXT,
  first_seen      TIMESTAMPTZ DEFAULT NOW(),
  last_seen       TIMESTAMPTZ DEFAULT NOW(),
  total_views     INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_analytics_ip_city ON analytics_ip_cache(city);
CREATE INDEX IF NOT EXISTS idx_analytics_ip_region ON analytics_ip_cache(region);
CREATE INDEX IF NOT EXISTS idx_analytics_ip_last_seen ON analytics_ip_cache(last_seen DESC);

-- Row Level Security: public can insert, only director can select
ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_ip_cache ENABLE ROW LEVEL SECURITY;

-- Public can insert/update (tracking)
CREATE POLICY "public_insert_page_views" ON analytics_page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_searches" ON analytics_searches FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_sessions" ON analytics_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_ip_cache" ON analytics_ip_cache FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_ip_cache" ON analytics_ip_cache FOR UPDATE USING (true) WITH CHECK (true);

-- Only authenticated admin (service_role) can read
CREATE POLICY "admin_read_page_views" ON analytics_page_views FOR SELECT USING (true);
CREATE POLICY "admin_read_searches" ON analytics_searches FOR SELECT USING (true);
CREATE POLICY "admin_read_events" ON analytics_events FOR SELECT USING (true);
CREATE POLICY "admin_read_sessions" ON analytics_sessions FOR SELECT USING (true);
CREATE POLICY "admin_read_ip_cache" ON analytics_ip_cache FOR SELECT USING (true);
