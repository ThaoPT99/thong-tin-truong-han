// Access Control Middleware — Vercel Edge Runtime (Web APIs chuẩn)
// Chạy tại Edge (Vercel) - dùng fetch trực tiếp đến Supabase REST API
// Logic: ALLOW BY DEFAULT, chỉ chặn khi có rule BLOCK khớp

// In-memory cache
let rulesCache: { blockPasswords: string[]; blockIps: string[]; blockEmails: string[] } | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 phút

// Supabase config
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

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

  const data: Array<{ type: string; value: string }> = await res.json();
  const blockPasswords: string[] = [];
  const blockIps: string[] = [];
  const blockEmails: string[] = [];

  for (const rule of data || []) {
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
    const { blockPasswords, blockIps, blockEmails } = await getRules();
    
    // No active block rules -> ALLOW ALL
    if (!blockPasswords.length && !blockIps.length && !blockEmails.length) {
      return;
    }

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
    const ua = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    
    // Parse cookies
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = cookieHeader.split('; ').reduce((acc: Record<string, string>, c) => {
      const [k, v] = c.split('=');
      acc[k] = v;
      return acc;
    }, {});

    // Check block rules
    let blocked = false;
    let reason = '';
    
    // Check block password
    const siteAccessCookie = cookies?.site_access;
    if (blockPasswords.length > 0 && siteAccessCookie && blockPasswords.includes(siteAccessCookie)) {
      blocked = true; reason = 'blocked_password';
    }
    
    // Check IP blocklist
    let ipBlocked = false;
    for (const blockedIp of blockIps) {
      if (ipMatchesCIDR(clientIp, blockedIp)) {
        ipBlocked = true;
        break;
      }
    }
    if (ipBlocked) {
      blocked = true; reason = 'blocked_ip';
    }
    
    // Check email blocklist
    const emailParam = new URL(request.url).searchParams.get('email');
    const emailCookie = cookies?.user_email;
    const email = (emailParam || emailCookie || '').toLowerCase();
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
      
      // HTML page -> redirect to login/blocked page
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('blocked', 'true');
      loginUrl.searchParams.set('reason', reason);
      loginUrl.searchParams.set('redirect', new URL(request.url).pathname + url.search);
      return Response.redirect(loginUrl, 302);
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

export const config = {
  matcher: [
    '/((?!api/auth|api/admin/access-control|api/admin/access-logs|_next|_vercel|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|svg|css|js|woff2?)$).*)',
  ],
}