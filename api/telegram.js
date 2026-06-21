// api/telegram.js — Telegram Bot Webhook Handler
// POST /api/telegram — receives updates from Telegram when users message the bot
//
// Commands:
//   /start          — Giới thiệu bot
//   /help           — Danh sách lệnh
//   /truong <tên>   — Tra cứu thông tin trường
//   /school <tên>   — Tra cứu (alias)
//   /baocao         — Báo cáo tổng quan hôm nay
//   /report         — Báo cáo (alias)
//   /gui <info>     — Tạo học sinh mới (Tên, SĐT, Trường, Ghi chú)

const { supabase } = require('../lib/supabase');
const { sendTelegramMessage, sendDailyReport, sendNewStudentAlert } = require('../lib/telegram');

const TELEGRAM_API = 'https://api.telegram.org';

function getBotToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || token.includes('placeholder') || token === 'your-telegram-bot-token') return null;
  return token;
}

// ─── Verify webhook request comes from Telegram ───
function verifyWebhook(req) {
  const token = getBotToken();
  if (!token) return false;

  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secretToken) {
    const header = req.headers['x-telegram-bot-api-secret-token'];
    return header === secretToken;
  }

  // If no secret token configured, accept all POST requests
  // (Vercel function URL is already semi-private by being random-ish)
  return true;
}

// ─── Command Handlers ───

async function handleStart(chatId) {
  const text = `🤖 <b>Chào mừng bạn đến với Bot hỗ trợ!</b>

Bot này giúp bạn quản lý thông tin du học Hàn Quốc visa D2-6.

<b>Các lệnh có sẵn:</b>
🏫 <code>/truong [tên]</code> — Tra cứu thông tin trường
📊 <code>/baocao</code> — Báo cáo tổng quan hôm nay
👤 <code>/gui [tên], [SĐT], [trường], [ghi chú]</code> — Thêm học sinh mới
❓ <code>/help</code> — Xem hướng dẫn chi tiết

<i>Liên hệ admin nếu cần hỗ trợ thêm.</i>`;

  return await sendTelegramMessage(chatId, text);
}

async function handleHelp(chatId) {
  const text = `📖 <b>Hướng dẫn sử dụng Bot</b>

<b>1. Tra cứu trường</b>
<code>/truong Osan</code> — Tìm trường theo tên
<code>/truong nữ Busan</code> — Tìm theo tên Tiếng Việt
→ Bot trả về thông tin: học phí, KTX, điều kiện, chuyên ngành

<b>2. Báo cáo tổng quan</b>
<code>/baocao</code> — Xem thống kê lượt xem, IP mới, top trường hôm nay

<b>3. Thêm học sinh mới</b>
<code>/gui Nguyễn Văn A, 0978123456, Osan, Gọi lại 2h chiều</code>
→ Bot tự động tạo học sinh trong CRM + gửi thông báo

<b>4. Cảnh báo tự động</b>
Bot sẽ tự động gửi tin nhắn khi:
• 📍 Phát hiện IP mới từ thành phố lạ
• 📊 Báo cáo tổng quan mỗi sáng`;

  return await sendTelegramMessage(chatId, text);
}

