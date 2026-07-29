// api/payments.js — Premium Payment Processing
// VietQR + Manual Bank Transfer (phù hợp cá nhân VN, không cần doanh nghiệp)
// POST /api/payments?action=create-checkout|verify-manual|check-status|bank-info|pricing

const { supabase } = require('../lib/supabase');

const PREMIUM_PRICES = {
  basic: { name: 'Kiểm tra hồ sơ', amount: 199000 },
  pro: { name: 'Gói Pro', amount: 499000 },
  vip: { name: 'Gói VIP', amount: 999000 },
};

// ─── Helper: Lấy thông tin ngân hàng từ env ───
function getBankInfo() {
  return {
    bankCode: process.env.BANK_CODE || 'TPB', // TPBank = TPB
    bankName: process.env.BANK_NAME || 'TPBank',
    accountNumber: process.env.BANK_ACCOUNT || '0961321930',
    accountName: process.env.BANK_ACCOUNT_NAME || 'PHAN TRUONG THAO',
  };
}

// ─── Helper: Tạo mã VietQR (dùng API miễn phí của VietQR.io) ───
function generateVietQRUrl(bankCode, accountNumber, amount, content) {
  // VietQR.io free API: https://img.vietqr.io/image/{bankCode}-{accountNumber}-qr_only.png?amount={amount}&addInfo={content}
  const cleanContent = encodeURIComponent((content || '').replace(/[^a-zA-Z0-9_\-\s]/g, ''));
  // Tạo URL QR
  var qrUrl = 'https://img.vietqr.io/image/'
    + bankCode + '-'
    + accountNumber
    + '-qr_only.png'
    + '?amount=' + amount
    + '&addInfo=' + cleanContent
    + '&accountName=' + encodeURIComponent(getBankInfo().accountName);
  return qrUrl;
}

