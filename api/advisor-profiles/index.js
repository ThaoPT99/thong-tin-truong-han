// GET /api/advisor-profiles — advisor profiles cho từng trường
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
    // Lấy tất cả schools + slug để map
    const { data: schools } = await supabase
      .from('schools')
      .select('id, slug');

    if (!schools) {
      return res.json({ success: true, data: {} });
    }

    // Build slug -> id map
    const slugToId = {};
    for (const s of schools) {
      slugToId[s.id] = s.slug;
    }

    // Lấy tất cả advisor profiles
    const { data: profilesRaw, error } = await supabase
      .from('school_advisor_profiles')
      .select('*');

    if (error) throw error;

    // Build map: { slug: { gender, minGpa, ... } }
    const profiles = {};
    for (const ap of profilesRaw || []) {
      const slug = slugToId[ap.school_id];
      if (!slug) continue;

      profiles[slug] = {
        gender: ap.gender || 'all',
        minGpa: parseFloat(ap.min_gpa) || 5.5,
        maxAbsences: ap.max_absences || 30,
        region: ap.region || '',
        costLevel: ap.cost_level || 3,
        visaChance: ap.visa_chance || 3,
        jobOpportunity: ap.job_opportunity || 3,
        e7Opportunity: ap.e7_opportunity || 3,
        studyLoad: ap.study_load || 3,
        interviewDifficulty: ap.interview_difficulty || 2,
        tags: ap.tags || [],
      };
    }

    return res.json({ success: true, data: profiles });
  } catch (err) {
    console.error('GET /api/advisor-profiles error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
