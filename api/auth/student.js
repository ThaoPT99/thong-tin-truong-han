// /api/auth/student.js — Student auth: register, login, verify, profile
// Dùng Supabase Auth admin API (service_role key) + student_profiles table
const { supabase, supabaseServiceKey, supabaseUrl } = require('../../lib/supabase');
const { sendNewAdvisorSubmissionAlert } = require('../../lib/telegram');

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

    // Try update first, then insert
    const { data: existing } = await supabase
      .from('student_documents')
      .select('id')
      .eq('student_id', profileId)
      .eq('doc_type', docType)
      .maybeSingle();

    let result;
    if (existing) {
      const { data: updated, error: updateErr } = await supabase
        .from('student_documents')
        .update({
          ai_draft: aiDraft || '',
          user_edit: userEdit || '',
          final_version: finalVersion || '',
          status: status || 'draft',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select('*')
        .single();
      if (updateErr) throw updateErr;
      result = updated;
    } else {
      const { data: inserted, error: insertErr } = await supabase
        .from('student_documents')
        .insert({
          student_id: profileId,
          doc_type: docType,
          ai_draft: aiDraft || '',
          user_edit: userEdit || '',
          final_version: finalVersion || '',
          status: status || 'draft',
        })
        .select('*')
        .single();
      if (insertErr) throw insertErr;
      result = inserted;
    }

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
      // ═══ Phase 2: Applications ═══
      case 'applications-create': return await handleAppCreate(req, res);
      case 'applications-list': return await handleAppList(req, res);
      case 'applications-get': return await handleAppGet(req, res);
      case 'applications-update': return await handleAppUpdate(req, res);
      case 'applications-delete': return await handleAppDelete(req, res);
      // ═══ Phase 2: Reminders ═══
      case 'reminders-list': return await handleRemindersList(req, res);
      case 'reminders-create': return await handleReminderCreate(req, res);
      case 'reminders-complete': return await handleReminderComplete(req, res);
      case 'reminders-delete': return await handleReminderDelete(req, res);
      // ═══ Advisor Data (lưu thông tin từ form Tư vấn) ═══
      case 'save-advisor-data': return await handleSaveAdvisorData(req, res);
      case 'load-advisor-data': return await handleLoadAdvisorData(req, res);
      // ═══ Phase 5: Chat History ═══
      case 'chat-save': return await handleChatSave(req, res);
      case 'chat-load': return await handleChatLoad(req, res);
      case 'chat-clear': return await handleChatClear(req, res);
      // ═══ Phase 5: Login Log ═══
      case 'log-login': return await handleLogLogin(req, res);
      // ═══ Phase 5: Notification (kiểm tra admin_note mới) ═══
      case 'check-notifications': return await handleCheckNotifications(req, res);
      // ═══ Phase 2: Document upload ═══
      case 'document-upload': return await handleDocumentUpload(req, res);
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
  if (!fullName || !fullName.trim()) {
    return res.status(400).json({ error: 'Vui lòng nhập họ tên' });
  }
  if (!phone || !phone.trim()) {
    return res.status(400).json({ error: 'Vui lòng nhập số điện thoại' });
  }
  var phoneDigits = String(phone).replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    return res.status(400).json({ error: 'Số điện thoại phải có ít nhất 10 số' });
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

// ════════════════════════════════════════════════════════════
// Phase 2: Applications CRUD
// ════════════════════════════════════════════════════════════

async function getAuthProfile(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.split(' ')[1];
  const profileId = await getProfileIdFromToken(token);
  return profileId;
}

async function handleAppCreate(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const profileId = await getAuthProfile(req);
  if (!profileId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const data = req.body || {};
    const { data: app, error } = await supabase.from('school_applications').insert({
      student_profile_id: profileId,
      full_name: data.fullName || '',
      full_name_kr: data.fullNameKr || '',
      full_name_en: data.fullNameEn || '',
      date_of_birth: data.dateOfBirth || null,
      gender: data.gender || '',
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      high_school_name: data.highSchoolName || '',
      high_school_gpa: data.highSchoolGpa || null,
      high_school_absences: data.highSchoolAbsences || 0,
      korean_level: data.koreanLevel || 'none',
      topik_level: data.topikLevel || null,
      father_name: data.fatherName || '',
      father_occupation: data.fatherOccupation || '',
      mother_name: data.motherName || '',
      mother_occupation: data.motherOccupation || '',
      status: 'draft',
    }).select('*').single();

    if (error) throw error;
    return res.status(201).json({ success: true, application: app });
  } catch (err) {
    console.error('App create error:', err);
    return res.status(500).json({ error: 'Failed to create application' });
  }
}

async function handleAppList(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const profileId = await getAuthProfile(req);
  if (!profileId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { data: apps, error } = await supabase
      .from('school_applications')
      .select('*')
      .eq('student_profile_id', profileId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return res.json({ success: true, applications: apps || [] });
  } catch (err) {
    console.error('App list error:', err);
    return res.status(500).json({ error: 'Failed to list applications' });
  }
}

async function handleAppGet(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const profileId = await getAuthProfile(req);
  if (!profileId) return res.status(401).json({ error: 'Unauthorized' });

  const appId = req.query.id;
  if (!appId) return res.status(400).json({ error: 'id is required' });

  try {
    const { data: app, error } = await supabase
      .from('school_applications')
      .select('*')
      .eq('id', appId)
      .eq('student_profile_id', profileId)
      .single();
    if (error) throw error;
    return res.json({ success: true, application: app });
  } catch (err) {
    console.error('App get error:', err);
    return res.status(500).json({ error: 'Failed to get application' });
  }
}

async function handleAppUpdate(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
  const profileId = await getAuthProfile(req);
  if (!profileId) return res.status(401).json({ error: 'Unauthorized' });

  const { id, ...data } = req.body || {};
  if (!id) return res.status(400).json({ error: 'id is required' });

  try {
    const updateData = {};
    const fields = ['full_name','full_name_kr','full_name_en','date_of_birth','gender','nationality',
      'passport_no','passport_expiry','phone','email','address',
      'high_school_name','high_school_address','high_school_start','high_school_end',
      'high_school_major','high_school_gpa','high_school_absences','high_school_status',
      'university_name','university_major','university_start','university_end',
      'university_gpa','university_degree',
      'korean_level','topik_level','korean_education',
      'father_name','father_occupation','father_phone',
      'mother_name','mother_occupation','mother_phone',
      'school_id','semester_id','status','admin_note'];
    fields.forEach(f => {
      if (data[f] !== undefined) updateData[f] = data[f];
    });
    // Also check camelCase versions
    const camelMap = {
      fullName: 'full_name', fullNameKr: 'full_name_kr', fullNameEn: 'full_name_en',
      dateOfBirth: 'date_of_birth', highSchoolName: 'high_school_name',
      highSchoolGpa: 'high_school_gpa', highSchoolAbsences: 'high_school_absences',
      koreanLevel: 'korean_level', topikLevel: 'topik_level',
      fatherName: 'father_name', fatherOccupation: 'father_occupation',
      motherName: 'mother_name', motherOccupation: 'mother_occupation',
    };
    Object.entries(camelMap).forEach(([camel, db]) => {
      if (data[camel] !== undefined) updateData[db] = data[camel];
    });
    updateData.updated_at = new Date().toISOString();

    const { data: app, error } = await supabase
      .from('school_applications')
      .update(updateData)
      .eq('id', id)
      .eq('student_profile_id', profileId)
      .select('*')
      .single();

    if (error) throw error;
    return res.json({ success: true, application: app });
  } catch (err) {
    console.error('App update error:', err);
    return res.status(500).json({ error: 'Failed to update application' });
  }
}

async function handleAppDelete(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });
  const profileId = await getAuthProfile(req);
  if (!profileId) return res.status(401).json({ error: 'Unauthorized' });

  const appId = req.query.id;
  if (!appId) return res.status(400).json({ error: 'id is required' });

  try {
    const { error } = await supabase
      .from('school_applications')
      .delete()
      .eq('id', appId)
      .eq('student_profile_id', profileId);
    if (error) throw error;
    return res.json({ success: true });
  } catch (err) {
    console.error('App delete error:', err);
    return res.status(500).json({ error: 'Failed to delete application' });
  }
}

// ════════════════════════════════════════════════════════════
// Phase 2: Reminders
// ════════════════════════════════════════════════════════════

async function handleRemindersList(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const profileId = await getAuthProfile(req);
  if (!profileId) return res.json({ success: true, reminders: [] });

  try {
    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('student_id', profileId)
      .order('due_date', { ascending: true });
    if (error) throw error;
    return res.json({ success: true, reminders: reminders || [] });
  } catch (err) {
    console.error('Reminders list error:', err);
    return res.status(500).json({ error: 'Failed to load reminders' });
  }
}

async function handleReminderCreate(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const profileId = await getAuthProfile(req);
  if (!profileId) return res.status(401).json({ error: 'Unauthorized' });

  const { title, description, dueDate, reminderType, applicationId } = req.body || {};
  if (!title || !dueDate) return res.status(400).json({ error: 'title and dueDate are required' });

  try {
    const { data: reminder, error } = await supabase
      .from('reminders')
      .insert({
        student_id: profileId,
        title,
        description: description || '',
        due_date: dueDate,
        reminder_type: reminderType || 'other',
        application_id: applicationId || null,
      })
      .select('*')
      .single();
    if (error) throw error;
    return res.status(201).json({ success: true, reminder });
  } catch (err) {
    console.error('Reminder create error:', err);
    return res.status(500).json({ error: 'Failed to create reminder' });
  }
}

async function handleReminderComplete(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const profileId = await getAuthProfile(req);
  if (!profileId) return res.status(401).json({ error: 'Unauthorized' });

  const { id, completed } = req.body || {};
  if (!id) return res.status(400).json({ error: 'id is required' });

  try {
    const { error } = await supabase
      .from('reminders')
      .update({ is_completed: completed !== false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('student_id', profileId);
    if (error) throw error;
    return res.json({ success: true });
  } catch (err) {
    console.error('Reminder complete error:', err);
    return res.status(500).json({ error: 'Failed to update reminder' });
  }
}

async function handleReminderDelete(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });
  const profileId = await getAuthProfile(req);
  if (!profileId) return res.status(401).json({ error: 'Unauthorized' });

  const id = req.query.id;
  if (!id) return res.status(400).json({ error: 'id is required' });

  try {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id)
      .eq('student_id', profileId);
    if (error) throw error;
    return res.json({ success: true });
  } catch (err) {
    console.error('Reminder delete error:', err);
    return res.status(500).json({ error: 'Failed to delete reminder' });
  }
}

