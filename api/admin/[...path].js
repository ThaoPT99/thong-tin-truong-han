// /api/admin/[...path].js — Catch-all: handles ALL /api/admin/* routes
// Consolidates 7 individual handlers into 1 function to stay under Vercel Hobby's 12-function limit.
const accessControl = require('../../lib/admin/access-control');
const cases = require('../../lib/admin/cases');
const checklist = require('../../lib/admin/checklist');
const importHandler = require('../../lib/admin/import');
const schools = require('../../lib/admin/schools');
const semesters = require('../../lib/admin/semesters');
const students = require('../../lib/admin/students');
const users = require('../../lib/admin/users');

module.exports = async (req, res) => {
  // Set CORS headers for all admin routes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const path = (req.query.path || [])[0] || '';

  switch (path) {
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
      return res.status(404).json({ error: 'Unknown admin route: ' + path });
  }
};
