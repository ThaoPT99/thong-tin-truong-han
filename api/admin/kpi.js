// GET /api/admin/kpi — KPI Dashboard cho Sale
// Director xem được tất cả, Sale chỉ xem được của mình
const { requireAdmin } = require('../../lib/auth');
const { supabase } = require('../../lib/supabase');

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const isDirector = req.user?.role === 'director';
    const userId = req.user?.id;

    // Lấy danh sách sales (nếu là director) hoặc chỉ lấy chính mình
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

    // Lấy tất cả students (director thấy hết, sale chỉ thấy của mình)
    let studentQuery = supabase
      .from('students')
      .select('id, name, owner_id, status, school_id, created_at, updated_at, schools(name)');

    if (!isDirector) {
      studentQuery = studentQuery.eq('owner_id', userId);
    }

    const { data: allStudents } = await studentQuery;
    const students = allStudents || [];

    // Lấy danh sách schools để map tên
    const { data: schoolsData } = await supabase
      .from('schools')
      .select('id, name');

    const schoolMap = {};
    for (const s of schoolsData || []) {
      schoolMap[s.id] = s.name;
    }

    // Tính toán KPI cho từng sale
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const salesKpi = [];
    let totalNew = 0;
    let totalConsulting = 0;
    let totalApplied = 0;
    let totalEnrolled = 0;

    for (const u of users) {
      // Nếu là director, chỉ tính KPI cho sale (không tính cho chính director)
      if (isDirector && u.role !== 'sale') continue;

      const myStudents = students.filter(s => s.owner_id === u.id);

      // Đếm theo trạng thái
      const statusCounts = {};
      let newThisWeek = 0;
      let newThisMonth = 0;
      const schoolCounts = {};

      for (const s of myStudents) {
        const st = s.status || 'new';
        statusCounts[st] = (statusCounts[st] || 0) + 1;

        // Mới trong tuần/tháng
        const created = new Date(s.created_at);
        if (created >= new Date(weekAgo)) newThisWeek++;
        if (created >= new Date(monthAgo)) newThisMonth++;

        // Đếm theo trường
        if (s.school_id) {
          schoolCounts[s.school_id] = (schoolCounts[s.school_id] || 0) + 1;
        }
      }

      // Top 3 trường
      const topSchools = Object.entries(schoolCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id, count]) => ({ id, name: schoolMap[id] || 'Đã xoá', count }));

      // Tỷ lệ chuyển đổi: enrolled / total
      const totalStudentsCount = Object.values(statusCounts).reduce((sum, v) => sum + v, 0);
      const enrolled = statusCounts['enrolled'] || 0;
      const conversionRate = totalStudentsCount > 0 ? (enrolled / totalStudentsCount) * 100 : 0;

      const kpi = {
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
          enrolled: statusCounts['enrolled'] || 0,
        },
        topSchools,
        enrolled,
        conversionRate: Math.round(conversionRate * 10) / 10,
      };

      salesKpi.push(kpi);
      totalNew += statusCounts['new'] || 0;
      totalConsulting += statusCounts['consulting'] || 0;
      totalApplied += statusCounts['applied'] || 0;
      totalEnrolled += enrolled;
    }

    // Tổng quan cho director
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

    return res.json({
      success: true,
      data: {
        sales: salesKpi,
        summary,
        isDirector,
      },
    });
  } catch (err) {
    console.error('/api/admin/kpi error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});
