import { describe, it, expect, vi } from 'vitest';

// error-logger.js uses CJS require('./supabase') so vi.mock can't intercept
// These tests verify the functions handle edge cases gracefully (try/catch in code)

const { logError, logServerError, logWarn, logInfo } = await import('./error-logger.js');

describe('logError', () => {
  it('should resolve without error for string message (supabase will fail but caught)', async () => {
    // The function wraps supabase in try/catch, so it should resolve
    await expect(logError('error', 'test message')).resolves.toBeUndefined();
  });

  it('should resolve without error for Error object', async () => {
    await expect(logError('error', new Error('test error'))).resolves.toBeUndefined();
  });

  it('should handle various levels', async () => {
    await expect(logError('info', 'test')).resolves.toBeUndefined();
    await expect(logError('warn', 'test')).resolves.toBeUndefined();
    await expect(logError('error', 'test')).resolves.toBeUndefined();
  });

  it('should handle long messages', async () => {
    const longMsg = 'x'.repeat(3000);
    await expect(logError('error', longMsg)).resolves.toBeUndefined();
  });

  it('should handle empty context', async () => {
    await expect(logError('error', 'test', {})).resolves.toBeUndefined();
  });

  it('should handle null context', async () => {
    await expect(logError('error', 'test', null as any)).resolves.toBeUndefined();
  });
});

describe('logServerError', () => {
  it('should handle Error with req object', async () => {
    const req = {
      headers: { 'x-forwarded-for': '1.2.3.4' },
      url: '/api/test',
      method: 'GET',
    };
    await expect(logServerError(new Error('fail'), {}, req)).resolves.toBeUndefined();
  });

  it('should handle null req gracefully', async () => {
    await expect(logServerError(new Error('fail'), {}, null)).resolves.toBeUndefined();
  });

  it('should handle string error message', async () => {
    await expect(logServerError('string error' as any, {})).resolves.toBeUndefined();
  });
});

describe('logWarn', () => {
  it('should resolve for warning message', async () => {
    await expect(logWarn('Warning message')).resolves.toBeUndefined();
  });

  it('should handle warning with context', async () => {
    await expect(logWarn('Warning', { alert: true })).resolves.toBeUndefined();
  });
});

describe('logInfo', () => {
  it('should resolve for info message', async () => {
    await expect(logInfo('Info message')).resolves.toBeUndefined();
  });
});
