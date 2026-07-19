// POST /api/deepseek?action=advisor|generate-zalo|search-parse|generate-description|telegram-webhook
// Consolidated endpoint to stay within Vercel Hobby 12-function limit.
const { supabase } = require('../lib/supabase');
const { requireAdmin } = require('../lib/auth');
const { sendTelegramMessage, sendDailyReport, sendNewCityAlert, sendNewStudentAlert } = require('../lib/telegram');
const http = require('http');

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
  const apiKey = getDeepSeekKey();
  if (!apiKey) {
    return res.status(503).json({ success: false, error: 'DEEPSEEK_API_KEY chưa được cấu hình.' });
  }

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
  }).join('\\n');

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
  const apiKey = getDeepSeekKey();
  if (!apiKey) {
    return res.status(503).json({ success: false, error: 'DEEPSEEK_API_KEY chưa được cấu hình.' });
  }

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
  const apiKey = getDeepSeekKey();
  if (!apiKey) {
    return res.json({ success: true, region: null, tags: [], searchTerms: req.body?.query || '' });
  }

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

// ─── Action: Generate Description (Admin Editor) ───
async function handleGenerateDescription(req, res) {
  const apiKey = getDeepSeekKey();
  if (!apiKey) {
    return res.json({ success: true, intro: '', suggestedAdvantages: [], message: 'DEEPSEEK_API_KEY chưa được cấu hình.' });
  }

  const school = req.body || {};

  const hasData = school.name || school.system || school.location || school.tuition ||
    school.ktx || (school.conditions?.length) || (school.majors?.length) || (school.advantages?.length);

  if (!hasData) {
    return res.json({
      success: true,
      intro: '',
      suggestedAdvantages: [],
      message: 'Chưa có dữ liệu trường để sinh mô tả. Vui lòng nhập thông tin trước.'
    });
  }

  const systemPrompt = `Bạn là chuyên viên content du học Hàn Quốc. Viết mô tả giới thiệu trường chuyên nghiệp bằng tiếng Việt.

QUY TẮC:
- Viết 1-2 đoạn ngắn (60-120 từ), giọng văn chuyên nghiệp, hấp dẫn
- CHỈ dùng thông tin được cung cấp, KHÔNG thêm thông tin mới
- Tập trung vào: vị trí, học phí, hệ đào tạo, điều kiện, ưu điểm chính
- Phù hợp với đối tượng học sinh muốn đi du học D2-6
- Không dùng emoji, không xuống dòng quá nhiều

Trả về JSON:
{
  "intro": "Đoạn giới thiệu trường...",
  "suggestedAdvantages": ["Ưu điểm 1", "Ưu điểm 2", "Ưu điểm 3"]
}`;

  const conditionsText = (school.conditions || []).join('; ');
  const majorsText = (school.majors || []).join('; ');
  const advantagesText = (school.advantages || []).join('; ');

  const userMessage = `Dữ liệu trường:
- Tên: ${school.name || 'Chưa rõ'}${school.nameKr ? ` (${school.nameKr})` : ''}
- Hệ: ${school.system || 'Chưa rõ'}
- Khu vực: ${school.location || 'Chưa rõ'}
- Học phí: ${school.tuition || 'Chưa rõ'}
- Ký túc xá: ${school.ktx || 'Chưa rõ'}
- MOU: ${school.mou || 'Không có'}
- Điều kiện: ${conditionsText || 'Chưa rõ'}
- Chuyên ngành: ${(majorsText || 'Chưa rõ').substring(0, 300)}
- Ưu điểm hiện tại: ${(advantagesText || 'Chưa có').substring(0, 300)}

Viết intro giới thiệu trường và gợi ý thêm ưu điểm dựa trên dữ liệu.`;

  const result = await callDeepSeek(
    [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
    { temperature: 0.4, maxTokens: 1000, timeout: 20000 }
  );

  if (result) {
    try {
      const jsonStr = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      return res.json({
        success: true,
        intro: parsed.intro || '',
        suggestedAdvantages: parsed.suggestedAdvantages || [],
      });
    } catch (e) {
      return res.json({ success: true, intro: result, suggestedAdvantages: [] });
    }
  }

  return res.json({ success: true, intro: '', suggestedAdvantages: [], message: 'AI không phản hồi, vui lòng thử lại.' });
}

// ═══════════════════════════════════════════════════
// ─── Telegram Bot Webhook (action=telegram-webhook)
// ═══════════════════════════════════════════════════

function getBotToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || token.includes('placeholder') || token === 'your-telegram-bot-token') return null;
  return token;
}

function verifyTelegramWebhook(req) {
  const token = getBotToken();
  if (!token) return false;

  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secretToken) {
    const header = req.headers['x-telegram-bot-api-secret-token'];
    return header === secretToken;
  }
  return true;
}

async function handleTelegramStart(chatId) {
  const text = `🤖 <b>Chào mừng bạn đến với Bot hỗ trợ!</b>

Bot này giúp bạn quản lý thông tin du học Hàn Quốc visa D2-6.

<b>Các lệnh có sẵn:</b>
🏫 <code>/truong [tên]</code> — Tra cứu thông tin trường
📋 <code>/danhsach</code> — Danh sách tất cả trường
⚖️ <code>/sosanh [t1], [t2]</code> — So sánh 2 trường
📊 <code>/baocao</code> — Báo cáo tổng quan hôm nay
📝 <code>/dieukien</code> — Visa checklist D2-6
👤 <code>/gui [tên], [SĐT], [trường]</code> — Thêm học sinh mới
ℹ️ <code>/thongtin</code> — Thông tin hệ thống
🧠 <code>/phan-tich</code> — Phân tích IP bằng AI (phát hiện đối tác)
❓ <code>/help</code> — Xem hướng dẫn chi tiết

<i>Liên hệ admin nếu cần hỗ trợ thêm.</i>`;
  return await sendTelegramMessage(chatId, text);
}

async function handleTelegramHelp(chatId) {
  const text = `📖 <b>Hướng dẫn sử dụng Bot</b>

🏫 <b>Tra cứu trường</b>
<code>/truong Osan</code> — Chi tiết 1 trường (tên, học phí, KTX, điều kiện...)
<code>/danhsach</code> — Xem tất cả 18 trường (phân theo khu vực)
<code>/sosanh Osan, Induk</code> — So sánh 2 trường

📊 <b>Thống kê</b>
<code>/baocao</code> — Báo cáo hôm nay (lượt xem, IP mới, top trường)

📝 <b>Visa & Hồ sơ</b>
<code>/dieukien</code> — Checklist visa D2-6, phỏng vấn

👤 <b>Quản lý học sinh</b>
<code>/gui Nguyễn Văn A, 0978123456, Osan</code> — Thêm học sinh vào CRM

🧠 <b>Phân tích AI</b>
<code>/phan-tich</code> — Phân tích IP bằng AI, phát hiện đối tác tiềm năng

ℹ️ <b>Khác</b>
<code>/thongtin</code> — Thông tin hệ thống, liên hệ
<code>/start</code> — Xem lại menu

🤖 <b>Cảnh báo tự động:</b>
• 📍 Khi có IP mới từ thành phố lạ
• 🆕 Khi có học sinh mới được tạo qua Telegram`;
  return await sendTelegramMessage(chatId, text);
}

async function handleTelegramSearchSchool(chatId, query) {
  if (!query || query.trim().length < 2) {
    return await sendTelegramMessage(chatId, 'Vui lòng nhập tên trường cần tra cứu.\n\nVí dụ: <code>/truong Osan</code>');
  }

  const searchTerm = query.trim();
  const { data: schools, error } = await supabase
    .from('schools')
    .select(`*, school_conditions(text), school_majors(text), school_advantages(text), school_conversions(text), school_documents(text), school_partners(code, name)`)
    .or(`name.ilike.%${searchTerm}%,name_kr.ilike.%${searchTerm}%,name_en.ilike.%${searchTerm}%,slug.ilike.%${searchTerm}%`)
    .limit(5);

  if (error) {
    console.error('Telegram search school error:', error);
    return await sendTelegramMessage(chatId, '❌ Lỗi tra cứu, vui lòng thử lại sau.');
  }

  if (!schools || schools.length === 0) {
    return await sendTelegramMessage(chatId, `❌ Không tìm thấy trường nào khớp với "<b>${escapeHtmlTelegram(searchTerm)}</b>".\n\nThử gõ khác đi, ví dụ: <code>/truong Osan</code>`);
  }

  for (const school of schools) {
    const conditions = (school.school_conditions || []).map(c => c.text).join('\n• ') || 'Chưa cập nhật';
    const majors = (school.school_majors || []).map(m => m.text).join(', ') || 'Chưa cập nhật';
    const advantages = (school.school_advantages || []).map(a => a.text).join('\n• ') || 'Chưa có';

    const text = `🏫 <b>${escapeHtmlTelegram(school.name)}</b>${school.name_kr ? ` (${escapeHtmlTelegram(school.name_kr)})` : ''}

📍 Vị trí: ${school.location || 'Chưa rõ'}
📚 Hệ: ${school.system || 'Chưa rõ'}
💰 Học phí: ${school.tuition || 'Chưa cập nhật'}
🏠 KTX: ${school.ktx || 'Chưa cập nhật'}
🎯 Chỉ tiêu: ${school.quota || 'Chưa rõ'}

<b>📋 Điều kiện:</b>
• ${conditions}

<b>📖 Chuyên ngành:</b>
${majors}

<b>⭐ Ưu điểm:</b>
• ${advantages}

${school.website ? `🔗 <a href="${escapeHtmlTelegram(school.website)}">Website</a>` : ''}
${school.catalog_url ? `📄 <a href="${escapeHtmlTelegram(school.catalog_url)}">Catalog</a>` : ''}`;

    await sendTelegramMessage(chatId, text);
  }

  if (schools.length > 1) {
    await sendTelegramMessage(chatId, `🔍 Tìm thấy <b>${schools.length}</b> trường phù hợp.`);
  }
}

