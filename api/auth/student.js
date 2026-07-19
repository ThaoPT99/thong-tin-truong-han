// /api/auth/student.js — Student auth: register, login, verify, profile
// Dùng Supabase Auth admin API (service_role key) + student_profiles table
const { supabase, supabaseServiceKey, supabaseUrl } = require('../../lib/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret';

// ─── In-memory rate limiter ───
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

  if (now < record.lockedUntil) {
    const remainingMin = Math.ceil((record.lockedUntil - now) / 60000);
    return { allowed: false, message: `Quá nhiều lần thử. Vui lòng thử lại sau ${remainingMin} phút.` };
  }

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
    console.warn(`🔒 Student auth rate limit: IP ${ip} locked for ${LOCKOUT_MINUTES} minutes`);
  }

  loginAttempts.set(ip, record);
}

function clearRateLimit(ip) {
  loginAttempts.delete(ip);
}

// ─── Helper: get profile id from auth token ───
async function getProfileIdFromToken(token) {
  const verifyRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { 'apikey': supabaseServiceKey, 'Authorization': `Bearer ${token}` },
  });
  if (!verifyRes.ok) return null;
  const userData = await verifyRes.json();

  // Look up student_profiles by auth_id to get the internal id
  const { data: profile } = await supabase
    .from('student_profiles')
    .select('id')
    .eq('auth_id', userData.id)
    .maybeSingle();

  return profile ? profile.id : null;
}

// ─── Checklist: save progress ───
async function handleSaveChecklist(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];

  try {
    const profileId = await getProfileIdFromToken(token);
    if (!profileId) return res.status(404).json({ error: 'Profile not found' });

    const { stepId, data, checklist: clData, completed } = req.body || {};
    if (!stepId) return res.status(400).json({ error: 'stepId is required' });

    const { data: result, error } = await supabase
      .from('student_checklist_progress')
      .upsert({
        student_id: profileId,
        step_id: stepId,
        data: data || {},
        checklist: clData || {},
        completed: completed || false,
      }, { onConflict: 'student_id, step_id' })
      .select('*')
      .single();

    if (error) throw error;
    return res.json({ success: true, saved: result });
  } catch (err) {
    console.error('Save checklist error:', err);
    return res.status(500).json({ error: 'Failed to save' });
  }
}

// ─── Checklist: load all progress ───
async function handleLoadChecklist(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];

  try {
    const profileId = await getProfileIdFromToken(token);
    if (!profileId) return res.json({ success: true, steps: [] });

    const { data: steps, error } = await supabase
      .from('student_checklist_progress')
      .select('*')
      .eq('student_id', profileId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, steps: steps || [] });
  } catch (err) {
    console.error('Load checklist error:', err);
    return res.status(500).json({ error: 'Failed to load' });
  }
}

// ─── Documents: save AI draft ───
async function handleSaveDocument(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];

  try {
    const profileId = await getProfileIdFromToken(token);
    if (!profileId) return res.status(404).json({ error: 'Profile not found' });

    const { docType, aiDraft, userEdit, finalVersion, status } = req.body || {};
    if (!docType) return res.status(400).json({ error: 'docType is required' });

    const { data: result, error } = await supabase
      .from('student_documents')
      .upsert({
        student_id: profileId,
        doc_type: docType,
        ai_draft: aiDraft || '',
        user_edit: userEdit || '',
        final_version: finalVersion || '',
        status: status || 'draft',
      }, { onConflict: 'student_id, doc_type' })
      .select('*')
      .single();

    if (error) throw error;
    return res.json({ success: true, saved: result });
  } catch (err) {
    console.error('Save document error:', err);
    return res.status(500).json({ error: 'Failed to save' });
  }
}

// ─── Refresh token ───
async function handleRefreshToken(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken is required' });

  try {
    const refreshRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await refreshRes.json();

    if (!refreshRes.ok) {
      return res.status(401).json({ error: data?.msg || 'Refresh token failed', code: 'TOKEN_EXPIRED' });
    }

    return res.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token || refreshToken,
      user: data.user,
    });
  } catch (err) {
    console.error('Refresh token error:', err);
    return res.status(500).json({ error: 'Failed to refresh token' });
  }
}

