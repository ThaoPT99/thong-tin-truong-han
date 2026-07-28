// api/crm.js — API cho CRM Quản lý học sinh (dành cho sale)
// GET    /api/crm           — Lấy danh sách học sinh
// GET    /api/crm?id=xxx    — Lấy chi tiết 1 học sinh + audit logs
// POST   /api/crm           — Tạo học sinh mới
// PUT    /api/crm?id=xxx    — Cập nhật thông tin
// DELETE /api/crm?id=xxx    — Xoá học sinh

const { supabase } = require('../lib/supabase');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const ALLOWED_FIELDS = [
  'full_name', 'birth_date', 'birthplace', 'id_number',
  'issue_date', 'issue_place', 'phone', 'email',
  'passport_url', 'avatar_url',
  'father_name', 'father_dob', 'father_phone',
  'mother_name', 'mother_dob', 'mother_phone',
  'high_school', 'university',
  'gpa', 'absences', 'post_high_school',
  'vn_school', 'vn_major', 'kr_school', 'kr_major',
  'language_cert', 'cd_class', 'sejong_class',
  'payment_count', 'payment_amount',
  'bhp_relative',
  'is_source', 'family_info', 'status', 'sale_note',
];

const FIELD_LABELS = {
  'full_name': 'Họ tên', 'birth_date': 'Ngày sinh', 'birthplace': 'Quê quán',
  'id_number': 'CCCD/HC', 'issue_date': 'Ngày cấp', 'issue_place': 'Nơi cấp',
  'phone': 'SĐT HS', 'email': 'Email', 'passport_url': 'Hộ chiếu', 'avatar_url': 'Ảnh thẻ',
  'father_name': 'Tên bố', 'father_dob': 'NS bố', 'father_phone': 'SĐT bố',
  'mother_name': 'Tên mẹ', 'mother_dob': 'NS mẹ', 'mother_phone': 'SĐT mẹ',
  'high_school': 'Trường C3', 'university': 'CĐ/ĐH',
  'gpa': 'Điểm TB', 'absences': 'Buổi nghỉ', 'post_high_school': 'Sau THPT',
  'vn_school': 'Trường VN', 'vn_major': 'CN VN',
  'kr_school': 'Trường HQ', 'kr_major': 'CN HQ',
  'language_cert': 'Chứng chỉ', 'cd_class': 'Lớp CĐ', 'sejong_class': 'Lớp Sejong',
  'payment_count': 'SL đóng', 'payment_amount': 'Số tiền',
  'bhp_relative': 'Người thân BHP',
  'is_source': 'HS nguồn', 'family_info': 'Gia đình',
  'status': 'Trạng thái', 'sale_note': 'Ghi chú',
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { method, query, body } = req;
    let isAdmin = false;
    try { isAdmin = await checkAdminAuth(req); } catch(e) {}
    if (!isAdmin) return res.status(401).json({ success: false, error: 'Unauthorized' });
    const changedBy = getCurrentUserEmail(req);

    switch (method) {
      case 'GET': {
        if (query.id) {
          const { data, error } = await supabase.from('crm_students').select('*').eq('id', query.id).single();
          if (error) return res.status(404).json({ success: false, error: 'Không tìm thấy' });
          const { data: logs } = await supabase.from('crm_audit_logs').select('*')
            .eq('student_id', query.id).order('created_at', { ascending: false }).limit(50);
          return res.status(200).json({ success: true, data: { ...data, audit_logs: logs || [] } });
        }
        let q = supabase.from('crm_students').select('*');
        if (query.status) q = q.eq('status', query.status);
        if (query.is_source === 'true') q = q.eq('is_source', true);
        if (query.is_source === 'false') q = q.eq('is_source', false);
        if (query.search) q = q.ilike('full_name', '%' + query.search + '%');
        q = q.order('created_at', { ascending: false });
        if (query.limit) q = q.limit(parseInt(query.limit) || 100);
        const { data, error } = await q;
        if (error) throw error;
        return res.status(200).json({ success: true, data: data || [] });
      }

      case 'POST': {
        if (!body?.full_name) return res.status(400).json({ success: false, error: 'Thiếu họ tên' });

        const payload = {};
        for (const f of ALLOWED_FIELDS) {
          if (body[f] !== undefined) payload[f] = body[f];
        }
        if (payload.is_source !== true) payload.is_source = false;

        const { data, error } = await supabase.from('crm_students').insert(payload).select().single();
        if (error) throw error;

        try {
          await supabase.from('crm_audit_logs').insert({
            student_id: data.id, action: 'created',
            changes: { full_name: { new: payload.full_name } },
            changed_by: changedBy || 'unknown',
          });
        } catch (e) { console.error('Audit error:', e); }
        return res.status(201).json({ success: true, data });
      }

      case 'PUT': {
        const { id } = query;
        if (!id) return res.status(400).json({ success: false, error: 'Thiếu ID' });
        const { data: oldData } = await supabase.from('crm_students').select('*').eq('id', id).single();
        if (!oldData) return res.status(404).json({ success: false, error: 'Không tìm thấy' });

        const updates = { updated_at: new Date().toISOString() };
        for (const f of ALLOWED_FIELDS) {
          if (body[f] !== undefined) updates[f] = body[f];
        }

        const { data, error } = await supabase.from('crm_students').update(updates).eq('id', id).select().single();
        if (error) throw error;

        const changes = {};
        for (const f of ALLOWED_FIELDS) {
          if (JSON.stringify(oldData[f]) !== JSON.stringify(data[f])) {
            changes[f] = { old: oldData[f], new: data[f] };
          }
        }
        if (Object.keys(changes).length > 0) {
          try {
            await supabase.from('crm_audit_logs').insert({
              student_id: id, action: 'updated', changes, changed_by: changedBy || 'unknown',
            });
          } catch (e) { console.error('Audit error:', e); }
        }
        return res.status(200).json({ success: true, data });
      }

      case 'DELETE': {
        const { id } = query;
        if (!id) return res.status(400).json({ success: false, error: 'Thiếu ID' });
        const { data: delData } = await supabase.from('crm_students').select('full_name').eq('id', id).single();
        if (!delData) return res.status(404).json({ success: false, error: 'Không tìm thấy' });

        try {
          await supabase.from('crm_audit_logs').insert({
            student_id: id, action: 'deleted',
            changes: { full_name: { old: delData.full_name } },
            changed_by: changedBy || 'unknown',
          });
        } catch (e) { console.error('Audit error:', e); }

        const { error } = await supabase.from('crm_students').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('CRM API error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

async function checkAdminAuth(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return false;
  const token = auth.slice(7);
  if (token === process.env.ADMIN_API_KEY) return true;
  // Cách 1: Supabase Auth JWT (dùng cho auth/student)
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (user && !error) return true;
  } catch(e) {}
  // Cách 2: Custom JWT (admin login dùng JWT_SECRET)
  if (JWT_SECRET) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded && decoded.id) return true;
    } catch(e) {}
  }
  return false;
}

function getCurrentUserEmail(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  if (token === process.env.ADMIN_API_KEY) return 'admin_script';
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      return payload.email || payload.sub || null;
    }
  } catch(e) {}
  return null;
}