async function handleTelegramReport(chatId) {
  const today = new Date().toISOString().split('T')[0];

  const [viewsRes, searchesRes, sessionsRes, ipCacheRes, newCitiesRes] = await Promise.all([
    supabase.from('analytics_page_views').select('*', { count: 'exact', head: true }).gte('created_at', today),
    supabase.from('analytics_searches').select('*', { count: 'exact', head: true }).gte('created_at', today),
    supabase.from('analytics_sessions').select('*', { count: 'exact', head: true }).gte('started_at', today),
    supabase.from('analytics_ip_cache').select('*', { count: 'exact', head: true }).gte('last_seen', today),
    supabase.from('analytics_ip_cache').select('city, region, first_seen').gte('first_seen', today).not('city', 'is', null),
  ]);

  const totalViews = viewsRes.count || 0;
  const totalSearches = searchesRes.count || 0;
  const totalSessions = sessionsRes.count || 0;
  const newIps = ipCacheRes.count || 0;

  const { data: topSchoolsRaw } = await supabase
    .from('analytics_page_views')
    .select('school_slug, school_name')
    .gte('created_at', today)
    .not('school_slug', 'is', null);

  const schoolCounts = {};
  for (const row of topSchoolsRaw || []) {
    if (!row.school_slug) continue;
    schoolCounts[row.school_slug] = schoolCounts[row.school_slug] || { name: row.school_name || row.school_slug, count: 0 };
    schoolCounts[row.school_slug].count++;
  }

  const topSchools = Object.entries(schoolCounts)
    .map(([slug, d]) => ({ slug, name: d.name, count: d.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const citySeen = new Set();
  const newCities = [];
  for (const row of newCitiesRes.data || []) {
    if (!row.city) continue;
    const key = `${row.city}|${row.region || ''}`;
    if (!citySeen.has(key)) {
      citySeen.add(key);
      newCities.push({ city: row.city, region: row.region || '' });
    }
  }

  // Format report và gửi trực tiếp về chat người yêu cầu
  const schoolLines = topSchools
    .map((s, i) => `${i + 1}. ${s.name || s.slug} — ${s.count} lượt`)
    .join('\n');
  const cityLines = newCities
    .map(c => `  • ${c.city || ''}${c.region ? ` (${c.region})` : ''}`)
    .join('\n');

  const text = `📊 <b>Báo cáo ngày ${today}</b>

👁 Lượt xem: <b>${totalViews}</b>
🔍 Tìm kiếm: <b>${totalSearches}</b>
👤 Phiên: <b>${totalSessions}</b>
🆕 IP mới: <b>${newIps}</b>

${schoolLines ? `🏆 <b>Top trường:</b>
${schoolLines}` : ''}

${cityLines ? `📍 <b>Địa điểm mới:</b>
${cityLines}` : ''}

<i>Xem chi tiết: thongtintruonghan.vercel.app/admin/analytics.html</i>`;

  await sendTelegramMessage(chatId, text);
}

async function handleTelegramAddStudent(chatId, text) {
  const parts = text.split(',').map(s => s.trim());
  const name = parts[0] || '';
  const phone = parts[1] || '';
  const schoolName = parts[2] || '';
  const note = parts.slice(3).join(', ').trim() || '';

  if (!name || !phone) {
    return await sendTelegramMessage(chatId, 'Vui lòng nhập đúng định dạng:\n\n<code>/gui Tên học sinh, Số điện thoại, Trường, Ghi chú</code>\n\nVí dụ:\n<code>/gui Nguyễn Văn A, 0978123456, Osan, Gọi lại 2h chiều</code>');
  }

  let schoolId = null;
  if (schoolName) {
    const { data: schools } = await supabase
      .from('schools').select('id, name').ilike('name', `%${schoolName}%`).limit(1);
    if (schools && schools.length > 0) schoolId = schools[0].id;
  }

  const { data: activeSem } = await supabase
    .from('semesters').select('id').eq('is_active', true).limit(1).maybeSingle();

  const { data: student, error } = await supabase
    .from('students')
    .insert({ name, phone, school_id: schoolId, semester_id: activeSem?.id || null, note: note || '', status: 'new', owner_id: null })
    .select('id, name')
    .single();

  if (error) {
    return await sendTelegramMessage(chatId, '❌ Lỗi tạo học sinh: ' + (error.message || 'Unknown error'));
  }

  await supabase.from('student_logs').insert({
    student_id: student.id, action: 'created', description: 'Tạo từ Telegram Bot', created_by: 'Telegram Bot',
  });

  await sendNewStudentAlert({ name, phone, school: schoolName || 'Chưa chọn', note: note || 'Không có', createdBy: 'Bot Telegram' });

  const schoolText = schoolName ? `trường <b>${escapeHtmlTelegram(schoolName)}</b>` : 'chưa chọn trường';
  await sendTelegramMessage(chatId, `✅ Đã tạo học sinh <b>${escapeHtmlTelegram(name)}</b> (${schoolText}) thành công!\n📞 SĐT: ${escapeHtmlTelegram(phone)}\n📝 Ghi chú: ${escapeHtmlTelegram(note || 'Không có')}\n\nBạn có thể xem trong CRM: thongtintruonghan.vercel.app/admin/students.html`);
}

// ─── Lệnh: /danhsach — Danh sách tất cả trường ───
async function handleTelegramSchoolList(chatId) {
  const { data: schools, error } = await supabase
    .from('schools')
    .select('slug, name, name_kr, system, region, location')
    .order('slug');

  if (error || !schools || schools.length === 0) {
    return await sendTelegramMessage(chatId, '❌ Không thể lấy danh sách trường.');
  }

  const regionLabels = {
    seoul: 'Seoul', 'near-seoul': 'Gần Seoul', busan: 'Busan',
    gwangju: 'Gwangju', incheon: 'Incheon', gyeonggi: 'Gyeonggi',
    chungcheongbuk: 'Chungcheongbuk', jeollanam: 'Jeollanam',
    jeollabuk: 'Jeollabuk', gyeongsangnam: 'Gyeongsangnam',
    daegu: 'Daegu', daejeon: 'Daejeon', gangwon: 'Gangwon',
  };

  // Group by region
  const groups = {};
  for (const s of schools) {
    const region = regionLabels[s.region] || s.region || 'Khác';
    if (!groups[region]) groups[region] = [];
    groups[region].push(s);
  }

  let text = `🏫 <b>Danh sách ${schools.length} trường</b>

`;
  for (const [region, list] of Object.entries(groups)) {
    text += `<b>📍 ${region}</b>
`;
    for (const s of list) {
      text += `  • ${escapeHtmlTelegram(s.name)}${s.name_kr ? ` (${escapeHtmlTelegram(s.name_kr)})` : ''}${s.system ? ` — ${escapeHtmlTelegram(s.system)}` : ''}
`;
    }
    text += '\n';
  }

  text += `🔍 Tra cứu chi tiết: <code>/truong [tên]</code>
⚖️ So sánh: <code>/sosanh [t1], [t2]</code>`;

  await sendTelegramMessage(chatId, text);
}

// ─── Lệnh: /sosanh — So sánh 2 trường ───
async function handleTelegramCompare(chatId, args) {
  const parts = args.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length < 2) {
    return await sendTelegramMessage(chatId, 'Vui lòng nhập tên 2 trường, cách nhau bằng dấu phẩy.\n\nVí dụ: <code>/sosanh Osan, Induk</code>');
  }

  const [name1, name2] = parts;

  const { data: schools } = await supabase
    .from('schools')
    .select(`*, school_conditions(text), school_majors(text), school_advantages(text), school_documents(text)`)
    .or(`name.ilike.%${name1}%,name.ilike.%${name2}%`)
    .limit(10);

  if (!schools || schools.length < 2) {
    return await sendTelegramMessage(chatId, `❌ Không tìm thấy đủ 2 trường. Thử gõ đúng tên, ví dụ: <code>/sosanh Osan, Induk</code>`);
  }

  // Find the closest matches
  const getSchool = (schools, search) => {
    const lower = search.toLowerCase();
    return schools.find(s => s.name.toLowerCase().includes(lower) || s.name_kr?.toLowerCase().includes(lower) || s.slug.includes(lower));
  };

  const s1 = getSchool(schools, name1);
  const s2 = getSchool(schools, name2);

  if (!s1 || !s2 || s1.id === s2.id) {
    return await sendTelegramMessage(chatId, `❌ Không tìm thấy 2 trường khác nhau. Thử lại, ví dụ: <code>/sosanh Osan, Induk</code>`);
  }

  const formatSchool = (s) => ({
    name: s.name,
    nameKr: s.name_kr || '',
    region: s.location || 'Chưa rõ',
    system: s.system || 'Chưa rõ',
    tuition: s.tuition || 'Chưa rõ',
    ktx: s.ktx || 'Chưa rõ',
    quota: s.quota || 'Chưa rõ',
    conditions: (s.school_conditions || []).slice(0, 3).map(c => c.text).join('; ') || 'Chưa rõ',
    majors: (s.school_majors || []).slice(0, 5).map(m => m.text).join(', ') || 'Chưa rõ',
    advantages: (s.school_advantages || []).slice(0, 3).map(a => a.text).join('; ') || '',
  });

  const a = formatSchool(s1);
  const b = formatSchool(s2);

  const text = `⚖️ <b>So sánh:</b> ${escapeHtmlTelegram(a.name)} vs ${escapeHtmlTelegram(b.name)}

<b>📌 Vị trí</b>
• ${escapeHtmlTelegram(a.name)}: ${a.region}
• ${escapeHtmlTelegram(b.name)}: ${b.region}

<b>📚 Hệ đào tạo</b>
• ${escapeHtmlTelegram(a.name)}: ${a.system}
• ${escapeHtmlTelegram(b.name)}: ${b.system}

<b>💰 Học phí</b>
• ${escapeHtmlTelegram(a.name)}: ${a.tuition}
• ${escapeHtmlTelegram(b.name)}: ${b.tuition}

<b>🏠 KTX</b>
• ${escapeHtmlTelegram(a.name)}: ${a.ktx}
• ${escapeHtmlTelegram(b.name)}: ${b.ktx}

<b>🎯 Chỉ tiêu</b>
• ${escapeHtmlTelegram(a.name)}: ${a.quota}
• ${escapeHtmlTelegram(b.name)}: ${b.quota}

<b>📋 Điều kiện</b>
• ${escapeHtmlTelegram(a.name)}: ${a.conditions}
• ${escapeHtmlTelegram(b.name)}: ${b.conditions}

<a href="https://thongtintruonghan.vercel.app/?compare=${s1.slug},${s2.slug}">🔗 Xem so sánh trên web</a>`;

  await sendTelegramMessage(chatId, text);
}

// ─── Lệnh: /dieukien — Visa checklist ───
async function handleTelegramVisaChecklist(chatId) {
  const [{ data: checklist }, { data: interviews }] = await Promise.all([
    supabase.from('extra_visa_checklist').select('*').order('sort_order'),
    supabase.from('extra_interviews').select('*').order('sort_order'),
  ]);

  if (!checklist || checklist.length === 0) {
    return await sendTelegramMessage(chatId, '❌ Chưa có dữ liệu checklist visa. Vui lòng import dữ liệu.');
  }

  // Group by level
  const groups = { 'Bắt buộc': [], 'Khuyến khích': [], 'Bổ sung': [] };
  for (const item of checklist) {
    const level = item.level || 'Bắt buộc';
    if (!groups[level]) groups[level] = [];
    groups[level].push(item);
  }

  let text = `📝 <b>Checklist visa D2-6</b>

`;

  for (const [level, items] of Object.entries(groups)) {
    if (items.length === 0) continue;
    const icon = level === 'Bắt buộc' ? '🔴' : level === 'Khuyến khích' ? '🟡' : '🔵';
    text += `<b>${icon} ${level}</b>
`;
    for (const item of items.slice(0, 8)) {
      text += `• ${escapeHtmlTelegram(item.content || '')}`;
      if (item.note) text += ` <i>(${escapeHtmlTelegram(item.note)})</i>`;
      text += '\n';
    }
    if (items.length > 8) text += `  <i>...và ${items.length - 8} mục nữa</i>\n`;
    text += '\n';
  }

  // Interview section
  if (interviews && interviews.length > 0) {
    text += `<b>🎤 Phỏng vấn visa</b>
`;
    for (const item of interviews.slice(0, 5)) {
      text += `• ${escapeHtmlTelegram(item.content || '')}\n`;
    }
    if (interviews.length > 5) text += `  <i>...và ${interviews.length - 5} câu hỏi nữa</i>\n`;
  }

  text += `\n🔗 <a href="https://thongtintruonghan.vercel.app/">Xem đầy đủ trên web</a>`;

  await sendTelegramMessage(chatId, text);
}

// ─── Lệnh: /thongtin — Thông tin hệ thống ───
async function handleTelegramSystemInfo(chatId) {
  const [schoolsRes, semRes, analyticsRes] = await Promise.all([
    supabase.from('schools').select('id', { count: 'exact', head: true }),
    supabase.from('semesters').select('ky, nam, title').eq('is_active', true).maybeSingle(),
    supabase.from('analytics_page_views').select('*', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().split('T')[0]),
  ]);

  const schoolCount = schoolsRes.count || 0;
  const activeSem = semRes.data;
  const todayViews = analyticsRes.count || 0;

  const text = `ℹ️ <b>Thông tin hệ thống</b>

🏫 Số trường: <b>${schoolCount}</b>
📅 Kỳ hiện tại: <b>${activeSem ? escapeHtmlTelegram(activeSem.title || `Kỳ ${activeSem.ky}/${activeSem.nam}`) : 'Chưa cập nhật'}</b>
👁 Lượt xem hôm nay: <b>${todayViews}</b>

<b>👤 Liên hệ</b>
📞 Xử lý visa D2-6
📱 Zalo: Tham gia nhóm trên web

🌐 <a href="https://thongtintruonghan.vercel.app/">thongtintruonghan.vercel.app</a>

📋 Gõ <code>/help</code> để xem hướng dẫn chi tiết.`;

  await sendTelegramMessage(chatId, text);
}

// ─── Lệnh: /phan-tich — Phân tích IP bằng AI ───
async function handleTelegramIpAnalysis(chatId) {
  const apiKey = getDeepSeekKey();
  if (!apiKey) {
    return await sendTelegramMessage(chatId, '❌ DEEPSEEK_API_KEY chưa được cấu hình để dùng tính năng này.');
  }

  await sendTelegramMessage(chatId, '🧠 <b>Đang phân tích dữ liệu IP...</b>\n\nTôi đang thu thập thông tin và phân tích bằng AI. Sẽ mất vài giây...');

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  try {
    // Lấy top IP đáng chú ý (có location, nhiều lượt xem)
    const { data: topIps } = await supabase
      .from('analytics_ip_cache')
      .select('ip, city, region, country, country_code, isp, total_views, first_seen, last_seen')
      .gte('last_seen', sevenDaysAgo)
      .not('city', 'is', null)
      .order('total_views', { ascending: false })
      .limit(10);

    if (!topIps || topIps.length === 0) {
      return await sendTelegramMessage(chatId, '❌ Chưa có dữ liệu IP nào để phân tích. Hãy đợi thêm lượt truy cập.');
    }

    // Với mỗi IP, lấy các trường họ đã xem
    const ipAnalysis = [];
    for (const ip of topIps) {
      const { data: pageViews } = await supabase
        .from('analytics_page_views')
        .select('page_type, school_slug, school_name')
        .eq('ip', ip.ip)
        .gte('created_at', sevenDaysAgo)
        .not('school_slug', 'is', null)
        .order('created_at', { ascending: false })
        .limit(20);

      // Đếm số trường đã xem
      const schoolsSeen = new Set();
      const schoolCounts = {};
      let hasAdvisor = false;
      let hasCompare = false;
      let totalViewCount = 0;

      for (const view of pageViews || []) {
        totalViewCount++;
        if (view.school_slug) {
          schoolsSeen.add(view.school_slug);
          schoolCounts[view.school_name || view.school_slug] = (schoolCounts[view.school_name || view.school_slug] || 0) + 1;
        }
        if (view.page_type === 'advisor') hasAdvisor = true;
        if (view.page_type === 'compare') hasCompare = true;
      }

      ipAnalysis.push({
        ip: ip.ip,
        city: ip.city || '',
        region: ip.region || '',
        country: ip.country_code || '',
        isp: ip.isp || '',
        totalViews: ip.total_views || 0,
        uniqueSchools: schoolsSeen.size,
        schools: Object.entries(schoolCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => `${name} (${count} lượt)`),
        usedAdvisor: hasAdvisor,
        usedCompare: hasCompare,
        daysActive: Math.ceil((new Date(ip.last_seen) - new Date(ip.first_seen)) / (24 * 60 * 60 * 1000)),
      });
    }

    // Thống kê tổng quan
    const totalUniqueIps = topIps.length;
    const totalPartnersEstimate = ipAnalysis.filter(i => i.uniqueSchools >= 3 || i.usedAdvisor).length;
    const citiesGrouped = {};
    for (const ip of ipAnalysis) {
      const key = `${ip.city}${ip.region ? `, ${ip.region}` : ''}`;
      citiesGrouped[key] = (citiesGrouped[key] || 0) + 1;
    }

    // Build prompt
    const ipSummary = ipAnalysis.map((ip, i) =>
      `IP ${i + 1}: ${ip.ip}
  • Vị trí: ${ip.city}${ip.region ? `, ${ip.region}` : ''} (${ip.country})
  • ISP: ${ip.isp || 'Không rõ'}
  • Lượt xem: ${ip.totalViews}
  • Trường đã xem: ${ip.uniqueSchools} trường — ${ip.schools.join(', ') || 'Không có'}
  • Đã dùng công cụ: ${ip.usedAdvisor ? 'Có (tư vấn)' : ''}${ip.usedCompare ? ', Có (so sánh)' : ''}${!ip.usedAdvisor && !ip.usedCompare ? 'Không' : ''}
  • Số ngày hoạt động: ${ip.daysActive} ngày`
    ).join('\n');

    const citySummary = Object.entries(citiesGrouped)
      .sort((a, b) => b[1] - a[1])
      .map(([city, count]) => `• ${city}: ${count} IP`)
      .join('\n');

    const systemPrompt = `Bạn là chuyên gia phân tích dữ liệu khách hàng cho một doanh nghiệp xử lý visa du học Hàn Quốc (visa D2-6).

NHIỆM VỤ:
Phân tích danh sách IP truy cập website thongtintruonghan.vercel.app và xác định:
1. IP nào có khả năng là **đối tác / trung tâm du học** (dấu hiệu: xem nhiều trường, dùng công cụ tư vấn, so sánh trường, ISP là VNPT/FPT, truy cập nhiều ngày)
2. IP nào là **học sinh cá nhân** (dấu hiệu: xem 1-2 trường, không dùng công cụ)
3. **Cụm địa lý** nào đáng chú ý (nhiều IP từ cùng thành phố)
4. **Hành vi bất thường** cần theo dõi

YÊU CẦU TRẢ LỜI:
- Bằng tiếng Việt, ngắn gọn, dễ đọc
- Dùng bullet points, in đậm các phát hiện quan trọng
- Kết thúc bằng khuyến nghị hành động (nên tiếp cận đối tác nào, ở đâu)
- Nếu có IP đáng nghi (truy cập bất thường), cảnh báo rõ

DỮ LIỆU:
- Tổng số IP đáng chú ý: ${totalUniqueIps}
- IP nghi là đối tác: ~${totalPartnersEstimate}

=== TOP IP ===\n${ipSummary}\n
=== PHÂN BỐ THEO THÀNH PHỐ ===\n${citySummary}`;

    const analysis = await callDeepSeek(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Phân tích danh sách IP trên và đưa ra nhận xét chi tiết về các đối tác tiềm năng.' },
      ],
      { temperature: 0.3, maxTokens: 2500, timeout: 40000 }
    );

    if (analysis) {
      // DeepSeek response might exceed Telegram's 4096 char limit, split if needed
      const maxMsgLen = 4000;
      if (analysis.length > maxMsgLen) {
        const parts = [];
        for (let i = 0; i < analysis.length; i += maxMsgLen) {
          parts.push(analysis.substring(i, i + maxMsgLen));
        }
        for (const part of parts) {
          await sendTelegramMessage(chatId, part);
        }
      } else {
        await sendTelegramMessage(chatId, analysis);
      }
    } else {
      await sendTelegramMessage(chatId, '❌ AI không phản hồi, vui lòng thử lại sau.');
    }
  } catch (err) {
    console.error('IP analysis error:', err);
    await sendTelegramMessage(chatId, '❌ Lỗi phân tích: ' + (err.message || 'Unknown error'));
  }
}

async function handleTelegramWebhook(req, res) {
  // GET — health check
  if (req.method === 'GET') {
    return res.json({ success: true, message: 'Telegram Bot Webhook is active', configured: !!getBotToken() });
  }

  // Verify webhook
  if (!verifyTelegramWebhook(req)) {
    return res.status(403).json({ error: 'Invalid webhook source' });
  }

  if (!getBotToken()) {
    return res.status(503).json({ error: 'TELEGRAM_BOT_TOKEN not configured' });
  }

  const update = req.body || {};
  const message = update.message;

  if (!message || !message.text) {
    return res.json({ success: true });
  }

  const chatId = message.chat.id;
  const text = message.text.trim();
  const command = text.split(/\s+/)[0].toLowerCase();
  const args = text.substring(command.length).trim();

  switch (command) {
    case '/start': await handleTelegramStart(chatId); break;
    case '/help': await handleTelegramHelp(chatId); break;
    case '/truong': case '/school': await handleTelegramSearchSchool(chatId, args); break;
    case '/danhsach': case '/list': case '/ds': await handleTelegramSchoolList(chatId); break;
    case '/sosanh': case '/compare': await handleTelegramCompare(chatId, args); break;
    case '/baocao': case '/report': await handleTelegramReport(chatId); break;
    case '/dieukien': case '/visa': case '/checklist': await handleTelegramVisaChecklist(chatId); break;
    case '/gui': case '/them': await handleTelegramAddStudent(chatId, args); break;
    case '/phan-tich': case '/phan_tich': case '/analyze': case '/ai': await handleTelegramIpAnalysis(chatId); break;
    case '/thongtin': case '/info': await handleTelegramSystemInfo(chatId); break;
    default:
      await sendTelegramMessage(chatId, `❓ Không hiểu lệnh "<b>${escapeHtmlTelegram(command)}</b>".\n\nGõ <code>/help</code> để xem danh sách lệnh.`);
  }

  return res.json({ success: true });
}

function escapeHtmlTelegram(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ═══════════════════════════════════════════════════
// ─── Action: Chat Web (action=chat-web)
// Chat AI widget trên website — khách hỏi về trường, visa, điều kiện...
// ═══════════════════════════════════════════════════
async function handleChatWeb(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = getDeepSeekKey();
  if (!apiKey) {
    return res.json({ success: false, error: 'AI chưa được cấu hình.', answer: 'Xin lỗi, tính năng AI chưa sẵn sàng. Vui lòng quay lại sau!' });
  }

  const { message } = req.body || {};
  if (!message || message.trim().length < 2) {
    return res.json({ success: false, error: 'Vui lòng nhập câu hỏi.', answer: '' });
  }

  try {
    const query = message.trim();

    // Lấy dữ liệu trường + visa checklist để AI có context trả lời
    const [schoolsRes, checklistRes, interviewsRes, semRes] = await Promise.all([
      supabase.from('schools').select('slug, name, name_kr, system, location, tuition, ktx, quota, region, catalog_url, website, intro, school_conditions(text), school_majors(text), school_advantages(text)').order('slug'),
      supabase.from('extra_visa_checklist').select('content, level, note').order('sort_order'),
      supabase.from('extra_interviews').select('content').order('sort_order'),
      supabase.from('semesters').select('ky, nam, title').eq('is_active', true).maybeSingle(),
    ]);

    const schools = schoolsRes.data || [];
    const checklist = checklistRes.data || [];
    const interviews = interviewsRes.data || [];
    const activeSem = semRes.data;

    // Build school summary
    const schoolSummary = schools.map(s => {
      const conditions = (s.school_conditions || []).map(c => c.text).join('; ') || 'Chưa rõ';
      const majors = (s.school_majors || []).map(m => m.text).join(', ') || 'Chưa rõ';
      const advantages = (s.school_advantages || []).map(a => a.text).join('; ') || 'Chưa có';
      return `• ${s.name}${s.name_kr ? ` (${s.name_kr})` : ''} | Hệ: ${s.system || 'Chưa rõ'} | KV: ${s.region || 'Chưa rõ'} | Học phí: ${s.tuition || 'Chưa rõ'} | KTX: ${s.ktx || 'Chưa rõ'} | Chỉ tiêu: ${s.quota || 'Chưa rõ'} | Điều kiện: ${conditions} | Chuyên ngành: ${majors} | Ưu điểm: ${advantages}`;
    }).join('\n');

    // Build visa summary
    const visaRequired = checklist.filter(c => c.level === 'Bắt buộc').map(c => `• ${c.content}${c.note ? ` (${c.note})` : ''}`).join('\n');
    const visaRecommended = checklist.filter(c => c.level === 'Khuyến khích' || c.level === 'Bổ sung').map(c => `• ${c.content}${c.note ? ` (${c.note})` : ''}`).join('\n');
    const interviewSummary = interviews.map(i => `• ${i.content}`).join('\n');

    const semesterText = activeSem ? `Kỳ ${activeSem.ky}/${activeSem.nam}` : 'Chưa cập nhật';

    const systemPrompt = `Bạn là trợ lý AI của website Thông Tin Trường Hàn (thongtintruonghan.vercel.app) — chuyên về visa du học Hàn Quốc diện D2-6.

DỮ LIỆU HIỆN TẠI:
- Kỳ tuyển sinh: ${semesterText}
- Tổng số trường: ${schools.length}

=== DANH SÁCH TRƯỜNG ===\n${schoolSummary}

=== CHECKLIST VISA D2-6 (BẮT BUỘC) ===\n${visaRequired || 'Không có dữ liệu'}

=== CHECKLIST VISA D2-6 (KHUYẾN KHÍCH) ===\n${visaRecommended || 'Không có dữ liệu'}

=== CÂU HỎI PHỎNG VẤN ===\n${interviewSummary || 'Không có dữ liệu'}

HƯỚNG DẪN TRẢ LỜI:
1. Trả lời bằng tiếng Việt, thân thiện, ngắn gọn (tối đa 3-4 câu)
2. CHỈ dùng thông tin có trong dữ liệu trên, KHÔNG bịa thêm
3. Nếu câu hỏi về trường cụ thể → tra trong danh sách và trả lời chi tiết
4. Nếu câu hỏi về visa/điều kiện/thủ tục → dùng checklist + phỏng vấn
5. Nếu không có thông tin → nói "Thông tin này chưa có trong dữ liệu hiện tại"
6. Kết thúc gợi ý: mời vào web xem chi tiết hoặc tham gia group Zalo
7. Có thể dùng emoji nhẹ nhàng 😊`;

    const answer = await callDeepSeek(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query },
      ],
      { temperature: 0.3, maxTokens: 800, timeout: 20000 }
    );

    return res.json({
      success: true,
      answer: answer || 'Xin lỗi, tôi chưa có câu trả lời cho câu hỏi này. Bạn có thể tham gia nhóm Zalo để được tư vấn trực tiếp nhé!',
    });
  } catch (err) {
    console.error('Chat web error:', err);
    return res.json({
      success: false,
      error: err.message || 'Lỗi xử lý',
      answer: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau!',
    });
  }
}  // ═══════════════════════════════════════════════════
  // ─── Action: Generate Checklist (action=generate-checklist)
  // Soạn Study Plan hoặc giải trình gap year / trượt visa bằng AI
  // ═══════════════════════════════════════════════════
  async function handleGenerateChecklist(req, res) {
    const apiKey = getDeepSeekKey();
    if (!apiKey) {
      return res.json({ success: false, error: 'AI chưa được cấu hình.', draft: null });
    }

    const { type, profile, visaType } = req.body || {};
    if (!type || !profile) {
      return res.status(400).json({ success: false, error: 'Missing type or profile', draft: null });
    }

    const prompts = {
      study_plan: {
        system: `Bạn là chuyên viên tư vấn du học Hàn Quốc với 10 năm kinh nghiệm. Viết Study Plan cho học sinh Việt Nam xin visa du học Hàn Quốc.

QUY TẮC:
- Viết bằng tiếng Hàn hoặc tiếng Anh (tuỳ học sinh chọn)
- Chi tiết, cụ thể, có mốc thời gian rõ ràng
- Cá nhân hoá theo thông tin học sinh
- Độ dài: 500-800 từ
- Tránh chung chung, phải thể hiện mục đích học thật
- Kết thúc bằng cam kết tuân thủ luật và về nước đúng hạn`,
        user: (p) => `Viết Study Plan cho học sinh sau:
- Họ tên: ${p.fullName || 'Học sinh'}
- Ngày sinh: ${p.dateOfBirth || 'Không rõ'}
- Visa: ${visaType || 'D-4-1'}
- Trình độ học vấn: ${p.educationLevel === 'university' ? 'Đại học' : 'THPT'}
- GPA: ${p.gpa || 'Không rõ'}
- Trình độ tiếng Hàn: ${p.koreanLevel || 'Chưa có'}
- Năm tốt nghiệp: ${p.graduationYear || 'Không rõ'}
${p.gapYears > 0 ? `- Khoảng trống: ${p.gapYears} năm sau tốt nghiệp` : ''}
- Bảo lãnh tài chính: ${p.sponsorIsSelf ? 'Tự thân' : 'Cha mẹ/người thân'}

Viết Study Plan chi tiết cho học sinh này.`
      },
      gap_explanation: {
        system: `Bạn là chuyên viên tư vấn du học Hàn Quốc. Viết GIẢI TRÌNH KHOẢNG TRỐNG THỜI GIAN (Gap Year Explanation) cho học sinh Việt Nam.

QUY TẮC:
- Viết bằng tiếng Hàn hoặc tiếng Anh
- Giải thích lý do gap (học thêm, đi làm, lý do sức khoẻ, gia đình...)
- Thể hiện rằng thời gian gap không làm giảm động lực học tập
- Nếu có đi làm, mô tả công việc đã làm
- Độ dài: 200-400 từ`,
        user: (p) => `Viết giải trình khoảng trống thời gian cho học sinh:
- Họ tên: ${p.fullName || 'Học sinh'}
- Tốt nghiệp: ${p.graduationYear || 'Không rõ'}
- Gap: ${p.gapYears || 0} năm
- Đã đi làm: ${p.hasWorkExperience ? 'Có' : 'Không'}
${p.hasWorkExperience ? `- Có HĐLĐ/BHXH: ${p.hasLaborContract ? 'Có' : 'Không'}` : ''}
- Trình độ tiếng Hàn: ${p.koreanLevel || 'Chưa có'}
- Visa đăng ký: ${visaType || 'D-4-1'}

Viết giải trình cho học sinh này.`
      },
      visa_rejection_explanation: {
        system: `Bạn là chuyên viên tư vấn du học Hàn Quốc. Viết GIẢI TRÌNH LÝ DO TRƯỢT VISA cho học sinh Việt Nam.

QUY TẮC:
- Viết bằng tiếng Hàn hoặc tiếng Anh
- Phân tích nguyên nhân trượt (không đổ lỗi, thể hiện hiểu rõ vấn đề)
- Trình bày cách đã khắc phục (bổ sung giấy tờ, cải thiện học lực, viết lại Study Plan...)
- Cam kết hồ sơ lần này đã hoàn chỉnh hơn
- Độ dài: 200-400 từ
- Thể hiện sự chân thành và thiện chí`,
        user: (p) => `Viết giải trình lý do trượt visa cho học sinh:
- Họ tên: ${p.fullName || 'Học sinh'}
- Lý do trượt: ${p.rejectionReason || 'Không rõ nguyên nhân'}
- Visa đăng ký: ${visaType || 'D-4-1'}
- Hồ sơ lần này đã cải thiện: có Study Plan chi tiết hơn, tài chính rõ ràng hơn

Viết giải trình cho học sinh này.`
      }
    };

    const promptConfig = prompts[type];
    if (!promptConfig) {
      return res.status(400).json({ success: false, error: `Unknown type: ${type}`, draft: null });
    }

    const draft = await callDeepSeek(
      [
        { role: 'system', content: promptConfig.system },
        { role: 'user', content: promptConfig.user(profile) }
      ],
      { temperature: 0.4, maxTokens: 1500, timeout: 30000 }
    );

    return res.json({
      success: !!draft,
      draft: draft || null,
      error: draft ? null : 'AI không phản hồi, vui lòng thử lại sau.'
    });
  }

  // ═══════════════════════════════════════════════════
  // ─── Cron: Daily Report (action=telegram-daily-report)
