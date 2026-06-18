// GET /api/extras — dữ liệu phụ trợ (Supabase client)
// Trả về: semesterInfo, semesters (danh sách kỳ), visaChecklist, interviews
const { supabase } = require('../../lib/supabase');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [
      { data: semesterInfo },
      { data: semesters },
      { data: visaChecklist },
      { data: interviews },
    ] = await Promise.all([
      supabase.from('semester_info').select('*').limit(1).maybeSingle(),
      supabase.from('semesters').select('*').order('sort_order').order('nam', { ascending: false }).order('ky', { ascending: false }),
      supabase.from('extra_visa_checklist').select('*').order('sort_order'),
      supabase.from('extra_interviews').select('*').order('sort_order'),
    ]);

    // Tìm kỳ active
    const activeSemester = (semesters || []).find(s => s.is_active) || (semesters || [])[0] || null;

    return res.json({
      success: true,
      data: {
        // Giữ semesterInfo cũ cho backward compat
        semesterInfo: activeSemester || semesterInfo || null,
        // Danh sách kỳ (cho frontend selector)
        semesters: (semesters || []).map((s) => ({
          id: s.id,
          ky: s.ky,
          nam: s.nam,
          title: s.title || `Kỳ tháng ${s.ky}/${s.nam}`,
          isActive: s.is_active,
          sortOrder: s.sort_order,
        })),
        activeSemesterId: activeSemester?.id || null,
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
