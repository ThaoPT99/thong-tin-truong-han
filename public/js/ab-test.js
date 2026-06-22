/* ============================================
   A/B Testing Framework
   Dùng data attribute trên <html> để CSS kiểm soát giao diện
   ============================================ */
(function() {
  'use strict';

  // ─── Danh sách test ───
  var TESTS = [
    {
      key: 'zalo-fab',
      name: 'Zalo FAB Button Style',
      description: 'So sánh vị trí và kiểu nút Zalo nổi',
      variants: ['a', 'b']
    },
    {
      key: 'zalo-timing',
      name: 'Zalo Popup Auto-Show Timing',
      description: 'Thời gian tự động hiện popup Zalo',
      variants: ['a', 'b']
    },
    {
      key: 'advisor-btn-color',
      name: 'Advisor Button Color',
      description: 'Màu nút "Phân tích hồ sơ"',
      variants: ['a', 'b']
    },
    {
      key: 'header-color',
      name: 'Topbar Header Background',
      description: 'Màu nền topbar header',
      variants: ['a', 'b']
    },
    {
      key: 'cta-text',
      name: 'CTA Button Text',
      description: 'Text nút kêu gọi hành động',
      variants: ['a', 'b']
    },
    {
      key: 'tuition-display',
      name: 'Tuition Display Format',
      description: 'Cách hiển thị học phí',
      variants: ['a', 'b']
    }
  ];

  // ─── Gán variant cho user (dùng localStorage) ───
  function getAssignedVariant(testKey) {
    var storageKey = 'ab_' + testKey;
    var variant = null;
    try { variant = localStorage.getItem(storageKey); } catch (e) {}

    if (variant === 'a' || variant === 'b') {
      return variant;
    }

    // Random 50/50
    variant = Math.random() < 0.5 ? 'a' : 'b';
    try { localStorage.setItem(storageKey, variant); } catch (e) {}
    return variant;
  }

  // ─── Gán variant cho từng test ───
  var assignments = {};
  TESTS.forEach(function(test) {
    var v = getAssignedVariant(test.key);
    assignments[test.key] = v;
    // Set data attribute trên <html> để CSS dùng
    document.documentElement.setAttribute('data-ab-' + test.key, v);
  });

  // ─── Expose global ───
  window.__AB = assignments;
  window.__AB_TESTS = TESTS;

  // ─── Track việc assignment (khi analytics sẵn sàng) ───
  var trackRetries = 0;
  var MAX_TRACK_RETRIES = 5;

  function trackAssignments() {
    if (typeof window.trackAnalytics !== 'function') {
      if (trackRetries < MAX_TRACK_RETRIES) {
        trackRetries++;
        setTimeout(trackAssignments, 1000 * trackRetries);
      }
      return;
    }
    TESTS.forEach(function(test) {
      var v = assignments[test.key];
      window.trackAnalytics('event', {
        eventType: 'ab_assignment',
        eventData: { test: test.key, variant: v }
      });
    });
  }

  // Theo dõi khi DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackAssignments);
  } else {
    trackAssignments();
  }

  // ─── Helper để đọc variant trong các file JS khác ───
  window.__getABVariant = function(testKey) {
    return window.__AB[testKey] || 'a';
  };

  window.__isControl = function(testKey) {
    return window.__getABVariant(testKey) === 'a';
  };

  window.__isTest = function(testKey) {
    return window.__getABVariant(testKey) === 'b';
  };

  // ─── Áp dụng text variants sau khi DOM sẵn sàng ───
  function applyTextVariants() {
    // CTA button text
    if (assignments['cta-text'] === 'b') {
      var cta = document.querySelector('.topbar-action');
      if (cta) cta.textContent = 'Kiểm tra hồ sơ miễn phí 🎯';
      // Also in guide hero
      var guideCta = document.querySelector('.guide-hero-actions .topbar-action');
      if (guideCta) guideCta.textContent = 'Kiểm tra hồ sơ miễn phí 🎯';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTextVariants);
  } else {
    applyTextVariants();
  }
})();