// Gọi endpoint này mỗi sáng bằng cron-job.org để nhận báo cáo tự động
// ═══════════════════════════════════════════════════
async function handleTelegramDailyReport(req, res) {
  // Chỉ cho phép GET (để cron-job.org dễ gọi)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify secret để tránh bị gọi trái phép
  const cronSecret = process.env.CRON_SECRET;
  const providedSecret = req.query.secret;

  if (cronSecret && providedSecret !== cronSecret) {
    return res.status(403).json({ error: 'Invalid secret' });
  }

  // Kiểm tra Telegram đã cấu hình chưa
  if (!getBotToken()) {
    return res.status(503).json({ success: false, error: 'TELEGRAM_BOT_TOKEN chưa được cấu hình.' });
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Query dữ liệu hôm qua (báo cáo sáng hôm sau)
    const [viewsRes, searchesRes, sessionsRes, ipCacheRes, newCitiesRes] = await Promise.all([
      supabase.from('analytics_page_views').select('*', { count: 'exact', head: true }).gte('created_at', yesterday),
      supabase.from('analytics_searches').select('*', { count: 'exact', head: true }).gte('created_at', yesterday),
      supabase.from('analytics_sessions').select('*', { count: 'exact', head: true }).gte('started_at', yesterday),
      supabase.from('analytics_ip_cache').select('*', { count: 'exact', head: true }).gte('last_seen', yesterday),
      supabase.from('analytics_ip_cache').select('city, region, first_seen').gte('first_seen', yesterday).not('city', 'is', null),
    ]);

    const totalViews = viewsRes.count || 0;
    const totalSearches = searchesRes.count || 0;
    const totalSessions = sessionsRes.count || 0;
    const newIps = ipCacheRes.count || 0;

    // Top schools hôm qua
    const { data: topSchoolsRaw } = await supabase
      .from('analytics_page_views')
      .select('school_slug, school_name')
      .gte('created_at', yesterday)
      .not('school_slug', 'is', null);

    const schoolCounts = {};
    for (const row of topSchoolsRaw || []) {
      if (!row.school_slug) continue;
      schoolCounts[row.school_slug] = schoolCounts[row.school_slug] || { name: row.school_name || row.school_slug, count: 0 };
      schoolCounts[row.school_slug].count++;
    }

    const topSchools = Object.entries(schoolCounts)
      .map(([slug, d]) => ({ slug, name: d.name, count: d.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Thành phố mới hôm qua
    const citySeen = new Set();
    const newCities = [];
    for (const row of newCitiesRes.data || []) {
      if (!row.city) continue;
      const key = `${row.city}|${row.region || ''}`;
      if (!citySeen.has(key)) {
        citySeen.add(key);
        newCities.push({ city: row.city, region: row.region || '' });
      }
    }

    // Gửi báo cáo qua sendDailyReport (đọc TELEGRAM_ADMIN_CHAT_ID từ env)
    const sent = await sendDailyReport({
      date: yesterday,
      totalViews,
      totalSearches,
      totalSessions,
      newIps,
      topSchools,
      newCities,
    });

    if (sent) {
      return res.json({ success: true, message: `Báo cáo ngày ${yesterday} đã gửi.` });
    } else {
      return res.json({ success: false, message: 'TELEGRAM_ADMIN_CHAT_ID chưa được cấu hình để nhận báo cáo.' });
    }
  } catch (err) {
    console.error('Daily report error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
}

// ═══════════════════════════════════════════════════
// ─── Action: Analytics (action=analytics)
// Tracking + Admin Dashboard — merged from api/analytics.js
// ═══════════════════════════════════════════════════

// ─── IP Geolocation via ip-api.com (free, 45 req/min limit) ───
function resolveIpLocation(ip) {
  return new Promise((resolve) => {
    if (!ip || ip === '' || ip === '127.0.0.1' || ip === '::1' || ip === 'localhost' ||
        ip.startsWith('10.') || ip.startsWith('172.16.') || ip.startsWith('192.168.')) {
      return resolve(null);
    }
    const url = `http://ip-api.com/json/${ip}?fields=status,message,city,regionName,country,countryCode,lat,lon,isp,org,query`;
    const req = http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.status === 'success') {
            resolve({ city: data.city || null, region: data.regionName || null, country: data.country || null, country_code: data.countryCode || null, lat: data.lat || null, lon: data.lon || null, isp: data.isp || data.org || null });
          } else resolve(null);
        } catch { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(1500, () => { req.destroy(); resolve(null); });
  });
}

async function updateIpCache(ip, userAgent, location, preciseLocation) {
  if (!ip || ip.startsWith('10.') || ip.startsWith('172.16.') || ip.startsWith('192.168.') || ip === '127.0.0.1' || ip === '::1' || ip === 'localhost' || ip === '') return;
  const now = new Date().toISOString();
  const preciseLat = preciseLocation?.lat != null ? preciseLocation.lat : null;
  const preciseLon = preciseLocation?.lon != null ? preciseLocation.lon : null;
  const preciseDistrict = preciseLocation?.district || null;
  const preciseWard = preciseLocation?.ward || null;
  const preciseAddress = preciseLocation?.address || null;
  const locationSource = preciseLocation?.source || (location?.city ? 'ip' : null);
  const { data: existing } = await supabase.from('analytics_ip_cache').select('ip, total_views').eq('ip', ip).maybeSingle();
  if (existing) {
    const updateFields = { last_seen: now, total_views: (existing.total_views || 0) + 1, user_agent: userAgent || existing.user_agent };
    if (preciseLocation) { updateFields.precise_lat = preciseLat; updateFields.precise_lon = preciseLon; updateFields.precise_district = preciseDistrict; updateFields.precise_ward = preciseWard; updateFields.precise_address = preciseAddress; updateFields.location_source = locationSource; }
    await supabase.from('analytics_ip_cache').update(updateFields).eq('ip', ip);
  } else {
    await supabase.from('analytics_ip_cache').insert({ ip: ip, city: location?.city || null, region: location?.region || null, country: location?.country || null, country_code: location?.country_code || null, lat: location?.lat || null, lon: location?.lon || null, isp: location?.isp || null, user_agent: userAgent || null, first_seen: now, last_seen: now, total_views: 1, precise_lat: preciseLat, precise_lon: preciseLon, precise_district: preciseDistrict, precise_ward: preciseWard, precise_address: preciseAddress, location_source: locationSource });
  }
}

async function checkNewCityTelegramAlert(location, clientIp, pageType) {
  try {
    const { city, region, country, country_code, isp } = location;
    if (!city) return;
    const { data: existingCity } = await supabase.from('analytics_ip_cache').select('ip').eq('city', city).order('first_seen', { ascending: true }).limit(1);
    if (existingCity && existingCity.length > 0) { if (existingCity.length === 1 && existingCity[0].ip === clientIp) { const pageLabels = { school_list: 'Danh sách trường', school_detail: 'Chi tiết trường', advisor: 'Công cụ tư vấn', compare: 'So sánh trường' }; await sendNewCityAlert({ city: city, region: region || '', country: country || 'Vietnam', ip: clientIp, isp: isp || 'Không rõ', url: pageLabels[pageType] || pageType || 'Trang chủ' }); } return; }
    const pageLabels = { school_list: 'Danh sách trường', school_detail: 'Chi tiết trường', advisor: 'Công cụ tư vấn', compare: 'So sánh trường' };
    await sendNewCityAlert({ city: city, region: region || '', country: country || 'Vietnam', ip: clientIp, isp: isp || 'Không rõ', url: pageLabels[pageType] || pageType || 'Trang chủ' });
  } catch (err) { console.error('checkNewCityTelegramAlert error:', err.message); }
}

async function handleTrackAnalytics(body, req) {
  const { type, data } = body;
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || req.connection?.remoteAddress || '';
  if (!type || !data) return { error: 'Missing type or data' };
  switch (type) {
    case 'page_view': {
      const { pageType, schoolSlug, schoolName, referrer, sessionId, userAgent } = data;
      if (!pageType) return { error: 'pageType is required' };
      const { error: viewErr } = await supabase.from('analytics_page_views').insert({ page_type: pageType, school_slug: schoolSlug || null, school_name: schoolName || null, referrer: referrer || null, session_id: sessionId || null, user_agent: userAgent || null, ip: clientIp || null });
      if (viewErr) throw viewErr;
      const preciseLocation = data.preciseLocation || null;
      try {
        const { data: cached } = await supabase.from('analytics_ip_cache').select('ip').eq('ip', clientIp).maybeSingle();
        if (cached) { await updateIpCache(clientIp, userAgent, null, preciseLocation); }
        else { const location = await resolveIpLocation(clientIp); await updateIpCache(clientIp, userAgent, location, preciseLocation); if (location?.city) { await checkNewCityTelegramAlert(location, clientIp, pageType); } }
      } catch { /* silent */ }
      break;
    }
    case 'search': {
      const { query, resultCount, hasResults, filtersUsed, searchType, sessionId } = data;
      if (!query) return { error: 'query is required' };
      await supabase.from('analytics_searches').insert({ query, result_count: resultCount || 0, has_results: hasResults !== false, filters_used: filtersUsed || null, search_type: searchType || 'text', session_id: sessionId || null });
      break;
    }
    case 'event': {
      const { eventType, eventData, schoolSlug, sessionId } = data;
      if (!eventType) return { error: 'eventType is required' };
      await supabase.from('analytics_events').insert({ event_type: eventType, event_data: eventData || null, school_slug: schoolSlug || null, session_id: sessionId || null });
      break;
    }
    case 'session': {
      const { sessionId, action, pageType, referrer, userAgent } = data;
      if (!sessionId) return { error: 'sessionId is required' };
      if (action === 'start') {
        const { data: existing } = await supabase.from('analytics_sessions').select('id, page_views').eq('session_id', sessionId).maybeSingle();
        if (existing) { await supabase.from('analytics_sessions').update({ last_activity: new Date().toISOString(), page_views: (existing.page_views || 0) + 1, user_agent: userAgent || existing.user_agent }).eq('session_id', sessionId); }
        else { await supabase.from('analytics_sessions').insert({ session_id: sessionId, ip: clientIp || null, user_agent: userAgent || null, referrer: referrer || null, landing_page: pageType || null, page_views: 1, started_at: new Date().toISOString(), last_activity: new Date().toISOString() }); }
        const preciseLocation = data.preciseLocation || null;
        try {
          const { data: cached } = await supabase.from('analytics_ip_cache').select('ip').eq('ip', clientIp).maybeSingle();
          if (cached) { await updateIpCache(clientIp, userAgent, null, preciseLocation); }
          else { const location = await resolveIpLocation(clientIp); await updateIpCache(clientIp, userAgent, location, preciseLocation); if (location?.city) { await checkNewCityTelegramAlert(location, clientIp, pageType || 'unknown'); } }
        } catch { /* silent */ }
      }
      break;
    }
    default: return { error: `Unknown type: ${type}` };
  }
  return { success: true };
}

async function handleAnalyticsAdmin(req) {
  const view = req.query.view || 'overview';
  const days = parseInt(req.query.days) || 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  if (view === 'overview') {
    const [{ count: totalViews }, { count: totalSearches }, { count: totalEvents }, { count: totalSessions }] = await Promise.all([supabase.from('analytics_page_views').select('*', { count: 'exact', head: true }).gte('created_at', since), supabase.from('analytics_searches').select('*', { count: 'exact', head: true }).gte('created_at', since), supabase.from('analytics_events').select('*', { count: 'exact', head: true }).gte('created_at', since), supabase.from('analytics_sessions').select('*', { count: 'exact', head: true }).gte('started_at', since)]);
    const { data: dailyViews } = await supabase.from('analytics_page_views').select('created_at').gte('created_at', since).order('created_at');
    const { data: dailySessions } = await supabase.from('analytics_sessions').select('started_at, page_views').gte('started_at', since);
    const { data: pageTypeBreakdown } = await supabase.from('analytics_page_views').select('page_type').gte('created_at', since);
    const pageTypes = {}; for (const row of pageTypeBreakdown || []) pageTypes[row.page_type] = (pageTypes[row.page_type] || 0) + 1;
    const { data: topSchoolsRaw } = await supabase.from('analytics_page_views').select('school_slug, school_name').gte('created_at', since).not('school_slug', 'is', null);
    const topSchools = {}; for (const row of topSchoolsRaw || []) { if (!row.school_slug) continue; topSchools[row.school_slug] = topSchools[row.school_slug] || { name: row.school_name || row.school_slug, count: 0 }; topSchools[row.school_slug].count++; }
    const topSchoolsList = Object.entries(topSchools).map(([slug, d]) => ({ slug, name: d.name, count: d.count })).sort((a, b) => b.count - a.count).slice(0, 10);
    return { overview: { totalViews: totalViews || 0, totalSearches: totalSearches || 0, totalEvents: totalEvents || 0, totalSessions: totalSessions || 0, avgViewsPerSession: totalSessions > 0 ? Math.round((totalViews || 0) / totalSessions * 10) / 10 : 0 }, topSchools: topSchoolsList, pageTypeBreakdown: Object.entries(pageTypes).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count), dailyViews, dailySessions: (dailySessions || []).map(s => ({ date: s.started_at, pageViews: s.page_views || 1 })) };
  }
  if (view === 'schools') {
    const { data: allSchoolViews } = await supabase.from('analytics_page_views').select('school_slug, school_name').gte('created_at', since).not('school_slug', 'is', null);
    const schoolCounts = {}; for (const row of allSchoolViews || []) { if (!row.school_slug) continue; schoolCounts[row.school_slug] = schoolCounts[row.school_slug] || { name: row.school_name || row.school_slug, count: 0 }; schoolCounts[row.school_slug].count++; }
    const schools = Object.entries(schoolCounts).map(([slug, d]) => ({ slug, name: d.name, count: d.count })).sort((a, b) => b.count - a.count);
    const { data: dbSchools } = await supabase.from('schools').select('slug, name, region, name_kr').in('slug', schools.map(s => s.slug));
    const schoolInfoMap = {}; for (const s of dbSchools || []) schoolInfoMap[s.slug] = s;
    const schoolsWithInfo = schools.map(s => ({ ...s, region: schoolInfoMap[s.slug]?.region || '', nameKr: schoolInfoMap[s.slug]?.name_kr || '' }));
    const { data: schoolEvents } = await supabase.from('analytics_events').select('school_slug, event_type').gte('created_at', since).not('school_slug', 'is', null);
    const schoolEventCounts = {}; for (const row of schoolEvents || []) { if (!row.school_slug) continue; schoolEventCounts[row.school_slug] = schoolEventCounts[row.school_slug] || { advisor: 0, zalo: 0, copy: 0 }; if (row.event_type === 'advisor_analyze') schoolEventCounts[row.school_slug].advisor++; if (row.event_type === 'copy_info' || row.event_type === 'copy_zalo') schoolEventCounts[row.school_slug].copy++; if (row.event_type === 'ai_zalo' || row.event_type === 'zalo_popup') schoolEventCounts[row.school_slug].zalo++; }
    return { schools: schoolsWithInfo.map(s => ({ ...s, ...(schoolEventCounts[s.slug] || { advisor: 0, zalo: 0, copy: 0 }) })), totalUnique: schools.length };
  }
  if (view === 'searches') {
    const { data: searches } = await supabase.from('analytics_searches').select('*').gte('created_at', since).order('created_at', { ascending: false }).limit(200);
    const queryCounts = {}; let totalWithResults = 0; let totalNoResults = 0; const dailySearchCounts = {};
    for (const row of searches || []) { const q = (row.query || '').toLowerCase().trim(); if (q) queryCounts[q] = (queryCounts[q] || 0) + 1; if (row.has_results) totalWithResults++; else totalNoResults++; const d = new Date(row.created_at).toISOString().split('T')[0]; dailySearchCounts[d] = (dailySearchCounts[d] || 0) + 1; }
    return { topQueries: Object.entries(queryCounts).map(([query, count]) => ({ query, count })).sort((a, b) => b.count - a.count).slice(0, 30), totalSearches: searches?.length || 0, totalWithResults, totalNoResults, dailySearches: Object.entries(dailySearchCounts).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date)), successRate: (searches?.length || 0) > 0 ? Math.round((totalWithResults / (searches?.length || 0)) * 100) : 0 };
  }
  if (view === 'events') {
    const { data: events } = await supabase.from('analytics_events').select('*').gte('created_at', since).order('created_at', { ascending: false }).limit(500);
    const eventCounts = {}; const dailyEventCounts = {};
    for (const row of events || []) { eventCounts[row.event_type] = (eventCounts[row.event_type] || 0) + 1; const d = new Date(row.created_at).toISOString().split('T')[0]; dailyEventCounts[d] = (dailyEventCounts[d] || 0) + 1; }
    return { eventBreakdown: Object.entries(eventCounts).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count), dailyEvents: Object.entries(dailyEventCounts).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date)), totalEvents: events?.length || 0 };
  }
  if (view === 'locations') {
    const { data: ipCache } = await supabase.from('analytics_ip_cache').select('city, region, country, country_code, lat, lon, total_views, location_source').gte('last_seen', since).not('city', 'is', null).order('total_views', { ascending: false });
    if (!ipCache || ipCache.length === 0) return { locations: [], regions: [], countries: [], totalLocatedViews: 0, uniqueCities: 0, gpsCount: 0, ipCount: 0 };
    const cityCounts = {}; let gpsCount = 0; let ipCount = 0;
    for (const row of ipCache) { if (!row.city) continue; const key = `${row.city}|${row.region || ''}|${row.country || ''}`; if (!cityCounts[key]) cityCounts[key] = { city: row.city, region: row.region || '', country: row.country || '', country_code: row.country_code || '', lat: row.lat, lon: row.lon, views: 0, gps: 0, ip: 0 }; cityCounts[key].views += row.total_views || 1; if (row.location_source === 'gps') { cityCounts[key].gps += row.total_views || 1; gpsCount++; } else { cityCounts[key].ip += row.total_views || 1; ipCount++; } }
    const locations = Object.values(cityCounts).sort((a, b) => b.views - a.views);
    const regionCounts = {}; for (const loc of locations) { const regionKey = loc.region || (loc.city ? 'Khu vực khác' : 'Không xác định'); if (!regionCounts[regionKey]) regionCounts[regionKey] = { region: regionKey, country: loc.country, pageViews: 0 }; regionCounts[regionKey].pageViews += loc.views; }
    const countryCounts = {}; for (const loc of locations) { const c = loc.country || 'Unknown'; if (!countryCounts[c]) countryCounts[c] = { country: c, code: loc.country_code, pageViews: 0 }; countryCounts[c].pageViews += loc.views; }
    return { locations: locations.slice(0, 50), regions: Object.values(regionCounts).sort((a, b) => b.pageViews - a.pageViews), countries: Object.values(countryCounts).sort((a, b) => b.pageViews - a.pageViews), totalLocatedViews: locations.reduce((a, b) => a + b.views, 0), uniqueCities: locations.length, gpsCount, ipCount };
  }
  if (view === 'ip-logs') {
    const { data: ips } = await supabase.from('analytics_ip_cache').select('*').gte('last_seen', since).order('last_seen', { ascending: false }).limit(200);
    const { data: allCities } = await supabase.from('analytics_ip_cache').select('city, region, first_seen').not('city', 'is', null);
    const cityFirstSeen = {}; for (const row of allCities || []) { if (!row.city) continue; const key = `${row.city}|${row.region || ''}`; if (!cityFirstSeen[key] || new Date(row.first_seen) < new Date(cityFirstSeen[key])) cityFirstSeen[key] = row.first_seen; }
    const newCities = []; for (const [key, firstSeen] of Object.entries(cityFirstSeen)) { if (new Date(firstSeen) >= new Date(since)) { const [city, region] = key.split('|'); newCities.push({ city, region: region || '' }); } }
    return { ips: (ips || []).map(ip => ({ ip: ip.ip, city: ip.city || '', region: ip.region || '', country: ip.country || '', country_code: ip.country_code || '', lat: ip.lat ? parseFloat(ip.lat) : null, lon: ip.lon ? parseFloat(ip.lon) : null, isp: ip.isp || '', userAgent: (ip.user_agent || '').substring(0, 150), firstSeen: ip.first_seen, lastSeen: ip.last_seen, totalViews: ip.total_views || 0, isNewCity: newCities.some(nc => nc.city === ip.city), preciseDistrict: ip.precise_district || '', preciseWard: ip.precise_ward || '', preciseAddress: ip.precise_address || '', locationSource: ip.location_source || 'ip' })), totalIps: ips?.length || 0, newCities: newCities.slice(0, 20), newCitiesCount: newCities.length };
  }
  if (view === 'map') {
    const { data: ips } = await supabase.from('analytics_ip_cache').select('ip, city, region, country, country_code, lat, lon, precise_lat, precise_lon, total_views, last_seen, location_source, precise_district, precise_ward').gte('last_seen', since).not('lat', 'is', null).not('lon', 'is', null);
    return { markers: (ips || []).map(ip => { const isGps = ip.location_source === 'gps'; const useLat = isGps && ip.precise_lat != null ? parseFloat(ip.precise_lat) : parseFloat(ip.lat); const useLon = isGps && ip.precise_lon != null ? parseFloat(ip.precise_lon) : parseFloat(ip.lon); return { ip: ip.ip, city: ip.city || '', region: ip.region || '', country: ip.country || '', country_code: ip.country_code || '', lat: useLat, lon: useLon, totalViews: ip.total_views || 0, lastSeen: ip.last_seen, locationSource: ip.location_source || 'ip', preciseDistrict: ip.precise_district || '', preciseWard: ip.precise_ward || '' }; }), totalMarkers: ips?.length || 0, gpsMarkers: (ips || []).filter(ip => ip.location_source === 'gps').length };
  }
  if (view === 'ab-tests') {
    const { data: assignments } = await supabase.from('analytics_events').select('event_data').eq('event_type', 'ab_assignment').gte('created_at', since).limit(5000);
    const { data: zaloEvents } = await supabase.from('analytics_events').select('event_data').eq('event_type', 'zalo_popup_open').filter('event_data->>source', 'eq', 'fab_click').gte('created_at', since).limit(5000);
    const testDefs = [{ key: 'zalo-fab', name: 'Zalo FAB', convEvent: 'zalo_popup_open', convLabel: 'Mở popup Zalo' }, { key: 'zalo-timing', name: 'Zalo Timing', convEvent: null, convLabel: null }, { key: 'advisor-btn-color', name: 'Advisor Button', convEvent: null, convLabel: null }, { key: 'header-color', name: 'Header Topbar', convEvent: null, convLabel: null }, { key: 'cta-text', name: 'CTA Text', convEvent: null, convLabel: null }, { key: 'tuition-display', name: 'Tuition Display', convEvent: null, convLabel: null }];
    const assignByTest = {}; for (const row of assignments || []) { const ed = row.event_data || {}; const t = ed.test; const v = ed.variant; if (!t || !v) continue; if (!assignByTest[t]) assignByTest[t] = { a: 0, b: 0 }; assignByTest[t][v] = (assignByTest[t][v] || 0) + 1; }
    const zaloByVariant = { a: 0, b: 0 }; for (const row of zaloEvents || []) { const v = (row.event_data || {}).variant; if (v === 'a' || v === 'b') zaloByVariant[v]++; }
    const tests = testDefs.map(def => { const aCount = assignByTest[def.key]?.a || 0; const bCount = assignByTest[def.key]?.b || 0; let aConv = 0, bConv = 0; if (def.key === 'zalo-fab') { aConv = zaloByVariant.a || 0; bConv = zaloByVariant.b || 0; } const aRate = aCount > 0 ? ((aConv / aCount) * 100).toFixed(1) + '%' : '—'; const bRate = bCount > 0 ? ((bConv / bCount) * 100).toFixed(1) + '%' : '—'; let winner = null; if (aCount > 0 && bCount > 0 && def.convEvent) { const rateA = aConv / aCount; const rateB = bConv / bCount; if (rateA > rateB) winner = 'a'; else if (rateB > rateA) winner = 'b'; } return { key: def.key, name: def.name, convLabel: def.convLabel, aCount, bCount, total: aCount + bCount, aConv, bConv, aRate, bRate, winner }; });
    return { tests };
  }
  return null;
}

