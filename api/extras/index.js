// GET /api/extras — dữ liệu phụ trợ (Supabase client)
const { supabase } = require('../../lib/supabase');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [
      { data: semesterInfo },
      { data: visaChecklist },
      { data: interviews },
    ] = await Promise.all([
      supabase.from('semester_info').select('*').limit(1).maybeSingle(),
      supabase.from('extra_visa_checklist').select('*').order('sort_order'),
      supabase.from('extra_interviews').select('*').order('sort_order'),
    ]);

    return res.json({
      success: true,
      data: {
        semesterInfo: semesterInfo || null,
        visaChecklist: (visaChecklist || []).map((r) => ({
          stt: r.stt,
          content: r.content,
          note: r.note,
          linkUrl: r.link_url,
          linkText: r.link_text,
          groupName: r.group_name,
          level: r.level,
        })),
        interviews: (interviews || []).map((r) => ({
          stt: r.stt,
          content: r.content,
          linkUrl: r.link_url,
          linkText: r.link_text,
        })),
      },
    });
  } catch (err) {
    console.error('GET /api/extras error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
