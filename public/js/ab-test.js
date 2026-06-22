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
      // A = control (current): right:5rem, text "Zalo"
      // B = test: left side + animated + badge "MIỄN PHÍ"
    },
    {
      key: 'ai-chat',
      name: 'AI Chat Widget Position',
      description: 'Vị trí widget chat AI trên màn hình',
      variants: ['a', 'b']
      // A = control (current): góc phải dưới
      // B = test: góc trái dưới (tránh xung đột Zalo)
    },
    {
      key: 'zalo-timing',
      name: 'Zalo Popup Auto-Show Timing',
      description: 'Thời gian tự động hiện popup Zalo',
      variants: ['a', 'b']
      // A = control (current): 15 giây
      // B = test: 45 giây (ít gây khó chịu hơn)
    },
    {
      key: 'school-layout',
      name: 'School Directory Layout',
      description: 'Cách hiển thị danh sách trường',
      variants: ['a', 'b']
      // A = control (current): grid 4 cột
      // B = test: dạng list/table
    },
    {
      key: 'advisor-btn-color',
      name: 'Advisor Button Color',
      description: 'Màu nút "Phân tích hồ sơ"',
      variants: ['a', 'b']
      // A = control (current): xanh dương (#2563eb)
      // B = test: xanh lá (#0f766e)
    },
    {
      key: 'sidebar-zalo-btn',
      name: 'Sidebar Zalo Button Color',
      description: 'Màu nút Zalo trong sidebar',
      variants: ['a', 'b']
      // A = control (current): mint (#2dd4bf)
      // B = test: cam (#f59e0b)
    },
    {
      key: 'header-color',
      name: 'Topbar Header Background',
      description: 'Màu nền topbar header',
      variants: ['a', 'b']
      // A = control (current): xanh đậm gradient
      // B = test: trắng (sáng, hiện đại hơn)
    },
    {
      key: 'detail-layout',
      name: 'School Detail Layout',
      description: 'Cách hiển thị chi tiết trường',
      variants: ['a', 'b']
      // A = control (current): grid 2 cột
      // B = test: 1 cột (dễ đọc hơn trên mobile)
    },
    {
      key: 'ai-chat-badge',
      name: 'AI Chat New Badge',
      description: 'Badge "Mới" trên nút AI Chat',
      variants: ['a', 'b']
      // A = control (current): không badge
      // B = test: có badge "Mới" + animation
    },
    {
      key: 'hero-title',
      name: 'Hero Title Text',
      description: 'Tiêu đề trang chủ',
      variants: ['a', 'b']
      // A = control (current): "Thông tin trường Visa D2-6"
      // B = test: "18 trường Hàn Quốc tuyển sinh D2-6"
    },
    {
      key: 'cta-text',
      name: 'CTA Button Text',
      description: 'Text nút kêu gọi hành động',
      variants: ['a', 'b']
      // A = control (current): "Phân tích hồ sơ"
      // B = test: "Kiểm tra hồ sơ miễn phí 🎯"
    },
    {
      key: 'ai-chat-auto',
      name: 'AI Chat Auto-Open',
      description: 'Tự động mở AI Chat',
      variants: ['a', 'b']
      // A = control (current): không auto-open
      // B = test: auto-open sau 30s (nếu chưa từng chat)
    },
    {
      key: 'tuition-display',
      name: 'Tuition Display Format',
      description: 'Cách hiển thị học phí',
      variants: ['a', 'b']
      // A = control (current): chỉ KRW
      // B = test: KRW + VND (dễ hình dung hơn)
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

  // ─── Áp dụng text variants (hero-title, cta-text) sau khi DOM sẵn sàng ───
  function applyTextVariants() {
    // Hero title
    if (assignments['hero-title'] === 'b') {
      var h2 = document.querySelector('.app-topbar h2');
      if (h2) h2.textContent = '18 trường Hàn Quốc tuyển sinh D2-6';
    }

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
