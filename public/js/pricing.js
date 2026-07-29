// pricing.js — Premium Pricing & Payment UI
(function() {
  'use strict';

  let currentUserEmail = null;
  let isPremium = false;

  // ─── Init ───
  function init() {
    try {
      var userData = localStorage.getItem('student_user');
      if (userData) {
        var user = JSON.parse(userData);
        currentUserEmail = user.email || '';
      }
    } catch(e) {}
    checkPremiumStatus();
  }

  // ─── Check Premium Status ───
  async function checkPremiumStatus() {
    if (!currentUserEmail) return;
    try {
      var res = await fetch('/api/payments?action=check-status&email=' + encodeURIComponent(currentUserEmail));
      var data = await res.json();
      isPremium = data.isPremium || false;

      // Update UI elements
      document.querySelectorAll('.premium-badge').forEach(function(el) {
        el.textContent = isPremium ? 'PREMIUM' : 'MIỄN PHÍ';
        el.className = 'premium-badge ' + (isPremium ? 'active' : 'inactive');
      });

      // Show/hide premium features
      document.querySelectorAll('.premium-locked').forEach(function(el) {
        el.style.display = isPremium ? 'none' : 'flex';
      });
      document.querySelectorAll('.premium-unlocked').forEach(function(el) {
        el.style.display = isPremium ? 'block' : 'none';
      });
    } catch(e) {
      console.warn('Check premium status failed:', e);
    }
  }

  // ─── Render Pricing Page ───
  function renderPricing(container) {
    if (!container) return;

    var plans = [
      {
        id: 'basic',
        name: 'Kiểm tra hồ sơ',
        price: '199.000đ',
        originalPrice: '500.000đ',
        features: [
          'Kiểm tra chéo 4 tài liệu tiếng Hàn',
          'Phát hiện mâu thuẫn & lỗi sai',
          'Visa Score: chấm điểm hồ sơ',
          'Gợi ý cải thiện chi tiết',
          'Thanh toán 1 lần, dùng vĩnh viễn',
        ],
        popular: true,
        cta: isPremium ? 'Đã kích hoạt ✓' : 'Nâng cấp ngay',
      },
      {
        id: 'pro',
        name: 'Gói Pro',
        price: '499.000đ',
        originalPrice: '1.200.000đ',
        features: [
          'Tất cả tính năng của Basic',
          'Không giới hạn số lần kiểm tra',
          'Study Plan bản Premium (dài hơn)',
          'Dashboard theo dõi tiến độ hồ sơ',
          'Zalo hỗ trợ ưu tiên',
        ],
        popular: false,
        cta: isPremium ? 'Đã kích hoạt ✓' : 'Nâng cấp ngay',
      },
      {
        id: 'vip',
        name: 'Gói VIP',
        price: '999.000đ',
        originalPrice: '3.000.000đ',
        features: [
          'Tất cả tính năng của Pro',
          'Chuyên gia review hồ sơ (1 lần)',
          'Dịch thuật ưu tiên (giảm 20%)',
          'Hỗ trợ 24/7 qua Zalo',
          'Template hợp đồng, MOU',
        ],
        popular: false,
        cta: isPremium ? 'Đã kích hoạt ✓' : 'Nâng cấp ngay',
      },
    ];

    // Header
    var html = '<section class="pricing-section">';
    html += '<div class="pricing-header">';
    html += '<p class="advisor-kicker">💎 Premium</p>';
    html += '<h2>Nâng cấp để kiểm tra hồ sơ của bạn</h2>';
    html += '<p class="pricing-subtitle">AI viết xong tài liệu rồi? Hãy để chúng tôi kiểm tra lại trước khi nộp — tránh sai sót đáng tiếc.</p>';
    html += '</div>';

    // Comparison table: Free vs Premium
    html += '<div class="pricing-compare">';
    html += '<table class="pricing-compare-table">';
    html += '<thead><tr><th>Tính năng</th><th>🎁 Free</th><th>💎 Premium</th></tr></thead>';
    html += '<tbody>';
    html += '<tr><td>Tra cứu trường</td><td>✅</td><td>✅</td></tr>';
    html += '<tr><td>AI tư vấn chọn trường</td><td>✅</td><td>✅</td></tr>';
    html += '<tr><td>Viết 4 tài liệu tiếng Hàn</td><td>✅ (bản cơ bản)</td><td>✅ (bản nâng cao)</td></tr>';
    html += '<tr><td>Study Plan</td><td>✅</td><td>✅ Premium</td></tr>';
    html += '<tr><td>Kiến thức visa</td><td>✅</td><td>✅</td></tr>';
    html += '<tr><td><strong>🔍 Kiểm tra chéo tài liệu</strong></td><td>❌</td><td>✅ Phát hiện mâu thuẫn</td></tr>';
    html += '<tr><td><strong>📊 Visa Score</strong></td><td>❌</td><td>✅ Chấm điểm + dự đoán</td></tr>';
    html += '<tr><td><strong>💡 Gợi ý cải thiện</strong></td><td>❌</td><td>✅ Cụ thể từng phần</td></tr>';
    html += '<tr><td>Zalo hỗ trợ</td><td>Chung</td><td>Ưu tiên</td></tr>';
    html += '</tbody></table>';
    html += '</div>';

    // Pricing cards
    html += '<div class="pricing-cards">';

    plans.forEach(function(plan, index) {
      html += '<div class="pricing-card' + (plan.popular ? ' popular' : '') + '">';
      if (plan.popular) html += '<div class="pricing-badge">🔥 PHỔ BIẾN NHẤT</div>';
      html += '<h3>' + plan.name + '</h3>';
      html += '<div class="pricing-amount">';
      html += '<span class="pricing-price">' + plan.price + '</span>';
      html += '<span class="pricing-original">' + plan.originalPrice + '</span>';
      html += '</div>';
      html += '<ul class="pricing-features">';
      plan.features.forEach(function(f) { html += '<li>' + f + '</li>'; });
      html += '</ul>';

      if (isPremium) {
        html += '<button class="pricing-btn disabled" disabled>✅ Đã kích hoạt</button>';
      } else {
        html += '<button class="pricing-btn" onclick="window.openPricingModal(\'' + plan.id + '\')">' + plan.cta + '</button>';
      }

      html += '</div>';
    });

    html += '</div>'; // pricing-cards

    // Bank info section
    html += '<div class="pricing-bank-info">';
    html += '<h3>🏦 Chuyển khoản ngân hàng</h3>';
    html += '<p>Sau khi chuyển khoản, vui lòng chụp ảnh biên lai và gửi qua form bên dưới. Chúng tôi sẽ kích hoạt Premium trong vòng 24h.</p>';
    html += '<div class="bank-details">';
  html += '<div class="bank-row"><span>Ngân hàng:</span><strong>TPBank</strong></div>';
  html += '<div class="bank-row"><span>Số tài khoản:</span><strong>0961321930</strong></div>';
  html += '<div class="bank-row"><span>Chủ tài khoản:</span><strong>PHAN TRUONG THAO</strong></div>';
    html += '<div class="bank-row"><span>Nội dung CK:</span><strong style="color:#2563eb">PREMIUM_[email_của_bạn]</strong></div>';
    html += '</div>';
    html += '<p class="bank-note">⚠️ Ghi đúng nội dung chuyển khoản để hệ thống tự động kích hoạt!</p>';
    html += '</div>';

    // Manual upload form
    html += '<div class="pricing-upload" id="manualUploadSection">';
    html += '<h3>📤 Đã chuyển khoản? Gửi biên lai tại đây</h3>';
    html += '<div class="upload-form">';
    html += '<input type="email" id="receiptEmail" placeholder="Email của bạn" value="' + (currentUserEmail || '') + '" />';
    html += '<input type="text" id="receiptReference" placeholder="Nội dung chuyển khoản (PREMIUM_...)" />';
    html += '<input type="file" id="receiptFile" accept="image/*" />';
    html += '<button class="pricing-btn" onclick="window.submitReceipt()">📤 Gửi biên lai</button>';
    html += '<p id="receiptMessage" class="receipt-message"></p>';
    html += '</div>';
    html += '</div>';

    html += '</div>'; // pricing-section

    container.innerHTML = html;
  }

  // ─── Open Payment Modal ───
  function openPricingModal(planType) {
    if (!currentUserEmail) {
      if (confirm('Vui lòng đăng nhập trước khi nâng cấp. Đăng nhập ngay?')) {
        if (typeof window.openAuthModal === 'function') window.openAuthModal();
      }
      return;
    }

    var planNames = { basic: 'Kiểm tra hồ sơ', pro: 'Gói Pro', vip: 'Gói VIP' };
    var planPrices = { basic: '199.000đ', pro: '499.000đ', vip: '999.000đ' };

    var overlay = document.createElement('div');
    overlay.className = 'payment-modal-overlay';
    overlay.innerHTML = [
      '<div class="payment-modal">',
      '<button class="payment-modal-close" onclick="this.closest(\'.payment-modal-overlay\').remove()">&times;</button>',
      '<h2>💎 Nâng cấp Premium</h2>',
      '<p class="payment-modal-subtitle">Gói: <strong>' + (planNames[planType] || 'Basic') + '</strong> — ' + (planPrices[planType] || '199.000đ') + '</p>',
      '<div class="payment-modal-body">',
      '<div class="payment-loading" id="paymentLoading">',
      '<div class="spinner"></div>',
      '<p>Đang tạo mã thanh toán...</p>',
      '</div>',
      '<div class="payment-options hidden" id="paymentOptions">',
      '<p>📱 Quét mã QR bằng app ngân hàng để chuyển khoản:</p>',
      '<div id="paymentQRContainer" class="payment-qr-wrap" style="text-align:center;margin:1rem 0"></div>',
      '<div class="payment-bank-details" id="paymentBankDetails"></div>',
      '<p style="font-size:0.82rem;color:#64748b;text-align:center">Sau khi chuyển, quay lại trang và bấm "Đã chuyển khoản" bên dưới.</p>',
      '</div>',
      '<div id="paymentMessage" class="payment-message"></div>',
      '</div>',
      '</div>',
    ].join('');

    document.body.appendChild(overlay);

    // Create checkout (VietQR + Bank Transfer)
    fetch('/api/payments?action=create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: currentUserEmail,
        premiumType: planType,
        studentName: (JSON.parse(localStorage.getItem('student_user') || '{}')).full_name || '',
      }),
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var loading = document.getElementById('paymentLoading');
      var options = document.getElementById('paymentOptions');

      if (loading) loading.classList.add('hidden');
      if (options) options.classList.remove('hidden');

      // Show VietQR code
      var qrContainer = document.getElementById('paymentQRContainer');
      if (qrContainer && data.vietQRUrl) {
        qrContainer.innerHTML = [
          '<div class="vietqr-wrap">',
          '<img src="' + data.vietQRUrl + '" alt="VietQR" style="width:240px;height:240px;border:2px solid #e2e8f0;border-radius:12px;padding:8px;background:#fff" />',
          '<p style="font-size:0.85rem;color:#059669;font-weight:600;margin-top:0.5rem">📱 Mở app ngân hàng quét mã này</p>',
          '</div>',
        ].join('');
      }

      // Show bank details
      var bankSection = document.getElementById('paymentBankDetails');
      if (bankSection && data.bankInfo) {
        bankSection.innerHTML = [
          '<hr style="margin:1rem 0;border-color:#e2e8f0">',
          '<h3 style="font-size:0.95rem;margin-bottom:0.75rem">🏦 Hoặc chuyển thủ công</h3>',
          '<div class="bank-details">',
          '<div class="bank-row"><span>Ngân hàng:</span><strong>' + (data.bankInfo.bank || 'Vietcombank') + '</strong></div>',
          '<div class="bank-row"><span>Số TK:</span><strong>' + data.bankInfo.accountNumber + '</strong></div>',
          '<div class="bank-row"><span>Chủ TK:</span><strong>' + data.bankInfo.accountName + '</strong></div>',
          '<div class="bank-row"><span>Số tiền:</span><strong style="color:#059669;font-weight:700">' + data.bankInfo.amount + '</strong></div>',
          '<div class="bank-row"><span>Nội dung:</span><strong style="color:#2563eb;font-size:0.9rem;word-break:break-all">' + data.bankInfo.reference + '</strong></div>',
          '</div>',
          '<p class="bank-note">⚠️ Ghi ĐÚNG nội dung chuyển khoản để admin kích hoạt nhanh nhất!</p>',
        ].join('');
      }
    })
    .catch(function(err) {
      var msg = document.getElementById('paymentMessage');
      if (msg) msg.textContent = '❌ Lỗi: ' + err.message;
    });
  }

  // ─── Submit Receipt ───
  function submitReceipt() {
    var email = document.getElementById('receiptEmail')?.value?.trim();
    var reference = document.getElementById('receiptReference')?.value?.trim();
    var fileInput = document.getElementById('receiptFile');
    var msg = document.getElementById('receiptMessage');

    if (!email) { msg.textContent = '❌ Vui lòng nhập email'; return; }
    if (!reference) { msg.textContent = '❌ Vui lòng nhập nội dung chuyển khoản'; return; }

    msg.textContent = '⏳ Đang gửi...';

    fetch('/api/payments?action=verify-manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, receiptUrl: '', reference: reference }),
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.success) {
        msg.innerHTML = '✅ <strong>Biên lai đã được gửi!</strong> Chúng tôi sẽ kích hoạt Premium trong vòng 24h. Kiểm tra lại trang sau.';
        isPremium = true; // Optimistic
        checkPremiumStatus();
      } else {
        msg.textContent = '❌ Lỗi: ' + (data.error || 'Không xác định');
      }
    })
    .catch(function(err) {
      msg.textContent = '❌ Lỗi kết nối: ' + err.message;
    });
  }

  // ─── Expose globals ───
  window.renderPricing = renderPricing;
  window.openPricingModal = openPricingModal;
  window.submitReceipt = submitReceipt;
  window.checkPremiumStatus = checkPremiumStatus;

  // Auto init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
