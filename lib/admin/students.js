// GET/POST/PUT/DELETE /api/admin/students — quản lý học sinh (CRM mini)
// Unified single file (không dùng [id].js để tránh vượt quá 12 functions limit của Vercel Hobby)
const { requireAdmin } = require('../auth');
const { supabase } = require('../supabase');

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id, view } = req.query;
  const isDirector = req.user?.role === 'director';
  const userId = req.user?.id;

  try {
    // ─── GET ───
    if (req.method === 'GET') {
      // View Student Profiles (tài khoản đã đăng ký)
      if (view === 'student-profiles') {
        if (!isDirector) return res.status(403).json({ error: 'Only director can view all accounts' });
        
        const { data: profiles, error } = await supabase
          .from('student_profiles')
          .select('id, email, full_name, phone, created_at')
          .order('created_at', { ascending: false });
        
        if (error) throw new Error(error.message);
        return res.json({ success: true, data: profiles || [] });
      }

      // View Advisor Submissions (học sinh tự gửi form Tư vấn)
      if (view === 'advisor-submissions') {
        if (!isDirector) return res.status(403).json({ error: 'Only director can view all submissions' });
        
        const { data: submissions, error } = await supabase
          .from('student_advisor_submissions')
          .select('*, student_profiles!inner(email, full_name, phone)')
          .order('created_at', { ascending: false });
        
        if (error) throw new Error(error.message);
        return res.json({ success: true, data: submissions || [] });
      }

      // View Applications (quản lý đơn đăng ký nhập học)
      if (view === 'applications') {
        const { id, status } = req.query;
        
        if (id) {
          const { data, error } = await supabase
            .from('school_applications')
            .select('*, schools(name, name_kr), semesters(ky, nam, title)')
            .eq('id', id)
            .maybeSingle();
          if (error) throw new Error(error.message);
          if (!data) return res.status(404).json({ error: 'Application not found' });
          return res.json({ success: true, data });
        }
        
        let query = supabase
          .from('school_applications')
          .select('*, schools(name, name_kr), semesters(ky, nam, title)')
          .order('created_at', { ascending: false });
        if (status) query = query.eq('status', status);
        
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return res.json({ success: true, data: data || [] });
      }

      // View KPI Dashboard
      if (view === 'kpi') {
        // Lấy danh sách sales (director thấy hết, sale chỉ thấy mình)
        let userQuery = supabase
          .from('users')
          .select('id, email, display_name, role, is_active');

        if (!isDirector) {
          userQuery = userQuery.eq('id', userId);
        }

        const { data: users } = await userQuery;
        if (!users || users.length === 0) {
          return res.json({ success: true, data: { sales: [], summary: {} } });
        }

        // Lấy tất cả students
        let studentQuery = supabase
          .from('students')
          .select('id, name, owner_id, status, school_id, created_at, updated_at, schools(name)');

        if (!isDirector) {
          studentQuery = studentQuery.eq('owner_id', userId);
        }

        const { data: allStudents } = await studentQuery;
        const students = allStudents || [];

        // Map schools
        const { data: schoolsData } = await supabase
          .from('schools')
          .select('id, name');
        const schoolMap = {};
        for (const s of schoolsData || []) schoolMap[s.id] = s.name;

        // Tính toán KPI
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

        const salesKpi = [];

        for (const u of users) {
          if (isDirector && u.role !== 'sale') continue;

          const myStudents = students.filter(s => s.owner_id === u.id);
          const statusCounts = {};
          let newThisWeek = 0;
          let newThisMonth = 0;
          const schoolCounts = {};

          for (const s of myStudents) {
            const st = s.status || 'new';
            statusCounts[st] = (statusCounts[st] || 0) + 1;
            if (new Date(s.created_at) >= new Date(weekAgo)) newThisWeek++;
            if (new Date(s.created_at) >= new Date(monthAgo)) newThisMonth++;
            if (s.school_id) schoolCounts[s.school_id] = (schoolCounts[s.school_id] || 0) + 1;
          }

          const topSchools = Object.entries(schoolCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([id, count]) => ({ id, name: schoolMap[id] || 'Đã xoá', count }));

          const totalStudentsCount = Object.values(statusCounts).reduce((sum, v) => sum + v, 0);
          const enrolled = statusCounts['enrolled'] || 0;
          const conversionRate = totalStudentsCount > 0 ? (enrolled / totalStudentsCount) * 100 : 0;

          salesKpi.push({
            userId: u.id,
            email: u.email,
            displayName: u.display_name || u.email.split('@')[0],
            role: u.role,
            totalStudents: myStudents.length,
            newThisWeek,
            newThisMonth,
            statusBreakdown: {
              new: statusCounts['new'] || 0,
              consulting: statusCounts['consulting'] || 0,
              applied: statusCounts['applied'] || 0,
              waiting_visa: statusCounts['waiting_visa'] || 0,
              visa_approved: statusCounts['visa_approved'] || 0,
              visa_rejected: statusCounts['visa_rejected'] || 0,
              enrolled,
            },
            topSchools,
            enrolled,
            conversionRate: Math.round(conversionRate * 10) / 10,
          });
        }

        const summary = isDirector ? {
          totalSales: salesKpi.length,
          totalStudents: salesKpi.reduce((a, b) => a + b.totalStudents, 0),
          totalEnrolled: salesKpi.reduce((a, b) => a + b.enrolled, 0),
          avgConversion: salesKpi.length > 0
            ? Math.round((salesKpi.reduce((a, b) => a + b.conversionRate, 0) / salesKpi.length) * 10) / 10
            : 0,
          avgPerSale: salesKpi.length > 0
            ? Math.round((salesKpi.reduce((a, b) => a + b.totalStudents, 0) / salesKpi.length) * 10) / 10
            : 0,
        } : null;

        return res.json({ success: true, data: { sales: salesKpi, summary, isDirector } });
      }

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

    // ─── PUT: cập nhật (student hoặc application) ───
    if (req.method === 'PUT') {
      const { view } = req.query;
      
      // PUT: cập nhật đơn đăng ký (applications)
      if (view === 'application') {
        if (!id) return res.status(400).json({ error: 'Application ID is required' });
        const body = req.body || {};
        const updateData = { updated_at: new Date().toISOString() };
        if (body.status !== undefined) updateData.status = body.status;
        if (body.adminNote !== undefined) updateData.admin_note = body.adminNote;
        
        const { data, error } = await supabase
          .from('school_applications').update(updateData).eq('id', id)
          .select('*, schools(name), semesters(ky, nam, title)').single();
        if (error) throw new Error(error.message);
        return res.json({ success: true, data });
      }
      
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