import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';

// Mock JWT_SECRET
process.env.JWT_SECRET = 'test-secret-key-for-unit-tests';

const { signToken, requireAdmin, requireRole } = await import('./auth.js');

describe('signToken', () => {
  it('should sign a JWT with user info', () => {
    const user = { id: 'user-1', email: 'test@test.com', role: 'admin' };
    const token = signToken(user);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe('user-1');
    expect(decoded.email).toBe('test@test.com');
    expect(decoded.role).toBe('admin');
  });

  it('should set expiry to 24h', () => {
    const user = { id: '1', email: 'a@b.com', role: 'viewer' };
    const token = signToken(user);
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    expect(decoded.exp).toBeDefined();
    const expIn24h = Math.floor(Date.now() / 1000) + 86400;
    expect(decoded.exp).toBeCloseTo(expIn24h, -2);
  });
});

describe('requireAdmin middleware', () => {
  let handler: any, req: any, res: any;

  beforeEach(() => {
    handler = vi.fn().mockResolvedValue('done');
    req = { headers: {} };
    res = makeMockRes();
  });

  it('should return 401 if no token (no Authorization header, no cookie)', async () => {
    const wrapped = requireAdmin(handler);
    await wrapped(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Missing authorization token' })
    );
    expect(handler).not.toHaveBeenCalled();
  });

  it('should return 401 if not Bearer', async () => {
    req.headers.authorization = 'Basic token123';
    const wrapped = requireAdmin(handler);
    await wrapped(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(handler).not.toHaveBeenCalled();
  });

  it('should call handler with decoded user for valid token', async () => {
    const token = jwt.sign({ id: 'u1', email: 'admin@test.com', role: 'admin' }, process.env.JWT_SECRET);
    req.headers.authorization = `Bearer ${token}`;
    const wrapped = requireAdmin(handler);
    await wrapped(req, res);
    expect(handler).toHaveBeenCalledWith(req, res);
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe('u1');
    expect(req.user.role).toBe('admin');
  });

  it('should return 401 for expired token', async () => {
    const token = jwt.sign({ id: 'u1', email: 'a@b.com', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '0s' });
    // Wait briefly for expiry
    await new Promise(r => setTimeout(r, 100));
    req.headers.authorization = `Bearer ${token}`;
    const wrapped = requireAdmin(handler);
    await wrapped(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('expired') })
    );
  });

  it('should return 401 for invalid signature', async () => {
    const token = jwt.sign({ id: 'u1', role: 'admin' }, 'wrong-secret');
    req.headers.authorization = `Bearer ${token}`;
    const wrapped = requireAdmin(handler);
    await wrapped(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe('requireRole middleware', () => {
  let handler: any, req: any, res: any;

  beforeEach(() => {
    handler = vi.fn().mockResolvedValue('ok');
    req = { headers: {} };
    res = makeMockRes();
  });

  it('should allow access for matching role', async () => {
    const token = jwt.sign({ id: 'u1', role: 'admin' }, process.env.JWT_SECRET);
    req.headers.authorization = `Bearer ${token}`;
    const wrapped = requireRole('admin')(handler);
    await wrapped(req, res);
    expect(handler).toHaveBeenCalled();
    expect(req.user.role).toBe('admin');
  });

  it('should allow access if role is in allowed list', async () => {
    const token = jwt.sign({ id: 'u1', role: 'editor' }, process.env.JWT_SECRET);
    req.headers.authorization = `Bearer ${token}`;
    const wrapped = requireRole('admin', 'editor')(handler);
    await wrapped(req, res);
    expect(handler).toHaveBeenCalled();
  });

  it('should return 403 for insufficient role', async () => {
    const token = jwt.sign({ id: 'u1', role: 'viewer' }, process.env.JWT_SECRET);
    req.headers.authorization = `Bearer ${token}`;
    const wrapped = requireRole('admin')(handler);
    await wrapped(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('Forbidden') })
    );
    expect(handler).not.toHaveBeenCalled();
  });

  it('should return 401 for invalid token', async () => {
    req.headers.authorization = `Bearer invalidtoken`;
    const wrapped = requireRole('admin')(handler);
    await wrapped(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

function makeMockRes() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json, end: vi.fn() }));
  return { status, json, end: vi.fn(), setHeader: vi.fn() };
}
