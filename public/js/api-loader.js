// api-loader.js - Load dữ liệu từ API Vercel. Luôn lấy dữ liệu mới từ API.

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

  function transformSchool(school) {
    var mapText = function(arr) {
      return (arr || []).map(function(item) { return item.text || item || ''; }).filter(Boolean);
    };
    return {
      id: school.slug || school.id,
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
        return { code: p.code || '', name: p.name || '', nameKr: p.name_kr || '' };
      }),
      mou: school.mou || ''
    };
  }

  function transformAdvisorProfile(school) {
    var ap = school.advisorProfile;
    if (!ap || !school.slug) return null;
    return {
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

  function setDataFromApi(rawSchools, extrasJson, schoolsJson) {
    var SCHOOLS_DATA = {};
    var ADVISOR_PROFILES = {};

    rawSchools.forEach(function(school) {
      var slug = school.slug;
      if (!slug) return;
      SCHOOLS_DATA[slug] = transformSchool(school);
      var ap = transformAdvisorProfile(school);
      if (ap) ADVISOR_PROFILES[slug] = ap;
    });

    window.SCHOOLS_DATA = SCHOOLS_DATA;
    window.ADVISOR_PROFILES = ADVISOR_PROFILES;

    // Semesters
    var semestersData = (extrasJson.data && extrasJson.data.semesters) || [];
    window.SEMESTERS_LIST = semestersData;

    var activeSemId = extrasJson.data && extrasJson.data.activeSemesterId;
    var activeSem = semestersData.find(function(s) { return s.id === activeSemId; }) || semestersData[0] || null;
    window.ACTIVE_SEMESTER_ID = activeSem ? activeSem.id : null;

    window.SEMESTER_INFO = activeSem
      ? { ky: activeSem.ky || '3', nam: activeSem.nam || '2027', title: activeSem.title || '' }
      : { ky: '3', nam: '2027', title: 'DANH SÁCH TRƯỜNG HÀN QUỐC - KỲ THÁNG 3/2027' };

    // Semester-schools map
    var rawMap = schoolsJson.semesterSchools || {};
    var slugMap = {};
    rawSchools.forEach(function(sch) {
      var sids = rawMap[sch.id];
      if (sids && sids.length > 0 && sch.slug) {
        slugMap[sch.slug] = sids;
      }
    });
    window.SEMESTER_SCHOOLS_MAP = slugMap;

    // Extra sheets (visa checklist)
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
    window.CHECKLIST_GROUPED = buildChecklistGroups(visaList);

    // Update page title & subtitle
    var si = window.SEMESTER_INFO;
    if (si && si.ky && si.nam) {
      var semesterTitle = 'Kỳ tháng ' + si.ky + '/' + si.nam;
      var sub = document.querySelector('.subtitle');
      if (sub) sub.textContent = semesterTitle;
    }
  }

  // ─── Luôn fetch API để có dữ liệu mới nhất ───
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
      var rawSchools = schoolsJson.data || [];

      setDataFromApi(rawSchools, extrasJson, schoolsJson);

      window.__DATA_READY__ = true;
      document.dispatchEvent(new CustomEvent('app-data-ready'));

    } catch (err) {
      console.error('API Loader error:', err);
      // API fail → fallback empty
      window.SCHOOLS_DATA = window.SCHOOLS_DATA || {};
      window.ADVISOR_PROFILES = window.ADVISOR_PROFILES || {};
      window.SEMESTER_INFO = window.SEMESTER_INFO || { ky: '3', nam: '2027', title: '' };
      window.SEMESTERS_LIST = window.SEMESTERS_LIST || [];
      window.ACTIVE_SEMESTER_ID = window.ACTIVE_SEMESTER_ID || null;
      window.SEMESTER_SCHOOLS_MAP = window.SEMESTER_SCHOOLS_MAP || {};
      window.EXTRA_SHEETS = window.EXTRA_SHEETS || {};
      window.CHECKLIST_GROUPED = window.CHECKLIST_GROUPED || [];
      window.__DATA_READY__ = true;
      document.dispatchEvent(new CustomEvent('app-data-ready'));
    }
  })();
})();
