// GET/POST/PUT/DELETE /api/admin/students — quản lý học sinh (CRM mini)
// Unified single file (không dùng [id].js để tránh vượt quá 12 functions limit của Vercel Hobby)
const { requireAdmin } = require('../../lib/auth');
const { supabase } = require('../../lib/supabase');

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const isDirector = req.user?.role === 'director';
  const userId = req.user?.id;

  try {
    // ─── GET ───
    if (req.method === 'GET') {
      // Nếu có id → lấy chi tiết 1 student + logs
      if (id) {
        let query = supabase
          .from('students')
          .select('*, schools(name), semesters(ky, nam, title), student_logs(*)')
          .eq('id', id);

        // Sale chỉ xem học sinh của mình
        if (!isDirector) {
          query = query.eq('owner_id', userId);
        }

        const { data: existing, error: findErr } = await query.maybeSingle();

        if (findErr) throw new Error(findErr.message);
        if (!existing) return res.status(404).json({ error: 'Student not found' });

        return res.json({ success: true, data: existing });
      }

      // Không có id → danh sách (có filter)
      let query = supabase
        .from('students')
        .select('*, schools(name), semesters(ky, nam, title)')
        .order('created_at', { ascending: false });

      // Sale chỉ thấy học sinh của mình
      if (!isDirector) {
        query = query.eq('owner_id', userId);
      }

      const { status, search, school_id, semester_id, owner_id } = req.query;
      if (status) query = query.eq('status', status);
      if (school_id) query = query.eq('school_id', school_id);
      if (semester_id) query = query.eq('semester_id', semester_id);
      // Director có thể filter theo owner_id
      if (isDirector && owner_id) query = query.eq('owner_id', owner_id);
      if (search) {
        query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.json({ success: true, data: data || [] });
    }

    // ─── POST: tạo học sinh mới ───
    if (req.method === 'POST') {
      const body = req.body || {};

      if (!body.name) {
        return res.status(400).json({ error: 'name is required' });
      }

      // Director có thể gán owner_id cho sale khác, Sale tự gán cho mình
      const ownerId = isDirector && body.ownerId ? body.ownerId : userId;

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
          owner_id: ownerId,
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

    // ─── PUT: cập nhật ───
    if (req.method === 'PUT') {
      if (!id) return res.status(400).json({ error: 'Student ID is required' });

      // Kiểm tra quyền sở hữu
      const { data: existing, error: findErr } = await supabase
        .from('students')
        .select('id, owner_id')
        .eq('id', id)
        .maybeSingle();

      if (findErr) throw new Error(findErr.message);
      if (!existing) return res.status(404).json({ error: 'Student not found' });

      // Sale chỉ được update học sinh của mình
      if (!isDirector && existing.owner_id !== userId) {
        return res.status(403).json({ error: 'Forbidden: not your student' });
      }

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
      // Director có thể đổi owner_id
      if (isDirector && body.ownerId !== undefined) updateData.owner_id = body.ownerId;
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

    // ─── DELETE ───
    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'Student ID is required' });

      // Kiểm tra quyền sở hữu
      const { data: existing, error: findErr } = await supabase
        .from('students')
        .select('id, owner_id')
        .eq('id', id)
        .maybeSingle();

      if (findErr) throw new Error(findErr.message);
      if (!existing) return res.status(404).json({ error: 'Student not found' });

      // Sale chỉ được xóa học sinh của mình
      if (!isDirector && existing.owner_id !== userId) {
        return res.status(403).json({ error: 'Forbidden: not your student' });
      }

      const { error: delErr } = await supabase.from('students').delete().eq('id', id);
      if (delErr) throw new Error(delErr.message);
      return res.json({ success: true, message: 'Student deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('/api/admin/students error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});