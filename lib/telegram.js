// lib/telegram.js — Telegram Bot API helper
// Dùng để gửi tin nhắn từ Vercel Functions đến Telegram Bot

const TELEGRAM_API = 'https://api.telegram.org';

function getBotToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || token.includes('placeholder') || token === 'your-telegram-bot-token') return null;
  return token;
}

function getAdminChatId() {
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!chatId || chatId === 'your-chat-id') return null;
  return chatId;
}

/**
 * Gửi tin nhắn text qua Telegram Bot API
 */
async function sendTelegramMessage(chatId, text, parseMode = 'HTML') {
  const token = getBotToken();
  if (!token) return null;

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: parseMode,
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('Telegram sendMessage error:', err.substring(0, 200));
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error('Telegram sendMessage exception:', err.message);
    return null;
  }
}

/**
 * Gửi cảnh báo khi phát hiện địa điểm mới (thành phố lần đầu xuất hiện)
 */
async function sendNewCityAlert(cityInfo) {
  const chatId = getAdminChatId();
  if (!chatId) return null;

  const { city, region, country, ip, isp, url } = cityInfo;

  const text = `📍 <b>Địa điểm mới phát hiện!</b>

🏙 Thành phố: ${city || 'Không rõ'}${region ? `, ${region}` : ''}
🌍 Quốc gia: ${country || 'Không rõ'}
🆔 IP: ${ip || 'Không rõ'}
📡 ISP: ${isp || 'Không rõ'}
🔗 Trang: ${url || 'Trang chủ'}

→ Có thể là đối tác tiềm năng!`;

  return await sendTelegramMessage(chatId, text);
}

/**
 * Gửi báo cáo tổng quan ngày
 */
async function sendDailyReport(stats) {
  const chatId = getAdminChatId();
  if (!chatId) return null;

  const {
    date,
    totalViews,
    totalSearches,
    totalSessions,
    newIps,
    topSchools,
    newCities,
  } = stats;

  const schoolLines = (topSchools || [])
    .slice(0, 5)
    .map((s, i) => `${i + 1}. ${s.name || s.slug} — ${s.count} lượt`)
    .join('\n');

  const cityLines = (newCities || [])
    .slice(0, 5)
    .map(c => `  • ${c.city || ''}${c.region ? ` (${c.region})` : ''}`)
    .join('\n');

  const text = `📊 <b>Báo cáo ngày ${date}</b>

👁 Lượt xem: <b>${totalViews || 0}</b>
🔍 Tìm kiếm: <b>${totalSearches || 0}</b>
👤 Phiên: <b>${totalSessions || 0}</b>
🆕 IP mới: <b>${newIps || 0}</b>

${schoolLines ? `🏆 <b>Top trường:</b>\n${schoolLines}` : ''}

${cityLines ? `📍 <b>Địa điểm mới:</b>\n${cityLines}` : ''}

<i>Xem chi tiết: thongtintruonghan.vercel.app/admin/analytics.html</i>`;

  return await sendTelegramMessage(chatId, text);
}

/**
 * Gửi thông báo có học sinh mới được tạo từ lệnh /gui
 */
async function sendNewStudentAlert(studentInfo) {
  const chatId = getAdminChatId();
  if (!chatId) return null;

  const { name, phone, school, note, createdBy } = studentInfo;

  const text = `🎓 <b>Học sinh mới từ Telegram!</b>

👤 Tên: ${name || 'Không rõ'}
📞 SĐT: ${phone || 'Không rõ'}
🏫 Trường: ${school || 'Chưa chọn'}
📝 Ghi chú: ${note || 'Không có'}
👤 Người tạo: ${createdBy || 'Bot Telegram'}

<i>Đã được tạo trong CRM.</i>`;

  return await sendTelegramMessage(chatId, text);
}

/**
 * Kiểm tra cấu hình Telegram Bot
 */
function isTelegramConfigured() {
  return !!(getBotToken() && getAdminChatId());
}

module.exports = {
  sendTelegramMessage,
  sendNewCityAlert,
  sendDailyReport,
  sendNewStudentAlert,
  isTelegramConfigured,
};
