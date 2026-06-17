// GET /api/schools — danh sách tất cả trường (Supabase client)
// Query params: ?full=false — bỏ JOIN child tables, chỉ lấy thông tin cơ bản
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
    const fullQuery = req.query.full !== 'false';

    let query = supabase.from('schools').select('*').order('slug');

    if (fullQuery) {
      // Only JOIN child tables when full data is requested
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
      const result = (data || []).map((school) => ({
        ...school,
        school_conditions: undefined,
        school_majors: undefined,
        school_advantages: undefined,
        school_conversions: undefined,
        school_documents: undefined,
        school_partners: undefined,
        school_advisor_profiles: undefined,
        conditions: school.school_conditions || [],
        majors: school.school_majors || [],
        advantages: school.school_advantages || [],
        conversion: school.school_conversions || [],
        documents: school.school_documents || [],
        partners: school.school_partners || [],
        advisorProfile: (school.school_advisor_profiles || []).length > 0 ? school.school_advisor_profiles[0] : null,
      }));

      return res.json({ success: true, count: result.length, data: result });
    }

    // Lightweight: chỉ lấy thông tin cơ bản (không JOIN child tables)
    const { data, error } = await query;
    if (error) throw error;

    return res.json({
      success: true,
      count: data.length,
      data: (data || []).map((school) => ({
        id: school.id,
        slug: school.slug,
        name: school.name,
        name_kr: school.name_kr,
        name_en: school.name_en,
        system: school.system,
        quota: school.quota,
        region: school.region,
        location: school.location,
        image_main: school.image_main,
        updated_at: school.updated_at,
        conditions: [],
        majors: [],
        advantages: [],
        conversion: [],
        documents: [],
        partners: [],
        advisorProfile: null,
      })),
    });
  } catch (err) {
    console.error('GET /api/schools error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
