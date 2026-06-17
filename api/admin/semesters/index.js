// GET/POST /api/admin/semesters — quản lý danh sách kỳ tuyển sinh + gán trường
const { requireAdmin } = require('../../../lib/auth');
const { supabase } = require('../../../lib/supabase');

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query.action; // 'schools' để quản lý school assignment

  try {
    // ─── GET: danh sách kỳ, hoặc school assignments nếu ?action=schools ───
    if (req.method === 'GET') {
      if (action === 'schools') {
        // GET /api/admin/semesters?action=schools&semester_id=xxx
        const semesterId = req.query.semester_id;
        let query = supabase.from('semester_schools').select('*');
        if (semesterId) query = query.eq('semester_id', semesterId);
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return res.json({ success: true, data: data || [] });
      }

      const { data, error } = await supabase
        .from('semesters')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('nam', { ascending: false })
        .order('ky', { ascending: false });

      if (error) throw new Error(error.message);
      return res.json({ success: true, data: data || [] });
    }

    // ─── POST: tạo kỳ mới, hoặc add schools nếu ?action=schools ───
    if (req.method === 'POST') {
      if (action === 'schools') {
        // POST /api/admin/semesters?action=schools
        const body = req.body || {};
        const { semester_id, school_ids } = body;
        if (!semester_id || !school_ids || !Array.isArray(school_ids) || school_ids.length === 0) {
          return res.status(400).json({ error: 'semester_id and school_ids[] are required' });
        }
        // Verify semester tồn tại
        const { data: sem } = await supabase.from('semesters').select('id').eq('id', semester_id).maybeSingle();
        if (!sem) return res.status(404).json({ error: 'Semester not found' });

        const rows = school_ids.map(schoolId => ({ semester_id, school_id: schoolId }));
        const { data, error } = await supabase
          .from('semester_schools')
          .upsert(rows, { onConflict: 'semester_id,school_id', ignoreDuplicates: true })
          .select('*');
        if (error) throw error;
        return res.status(201).json({ success: true, data: data || [], count: (data || []).length });
      }

      const body = req.body || {};
      if (!body.ky || !body.nam) {
        return res.status(400).json({ error: 'ky and nam are required' });
      }

      const { data: existing } = await supabase
        .from('semesters').select('id').eq('ky', body.ky).eq('nam', body.nam).maybeSingle();
      if (existing) return res.status(409).json({ error: 'Semester already exists' });

      if (body.isActive) await supabase.from('semesters').update({ is_active: false }).not('id', 'is', null);

      const { data, error } = await supabase.from('semesters').insert({
        ky: body.ky, nam: body.nam,
        title: body.title || `Kỳ tháng ${body.ky}/${body.nam}`,
        is_active: body.isActive || false,
        sort_order: body.sortOrder || 0,
      }).select('*').single();
      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    // ─── PUT: cập nhật kỳ ───
    if (req.method === 'PUT') {
      const semesterId = req.query.id;
      if (!semesterId) return res.status(400).json({ error: 'Missing semester id query param' });

      const body = req.body || {};
      const updateData = {};

      if (body.ky !== undefined) updateData.ky = body.ky;
      if (body.nam !== undefined) updateData.nam = body.nam;
      if (body.title !== undefined) updateData.title = body.title;
      if (body.isActive !== undefined) {
        if (body.isActive) await supabase.from('semesters').update({ is_active: false }).not('id', 'is', null);
        updateData.is_active = body.isActive;
      }
      if (body.sortOrder !== undefined) updateData.sort_order = body.sortOrder;
      updateData.updated_at = new Date().toISOString();

      if (Object.keys(updateData).length <= 1) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      const { data, error } = await supabase.from('semesters').update(updateData).eq('id', semesterId).select('*').single();
      if (error) throw error;
      return res.json({ success: true, data });
    }

    // ─── DELETE: xoá kỳ hoặc xoá 1 school khỏi kỳ nếu ?action=schools ───
    if (req.method === 'DELETE') {
      if (action === 'schools') {
        const semesterId = req.query.semester_id;
        const schoolId = req.query.school_id;
        if (!semesterId || !schoolId) {
          return res.status(400).json({ error: 'semester_id and school_id query params are required' });
        }
        const { error } = await supabase.from('semester_schools').delete()
          .eq('semester_id', semesterId).eq('school_id', schoolId);
        if (error) throw error;
        return res.json({ success: true });
      }

      const semesterId = req.query.id;
      if (!semesterId) return res.status(400).json({ error: 'Missing semester id query param' });
      const { error } = await supabase.from('semesters').delete().eq('id', semesterId);
      if (error) throw error;
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('/api/admin/semesters error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});
