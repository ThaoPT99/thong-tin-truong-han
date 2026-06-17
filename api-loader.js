// api-loader.js - Load dữ liệu từ API Vercel thay vì data.js

// ─── Global helpers (dùng chung cho advisor.js, render.js) ───

window.escapeHtml = function(str) {
  var d = document.createElement("div");
  d.textContent = String(str ?? "");
  return d.innerHTML;
};

window.REGION_LABELS = {
  any: "không ưu tiên khu vực",
  seoul: "Seoul",
  "near-seoul": "gần Seoul",
  busan: "Busan",
  gwangju: "Gwangju",
  province: "tỉnh/thành khác",
  incheon: "Incheon",
  gyeonggi: "Gyeonggi",
  chungcheongbuk: "Chungcheongbuk",
  chungcheongnam: "Chungcheongnam",
  jeollanam: "Jeollanam",
  jeollabuk: "Jeollabuk",
  gyeongsangnam: "Gyeongsangnam",
  gyeongsangbuk: "Gyeongsangbuk",
  gangwon: "Gangwon",
  daegu: "Daegu",
  daejeon: "Daejeon",
  ulsan: "Ulsan",
  sejong: "Sejong",
  jeju: "Jeju"
};

(function loadAppData() {
  // Helper: build grouped checklist from flat API data
  function buildChecklistGroups(flatItems) {
    var groups = {};
    var order = [];
    (flatItems || []).forEach(function(item) {
      var gName = item.groupName || 'Khác';
      if (!groups[gName]) {
        groups[gName] = { group: gName, items: [] };
        order.push(gName);
      }
      groups[gName].items.push({
        name: item.content || '',
        level: item.level || 'Bắt buộc',
        note: item.note || ''
      });
    });
    return order.map(function(g) { return groups[g]; });
  }

  // ─── Nếu trang pre-rendered có dữ liệu inline, dùng luôn, không fetch API ───
  if (window.__PRERENDERED_DATA__) {
    try {
      var preData = window.__PRERENDERED_DATA__;

      // Chuyển đổi schools data sang format SCHOOLS_DATA
      var SCHOOLS_DATA = {};
      (preData.schoolsData || []).forEach(function(school) {
        var slug = school.slug;
        if (!slug) return;
        SCHOOLS_DATA[slug] = {
          id: slug,
          name: school.name || '',
          nameKr: school.name_kr || '',
          nameEn: school.name_en || '',
          system: school.system || '',
          quota: school.quota || 0,
          images: {
            main: school.image_main || 'images/placeholder.svg',
            catalog: school.image_catalog || '',
            locationMap: school.image_location || '',
            invoice: school.image_invoice || '',
            gallery: []
          },
          links: {
            website: school.website || '',
            catalog: school.catalog_url || '',
            invoice: school.invoice_url || ''
          },
          video: {
            url: school.video_url || '',
            youtubeId: school.video_youtube_id || '',
            title: school.video_title || ''
          },
          location: school.location || '',
          region: school.region || '',
          intro: school.intro || '',
          conditions: (school.conditions || []).map(function(c) { return c.text || c; }).filter(Boolean),
          majors: (school.majors || []).map(function(m) { return m.text || m; }).filter(Boolean),
          conversion: (school.conversion || []).map(function(c) { return c.text || c; }).filter(Boolean),
          tuition: school.tuition || '',
          insurance: school.insurance || '',
          ktx: school.ktx || '',
          schedule: school.schedule || '',
          advantages: (school.advantages || []).map(function(a) { return a.text || a; }).filter(Boolean),
          documents: (school.documents || []).map(function(d) { return d.text || d; }).filter(Boolean),
          documentsNote: school.documents_note || '',
          partners: (school.partners || []).map(function(p) {
            return { code: p.code || '', name: p.name || '', nameKr: p.name_kr || '' };
          }),
          mou: school.mou || ''
        };
      });

      window.SCHOOLS_DATA = SCHOOLS_DATA;
      window.ADVISOR_PROFILES = preData.advisorProfilesData || {};
      window.SEMESTER_INFO = preData.semesterInfo || { ky: '3', nam: '2027', title: '' };

      // Build checklist
      window.EXTRA_SHEETS = { visaChecklist: { items: preData.extrasChecklist || [] } };
      window.CHECKLIST_GROUPED = buildChecklistGroups(preData.extrasChecklist || []);

      // Update page title
      var si = window.SEMESTER_INFO;
      if (si && si.ky && si.nam) {
        var semesterTitle = 'Kỳ tháng ' + si.ky + '/' + si.nam;
        var sub = document.querySelector('.subtitle');
        if (sub) sub.textContent = semesterTitle;
      }
      // render.js's init() sẽ cập nhật school count khi load

      window.__DATA_READY__ = true;
      document.dispatchEvent(new CustomEvent('app-data-ready'));
      return;
    } catch (e) {
      console.error('Prerender data error, falling back to API:', e);
    }
  }

  (async function() {
    try {
      const API_BASE = '/api';

      const controller = new AbortController();
      const timeout = setTimeout(function() { controller.abort(); }, 15000);

      const [schoolsRes, extrasRes] = await Promise.all([
        fetch(API_BASE + '/schools', { signal: controller.signal }),
        fetch(API_BASE + '/extras', { signal: controller.signal })
      ]);

      clearTimeout(timeout);

      if (!schoolsRes.ok || !extrasRes.ok) {
        throw new Error('API error: schools=' + schoolsRes.status + ', extras=' + extrasRes.status);
      }

      const schoolsJson = await schoolsRes.json();
      const extrasJson = await extrasRes.json();

      // === Transform SCHOOLS_DATA ===
      var SCHOOLS_DATA = {};
      var rawSchools = schoolsJson.data || [];

      rawSchools.forEach(function(school) {
        var slug = school.slug;
        if (!slug) return;

        var mapText = function(arr) {
          return (arr || []).map(function(item) { return item.text || ''; }).filter(Boolean);
        };

        SCHOOLS_DATA[slug] = {
          id: slug,
          name: school.name || '',
          nameKr: school.name_kr || '',
          nameEn: school.name_en || '',
          system: school.system || '',
          quota: school.quota || 0,
          images: {
            main: school.image_main || 'images/placeholder.svg',
            catalog: school.image_catalog || '',
            locationMap: school.image_location || '',
            invoice: school.image_invoice || '',
            gallery: []
          },
          links: {
            website: school.website || '',
            catalog: school.catalog_url || '',
            invoice: school.invoice_url || ''
          },
          video: {
            url: school.video_url || '',
            youtubeId: school.video_youtube_id || '',
            title: school.video_title || ''
          },
          location: school.location || '',
          region: school.region || '',
          intro: school.intro || '',
          conditions: mapText(school.conditions),
          majors: mapText(school.majors),
          conversion: mapText(school.conversion),
          tuition: school.tuition || '',
          insurance: school.insurance || '',
          ktx: school.ktx || '',
          schedule: school.schedule || '',
          advantages: mapText(school.advantages),
          documents: mapText(school.documents),
          documentsNote: school.documents_note || '',
          partners: (school.partners || []).map(function(p) {
            return {
              code: p.code || '',
              name: p.name || '',
              nameKr: p.name_kr || ''
            };
          }),
          mou: school.mou || ''
        };
      });

      window.SCHOOLS_DATA = SCHOOLS_DATA;

      // === Advisor profiles — lấy từ /api/schools (đã JOIN sẵn) ===
      var ADVISOR_PROFILES = {};
      rawSchools.forEach(function(school) {
        var ap = school.advisorProfile;
        if (ap && school.slug) {
          ADVISOR_PROFILES[school.slug] = {
            gender: ap.gender || 'all',
            minGpa: parseFloat(ap.min_gpa) || 5.5,
            maxAbsences: ap.max_absences || 30,
            region: ap.region || school.region || '',
            costLevel: ap.cost_level || 3,
            visaChance: ap.visa_chance || 3,
            jobOpportunity: ap.job_opportunity || 3,
            e7Opportunity: ap.e7_opportunity || 3,
            studyLoad: ap.study_load || 3,
            interviewDifficulty: ap.interview_difficulty || 2,
            tags: ap.tags || [],
          };
        }
      });
      window.ADVISOR_PROFILES = ADVISOR_PROFILES;

      // === Semester info ===
      var semInfo = extrasJson.data && extrasJson.data.semesterInfo;
      window.SEMESTER_INFO = semInfo
        ? { ky: semInfo.ky || '3', nam: semInfo.nam || '2027', title: semInfo.title || '' }
        : { ky: '3', nam: '2027', title: 'DANH SÁCH TRƯỜNG HÀN QUỐC - KỲ THÁNG 3/2027' };

      // === Extra sheets (visa checklist) ===
      var visaList = (extrasJson.data && extrasJson.data.visaChecklist) || [];
      window.EXTRA_SHEETS = {
        visaChecklist: {
          items: visaList.map(function(item) {
            return {
              stt: item.stt,
              noidung: item.content,
              luuy: item.note,
              link: item.linkUrl || '',
              linkText: item.linkText || '',
              groupName: item.groupName || '',
              level: item.level || ''
            };
          })
        }
      };
      // Build grouped checklist for renderD26Checklist
      window.CHECKLIST_GROUPED = buildChecklistGroups(visaList);

      // Signal ready
      window.__DATA_READY__ = true;
      document.dispatchEvent(new CustomEvent('app-data-ready'));

    } catch (err) {
      console.error('API Loader error:', err);
      // Set empty data to prevent crashes
      window.SCHOOLS_DATA = {};
      window.ADVISOR_PROFILES = {};
      window.SEMESTER_INFO = { ky: '3', nam: '2027', title: '' };
      window.EXTRA_SHEETS = {};
      window.CHECKLIST_GROUPED = [];
      window.__DATA_READY__ = true;
      document.dispatchEvent(new CustomEvent('app-data-ready'));
    }
  })();
})();
