// POST /api/admin/import — Import dữ liệu từ Excel (JSON payload)
const { requireAdmin } = require('../auth');
const { supabase } = require('../supabase');
const { replaceChildTable, replacePartners, upsertAdvisorProfile } = require('../helpers');

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
    const { schools, extraSheets, semesterInfo } = body;

    if (!schools || !Array.isArray(schools) || schools.length === 0) {
      return res.status(400).json({ error: 'Missing or empty schools array' });
    }

    const results = {
      total: schools.length,
      created: 0,
      updated: 0,
      errors: [],
      extrasImported: false,
      semesterImported: false,
    };

    // ─── Import schools ───
    for (const school of schools) {
      try {
        if (!school.slug || !school.name) {
          results.errors.push({ slug: school.slug || 'unknown', error: 'Missing slug or name' });
          continue;
        }

        // Check existing
        const { data: existing } = await supabase
          .from('schools')
          .select('id')
          .eq('slug', school.slug)
          .maybeSingle();

        const schoolData = {
          slug: school.slug,
          name: school.name,
          name_kr: school.nameKr || '',
          name_en: school.nameEn || '',
          system: school.system || '',
          quota: school.quota || 0,
          region: school.region || '',
          location: school.location || '',
          intro: school.intro || '',
          tuition: school.tuition || '',
          insurance: school.insurance || '',
          ktx: school.ktx || '',
          schedule: school.schedule || '',
          documents_note: school.documentsNote || '',
          internal_note: school.internalNote || '',
          mou: school.mou || '',
          website: school.website || '',
          catalog_url: school.catalogUrl || '',
          invoice_url: school.invoiceUrl || '',
          video_url: school.videoUrl || '',
          video_youtube_id: school.videoYoutubeId || '',
          video_title: school.videoTitle || '',
          image_main: school.imageMain || 'images/placeholder.svg',
          image_catalog: school.imageCatalog || '',
          image_location: school.imageLocation || '',
          image_invoice: school.imageInvoice || '',
          updated_at: new Date().toISOString(),
        };

        let schoolId;

        if (existing) {
          // Update
          schoolId = existing.id;
          const { error: updErr } = await supabase
            .from('schools').update(schoolData).eq('id', schoolId);
          if (updErr) throw updErr;
          results.updated++;
        } else {
          // Insert
          const { data: inserted, error: insErr } = await supabase
            .from('schools').insert(schoolData).select('id').single();
          if (insErr) throw insErr;
          schoolId = inserted.id;
          results.created++;
        }

        // ─── Replace child tables (dùng shared helper) ───
        try { await replaceChildTable('school_conditions', schoolId, school.conditions); } catch (e) {}
        try { await replaceChildTable('school_majors', schoolId, school.majors); } catch (e) {}
        try { await replaceChildTable('school_advantages', schoolId, school.advantages); } catch (e) {}
        try { await replaceChildTable('school_conversions', schoolId, school.conversion); } catch (e) {}
        try { await replaceChildTable('school_documents', schoolId, school.documents); } catch (e) {}

        try { await replacePartners(schoolId, school.partners); } catch (e) {}
        try { await upsertAdvisorProfile(schoolId, school.advisorProfile); } catch (e) {}
      } catch (err) {
        results.errors.push({ slug: school.slug || 'unknown', error: err.message || 'Unknown error' });
      }
    }

    // ─── Import extra sheets ───
    if (extraSheets) {
      if (extraSheets.visaChecklist && Array.isArray(extraSheets.visaChecklist)) {
        await supabase.from('extra_visa_checklist').delete().not('id', 'is', null);
        if (extraSheets.visaChecklist.length > 0) {
          const rows = extraSheets.visaChecklist.map((item, i) => ({
            stt: item.stt || '',
            content: item.noidung || '',
            note: item.luuy || '',
            group_name: item.groupName || '',
            level: item.level || 'Bắt buộc',
            link_url: item.link || '',
            link_text: item.linkText || '',
            sort_order: i,
          }));
          await supabase.from('extra_visa_checklist').insert(rows);
        }
        results.extrasImported = true;
      }

      if (extraSheets.interviews && Array.isArray(extraSheets.interviews)) {
        await supabase.from('extra_interviews').delete().not('id', 'is', null);
        if (extraSheets.interviews.length > 0) {
          const rows = extraSheets.interviews.map((item, i) => ({
            stt: item.stt || '',
            content: item.noidung || '',
            link_url: item.link || '',
            link_text: item.linkText || '',
            sort_order: i,
          }));
          await supabase.from('extra_interviews').insert(rows);
        }
        results.extrasImported = true;
      }
    }

    // ─── Import semester info (tạo mới hoặc upsert vào semesters) ───
    if (semesterInfo && (semesterInfo.ky || semesterInfo.nam)) {
      const semKy = semesterInfo.ky || '3';
      const semNam = semesterInfo.nam || '2027';
      const semTitle = semesterInfo.title || `Kỳ tháng ${semKy}/${semNam}`;

      // Check if semester already exists in semesters table
      const { data: existingSem } = await supabase
        .from('semesters')
        .select('id')
        .eq('ky', semKy)
        .eq('nam', semNam)
        .maybeSingle();

      if (existingSem) {
        await supabase.from('semesters').update({ title: semTitle }).eq('id', existingSem.id);
      } else {
        const maxOrder = await supabase.from('semesters').select('sort_order').order('sort_order', { ascending: false }).limit(1).maybeSingle();
        const nextOrder = (maxOrder.data?.sort_order ?? -1) + 1;
        await supabase.from('semesters').insert({ ky: semKy, nam: semNam, title: semTitle, is_active: false, sort_order: nextOrder });
      }

      // Also keep old semester_info for backward compat
      const { data: oldSem } = await supabase.from('semester_info').select('id').limit(1).maybeSingle();
      const semData = { ky: semKy, nam: semNam, title: semTitle };
      if (oldSem) {
        await supabase.from('semester_info').update(semData).eq('id', oldSem.id);
      } else {
        await supabase.from('semester_info').insert(semData);
      }
      results.semesterImported = true;
    }

    return res.json({ success: true, results });
  } catch (err) {
    console.error('POST /api/admin/import error:', err);
    return res.status(500).json({ error: 'Import failed: ' + (err.message || 'Unknown error') });
  }
});