// ════════════════════════════════════════════════════════════
// Advisor Data: lưu thông tin từ form Tư vấn chọn trường
// ════════════════════════════════════════════════════════════

async function handleSaveAdvisorData(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];

  try {
    const profileId = await getProfileIdFromToken(token);
    if (!profileId) return res.status(404).json({ error: 'Profile not found' });

    const data = req.body || {};

    const { data: submission, error } = await supabase
      .from('student_advisor_submissions')
      .insert({
        student_profile_id: profileId,
        visa_type: data.visaType || 'D2-6',
        gender: data.gender || null,
        age: data.age || 0,
        gpa: data.gpa || null,
        absences: data.absences || 0,
        korean_level: data.korean || 'none',
        visa_fail: data.visaFail || 'no',
        region: data.region || 'any',
        budget: data.budget || 'medium',
        priorities: data.priorities || [],
        top_schools: data.topSchools ? JSON.parse(JSON.stringify(data.topSchools)) : null,
        analysis_result: data.analysisResult || null,
        source: data.source || 'advisor_form',
      })
      .select('id, created_at')
      .single();

    if (error) throw error;
    
    // Gửi thông báo Telegram cho admin
    try {
      await sendNewAdvisorSubmissionAlert({
        email: data.email || null,
        fullName: data.fullName || null,
        gender: data.gender,
        age: data.age,
        gpa: data.gpa,
        korean: data.korean,
        region: data.region,
        topSchools: data.topSchools || [],
      });
    } catch (notifErr) {
      // Silent fail — không để lỗi notification ảnh hưởng response
      console.warn('Send advisor notification error:', notifErr.message);
    }
    
    return res.status(201).json({ success: true, submission });
  } catch (err) {
    console.error('Save advisor data error:', err);
    return res.status(500).json({ error: 'Failed to save advisor data' });
  }
}

