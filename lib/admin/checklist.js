// GET/POST/PUT/DELETE /api/admin/checklist — quản lý visa checklist
// Consolidated: GET/POST /api/admin/checklist, GET/PUT/DELETE /api/admin/checklist?id=:id
const { requireAdmin } = require('../auth');
const { supabase } = require('../supabase');

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { id } = req.query;

    // ─── GET: list tất cả items / hoặc lấy 1 item ───
    if (req.method === 'GET') {
      if (id) {
        // GET /api/admin/checklist?id=:id - lấy item chi tiết
        const { data, error } = await supabase
          .from('extra_visa_checklist')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) throw new Error(error.message);
        if (!data) return res.status(404).json({ error: 'Item not found' });
        return res.json({ success: true, data });
      }

      // GET /api/admin/checklist - list tất cả
      const { data, error } = await supabase
        .from('extra_visa_checklist')
        .select('*')
        .order('sort_order');

      if (error) throw new Error(error.message);
      return res.json({ success: true, data: data || [] });
    }

    // ─── POST: tạo item mới ───
    if (req.method === 'POST') {
      const body = typeof req.body === 'object' ? req.body : {};

      if (!body.content) {
        return res.status(400).json({ error: 'content is required' });
      }

      // Get max sort_order
      const { data: maxOrder } = await supabase
        .from('extra_visa_checklist')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1);

      const nextOrder = (maxOrder && maxOrder.length > 0) ? (maxOrder[0].sort_order || 0) + 1 : 0;

      const { data, error } = await supabase
        .from('extra_visa_checklist')
        .insert({
          group_name: body.groupName || '',
          content: body.content,
          note: body.note || '',
          level: body.level || 'Bắt buộc',
          sort_order: nextOrder,
          stt: body.stt || '',
        })
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return res.status(201).json({ success: true, data });
    }

    // ─── PUT/DELETE: cần id ───
    if (req.method === 'PUT' || req.method === 'DELETE') {
      if (!id) {
        return res.status(400).json({ error: 'Item ID is required' });
      }

      // Check item exists
      const { data: existing, error: findErr } = await supabase
        .from('extra_visa_checklist')
        .select('id')
        .eq('id', id)
        .maybeSingle();

      if (findErr) throw new Error(findErr.message);
      if (!existing) {
        return res.status(404).json({ error: 'Item not found' });
      }

      // ─── DELETE ───
      if (req.method === 'DELETE') {
        const { error: delErr } = await supabase
          .from('extra_visa_checklist')
          .delete()
          .eq('id', id);

        if (delErr) throw new Error(delErr.message);
        return res.json({ success: true, message: 'Item deleted' });
      }

      // ─── PUT ───
      const body = (req.body && typeof req.body === 'object') ? req.body : {};

      const updateData = {};
      if (body.groupName !== undefined) updateData.group_name = body.groupName;
      if (body.content !== undefined) updateData.content = body.content;
      if (body.note !== undefined) updateData.note = body.note;
      if (body.level !== undefined) updateData.level = body.level;
      if (body.stt !== undefined) updateData.stt = body.stt;
      if (body.sortOrder !== undefined) updateData.sort_order = body.sortOrder;
      updateData.updated_at = new Date().toISOString();

      const { data, error: updErr } = await supabase
        .from('extra_visa_checklist')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (updErr) throw new Error(updErr.message);
      return res.json({ success: true, data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('/api/admin/checklist error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});