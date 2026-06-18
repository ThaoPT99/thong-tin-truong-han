// GET/POST/PUT/DELETE /api/admin/users — quản lý tài khoản admin
// Chỉ director mới được truy cập
const { requireAdmin } = require('../../lib/auth');
const { supabase } = require('../../lib/supabase');
const bcrypt = require('bcryptjs');

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Chỉ director được quản lý user
  if (req.user?.role !== 'director') {
    return res.status(403).json({ error: 'Forbidden: only director can manage users' });
  }

  const { id } = req.query;

  try {
    // ─── GET: Danh sách users ───
    if (req.method === 'GET') {
      if (id) {
        // Lấy chi tiết 1 user (không trả về password_hash)
        const { data, error } = await supabase
          .from('users')
          .select('id, email, display_name, role, is_active, last_login, created_at, updated_at')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'User not found' });
        return res.json({ success: true, data });
      }

      // Danh sách tất cả
      const { data, error } = await supabase
        .from('users')
        .select('id, email, display_name, role, is_active, last_login, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.json({ success: true, data: data || [] });
    }

    // ─── POST: Tạo user mới ───
    if (req.method === 'POST') {
      const body = req.body || {};
      const { email, password, display_name, role, is_active } = body;

      if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
      }

      // Validate role
      const allowedRoles = ['director', 'sale', 'admin'];
      const userRole = role || 'sale';
      if (!allowedRoles.includes(userRole)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      // Check duplicate email
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .limit(1);

      if (existing && existing.length > 0) {
        return res.status(409).json({ error: 'Email already exists' });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      const { data, error } = await supabase
        .from('users')
        .insert({
          email: email.toLowerCase().trim(),
          password_hash,
          display_name: display_name || '',
          role: userRole,
          is_active: is_active !== false,
        })
        .select('id, email, display_name, role, is_active, created_at')
        .single();

      if (error) throw error;

      return res.status(201).json({ success: true, data });
    }

    // ─── PUT: Cập nhật user (đổi mật khẩu, role, status, display_name) ───
    if (req.method === 'PUT') {
      if (!id) return res.status(400).json({ error: 'User ID is required' });

      // Không cho tự đổi role của chính mình (tránh lockout)
      if (id === req.user.id) {
        return res.status(400).json({ error: 'Cannot modify your own account via this API' });
      }

      const body = req.body || {};
      const updateData = {};
      const allowedRoles = ['director', 'sale', 'admin'];

      if (body.display_name !== undefined) updateData.display_name = body.display_name;
      if (body.role !== undefined) {
        if (!allowedRoles.includes(body.role)) {
          return res.status(400).json({ error: 'Invalid role' });
        }
        updateData.role = body.role;
      }
      if (body.is_active !== undefined) updateData.is_active = body.is_active;
      if (body.password && body.password.length >= 6) {
        updateData.password_hash = await bcrypt.hash(body.password, 10);
      }
      updateData.updated_at = new Date().toISOString();

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select('id, email, display_name, role, is_active, updated_at')
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'User not found' });

      return res.json({ success: true, data });
    }

    // ─── DELETE: Xóa user ───
    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'User ID is required' });

      // Không cho tự xóa chính mình
      if (id === req.user.id) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      // Không cho xóa director cuối cùng
      const { data: target } = await supabase
        .from('users')
        .select('role')
        .eq('id', id)
        .maybeSingle();

      if (!target) return res.status(404).json({ error: 'User not found' });
      if (target.role === 'director') {
        const { count } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'director')
          .eq('is_active', true);
        if (count <= 1) {
          return res.status(400).json({ error: 'Cannot delete the last active director' });
        }
      }

      const { error: delErr } = await supabase.from('users').delete().eq('id', id);
      if (delErr) throw new Error(delErr.message);
      return res.json({ success: true, message: 'User deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('/api/admin/users error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});