async function handleLoadAdvisorData(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];

  try {
    const profileId = await getProfileIdFromToken(token);
    if (!profileId) return res.json({ success: true, submissions: [] });

    const { data: submissions, error } = await supabase
      .from('student_advisor_submissions')
      .select('*')
      .eq('student_profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, submissions: submissions || [] });
  } catch (err) {
    console.error('Load advisor data error:', err);
    return res.status(500).json({ error: 'Failed to load advisor data' });
  }
}

// ════════════════════════════════════════════════════════════
// Phase 2: Document upload to Supabase Storage
// ════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════
// Phase 5: Chat History — save/load/clear
// ════════════════════════════════════════════════════════════

async function handleChatSave(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];

  try {
    const profileId = await getProfileIdFromToken(token);
    if (!profileId) return res.status(404).json({ error: 'Profile not found' });

    const { messages } = req.body || {};
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.json({ success: true, saved: 0 });
    }

    // Only save last 20 messages to avoid bloat
    const toSave = messages.slice(-20);
    
    // Delete old messages first (keep it clean)
    await supabase
      .from('student_chat_history')
      .delete()
      .eq('student_id', profileId);

    // Insert new messages
    const rows = toSave.map(function(m) {
      return {
        student_id: profileId,
        role: m.role === 'user' ? 'user' : 'assistant',
        content: typeof m.content === 'string' ? m.content.substring(0, 2000) : JSON.stringify(m.content).substring(0, 2000),
        tool_used: m.tool || '',
        metadata: m.metadata || {},
      };
    });

    const { error } = await supabase.from('student_chat_history').insert(rows);
    if (error) throw error;

    // Update last_active
    await supabase.from('student_profiles').update({ last_active: new Date().toISOString() }).eq('id', profileId);

    return res.json({ success: true, saved: rows.length });
  } catch (err) {
    console.error('Chat save error:', err);
    return res.status(500).json({ error: 'Failed to save chat' });
  }
}