// ═══════════════════════════════════════
// Action: Create Checkout (VietQR + Bank Transfer)
// ═══════════════════════════════════════
async function handleCreateCheckout(req, res) {
  try {
    const { email, studentName, studentPhone, premiumType } = req.body || {};
    const plan = PREMIUM_PRICES[premiumType] || PREMIUM_PRICES.basic;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Thiếu email' });
    }

    const bankInfo = getBankInfo();
    const reference = 'PREMIUM_' + email.split('@')[0] + '_' + Date.now().toString(36).toUpperCase().slice(-6);

    // Tạo VietQR URL
    var vietQRUrl = generateVietQRUrl(
      bankInfo.bankCode,
      bankInfo.accountNumber,
      plan.amount,
      reference
    );

    // Lưu giao dịch
    await supabase.from('payment_transactions').insert({
      email,
      student_name: studentName || '',
      student_phone: studentPhone || '',
      amount: plan.amount,
      currency: 'VND',
      payment_method: 'bank_transfer',
      status: 'pending',
      premium_type: premiumType || 'basic',
      notes: 'VietQR: ' + reference,
    });

    return res.json({
      success: true,
      method: 'vietqr',
      vietQRUrl: vietQRUrl,
      bankInfo: {
        bank: bankInfo.bankName,
        accountNumber: bankInfo.accountNumber,
        accountName: bankInfo.accountName,
        amount: plan.amount.toLocaleString('vi-VN') + ' VND',
        reference: reference,
      },
      instructions: `Quét mã QR bằng app ngân hàng để chuyển khoản, hoặc chuyển thủ công với nội dung: ${reference}`,
    });
  } catch (err) {
    console.error('Create checkout error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// ═══════════════════════════════════════
// Action: Manual Verification (admin kích hoạt)
// ═══════════════════════════════════════
async function handleVerifyManual(req, res) {
  try {
    const { email, transactionId, receiptUrl, reference } = req.body || {};

    if (!email) {
      return res.status(400).json({ success: false, error: 'Thiếu email' });
    }

    let updates = {
      bank_receipt_url: receiptUrl || '',
      status: 'completed',
      updated_at: new Date().toISOString(),
    };
    if (reference) updates.notes = 'Bank transfer: ' + reference;

    let query = supabase.from('payment_transactions').update(updates);

    if (transactionId) {
      query = query.eq('id', transactionId);
    } else {
      query = query.eq('email', email).eq('status', 'pending').limit(1);
    }

    const { error: updateError } = await query;
    if (updateError) throw updateError;

    await activatePremium(email, 'basic');

    return res.json({ success: true, message: '✅ Premium đã được kích hoạt!' });
  } catch (err) {
    console.error('Verify manual error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// ═══════════════════════════════════════
// Action: Check Premium Status
// ═══════════════════════════════════════
async function handleCheckStatus(req, res) {
  try {
    const { email } = req.query || req.body || {};

    if (!email) {
      return res.json({ success: true, isPremium: false });
    }

    const { data, error } = await supabase
      .from('student_premium')
      .select('is_premium, premium_type, premium_until')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.json({ success: true, isPremium: false });
    }

    const isPremium = data.is_premium && (!data.premium_until || new Date(data.premium_until) > new Date());

    return res.json({
      success: true,
      isPremium,
      premiumType: data.premium_type,
      premiumUntil: data.premium_until,
    });
  } catch (err) {
    console.error('Check premium status error:', err);
    return res.json({ success: true, isPremium: false });
  }
}

// ═══════════════════════════════════════
// Helper: Activate Premium
// ═══════════════════════════════════════
async function activatePremium(email, premiumType) {
  try {
    const premiumUntil = new Date();
    premiumUntil.setFullYear(premiumUntil.getFullYear() + 1);

    const { error } = await supabase.from('student_premium').upsert({
      email,
      is_premium: true,
      premium_type: premiumType || 'basic',
      premium_until: premiumUntil.toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    if (error) throw error;

    console.log(`✅ Premium activated for ${email} (${premiumType})`);
    return true;
  } catch (err) {
    console.error('Activate premium error:', err);
    return false;
  }
}

// ═══════════════════════════════════════
// Action: Get Pricing Info
// ═══════════════════════════════════════
async function handleGetPricing(req, res) {
  return res.json({
    success: true,
    plans: [
      {
        id: 'basic',
        name: 'Kiểm tra hồ sơ',
        price: 199000,
        priceLabel: '199.000đ',
        features: [
          'Kiểm tra chéo 4 tài liệu tiếng Hàn',
          'Phát hiện mâu thuẫn & lỗi sai',
          'Visa Score: chấm điểm hồ sơ',
          'Gợi ý cải thiện chi tiết',
          'Thanh toán 1 lần, dùng vĩnh viễn',
        ],
        popular: true,
      },
      {
        id: 'pro',
        name: 'Gói Pro',
        price: 499000,
        priceLabel: '499.000đ',
        features: [
          'Tất cả tính năng của Basic',
          'Không giới hạn số lần kiểm tra',
          'Study Plan bản Premium (dài hơn)',
          'Dashboard theo dõi tiến độ hồ sơ',
          'Zalo hỗ trợ ưu tiên',
        ],
        popular: false,
      },
      {
        id: 'vip',
        name: 'Gói VIP',
        price: 999000,
        priceLabel: '999.000đ',
        features: [
          'Tất cả tính năng của Pro',
          'Chuyên gia review hồ sơ (1 lần)',
          'Dịch thuật ưu tiên (giảm 20%)',
          'Hỗ trợ 24/7 qua Zalo/Telegram',
          'Template hợp đồng, MOU',
        ],
        popular: false,
      },
    ],
    bankInfo: getBankInfo(),
  });
}

// ═══════════════════════════════════════
// Action: Get Bank Info (cho frontend)
// ═══════════════════════════════════════
async function handleBankInfo(req, res) {
  return res.json({
    success: true,
    ...getBankInfo(),
  });
}

// ═══════════════════════════════════════
// Main handler
// ═══════════════════════════════════════
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query?.action || req.body?.action || '';

  switch (action) {
    case 'create-checkout': return await handleCreateCheckout(req, res);
    case 'verify-manual': return await handleVerifyManual(req, res);
    case 'check-status': return await handleCheckStatus(req, res);
    case 'pricing': return await handleGetPricing(req, res);
    case 'bank-info': return await handleBankInfo(req, res);
    default:
      return res.status(400).json({ error: `Unknown action: ${action}` });
  }
};
