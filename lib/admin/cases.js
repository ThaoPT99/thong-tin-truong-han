// lib/admin/cases.js
// GET/POST/PUT/DELETE /api/admin/cases — Quản lý case tư vấn (Phase 4: Learning Agent)
const { requireAdmin, requireRole } = require('../auth');
const { supabase } = require('../supabase');

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { id, action } = req.query;

    // ─── GET: list / get by id / similar / stats ───
    if (req.method === 'GET') {
      // GET /api/admin/cases?action=stats — Thống kê
      if (action === 'stats') {
        const [
          { count: total },
          { count: pending },
          { count: approved },
          { count: rejected },
          { count: flagged },
        ] = await Promise.all([
          supabase.from('advisor_cases').select('*', { count: 'exact', head: true }),
          supabase.from('advisor_cases').select('*', { count: 'exact', head: true }).eq('result', 'pending'),
          supabase.from('advisor_cases').select('*', { count: 'exact', head: true }).eq('result', 'approved'),
          supabase.from('advisor_cases').select('*', { count: 'exact', head: true }).eq('result', 'rejected'),
          supabase.from('advisor_cases').select('*', { count: 'exact', head: true }).eq('is_flagged', true),
        ]);

        return res.json({
          success: true,
          data: {
            total: total || 0,
            pending: pending || 0,
            approved: approved || 0,
            rejected: rejected || 0,
            flagged: flagged || 0,
          }
        });
      }

      // GET /api/admin/cases?action=recent&limit=10 — Recent cases cho advisor
      if (action === 'recent') {
        const limit = parseInt(req.query.limit) || 10;
        const visaType = req.query.visaType || null;

        let query = supabase
          .from('advisor_cases')
          .select('id, student_name, visa_type, result, top_schools, tags, lessons_learned, created_at, confirmed_at, notes')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (visaType) {
          query = query.eq('visa_type', visaType);
        }

        const { data, error } = await query;
        if (error) throw new Error(error.message);

        return res.json({ success: true, data: data || [] });
      }

      // GET /api/admin/cases?action=similar — Tìm case tương tự (dùng cho RAG)
      if (action === 'similar') {
        const profile = req.query.profile ? JSON.parse(decodeURIComponent(req.query.profile)) : null;
        if (!profile) return res.json({ success: true, data: [] });

        const { visaType, gender, age, gpa, korean, visaFail, region } = profile;
        const limit = parseInt(req.query.limit) || 5;

        // Build filter: ưu tiên case cùng visa type, cùng kết quả, đã confirm
        let matchCount = 0;
        const conditions = [];

        if (visaType) { conditions.push(`visa_type.eq.${visaType}`); matchCount++; }
        if (gender) { conditions.push(`student_profile->>gender.eq.${gender}`); matchCount++; }
        if (korean && korean !== 'none') { conditions.push(`student_profile->>korean.eq.${korean}`); matchCount++; }
        if (visaFail === 'yes') { conditions.push(`student_profile->>visaFail.eq.yes`); matchCount++; }

        // Nếu có ít nhất 2 điểm chung, tìm case đã confirm trước
        let similarQuery;
        if (matchCount >= 2) {
          similarQuery = supabase
            .from('advisor_cases')
            .select('id, student_profile, visa_type, result, top_schools, lessons_learned, notes, confirmed_at, created_at')
            .not('result', 'eq', 'pending')  // Chỉ lấy case đã confirm
            .order('confirmed_at', { ascending: false })
            .limit(limit);
        } else {
          // Fallback: lấy case gần nhất cùng visa type
          similarQuery = supabase
            .from('advisor_cases')
            .select('id, student_profile, visa_type, result, top_schools, lessons_learned, notes, confirmed_at, created_at')
            .not('result', 'eq', 'pending')
            .eq('visa_type', visaType || 'D2-6')
            .order('confirmed_at', { ascending: false })
            .limit(limit);
        }

        const { data, error } = await similarQuery;
        if (error) throw new Error(error.message);

        // Filter client-side: ưu tiên case có nhiều điểm tương đồng
        let scored = (data || []).map(c => {
          let similarity = 0;
          const p = c.student_profile || {};
          if (p.visaType === visaType) similarity += 3;
          if (p.gender === gender) similarity += 2;
          if (p.korean === korean) similarity += 2;
          if (Math.abs((p.age || 0) - (age || 0)) <= 2) similarity += 1;
          if (Math.abs((p.gpa || 0) - (gpa || 0)) <= 0.5) similarity += 1;
          if (p.visaFail === visaFail) similarity += 2;
          if (p.region === region) similarity += 1;
          return { ...c, similarity };
        })
          .filter(c => c.similarity >= 3)  // Chỉ lấy case có độ tương đồng >= 3
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, limit);

        return res.json({ success: true, data: scored });
      }

      // GET /api/admin/cases?id=xxx — Chi tiết 1 case
      if (id) {
        const { data, error } = await supabase
          .from('advisor_cases')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) throw new Error(error.message);
        if (!data) return res.status(404).json({ error: 'Case not found' });
        return res.json({ success: true, data });
      }

      // GET /api/admin/cases — List (paginated)
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 20, 100);
      const offset = (page - 1) * limit;

      let listQuery = supabase
        .from('advisor_cases')
        .select('*', { count: 'exact' });

      // Filters
      const filterResult = req.query.result;
      const filterVisa = req.query.visa_type;
      const filterFlagged = req.query.flagged;
      const search = req.query.search;

      if (filterResult) listQuery = listQuery.eq('result', filterResult);
      if (filterVisa) listQuery = listQuery.eq('visa_type', filterVisa);
      if (filterFlagged === 'true') listQuery = listQuery.eq('is_flagged', true);
      if (search) {
        listQuery = listQuery.or(
          `student_name.ilike.%${search}%,student_phone.ilike.%${search}%`
        );
      }

      const { data, error, count } = await listQuery
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw new Error(error.message);

      return res.json({
        success: true,
        data: data || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      });
    }

    // ─── POST: Tạo case mới ───
    if (req.method === 'POST') {
      const body = req.body || {};

      // Tự động sinh tags từ profile
      const profile = body.studentProfile || {};
      const tags = body.tags || [];
      if (!tags.length) {
        if (profile.visaFail === 'yes') tags.push('visa_fail');
        if (profile.gpa && profile.gpa < 5.0) tags.push('low_gpa');
        if (profile.age && profile.age > 25) tags.push('age_25_plus');
        if (profile.korean === 'topik3' || profile.korean === 'topik2') tags.push('has_topik');
        if (profile.korean === 'none') tags.push('no_korean');
        if (profile.absences && profile.absences > 20) tags.push('high_absences');
        if (profile.budget === 'low') tags.push('low_budget');
      }

      const caseData = {
        student_name: body.studentName || '',
        student_phone: body.studentPhone || '',
        student_profile: profile,
        visa_type: body.visaType || 'D2-6',
        recommendation: body.recommendation || {},
        top_schools: body.topSchools || [],
        ai_advice: body.aiAdvice || '',
        result: 'pending',
        school_id: body.schoolId || null,
        semester_id: body.semesterId || null,
        student_id: body.studentId || null,
        created_by: req.user?.id || null,
        tags: tags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('advisor_cases')
        .insert(caseData)
        .select('id, student_name, visa_type, created_at')
        .single();

      if (error) throw new Error(error.message);
      return res.status(201).json({ success: true, data });
    }

    // ─── PUT: Cập nhật case (confirm result, add notes) ───
    if (req.method === 'PUT') {
      if (!id) return res.status(400).json({ error: 'Case ID is required' });

      const { data: existing } = await supabase
        .from('advisor_cases')
        .select('id')
        .eq('id', id)
        .maybeSingle();

      if (!existing) return res.status(404).json({ error: 'Case not found' });

      const body = req.body || {};
      const updateData = { updated_at: new Date().toISOString() };

      if (body.result) {
        updateData.result = body.result;
        updateData.confirmed_by = req.user?.id || null;
        updateData.confirmed_at = new Date().toISOString();
      }
      if (body.notes !== undefined) updateData.notes = body.notes;
      if (body.lessonsLearned !== undefined) updateData.lessons_learned = body.lessonsLearned;
      if (body.isFlagged !== undefined) updateData.is_flagged = body.isFlagged;
      if (body.tags !== undefined) updateData.tags = body.tags;
      if (body.schoolId) updateData.school_id = body.schoolId;

      const { data, error } = await supabase
        .from('advisor_cases')
        .update(updateData)
        .eq('id', id)
        .select('id, student_name, visa_type, result, confirmed_at, notes, lessons_learned, tags')
        .single();

      if (error) throw new Error(error.message);
      return res.json({ success: true, data });
    }

    // ─── DELETE: Xoá case ───
    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'Case ID is required' });

      const { error } = await supabase
        .from('advisor_cases')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return res.json({ success: true, message: 'Case deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('/api/admin/cases error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});