async function handleSearchSchool(chatId, query) {
  if (!query || query.trim().length < 2) {
    return await sendTelegramMessage(chatId, 'Vui lòng nhập tên trường cần tra cứu.\n\nVí dụ: <code>/truong Osan</code>');
  }

  const searchTerm = query.trim();

  // Search by name (Vietnamese, Korean, English)
  const { data: schools, error } = await supabase
    .from('schools')
    .select(`
      *,
      school_conditions(text),
      school_majors(text),
      school_advantages(text),
      school_conversions(text),
      school_documents(text),
      school_partners(code, name)
    `)
    .or(`name.ilike.%${searchTerm}%,name_kr.ilike.%${searchTerm}%,name_en.ilike.%${searchTerm}%,slug.ilike.%${searchTerm}%`)
    .limit(5);

  if (error) {
    console.error('Search school error:', error);
    return await sendTelegramMessage(chatId, '❌ Lỗi tra cứu, vui lòng thử lại sau.');
  }

  if (!schools || schools.length === 0) {
    return await sendTelegramMessage(chatId, `❌ Không tìm thấy trường nào khớp với "<b>${escapeHtml(searchTerm)}</b>".\n\nThử gõ khác đi, ví dụ: <code>/truong Osan</code>`);
  }

  // Send each school as a separate message (Telegram has 4096 char limit)
  for (const school of schools) {
    const conditions = (school.school_conditions || []).map(c => c.text).join('\n• ') || 'Chưa cập nhật';
    const majors = (school.school_majors || []).map(m => m.text).join(', ') || 'Chưa cập nhật';
    const advantages = (school.school_advantages || []).map(a => a.text).join('\n• ') || 'Chưa có';

    const text = `🏫 <b>${escapeHtml(school.name)}</b>${school.name_kr ? ` (${escapeHtml(school.name_kr)})` : ''}

📍 Vị trí: ${school.location || 'Chưa rõ'}
📚 Hệ: ${school.system || 'Chưa rõ'}
💰 Học phí: ${school.tuition || 'Chưa cập nhật'}
🏠 KTX: ${school.ktx || 'Chưa cập nhật'}
🎯 Chỉ tiêu: ${school.quota || 'Chưa rõ'}

<b>📋 Điều kiện:</b>
• ${conditions}

<b>📖 Chuyên ngành:</b>
${majors}

<b>⭐ Ưu điểm:</b>
• ${advantages}

${school.website ? `🔗 <a href="${escapeHtml(school.website)}">Website</a>` : ''}
${school.catalog_url ? `📄 <a href="${escapeHtml(school.catalog_url)}">Catalog</a>` : ''}`;

    await sendTelegramMessage(chatId, text);
  }

  if (schools.length > 1) {
    await sendTelegramMessage(chatId, `🔍 Tìm thấy <b>${schools.length}</b> trường phù hợp.`);
  }
}

