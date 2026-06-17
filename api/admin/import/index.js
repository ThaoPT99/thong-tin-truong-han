// POST /api/admin/import — Import dữ liệu từ Excel (JSON payload)
const { requireAdmin } = require('../../../lib/auth');
const { supabase } = require('../../../lib/supabase');

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

        // ─── Replace child tables ───
        async function replaceChildTable(table, items) {
          if (!items || !Array.isArray(items) || items.length === 0) return;
          await supabase.from(table).delete().eq('school_id', schoolId);
          const rows = items.map((text, i) => ({
            school_id: schoolId,
            text: String(text),
            sort_order: i,
          }));
          const { error: insErr } = await supabase.from(table).insert(rows);
          if (insErr) console.error(table + ' insert error:', insErr.message);
        }

        try { await replaceChildTable('school_conditions', school.conditions); } catch (e) {}
        try { await replaceChildTable('school_majors', school.majors); } catch (e) {}
        try { await replaceChildTable('school_advantages', school.advantages); } catch (e) {}
        try { await replaceChildTable('school_conversions', school.conversion); } catch (e) {}
        try { await replaceChildTable('school_documents', school.documents); } catch (e) {}

        // Partners
        if (school.partners && Array.isArray(school.partners)) {
          await supabase.from('school_partners').delete().eq('school_id', schoolId);
          if (school.partners.length > 0) {
            const pr = school.partners.map(p => ({
              school_id: schoolId,
              code: p.code || '',
              name: p.name || '',
              name_kr: p.nameKr || '',
            }));
            await supabase.from('school_partners').insert(pr);
          }
        }

        // Advisor profile (upsert)
        if (school.advisorProfile) {
          const ap = school.advisorProfile;
          const { data: existingAp } = await supabase
            .from('school_advisor_profiles')
            .select('id').eq('school_id', schoolId).maybeSingle();

          const ad = {
            school_id: schoolId,
            gender: ap.gender || 'all',
            min_gpa: ap.minGpa || 5.0,
            max_absences: ap.maxAbsences || 30,
            cost_level: ap.costLevel || 3,
            visa_chance: ap.visaChance || 3,
            job_opportunity: ap.jobOpportunity || 3,
            e7_opportunity: ap.e7Opportunity || 3,
            study_load: ap.studyLoad || 3,
            interview_difficulty: ap.interviewDifficulty || 2,
            tags: ap.tags || [],
            updated_at: new Date().toISOString(),
          };

          if (existingAp) {
            await supabase.from('school_advisor_profiles').update(ad).eq('id', existingAp.id);
          } else {
            await supabase.from('school_advisor_profiles').insert(ad);
          }
        }
      } catch (err) {
        results.errors.push({ slug: school.slug || 'unknown', error: err.message || 'Unknown error' });
      }
    }

    // ─── Import extra sheets ───
    if (extraSheets) {
      if (extraSheets.visaChecklist && Array.isArray(extraSheets.visaChecklist)) {
        await supabase.from('extra_visa_checklist').delete().gte('id', '00000000-0000-0000-0000-000000000000');
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
        await supabase.from('extra_interviews').delete().gte('id', '00000000-0000-0000-0000-000000000000');
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

    // ─── Import semester info ───
    if (semesterInfo && (semesterInfo.ky || semesterInfo.nam)) {
      const { data: existingSem } = await supabase
        .from('semester_info').select('id').limit(1).maybeSingle();

      const semData = {
        ky: semesterInfo.ky || '3',
        nam: semesterInfo.nam || '2027',
        title: semesterInfo.title || '',
      };

      if (existingSem) {
        await supabase.from('semester_info').update(semData).eq('id', existingSem.id);
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
