// GET /api/knowledge-base?action=list|search|get|faq
// Endpoint phục vụ Knowledge Base page + FAQ

const { KB_ARTICLES, KB_FAQ, KB_CATEGORIES } = require('../lib/knowledge-base');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { action, category, q } = req.query;

  try {
    switch (action) {
      case 'list':
        return handleList(req, res);
      case 'search':
        return handleSearch(req, res);
      case 'get':
        return handleGet(req, res);
      case 'faq':
        return handleFaq(req, res);
      case 'categories':
        return res.json({ success: true, categories: KB_CATEGORIES });
      default:
        return res.status(404).json({ error: 'Unknown action' });
    }
  } catch (err) {
    console.error('/api/knowledge-base error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ─── List articles (optionally by category) ───
function handleList(req, res) {
  const { category } = req.query;
  let articles = KB_ARTICLES;

  if (category && category !== 'all') {
    articles = articles.filter(a => a.category === category);
  }

  // Return only metadata (no full content) for list view
  const summary = articles.map(a => ({
    id: a.id,
    category: a.category,
    title: a.title,
    summary: a.summary,
    tags: a.tags,
  }));

  return res.json({ success: true, articles: summary, total: summary.length });
}

// ─── Search articles ───
function handleSearch(req, res) {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.json({ success: true, articles: [], total: 0 });
  }

  const query = q.toLowerCase().trim();

  const results = KB_ARTICLES.filter(a => {
    // Search in title, summary, tags, and content
    return a.title.toLowerCase().includes(query)
      || a.summary.toLowerCase().includes(query)
      || a.tags.some(t => t.toLowerCase().includes(query))
      || a.content.toLowerCase().includes(query);
  });

  const summary = results.map(a => ({
    id: a.id,
    category: a.category,
    title: a.title,
    summary: a.summary,
    tags: a.tags,
  }));

  return res.json({ success: true, articles: summary, total: summary.length, query });
}

// ─── Get single article by id ───
function handleGet(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'id is required' });

  const article = KB_ARTICLES.find(a => a.id === id);
  if (!article) return res.status(404).json({ error: 'Article not found' });

  return res.json({ success: true, article });
}

// ─── List FAQs (optionally by category) ───
function handleFaq(req, res) {
  const { category } = req.query;
  let faqs = KB_FAQ;

  if (category && category !== 'all') {
    faqs = faqs.filter(f => f.category === category);
  }

  return res.json({ success: true, faqs, total: faqs.length });
}
