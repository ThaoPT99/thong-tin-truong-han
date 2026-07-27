/**
 * Seed a sale user for CRM testing
 * Chạy: node scripts/seed-sale-user.js
 * Tạo user sale để test phân quyền CRM
 */
const bcrypt = require('bcryptjs');
const { supabase } = require('../lib/supabase');

async function seed() {
  const email = 'sale@thongtintruonghan.com';
  const password = 'Sale@123';
  const displayName = 'Sale CRM';
  const role = 'sale';

  console.log('✅ Connected to Supabase');

  // Check if user exists
  const { data: existing } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('email', email)
    .single();

  if (existing) {
    console.log(`ℹ️  User already exists: ${email} (role: ${existing.role})`);
    const hash = await bcrypt.hash(password, 10);
    const { error } = await supabase
      .from('users')
      .update({ password_hash: hash, role, updated_at: new Date().toISOString() })
      .eq('email', email);
    if (error) throw error;
    console.log(`✅ Updated role to 'sale' and password for: ${email}`);
  } else {
    const hash = await bcrypt.hash(password, 10);
    const { error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: hash,
        display_name: displayName,
        role,
        is_active: true,
      });
    if (error) throw error;
    console.log(`✅ Sale user created: ${email}`);
  }

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 THÔNG TIN ĐĂNG NHẬP SALE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Email:    ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Role:     ${role}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('👉 Đăng nhập tại: https://thongtintruonghan.vercel.app/admin/login');
  console.log('   Sau khi đăng nhập, chỉ thấy sidebar CRM và Students.');
  console.log('   Các trang khác (Dashboard, Cases, News...) sẽ tự động redirect.');

  // Verify
  const { data: verify } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('email', email)
    .single();

  if (verify) {
    console.log(`   User ID: ${verify.id}`);
    console.log(`   Role:    ${verify.role}`);
  }

  await supabase.auth.signOut();
}

seed().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
