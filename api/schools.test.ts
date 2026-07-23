import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('/api/schools', () => {
  let handler: any;

  beforeEach(async () => {
    // Re-import handler fresh for each test (clears module-level state like rate limiter)
    vi.resetModules();
    // Mock supabase to avoid real DB calls
    vi.doMock('../lib/supabase', () => ({
      supabase: {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          in: vi.fn().mockReturnThis(),
          or: vi.fn().mockReturnThis(),
          insert: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
          limit: vi.fn().mockResolvedValue({ data: [], error: null }),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
          gte: vi.fn().mockReturnThis(),
          gt: vi.fn().mockReturnThis(),
          not: vi.fn().mockReturnThis(),
          textSearch: vi.fn().mockReturnThis(),
        })),
      },
    }));
    vi.doMock('../lib/error-logger', () => ({
      logServerError: vi.fn().mockResolvedValue(undefined),
    }));
    handler = (await import('./schools/index.js')).default;
  });

  describe('OPTIONS', () => {
    it('should return 200 for preflight', async () => {
      const res = makeRes();
      await handler(makeReq('OPTIONS'), res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /api/schools (list)', () => {
    it('should return success response for lightweight list', async () => {
      const res = makeRes();
      await handler(makeReq('GET', { full: 'false' }), res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });
  });

  describe('GET /api/schools?include=extras', () => {
    it('should return extras data with semesters/checklist/interviews', async () => {
      const res = makeRes();
      await handler(makeReq('GET', { include: 'extras' }), res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            semesters: expect.any(Array),
            visaChecklist: expect.any(Array),
            interviews: expect.any(Array),
          }),
        })
      );
    });
  });

  // (POST tests removed — handler đã xoá cùng feature "Gửi đơn")
});

function makeRes() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json, end: vi.fn() }));
  return {
    setHeader: vi.fn(),
    status,
    json,
    end: vi.fn(),
  };
}

function makeReq(method: string, query: any = {}, body: any = null) {
  return {
    method,
    query,
    body,
    headers: {
      'x-forwarded-for': '127.0.0.1',
      'content-type': 'application/json',
    },
    connection: { remoteAddress: '127.0.0.1' },
  };
}

