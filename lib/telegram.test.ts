import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';

// Save original env
const origEnv = { ...process.env };

describe('Telegram helpers', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterAll(() => {
    process.env = origEnv;
  });

  describe('isTelegramConfigured', () => {
    it('should return true when both token and chat ID are set', async () => {
      process.env.TELEGRAM_BOT_TOKEN = '123:abc';
      process.env.TELEGRAM_ADMIN_CHAT_ID = '-123456';
      const { isTelegramConfigured } = await import('./telegram.js');
      expect(isTelegramConfigured()).toBe(true);
    });

    it('should return false when token is placeholder', async () => {
      process.env.TELEGRAM_BOT_TOKEN = 'your-telegram-bot-token';
      process.env.TELEGRAM_ADMIN_CHAT_ID = '-123456';
      const { isTelegramConfigured } = await import('./telegram.js');
      expect(isTelegramConfigured()).toBe(false);
    });

    it('should return false when chat ID is placeholder', async () => {
      process.env.TELEGRAM_BOT_TOKEN = '123:abc';
      process.env.TELEGRAM_ADMIN_CHAT_ID = 'your-chat-id';
      const { isTelegramConfigured } = await import('./telegram.js');
      expect(isTelegramConfigured()).toBe(false);
    });

    it('should return false when token is missing', async () => {
      delete process.env.TELEGRAM_BOT_TOKEN;
      process.env.TELEGRAM_ADMIN_CHAT_ID = '-123456';
      const { isTelegramConfigured } = await import('./telegram.js');
      expect(isTelegramConfigured()).toBe(false);
    });
  });

  describe('sendTelegramMessage', () => {
    beforeEach(() => {
      process.env.TELEGRAM_BOT_TOKEN = '123:abc';
      process.env.TELEGRAM_ADMIN_CHAT_ID = '-999';
    });

    it('should send message via fetch and return result', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ ok: true, result: { message_id: 1 } }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const { sendTelegramMessage } = await import('./telegram.js');
      const result = await sendTelegramMessage('-999', 'Test message');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.telegram.org/bot123:abc/sendMessage',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('Test message'),
        })
      );
      expect(result.ok).toBe(true);
    });

    it('should return null on fetch error', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network fail')));
      const { sendTelegramMessage } = await import('./telegram.js');
      const result = await sendTelegramMessage('-999', 'Test');
      expect(result).toBeNull();
    });

    it('should return null when bot token is missing', async () => {
      delete process.env.TELEGRAM_BOT_TOKEN;
      const { sendTelegramMessage } = await import('./telegram.js');
      const result = await sendTelegramMessage('-999', 'Test');
      expect(result).toBeNull();
    });
  });

  describe('sendNewCityAlert', () => {
    it('should format city alert message with all fields', async () => {
      process.env.TELEGRAM_BOT_TOKEN = '123:abc';
      process.env.TELEGRAM_ADMIN_CHAT_ID = '-999';
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
      vi.stubGlobal('fetch', mockFetch);

      const { sendNewCityAlert } = await import('./telegram.js');
      await sendNewCityAlert({
        city: 'Da Nang',
        region: 'Central',
        country: 'Vietnam',
        ip: '1.2.3.4',
        isp: 'VNPT',
        url: '/schools',
      });

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.text).toContain('Da Nang');
      expect(callBody.text).toContain('Vietnam');
      expect(callBody.text).toContain('1.2.3.4');
      expect(callBody.parse_mode).toBe('HTML');
    });
  });

  describe('sendDailyReport', () => {
    it('should format report with all stats', async () => {
      process.env.TELEGRAM_BOT_TOKEN = '123:abc';
      process.env.TELEGRAM_ADMIN_CHAT_ID = '-999';
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
      vi.stubGlobal('fetch', mockFetch);

      const { sendDailyReport } = await import('./telegram.js');
      await sendDailyReport({
        date: '20/07/2026',
        totalViews: 150,
        totalSearches: 45,
        totalSessions: 100,
        newIps: 12,
        topSchools: [{ name: 'Osan', count: 30 }, { name: 'Induk', count: 25 }],
        newCities: [{ city: 'Hanoi', region: 'Red River Delta' }],
      });

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.text).toContain('150');
      expect(callBody.text).toContain('45');
      expect(callBody.text).toContain('Osan');
      expect(callBody.text).toContain('Hanoi');
    });
  });

  describe('sendNewStudentAlert', () => {
    it('should format new student alert', async () => {
      process.env.TELEGRAM_BOT_TOKEN = '123:abc';
      process.env.TELEGRAM_ADMIN_CHAT_ID = '-999';
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
      vi.stubGlobal('fetch', mockFetch);

      const { sendNewStudentAlert } = await import('./telegram.js');
      await sendNewStudentAlert({
        name: 'Nguyen Van A',
        phone: '0978123456',
        school: 'Osan University',
        note: 'GPA 7.5',
        createdBy: 'Admin',
      });

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.text).toContain('Nguyen Van A');
      expect(callBody.text).toContain('0978123456');
      expect(callBody.text).toContain('Osan University');
    });
  });
});
