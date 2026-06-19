// /api/auth/[action].js — handles login (POST) and verify (GET)
const bcrypt = require('bcryptjs');
const { supabase } = require('../../lib/supabase');
const { signToken, requireAdmin } = require('../../lib/auth');

// ─── In-memory rate limiter (reset khi cold start, nhưng vẫn hiệu quả) ───
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.socket?.remoteAddress
    || 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };

  // Nếu đang bị lock
  if (now < record.lockedUntil) {
    const remainingMin = Math.ceil((record.lockedUntil - now) / 60000);
    return {
      allowed: false,
      message: `Quá nhiều lần đăng nhập sai. Vui lòng thử lại sau ${remainingMin} phút.`,
    };
  }

  // Reset nếu đã hết thời gian lock
  if (record.lockedUntil > 0 && now >= record.lockedUntil) {
    loginAttempts.delete(ip);
  }

  return { allowed: true };
}

function recordFailedAttempt(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };
  record.count++;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MINUTES * 60 * 1000;
    record.count = 0;
    console.warn(`🔒 Rate limit: IP ${ip} locked for ${LOCKOUT_MINUTES} minutes`);
  }

  loginAttempts.set(ip, record);
}

function clearRateLimit(ip) {
  loginAttempts.delete(ip);
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action } = req.query;

  if (action === 'login') {
    return handleLogin(req, res);
  }

  if (action === 'verify') {
    return requireAdmin(async (req2, res2) => {
      return res2.json({ valid: true, user: req2.user });
    })(req, res);
  }

  return res.status(404).json({ error: 'Not found' });
};

async function handleLogin(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check rate limit
  const ip = getClientIp(req);
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return res.status(429).json({ error: rateCheck.message });
  }

  try {
    const { email, password, remember } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, password_hash, display_name, role')
      .eq('email', email.toLowerCase().trim())
      .eq('is_active', true)
      .limit(1);

    if (error) throw error;

    if (!users || users.length === 0) {
      recordFailedAttempt(ip);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      recordFailedAttempt(ip);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Login thành công: clear rate limit
    clearRateLimit(ip);

    // Update last_login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    const token = signToken(user);

    // Set HttpOnly cookie for middleware to read
    const cookieOptions = [
      `admin_token=${token}`,
      'HttpOnly',
      'Secure',
      'SameSite=Lax',
      'Path=/',
      `Max-Age=${remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24}`, // 30 days if remember, else 1 day
    ].join('; ');

    res.setHeader('Set-Cookie', cookieOptions);

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}