// ─── Documents: load all drafts ───
async function handleLoadDocuments(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];

  try {
    const profileId = await getProfileIdFromToken(token);
    if (!profileId) return res.json({ success: true, documents: [] });

    const { data: docs, error } = await supabase
      .from('student_documents')
      .select('*')
      .eq('student_id', profileId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, documents: docs || [] });
  } catch (err) {
    console.error('Load documents error:', err);
    return res.status(500).json({ error: 'Failed to load' });
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action } = req.query;

  try {
    switch (action) {
      case 'register': return await handleRegister(req, res);
      case 'login': return await handleLogin(req, res);
      case 'verify': return await handleVerify(req, res);
      case 'profile': return await handleProfile(req, res);
      case 'save-checklist': return await handleSaveChecklist(req, res);
      case 'load-checklist': return await handleLoadChecklist(req, res);
      case 'save-document': return await handleSaveDocument(req, res);
      case 'load-documents': return await handleLoadDocuments(req, res);
      case 'refresh': return await handleRefreshToken(req, res);
      default:
        return res.status(404).json({ error: 'Unknown action' });
    }
  } catch (err) {
    console.error('/api/auth/student error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ─── Register ───
async function handleRegister(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = getClientIp(req);
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return res.status(429).json({ error: rateCheck.message });
  }

  const { email, password, fullName, phone } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' });
  }

  try {
    // Use Supabase Auth admin API to create user
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        password,
        email_confirm: true, // auto-confirm for MVP
      }),
    });

    if (!authResponse.ok) {
      recordFailedAttempt(ip);
      const authErr = await authResponse.json();
      if (authErr?.msg?.includes('already registered') || authErr?.msg?.includes('duplicate')) {
        return res.status(409).json({ error: 'Email này đã được đăng ký. Vui lòng đăng nhập.' });
      }
      return res.status(400).json({ error: authErr?.msg || 'Đăng ký thất bại' });
    }

    const authData = await authResponse.json();
    const authUserId = authData.id;

    // Insert student profile
    const { data: profile, error: profileErr } = await supabase
      .from('student_profiles')
      .insert({
        auth_id: authUserId,
        email: email.toLowerCase().trim(),
        full_name: fullName || '',
        phone: phone || '',
      })
      .select('id, email, full_name')
      .single();

    if (profileErr) {
      // Rollback: delete auth user if profile insert fails
      await fetch(`${supabaseUrl}/auth/v1/admin/users/${authUserId}`, {
        method: 'DELETE',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
      });
      console.error('Profile insert error:', profileErr);
      return res.status(500).json({ error: 'Failed to create profile' });
    }

    // Sign in to get session
    const sessionRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        password,
      }),
    });

    const sessionData = await sessionRes.json();

    clearRateLimit(ip);

    return res.status(201).json({
      success: true,
      user: profile,
      access_token: sessionData.access_token,
      refresh_token: sessionData.refresh_token,
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
}

// ─── Login ───
async function handleLogin(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = getClientIp(req);
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return res.status(429).json({ error: rateCheck.message });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Sign in via Supabase Auth
    const sessionRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        password,
      }),
    });

    const sessionData = await sessionRes.json();

    if (!sessionRes.ok) {
      recordFailedAttempt(ip);
      if (sessionData?.msg?.includes('Invalid login credentials')) {
        return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
      }
      return res.status(401).json({ error: sessionData?.msg || 'Đăng nhập thất bại' });
    }

    // Get student profile
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('auth_id', sessionData.user.id)
      .maybeSingle();

    clearRateLimit(ip);

    return res.json({
      success: true,
      user: {
        id: sessionData.user.id,
        email: sessionData.user.email,
        full_name: profile?.full_name || '',
        phone: profile?.phone || '',
        profile_id: profile?.id || null,
      },
      access_token: sessionData.access_token,
      refresh_token: sessionData.refresh_token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
}

// ─── Verify token ───
async function handleVerify(req, res) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = auth.split(' ')[1];

  try {
    const verifyRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!verifyRes.ok) {
      return res.status(401).json({ valid: false, error: 'Invalid or expired token' });
    }

    const userData = await verifyRes.json();

    // Get profile
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('auth_id', userData.id)
      .maybeSingle();

    return res.json({
      valid: true,
      user: {
        id: userData.id,
        email: userData.email,
        full_name: profile?.full_name || '',
        phone: profile?.phone || '',
        profile_id: profile?.id || null,
      },
    });
  } catch (err) {
    return res.status(401).json({ valid: false, error: 'Invalid token' });
  }
}

// ─── Get/Update Profile ───
async function handleProfile(req, res) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = auth.split(' ')[1];

  try {
    // Verify token
    const verifyRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!verifyRes.ok) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userData = await verifyRes.json();

    if (req.method === 'GET') {
      const { data: profile } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('auth_id', userData.id)
        .maybeSingle();

      return res.json({ success: true, user: profile || null });
    }

    if (req.method === 'PUT') {
      const { fullName, phone } = req.body || {};

      const updateData = {};
      if (fullName !== undefined) updateData.full_name = fullName;
      if (phone !== undefined) updateData.phone = phone;

      const { data: profile, error } = await supabase
        .from('student_profiles')
        .upsert({ auth_id: userData.id, ...updateData })
        .select('*')
        .single();

      if (error) throw error;
      return res.json({ success: true, user: profile });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Profile error:', err);
    return res.status(500).json({ error: 'Failed to get/update profile' });
  }
}
