// api-loader.js - Load dữ liệu từ API Vercel thay vì data.js
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

  (async function() {
    try {
      const API_BASE = '/api';

      const controller = new AbortController();
      const timeout = setTimeout(function() { controller.abort(); }, 15000);

      const [schoolsRes, extrasRes, advisorRes] = await Promise.all([
        fetch(API_BASE + '/schools', { signal: controller.signal }),
        fetch(API_BASE + '/extras', { signal: controller.signal }),
        fetch(API_BASE + '/advisor-profiles', { signal: controller.signal })
      ]);

      clearTimeout(timeout);

      if (!schoolsRes.ok || !extrasRes.ok) {
        throw new Error('API error: schools=' + schoolsRes.status + ', extras=' + extrasRes.status);
      }

      const schoolsJson = await schoolsRes.json();
      const extrasJson = await extrasRes.json();
      const advisorJson = advisorRes.ok ? await advisorRes.json() : { data: {} };

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

      // === Advisor profiles từ API ===
      window.ADVISOR_PROFILES = advisorJson.data || {};

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
