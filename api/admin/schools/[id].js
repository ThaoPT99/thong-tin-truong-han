// PUT/DELETE /api/admin/schools/:id — sửa/xoá trường
const { requireAdmin } = require('../../../lib/auth');
const { supabase } = require('../../../lib/supabase');
const { replaceChildTable, replacePartners, upsertAdvisorProfile } = require('../../../lib/helpers');

module.exports = requireAdmin(async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'School ID is required' });
    }

    // Check school exists
    const { data: existingSchool, error: findErr } = await supabase
      .from('schools')
      .select('id, slug, name')
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
    if (req.method === 'PUT') {
      const body = (req.body && typeof req.body === 'object')
        ? req.body
        : {};

      // Update school row
      const updateData = {
        name: body.name || existingSchool.name,
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
        updated_at: new Date().toISOString(),
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
    console.error('PUT/DELETE error:', err.message || err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});
