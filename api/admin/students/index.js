// GET/POST /api/admin/students — quản lý học sinh (CRM mini)
const { requireAdmin } = require('../../../lib/auth');
const { supabase } = require('../../../lib/supabase');

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // ─── GET: danh sách học sinh (có filter) ───
    if (req.method === 'GET') {
      let query = supabase
        .from('students')
        .select('*, schools(name), semesters(ky, nam, title)')
        .order('created_at', { ascending: false });

      // Filters
      const { status, search, school_id, semester_id } = req.query;
      if (status) query = query.eq('status', status);
      if (school_id) query = query.eq('school_id', school_id);
      if (semester_id) query = query.eq('semester_id', semester_id);
      if (search) {
        query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return res.json({ success: true, data: data || [] });
    }

    // ─── POST: tạo học sinh mới ───
    if (req.method === 'POST') {
      const body = req.body || {};
      if (!body.name) {
        return res.status(400).json({ error: 'name is required' });
      }

      const { data, error } = await supabase
        .from('students')
        .insert({
          name: body.name,
          phone: body.phone || '',
          email: body.email || '',
          gender: body.gender || '',
          age: body.age || 0,
          gpa: body.gpa || null,
          korean_level: body.koreanLevel || '',
          school_id: body.schoolId || null,
          semester_id: body.semesterId || null,
          status: body.status || 'new',
          note: body.note || '',
          next_action: body.nextAction || '',
          next_action_date: body.nextActionDate || null,
        })
        .select('*, schools(name), semesters(ky, nam, title)')
        .single();

      if (error) throw error;

      // Auto log creation
      await supabase.from('student_logs').insert({
        student_id: data.id,
        action: 'created',
        description: 'Tạo hồ sơ học sinh',
        created_by: req.user?.email || 'admin',
      });

      return res.status(201).json({ success: true, data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('GET/POST /api/admin/students error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});
