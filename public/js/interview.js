// interview.js — Interview Simulator: mo phong phong van visa KVAC
(function() {
 'use strict';

 var _interviewState = null; // { history, profile, score, phase }
 var _isProcessing = false;

 window.clOpenInterviewSimulator = function() {
 var overlay = document.createElement('div');
 overlay.className = 'cl-ai-overlay';
 overlay.dataset.hasEnterListener = 'true';
 overlay.innerHTML = `
 <div class="int-modal"><div class="cl-ai-modal-header"><h3>Luyên phỏng vấn visa KVAC</h3><button type="button"class="cl-ai-close"onclick="window.clCloseInterview(this)">&times;</button><div><div class="int-body"><!-- Setup --><div id="int-setup"class="int-setup"><div class="int-setup-icon"><div><h4>Mô phỏng phỏng vấn visa Hàn Quốc</h4><p style="color:#64748b;font-size:.85rem;line-height:1.5;margin-bottom:1.25rem;">AI sẽ đóng vai nhân viên KVAC phỏng vấn bạn. Trả lời tự nhiên và nhận đánh giá sau mỗi câu trả lời.</p><div class="int-info"><div class="int-info-item"><span class="int-info-icon"><span><div><strong>Loại visa</strong><span id="int-visa-label">D-4-1 (Học tiếng Hàn)</span><div><div><div class="int-info-item"><span class="int-info-icon"><span><div><strong>Số câu hỏi</strong><span>5-7 câu</span><div><div><div class="int-info-item"><span class="int-info-icon">⏱️</span><div><strong>Thời gian</strong><span>5-10 phút</span><div><div><div><div class="int-actions"><button type="button"class="btn btn-primary btn-lg"onclick="window.clStartInterview()">Bắt đầu phỏng vấn</button><div><div><!-- Interview Chat --><div id="int-chat"style="display:none"><div class="int-progress"><div class="int-progress-text">Câu hỏi: <span id="int-q-num">0</span>/<span id="int-q-total">0</span><div><div class="int-progress-bar"><div id="int-progress-fill"class="int-progress-fill"style="width:0%"><div><div><div class="int-score-badge"id="int-score-badge"><div><div><div id="int-messages"class="int-messages"><div><div id="int-input-area"class="int-input-area"><div id="int-hint"class="int-hint"style="display:none"><span id="int-hint-text"><span><div><div class="int-input-row"><input type="text"id="int-input"class="int-input"placeholder="Nhập câu trả lời..."autocomplete="off"><button type="button"id="int-send"class="int-send-btn"onclick="window.clSendAnswer()"><svg viewBox="0 0 24 24"width="18"height="18"fill="none"stroke="currentColor"stroke-width="2.5"stroke-linecap="round"><line x1="22"y1="2"x2="11"y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/><svg><button><div><div><div><!-- Summary --><div id="int-summary"style="display:none"><div class="int-summary-header"><div class="int-summary-ring"><svg viewBox="0 0 36 36"class="int-circular"><path class="spr-circle-bg"d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/><path class="spr-circle-fill"id="int-summary-fill"stroke-dasharray="0,100"d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/><text x="18"y="20.5"class="spr-circle-text"id="int-summary-score">-</text><svg><div><div class="int-summary-text"><h3 id="int-summary-title">Kết thúc buổi phỏng vấn</h3><p id="int-summary-feedback"style="color:#64748b;font-size:.85rem;"><p><div><div><div class="int-summary-grid"><div class="int-summary-section"><h4>Điểm mạnh</h4><ul id="int-strengths"><ul><div><div class="int-summary-section"><h4>Cần cải thiện</h4><ul id="int-weaknesses"><ul><div><div><div class="int-summary-section"style="margin-bottom:1rem"><h4>Lời khuyên</h4><ol id="int-tips"><ol><div><div class="int-actions"><button type="button"class="btn btn-primary"onclick="window.clRestartInterview()">Làm lại</button><button type="button"class="btn btn-outline"onclick="window.clCopyInterviewResult()">Copy kết quả</button><button type="button"class="btn btn-outline"onclick="window.clCloseInterview(this)">Đóng</button><div><div><div><div>`;
 document.body.appendChild(overlay);
 overlay.addEventListener('click', function(e) {
 if (e.target === this) window.clCloseInterview(this);
 });

 // Reset state
 _interviewState = null;
 _isProcessing = false;
 };

 window.clStartInterview = async function() {
 attachEnterListener();
 var userProfile = (typeof window.clGetProfile === 'function') ? window.clGetProfile() : {};
 var visaType = (userProfile && userProfile.visaType) || 'D-4-1';
 document.getElementById('int-setup').style.display = 'none';
 document.getElementById('int-chat').style.display = '';
 document.getElementById('int-summary').style.display = 'none';

 _interviewState = { history: [], profile: userProfile || {}, visaType: visaType, totalScore: 0, answerCount: 0 };
 _isProcessing = true;

 addMessage('ai', 'Xin chào, tôi là nhân viên KVAC. Tôi sẽ phỏng vấn bạn về hồ sơ du học Hàn Quốc. Hãy trả lời tự nhiên và trung thực nhé! ', 'system');

 try {
 var fetchFn = window.fetchWithAuth || fetch;
 var res = await fetchFn('/api/deepseek?action=interview-simulator', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json'},
 body: JSON.stringify({
 action_type: 'next',
 profile: _interviewState.profile,
 visaType: _interviewState.visaType,
 history: []
 }),
 });
 var data = await res.json();

 if (data.success && data.interview) {
 _interviewState.totalQuestions = data.interview.totalQuestions || 6;
 showQuestion(data.interview);
 updateProgress(1, _interviewState.totalQuestions);
 addMessage('ai', escapeHtml(data.interview.question), 'question');
 if (data.interview.hint) {
 showHint(data.interview.hint);
 }
 enableInput();
 } else {
 addMessage('ai', 'Lỗi kết nối AI. Vui lòng thử lại sau.', 'error');
 }
 } catch (err) {
 addMessage('ai', 'Lỗi: '+ escapeHtml(err.message), 'error');
 }

 _isProcessing = false;
 };

 window.clSendAnswer = async function() {
 if (_isProcessing) return;

 var input = document.getElementById('int-input');
 var answer = input.value.trim();
 if (!answer || answer.length < 2) return;

 // Check if this is the last question
 var isLast = _interviewState.questionNumber >= _interviewState.totalQuestions;

 _isProcessing = true;
 input.value = '';
 input.disabled = true;
 document.getElementById('int-send').disabled = true;
 document.getElementById('int-hint').style.display = 'none'; addMessage('user', escapeHtml(answer), 'user');

 // Add to history
 _interviewState.history.push({ role: 'user', content: answer });

 if (isLast) {
 // This was the last answer, ask for final evaluation
 _interviewState.history.push({ role: 'assistant', content: 'Cam on ban. Day la cau tra loi cuoi cung.', questionNumber: _interviewState.questionNumber });
 showLoading();
 await completeInterview();
 hideLoading();
 } else {
 showLoading();
 try {
 var fetchFn = window.fetchWithAuth || fetch;
 var res = await fetchFn('/api/deepseek?action=interview-simulator', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json'},
 body: JSON.stringify({
 action_type: 'answer',
 profile: _interviewState.profile,
 visaType: _interviewState.visaType,
 history: _interviewState.history,
 answer: answer
 }),
 });
 var data = await res.json();

 hideLoading();

 if (data.success && data.interview) {
 // Show feedback
 var qNum = data.interview.questionNumber || (_interviewState.questionNumber + 1);
 _interviewState.questionNumber = qNum;

 if (data.interview.feedback) {
 addMessage('ai-feedback', ''+ escapeHtml(data.interview.feedback) + (data.interview.score ? '(Điểm: '+ data.interview.score + '/10)': ''), 'feedback');
 _interviewState.totalScore += data.interview.score || 0;
 _interviewState.answerCount++;
 }

 // Show next question or complete
 if (qNum >_interviewState.totalQuestions) {
 // Interview complete
 addMessage('ai', 'Cảm ơn bạn đã trả lời tất cả câu hỏi! Tôi sẽ tổng kết buổi phỏng vấn.', 'system');
 _interviewState.history.push({ role: 'assistant', content: 'Cam on ban. Buoi phong van ket thuc.'});
 await completeInterview();
 } else {
 showQuestion(data.interview);
 updateProgress(qNum, _interviewState.totalQuestions);
 addMessage('ai', escapeHtml(data.interview.nextQuestion || 'Cam on ban. Cau hoi tiep theo:'), 'question');
 if (data.interview.hint) showHint(data.interview.hint);
 // Add to history
 _interviewState.history.push({ role: 'assistant', content: data.interview.nextQuestion || '', questionNumber: qNum });
 }
 enableInput();
 } else {
 addMessage('ai', 'Lỗi kết nối AI. Vui lòng thử lại.', 'error');
 enableInput();
 }
 } catch (err) {
 hideLoading();
 addMessage('ai', 'Lỗi: '+ escapeHtml(err.message), 'error');
 enableInput();
 }
 }

 _isProcessing = false;
 };

 async function completeInterview() {
 try {
 var fetchFn = window.fetchWithAuth || fetch;
 var res = await fetchFn('/api/deepseek?action=interview-simulator', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json'},
 body: JSON.stringify({
 action_type: 'complete',
 profile: _interviewState.profile,
 visaType: _interviewState.visaType,
 history: _interviewState.history
 }),
 });
 var data = await res.json();

 // Hide chat, show summary
 document.getElementById('int-chat').style.display = 'none';
 document.getElementById('int-input-area').style.display = 'none';
 var summaryEl = document.getElementById('int-summary');
 summaryEl.style.display = '';

 if (data.success && data.summary) {
 var s = data.summary;
 var score = Math.round((s.overallScore || 5) * 10) / 10;
 var dashArray = Math.min(score * 10, 100);

 var fill = document.getElementById('int-summary-fill');
 var scoreText = document.getElementById('int-summary-score');
 if (fill) fill.setAttribute('stroke-dasharray', dashArray + ', 100');
 if (scoreText) scoreText.textContent = score.toString();

 // Color
 var color = '#dc2626';
 if (score >= 7) color = '#059669';
 else if (score >= 5) color = '#d97706';
 if (fill) fill.setAttribute('stroke', color);

 var title = document.getElementById('int-summary-title');
 if (score >= 8) title.textContent = '🌟 Xuất sắc! Bạn đã trả lời rất tốt.';
 else if (score >= 6) title.textContent = 'Khá tốt! Còn một số điểm cần cải thiện.';
 else if (score >= 4) title.textContent = 'Tạm ổn, cần luyện tập thêm.';
 else title.textContent = 'Cần cải thiện nhiều. Hãy luyện tập thêm nhé!';

 document.getElementById('int-summary-feedback').textContent = s.overallFeedback || '';

 // Fill lists
 fillList('int-strengths', s.strengths);
 fillList('int-weaknesses', s.weaknesses);
 fillList('int-tips', s.tips);
 } else {
 document.getElementById('int-summary-feedback').textContent = ''+ (data.error || 'Khong the tong ket.');
 }
 } catch (err) {
 document.getElementById('int-summary-feedback').textContent = 'Loi: '+ err.message;
 }
 }

 // ─── Helpers ───
 function addMessage(role, content, type) {
 var container = document.getElementById('int-messages');
 if (!container) return;
 var div = document.createElement('div');
 div.className = 'int-msg int-msg-'+ (type || role);

 var avatar = '';
 if (role === 'user') avatar = '<div class="int-avatar int-avatar-user"><div>';
 else if (role === 'ai'|| role === 'ai-feedback') avatar = '<div class="int-avatar int-avatar-ai"><div>';

 div.innerHTML = avatar + '<div class="int-bubble">'+ content + '</div>';
 container.appendChild(div);
 container.scrollTop = container.scrollHeight;
 }

 function showLoading() {
 var container = document.getElementById('int-messages');
 if (!container) return;
 var existing = container.querySelector('.int-loading');
 if (existing) return;
 var div = document.createElement('div');
 div.className = 'int-msg int-msg-ai int-loading';
 div.innerHTML = '<div class="int-avatar int-avatar-ai"><div><div class="int-bubble"><span class="ai-chat-dots"><span><span><span><span><span><span><span><div>';
 container.appendChild(div);
 container.scrollTop = container.scrollHeight;
 }

 function hideLoading() {
 var el = document.querySelector('.int-loading');
 if (el) el.remove();
 }

 function showQuestion(q) {
 var qNum = document.getElementById('int-q-num');
 var qTotal = document.getElementById('int-q-total');
 if (qNum) qNum.textContent = String(q.questionNumber || 1);
 if (qTotal) qTotal.textContent = String(q.totalQuestions || 6);
 _interviewState.questionNumber = q.questionNumber || 1;
 _interviewState.totalQuestions = q.totalQuestions || 6;
 updateProgress(_interviewState.questionNumber, _interviewState.totalQuestions);
 }

 function updateProgress(current, total) {
 var fill = document.getElementById('int-progress-fill');
 if (fill) fill.style.width = Math.min((current / total) * 100, 100) + '%';
 var badge = document.getElementById('int-score-badge');
 if (badge && _interviewState && _interviewState.answerCount >0) {
 var avg = Math.round(_interviewState.totalScore / _interviewState.answerCount);
 badge.textContent = ''+ avg + '/10';
 }
 }

 function showHint(text) {
 var hint = document.getElementById('int-hint');
 var hintText = document.getElementById('int-hint-text');
 if (hint && hintText) {
 hintText.textContent = text;
 hint.style.display = '';
 }
 }

 function enableInput() {
 var input = document.getElementById('int-input');
 var sendBtn = document.getElementById('int-send');
 if (input) { input.disabled = false; input.focus(); }
 if (sendBtn) sendBtn.disabled = false;
 }

 function fillList(id, items) {
 var el = document.getElementById(id);
 if (!el) return;
 if (!items || items.length === 0) {
 el.innerHTML = '<li style="color:#94a3b8">Chưa có đánh giá</li>';
 return;
 }
 el.innerHTML = items.map(function(item) {
 return '<li>'+ escapeHtml(item) + '</li>';
 }).join('');
 }

 window.clRestartInterview = function() {
 document.getElementById('int-summary').style.display = 'none';
 document.getElementById('int-chat').style.display = 'none';
 document.getElementById('int-input-area').style.display = '';
 document.getElementById('int-messages').innerHTML = '';
 document.getElementById('int-setup').style.display = '';
 _interviewState = null;
 _isProcessing = false;
 };

 window.clCopyInterviewResult = function() {
 var text = '=== KET QUA PHONG VAN ===\n';
 text += 'Diem tong: '+ (document.getElementById('int-summary-score').textContent || '?') + '/10\n\n';
 text += 'Nhan xet: '+ (document.getElementById('int-summary-feedback').textContent || '') + '\n\n';
 text += '=== NOI DUNG PHONG VAN ===\n';
 var msgs = document.querySelectorAll('#int-messages .int-msg');
 msgs.forEach(function(msg) {
 var avatar = msg.querySelector('.int-avatar');
 var bubble = msg.querySelector('.int-bubble');
 if (avatar && bubble) {
 var role = avatar.classList.contains('int-avatar-user') ? 'Toi': 'KVAC';
 text += role + ': '+ bubble.textContent + '\n';
 }
 });
 navigator.clipboard.writeText(text).then(function() {
 if (typeof toast === 'function') toast('Da copy ket qua!');
 });
 };

 window.clCloseInterview = function(btn) {
 var overlay = (btn && btn.closest) ? btn.closest('.cl-ai-overlay') : document.querySelector('.cl-ai-overlay');
 if (overlay) overlay.remove();
 };

 function escapeHtml(str) {
 if (typeof window.escapeHtml === 'function') return window.escapeHtml(str);
 if (typeof str !== 'string') return String(str || '');
 return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
 }

 // Support Enter key (attached to input element directly when modal opens)
 function attachEnterListener() {
 var input = document.getElementById('int-input');
 if (input && !input.dataset.intEnterBound) {
 input.dataset.intEnterBound = 'true';
 input.addEventListener('keydown', function(e) {
 if (e.key === 'Enter') {
 e.preventDefault();
 if (!this.disabled) window.clSendAnswer();
 }
 });
 }
 }
})();
