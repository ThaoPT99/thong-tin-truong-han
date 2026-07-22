import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const origEnv = { ...process.env };

describe('AI Common utilities', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...origEnv };
  });

  afterEach(() => {
    process.env = { ...origEnv };
  });

  describe('getDeepSeekKey', () => {
    it('should return key when set', async () => {
      process.env.DEEPSEEK_API_KEY = 'sk-test-key';
      const { getDeepSeekKey } = await import('./common.js');
      expect(getDeepSeekKey()).toBe('sk-test-key');
    });

    it('should return null when key is placeholder', async () => {
      process.env.DEEPSEEK_API_KEY = 'sk-your-deepseek-api-key';
      const { getDeepSeekKey } = await import('./common.js');
      expect(getDeepSeekKey()).toBeNull();
    });

    it('should return null when key is missing', async () => {
      delete process.env.DEEPSEEK_API_KEY;
      const { getDeepSeekKey } = await import('./common.js');
      expect(getDeepSeekKey()).toBeNull();
    });
  });

  describe('callDeepSeek', () => {
    beforeEach(() => {
      process.env.DEEPSEEK_API_KEY = 'sk-test-key';
    });

    it('should return null when API returns non-ok', async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: false });
      vi.stubGlobal('fetch', mockFetch);

      const { callDeepSeek } = await import('./common.js');
      const result = await callDeepSeek([{ role: 'user', content: 'hi' }]);
      expect(result).toBeNull();
    });

    it('should extract content from response', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: 'Hello!' } }],
        }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const { callDeepSeek } = await import('./common.js');
      const result = await callDeepSeek([{ role: 'user', content: 'hi' }]);
      expect(result).toBe('Hello!');
    });

    it('should return null when response has no choices', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ choices: [] }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const { callDeepSeek } = await import('./common.js');
      const result = await callDeepSeek([{ role: 'user', content: 'hi' }]);
      expect(result).toBeNull();
    });

    it('should apply params: temperature and max_tokens', async () => {
      let requestBody: any;
      const mockFetch = vi.fn().mockImplementation((url, opts) => {
        requestBody = JSON.parse(opts.body);
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ choices: [{ message: { content: 'ok' } }] }),
        });
      });
      vi.stubGlobal('fetch', mockFetch);

      const { callDeepSeek } = await import('./common.js');
      await callDeepSeek(
        [{ role: 'user', content: 'hi' }],
        { temperature: 0.7, maxTokens: 4000 }
      );

      expect(requestBody.temperature).toBe(0.7);
      expect(requestBody.max_tokens).toBe(4000);
    });

    it('should use default temperature 0.3', async () => {
      let requestBody: any;
      const mockFetch = vi.fn().mockImplementation((url, opts) => {
        requestBody = JSON.parse(opts.body);
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ choices: [{ message: { content: 'ok' } }] }),
        });
      });
      vi.stubGlobal('fetch', mockFetch);

      const { callDeepSeek } = await import('./common.js');
      await callDeepSeek([{ role: 'user', content: 'hi' }]);
      expect(requestBody.temperature).toBe(0.3);
    });

    it('should return null when no API key', async () => {
      delete process.env.DEEPSEEK_API_KEY;
      const { callDeepSeek } = await import('./common.js');
      const result = await callDeepSeek([{ role: 'user', content: 'hi' }]);
      expect(result).toBeNull();
    });

    it('should handle fetch exception gracefully', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
      const { callDeepSeek } = await import('./common.js');
      const result = await callDeepSeek([{ role: 'user', content: 'hi' }]);
      expect(result).toBeNull();
    });
  });

  describe('getBotToken', () => {
    it('should return token when set', async () => {
      process.env.TELEGRAM_BOT_TOKEN = '123:real-token';
      const { getBotToken } = await import('./common.js');
      expect(getBotToken()).toBe('123:real-token');
    });

    it('should return null for placeholder', async () => {
      process.env.TELEGRAM_BOT_TOKEN = 'your-telegram-bot-token';
      const { getBotToken } = await import('./common.js');
      expect(getBotToken()).toBeNull();
    });

    it('should return null when missing', async () => {
      delete process.env.TELEGRAM_BOT_TOKEN;
      const { getBotToken } = await import('./common.js');
      expect(getBotToken()).toBeNull();
    });
  });

  describe('verifyTelegramWebhook', () => {
    beforeEach(() => {
      process.env.TELEGRAM_BOT_TOKEN = '123:abc';
    });

    it('should return true when no secret configured', async () => {
      const { verifyTelegramWebhook } = await import('./common.js');
      expect(verifyTelegramWebhook({ headers: {} })).toBe(true);
    });

    it('should return true when header matches secret', async () => {
      process.env.TELEGRAM_WEBHOOK_SECRET = 'my-secret';
      const { verifyTelegramWebhook } = await import('./common.js');
      expect(verifyTelegramWebhook({
        headers: { 'x-telegram-bot-api-secret-token': 'my-secret' },
      })).toBe(true);
    });

    it('should return false when header does not match secret', async () => {
      process.env.TELEGRAM_WEBHOOK_SECRET = 'my-secret';
      const { verifyTelegramWebhook } = await import('./common.js');
      expect(verifyTelegramWebhook({
        headers: { 'x-telegram-bot-api-secret-token': 'wrong' },
      })).toBe(false);
    });

    it('should return false when no bot token', async () => {
      delete process.env.TELEGRAM_BOT_TOKEN;
      const { verifyTelegramWebhook } = await import('./common.js');
      expect(verifyTelegramWebhook({ headers: {} })).toBe(false);
    });
  });

  describe('escapeHtmlTelegram', () => {
    it('should escape HTML special chars', async () => {
      const { escapeHtmlTelegram } = await import('./common.js');
      expect(escapeHtmlTelegram('<b>bold</b> & "quote"')).toBe('&lt;b&gt;bold&lt;/b&gt; &amp; &quot;quote&quot;');
    });

    it('should return empty string for null/undefined', async () => {
      const { escapeHtmlTelegram } = await import('./common.js');
      expect(escapeHtmlTelegram(null)).toBe('');
      expect(escapeHtmlTelegram(undefined)).toBe('');
    });

    it('should return same string when no special chars', async () => {
      const { escapeHtmlTelegram } = await import('./common.js');
      expect(escapeHtmlTelegram('Hello world')).toBe('Hello world');
    });
  });
});
