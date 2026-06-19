// GET/PUT/POST/DELETE /api/admin/access-control — quản lý cài đặt chặn truy cập (BLOCKLIST)
const { requireAdmin } = require('../../lib/auth');
const { supabase } = require('../../lib/supabase');
const bcrypt = require('bcryptjs');

// Valid block types
const BLOCK_TYPES = ['block_password', 'block_ip', 'block_email'];

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  try {
    // ─── GET: Lấy danh sách cài đặt chặn truy cập ───
    if (req.method === 'GET') {
      let query = supabase
        .from('access_control')
        .select('*')
        .order('created_at', { ascending: false });

      if (id) {
        query = query.eq('id', id).maybeSingle();
      }

      const { data, error } = await query;
      if (error) throw error;

      if (id && !data) {
        return res.status(404).json({ error: 'Not found' });
      }

      return res.json({ success: true, data: id ? data : data || [] });
    }

    // ─── POST: Tạo rule chặn mới ───
    if (req.method === 'POST') {
      const body = req.body || {};
      const { type, value, description } = body;

      if (!type || !value) {
        return res.status(400).json({ error: 'type and value are required' });
      }

      if (!BLOCK_TYPES.includes(type)) {
        return res.status(400).json({ error: `Invalid type. Must be one of: ${BLOCK_TYPES.join(', ')}` });
      }

      let processedValue = value;
      if (type === 'block_password') {
        processedValue = await bcrypt.hash(value, 10);
      }

      const { data, error } = await supabase
        .from('access_control')
        .insert({
          type,
          value: processedValue,
          description: description || '',
          is_active: true,
          created_by: req.user?.id || null,
        })
        .select('*')
        .single();

      if (error) throw error;

      // Log action
      await supabase.from('access_logs').insert({
        user_id: req.user?.id || null,
        path: '/api/admin/access-control',
        method: 'POST',
        status: 201,
      });

      return res.status(201).json({ success: true, data });
    }

    // ─── PUT: Cập nhật rule ───
    if (req.method === 'PUT') {
      if (!id) return res.status(400).json({ error: 'ID is required' });

      const { data: existing } = await supabase
        .from('access_control')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!existing) return res.status(404).json({ error: 'Not found' });

      const body = req.body || {};
      const updateData = { updated_at: new Date().toISOString() };

      if (body.description !== undefined) updateData.description = body.description;
      if (body.is_active !== undefined) updateData.is_active = body.is_active;
      if (body.value !== undefined) {
        updateData.value = body.type === 'block_password' ? await bcrypt.hash(body.value, 10) : body.value;
      }
      if (body.type !== undefined) {
        if (!BLOCK_TYPES.includes(body.type)) {
          return res.status(400).json({ error: 'Invalid type' });
        }
        updateData.type = body.type;
        // Re-hash password if type changed to block_password
        if (body.type === 'block_password' && body.value) {
          updateData.value = await bcrypt.hash(body.value, 10);
        }
      }

      const { data, error } = await supabase
        .from('access_control')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;

      // Log action
      await supabase.from('access_logs').insert({
        user_id: req.user?.id || null,
        path: `/api/admin/access-control?id=${id}`,
        method: 'PUT',
        status: 200,
      });

      return res.json({ success: true, data });
    }

    // ─── DELETE: Xóa rule ───
    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'ID is required' });

      const { error } = await supabase
        .from('access_control')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Log action
      await supabase.from('access_logs').insert({
        user_id: req.user?.id || null,
        path: `/api/admin/access-control?id=${id}`,
        method: 'DELETE',
        status: 200,
      });

      return res.json({ success: true, message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('/api/admin/access-control error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});