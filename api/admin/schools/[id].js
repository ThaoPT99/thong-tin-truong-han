// PUT/DELETE /api/admin/schools/:id — sửa/xoá trường
const { requireAdmin } = require('../../../lib/auth');
const { supabase } = require('../../../lib/supabase');

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

      // Child tables: delete old, insert new
      async function replaceChildTable(table, items) {
        if (!items || !Array.isArray(items) || items.length === 0) return;
        await supabase.from(table).delete().eq('school_id', schoolId);
        var rows = items.map(function(t, i) { return { school_id: schoolId, text: String(t), sort_order: i }; });
        var { error: insErr } = await supabase.from(table).insert(rows);
        if (insErr) console.error(table + ' insert error:', insErr.message);
      }

      // Run sequentially, catch individual errors
      try { await replaceChildTable('school_conditions', body.conditions); } catch (e) { console.error('conditions:', e.message); }
      try { await replaceChildTable('school_majors', body.majors); } catch (e) { console.error('majors:', e.message); }
      try { await replaceChildTable('school_advantages', body.advantages); } catch (e) { console.error('advantages:', e.message); }
      try { await replaceChildTable('school_conversions', body.conversion); } catch (e) { console.error('conversion:', e.message); }
      try { await replaceChildTable('school_documents', body.documents); } catch (e) { console.error('documents:', e.message); }

      // Partners
      if (body.partners && Array.isArray(body.partners)) {
        await supabase.from('school_partners').delete().eq('school_id', schoolId);
        if (body.partners.length > 0) {
          var pr = body.partners.map(function(p) {
            return { school_id: schoolId, code: p.code || '', name: p.name || '', name_kr: p.nameKr || '' };
          });
          await supabase.from('school_partners').insert(pr);
        }
      }

      // Advisor profile (upsert)
      if (body.advisorProfile) {
        var ap = body.advisorProfile;
        var { data: existingAp } = await supabase.from('school_advisor_profiles')
          .select('id').eq('school_id', schoolId).maybeSingle();

        var ad = {
          school_id: schoolId, gender: ap.gender || 'all',
          min_gpa: ap.minGpa || 5.0, max_absences: ap.maxAbsences || 30,
          cost_level: ap.costLevel || 3, visa_chance: ap.visaChance || 3,
          job_opportunity: ap.jobOpportunity || 3, e7_opportunity: ap.e7Opportunity || 3,
          study_load: ap.studyLoad || 3, interview_difficulty: ap.interviewDifficulty || 2,
          tags: ap.tags || [], updated_at: new Date().toISOString(),
        };

        if (existingAp) {
          await supabase.from('school_advisor_profiles').update(ad).eq('id', existingAp.id);
        } else {
          await supabase.from('school_advisor_profiles').insert(ad);
        }
      }

      return res.json({ success: true, message: 'School updated' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('PUT/DELETE error:', err.message || err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});
