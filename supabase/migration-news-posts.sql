-- Migration: Tạo bảng news_posts (Tin tức & Thành tích)
-- Chạy trong Supabase SQL Editor

CREATE TABLE IF NOT EXISTS news_posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  content         TEXT NOT NULL DEFAULT '',
  category        VARCHAR(50) NOT NULL DEFAULT 'news',
  -- Categories: 'news' (tin tức), 'visa' (visa đỗ), 'sendoff' (tiễn bay), 'success' (thành tích)
  image_urls      TEXT[] DEFAULT '{}',
  is_published    BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_posts_category ON news_posts(category);
CREATE INDEX IF NOT EXISTS idx_news_posts_published ON news_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_news_posts_created ON news_posts(created_at DESC);

ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;

-- Public read policy: chỉ xem bài đã publish
CREATE POLICY "public_read_published_news" ON news_posts 
  FOR SELECT USING (is_published = true);

-- Service role full access (cho admin API)
CREATE POLICY "service_full_news" ON news_posts 
  FOR ALL USING (true);
