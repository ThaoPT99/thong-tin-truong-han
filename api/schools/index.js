// GET /api/schools — danh sách tất cả trường (Supabase client)
// Query params:
//   ?full=false — bỏ JOIN child tables, chỉ lấy thông tin cơ bản
//   ?semester=id — lọc trường theo kỳ tuyển sinh
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
    const fullQuery = req.query.full !== 'false';
    const semesterFilter = req.query.semester || null;

    // ─── Lấy semester_schools map ───
    const { data: semesterSchoolsRaw } = await supabase
      .from('semester_schools')
      .select('semester_id, school_id');

    // Build map: school_id -> [semester_id, ...]
    const semesterSchoolsMap = {};
    const allSchoolIdsWithSemester = new Set();
    for (const ss of semesterSchoolsRaw || []) {
      if (!semesterSchoolsMap[ss.school_id]) {
        semesterSchoolsMap[ss.school_id] = [];
      }
      semesterSchoolsMap[ss.school_id].push(ss.semester_id);
      allSchoolIdsWithSemester.add(ss.school_id);
    }

    if (fullQuery) {
      let query = supabase
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
        `);

      // Nếu có semester filter, chỉ lấy schools thuộc kỳ đó
      if (semesterFilter) {
        // Lấy danh sách school_id thuộc kỳ đó
        const { data: filtered } = await supabase
          .from('semester_schools')
          .select('school_id')
          .eq('semester_id', semesterFilter);

        const schoolIds = (filtered || []).map(r => r.school_id);
        if (schoolIds.length > 0) {
          query = query.in('id', schoolIds);
        } else {
          // Không có trường nào trong kỳ này
          return res.json({ success: true, count: 0, data: [], semesterSchools: semesterSchoolsMap });
        }
      }

      const { data, error } = await query.order('slug');
      if (error) throw error;

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
        // Thêm semester_schools info cho client-side filtering
        semesterIds: semesterSchoolsMap[school.id] || [],
      }));

      return res.json({
        success: true,
        count: result.length,
        data: result,
        semesterSchools: semesterSchoolsMap,
      });
    }

    // Lightweight
    let query = supabase.from('schools').select('*');
    if (semesterFilter) {
      const { data: filtered } = await supabase
        .from('semester_schools')
        .select('school_id')
        .eq('semester_id', semesterFilter);

      const schoolIds = (filtered || []).map(r => r.school_id);
      if (schoolIds.length > 0) {
        query = query.in('id', schoolIds);
      } else {
        return res.json({ success: true, count: 0, data: [], semesterSchools: semesterSchoolsMap });
      }
    }

    const { data, error } = await query.order('slug');
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
        semesterIds: semesterSchoolsMap[school.id] || [],
      })),
      semesterSchools: semesterSchoolsMap,
    });
  } catch (err) {
    console.error('GET /api/schools error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
