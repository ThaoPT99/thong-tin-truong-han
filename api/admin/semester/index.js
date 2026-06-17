// GET/PUT /api/admin/semester — quản lý kỳ tuyển sinh
const { requireAdmin } = require('../../../lib/auth');
const { supabase } = require('../../../lib/supabase');

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // ─── GET: đọc thông tin kỳ tuyển sinh ───
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('semester_info')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return res.json({ success: true, data: data || null });
    }

    // ─── PUT: upsert thông tin kỳ tuyển sinh ───
    if (req.method === 'PUT') {
      const body = (req.body && typeof req.body === 'object') ? req.body : {};

      if (!body.ky && !body.nam) {
        return res.status(400).json({ error: 'ky or nam is required' });
      }

      // Check if record exists
      const { data: existing } = await supabase
        .from('semester_info')
        .select('id')
        .limit(1)
        .maybeSingle();

      const semesterData = {
        ky: body.ky || '',
        nam: body.nam || '',
        title: body.title || '',
      };

      let result;
      if (existing) {
        const { data, error } = await supabase
          .from('semester_info')
          .update(semesterData)
          .eq('id', existing.id)
          .select('*')
          .single();

        if (error) throw new Error(error.message);
        result = data;
      } else {
        const { data, error } = await supabase
          .from('semester_info')
          .insert(semesterData)
          .select('*')
          .single();

        if (error) throw new Error(error.message);
        result = data;
      }

      return res.json({ success: true, data: result });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('GET/PUT /api/admin/semester error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});
