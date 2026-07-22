// /api/admin-handler.js — Consolidated handler for ALL /api/admin/* routes
// Vercel rewrites in vercel.json forward /api/admin/:path* to this handler
// with ?route=:path* so we can extract the admin route from req.query.route.
const accessControl = require('../lib/admin/access-control');
const cases = require('../lib/admin/cases');
const checklist = require('../lib/admin/checklist');
const importHandler = require('../lib/admin/import');
const schools = require('../lib/admin/schools');
const semesters = require('../lib/admin/semesters');
const students = require('../lib/admin/students');
const users = require('../lib/admin/users');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // The rewrite sets ?route=cases or ?route=students etc.
  // For path-based IDs like /api/admin/schools/UUID, route becomes 'schools/UUID'
  // We split off the first segment as the route name, and the rest as path ID.
  const routeParts = (req.query.route || '').split('/');
  const route = routeParts[0];

  // If there's a second path segment (e.g., UUID from /api/admin/schools/UUID),
  // inject it into req.query.id so the downstream handler can find it.
  if (routeParts.length > 1 && !req.query.id) {
    req.query.id = routeParts.slice(1).join('/');
  }

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
      return res.status(404).json({ error: 'Unknown admin route: ' + (route || '(empty)') });
  }
};
