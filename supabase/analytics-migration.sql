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
CREATE INDEX IF NOT EXISTS idx_analytics_pv_date ON analytics_page_views(DATE(created_at));

-- 2. Search Queries — theo dõi tìm kiếm và filter
CREATE TABLE IF NOT EXISTS analytics_searches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query           TEXT NOT NULL,
  result_count    INTEGER DEFAULT 0,
  has_results     BOOLEAN DEFAULT true,
  filters_used    JSONB,               -- {region: 'seoul', system: '...', tags: ['female','e7']}
  search_type     VARCHAR(20) DEFAULT 'text', -- 'text', 'quick_filter', 'region_filter', 'system_filter'
  session_id      VARCHAR(100),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_search_query ON analytics_searches(query);
CREATE INDEX IF NOT EXISTS idx_analytics_search_created ON analytics_searches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_search_date ON analytics_searches(DATE(created_at));

-- 3. Custom Events — theo dõi hành vi người dùng
CREATE TABLE IF NOT EXISTS analytics_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type      VARCHAR(100) NOT NULL, -- 'advisor_analyze', 'compare_view', 'cost_calc', 
                                         -- 'zalo_popup', 'copy_info', 'copy_zalo', 'ai_advisor',
                                         -- 'ai_zalo', 'ai_desc', 'school_click', 'visa_checklist'
  event_data      JSONB,                -- {school_slug, score, count, ...}
  school_slug     VARCHAR(100),
  session_id      VARCHAR(100),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_ev_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_ev_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_ev_date ON analytics_events(DATE(created_at));

-- 4. User Sessions — theo dõi phiên truy cập
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      VARCHAR(100) UNIQUE NOT NULL,
  ip              VARCHAR(45),
  user_agent      TEXT,
  referrer        VARCHAR(500),
  landing_page    VARCHAR(200),         -- Trang đầu tiên truy cập
  page_views      INTEGER DEFAULT 1,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  last_activity   TIMESTAMPTZ DEFAULT NOW(),
  duration_seconds INTEGER DEFAULT 0    -- Thời gian phiên (tính sau)
);

CREATE INDEX IF NOT EXISTS idx_analytics_sess_session ON analytics_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sess_date ON analytics_sessions(DATE(started_at));

-- Row Level Security: public can insert, only director can select
ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;

-- Public can insert (tracking)
CREATE POLICY "public_insert_page_views" ON analytics_page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_searches" ON analytics_searches FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_sessions" ON analytics_sessions FOR INSERT WITH CHECK (true);

-- Only authenticated admin (service_role) can read
CREATE POLICY "admin_read_page_views" ON analytics_page_views FOR SELECT USING (true);
CREATE POLICY "admin_read_searches" ON analytics_searches FOR SELECT USING (true);
CREATE POLICY "admin_read_events" ON analytics_events FOR SELECT USING (true);
CREATE POLICY "admin_read_sessions" ON analytics_sessions FOR SELECT USING (true);
