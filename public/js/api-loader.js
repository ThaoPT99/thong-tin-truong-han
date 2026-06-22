// api-loader.js - Load dữ liệu từ API Vercel. Luôn lấy dữ liệu mới từ API.

// ─── Global helpers (dùng chung cho advisor.js, render.js) ───

window.escapeHtml = function(str) {
  const d = document.createElement("div");
  d.textContent = String(str ?? "");
  return d.innerHTML;
};

// ─── Precise Location via Browser Geolocation (GPS/WiFi) ───
(function initPreciseLocation() {
  // Đã có dữ liệu rồi → không cần hỏi lại
  if (window._preciseLocation) return;

  // Helper: lấy GPS + reverse geocode + lưu localStorage
  function getPreciseLocation() {
    if (!navigator.geolocation) return;

    var options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 600000 // 10 phút cache
    };

    navigator.geolocation.getCurrentPosition(function(pos) {
      var lat = pos.coords.latitude;
      var lon = pos.coords.longitude;

      // Lưu tọa độ thô trước
      window._preciseLocation = {
        lat: lat,
        lon: lon,
        source: 'gps',
        district: '',
        ward: '',
        address: ''
      };

      // Đã cho phép → lưu localStorage để lần sau không hỏi lại
      try { localStorage.setItem('location_granted', 'true'); } catch(e) {}

      // Reverse geocode bằng Nominatim (OpenStreetMap, miễn phí)
      var nomUrl = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&lon=' + lon + '&accept-language=vi';
      fetch(nomUrl, {
        headers: { 'User-Agent': 'ThongTinTruongHan/1.0 (contact@thongtintruonghan.com)' }
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data && data.address) {
          var addr = data.address;
          window._preciseLocation = {
            lat: lat,
            lon: lon,
            source: 'gps',
            district: addr.suburb || addr.city_district || addr.county || '',
            ward: addr.neighbourhood || addr.suburb || '',
            address: data.display_name || ''
          };
        }
      })
      .catch(function() {
        // Silent - vẫn giữ tọa độ thô
      });
    }, function(err) {
      // User denied ở trình duyệt → thông báo nhẹ
      if (err.code === 1) {
        var notice = document.createElement('div');
        notice.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9999;background:#dc2626;color:#fff;padding:12px 24px;border-radius:10px;font-size:.85rem;font-weight:600;box-shadow:0 4px 16px rgba(220,38,38,0.3);text-align:center;max-width:400px;';
        notice.innerHTML = '⚠️ You need to allow location access in your browser to continue. Please reload the page and choose "Allow".';
        document.body.appendChild(notice);
        setTimeout(function() {
          notice.style.transition = 'opacity .5s';
          notice.style.opacity = '0';
          setTimeout(function() { if (notice.parentNode) notice.parentNode.removeChild(notice); }, 500);
        }, 6000);
      }
    }, options);
  }

  // === ĐÃ TỪNG CHO PHÉP TRƯỚC ĐÂY? ===
  // Kiểm tra localStorage trước (nhanh nhất)
  var alreadyGranted = false;
  try { alreadyGranted = localStorage.getItem('location_granted') === 'true'; } catch(e) {}

  if (alreadyGranted) {
    // Đã cho phép rồi → lấy GPS thầm lặng, không banner
    getPreciseLocation();
    return;
  }

  // Kiểm tra permissions API (trình duyệt có thể đã nhớ quyền)
  function checkPermissionAndProceed() {
    if (typeof navigator.permissions !== 'undefined' && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then(function(result) {
        if (result.state === 'granted') {
          // Trình duyệt đã nhớ quyền → lấy GPS thầm lặng
          getPreciseLocation();
          return;
        }
        // Chưa có quyền → hiện banner
        showBannerUi();
      }).catch(function() {
        // permissions API không hoạt động → fallback về banner
        showBannerUi();
      });
    } else {
      showBannerUi();
    }
  }

  // === Mandatory banner ===
  var banner = document.createElement('div');
  banner.id = 'geo-banner';
  banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:9999;background:linear-gradient(135deg,#1e3a5f,#2d5a87);color:#fff;padding:24px 32px;display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap;font-size:1.1rem;box-shadow:0 -8px 32px rgba(0,0,0,0.3);border-top:3px solid #60a5fa;';
  banner.innerHTML = '<div style="display:flex;align-items:center;gap:12px;flex:1;min-width:200px;"><span style="font-size:2rem;line-height:1;">📍</span><div><div style="font-weight:700;font-size:1.15rem;margin-bottom:2px;">Please allow location access</div><div style="font-size:.88rem;opacity:.8;">We use your precise location to find schools near you and provide accurate information</div></div></div>'
    + '<button id="geo-yes" style="padding:14px 36px;border:none;border-radius:10px;background:#2563eb;color:#fff;font-weight:700;cursor:pointer;font-size:1.05rem;box-shadow:0 4px 12px rgba(37,99,235,0.4);transition:all .15s;white-space:nowrap;" onmouseover="this.style.background=\'#1d4ed8\'" onmouseout="this.style.background=\'#2563eb\'">Allow location</button>';
  banner.style.transform = 'translateY(100%)';
  banner.style.transition = 'transform .5s ease';

  var overlay = document.createElement('div');
  overlay.id = 'geo-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,0.55);opacity:0;transition:opacity .5s ease;';

  function showBannerUi() {
    document.body.appendChild(overlay);
    document.body.appendChild(banner);
    requestAnimationFrame(function() {
      overlay.style.opacity = '1';
      banner.style.transform = 'translateY(0)';
    });
  }

  function hideBanner() {
    overlay.style.opacity = '0';
    banner.style.transform = 'translateY(100%)';
    setTimeout(function() {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 400);
  }

  banner.querySelector('#geo-yes').addEventListener('click', function() {
    hideBanner();
    getPreciseLocation();
  });

  // Hiện banner (nếu cần)
  function show() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkPermissionAndProceed);
    } else {
      checkPermissionAndProceed();
    }
  }
  show();
})();

