// error-logger.js — Ghi log lỗi vào Supabase để monitoring
// Dùng trong tất cả API endpoints để bắt lỗi và ghi lại
const { supabase } = require('./supabase');

/**
 * Ghi lỗi vào bảng error_logs.
 * 
 * @param {string} level - 'error' | 'warn' | 'info'
 * @param {string|Error} message - Thông báo lỗi hoặc Error object
 * @param {object} [context] - Thông tin bổ sung (method, path, body, ...)
 * @param {string} [ip] - Địa chỉ IP (nếu có)
 * @param {string} [userAgent] - User agent (nếu có)
 * @returns {Promise<void>}
 */
async function logError(level, message, context = {}, ip = null, userAgent = null) {
  try {
    // Nếu message là Error object, lấy stack trace
    let msg = message;
    let stack = null;
    if (message instanceof Error) {
      msg = message.message;
      stack = message.stack;
    }

    // Giới hạn độ dài để không gửi quá nhiều dữ liệu
    if (typeof msg === 'string' && msg.length > 2000) {
      msg = msg.substring(0, 2000);
    }
    if (stack && stack.length > 5000) {
      stack = stack.substring(0, 5000);
    }

    // Lấy path/method từ context nếu có
    const path = context.path || null;
    const method = context.method || null;

    // Xoá path/method khỏi context để không trùng
    const cleanContext = { ...context };
    delete cleanContext.path;
    delete cleanContext.method;

    const { error } = await supabase.from('error_logs').insert({
      level,
      message: msg,
      stack,
      context: Object.keys(cleanContext).length > 0 ? cleanContext : null,
      ip: ip || null,
      user_agent: userAgent || null,
      path,
      method,
    });

    if (error) {
      console.error('Failed to write error_log:', error.message);
    }
  } catch (err) {
    // Tuyệt đối không throw — tránh loop lỗi
    console.error('Error logger failed:', err);
  }
}

/**
 * Ghi lỗi server (level=error). Dùng trong catch blocks.
 */
async function logServerError(err, context = {}, req = null) {
  const ip = req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim()
    || req?.headers?.['x-real-ip']
    || req?.connection?.remoteAddress
    || null;
  const userAgent = req?.headers?.['user-agent'] || null;

  return await logError('error', err, {
    ...context,
    path: req?.url || context.path,
    method: req?.method || context.method,
  }, ip, userAgent);
}

/**
 * Ghi cảnh báo (level=warn). Dùng cho các vấn đề không nghiêm trọng.
 */
async function logWarn(message, context = {}) {
  return await logError('warn', message, context);
}

/**
 * Ghi thông tin (level=info). Dùng cho audit log.
 */
async function logInfo(message, context = {}) {
  return await logError('info', message, context);
}

module.exports = {
  logError,
  logServerError,
  logWarn,
  logInfo,
};
