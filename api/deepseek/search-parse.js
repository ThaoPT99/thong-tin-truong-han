// POST /api/deepseek/search-parse — Parse search intent từ câu hỏi tự nhiên
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const TIMEOUT_MS = 10000;

function getDeepSeekKey() {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key || key.includes('placeholder') || key === 'sk-your-deepseek-api-key') return null;
  return key;
}

async function callDeepSeek(prompt) {
  const apiKey = getDeepSeekKey();
  if (!apiKey) return null;

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'Bạn là công cụ parse search query. Parse câu tìm kiếm về trường Hàn Quốc thành JSON. CHỈ trả về JSON, không giải thích.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 200,
      }),
      signal: (() => { try { return AbortSignal.timeout ? AbortSignal.timeout(TIMEOUT_MS) : undefined; } catch(e) { return undefined; } })()
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    return null;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { query } = req.body || {};
    if (!query || query.trim().length < 2) {
      return res.json({ success: true, region: null, tags: [] });
    }

    const knownRegions = ['seoul', 'busan', 'gwangju', 'incheon', 'gyeonggi', 'daegu', 'daejeon', 'gangwon',
      'chungcheongbuk', 'chungcheongnam', 'jeollabuk', 'jeollanam', 'gyeongsangbuk', 'gyeongsangnam',
      'near-seoul',
    ];

    const regionStr = knownRegions.map(r => `"${r}"`).join(', ');

    const prompt = `Query: "${query}"

Parse thành JSON:
{
  "region": null hoặc một trong [${regionStr}] (chuẩn hóa: "gần Seoul" hoặc "near Seoul" hoặc "gyeonggi" hoặc "incheon" → "near-seoul"),
  "tags": [] (các tag: "female" nếu có từ "nữ", "low-cost" nếu có từ "rẻ"/"thấp"/"tiết kiệm", "e7" nếu có từ "e7"),
  "searchTerms": "phần còn lại của query sau khi loại bỏ region/tag"
}

CHỈ trả về JSON object, không có text khác.`;

    const result = await callDeepSeek(prompt);

    if (result) {
      try {
        // Extract JSON from the result (it might have markdown code blocks)
        const jsonStr = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(jsonStr);
        return res.json({
          success: true,
          region: parsed.region || null,
          tags: parsed.tags || [],
          searchTerms: parsed.searchTerms || query,
        });
      } catch (e) {
        // Fallback: return empty
        return res.json({ success: true, region: null, tags: [], searchTerms: query });
      }
    }

    return res.json({ success: true, region: null, tags: [], searchTerms: query });
  } catch (err) {
    return res.json({ success: true, region: null, tags: [], searchTerms: req.body?.query || '' });
  }
};
