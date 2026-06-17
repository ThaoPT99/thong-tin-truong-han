// Database connection pool — dùng cho Vercel Functions
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'db.lzggxhunbnjrklbkywmb.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.DATABASE_PASSWORD,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected pool error:', err.message);
});

module.exports = { pool };
