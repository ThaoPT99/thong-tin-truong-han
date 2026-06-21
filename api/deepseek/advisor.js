// POST /api/deepseek/advisor — AI phân tích hồ sơ, đề xuất Top 3 trường
const { supabase } = require('../../lib/supabase');

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

function getDeepSeekKey() {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key || key.includes('placeholder') || key === 'sk-your-deepseek-api-key') {
    return null;
  }
  return key;
}

async function callDeepSeek(systemPrompt, userMessage) {
  const apiKey = getDeepSeekKey();
  if (!apiKey) {
    return '❌ DEEPSEEK_API_KEY chưa được cấu hình. Vui lòng thêm API key vào biến môi trường.';
  }

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
        temperature: 0.3,
        max_tokens: 2000,
      }),
      signal: (() => { try { return AbortSignal.timeout ? AbortSignal.timeout(30000) : undefined; } catch(e) { return undefined; } })(),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('DeepSeek API error:', response.status, errText);
      return `❌ API DeepSeek lỗi: ${response.status}`;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '❌ Không nhận được phản hồi từ DeepSeek.';
  } catch (err) {
    console.error('DeepSeek call error:', err);
    if (err.name === 'TimeoutError' || err.code === 'ABORT_ERR') {
      return '❌ API DeepSeek quá thời gian chờ (30s). Vui lòng thử lại.';
    }
    return '❌ Lỗi kết nối đến DeepSeek: ' + (err.message || 'Unknown error');
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const profile = req.body || {};
    const { gender, age, gpa, absences, korean, visaFail, region, budget, priorities } = profile;

    // Fetch full school data + advisor profiles from DB
    const [schoolsRes, profilesRes] = await Promise.all([
      supabase
        .from('schools')
        .select('*')
        .order('slug'),
      supabase
        .from('school_advisor_profiles')
        .select('*'),
    ]);

    if (schoolsRes.error) throw new Error('DB error: ' + schoolsRes.error.message);
    const schools = schoolsRes.data || [];
    const advisorProfiles = profilesRes.data || [];

    // Build advisor profiles map
    const apMap = {};
    for (const ap of advisorProfiles) {
      apMap[ap.school_id] = ap;
    }

    // Build school data text for prompt
    const schoolTexts = schools.map((s) => {
      const ap = apMap[s.id] || {};
      const genderText = ap.gender === 'female' ? 'Chỉ nữ' : 'Nam/Nữ';
      const costText = ap.cost_level ? `${ap.cost_level}/5` : 'Chưa rõ';
      const visaText = ap.visa_chance ? `${ap.visa_chance}/5` : 'Chưa rõ';
      const jobText = ap.job_opportunity ? `${ap.job_opportunity}/5` : 'Chưa rõ';
      const e7Text = ap.e7_opportunity ? `${ap.e7_opportunity}/5` : 'Chưa rõ';
      const tags = (ap.tags || []).length ? ap.tags.join(', ') : '';
      return `• ${s.name} (${s.name_kr || ''}):
   - Hệ: ${s.system || 'Chưa rõ'} | Khu vực: ${ap.region || s.region || 'Chưa rõ'}
   - Đối tượng: ${genderText} | Chỉ tiêu: ${s.quota || 'Chưa rõ'}
   - Học phí: ${s.tuition || 'Chưa rõ'}
   - KTX: ${s.ktx || 'Chưa rõ'}
   - Chi phí: ${costText} | Visa: ${visaText} | Việc làm: ${jobText} | E7: ${e7Text}
   - Tags: ${tags || 'Không có'}
   - MOU: ${s.mou || 'Không có'}`;
    }).join('\n');

    const systemPrompt = `Bạn là chuyên gia tư vấn du học Hàn Quốc Visa D2-6, làm việc cho một trung tâm tư vấn du học.

Dữ liệu ${schools.length} trường Hàn Quốc đang tuyển sinh kỳ này:

${schoolTexts}

NHIỆM VỤ:
Phân tích hồ sơ học sinh và đề xuất Top 3 trường phù hợp nhất.

YÊU CẦU TRẢ LỜI:
1. **Top 3 trường phù hợp nhất** kèm số % phù hợp
2. Với mỗi trường, nêu:
   - **Lý do phù hợp** (2-3 ý, dựa trên hồ sơ thực tế)
   - **Rủi ro cần kiểm tra** (nếu có)
3. Kết luận ngắn: trường nào nên ưu tiên nhất

QUY TẮC:
- Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu
- KHÔNG thêm thông tin không có trong dữ liệu
- Nếu hồ sơ có vấn đề (tuổi cao, GPA thấp, trượt visa) → cảnh báo rõ
- Ưu tiên trường phù hợp với: khu vực, giới tính, học lực, ngân sách`;

    const priorityText = (priorities && priorities.length)
      ? `Ưu tiên: ${priorities.join(', ')}.`
      : '';

    const userMessage = `Phân tích hồ sơ học sinh sau:
- Giới tính: ${gender || 'Không rõ'}
- Tuổi: ${age || 'Không rõ'}
- GPA: ${gpa || 'Không rõ'}
- Số buổi nghỉ: ${absences || 'Không rõ'}
- Tiếng Hàn: ${korean || 'Chưa có'}
- Đã từng trượt visa: ${visaFail === 'yes' ? 'Có' : 'Không'}
- Khu vực mong muốn: ${region || 'Không ưu tiên'}
- Ngân sách: ${budget || 'Trung bình'}
${priorityText}`;

    const advice = await callDeepSeek(systemPrompt, userMessage);

    return res.json({ success: true, advice });
  } catch (err) {
    console.error('/api/deepseek/advisor error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};
