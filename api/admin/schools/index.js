// POST /api/admin/schools — tạo trường mới (Supabase client)
const { requireAdmin } = require('../../../lib/auth');
const { supabase } = require('../../../lib/supabase');
const { insertChildTable, replacePartners, upsertAdvisorProfile } = require('../../../lib/helpers');

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
  } catch (err) {
    console.error('POST /api/admin/schools error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
