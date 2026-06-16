// GET /api/auth/verify
const { requireAdmin } = require('../../lib/auth');

module.exports = requireAdmin(async (req, res) => {
  return res.json({
    valid: true,
    user: req.user,
  });
});
