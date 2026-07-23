// Auth helpers — JWT sign/verify + middleware
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn('⚠️  CẢNH BÁO: JWT_SECRET chưa được set trong biến môi trường! Admin login (sign/verify) sẽ bị crash do thiếu secret.');
}
const JWT_EXPIRES_IN = '24h';

/** Sign a JWT for the given user */
function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/** Extract cookie value from Cookie header */
function getCookie(req, name) {
  const cookieHeader = req.headers.cookie || req.headers['Cookie'] || '';
  const cookies = cookieHeader.split(';').reduce((acc, c) => {
    const [k, ...v] = c.trim().split('=');
    if (k) acc[k.trim()] = v.join('=');
    return acc;
  }, {});
  return cookies[name] || null;
}

/** Express-style middleware: verify Authorization header (fallback to admin_token cookie) */
function requireAdmin(handler) {
  return async (req, res) => {
    try {
      // Try Authorization header first
      let token = null;
      const auth = req.headers.authorization || req.headers['Authorization'];
      if (auth && auth.startsWith('Bearer ')) {
        token = auth.split(' ')[1];
      }

      // Fallback: try admin_token cookie (HttpOnly cookie set on login)
      if (!token) {
        token = getCookie(req, 'admin_token');
      }

      if (!token) {
        return res.status(401).json({ error: 'Missing authorization token' });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return await handler(req, res);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      // Include error detail for debugging (only visible in server logs)
      console.error('requireAdmin error:', err.message);
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

/** Middleware: require specific roles (also fallback to admin_token cookie) */
function requireRole(...allowedRoles) {
  return (handler) => async (req, res) => {
    try {
      // Try Authorization header first
      let token = null;
      const auth = req.headers.authorization || req.headers['Authorization'];
      if (auth && auth.startsWith('Bearer ')) {
        token = auth.split(' ')[1];
      }

      // Fallback: try admin_token cookie
      if (!token) {
        token = getCookie(req, 'admin_token');
      }

      if (!token) {
        return res.status(401).json({ error: 'Missing authorization token' });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient role' });
      }
      req.user = decoded;
      return await handler(req, res);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      console.error('requireRole error:', err.message);
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

module.exports = { signToken, requireAdmin, requireRole };
