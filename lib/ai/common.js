// lib/ai/common.js
// Shared utilities cho AI handlers — extracted từ deepseek.js

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

function getDeepSeekKey() {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key || key.includes('placeholder') || key === 'sk-your-deepseek-api-key') return null;
  return key;
}

async function callDeepSeek(messages, params) {
  const apiKey = getDeepSeekKey();
  if (!apiKey) return null;

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: params?.temperature ?? 0.3,
        max_tokens: params?.maxTokens ?? 2000,
      }),
      signal: (() => { try { return AbortSignal.timeout ? AbortSignal.timeout(params?.timeout ?? 30000) : undefined; } catch(e) { return undefined; } })(),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error('DeepSeek call error:', err.message);
    return null;
  }
}

function getBotToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || token.includes('placeholder') || token === 'your-telegram-bot-token') return null;
  return token;
}

function verifyTelegramWebhook(req) {
  const token = getBotToken();
  if (!token) return false;

  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secretToken) {
    const header = req.headers['x-telegram-bot-api-secret-token'];
    return header === secretToken;
  }
  return true;
}

function escapeHtmlTelegram(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');
}

module.exports = {
  getDeepSeekKey,
  callDeepSeek,
  getBotToken,
  verifyTelegramWebhook,
  escapeHtmlTelegram,
};