async function handleChatLoad(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];

  try {
    const profileId = await getProfileIdFromToken(token);
    if (!profileId) return res.json({ success: true, messages: [] });

    const { data: rows, error } = await supabase
      .from('student_chat_history')
      .select('role, content, tool_used, metadata, created_at')
      .eq('student_id', profileId)
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) throw error;

    const messages = (rows || []).map(function(r) {
      return {
        role: r.role,
        content: r.content,
        tool: r.tool_used || '',
        metadata: r.metadata || {},
        createdAt: r.created_at,
      };
    });

    return res.json({ success: true, messages });
  } catch (err) {
    console.error('Chat load error:', err);
    return res.status(500).json({ error: 'Failed to load chat' });
  }
}

async function handleChatClear(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];

  try {
    const profileId = await getProfileIdFromToken(token);
    if (!profileId) return res.status(404).json({ error: 'Profile not found' });

    await supabase.from('student_chat_history').delete().eq('student_id', profileId);
    return res.json({ success: true });
  } catch (err) {
    console.error('Chat clear error:', err);
    return res.status(500).json({ error: 'Failed to clear chat' });
  }
}

// ════════════════════════════════════════════════════════════
// Phase 5: Login Log — ghi lại lần đăng nhập
// ════════════════════════════════════════════════════════════

async function handleLogLogin(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];

  try {
    const profileId = await getProfileIdFromToken(token);
    if (!profileId) return res.status(404).json({ error: 'Profile not found' });

    const { action } = req.body || {};
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '';

    await supabase.from('student_login_logs').insert({
      student_id: profileId,
      ip: ip,
      user_agent: (req.headers['user-agent'] || '').substring(0, 500),
      action: action || 'login',
    });

    // Update last_active and last_ip
    await supabase.from('student_profiles').update({
      last_active: new Date().toISOString(),
      last_ip: ip,
    }).eq('id', profileId);

    return res.json({ success: true });
  } catch (err) {
    console.error('Log login error:', err);
    return res.json({ success: true }); // Silent fail
  }
}

// ════════════════════════════════════════════════════════════
// Phase 5: Check Notifications — kiểm tra admin_note mới
// ════════════════════════════════════════════════════════════

async function handleCheckNotifications(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];

  try {
    const profileId = await getProfileIdFromToken(token);
    if (!profileId) return res.json({ success: true, notifications: [] });

    // Kiểm tra application nào có admin_note và status thay đổi
    const { data: apps, error } = await supabase
      .from('school_applications')
      .select('id, status, admin_note, updated_at')
      .eq('student_profile_id', profileId)
      .not('admin_note', 'is', null)
      .neq('admin_note', '')
      .order('updated_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    const notifications = (apps || []).map(function(a) {
      return {
        id: a.id,
        type: 'application_update',
        title: 'Admin đã cập nhật hồ sơ',
        message: a.admin_note,
        status: a.status,
        createdAt: a.updated_at,
      };
    });

    return res.json({ success: true, notifications });
  } catch (err) {
    console.error('Check notifications error:', err);
    return res.json({ success: true, notifications: [] });
  }
}

// ════════════════════════════════════════════════════════════
// Phase 2: Document upload to Supabase Storage
// ════════════════════════════════════════════════════════════

