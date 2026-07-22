// ai-chat.js — Floating AI Chat Widget for website visitors
(function() {
  'use strict';

  // ─── State ───
  let isOpen = false;
  let isSending = false;
  let messages = [];
  const storageKey = 'aiChatMessages';

  // Load persisted messages
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      messages = JSON.parse(saved);
      // Keep only last 20 messages
      if (messages.length > 20) messages = messages.slice(-20);
    }
  } catch (e) { /* ignore */ }

  // ─── Build Widget HTML ───
  function buildWidget() {
    const container = document.createElement('div');
    container.id = 'ai-chat-widget';
    container.innerHTML = `
      <button type="button" id="ai-chat-fab" class="ai-chat-fab" aria-label="Mở chat AI" title="Hỏi AI về trường và visa">
        <svg class="ai-chat-fab-icon" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2l.5 9.5L22 12l-9.5.5L12 22l-.5-9.5L2 12l9.5-.5z"/>
          <path d="M18 4l.5 3.5L22 8l-3.5.5L18 12l-.5-3.5L14 8l3.5-.5z"/>
        </svg>
        <svg class="ai-chat-fab-close" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:none">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div id="ai-chat-panel" class="ai-chat-panel">
        <div class="ai-chat-header">
          <div class="ai-chat-header-left">
            <div class="ai-chat-avatar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 8V4m0 4a4 4 0 0 1 4 4h-8a4 4 0 0 1 4-4z"/>
                <circle cx="12" cy="14" r="8"/>
                <path d="M12 22v-4"/>
              </svg>
            </div>
            <div>
              <div class="ai-chat-header-title">Trợ lý D2-6</div>
              <div class="ai-chat-header-status">Online • Hỏi về trường, visa</div>
            </div>
          </div>
          <button type="button" id="ai-chat-close" class="ai-chat-header-close" aria-label="Đóng chat">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div id="ai-chat-messages" class="ai-chat-messages">
          <div class="ai-chat-welcome">
            <div class="ai-chat-bubble ai-chat-bubble-ai">
              <div class="ai-chat-bubble-content">
                Chào bạn! Tôi là trợ lý AI của <b>Thông Tin Trường Hàn</b>.<br><br>
                Bạn có thể hỏi tôi về:<br>
                • Thông tin trường (học phí, KTX, điều kiện)<br>
                • Checklist visa D2-6<br>
                • Phỏng vấn visa<br>
                • Khu vực, hệ học<br><br>
                <i>Ví dụ: "Trường Osan học phí bao nhiêu?"</i>
              </div>
            </div>
          </div>
        </div>

        <div class="ai-chat-input-area">
          <div class="ai-chat-input-wrap">
            <input type="text" id="ai-chat-input" class="ai-chat-input" placeholder="Nhập câu hỏi..." autocomplete="off">
            <button type="button" id="ai-chat-send" class="ai-chat-send-btn" aria-label="Gửi">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <div class="ai-chat-suggestions">
            <button type="button" data-quick="Trường Osan học phí bao nhiêu?">Osan</button>
            <button type="button" data-quick="Checklist visa D2-6 gồm những gì?">Checklist</button>
            <button type="button" data-quick="Chứng minh tài chính du học Hàn cần bao nhiêu tiền?">Tài chính</button>
            <button type="button" data-quick="Quy trình xin visa du học Hàn Quốc như thế nào?">Quy trình</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(container);
    return container;
  }

  // ─── Render Messages ───
  function renderMessages() {
    const container = document.getElementById('ai-chat-messages');
    if (!container) return;

    // Remove welcome if there are messages
    const welcome = container.querySelector('.ai-chat-welcome');
    if (messages.length > 0 && welcome) {
      welcome.remove();
    }

    // Remove all bubbles except welcome
    const existingBubbles = container.querySelectorAll('.ai-chat-bubble');
    existingBubbles.forEach(function(b) { b.remove(); });

    // Add loading indicator position
    const loadingEl = container.querySelector('.ai-chat-loading');

    for (const msg of messages) {
      const div = document.createElement('div');
      div.className = 'ai-chat-bubble ai-chat-bubble-' + (msg.role === 'user' ? 'user' : 'ai');
      div.innerHTML = '<div class="ai-chat-bubble-content">' + msg.content + '</div>';
      container.insertBefore(div, loadingEl || null);
    }

    container.scrollTop = container.scrollHeight;
  }

  // ─── Show Loading ───
  function showLoading() {
    const container = document.getElementById('ai-chat-messages');
    if (!container) return;
    const existing = container.querySelector('.ai-chat-loading');
    if (existing) return;

    const div = document.createElement('div');
    div.className = 'ai-chat-bubble ai-chat-bubble-ai ai-chat-loading';
    div.innerHTML = '<div class="ai-chat-bubble-content"><span class="ai-chat-dots"><span></span><span></span><span></span></span></div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function hideLoading() {
    const el = document.querySelector('.ai-chat-loading');
    if (el) el.remove();
  }

  // ─── Send Message ───
  async function sendMessage(text) {
    if (isSending || !text || text.trim().length < 2) return;
    isSending = true;

    const input = document.getElementById('ai-chat-input');
    const sendBtn = document.getElementById('ai-chat-send');
    if (input) input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    // Add user message
    messages.push({ role: 'user', content: escapeHTML(text.trim()) });
    renderMessages();
    showLoading();

    try {
      const res = await fetch('/api/deepseek?action=chat-web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });
      const data = await res.json();

      hideLoading();

      if (data.success && data.answer) {
        // Format answer with line breaks
        const formatted = data.answer.replace(/\n/g, '<br>');
        messages.push({ role: 'assistant', content: formatted });
      } else {
        messages.push({
          role: 'assistant',
          content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau!',
        });
      }
    } catch (err) {
      hideLoading();
      messages.push({
        role: 'assistant',
        content: 'Mất kết nối. Vui lòng kiểm tra internet và thử lại.',
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
      const toSave = messages.slice(-20);
      localStorage.setItem(storageKey, JSON.stringify(toSave));
    } catch (e) { /* ignore */ }
  }

  // ─── Escape HTML ───
  function escapeHTML(str) {
    if (typeof window.escapeHtml === 'function') return window.escapeHtml(str);
    const d = document.createElement('div');
    d.textContent = String(str || '');
    return d.innerHTML;
  }

  // ─── Toggle ───
  function openChat() {
    isOpen = true;
    const panel = document.getElementById('ai-chat-panel');
    const fab = document.getElementById('ai-chat-fab');
    const fabIcon = fab?.querySelector('.ai-chat-fab-icon');
    const fabClose = fab?.querySelector('.ai-chat-fab-close');
    if (panel) panel.classList.add('is-open');
    if (fab) fab.classList.add('is-open');
    if (fabIcon) fabIcon.style.display = 'none';
    if (fabClose) fabClose.style.display = 'block';

    const input = document.getElementById('ai-chat-input');
    if (input) setTimeout(function() { input.focus(); }, 350);
  }

  function closeChat() {
    isOpen = false;
    const panel = document.getElementById('ai-chat-panel');
    const fab = document.getElementById('ai-chat-fab');
    const fabIcon = fab?.querySelector('.ai-chat-fab-icon');
    const fabClose = fab?.querySelector('.ai-chat-fab-close');
    if (panel) panel.classList.remove('is-open');
    if (fab) fab.classList.remove('is-open');
    if (fabIcon) fabIcon.style.display = 'block';
    if (fabClose) fabClose.style.display = 'none';
  }

  // ─── Init ───
  function init() {
    const widget = buildWidget();
    renderMessages();

    const fab = document.getElementById('ai-chat-fab');
    const closeBtn = document.getElementById('ai-chat-close');
    const input = document.getElementById('ai-chat-input');
    const sendBtn = document.getElementById('ai-chat-send');

    // Toggle
    fab.addEventListener('click', function() {
      isOpen ? closeChat() : openChat();
    });

    closeBtn.addEventListener('click', closeChat);

    // Send
    function doSend() {
      const val = input.value.trim();
      if (val) sendMessage(val);
    }

    sendBtn.addEventListener('click', doSend);
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        doSend();
      }
    });

    // Quick suggestions
    widget.querySelectorAll('[data-quick]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        sendMessage(btn.dataset.quick);
      });
    });

    // Auto-open after 1 second if has previous messages
    if (messages.length > 0) {
      setTimeout(openChat, 1000);
    }
  }

  // ─── Start when DOM ready ───
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
