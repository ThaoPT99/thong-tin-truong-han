/**
 * Seed admin user vào Supabase
 * Chạy: node scripts/seed-admin.js
 * Tạo user admin đầu tiên để đăng nhập vào Admin UI
 */
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || 'db.lzggxhunbnjrklbkywmb.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.DATABASE_PASSWORD,
  ssl: { rejectUnauthorized: false },
};

async function seed() {
  const email = process.env.ADMIN_EMAIL || 'admin@thongtintruonghan.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const displayName = 'Admin';

  const client = new Client(DB_CONFIG);
  await client.connect();
  console.log('✅ Connected to database');

  // Check if user exists
  const existing = await client.query('SELECT id, email FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    console.log(`ℹ️  User already exists: ${email}`);
    // Update password
    const hash = await bcrypt.hash(password, 10);
    await client.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE email = $2',
      [hash, email]
    );
    console.log(`✅ Password updated for: ${email}`);
  } else {
    const hash = await bcrypt.hash(password, 10);
    await client.query(
      `INSERT INTO users (email, password_hash, display_name, role)
       VALUES ($1, $2, $3, 'admin')`,
      [email, hash, displayName]
    );
    console.log(`✅ Admin user created: ${email}`);
  }

  console.log(`   Password: ${password}`);
  console.log('');

  // Verify
  const verify = await client.query('SELECT id, email, role FROM users WHERE email = $1', [email]);
  console.log(`   User ID: ${verify.rows[0].id}`);
  console.log(`   Role: ${verify.rows[0].role}`);

  await client.end();
}

seed().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
