// knowledge-base.js — Knowledge Base page: articles, search, FAQ
(function() {
 'use strict';

 let currentCategory = 'all';
 let currentView = 'articles'; // 'articles'| 'article-detail'| 'faq'let articlesCache = [];
 let currentArticle = null;

 // ─── Categories ───
 const CATEGORIES = [
 { id: 'all', label: 'Tất cả', icon: ''},
 { id: 'visa', label: 'Visa & Quy định', icon: ''},
 { id: 'documents', label: 'Giấy tờ & Hồ sơ', icon: ''},
 { id: 'finance', label: 'Tài chính', icon: ''},
 { id: 'study-plan', label: 'Study Plan', icon: ''},
 { id: 'process', label: 'Quy trình', icon: ''},
 { id: 'schools', label: 'Trường & Khu vực', icon: ''},
 ];

 // ─── Init ───
 window.renderKnowledgeBase = function(container) {
 if (!container) return;
 container.innerHTML = `<div class="kb-loading"><div class="skeleton skeleton-heading"style="width:300px"><div><div>`;

 // Load articles + FAQ from API
 Promise.all([
 fetch('/api/knowledge-base?action=list').then(r =>r.json()),
 fetch('/api/knowledge-base?action=faq').then(r =>r.json()),
 ]).then(function([articlesRes, faqRes]) {
 articlesCache = articlesRes.articles || [];
 const faqs = faqRes.faqs || [];
 renderPage(container, articlesCache, faqs);
 }).catch(function() {
 // Fallback: show empty state
 container.innerHTML = '<div class="kb-empty"><p>Không thể tải dữ liệu. Vui lòng thử lại sau.</p><div>';
 });
 };

 function renderPage(container, articles, faqs) {
 const activeCat = currentCategory;

 container.innerHTML = `
 <section class="kb-view"><div class="kb-hero"><div><p class="advisor-kicker">Tài nguyên hữu ích</p><h2>Kiến thức du học Hàn Quốc</h2><p class="kb-hero-desc">Tổng hợp kiến thức về visa, giấy tờ, tài chính và quy trình du học Hàn Quốc.
 Tất cả thông tin được cập nhật theo quy định mới nhất.</p><div><div><!-- Search --><div class="kb-search-bar"><svg class="kb-search-icon"viewBox="0 0 24 24"width="20"height="20"fill="none"stroke="currentColor"stroke-width="2"stroke-linecap="round"><circle cx="11"cy="11"r="8"/><line x1="21"y1="21"x2="16.65"y2="16.65"/><svg><input type="text"id="kb-search"class="kb-search-input"placeholder="Tìm kiếm bài viết..."autocomplete="off"><span class="kb-search-count"id="kb-result-count">${articles.length} bài viết</span><div><!-- Tabs: Articles / FAQ --><div class="kb-tabs"><button type="button"class="kb-tab ${currentView === 'articles'? 'active': ''}"onclick="window._kbSwitchView('articles')">Bài viết</button><button type="button"class="kb-tab ${currentView === 'faq'? 'active': ''}"onclick="window._kbSwitchView('faq')">Hỏi đáp (${faqs.length})</button><div><!-- Content --><div id="kb-content">${currentView === 'articles'? renderArticlesView(articles) : renderFaqView(faqs)}</div><!-- Article Detail (hidden by default) --><div id="kb-article-detail"class="kb-article-detail"style="display:none"><div><section>`;

 // Bind search
 const searchInput = document.getElementById('kb-search');
 if (searchInput) {
 searchInput.addEventListener('input', function() {
 debounceSearch(this.value, container);
 });
 }

 // Bind category tabs
 container.querySelectorAll('.kb-cat-tab').forEach(function(tab) {
 tab.addEventListener('click', function() {
 const cat = this.dataset.cat;
 currentCategory = cat;
 renderPage(container, articles, faqs);
 });
 });
 }

 // ─── Articles View ───
 function renderArticlesView(articles) {
 if (articles.length === 0) {
 return '<div class="kb-empty"><p>Không tìm thấy bài viết phù hợp.</p><div>';
 }

 const catTabs = CATEGORIES.map(c =>`
 <button type="button"class="kb-cat-tab ${c.id === currentCategory ? 'active': ''}"data-cat="${c.id}">${c.icon} ${c.label}</button>`).join('');

 const articleCards = articles.map(a =>`
 <div class="kb-article-card"onclick="window._kbOpenArticle('${a.id}')"><div class="kb-article-cat">${getCatIcon(a.category)} ${getCatLabel(a.category)}</div><h3 class="kb-article-title">${escapeHtml(a.title)}</h3><p class="kb-article-summary">${escapeHtml(a.summary)}</p><div class="kb-article-tags">${(a.tags || []).slice(0, 3).map(t =>`<span class="kb-tag">${escapeHtml(t)}</span>`).join('')}</div><div>`).join('');

 return `
 <div class="kb-cat-tabs">${catTabs}</div><div class="kb-result-info"><span id="kb-article-count">${articles.length}</span>bài viết</div><div class="kb-article-grid">${articleCards}</div>`;
 }

 // ─── FAQ View ───
 function renderFaqView(faqs) {
 if (faqs.length === 0) {
 return '<div class="kb-empty"><p>Chưa có câu hỏi nào trong mục này.</p><div>';
 }

 // Category filter for FAQ
 const catSet = new Set();
 faqs.forEach(function(f) { catSet.add(f.category); });
 const catOptions = ['<option value="all">Tất cả</option>'];
 catSet.forEach(function(cat) {
 catOptions.push('<option value="'+ cat + '">'+ getCatLabel(cat) + '</option>');
 });

 const faqItems = faqs.map(function(f, idx) {
 return `
 <div class="kb-faq-item"><button type="button"class="kb-faq-question"onclick="window._kbToggleFaq(this)"><span>${escapeHtml(f.question)}</span><svg class="kb-faq-chevron"viewBox="0 0 20 20"width="16"height="16"fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/><svg><button><div class="kb-faq-answer">${escapeHtml(f.answer)}</div><div>`;
 }).join('');

 return `
 <div class="kb-faq-filter"><label>Lọc theo chủ đề:</label><select onchange="window._kbFilterFaq(this.value)">${catOptions.join('')}</select><div><div class="kb-faq-list">${faqItems}</div>`;
 }

 // ─── Article Detail ───
 window._kbOpenArticle = function(id) {
 const container = document.getElementById('kb-content');
 const detailEl = document.getElementById('kb-article-detail');
 if (!container || !detailEl) return;

 // If from cache, show directly
 if (articlesCache.length >0) {
 const article = articlesCache.find(a =>a.id === id);
 if (article) {
 // Fetch full content
 fetch('/api/knowledge-base?action=get&id='+ id)
 .then(function(r) { return r.json(); })
 .then(function(data) {
 if (data.success && data.article) {
 showArticleDetail(detailEl, data.article);
 }
 })
 .catch(function() { /* ignore */ });
 }
 }

 container.style.display = 'none';
 detailEl.style.display = '';
 detailEl.innerHTML = '<div class="kb-loading"><div class="spinner"><div>Đang tải...</div>';
 };

 function showArticleDetail(container, article) {
 const contentHtml = (article.content || '').split('\n').map(function(p) {
 const line = p.trim();
 if (!line) return '<br>';
 if (line.startsWith('**') && line.endsWith('**')) {
 return '<h4>'+ escapeHtml(line.replace(/\*\*/g, '')) + '</h4>';
 }
 if (line.match(/^\d\.\s/)) {
 return '<div class="kb-detail-step">'+ escapeHtml(line) + '</div>';
 }
 if (line.startsWith('•') || line.startsWith('-')) {
 return '<li>'+ escapeHtml(line.replace(/^[•\-]\s*/, '')) + '</li>';
 }
 return '<p>'+ escapeHtml(line) + '</p>';
 }).join('');

 container.innerHTML = `
 <div class="kb-detail-header"><button type="button"class="kb-back-btn"onclick="window._kbCloseArticle()">← Quay lại</button><span class="kb-article-cat">${getCatIcon(article.category)} ${getCatLabel(article.category)}</span><div><h2 class="kb-detail-title">${escapeHtml(article.title)}</h2><p class="kb-detail-summary">${escapeHtml(article.summary)}</p><div class="kb-detail-tags">${(article.tags || []).map(function(t) { return '<span class="kb-tag">'+ escapeHtml(t) + '</span>'; }).join('')}</div><div class="kb-detail-body">${contentHtml}</div><div class="kb-detail-footer"><button type="button"class="btn btn-outline"onclick="window._kbCloseArticle()">← Quay lại danh sách</button><div>`;
 }

 window._kbCloseArticle = function() {
 const container = document.getElementById('kb-content');
 const detailEl = document.getElementById('kb-article-detail');
 if (container) container.style.display = '';
 if (detailEl) detailEl.style.display = 'none';
 window.scrollTo({ top: 0, behavior: 'smooth'});
 };

 // ─── Switch Articles / FAQ ───
 window._kbSwitchView = function(view) {
 currentView = view;
 const container = document.querySelector('.kb-view');
 if (!container) return;
 // Re-fetch and re-render
 Promise.all([
 fetch('/api/knowledge-base?action=list').then(r =>r.json()),
 fetch('/api/knowledge-base?action=faq').then(r =>r.json()),
 ]).then(function([articlesRes, faqRes]) {
 articlesCache = articlesRes.articles || [];
 const faqs = faqRes.faqs || [];
 const content = document.getElementById('kb-content');
 const detailEl = document.getElementById('kb-article-detail');
 if (content) content.innerHTML = view === 'articles'? renderArticlesView(articlesCache) : renderFaqView(faqs);
 if (detailEl) detailEl.style.display = 'none';
 // Update tabs
 container.querySelectorAll('.kb-tab').forEach(function(t) {
 t.classList.toggle('active', t.textContent.includes(view === 'articles'? 'Bài viết': 'Hỏi đáp'));
 });
 });
 };

 // ─── FAQ Toggle ───
 window._kbToggleFaq = function(btn) {
 const item = btn.closest('.kb-faq-item');
 if (!item) return;
 const isOpen = item.classList.contains('is-open');
 // Close all
 document.querySelectorAll('.kb-faq-item.is-open').forEach(function(el) {
 el.classList.remove('is-open');
 });
 if (!isOpen) {
 item.classList.add('is-open');
 }
 };

 // ─── FAQ Filter ───
 window._kbFilterFaq = function(category) {
 fetch('/api/knowledge-base?action=faq&category='+ category)
 .then(function(r) { return r.json(); })
 .then(function(data) {
 const faqList = document.querySelector('.kb-faq-list');
 if (faqList) {
 faqList.innerHTML = renderFaqItems(data.faqs || []);
 }
 });
 };

 function renderFaqItems(faqs) {
 if (faqs.length === 0) return '<div class="kb-empty"><p>Chưa có câu hỏi nào.</p><div>';
 return faqs.map(function(f) {
 return '<div class="kb-faq-item"><button type="button"class="kb-faq-question"onclick="window._kbToggleFaq(this)"><span>'+ escapeHtml(f.question) + '</span><svg class="kb-faq-chevron"viewBox="0 0 20 20"width="16"height="16"fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/><svg><button><div class="kb-faq-answer">'+ escapeHtml(f.answer) + '</div><div>';
 }).join('');
 }

 // ─── Debounced Search ───
 let searchTimer = null;
 function debounceSearch(query, container) {
 if (searchTimer) clearTimeout(searchTimer);
 searchTimer = setTimeout(function() {
 doSearch(query, container);
 }, 300);
 }

 function doSearch(query, container) {
 const trimmed = query.trim();
 if (!trimmed || trimmed.length < 2) {
 // Reset to current category
 fetch('/api/knowledge-base?action=list&category='+ currentCategory)
 .then(function(r) { return r.json(); })
 .then(function(data) {
 const content = document.getElementById('kb-content');
 if (content) {
 currentView = 'articles';
 content.innerHTML = renderArticlesView(data.articles || []);
 }
 });
 return;
 }

 fetch('/api/knowledge-base?action=search&q='+ encodeURIComponent(trimmed))
 .then(function(r) { return r.json(); })
 .then(function(data) {
 const content = document.getElementById('kb-content');
 if (content) {
 currentView = 'articles';
 content.innerHTML = renderArticlesView(data.articles || []);
 }
 const count = document.getElementById('kb-result-count');
 if (count) count.textContent = (data.articles || []).length + 'bài viết';
 });
 }

 // ─── Helpers ───
 function getCatIcon(cat) {
 const found = CATEGORIES.find(function(c) { return c.id === cat; });
 return found ? found.icon : '';
 }

 function getCatLabel(cat) {
 const found = CATEGORIES.find(function(c) { return c.id === cat; });
 return found ? found.label : cat;
 }

 function escapeHtml(str) {
 if (typeof window.escapeHtml === 'function') return window.escapeHtml(str);
 if (typeof str !== 'string') return String(str || '');
 return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
 }
})();
