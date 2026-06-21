// api/analytics.js — Consolidated analytics endpoint
// POST /api/analytics → tracking (public, fire-and-forget)
// GET  /api/analytics → admin dashboard data (requires director role)
//
// Gộp từ api/analytics/track.js + api/admin/analytics/index.js
// để không vượt quá giới hạn 12 functions của Vercel Hobby.

const { supabase } = require('../lib/supabase');
const { requireAdmin } = require('../lib/auth');

// ─── Public Tracking (POST) ───
async function handleTrack(req, res) {
  const body = req.body || {};
  const { type, data } = body;
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                   req.headers['x-real-ip'] ||
                   req.connection?.remoteAddress || '';

  if (!type || !data) {
    return res.status(400).json({ error: 'Missing type or data' });
  }

  switch (type) {
    case 'page_view': {
      const { pageType, schoolSlug, schoolName, referrer, sessionId, userAgent } = data;
      if (!pageType) return res.status(400).json({ error: 'pageType is required' });

      const { error: viewErr } = await supabase.from('analytics_page_views').insert({
        page_type: pageType,
        school_slug: schoolSlug || null,
        school_name: schoolName || null,
        referrer: referrer || null,
        session_id: sessionId || null,
        user_agent: userAgent || null,
        ip: clientIp || null,
      });
      if (viewErr) throw viewErr;
      break;
    }

    case 'search': {
      const { query, resultCount, hasResults, filtersUsed, searchType, sessionId } = data;
      if (!query) return res.status(400).json({ error: 'query is required' });

      const { error: searchErr } = await supabase.from('analytics_searches').insert({
        query: query,
        result_count: resultCount || 0,
        has_results: hasResults !== false,
        filters_used: filtersUsed || null,
        search_type: searchType || 'text',
        session_id: sessionId || null,
      });
      if (searchErr) throw searchErr;
      break;
    }

    case 'event': {
      const { eventType, eventData, schoolSlug, sessionId } = data;
      if (!eventType) return res.status(400).json({ error: 'eventType is required' });

      const { error: evErr } = await supabase.from('analytics_events').insert({
        event_type: eventType,
        event_data: eventData || null,
        school_slug: schoolSlug || null,
        session_id: sessionId || null,
      });
      if (evErr) throw evErr;
      break;
    }

    case 'session': {
      const { sessionId, action, pageType, referrer, userAgent } = data;
      if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });

      if (action === 'start') {
        const { data: existing } = await supabase
          .from('analytics_sessions')
          .select('id, page_views')
          .eq('session_id', sessionId)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('analytics_sessions')
            .update({
              last_activity: new Date().toISOString(),
              page_views: (existing.page_views || 0) + 1,
              user_agent: userAgent || existing.user_agent,
            })
            .eq('session_id', sessionId);
        } else {
          await supabase.from('analytics_sessions').insert({
            session_id: sessionId,
            ip: clientIp || null,
            user_agent: userAgent || null,
            referrer: referrer || null,
            landing_page: pageType || null,
            page_views: 1,
            started_at: new Date().toISOString(),
            last_activity: new Date().toISOString(),
          });
        }
      }
      break;
    }

    default:
      return res.status(400).json({ error: `Unknown type: ${type}` });
  }

  return res.json({ success: true });
}

