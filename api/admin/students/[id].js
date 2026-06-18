// GET/PUT/DELETE /api/admin/students/:id — xem/sửa/xoá học sinh
const { requireAdmin } = require('../../../lib/auth');
const { supabase } = require('../../../lib/supabase');

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Student ID is required' });

    const { data: existing, error: findErr } = await supabase
      .from('students')
      .select('*, schools(name), semesters(ky, nam, title)')
      .eq('id', id)
      .maybeSingle();

    if (findErr) throw new Error(findErr.message);
    if (!existing) return res.status(404).json({ error: 'Student not found' });

    // ─── GET ───
    if (req.method === 'GET') {
      // Also get logs
      const { data: logs } = await supabase
        .from('student_logs')
        .select('*')
        .eq('student_id', id)
        .order('created_at', { ascending: false });

      return res.json({ success: true, data: { ...existing, logs: logs || [] } });
    }

    // ─── DELETE ───
    if (req.method === 'DELETE') {
      const { error: delErr } = await supabase.from('students').delete().eq('id', id);
      if (delErr) throw new Error(delErr.message);
      return res.json({ success: true, message: 'Student deleted' });
    }

    // ─── PUT ───
    if (req.method === 'PUT') {
      const body = req.body || {};

      const updateData = {};
      if (body.name !== undefined) updateData.name = body.name;
      if (body.phone !== undefined) updateData.phone = body.phone;
      if (body.email !== undefined) updateData.email = body.email;
      if (body.gender !== undefined) updateData.gender = body.gender;
      if (body.age !== undefined) updateData.age = body.age;
      if (body.gpa !== undefined) updateData.gpa = body.gpa;
      if (body.koreanLevel !== undefined) updateData.korean_level = body.koreanLevel;
      if (body.schoolId !== undefined) updateData.school_id = body.schoolId;
      if (body.semesterId !== undefined) updateData.semester_id = body.semesterId;
      if (body.status !== undefined) updateData.status = body.status;
      if (body.note !== undefined) updateData.note = body.note;
      if (body.nextAction !== undefined) updateData.next_action = body.nextAction;
      if (body.nextActionDate !== undefined) updateData.next_action_date = body.nextActionDate;
      updateData.updated_at = new Date().toISOString();

      if (Object.keys(updateData).length <= 1) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      const { data, error } = await supabase
        .from('students')
        .update(updateData)
        .eq('id', id)
        .select('*, schools(name), semesters(ky, nam, title)')
        .single();

      if (error) throw error;

      // Log the update
      const changedFields = Object.keys(updateData).filter(k => k !== 'updated_at');
      await supabase.from('student_logs').insert({
        student_id: id,
        action: 'updated',
        description: 'Cập nhật: ' + changedFields.join(', '),
        created_by: req.user?.email || 'admin',
      });

      return res.json({ success: true, data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('/api/admin/students/:id error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});
