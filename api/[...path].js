// /api/[...path].js — Catch-all: handles ALL /api/admin/* routes
// Vercel doesn't properly support [...path].js in subdirectories (like api/admin/[...path].js),
// so we put the catch-all at the root api/ level instead. Specific routes like
// api/auth/[action].js, api/schools/index.js take priority over this catch-all.
//
// Only unmatched routes (like /api/admin/*) fall through to this handler.
const accessControl = require('../lib/admin/access-control');
const cases = require('../lib/admin/cases');
const checklist = require('../lib/admin/checklist');
const importHandler = require('../lib/admin/import');
const schools = require('../lib/admin/schools');
const semesters = require('../lib/admin/semesters');
const students = require('../lib/admin/students');
const users = require('../lib/admin/users');

module.exports = async (req, res) => {
  // Set CORS headers for all admin routes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // req.query.path comes from [...path] catch-all segments
  // e.g. /api/admin/users → ['admin', 'users']
  const segments = req.query.path || [];
  const first = (segments[0] || '').toLowerCase();

  // Only handle /api/admin/* routes — everything else falls through
  if (first !== 'admin') {
    return res.status(404).json({ error: 'Not found: ' + (segments.join('/') || '(empty)') });
  }

  // Route name is the second segment: 'users', 'students', 'cases', etc.
  const route = segments[1] || '';

  switch (route) {
    case 'access-control':
    case 'access-logs':
    case 'access-export':
      return accessControl(req, res);
    case 'cases':
      return cases(req, res);
    case 'checklist':
      return checklist(req, res);
    case 'import':
      return importHandler(req, res);
    case 'schools':
      return schools(req, res);
    case 'semesters':
      return semesters(req, res);
    case 'students':
      return students(req, res);
    case 'users':
      return users(req, res);
    default:
      return res.status(404).json({ error: 'Unknown admin route: ' + route });
  }
};