// ─── Admin Dashboard (GET) ───
async function handleAdminData(req, res) {
  // Chỉ director được xem analytics
  if (req.user?.role !== 'director') {
    return res.status(403).json({ error: 'Forbidden: only director can view analytics' });
  }

  try {
    const view = req.query.view || 'overview';
    const days = parseInt(req.query.days) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    // ─── OVERVIEW VIEW ───
    if (view === 'overview') {
      const [
        { count: totalViews },
        { count: totalSearches },
        { count: totalEvents },
        { count: totalSessions },
      ] = await Promise.all([
        supabase.from('analytics_page_views').select('*', { count: 'exact', head: true })
          .gte('created_at', since),
        supabase.from('analytics_searches').select('*', { count: 'exact', head: true })
          .gte('created_at', since),
        supabase.from('analytics_events').select('*', { count: 'exact', head: true })
          .gte('created_at', since),
        supabase.from('analytics_sessions').select('*', { count: 'exact', head: true })
          .gte('started_at', since),
      ]);

      const { data: dailyViews } = await supabase
        .from('analytics_page_views')
        .select('created_at')
        .gte('created_at', since)
        .order('created_at');

      const { data: dailySessions } = await supabase
        .from('analytics_sessions')
        .select('started_at, page_views')
        .gte('started_at', since);

      const { data: pageTypeBreakdown } = await supabase
        .from('analytics_page_views')
        .select('page_type')
        .gte('created_at', since);

      const pageTypes = {};
      for (const row of pageTypeBreakdown || []) {
        pageTypes[row.page_type] = (pageTypes[row.page_type] || 0) + 1;
      }

      const { data: topSchoolsRaw } = await supabase
        .from('analytics_page_views')
        .select('school_slug, school_name')
        .gte('created_at', since)
        .not('school_slug', 'is', null);

      const topSchools = {};
      for (const row of topSchoolsRaw || []) {
        if (!row.school_slug) continue;
        if (!topSchools[row.school_slug]) {
          topSchools[row.school_slug] = { name: row.school_name || row.school_slug, count: 0 };
        }
        topSchools[row.school_slug].count++;
      }

      const topSchoolsList = Object.entries(topSchools)
        .map(([slug, data]) => ({ slug, name: data.name, count: data.count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return res.json({
        success: true,
        data: {
          overview: {
            totalViews: totalViews || 0,
            totalSearches: totalSearches || 0,
            totalEvents: totalEvents || 0,
            totalSessions: totalSessions || 0,
            avgViewsPerSession: totalSessions > 0 ? Math.round((totalViews || 0) / totalSessions * 10) / 10 : 0,
          },
          topSchools: topSchoolsList,
          pageTypeBreakdown: Object.entries(pageTypes)
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count),
          dailyViews,
          dailySessions: (dailySessions || []).map(s => ({
            date: s.started_at,
            pageViews: s.page_views || 1,
          })),
        },
      });
    }

    // ─── SCHOOLS VIEW ───
    if (view === 'schools') {
      const { data: allSchoolViews } = await supabase
        .from('analytics_page_views')
        .select('school_slug, school_name')
        .gte('created_at', since)
        .not('school_slug', 'is', null);

      const schoolCounts = {};
      for (const row of allSchoolViews || []) {
        if (!row.school_slug) continue;
        if (!schoolCounts[row.school_slug]) {
          schoolCounts[row.school_slug] = { name: row.school_name || row.school_slug, count: 0 };
        }
        schoolCounts[row.school_slug].count++;
      }

      const schools = Object.entries(schoolCounts)
        .map(([slug, d]) => ({ slug, name: d.name, count: d.count }))
        .sort((a, b) => b.count - a.count);

      const { data: dbSchools } = await supabase
        .from('schools')
        .select('slug, name, region, name_kr')
        .in('slug', schools.map(s => s.slug));

      const schoolInfoMap = {};
      for (const s of dbSchools || []) {
        schoolInfoMap[s.slug] = s;
      }

      const schoolsWithInfo = schools.map(s => ({
        ...s,
        region: schoolInfoMap[s.slug]?.region || '',
        nameKr: schoolInfoMap[s.slug]?.name_kr || '',
      }));

      const { data: schoolEvents } = await supabase
        .from('analytics_events')
        .select('school_slug, event_type')
        .gte('created_at', since)
        .not('school_slug', 'is', null);

      const schoolEventCounts = {};
      for (const row of schoolEvents || []) {
        if (!row.school_slug) continue;
        if (!schoolEventCounts[row.school_slug]) {
          schoolEventCounts[row.school_slug] = { advisor: 0, zalo: 0, copy: 0 };
        }
        if (row.event_type === 'advisor_analyze') schoolEventCounts[row.school_slug].advisor++;
        if (row.event_type === 'copy_info' || row.event_type === 'copy_zalo') schoolEventCounts[row.school_slug].copy++;
        if (row.event_type === 'ai_zalo' || row.event_type === 'zalo_popup') schoolEventCounts[row.school_slug].zalo++;
      }

      const schoolsWithEvents = schoolsWithInfo.map(s => ({
        ...s,
        ...(schoolEventCounts[s.slug] || { advisor: 0, zalo: 0, copy: 0 }),
      }));

      return res.json({
        success: true,
        data: {
          schools: schoolsWithEvents,
          totalUnique: schools.length,
        },
      });
    }

    // ─── SEARCHES VIEW ───
    if (view === 'searches') {
      const { data: searches } = await supabase
        .from('analytics_searches')
        .select('*')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(200);

      const queryCounts = {};
      let totalWithResults = 0;
      let totalNoResults = 0;
      const dailySearchCounts = {};

      for (const row of searches || []) {
        const q = (row.query || '').toLowerCase().trim();
        if (q) {
          queryCounts[q] = (queryCounts[q] || 0) + 1;
        }
        if (row.has_results) totalWithResults++;
        else totalNoResults++;

        const d = new Date(row.created_at).toISOString().split('T')[0];
        dailySearchCounts[d] = (dailySearchCounts[d] || 0) + 1;
      }

      const topQueries = Object.entries(queryCounts)
        .map(([query, count]) => ({ query, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 30);

      const dailySearches = Object.entries(dailySearchCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return res.json({
        success: true,
        data: {
          topQueries,
          totalSearches: searches?.length || 0,
          totalWithResults,
          totalNoResults,
          dailySearches,
          successRate: (searches?.length || 0) > 0
            ? Math.round((totalWithResults / (searches?.length || 0)) * 100)
            : 0,
        },
      });
    }

    // ─── EVENTS VIEW ───
    if (view === 'events') {
      const { data: events } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(500);

      const eventCounts = {};
      const dailyEventCounts = {};

      for (const row of events || []) {
        eventCounts[row.event_type] = (eventCounts[row.event_type] || 0) + 1;
        const d = new Date(row.created_at).toISOString().split('T')[0];
        dailyEventCounts[d] = (dailyEventCounts[d] || 0) + 1;
      }

      const eventBreakdown = Object.entries(eventCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

      const dailyEvents = Object.entries(dailyEventCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return res.json({
        success: true,
        data: {
          eventBreakdown,
          dailyEvents,
          totalEvents: events?.length || 0,
        },
      });
    }

    // ─── CONVERSION VIEW ───
    if (view === 'conversion') {
      const { data: pageViews } = await supabase
        .from('analytics_page_views')
        .select('page_type, session_id')
        .gte('created_at', since)
        .not('session_id', 'is', null);

      const { data: allEvents } = await supabase
        .from('analytics_events')
        .select('event_type, session_id')
        .gte('created_at', since)
        .not('session_id', 'is', null);

      const sessions = {};
      for (const row of pageViews || []) {
        if (!row.session_id) continue;
        if (!sessions[row.session_id]) sessions[row.session_id] = { views: new Set(), events: new Set() };
        sessions[row.session_id].views.add(row.page_type);
      }

      for (const row of allEvents || []) {
        if (!row.session_id) continue;
        if (!sessions[row.session_id]) sessions[row.session_id] = { views: new Set(), events: new Set() };
        sessions[row.session_id].events.add(row.event_type);
      }

      let schoolListCount = 0;
      let schoolDetailCount = 0;
      let advisorCount = 0;
      let zaloCount = 0;
      let copyCount = 0;

      for (const session of Object.values(sessions)) {
        if (session.views.has('school_list') || session.views.has('schools')) schoolListCount++;
        if (session.views.has('school_detail')) schoolDetailCount++;
        if (session.views.has('advisor') || session.events.has('advisor_analyze')) advisorCount++;
        if (session.events.has('zalo_popup') || session.events.has('ai_zalo')) zaloCount++;
        if (session.events.has('copy_info') || session.events.has('copy_zalo')) copyCount++;
      }

      let advisorSubmitCount = 0;
      for (const session of Object.values(sessions)) {
        if (session.events.has('advisor_analyze')) advisorSubmitCount++;
      }
      const { count: advisorSaveEvents } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'advisor_save')
        .gte('created_at', since);

      return res.json({
        success: true,
        data: {
          funnel: [
            { stage: 'Xem danh sách trường', count: schoolListCount },
            { stage: 'Xem chi tiết trường', count: schoolDetailCount },
            { stage: 'Dùng công cụ tư vấn', count: advisorCount },
            { stage: 'Copy thông tin/Lưu kết quả', count: copyCount },
            { stage: 'Mở Zalo/Liên hệ', count: zaloCount },
          ],
          advisorFunnel: [
            { stage: 'Mở form tư vấn', count: advisorCount },
            { stage: 'Submit form phân tích', count: advisorSubmitCount },
            { stage: 'Lưu kết quả', count: advisorSaveEvents || 0 },
          ],
        },
      });
    }

    return res.status(400).json({ error: `Unknown view: ${view}` });
  } catch (err) {
    console.error('/api/analytics error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

// ─── Router ───
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'POST') {
      return await handleTrack(req, res);
    }

    if (req.method === 'GET') {
      // Admin routes: require authentication
      return await requireAdmin(handleAdminData)(req, res);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('/api/analytics error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
