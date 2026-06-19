// POST/PUT/DELETE /api/admin/schools — quản lý trường
// Consolidated: POST /api/admin/schools, GET/PUT/DELETE /api/admin/schools?id=:id
const { requireAdmin } = require('../../../lib/auth');
const { supabase } = require('../../../lib/supabase');
const { insertChildTable, replaceChildTable, replacePartners, upsertAdvisorProfile } = require('../../../lib/helpers');

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  try {
    // ─── GET: list hoặc get by id ───
    if (req.method === 'GET') {
      if (id) {
        // GET /api/admin/schools?id=:id - lấy trường chi tiết
        const { data, error } = await supabase
          .from('schools')
          .select(`*`)
          .eq('id', id)
          .maybeSingle();

        if (error) throw new Error(error.message);
        if (!data) return res.status(404).json({ error: 'School not found' });
        return res.json({ success: true, data });
      }

      // GET /api/admin/schools - list tất cả (lightweight)
      const { data, error } = await supabase
        .from('schools')
        .select('id, slug, name, name_kr, name_en, system, quota, region, location, updated_at')
        .order('slug');

      if (error) throw new Error(error.message);
      return res.json({ success: true, data: data || [] });
    }

    // ─── POST: tạo trường mới ───
    if (req.method === 'POST') {
      const body = req.body || {};

      if (!body.slug || !body.name) {
        return res.status(400).json({ error: 'slug and name are required' });
      }

      // Check duplicate slug
      const { data: existing } = await supabase
        .from('schools')
        .select('id')
        .eq('slug', body.slug)
        .limit(1);

      if (existing && existing.length > 0) {
        return res.status(409).json({ error: 'School with this slug already exists' });
      }

      const { data, error } = await supabase
        .from('schools')
        .insert({
          slug: body.slug,
          name: body.name,
          name_kr: body.nameKr || '',
          name_en: body.nameEn || '',
          system: body.system || '',
          quota: body.quota || 0,
          region: body.region || '',
          location: body.location || '',
          intro: body.intro || '',
          tuition: body.tuition || '',
          insurance: body.insurance || '',
          ktx: body.ktx || '',
          schedule: body.schedule || '',
          documents_note: body.documentsNote || '',
          internal_note: body.internalNote || '',
          mou: body.mou || '',
          website: body.website || '',
          catalog_url: body.catalogUrl || '',
          invoice_url: body.invoiceUrl || '',
          video_url: body.videoUrl || '',
          video_youtube_id: body.videoYoutubeId || '',
          video_title: body.videoTitle || '',
          image_main: body.imageMain || 'images/placeholder.svg',
          image_catalog: body.imageCatalog || '',
          image_location: body.imageLocation || '',
          image_invoice: body.imageInvoice || '',
        })
        .select('id, slug, name, created_at')
        .single();

      if (error) throw error;

      const school = data;

      // Insert child records (dùng shared helper)
      await Promise.all([
        insertChildTable('school_conditions', school.id, body.conditions),
        insertChildTable('school_majors', school.id, body.majors),
        insertChildTable('school_advantages', school.id, body.advantages),
        insertChildTable('school_conversions', school.id, body.conversion),
        insertChildTable('school_documents', school.id, body.documents),
      ]);

      try { await replacePartners(school.id, body.partners); } catch (e) {}
      try { await upsertAdvisorProfile(school.id, body.advisorProfile); } catch (e) {}

      return res.status(201).json({ success: true, data: school });
    }

    // ─── PUT/DELETE: cần id ───
    if (req.method === 'PUT' || req.method === 'DELETE') {
      if (!id) {
        return res.status(400).json({ error: 'School ID is required' });
      }

      // Check school exists — lấy full record để làm fallback
      const { data: existingSchool, error: findErr } = await supabase
        .from('schools')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (findErr) throw new Error(findErr.message);
      if (!existingSchool) {
        return res.status(404).json({ error: 'School not found' });
      }

      const schoolId = existingSchool.id;

      // ─── DELETE ───
      if (req.method === 'DELETE') {
        const { error: delErr } = await supabase.from('schools').delete().eq('id', schoolId);
        if (delErr) throw new Error(delErr.message);
        return res.json({ success: true, message: 'School deleted' });
      }

      // ─── PUT (update) ───
      const body = (req.body && typeof req.body === 'object') ? req.body : {};

      // Helper: dùng giá trị mới nếu được gửi, giữ nguyên nếu không
      const val = (field, fallback) => body[field] !== undefined ? body[field] : fallback;

      // Update school row — chỉ ghi đè các field được gửi lên
      const updateData = {
        name: val('name', existingSchool.name),
        name_kr: val('nameKr', existingSchool.name_kr || ''),
        name_en: val('nameEn', existingSchool.name_en || ''),
        system: val('system', existingSchool.system || ''),
        quota: val('quota', existingSchool.quota || 0),
        region: val('region', existingSchool.region || ''),
        location: val('location', existingSchool.location || ''),
        intro: val('intro', existingSchool.intro || ''),
        tuition: val('tuition', existingSchool.tuition || ''),
        insurance: val('insurance', existingSchool.insurance || ''),
        ktx: val('ktx', existingSchool.ktx || ''),
        schedule: val('schedule', existingSchool.schedule || ''),
        documents_note: val('documentsNote', existingSchool.documents_note || ''),
        mou: val('mou', existingSchool.mou || ''),
        website: val('website', existingSchool.website || ''),
        catalog_url: val('catalogUrl', existingSchool.catalog_url || ''),
        invoice_url: val('invoiceUrl', existingSchool.invoice_url || ''),
        video_url: val('videoUrl', existingSchool.video_url || ''),
        video_youtube_id: val('videoYoutubeId', existingSchool.video_youtube_id || ''),
        video_title: val('videoTitle', existingSchool.video_title || ''),
        image_main: val('imageMain', existingSchool.image_main || 'images/placeholder.svg'),
        image_catalog: val('imageCatalog', existingSchool.image_catalog || ''),
        image_location: val('imageLocation', existingSchool.image_location || ''),
        image_invoice: val('imageInvoice', existingSchool.image_invoice || ''),
        updated_at: new Date().toISOString(),
      };

      // Chỉ update internal_note nếu có gửi lên (tránh lỗi schema cache)
      if (body.internalNote !== undefined) {
        updateData.internal_note = body.internalNote;
      }
      };

      const { error: updErr } = await supabase
        .from('schools').update(updateData).eq('id', schoolId);

      if (updErr) throw new Error(updErr.message);

      // Child tables: dùng shared helper
      try { await replaceChildTable('school_conditions', schoolId, body.conditions); } catch (e) { console.error('conditions:', e.message); }
      try { await replaceChildTable('school_majors', schoolId, body.majors); } catch (e) { console.error('majors:', e.message); }
      try { await replaceChildTable('school_advantages', schoolId, body.advantages); } catch (e) { console.error('advantages:', e.message); }
      try { await replaceChildTable('school_conversions', schoolId, body.conversion); } catch (e) { console.error('conversion:', e.message); }
      try { await replaceChildTable('school_documents', schoolId, body.documents); } catch (e) { console.error('documents:', e.message); }

      try { await replacePartners(schoolId, body.partners); } catch (e) { console.error('partners:', e.message); }
      try { await upsertAdvisorProfile(schoolId, body.advisorProfile); } catch (e) { console.error('advisorProfile:', e.message); }

      return res.json({ success: true, message: 'School updated' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('/api/admin/schools error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});