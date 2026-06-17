// GET/POST /api/admin/semester-schools — quản lý trường trong kỳ tuyển sinh
const { requireAdmin } = require('../../../lib/auth');
const { supabase } = require('../../../lib/supabase');

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // ─── GET: lấy danh sách school_ids của 1 kỳ, hoặc tất cả ───
    if (req.method === 'GET') {
      const semesterId = req.query.semester_id;

      let query = supabase
        .from('semester_schools')
        .select('*');

      if (semesterId) {
        query = query.eq('semester_id', semesterId);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);

      return res.json({ success: true, data: data || [] });
    }

    // ─── POST: thêm 1 hoặc nhiều trường vào kỳ ───
    if (req.method === 'POST') {
      const body = req.body || {};
      const { semester_id, school_ids } = body;

      if (!semester_id || !school_ids || !Array.isArray(school_ids) || school_ids.length === 0) {
        return res.status(400).json({ error: 'semester_id and school_ids[] are required' });
      }

      // Verify semester tồn tại
      const { data: sem } = await supabase
        .from('semesters')
        .select('id')
        .eq('id', semester_id)
        .maybeSingle();

      if (!sem) {
        return res.status(404).json({ error: 'Semester not found' });
      }

      // Insert từng cái, skip conflict
      const rows = school_ids.map(schoolId => ({
        semester_id,
        school_id: schoolId,
      }));

      const { data, error } = await supabase
        .from('semester_schools')
        .upsert(rows, { onConflict: 'semester_id,school_id', ignoreDuplicates: true })
        .select('*');

      if (error) throw error;
      return res.status(201).json({ success: true, data: data || [], count: (data || []).length });
    }

    // ─── DELETE: xoá 1 trường khỏi kỳ ───
    if (req.method === 'DELETE') {
      const semesterId = req.query.semester_id;
      const schoolId = req.query.school_id;

      if (!semesterId || !schoolId) {
        return res.status(400).json({ error: 'semester_id and school_id query params are required' });
      }

      const { error } = await supabase
        .from('semester_schools')
        .delete()
        .eq('semester_id', semesterId)
        .eq('school_id', schoolId);

      if (error) throw error;
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('GET/POST/DELETE /api/admin/semester-schools error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});
