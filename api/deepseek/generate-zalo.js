// POST /api/deepseek/generate-zalo — Sinh nội dung tư vấn gửi Zalo cho học sinh
const { supabase } = require('../../lib/supabase');

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const TIMEOUT_MS = 20000;

function getDeepSeekKey() {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key || key.includes('placeholder') || key === 'sk-your-deepseek-api-key') return null;
  return key;
}

async function callDeepSeek(systemPrompt, userMessage) {
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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      }),
      signal: (() => { try { return AbortSignal.timeout ? AbortSignal.timeout(TIMEOUT_MS) : undefined; } catch(e) { return undefined; } })()
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error('DeepSeek Zalo generation error:', err.message);
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
    const { slug, studentName, studentInfo } = req.body || {};

    if (!slug) {
      return res.status(400).json({ error: 'slug is required' });
    }

    // Fetch school data
    const { data: school, error } = await supabase
      .from('schools')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !school) {
      return res.status(404).json({ error: 'School not found' });
    }

    // Fetch advisor profile
    const { data: ap } = await supabase
      .from('school_advisor_profiles')
      .select('*')
      .eq('school_id', school.id)
      .maybeSingle();

    const regionLabels = {
      seoul: 'Seoul', 'near-seoul': 'gần Seoul', busan: 'Busan',
      gwangju: 'Gwangju', incheon: 'Incheon', gyeonggi: 'Gyeonggi',
      chungcheongbuk: 'Chungcheongbuk', jeollanam: 'Jeollanam',
      jeollabuk: 'Jeollabuk', gyeongsangnam: 'Gyeongsangnam',
      gangwon: 'Gangwon', province: 'tỉnh/thành khác',
    };

    const regionName = regionLabels[ap?.region || school.region] || school.region || 'Hàn Quốc';

    const systemPrompt = `Bạn là chuyên viên tư vấn du học Hàn Quốc. Viết tin nhắn Zalo tư vấn cho học sinh.

Thông tin trường:
- Tên: ${school.name}${school.name_kr ? ` (${school.name_kr})` : ''}
- Hệ: ${school.system || 'Chưa rõ'}
- Khu vực: ${regionName}
- Học phí: ${school.tuition || 'Đang cập nhật'}
- Ký túc xá: ${school.ktx || 'Đang cập nhật'}
- Ưu điểm: ${(school.advantages || []).join(', ') || 'Chưa cập nhật'}
- Website: ${school.website || ''}

YÊU CẦU:
Viết 1 tin nhắn Zalo ngắn gọn, tự nhiên, thân thiện (2-3 câu).
- KHÔNG quá dài, không dùng emoji quá nhiều
- KHÔNG thêm thông tin không có trong dữ liệu
- Chào ${studentName || 'học sinh'} ở đầu tin nhắn
- Kết thúc bằng lời mời liên hệ nếu cần tư vấn thêm`;

    const userMessage = `Viết tin nhắn Zalo tư vấn trường ${school.name} cho học sinh.${studentInfo ? ` Thông tin thêm: ${studentInfo}` : ''}`;

    const generatedText = await callDeepSeek(systemPrompt, userMessage);

    return res.json({
      success: true,
      zaloText: generatedText || null,
      schoolName: school.name,
    });
  } catch (err) {
    console.error('/api/deepseek/generate-zalo error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};
