// GET/POST /api/admin/semesters — quản lý danh sách kỳ tuyển sinh
const { requireAdmin } = require('../../../lib/auth');
const { supabase } = require('../../../lib/supabase');

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // ─── GET: danh sách tất cả kỳ ───
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('semesters')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('nam', { ascending: false })
        .order('ky', { ascending: false });

      if (error) throw new Error(error.message);
      return res.json({ success: true, data: data || [] });
    }

    // ─── POST: tạo kỳ mới ───
    if (req.method === 'POST') {
      const body = req.body || {};
      if (!body.ky || !body.nam) {
        return res.status(400).json({ error: 'ky and nam are required' });
      }

      // Check duplicate
      const { data: existing } = await supabase
        .from('semesters')
        .select('id')
        .eq('ky', body.ky)
        .eq('nam', body.nam)
        .maybeSingle();

      if (existing) {
        return res.status(409).json({ error: 'Semester already exists' });
      }

      // Auto-generate title nếu không có
      const title = body.title || `Kỳ tháng ${body.ky}/${body.nam}`;

      // Nếu is_active=true, tắt active các kỳ khác
      if (body.isActive) {
        await supabase.from('semesters').update({ is_active: false }).not('id', 'is', null);
      }

      const { data, error } = await supabase
        .from('semesters')
        .insert({
          ky: body.ky,
          nam: body.nam,
          title: title,
          is_active: body.isActive || false,
          sort_order: body.sortOrder || 0,
        })
        .select('*')
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    // ─── PUT: cập nhật kỳ ───
    if (req.method === 'PUT') {
      const semesterId = req.query.id;
      if (!semesterId) {
        return res.status(400).json({ error: 'Missing semester id query param' });
      }

      const body = req.body || {};
      const updateData = {};

      if (body.ky !== undefined) updateData.ky = body.ky;
      if (body.nam !== undefined) updateData.nam = body.nam;
      if (body.title !== undefined) updateData.title = body.title;
      if (body.isActive !== undefined) {
        // Nếu set active, tắt active các kỳ khác
        if (body.isActive) {
          await supabase.from('semesters').update({ is_active: false }).not('id', 'is', null);
        }
        updateData.is_active = body.isActive;
      }
      if (body.sortOrder !== undefined) updateData.sort_order = body.sortOrder;
      updateData.updated_at = new Date().toISOString();

      if (Object.keys(updateData).length <= 1) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      const { data, error } = await supabase
        .from('semesters')
        .update(updateData)
        .eq('id', semesterId)
        .select('*')
        .single();

      if (error) throw error;
      return res.json({ success: true, data });
    }

    // ─── DELETE: xoá kỳ ───
    if (req.method === 'DELETE') {
      const semesterId = req.query.id;
      if (!semesterId) {
        return res.status(400).json({ error: 'Missing semester id query param' });
      }

      const { error } = await supabase.from('semesters').delete().eq('id', semesterId);
      if (error) throw error;
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('GET/POST/PUT/DELETE /api/admin/semesters error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});