async function handleDocumentUpload(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const profileId = await getAuthProfile(req);
  if (!profileId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { docType, fileName, fileBase64 } = req.body || {};
    if (!docType || !fileBase64) return res.status(400).json({ error: 'docType and fileBase64 are required' });

    const bucketName = 'student-documents';
    const fileExt = (fileName || 'file').split('.').pop();
    const filePath = `${profileId}/${docType}_${Date.now()}.${fileExt}`;

    // Decode base64
    const buffer = Buffer.from(fileBase64, 'base64');

    let fileUrl = '';
    let uploadStatus = 'pending';
    let warning = '';

    try {
      // Try to upload
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, buffer, {
          contentType: 'application/octet-stream',
          upsert: true,
        });

      if (uploadError) {
        // Bucket might not exist yet — try to create it
        console.warn('Storage upload failed, trying to create bucket:', uploadError.message);
        
        try {
          const { data: buckets } = await supabase.storage.listBuckets();
          const exists = buckets && buckets.find(function(b) { return b.name === bucketName; });
          
          if (!exists) {
            const { error: createError } = await supabase.storage.createBucket(bucketName, {
              public: true,
              file_size_limit: 10485760, // 10MB
            });
            
            if (createError) {
              warning = 'Không thể tạo bucket storage: ' + createError.message + '. Vào Supabase Dashboard > Storage > tạo bucket "student-documents" (public).';
              uploadStatus = 'no_storage';
            } else {
              // Retry upload after creating bucket
              const { data: retryData, error: retryError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, buffer, {
                  contentType: 'application/octet-stream',
                  upsert: true,
                });
              
              if (retryError) {
                warning = 'Bucket đã được tạo nhưng upload vẫn thất bại: ' + retryError.message;
                uploadStatus = 'no_storage';
              } else {
                const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
                fileUrl = urlData?.publicUrl || '';
                uploadStatus = 'uploaded';
                warning = 'Bucket "student-documents" đã được tự động tạo.';
              }
            }
          } else {
            warning = 'Bucket đã tồn tại nhưng upload thất bại: ' + uploadError.message;
            uploadStatus = 'no_storage';
          }
        } catch (autoCreateErr) {
          console.warn('Auto-create bucket failed:', autoCreateErr.message);
          warning = 'Không thể tự động tạo bucket. Vào Supabase Dashboard > Storage > tạo bucket "student-documents" (public).';
          uploadStatus = 'no_storage';
        }
      } else {
        // Get public URL
        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        fileUrl = urlData?.publicUrl || '';
        uploadStatus = 'uploaded';
      }
    } catch (storageErr) {
      console.warn('Storage error:', storageErr.message);
      warning = 'Lỗi storage: ' + storageErr.message;
      uploadStatus = 'no_storage';
    }

    // Save to student_documents (always save metadata even if Storage fails)
    // Use select-then-insert/update instead of upsert (no unique constraint on student_id+doc_type)
    const { data: existingDoc } = await supabase
      .from('student_documents')
      .select('id')
      .eq('student_id', profileId)
      .eq('doc_type', docType)
      .maybeSingle();

    let doc;
    if (existingDoc) {
      const { data: updated, error: updateErr } = await supabase
        .from('student_documents')
        .update({
          file_url: fileUrl || '',
          file_name: fileName || '',
          file_size: buffer.length,
          status: uploadStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingDoc.id)
        .select('*')
        .single();
      if (updateErr) throw updateErr;
      doc = updated;
    } else {
      const { data: inserted, error: insertErr } = await supabase
        .from('student_documents')
        .insert({
          student_id: profileId,
          doc_type: docType,
          file_url: fileUrl || '',
          file_name: fileName || '',
          file_size: buffer.length,
          status: uploadStatus,
        })
        .select('*')
        .single();
      if (insertErr) throw insertErr;
      doc = inserted;
    }

    if (uploadStatus === 'no_storage') {
      return res.json({
        success: true,
        document: doc,
        fileUrl: '',
        warning: warning || 'File đã được lưu thông tin nhưng chưa upload lên Storage. Vào Supabase Dashboard > Storage > tạo bucket "student-documents" (public) để upload hoạt động.'
      });
    }

    const result = { success: true, document: doc, fileUrl };
    if (warning) result.warning = warning;
    return res.json(result);
  } catch (err) {
    console.error('Document upload error:', err);
    return res.status(500).json({ error: 'Upload thất bại: ' + (err.message || 'Lỗi không xác định') });
  }
}
