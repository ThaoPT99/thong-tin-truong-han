// Access Control Middleware — Vercel Edge Runtime (Web APIs chuẩn)
// Chạy tại Edge (Vercel) - dùng fetch trực tiếp đến Supabase REST API
// Logic: ALLOW BY DEFAULT, chỉ chặn khi có rule BLOCK khớp
// Director bypass IP blocking

// In-memory cache
let rulesCache: { blockPasswords: string[]; blockIps: string[]; blockEmails: string[] } | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 phút

// Supabase config
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET || 'default-secret-change-me';

// Simple JWT decode (no verification, just payload extraction)
function decodeJWT(token: string): { role?: string; exp?: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// Check if user is director from cookies OR Authorization header
function isDirectorFromRequest(request: Request): boolean {
  // First check cookies
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = cookieHeader.split('; ').reduce((acc: Record<string, string>, c) => {
    const [k, v] = c.split('=');
    acc[k] = v;
    return acc;
  }, {});
  
  // Check cookies first
  const adminTokenFromCookie = cookies.admin_token || cookies.auth_token || cookies.token;
  if (adminTokenFromCookie) {
    const payload = decodeJWT(adminTokenFromCookie);
    if (payload && (!payload.exp || payload.exp * 1000 >= Date.now()) && payload.role === 'director') {
      return true;
    }
  }
  
  // Fallback: check Authorization header (Bearer token)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = decodeJWT(token);
    if (payload && (!payload.exp || payload.exp * 1000 >= Date.now()) && payload.role === 'director') {
      return true;
    }
  }
  
  return false;
}

async function getRules(): Promise<{ blockPasswords: string[]; blockIps: string[]; blockEmails: string[] }> {
  const now = Date.now();
  if (rulesCache && (now - cacheTimestamp) < 60000) {
    return rulesCache;
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/access_control?type=in.(block_password,block_ip,block_email)&is_active=eq.true&select=type,value`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Accept': 'application/json',
      },
    }
  );

  if (!res.ok) {
    console.error('Access control fetch error:', await res.text());
    return { blockPasswords: [], blockIps: [], blockEmails: [] };
  }

  // Fix: use unknown type then cast properly
  const rawData = await res.json() as unknown;
  const data = Array.isArray(rawData) ? rawData as Array<{ type: string; value: string }> : [];
  
  const blockPasswords: string[] = [];
  const blockIps: string[] = [];
  const blockEmails: string[] = [];

  for (const rule of data) {
    if (rule.type === 'block_password') blockPasswords.push(rule.value);
    else if (rule.type === 'block_ip') blockIps.push(rule.value);
    else if (rule.type === 'block_email') blockEmails.push(rule.value.toLowerCase());
  }

  rulesCache = { blockPasswords, blockIps, blockEmails };
  cacheTimestamp = Date.now();
  return rulesCache;
}

function ipMatchesCIDR(ip: string, cidr: string): boolean {
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

export default async function middleware(request: Request): Promise<Response | void> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Skip paths
  const skipPaths = [
    '/api/auth',
    '/api/telegram',
    '/api/admin/access-control',
    '/api/admin/access-logs',
    '/admin/login',
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
    // Parse cookies first (needed for director check)
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = cookieHeader.split('; ').reduce((acc: Record<string, string>, c) => {
      const [k, v] = c.split('=');
      acc[k] = v;
      return acc;
    }, {});

    // Check if user is director - if so, bypass IP blocking
    const isDirector = isDirectorFromRequest(request);
    
    const { blockPasswords, blockIps, blockEmails } = await getRules();
    
    // No active block rules -> ALLOW ALL
    if (!blockPasswords.length && !blockIps.length && !blockEmails.length) {
      return;
    }

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
    const ua = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    
    // Check block rules
    let blocked = false;
    let reason = '';
    
    // Check block password
    const siteAccessCookie = cookies?.site_access;
    if (blockPasswords.length > 0 && siteAccessCookie && blockPasswords.includes(siteAccessCookie)) {
      blocked = true; reason = 'blocked_password';
    }
    
    // Check IP blocklist (skip if director)
    let ipBlocked = false;
    if (!isDirector) {
      for (const blockedIp of blockIps) {
        if (ipMatchesCIDR(clientIp, blockedIp)) {
          ipBlocked = true;
          break;
        }
      }
    }
    if (ipBlocked) {
      blocked = true; reason = 'blocked_ip';
    }
    
    // Check email blocklist
    const emailParam = new URL(request.url).searchParams.get('email');
    const email = (emailParam || cookies?.user_email || '').toLowerCase();
    if (blockEmails.length > 0 && email && blockEmails.includes(email)) {
      blocked = true; reason = 'blocked_email';
    }
    
    // Decision
    const allowed = !blocked;
    const status = allowed ? 200 : 403;
    const blockedFlag = !allowed;
    const reasonText = allowed ? 'allowed:default' : `blocked:${reason || 'unknown'}`;
    
    // Log access (fire and forget)
    logAccess({
      ip: clientIp,
      user_agent: request.headers.get('user-agent') || '',
      path: new URL(request.url).pathname,
      method: request.method,
      status,
      blocked: blockedFlag,
      reason: reasonText,
    }).catch(() => {});
    
    if (!allowed) {
      // Nếu là API request -> trả JSON
      if (pathname.startsWith('/api/')) {
        return new Response(
          JSON.stringify({ 
            error: 'Truy cập bị chặn bởi admin.', 
            code: 'ACCESS_BLOCKED',
            reason: reason
          }), 
          { 
            status: 403, 
            headers: { 'Content-Type': 'application/json' }
          });
      }
      
      // HTML page -> trả trang "404 not found" (KHÔNG redirect login)
      const blockedHtml = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 Not Found</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #a5a5a5 0%, #ffffff 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .container {
      background: white;
      border-radius: 16px;
      padding: 48px 40px;
      max-width: 420px;
      width: 90%;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
      text-align: center;
    }
    .icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      color: white;
      font-size: 36px;
    }
    h1 { color: #1e3a5f; font-size: 28px; font-weight: 700; margin-bottom: 12px; }
    p { color: #6b7280; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
    .footer { margin-top: 32px; color: #9ca3af; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
    <h1>404 Not Found</h1>
    <p>Trang bạn tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.</p>
    
    <div class="footer"></div>
  </div>
</body>
</html>
      `;
      return new Response(blockedHtml, {
        status: 200, // Vẫn trả 200 để không trigger error monitoring
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    return;
  } catch (err) {
    console.error('Access control middleware error:', err);
    // Fail open - nếu middleware lỗi thì cho qua
    return;
  }
}

async function logAccess(data: Record<string, unknown>): Promise<void> {
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL}/rest/v1/access_logs`,
      {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          ...data,
          created_at: new Date().toISOString(),
        }),
      });
  } catch (e) {
    console.error('Log access error:', e);
  }
}

export const config = {
  matcher: [
    '/((?!api/auth|api/telegram|api/admin/access-control|api/admin/access-logs|_next|_vercel|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|svg|css|js|woff2?)$).*)',
  ],
}