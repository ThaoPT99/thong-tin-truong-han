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
    const { slug, full, semester, include } = req.query;
    const semesterFilter = semester || null;

    // ─── Include extras data (semesters, visa checklist, interviews) ───
    if (include === 'extras') {
      const [
        { data: semesters },
        { data: visaChecklist },
        { data: interviews },
      ] = await Promise.all([
        supabase.from('semesters').select('*').order('sort_order').order('nam', { ascending: false }).order('ky', { ascending: false }),
        supabase.from('extra_visa_checklist').select('*').order('sort_order'),
        supabase.from('extra_interviews').select('*').order('sort_order'),
      ]);

      const activeSemester = (semesters || []).find(s => s.is_active) || (semesters || [])[0] || null;

      return res.json({
        success: true,
        data: {
          semesterInfo: activeSemester
            ? { ky: activeSemester.ky, nam: activeSemester.nam, title: activeSemester.title }
            : null,
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
    }

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

    // Helper: fetch advisor profiles for given school IDs
    async function fetchAdvisorProfiles(schoolIds) {
      if (!schoolIds || schoolIds.length === 0) return {};
      const { data, error } = await supabase
        .from('school_advisor_profiles')
        .select('*')
        .in('school_id', schoolIds);
      if (error) {
        console.error('fetchAdvisorProfiles error:', error);
        return {};
      }
      const map = {};
      for (const ap of data || []) {
        map[ap.school_id] = ap;
      }
      return map;
    }

    // ─── GET /api/schools?slug=xxx — Chi tiết 1 trường ───
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
          school_partners(*)
        `)
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'School not found' });
        }
        throw error;
      }

      // Fetch advisor profile separately (bypass RLS join issue)
      const advisorMap = await fetchAdvisorProfiles([data.id]);
      const advisorProfiles = advisorMap[data.id] ? [advisorMap[data.id]] : [];

      const conditions = data.school_conditions || [];
      const majors = data.school_majors || [];
      const advantages = data.school_advantages || [];
      const conversion = data.school_conversions || [];
      const documents = data.school_documents || [];
      const partners = data.school_partners || [];

      const result = {
        ...data,
        school_conditions: undefined,
        school_majors: undefined,
        school_advantages: undefined,
        school_conversions: undefined,
        school_documents: undefined,
        school_partners: undefined,
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
        school_partners(*)
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
      // Fetch advisor profiles for all schools in batch
      const schoolIds = (data || []).map(s => s.id);
      const advisorMap = await fetchAdvisorProfiles(schoolIds);

      const result = (data || []).map((school) => ({
        ...school,
        school_conditions: undefined,
        school_majors: undefined,
        school_advantages: undefined,
        school_conversions: undefined,
        school_documents: undefined,
        school_partners: undefined,
        conditions: school.school_conditions || [],
        majors: school.school_majors || [],
        advantages: school.school_advantages || [],
        conversion: school.school_conversions || [],
        documents: school.school_documents || [],
        partners: school.school_partners || [],
        advisorProfile: advisorMap[school.id] || null,
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