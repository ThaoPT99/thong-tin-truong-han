// Access Control Middleware — Enforce access rules from DB
// Chạy tại Edge (Vercel) để hiệu năng tốt nhất

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Cache rules để tránh query DB mỗi request
let rulesCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 phút

async function getRules() {
  const now = Date.now();
  if (rulesCache && (now - cacheTimestamp) < CACHE_TTL) {
    return rulesCache;
  }

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
  cacheTimestamp = now;
  return rulesCache;
}

function ipMatchesCIDR(ip, cidr) {
  if (!cidr.includes('/')) return ip === cidr;
  // Simple CIDR check - production nên dùng library ip-cidr
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

export async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Bỏ qua các path không cần check
  const skipPaths = [
    '/api/auth',
    '/api/admin/access-control',
    '/_next',
    '/_vercel',
    '/favicon.ico',
    '/manifest.json',
    '/robots.txt',
  ];
  
  if (skipPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Skip static files
  if (pathname.match(/\.(?:ico|png|jpg|jpeg|gif|svg|css|js|woff2?)$/)) {
    return NextResponse.next();
  }

  try {
    const { passwords, ips, emails } = await getRules();
    
    // Nếu không có rule nào active -> cho qua
    if (!passwords.length && !ips.length && !emails.length) {
      return NextResponse.next();
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
    const ua = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    
    // Kiểm tra cookies/session
    const cookies = request.headers.get('cookie') || '';
    const accessCookie = cookies.split('; ').find(c => c.startsWith('site_access='));
    const hasValidCookie = accessCookie && passwords.some(p => accessCookie.includes(p));
    
    // Kiểm tra IP allowlist
    let ipAllowed = false;
    for (const allowedIp of ips) {
      if (ipMatchesCIDR(ip, allowedIp)) {
        ipAllowed = true;
        break;
      }
    }
    
    // Kiểm tra email allowlist (trong cookie hoặc query)
    const url = new URL(request.url);
    const emailParam = url.searchParams.get('email');
    const emailCookie = cookies.split('; ').find(c => c.startsWith('user_email='));
    const email = (emailParam || emailCookie?.split('=')[1] || '').toLowerCase();
    const emailAllowed = emails.length > 0 && emails.includes(email);
    
    // Kiểm tra password cookie
    const passwordCookie = cookies.split('; ').find(c => c.startsWith('site_access='));
    const passwordValid = passwordCookie && passwords.some(p => passwordCookie.includes(p));
    
    // Quyết định cho phép
    let allowed = false;
    let reason = '';
    
    if (hasValidCookie || passwordValid) {
      allowed = true;
      reason = 'valid_password_cookie';
    } else if (ipAllowed) {
      allowed = true;
      reason = 'ip_allowlist';
    } else if (emailAllowed) {
      allowed = true;
      reason = 'email_allowlist';
    }
    
    // Log access
    const status = allowed ? 200 : 403;
    const blocked = !allowed;
    const reasonText = allowed ? `allowed:${reason}` : `blocked:no_valid_auth`;
    
    // Async log (fire and forget)
    logAccess({
      ip,
      user_agent: ua,
      path: pathname,
      method: request.method,
      status,
      blocked,
      reason: reasonText,
    }).catch(() => {});
    
    if (!allowed) {
      // Nếu là API request -> trả JSON
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ 
          error: 'Truy cập bị từ chối. Sản phẩm riêng tư - cần xác thực.', 
          code: 'ACCESS_DENIED' 
        }, { status: 403 });
      }
      
      // HTML page -> hiển thị trang nhập password
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname + url.search);
      return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
  } catch (err) {
    console.error('Access control middleware error:', err);
    // Fail open - nếu middleware lỗi thì cho qua để không block user thật
    return NextResponse.next();
  }
}

// Async log function (fire and forget)
async function logAccess(data) {
  try {
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
    '/((?!api/auth|_next|_vercel|favicon.ico|.*\\.(ico|png|jpg|jpeg|gif|svg|css|js|woff2?)$).*)',
  ],
}