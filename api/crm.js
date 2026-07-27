// api/crm.js — API cho CRM Quản lý học sinh (dành cho sale)
// GET    /api/crm           — Lấy danh sách học sinh (admin)
// GET    /api/crm?id=xxx    — Lấy chi tiết 1 học sinh + audit logs (admin)
// POST   /api/crm           — Tạo học sinh mới (admin)
// PUT    /api/crm?id=xxx    — Cập nhật thông tin học sinh (admin)
// DELETE /api/crm?id=xxx    — Xoá học sinh (admin)

const { supabase } = require('../lib/supabase');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { method, query, body } = req;

    // Check admin auth
    let isAdmin = false;
    try { isAdmin = await checkAdminAuth(req); } catch(e) { /* ignore */ }
    if (!isAdmin) return res.status(401).json({ success: false, error: 'Unauthorized' });

    // Current user for audit log
    const changedBy = getCurrentUserEmail(req);

    switch (method) {
      // ─── GET ───
      case 'GET': {
        if (query.id) {
          const { data, error } = await supabase
            .from('crm_students')
            .select('*')
            .eq('id', query.id)
            .single();
          if (error) return res.status(404).json({ success: false, error: 'Không tìm thấy' });

          // Also fetch audit logs
          const { data: logs } = await supabase
            .from('crm_audit_logs')
            .select('*')
            .eq('student_id', query.id)
            .order('created_at', { ascending: false })
            .limit(50);

          return res.status(200).json({ success: true, data: { ...data, audit_logs: logs || [] } });
        }

        let dbQuery = supabase.from('crm_students').select('*');
        if (query.status) dbQuery = dbQuery.eq('status', query.status);
        if (query.is_source === 'true') dbQuery = dbQuery.eq('is_source', true);
        if (query.is_source === 'false') dbQuery = dbQuery.eq('is_source', false);
        if (query.search) dbQuery = dbQuery.ilike('full_name', '%' + query.search + '%');
        dbQuery = dbQuery.order('created_at', { ascending: false });
        if (query.limit) dbQuery = dbQuery.limit(parseInt(query.limit) || 100);

        const { data, error } = await dbQuery;
        if (error) throw error;
        return res.status(200).json({ success: true, data: data || [] });
      }

      // ─── POST: Tạo mới + audit log ───
      case 'POST': {
        const {
          full_name, birth_date, birthplace, id_number,
          vn_school, vn_major, kr_school, kr_major,
          language_cert, cd_class, sejong_class,
          payment_count, payment_amount,
          is_source, family_info, status, sale_note,
        } = body || {};

        if (!full_name) return res.status(400).json({ success: false, error: 'Thiếu họ tên học sinh' });

        const { data, error } = await supabase
          .from('crm_students')
          .insert({
            full_name,
            birth_date: birth_date || null,
            birthplace: birthplace || '',
            id_number: id_number || '',
            vn_school: vn_school || '',
            vn_major: vn_major || '',
            kr_school: kr_school || '',
            kr_major: kr_major || '',
            language_cert: language_cert || '',
            cd_class: cd_class || '',
            sejong_class: sejong_class || '',
            payment_count: payment_count || 0,
            payment_amount: payment_amount || 0,
            is_source: is_source === true,
            family_info: family_info || {},
            status: status || 'new',
            sale_note: sale_note || '',
          })
          .select()
          .single();

        if (error) throw error;

        // Audit log
        await supabase.from('crm_audit_logs').insert({
          student_id: data.id,
          action: 'created',
          changes: { full_name: { new: full_name } },
          changed_by: changedBy || 'unknown',
        }).catch(e => console.error('Audit error:', e));

        return res.status(201).json({ success: true, data });
      }

      // ─── PUT: Cập nhật + audit log ───
      case 'PUT': {
        const { id } = query;
        if (!id) return res.status(400).json({ success: false, error: 'Thiếu ID' });

        // Fetch old data for diff
        const { data: oldData, error: fetchError } = await supabase
          .from('crm_students').select('*').eq('id', id).single();
        if (fetchError || !oldData) return res.status(404).json({ success: false, error: 'Không tìm thấy' });

        const allowedFields = [
          'full_name', 'birth_date', 'birthplace', 'id_number',
          'vn_school', 'vn_major', 'kr_school', 'kr_major',
          'language_cert', 'cd_class', 'sejong_class',
          'payment_count', 'payment_amount',
          'is_source', 'family_info', 'status', 'sale_note',
        ];

        const updates = {};
        for (const field of allowedFields) {
          if (body[field] !== undefined) updates[field] = body[field];
        }
        updates.updated_at = new Date().toISOString();

        const { data, error } = await supabase
          .from('crm_students')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        // Compute diff for audit log
        const changes = {};
        for (const field of allowedFields) {
          const oldVal = JSON.stringify(oldData[field]);
          const newVal = JSON.stringify(data[field]);
          if (oldVal !== newVal) {
            changes[field] = { old: oldData[field], new: data[field] };
          }
        }

        if (Object.keys(changes).length > 0) {
          await supabase.from('crm_audit_logs').insert({
            student_id: id,
            action: 'updated',
            changes,
            changed_by: changedBy || 'unknown',
          }).catch(e => console.error('Audit error:', e));
        }

        return res.status(200).json({ success: true, data });
      }

      // ─── DELETE: Xoá + audit log ───
      case 'DELETE': {
        const { id } = query;
        if (!id) return res.status(400).json({ success: false, error: 'Thiếu ID' });

        // Get student name before delete for audit
        const { data: delData } = await supabase
          .from('crm_students').select('full_name').eq('id', id).single();
        if (!delData) return res.status(404).json({ success: false, error: 'Không tìm thấy' });

        // Audit log BEFORE delete (FK có ON DELETE SET NULL, cần insert trước khi parent bị xoá)
        await supabase.from('crm_audit_logs').insert({
          student_id: id,
          action: 'deleted',
          changes: { full_name: { old: delData.full_name } },
          changed_by: changedBy || 'unknown',
        }).catch(e => console.error('Audit error:', e));

        // Then delete the student (SET NULL sẽ tự động clear FK trên audit log cũ)
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
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (user && !error) return true;
  } catch(e) { /* not a valid JWT */ }
  return false;
}

function getCurrentUserEmail(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  if (token === process.env.ADMIN_API_KEY) return 'admin_script';
  try {
    // Try to decode JWT payload without verification (just to get email)
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      return payload.email || payload.sub || null;
    }
  } catch(e) { /* silent */ }
  return null;
}
