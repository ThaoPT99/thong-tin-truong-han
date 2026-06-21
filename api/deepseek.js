// POST /api/deepseek?action=advisor|generate-zalo|search-parse
// Consolidated endpoint to stay within Vercel Hobby 12-function limit.
const { supabase } = require('../lib/supabase');

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

function getDeepSeekKey() {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key || key.includes('placeholder') || key === 'sk-your-deepseek-api-key') return null;
  return key;
}

async function callDeepSeek(messages, params) {
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
        messages,
        temperature: params?.temperature ?? 0.3,
        max_tokens: params?.maxTokens ?? 2000,
      }),
      signal: (() => { try { return AbortSignal.timeout ? AbortSignal.timeout(params?.timeout ?? 30000) : undefined; } catch(e) { return undefined; } })(),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error('DeepSeek call error:', err.message);
    return null;
  }
}

// ─── Action: Advisor ───
async function handleAdvisor(req, res) {
  const profile = req.body || {};
  const { gender, age, gpa, absences, korean, visaFail, region, budget, priorities } = profile;

  const [schoolsRes, profilesRes] = await Promise.all([
    supabase.from('schools').select('*').order('slug'),
    supabase.from('school_advisor_profiles').select('*'),
  ]);

  if (schoolsRes.error) throw new Error('DB error: ' + schoolsRes.error.message);
  const schools = schoolsRes.data || [];
  const advisorProfiles = profilesRes.data || [];

  const apMap = {};
  for (const ap of advisorProfiles) apMap[ap.school_id] = ap;

  const schoolTexts = schools.map((s) => {
    const ap = apMap[s.id] || {};
    const genderText = ap.gender === 'female' ? 'Chỉ nữ' : 'Nam/Nữ';
    const costText = ap.cost_level ? `${ap.cost_level}/5` : 'Chưa rõ';
    const visaText = ap.visa_chance ? `${ap.visa_chance}/5` : 'Chưa rõ';
    const jobText = ap.job_opportunity ? `${ap.job_opportunity}/5` : 'Chưa rõ';
    const e7Text = ap.e7_opportunity ? `${ap.e7_opportunity}/5` : 'Chưa rõ';
    const tags = (ap.tags || []).length ? ap.tags.join(', ') : '';
    return `• ${s.name} (${s.name_kr || ''}):\n   - Hệ: ${s.system || 'Chưa rõ'} | Khu vực: ${ap.region || s.region || 'Chưa rõ'}\n   - Đối tượng: ${genderText} | Chỉ tiêu: ${s.quota || 'Chưa rõ'}\n   - Học phí: ${s.tuition || 'Chưa rõ'}\n   - KTX: ${s.ktx || 'Chưa rõ'}\n   - Chi phí: ${costText} | Visa: ${visaText} | Việc làm: ${jobText} | E7: ${e7Text}\n   - Tags: ${tags || 'Không có'}\n   - MOU: ${s.mou || 'Không có'}`;
  }).join('\n');

  const systemPrompt = `Bạn là chuyên gia tư vấn du học Hàn Quốc Visa D2-6, làm việc cho một trung tâm tư vấn du học.\n\nDữ liệu ${schools.length} trường Hàn Quốc đang tuyển sinh kỳ này:\n\n${schoolTexts}\n\nNHIỆM VỤ:\nPhân tích hồ sơ học sinh và đề xuất Top 3 trường phù hợp nhất.\n\nYÊU CẦU TRẢ LỜI:\n1. **Top 3 trường phù hợp nhất** kèm số % phù hợp\n2. Với mỗi trường, nêu:\n   - **Lý do phù hợp** (2-3 ý, dựa trên hồ sơ thực tế)\n   - **Rủi ro cần kiểm tra** (nếu có)\n3. Kết luận ngắn: trường nào nên ưu tiên nhất\n\nQUY TẮC:\n- Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu\n- KHÔNG thêm thông tin không có trong dữ liệu\n- Nếu hồ sơ có vấn đề (tuổi cao, GPA thấp, trượt visa) → cảnh báo rõ\n- Ưu tiên trường phù hợp với: khu vực, giới tính, học lực, ngân sách`;

  const priorityText = (priorities && priorities.length) ? `Ưu tiên: ${priorities.join(', ')}.` : '';
  const userMessage = `Phân tích hồ sơ học sinh sau:\n- Giới tính: ${gender || 'Không rõ'}\n- Tuổi: ${age || 'Không rõ'}\n- GPA: ${gpa || 'Không rõ'}\n- Số buổi nghỉ: ${absences || 'Không rõ'}\n- Tiếng Hàn: ${korean || 'Chưa có'}\n- Đã từng trượt visa: ${visaFail === 'yes' ? 'Có' : 'Không'}\n- Khu vực mong muốn: ${region || 'Không ưu tiên'}\n- Ngân sách: ${budget || 'Trung bình'}\n${priorityText}`;

  const advice = await callDeepSeek(
    [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
    { temperature: 0.3, maxTokens: 2000, timeout: 30000 }
  );

  return res.json({ success: true, advice: advice || '❌ Không nhận được phản hồi từ DeepSeek.' });
}

// ─── Action: Generate Zalo ───
async function handleGenerateZalo(req, res) {
  const { slug, studentName, studentInfo } = req.body || {};
  if (!slug) return res.status(400).json({ error: 'slug is required' });

  const { data: school, error } = await supabase
    .from('schools').select('*').eq('slug', slug).single();

  if (error || !school) return res.status(404).json({ error: 'School not found' });

  const { data: ap } = await supabase
    .from('school_advisor_profiles').select('*').eq('school_id', school.id).maybeSingle();

  const regionLabels = {
    seoul: 'Seoul', 'near-seoul': 'gần Seoul', busan: 'Busan',
    gwangju: 'Gwangju', incheon: 'Incheon', gyeonggi: 'Gyeonggi',
    chungcheongbuk: 'Chungcheongbuk', jeollanam: 'Jeollanam',
    jeollabuk: 'Jeollabuk', gyeongsangnam: 'Gyeongsangnam',
    gangwon: 'Gangwon', province: 'tỉnh/thành khác',
  };
  const regionName = regionLabels[ap?.region || school.region] || school.region || 'Hàn Quốc';

  const systemPrompt = `Bạn là chuyên viên tư vấn du học Hàn Quốc. Viết tin nhắn Zalo tư vấn cho học sinh.\n\nThông tin trường:\n- Tên: ${school.name}${school.name_kr ? ` (${school.name_kr})` : ''}\n- Hệ: ${school.system || 'Chưa rõ'}\n- Khu vực: ${regionName}\n- Học phí: ${school.tuition || 'Đang cập nhật'}\n- Ký túc xá: ${school.ktx || 'Đang cập nhật'}\n- Ưu điểm: ${(school.advantages || []).join(', ') || 'Chưa cập nhật'}\n- Website: ${school.website || ''}\n\nYÊU CẦU:\nViết 1 tin nhắn Zalo ngắn gọn, tự nhiên, thân thiện (2-3 câu).\n- KHÔNG quá dài, không dùng emoji quá nhiều\n- KHÔNG thêm thông tin không có trong dữ liệu\n- Chào ${studentName || 'học sinh'} ở đầu tin nhắn\n- Kết thúc bằng lời mời liên hệ nếu cần tư vấn thêm`;

  const userMessage = `Viết tin nhắn Zalo tư vấn trường ${school.name} cho học sinh.${studentInfo ? ` Thông tin thêm: ${studentInfo}` : ''}`;

  const generatedText = await callDeepSeek(
    [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
    { temperature: 0.5, maxTokens: 1000, timeout: 20000 }
  );

  return res.json({ success: true, zaloText: generatedText || null, schoolName: school.name });
}

// ─── Action: Search Parse ───
async function handleSearchParse(req, res) {
  const { query } = req.body || {};
  if (!query || query.trim().length < 2) {
    return res.json({ success: true, region: null, tags: [], searchTerms: query || '' });
  }

  const knownRegions = ['seoul', 'busan', 'gwangju', 'incheon', 'gyeonggi', 'daegu', 'daejeon', 'gangwon',
    'chungcheongbuk', 'chungcheongnam', 'jeollabuk', 'jeollanam', 'gyeongsangbuk', 'gyeongsangnam',
    'near-seoul',
  ];
  const regionStr = knownRegions.map(r => `"${r}"`).join(', ');

  const prompt = `Query: "${query}"\n\nParse thành JSON:\n{\n  "region": null hoặc một trong [${regionStr}] (chuẩn hóa: "gần Seoul" hoặc "near Seoul" hoặc "gyeonggi" hoặc "incheon" → "near-seoul"),\n  "tags": [] (các tag: "female" nếu có từ "nữ", "low-cost" nếu có từ "rẻ"/"thấp"/"tiết kiệm", "e7" nếu có từ "e7"),\n  "searchTerms": "phần còn lại của query sau khi loại bỏ region/tag"\n}\n\nCHỈ trả về JSON object, không có text khác.`;

  const result = await callDeepSeek(
    [
      { role: 'system', content: 'Bạn là công cụ parse search query. Parse câu tìm kiếm về trường Hàn Quốc thành JSON. CHỈ trả về JSON, không giải thích.' },
      { role: 'user', content: prompt },
    ],
    { temperature: 0.1, maxTokens: 200, timeout: 10000 }
  );

  if (result) {
    try {
      const jsonStr = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      return res.json({ success: true, region: parsed.region || null, tags: parsed.tags || [], searchTerms: parsed.searchTerms || query });
    } catch (e) {
      return res.json({ success: true, region: null, tags: [], searchTerms: query });
    }
  }

  return res.json({ success: true, region: null, tags: [], searchTerms: query });
}

// ─── Router ───
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = getDeepSeekKey();
  if (!apiKey) {
    return res.status(503).json({ success: false, error: 'DEEPSEEK_API_KEY chưa được cấu hình trên Vercel. Vui lòng thêm vào Environment Variables.' });
  }

  try {
    const action = req.query.action || 'advisor';

    switch (action) {
      case 'advisor':
        return await handleAdvisor(req, res);
      case 'generate-zalo':
        return await handleGenerateZalo(req, res);
      case 'search-parse':
        return await handleSearchParse(req, res);
      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (err) {
    console.error('/api/deepseek error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};
