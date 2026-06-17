// GET /api/schools — danh sách tất cả trường (Supabase client)
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
    const { data, error } = await supabase
      .from('schools')
      .select(`
        *,
        school_conditions(*),
        school_majors(*),
        school_advantages(*),
        school_conversions(*),
        school_documents(*),
        school_partners(*),
        school_advisor_profiles(*)
      `)
      .order('slug');

    if (error) throw error;

    // Transform to match expected format
    const result = (data || []).map((school) => {
      const conditions = school.school_conditions || [];
      const majors = school.school_majors || [];
      const advantages = school.school_advantages || [];
      const conversion = school.school_conversions || [];
      const documents = school.school_documents || [];
      const partners = school.school_partners || [];
      const advisorProfiles = school.school_advisor_profiles || [];

      return {
        ...school,
        school_conditions: undefined,
        school_majors: undefined,
        school_advantages: undefined,
        school_conversions: undefined,
        school_documents: undefined,
        school_partners: undefined,
        school_advisor_profiles: undefined,
        conditions,
        majors,
        advantages,
        conversion,
        documents,
        partners,
        advisorProfile: advisorProfiles.length > 0 ? advisorProfiles[0] : null,
      };
    });

    return res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (err) {
    console.error('GET /api/schools error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
