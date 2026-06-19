// Access Control Middleware — Vercel Edge Runtime (Web APIs chuẩn)
// Chạy tại Edge (Vercel) mà không phụ thuộc Next.js

// In-memory cache
let rulesCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 phút

// Supabase client (init lazy để tránh lỗi build)
let supabase = null;

function getSupabase() {
  if (supabase) return supabase;
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  supabase = require('@supabase/supabase-js').createClient(supabaseUrl, supabaseKey);
  return supabase;
}

async function getRules() {
  const now = Date.now();
  if (rulesCache && (now - cacheTimestamp) < 60000) {
    return rulesCache;
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('access_control')
    .select('type, value, is_active')
    .eq('is_active', true);

  if (error) {
    console.error('Access control fetch error:', error);
    return rulesCache || { passwords: [], ips: [], emails: [] };
  }

  const passwords = [];
  const ips = [];
  const emails = [];

  for (const rule of data || []) {
    if (rule.type === 'password') passwords.push(rule.value);
    else if (rule.type === 'ip_allowlist') ips.push(rule.value);
    else if (rule.type === 'email_allowlist') emails.push(rule.value.toLowerCase());
  }

  rulesCache = { passwords, ips, emails };
  cacheTimestamp = Date.now();
  return rulesCache;
}

function ipMatchesCIDR(ip, cidr) {
  if (!cidr.includes('/')) return ip === cidr;
  const [rangeIp, bits] = cidr.split('/');
  const mask = parseInt(bits, 10);
  if (isNaN(mask)) return ip === cidr;
  
  const ipParts = ip.split('.').map(Number);
  const rangeParts = rangeIp.split('.').map(Number);
  if (ipParts.length !== 4 || rangeParts.length !== 4) return false;
  
  const maskNum = ~((1 << (32 - mask)) - 1);
  const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
  const rangeNum = (rangeParts[0] << 24) | (rangeParts[1] << 16) | (rangeParts[2] << 8) | rangeParts[3];
  
  return (ipNum & maskNum) === (rangeNum & maskNum);
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Skip paths
  const skipPaths = [
    '/api/auth',
    '/api/admin/access-control',
    '/api/admin/access-logs',
    '/_next',
    '/_vercel',
    '/favicon.ico',
    '/manifest.json',
    '/robots.txt',
  ];
  
  if (skipPaths.some(p => pathname.startsWith(p))) {
    return;
  }

  // Skip static files (non-capturing group)
  if (pathname.match(/\.(?:ico|png|jpg|jpeg|gif|svg|css|js|woff2?)$/)) {
    return;
  }

  try {
    const { passwords, ips, emails } = await getRules();
    
    // No active rules -> allow
    if (!passwords.length && !ips.length && !emails.length) {
      return;
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
    const ua = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    
    // Parse cookies
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = cookieHeader.split('; ').reduce((acc, c) => {
      const [k, v] = c.split('=');
      acc[k] = v;
      return acc;
    }, {});

    // Check password cookie
    const passwordCookie = cookies.site_access;
    const passwordValid = passwords.length > 0 && passwords.some(p => p === cookies.site_access);
    
    // Check IP allowlist
    let ipAllowed = false;
    for (const allowedIp of ips) {
      if (ipMatchesCIDR(ip, allowedIp)) {
        ipAllowed = true;
        break;
      }
    }
    
    // Check email allowlist
    const emailCookie = cookies.user_email;
    const emailParam = new URL(request.url).searchParams.get('email');
    const email = (emailParam || emailCookie || '').toLowerCase();
    const emailAllowed = emails.length > 0 && emails.includes(email);
    
    // Check password cookie
    const passwordCookie = cookies.site_access;
    const passwordValid = passwords.length > 0 && passwords.some(p => p === cookies.site_access);
    
    // Decision
    let allowed = false;
    let reason = '';
    
    if (passwordValid) {
      allowed = true; reason = 'password';
    } else if (ipAllowed) {
      allowed = true; reason = 'ip_allowlist';
    } else if (emailAllowed) {
      allowed = true; reason = 'email_allowlist';
    }
    
    // Log access
    const status = allowed ? 200 : 403;
    const blocked = !allowed;
    const reasonText = allowed ? `allowed:${reason}` : 'blocked:no_valid_auth';
    
    // Async log (fire and forget)
    logAccess({
      ip,
      user_agent: request.headers.get('user-agent') || '',
      path: new URL(request.url).pathname,
      method: request.method,
      status,
      blocked,
      reason: reasonText,
    }).catch(() => {});
    
    if (!allowed) {
      // Return 403 Response
      return new Response(
        JSON.stringify({ 
          error: 'Truy cập bị từ chối. Sản phẩm riêng tư - cần xác thực.', 
          code: 'ACCESS_DENIED' 
        }), 
        { 
          status: 403, 
          headers: { 'Content-Type': 'application/json' }
        });
    }
    
    return;
  } catch (err) {
    console.error('Access control middleware error:', err);
    return;
  }
}

async function logAccess(data) {
  try {
    const supabase = require('@supabase/supabase-js').createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
    );
    await supabase.from('access_logs').insert({
      ...data,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Log access error:', e);
  }
}

export const config = {
  matcher: [
    '/((?!api/auth|api/admin/access-control|api/admin/access-logs|_next|_vercel|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|svg|css|js|woff2?)$).*)',
  ],
}