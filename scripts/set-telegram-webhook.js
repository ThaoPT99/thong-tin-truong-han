// scripts/set-telegram-webhook.js
// Chạy script này để set webhook URL cho Telegram Bot
// Cách dùng: node scripts/set-telegram-webhook.js
//
// Yêu cầu:
//   - Biến môi trường TELEGRAM_BOT_TOKEN đã được set
//   - Đã deploy lên Vercel có URL cố định

const https = require('https');

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Lấy URL từ biến môi trường hoặc tự động suy ra từ thư mục hiện tại
let WEBHOOK_URL = process.env.TELEGRAM_WEBHOOK_URL;
if (!WEBHOOK_URL) {
  // Thử lấy từ Vercel URL: tên project từ package.json
  const pkg = require('../package.json');
  const repoUrl = pkg.repository?.url || '';
  const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'thong-tin-truong-han';
  WEBHOOK_URL = `https://${repoName}.vercel.app/api/deepseek?action=telegram-webhook`;
}

const SECRET_TOKEN = process.env.TELEGRAM_WEBHOOK_SECRET || '';

async function setWebhook() {
  console.log('🤖 Setting Telegram Bot Webhook...\n');
  console.log(`  URL: ${WEBHOOK_URL}`);
  console.log(`  Secret Token: ${SECRET_TOKEN ? '✅ Yes' : '❌ No (optional)'}`);

  if (!BOT_TOKEN || BOT_TOKEN === 'your-telegram-bot-token' || BOT_TOKEN.includes('placeholder')) {
    console.error('\n❌ TELEGRAM_BOT_TOKEN chưa được cấu hình!');
    console.log('   Bạn cần set biến môi trường TELEGRAM_BOT_TOKEN trước.');
    console.log('   Lấy token từ @BotFather trên Telegram.');
    process.exit(1);
  }

  const params = new URLSearchParams();
  params.set('url', WEBHOOK_URL);
  if (SECRET_TOKEN) {
    params.set('secret_token', SECRET_TOKEN);
  }
  params.set('allowed_updates', JSON.stringify(['message'])); // Chỉ nhận message updates

  const url = `${TELEGRAM_API}/bot${BOT_TOKEN}/setWebhook`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.ok) {
      console.log('\n✅ Webhook set thành công!');
      console.log(`   ${data.description || ''}`);
      console.log(`   Pending updates cleared: ${data.result?.pending_update_count || 0}`);
    } else {
      console.error('\n❌ Lỗi set webhook:', data.description || 'Unknown error');
      process.exit(1);
    }

    // Kiểm tra webhook info
    console.log('\n📋 Kiểm tra thông tin webhook...');
    const infoRes = await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/getWebhookInfo`);
    const info = await infoRes.json();

    if (info.ok) {
      const wh = info.result;
      console.log(`   URL: ${wh.url}`);
      console.log(`   Has custom cert: ${wh.has_custom_certificate}`);
      console.log(`   Pending update count: ${wh.pending_update_count}`);
      console.log(`   Last error: ${wh.last_error_message || 'None'}`);
      console.log(`   Last error date: ${wh.last_error_date ? new Date(wh.last_error_date * 1000).toISOString() : 'N/A'}`);
      console.log(`   Max connections: ${wh.max_connections}`);
    }

    // Test bằng cách gọi getMe
    console.log('\n🧪 Kiểm tra bot...');
    const meRes = await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/getMe`);
    const me = await meRes.json();
    if (me.ok) {
      const bot = me.result;
      console.log(`   ✅ Bot @${bot.username} (ID: ${bot.id}) hoạt động!`);
      console.log(`   Tên: ${bot.first_name}`);
      console.log(`   Có thể join groups: ${bot.can_join_groups}`);
    }

    console.log('\n🎉 Hoàn tất! Bot của bạn đã sẵn sàng.');
    console.log(`   Nhắn tin cho @${me.result?.username || 'bot của bạn'} để test.`);
  } catch (err) {
    console.error('\n❌ Lỗi kết nối:', err.message);
    process.exit(1);
  }
}

setWebhook();
