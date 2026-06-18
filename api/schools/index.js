// GET /api/schools — danh sách trường + chi tiết theo slug
// Query params:
//   ?slug=xxx         → chi tiết 1 trường (full join child tables)
//   ?full=false       → list lightweight (chỉ fields cơ bản)
//   ?semester=id      → lọc theo kỳ tuyển sinh
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
    const { slug, full, semester } = req.query;
    const semesterFilter = semester || null;

    // ─── Lấy semester_schools map ───
    const { data: semesterSchoolsRaw } = await supabase
      .from('semester_schools')
      .select('semester_id, school_id');

    const semesterSchoolsMap = {};
    for (const ss of semesterSchoolsRaw || []) {
      if (!semesterSchoolsMap[ss.school_id]) {
        semesterSchoolsMap[ss.school_id] = [];
      }
      semesterSchoolsMap[ss.school_id].push(ss.semester_id);
    }

    // ─── GET /api/schools?slug=xxx — Chi tiết 1 trường (full join) ───
    if (slug) {
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
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'School not found' });
        }
        throw error;
      }

      const conditions = data.school_conditions || [];
      const majors = data.school_majors || [];
      const advantages = data.school_advantages || [];
      const conversion = data.school_conversions || [];
      const documents = data.school_documents || [];
      const partners = data.school_partners || [];
      const advisorProfiles = data.school_advisor_profiles || [];

      const result = {
        ...data,
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

      return res.json({ success: true, data: result });
    }

    // ─── List schools (có filter semester) ───
    const fullQuery = full !== 'false';
    const baseQuery = fullQuery ? supabase
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
      `) : supabase.from('schools').select('*');

    // Semester filter
    if (semesterFilter) {
      const { data: filtered } = await supabase
        .from('semester_schools')
        .select('school_id')
        .eq('semester_id', semesterFilter);

      const schoolIds = (filtered || []).map(r => r.school_id);
      if (schoolIds.length > 0) {
        baseQuery.in('id', schoolIds);
      } else {
        return res.json({ success: true, count: 0, data: [], semesterSchools: semesterSchoolsMap });
      }
    }

    const { data, error } = await baseQuery.order('slug');
    if (error) throw error;

    if (fullQuery) {
      // Full response (giống slug detail nhưng list)
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
        semesterIds: semesterSchoolsMap[school.id] || [],
      }));

      return res.json({
        success: true,
        count: result.length,
        data: result,
        semesterSchools: semesterSchoolsMap,
      });
    }

    // Lightweight response (dành cho list UI)
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
        semesterIds: semesterSchoolsMap[school.id] || [],
      })),
      semesterSchools: semesterSchoolsMap,
    });
  } catch (err) {
    console.error('GET /api/schools error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};