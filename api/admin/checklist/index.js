// GET/POST /api/admin/checklist — quản lý visa checklist
const { requireAdmin } = require('../../../lib/auth');
const { supabase } = require('../../../lib/supabase');

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // ─── GET: list tất cả items ───
    if (req.method === 'GET') {
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

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('GET/POST /api/admin/checklist error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});