// ─── Analytics Action Router ───
async function handleAnalytics(req, res) {
  if (req.method === 'POST') {
    const result = await handleTrackAnalytics(req.body || {}, req);
    if (result.error) return res.status(400).json(result);
    return res.json(result);
  }
  if (req.method === 'GET') {
    return await requireAdmin(async (req, res) => {
      const data = await handleAnalyticsAdmin(req);
      if (!data) return res.status(400).json({ error: `Unknown view: ${req.query.view}` });
      return res.json({ success: true, data });
    })(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

// ═══════════════════════════════════════════════════
// ─── Main Router ───
// ═══════════════════════════════════════════════════

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Telegram-Bot-Api-Secret-Token');

  if (req.method === 'OPTIONS') return res.status(200).end();
  // Telegram webhook + analytics cho phép GET (health check) + POST; các action khác chỉ POST
  if (req.query.action === 'telegram-webhook' || req.query.action === 'telegram-daily-report' || req.query.action === 'analytics') {
    if (req.method !== 'POST' && req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } else if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const action = req.query.action || 'advisor';

    switch (action) {
      case 'advisor': return await handleAdvisor(req, res);
      case 'generate-zalo': return await handleGenerateZalo(req, res);
      case 'search-parse': return await handleSearchParse(req, res);
      case 'generate-description': return await handleGenerateDescription(req, res);
      case 'telegram-webhook': return await handleTelegramWebhook(req, res);
      case 'chat-web': return await handleChatWeb(req, res);
      case 'generate-checklist': return await handleGenerateChecklist(req, res);
      case 'analytics': return await handleAnalytics(req, res);
      case 'telegram-daily-report': return await handleTelegramDailyReport(req, res);
      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (err) {
    console.error('/api/deepseek error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};
