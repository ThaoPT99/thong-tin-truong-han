// student-agent.js — Personal AI Agent cho học sinh đã đăng nhập
// Widget chat có thể thao tác dữ liệu của chính học sinh đó
(function() {
  'use strict';

  // ─── State ───
  let isOpen = false;
  let isSending = false;
  let messages = [];
  let studentProfile = null;
  const storageKey = 'studentAgentMessages';
  const profileKey = 'checklist_data'; // Share with checklist.js

  // Load persisted messages
  try {
    var saved = localStorage.getItem(storageKey);
    if (saved) {
      messages = JSON.parse(saved);
      if (messages.length > 20) messages = messages.slice(-20);
    }
  } catch (e) { /* ignore */ }

  // Load student profile from checklist data
  function loadStudentProfile() {
    try {
      var raw = localStorage.getItem(profileKey);
      if (raw) {
        var data = JSON.parse(raw);
        studentProfile = data.profile || {};
      }
    } catch (e) { /* ignore */ }
  }
  loadStudentProfile();

  // ─── Build HTML ───
  function buildWidget() {
    var container = document.createElement('div');
    container.id = 'student-agent-widget';
    container.innerHTML =
      '<button type="button" id="sa-fab" class="sa-fab" aria-label="Mở trợ lý AI" title="Trợ lý cá nhân">' +
        '<svg class="sa-fab-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M12 2l.5 9.5L22 12l-9.5.5L12 22l-.5-9.5L2 12l9.5-.5z"/>' +
          '<path d="M18 4l.5 3.5L22 8l-3.5.5L18 12l-.5-3.5L14 8l3.5-.5z"/>' +
        '</svg>' +
        '<svg class="sa-fab-close" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:none">' +
          '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
        '</svg>' +
        '<span class="sa-fab-label">Trợ lý</span>' +
      '</button>' +
      '<div id="sa-panel" class="sa-panel">' +
        '<div class="sa-header">' +
          '<div class="sa-header-left">' +
            '<div class="sa-avatar">🤖</div>' +
            '<div>' +
              '<div class="sa-header-title">Trợ lý cá nhân</div>' +
              '<div class="sa-header-status">Online</div>' +
            '</div>' +
          '</div>' +
          '<button type="button" id="sa-close" class="sa-header-close" aria-label="Đóng">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button>' +
        '</div>' +
        '<div id="sa-messages" class="sa-messages">' +
          '<div class="sa-welcome">' +
            '<div class="sa-bubble sa-bubble-ai">' +
              '<div class="sa-bubble-content">👋 Chào bạn! Tôi là trợ lý AI cá nhân của bạn.<br><br>' +
              'Tôi có thể:<br>' +
              '• 📋 Xem/Sửa hồ sơ của bạn<br>' +
              '• ✅ Cập nhật checklist giấy tờ<br>' +
              '• 🏫 Tra cứu thông tin trường<br>' +
              '• 📝 Soạn Study Plan / Giải trình<br>' +
              '• ⏰ Xem nhắc nhở<br><br>' +
              '<i>VD: "Cập nhật GPA của tôi lên 7.5"</i></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="sa-input-area">' +
          '<div class="sa-input-wrap">' +
            '<input type="text" id="sa-input" class="sa-input" placeholder="Nhập yêu cầu..." autocomplete="off">' +
            '<button type="button" id="sa-send" class="sa-send-btn" aria-label="Gửi">' +
              '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="sa-suggestions">' +
            '<button type="button" data-quick="Xem hồ sơ của tôi">👤 Hồ sơ</button>' +
            '<button type="button" data-quick="Checklist của tôi đang ở đâu?">✅ Checklist</button>' +
            '<button type="button" data-quick="Tôi cần những giấy tờ gì?">📋 Giấy tờ</button>' +
            '<button type="button" data-quick="Cập nhật GPA của tôi lên 7.0">📝 Sửa GPA</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(container);
    return container;
  }

  // ─── Render Messages ───
  function renderMessages() {
    var container = document.getElementById('sa-messages');
    if (!container) return;

    var welcome = container.querySelector('.sa-welcome');
    if (messages.length > 0 && welcome) {
      welcome.remove();
    }

    var existingBubbles = container.querySelectorAll('.sa-bubble');
    existingBubbles.forEach(function(b) { b.remove(); });

    var loadingEl = container.querySelector('.sa-loading');

    for (var i = 0; i < messages.length; i++) {
      var msg = messages[i];
      var div = document.createElement('div');
      div.className = 'sa-bubble sa-bubble-' + (msg.role === 'user' ? 'user' : 'ai');
      div.innerHTML = '<div class="sa-bubble-content">' + msg.content + '</div>';
      container.insertBefore(div, loadingEl || null);
    }

    container.scrollTop = container.scrollHeight;
  }

  // ─── Loading ───
  function showLoading() {
    var container = document.getElementById('sa-messages');
    if (!container) return;
    var existing = container.querySelector('.sa-loading');
    if (existing) return;

    var div = document.createElement('div');
    div.className = 'sa-bubble sa-bubble-ai sa-loading';
    div.innerHTML = '<div class="sa-bubble-content"><span class="sa-dots"><span></span><span></span><span></span></span></div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function hideLoading() {
    var el = document.querySelector('.sa-loading');
    if (el) el.remove();
  }

  // ─── Escape HTML ───
  function escapeHTML(str) {
    if (typeof window.escapeHtml === 'function') return window.escapeHtml(str);
    var d = document.createElement('div');
    d.textContent = String(str || '');
    return d.innerHTML;
  }

  // ─── Send Message ───
  async function sendMessage(text) {
    if (isSending || !text || text.trim().length < 2) return;
    isSending = true;

    var input = document.getElementById('sa-input');
    var sendBtn = document.getElementById('sa-send');
    if (input) input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    // Add user message
    messages.push({ role: 'user', content: escapeHTML(text.trim()) });
    renderMessages();
    showLoading();

    try {
      // Build student context
      var profileData = {};
      try { var raw = localStorage.getItem(profileKey); if (raw) { var d = JSON.parse(raw); profileData = d.profile || {}; } } catch(e) {}

      var res = await fetch('/api/deepseek?action=student-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          studentProfile: profileData,
          conversation: messages.slice(-10), // Last 10 messages for context
        }),
      });
      var data = await res.json();
      hideLoading();

      if (data.success && data.reply) {
        var formatted = escapeHTML(data.reply).replace(/\n/g, '<br>');
        messages.push({ role: 'assistant', content: formatted });

        // Handle profile updates from the response
        if (data.updatedProfile) {
          try {
            var raw2 = localStorage.getItem(profileKey);
            if (raw2) {
              var existing = JSON.parse(raw2);
              existing.profile = { ...(existing.profile || {}), ...data.updatedProfile };
              localStorage.setItem(profileKey, JSON.stringify(existing));
              studentProfile = existing.profile;
            }
          } catch(e) { /* ignore */ }
        }

        // Handle checklist updates from the response
        if (data.updatedChecklist) {
          try {
            var raw3 = localStorage.getItem(profileKey);
            if (raw3) {
              var existing2 = JSON.parse(raw3);
              existing2.checklist = data.updatedChecklist;
              localStorage.setItem(profileKey, JSON.stringify(existing2));
            }
          } catch(e) { /* ignore */ }
        }

        // Trigger custom event for other modules (checklist.js etc.) to refresh
        if (data.updatedProfile || data.updatedChecklist) {
          window.dispatchEvent(new CustomEvent('student-data-changed', {
            detail: { profile: data.updatedProfile, checklist: data.updatedChecklist }
          }));
        }
      } else {
        messages.push({
          role: 'assistant',
          content: '❌ Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau!',
        });
      }
    } catch (err) {
      hideLoading();
      messages.push({
        role: 'assistant',
        content: '❌ Mất kết nối. Vui lòng kiểm tra internet và thử lại.',
      });
    }

    renderMessages();
    saveMessages();

    if (input) { input.value = ''; input.disabled = false; input.focus(); }
    if (sendBtn) sendBtn.disabled = false;
    isSending = false;
  }

  // ─── Persist ───
  function saveMessages() {
    try {
      var toSave = messages.slice(-20);
      localStorage.setItem(storageKey, JSON.stringify(toSave));
    } catch (e) { /* ignore */ }
  }

  // ─── Toggle ───
  function openPanel() {
    isOpen = true;
    var panel = document.getElementById('sa-panel');
    var fab = document.getElementById('sa-fab');
    var fabIcon = fab ? fab.querySelector('.sa-fab-icon') : null;
    var fabClose = fab ? fab.querySelector('.sa-fab-close') : null;
    if (panel) panel.classList.add('is-open');
    if (fab) fab.classList.add('is-open');
    if (fabIcon) fabIcon.style.display = 'none';
    if (fabClose) fabClose.style.display = 'block';

    var input = document.getElementById('sa-input');
    if (input) setTimeout(function() { input.focus(); }, 350);
  }

  function closePanel() {
    isOpen = false;
    var panel = document.getElementById('sa-panel');
    var fab = document.getElementById('sa-fab');
    var fabIcon = fab ? fab.querySelector('.sa-fab-icon') : null;
    var fabClose = fab ? fab.querySelector('.sa-fab-close') : null;
    if (panel) panel.classList.remove('is-open');
    if (fab) fab.classList.remove('is-open');
    if (fabIcon) fabIcon.style.display = 'block';
    if (fabClose) fabClose.style.display = 'none';
  }

  // ─── Show/Hide widget based on auth status ───
  function updateVisibility() {
    var widget = document.getElementById('student-agent-widget');
    if (!widget) return;
    var token = localStorage.getItem('student_token');
    if (token) {
      widget.style.display = '';
    } else {
      widget.style.display = 'none';
    }
  }

  // ─── Init ───
  function init() {
    var widget = buildWidget();
    renderMessages();
    updateVisibility();

    // Listen for auth changes
    var authBtn = document.getElementById('authBtn');
    if (authBtn) {
      var observer = new MutationObserver(function() {
        updateVisibility();
        loadStudentProfile();
      });
      observer.observe(authBtn, { attributes: true, attributeFilter: ['class'] });
    }

    // Listen for storage changes (other tabs)
    window.addEventListener('storage', function(e) {
      if (e.key === 'student_token') {
        updateVisibility();
        loadStudentProfile();
      }
    });

    // Listen for custom data changes
    window.addEventListener('student-data-changed', function() {
      loadStudentProfile();
    });

    var fab = document.getElementById('sa-fab');
    var closeBtn = document.getElementById('sa-close');
    var input = document.getElementById('sa-input');
    var sendBtn = document.getElementById('sa-send');

    if (fab) {
      fab.addEventListener('click', function() {
        isOpen ? closePanel() : openPanel();
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', closePanel);

    function doSend() {
      if (!input) return;
      var val = input.value.trim();
      if (val) sendMessage(val);
    }

    if (sendBtn) sendBtn.addEventListener('click', doSend);
    if (input) {
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          doSend();
        }
      });
    }

    // Quick suggestions
    widget.querySelectorAll('[data-quick]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        sendMessage(btn.dataset.quick);
      });
    });

    // Auto-open if has previous messages
    if (messages.length > 0) {
      setTimeout(openPanel, 1000);
    }

    // Also open if coming from checklist view (user just logged in)
    if (window.location.hash === '#checklist' && !messages.length) {
      setTimeout(openPanel, 2000);
    }
  }

  // ─── Start when DOM ready ───
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