// ─── Analytics Tracking Helper ───
window.trackAnalytics = function(type, data) {
  try {
    // Generate session ID once
    if (!window._analyticsSessionId) {
      window._analyticsSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Build payload — thêm precise location nếu có
    var preciseLoc = window._preciseLocation || null;
    var payloadData = Object.assign({}, data, {
      sessionId: window._analyticsSessionId,
      userAgent: navigator.userAgent,
      referrer: document.referrer || '',
    });
    if (preciseLoc) {
      payloadData.preciseLocation = {
        lat: preciseLoc.lat,
        lon: preciseLoc.lon,
        district: preciseLoc.district || '',
        ward: preciseLoc.ward || '',
        address: preciseLoc.address || '',
        source: preciseLoc.source || 'gps'
      };
    }
    const payload = {
      type: type,
      data: payloadData
    };

    // Fire and forget - không block UX
    var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', blob);
    } else {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: blob,
        keepalive: true,
      }).catch(function() {});
    }

    // Track session start/update (mỗi page view = 1 session page view)
    if (type === 'page_view') {
      const sessPayload = {
        type: 'session',
        data: {
          action: 'start',
          sessionId: window._analyticsSessionId,
          pageType: data.pageType || '',
          referrer: document.referrer || '',
          userAgent: navigator.userAgent,
        }
      };
      var sessBlob = new Blob([JSON.stringify(sessPayload)], { type: 'application/json' });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics', sessBlob);
      } else {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: sessBlob,
          keepalive: true,
        }).catch(function() {});
      }
    }
  } catch (e) {
    // Silent fail
  }
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
    const groups = {};
    const order = [];
    (flatItems || []).forEach(function(item) {
      const gName = item.groupName || 'Khác';
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
    const mapText = function(arr) {
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
    const ap = school.advisorProfile;
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
    const SCHOOLS_DATA = {};
    const ADVISOR_PROFILES = {};

    rawSchools.forEach(function(school) {
      const slug = school.slug;
      if (!slug) return;
      SCHOOLS_DATA[slug] = transformSchool(school);
      const ap = transformAdvisorProfile(school);
      if (ap) ADVISOR_PROFILES[slug] = ap;
    });

    window.SCHOOLS_DATA = SCHOOLS_DATA;
    window.ADVISOR_PROFILES = ADVISOR_PROFILES;

    // Semesters
    const semestersData = (extrasJson.data && extrasJson.data.semesters) || [];
    window.SEMESTERS_LIST = semestersData;

    const activeSemId = extrasJson.data && extrasJson.data.activeSemesterId;
    const activeSem = semestersData.find(function(s) { return s.id === activeSemId; }) || semestersData[0] || null;
    window.ACTIVE_SEMESTER_ID = activeSem ? activeSem.id : null;

    window.SEMESTER_INFO = activeSem
      ? { ky: activeSem.ky || '3', nam: activeSem.nam || '2027', title: activeSem.title || '' }
      : { ky: '3', nam: '2027', title: 'DANH SÁCH TRƯỜNG HÀN QUỐC - KỲ THÁNG 3/2027' };

    // Semester-schools map
    const rawMap = schoolsJson.semesterSchools || {};
    const slugMap = {};
    rawSchools.forEach(function(sch) {
      const sids = rawMap[sch.id];
      if (sids && sids.length > 0 && sch.slug) {
        slugMap[sch.slug] = sids;
      }
    });
    window.SEMESTER_SCHOOLS_MAP = slugMap;

    // Extra sheets (visa checklist)
    const visaList = (extrasJson.data && extrasJson.data.visaChecklist) || [];
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
    const si = window.SEMESTER_INFO;
    if (si && si.ky && si.nam) {
      const semesterTitle = 'Kỳ tháng ' + si.ky + '/' + si.nam;
      const sub = document.querySelector('.subtitle');
      if (sub) sub.textContent = semesterTitle;
    }
  }

  // ─── Luôn fetch API để có dữ liệu mới nhất ───
  (async function() {
    try {
      const API_BASE = '/api';

      const controller = new AbortController();
      const timeout = setTimeout(function() { controller.abort(); }, 15000);

      const ts = Date.now();
      const [schoolsRes, extrasRes] = await Promise.all([
        fetch(API_BASE + '/schools?_=' + ts, { signal: controller.signal }),
        fetch(API_BASE + '/schools?include=extras&_=' + ts, { signal: controller.signal })
      ]);

      clearTimeout(timeout);

      if (!schoolsRes.ok || !extrasRes.ok) {
        throw new Error('API error: schools=' + schoolsRes.status + ', extras=' + extrasRes.status);
      }

      const schoolsJson = await schoolsRes.json();
      const extrasJson = await extrasRes.json();
      const rawSchools = schoolsJson.data || [];

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
