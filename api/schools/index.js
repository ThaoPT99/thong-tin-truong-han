// GET /api/schools + POST /api/schools (apply) — danh sách trường & gửi đơn đăng ký
// Query params:
//   ?slug=xxx         → chi tiết 1 trường (full join child tables)
//   ?full=false       → list lightweight (chỉ fields cơ bản)
//   ?semester=id      → lọc theo kỳ tuyển sinh
const { supabase } = require('../../lib/supabase');

// Rate limiter cho public POST (apply)
const rateLimitMap = new Map();
const RATE_LIMIT = 5;
const RATE_WINDOW = 30 * 60 * 1000;
function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_WINDOW };
  if (now > entry.resetAt) { entry.count = 1; entry.resetAt = now + RATE_WINDOW; }
  else { entry.count++; }
  rateLimitMap.set(ip, entry);
  if (rateLimitMap.size > 1000) {
    const cutoff = now - RATE_WINDOW * 2;
    for (const [key, val] of rateLimitMap) { if (val.resetAt < cutoff) rateLimitMap.delete(key); }
  }
  return entry.count <= RATE_LIMIT;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // ─── Upload base64 file to Supabase Storage ───
  async function uploadBase64File(base64DataUri) {
    if (!base64DataUri || typeof base64DataUri !== 'string') return '';
    // Not a base64 data URI → return as-is (already a URL)
    if (!base64DataUri.startsWith('data:')) return base64DataUri;
    
    try {
      const matches = base64DataUri.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) return base64DataUri;
      
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      
      if (buffer.length > 10 * 1024 * 1024) return '';
      
      const ext = mimeType.split('/')[1] || 'bin';
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileName = `app_${timestamp}_${randomStr}.${ext === 'jpeg' ? 'jpg' : ext}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('applications')
        .upload(fileName, buffer, {
          contentType: mimeType,
          cacheControl: '3600',
          upsert: false,
        });
        
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return '';
      }
      
      const { data: { publicUrl } } = supabase
        .storage
        .from('applications')
        .getPublicUrl(fileName);
        
      return publicUrl;
    } catch (e) {
      console.error('uploadBase64File error:', e);
      return '';
    }
  }

  // ─── POST: Gửi đơn đăng ký từ public ───
  if (req.method === 'POST') {
    try {
      const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || 'unknown';
      if (!checkRateLimit(clientIp)) {
        return res.status(429).json({ error: 'Bạn đã gửi quá nhiều đơn. Vui lòng thử lại sau 30 phút.', retryAfter: '30 minutes' });
      }

      const body = typeof req.body === 'object' ? req.body : {};
      if (!body.fullName) {
        return res.status(400).json({ error: 'fullName (Họ tên) là bắt buộc' });
      }

      // Resolve school slug to UUID (frontend sends slug)
      let schoolId = null;
      if (body.schoolId) {
        const { data: schoolData } = await supabase
          .from('schools')
          .select('id')
          .or(`slug.eq.${body.schoolId},id.eq.${body.schoolId}`)
          .maybeSingle();
        if (schoolData) schoolId = schoolData.id;
      }

      // Resolve semester name/slug to UUID
      let semesterId = null;
      if (body.semesterId) {
        const { data: semData } = await supabase
          .from('semesters')
          .select('id')
          .or(`id.eq.${body.semesterId}`)
          .maybeSingle();
        if (semData) semesterId = semData.id;
      }

      // Check duplicate (email trong 30 ngày)
      if (body.email) {
        const { data: existing } = await supabase.from('school_applications').select('id, status')
          .eq('email', body.email)
          .gt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()).limit(1);
        if (existing && existing.length > 0) {
          return res.status(409).json({ error: 'Bạn đã gửi đơn trước đó. Vui lòng kiểm tra email hoặc liên hệ admin.', existingId: existing[0].id });
        }
      }

      // Upload base64 files to Storage (parallel)
      const docFields = [
        'docApplicationForm', 'docStudyPlan', 'docSelfIntroduction',
        'docHighSchoolDiploma', 'docHighSchoolTranscript', 'docPassportCopy',
        'docBirthCertificate', 'docFamilyRegister', 'docBankStatement',
        'docHealthCertificate', 'docPhoto', 'docTopikCertificate'
      ];
      
      const uploadPromises = docFields.map(async (field) => {
        if (body[field] && typeof body[field] === 'string' && body[field].startsWith('data:')) {
          body[field] = await uploadBase64File(body[field]);
        }
      });
      await Promise.all(uploadPromises);

      const { data, error } = await supabase.from('school_applications').insert({
        full_name: body.fullName || '', full_name_kr: body.fullNameKr || '', full_name_en: body.fullNameEn || '',
        date_of_birth: body.dateOfBirth || null, gender: body.gender || '', nationality: body.nationality || 'Vietnam',
        passport_no: body.passportNo || '', passport_expiry: body.passportExpiry || null,
        phone: body.phone || '', email: body.email || '', address: body.address || '',
        high_school_name: body.highSchoolName || '', high_school_address: body.highSchoolAddress || '',
        high_school_start: body.highSchoolStart || null, high_school_end: body.highSchoolEnd || null,
        high_school_major: body.highSchoolMajor || '', high_school_gpa: body.highSchoolGpa || null,
        high_school_absences: body.highSchoolAbsences || 0, high_school_status: body.highSchoolStatus || 'graduated',
        university_name: body.universityName || '', university_major: body.universityMajor || '',
        university_start: body.universityStart || null, university_end: body.universityEnd || null,
        university_gpa: body.universityGpa || null, university_degree: body.universityDegree || '',
        korean_level: body.koreanLevel || 'none', topik_level: body.topikLevel || null, korean_education: body.koreanEducation || '',
        father_name: body.fatherName || '', father_occupation: body.fatherOccupation || '', father_phone: body.fatherPhone || '',
        mother_name: body.motherName || '', mother_occupation: body.motherOccupation || '', mother_phone: body.motherPhone || '',
        school_id: schoolId, semester_id: semesterId,
        doc_application_form: body.docApplicationForm || '',
        doc_study_plan: body.docStudyPlan || '',
        doc_self_introduction: body.docSelfIntroduction || '',
        doc_high_school_diploma: body.docHighSchoolDiploma || '',
        doc_high_school_transcript: body.docHighSchoolTranscript || '',
        doc_passport_copy: body.docPassportCopy || '',
        doc_birth_certificate: body.docBirthCertificate || '',
        doc_family_register: body.docFamilyRegister || '',
        doc_bank_statement: body.docBankStatement || '',
        doc_health_certificate: body.docHealthCertificate || '',
        doc_photo: body.docPhoto || '',
        doc_topik_certificate: body.docTopikCertificate || '',
        doc_other: body.docOther || '',
        status: 'submitted', source: body.source || 'web',
      }).select('id, full_name, status, created_at').single();

      if (error) throw new Error(error.message);

      // Auto-create student record
      if (body.phone || body.email) {
        try {
          const { data: existingStudent } = await supabase.from('students').select('id').eq('phone', body.phone || 'none').maybeSingle();
          if (!existingStudent) {
            await supabase.from('students').insert({
              name: body.fullName || '', phone: body.phone || '', email: body.email || '',
              gender: body.gender || '', school_id: body.schoolId || null, semester_id: body.semesterId || null,
              status: 'applied', note: 'Tự động tạo từ đơn đăng ký online',
            });
          }
        } catch (e) { /* silent */ }
      }

      return res.status(201).json({ success: true, message: 'Đơn đăng ký đã được gửi thành công!', data });
    } catch (err) {
      console.error('POST /api/schools (apply) error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // ─── GET (original) ───

  try {
    const { slug, full, semester, include, visa_type } = req.query;
    const semesterFilter = semester || null;
    const visaTypeFilter = visa_type || null;

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

    // ─── List schools (có filter semester + visa_type) ───
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

    // Visa type filter
    if (visaTypeFilter) {
      baseQuery.eq('visa_type', visaTypeFilter);
    }

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
        visa_type: school.visa_type || 'D2-6',
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