// PUT/DELETE /api/admin/checklist/:id — sửa/xoá checklist item
const { requireAdmin } = require('../../../lib/auth');
const { supabase } = require('../../../lib/supabase');

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { id } = req.query;
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
    if (req.method === 'PUT') {
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
    console.error('PUT/DELETE /api/admin/checklist/:id error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});
