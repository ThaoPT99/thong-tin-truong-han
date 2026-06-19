// GET/PUT/POST/DELETE /api/admin/access-control — quản lý cài đặt chặn truy cập (BLOCKLIST)
// GET /api/admin/access-logs — lấy nhật ký truy cập (paginated)
// GET /api/admin/access-export — export dữ liệu
const { requireAdmin } = require('../../lib/auth');
const { supabase } = require('../../lib/supabase');
const bcrypt = require('bcryptjs');

// Valid block types
const BLOCK_TYPES = ['block_password', 'block_ip', 'block_email'];

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const url = req.url || '';
  const isAccessLogs = req.url?.includes('/access-logs');
  const isExport = req.url?.includes('/access-export');

  try {
    // ─── GET: Lấy danh sách cài đặt chặn truy cập HOẶC access logs HOẶC export ───
    if (req.method === 'GET') {
      if (isAccessLogs) {
        // ─── GET: Access Logs (paginated) ───
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const { count, error: countError } = await supabase
          .from('access_logs')
          .select('*', { count: 'exact', head: true });

        if (countError) throw countError;

        const { data, error } = await supabase
          .from('access_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) throw error;

        return res.json({
          success: true,
          data: data || [],
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit)
        });
      }

      if (isExport) {
        // ─── GET: Export dữ liệu ───
        const [
          schoolsResult,
          checklistResult,
          interviewsResult,
          semestersResult,
          semesterSchoolsResult,
          conditionsResult,
          majorsResult,
          advantagesResult,
          conversionsResult,
          documentsResult,
          partnersResult,
          advisorProfilesResult,
        ] = await Promise.all([
          supabase.from('schools').select('*').order('slug'),
          supabase.from('extra_visa_checklist').select('*').order('sort_order'),
          supabase.from('extra_interviews').select('*').order('sort_order'),
          supabase.from('semesters').select('*').order('sort_order'),
          supabase.from('semester_schools').select('*'),
          supabase.from('school_conditions').select('*').order('sort_order'),
          supabase.from('school_majors').select('*').order('sort_order'),
          supabase.from('school_advantages').select('*').order('sort_order'),
          supabase.from('school_conversions').select('*').order('sort_order'),
          supabase.from('school_documents').select('*').order('sort_order'),
          supabase.from('school_partners').select('*').order('sort_order'),
          supabase.from('school_advisor_profiles').select('*'),
        ]);

        const schools = schoolsResult.data || [];
        const visaChecklist = checklistResult.data || [];
        const interviews = interviewsResult.data || [];
        const semestersList = semestersResult.data || [];
        const semesterSchoolsList = semesterSchoolsResult.data || [];
        const semesterInfo = semestersList.find(s => s.is_active) || semestersList[0] || null;

        const conditions = conditionsResult.data || [];
        const majors = majorsResult.data || [];
        const advantages = advantagesResult.data || [];
        const conversions = conversionsResult.data || [];
        const documents = documentsResult.data || [];
        const partners = partnersResult.data || [];
        const advisorProfiles = advisorProfilesResult.data || [];

        // Group by school_id
        const groupBy = (rows, key = 'school_id') => {
          const map = {};
          for (const row of rows || []) {
            if (!map[row[key]]) map[row[key]] = [];
            map[row[key]].push(row);
          }
          return map;
        };

        const conditionsMap = groupBy(conditions);
        const majorsMap = groupBy(majors);
        const advantagesMap = groupBy(advantages);
        const conversionsMap = groupBy(conversions);
        const documentsMap = groupBy(documents);
        const partnersMap = groupBy(partners);
        const advisorsMap = {};
        for (const row of advisorProfilesResult.data || []) {
          advisorsMap[row.school_id] = row;
        }

        const exportSchools = schoolsResult.data.map((s) => ({
          id: s.id,
          slug: s.slug,
          name: s.name,
          nameKr: s.name_kr,
          nameEn: s.name_en,
          system: s.system,
          quota: s.quota,
          region: s.region,
          location: s.location,
          intro: s.intro,
          tuition: s.tuition,
          insurance: s.insurance,
          ktx: s.ktx,
          internalNote: s.internal_note || '',
          schedule: s.schedule,
          documentsNote: s.documents_note,
          mou: s.mou,
          website: s.website,
          catalogUrl: s.catalog_url,
          invoiceUrl: s.invoice_url,
          videoUrl: s.video_url,
          videoYoutubeId: s.video_youtube_id,
          videoTitle: s.video_title,
          imageMain: s.image_main,
          conditions: (conditionsMap[s.id] || []).map((r) => r.text),
          majors: (majorsMap[s.id] || []).map((r) => r.text),
          advantages: (advantagesMap[s.id] || []).map((r) => r.text),
          conversion: (conversionsMap[s.id] || []).map((r) => r.text),
          documents: (documentsMap[s.id] || []).map((r) => r.text),
          partners: (partnersMap[s.id] || []).map((r) => ({ code: r.code, name: r.name, nameKr: r.name_kr })),
          advisorProfile: advisorsMap[s.id] || null,
        }));

        const exportData = {
          exportedAt: new Date().toISOString(),
          semesterInfo: semesterInfo || {},
          semesters: semestersResult.data || [],
          semesterSchools: semesterSchoolsResult.data || [],
          schools: exportSchools,
          extraSheets: {
            visaChecklist: {
              name: 'Check list HS xin Visa D2-6',
              items: visaChecklist.map((r) => ({
                stt: r.stt,
                noidung: r.content,
                luuy: r.note,
                link: r.link_url,
                linkText: r.link_text,
              })),
            },
            phongVan: {
              name: 'Phỏng vấn visa',
              items: interviewsResult.data.map((r) => ({
                stt: r.stt,
                noidung: r.content,
                link: r.link_url,
                linkText: r.link_text,
              })),
            },
          },
        };

        return res.json({ success: true, data: exportData });
      }

      // ─── GET: Access Control Rules ───
      let query = supabase
        .from('access_control')
        .select('*')
        .order('created_at', { ascending: false });

      if (id) {
        query = query.eq('id', id).maybeSingle();
      }

      const { data, error } = await query;
      if (error) throw error;

      if (id && !data) {
        return res.status(404).json({ error: 'Not found' });
      }

      return res.json({ success: true, data: id ? data : data || [] });
    }

    // ─── POST: Tạo rule chặn mới ───
    if (req.method === 'POST') {
      const body = req.body || {};
      const { type, value, description } = body;

      if (!type || !value) {
        return res.status(400).json({ error: 'type and value are required' });
      }

      if (!BLOCK_TYPES.includes(type)) {
        return res.status(400).json({ error: `Invalid type. Must be one of: ${BLOCK_TYPES.join(', ')}` });
      }

      let processedValue = value;
      if (type === 'block_password') {
        processedValue = await bcrypt.hash(value, 10);
      }

      const { data, error } = await supabase
        .from('access_control')
        .insert({
          type,
          value: processedValue,
          description: description || '',
          is_active: true,
          created_by: req.user?.id || null,
        })
        .select('*')
        .single();

      if (error) throw error;

      // Log action
      await supabase.from('access_logs').insert({
        user_id: req.user?.id || null,
        path: '/api/admin/access-control',
        method: 'POST',
        status: 201,
      });

      return res.status(201).json({ success: true, data });
    }

    // ─── PUT: Cập nhật rule ───
    if (req.method === 'PUT') {
      if (!id) return res.status(400).json({ error: 'ID is required' });

      const { data: existing } = await supabase
        .from('access_control')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!existing) return res.status(404).json({ error: 'Not found' });

      const body = req.body || {};
      const updateData = { updated_at: new Date().toISOString() };

      if (body.description !== undefined) updateData.description = body.description;
      if (body.is_active !== undefined) updateData.is_active = body.is_active;
      if (body.value !== undefined) {
        updateData.value = body.type === 'block_password' ? await bcrypt.hash(body.value, 10) : body.value;
      }
      if (body.type !== undefined) {
        if (!BLOCK_TYPES.includes(body.type)) {
          return res.status(400).json({ error: 'Invalid type' });
        }
        updateData.type = body.type;
        // Re-hash password if type changed to block_password
        if (body.type === 'block_password' && body.value) {
          updateData.value = await bcrypt.hash(body.value, 10);
        }
      }

      const { data, error } = await supabase
        .from('access_control')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;

      // Log action
      await supabase.from('access_logs').insert({
        user_id: req.user?.id || null,
        path: `/api/admin/access-control?id=${id}`,
        method: 'PUT',
        status: 200,
      });

      return res.json({ success: true, data });
    }

    // ─── DELETE: Xóa rule ───
    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'ID is required' });

      const { error } = await supabase
        .from('access_control')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Log action
      await supabase.from('access_logs').insert({
        user_id: req.user?.id || null,
        path: `/api/admin/access-control?id=${id}`,
        method: 'DELETE',
        status: 200,
      });

      return res.json({ success: true, message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('/api/admin/access-control error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});