async function handleReport(chatId) {
  const today = new Date().toISOString().split('T')[0];

  const [viewsRes, searchesRes, sessionsRes, ipCacheRes, newCitiesRes] = await Promise.all([
    supabase.from('analytics_page_views').select('*', { count: 'exact', head: true })
      .gte('created_at', today),
    supabase.from('analytics_searches').select('*', { count: 'exact', head: true })
      .gte('created_at', today),
    supabase.from('analytics_sessions').select('*', { count: 'exact', head: true })
      .gte('started_at', today),
    supabase.from('analytics_ip_cache').select('*', { count: 'exact', head: true })
      .gte('last_seen', today),
    supabase.from('analytics_ip_cache').select('city, region, first_seen')
      .gte('first_seen', today)
      .not('city', 'is', null),
  ]);

  const totalViews = viewsRes.count || 0;
  const totalSearches = searchesRes.count || 0;
  const totalSessions = sessionsRes.count || 0;
  const newIps = ipCacheRes.count || 0;

  // Top schools today
  const { data: topSchoolsRaw } = await supabase
    .from('analytics_page_views')
    .select('school_slug, school_name')
    .gte('created_at', today)
    .not('school_slug', 'is', null);

  const schoolCounts = {};
  for (const row of topSchoolsRaw || []) {
    if (!row.school_slug) continue;
    schoolCounts[row.school_slug] = schoolCounts[row.school_slug] || { name: row.school_name || row.school_slug, count: 0 };
    schoolCounts[row.school_slug].count++;
  }

  const topSchools = Object.entries(schoolCounts)
    .map(([slug, d]) => ({ slug, name: d.name, count: d.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // New cities today
  const citySeen = new Set();
  const newCities = [];
  for (const row of newCitiesRes.data || []) {
    if (!row.city) continue;
    const key = `${row.city}|${row.region || ''}`;
    if (!citySeen.has(key)) {
      citySeen.add(key);
      newCities.push({ city: row.city, region: row.region || '' });
    }
  }

  // Format report
  const reportSent = await sendDailyReport({
    date: today,
    totalViews,
    totalSearches,
    totalSessions,
    newIps,
    topSchools,
    newCities,
  });

  // Gửi phản hồi cho người yêu cầu
  if (!reportSent) {
    await sendTelegramMessage(chatId, '❌ Chưa cấu hình TELEGRAM_ADMIN_CHAT_ID để nhận báo cáo. Vui lòng kiểm tra biến môi trường.');
  }
}

async function handleAddStudent(chatId, text) {
  // Parse: /gui Tên, SĐT, Trường, Ghi chú
  const parts = text.split(',').map(s => s.trim());
  const name = parts[0] || '';
  const phone = parts[1] || '';
  const schoolName = parts[2] || '';
  const note = parts.slice(3).join(', ').trim() || '';

  if (!name || !phone) {
    return await sendTelegramMessage(chatId, 'Vui lòng nhập đúng định dạng:\n\n<code>/gui Tên học sinh, Số điện thoại, Trường, Ghi chú</code>\n\nVí dụ:\n<code>/gui Nguyễn Văn A, 0978123456, Osan, Gọi lại 2h chiều</code>');
  }

  // Try to find school by name
  let schoolId = null;
  if (schoolName) {
    const { data: schools } = await supabase
      .from('schools')
      .select('id, name')
      .ilike('name', `%${schoolName}%`)
      .limit(1);

    if (schools && schools.length > 0) {
      schoolId = schools[0].id;
    }
  }

  // Get active semester
  const { data: activeSem } = await supabase
    .from('semesters')
    .select('id')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  // Insert student
  const { data: student, error } = await supabase
    .from('students')
    .insert({
      name: name,
      phone: phone,
      school_id: schoolId,
      semester_id: activeSem?.id || null,
      note: note || '',
      status: 'new',
      owner_id: null, // Chưa gán sale
    })
    .select('id, name')
    .single();

  if (error) {
    console.error('Create student via Telegram error:', error);
    return await sendTelegramMessage(chatId, '❌ Lỗi tạo học sinh: ' + (error.message || 'Unknown error'));
  }

  // Log
  await supabase.from('student_logs').insert({
    student_id: student.id,
    action: 'created',
    description: 'Tạo từ Telegram Bot',
    created_by: 'Telegram Bot',
  });

  // Notify admin
  await sendNewStudentAlert({
    name,
    phone,
    school: schoolName || 'Chưa chọn',
    note: note || 'Không có',
    createdBy: 'Bot Telegram',
  });

  // Confirm to requester
  const schoolText = schoolName ? `trường <b>${escapeHtml(schoolName)}</b>` : 'chưa chọn trường';
  await sendTelegramMessage(chatId, `✅ Đã tạo học sinh <b>${escapeHtml(name)}</b> (${schoolText}) thành công!\n📞 SĐT: ${escapeHtml(phone)}\n📝 Ghi chú: ${escapeHtml(note || 'Không có')}\n\nBạn có thể xem trong CRM: thongtintruonghan.vercel.app/admin/students.html`);
}

// ─── Router ───
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Telegram-Bot-Api-Secret-Token');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — health check for the webhook
  if (req.method === 'GET') {
    const token = getBotToken();
    return res.json({
      success: true,
      message: 'Telegram Bot Webhook is active',
      configured: !!token,
    });
  }

  // Verify webhook
  if (!verifyWebhook(req)) {
    return res.status(403).json({ error: 'Invalid webhook source' });
  }

  const botToken = getBotToken();
  if (!botToken) {
    return res.status(503).json({ error: 'TELEGRAM_BOT_TOKEN not configured' });
  }

  try {
    const update = req.body || {};
    const message = update.message;

    // Ignore non-message updates (channel posts, callback queries, etc.)
    if (!message || !message.text) {
      return res.status(200).json({ success: true }); // Acknowledge but ignore
    }

    const chatId = message.chat.id;
    const text = message.text.trim();
    const command = text.split(/\s+/)[0].toLowerCase();
    const args = text.substring(command.length).trim();

    // Route commands
    switch (command) {
      case '/start':
        await handleStart(chatId);
        break;

      case '/help':
        await handleHelp(chatId);
        break;

      case '/truong':
      case '/school':
        await handleSearchSchool(chatId, args);
        break;

      case '/baocao':
      case '/report':
        await handleReport(chatId);
        break;

      case '/gui':
        await handleAddStudent(chatId, args);
        break;

      default:
        await sendTelegramMessage(chatId, `❓ Không hiểu lệnh "<b>${escapeHtml(command)}</b>".\n\nGõ <code>/help</code> để xem danh sách lệnh.`);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('/api/telegram error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

// ─── Escape HTML for Telegram ───
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
