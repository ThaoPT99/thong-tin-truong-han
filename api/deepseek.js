// POST /api/deepseek?action=advisor|generate-zalo|search-parse|generate-description|telegram-webhook
// Consolidated endpoint to stay within Vercel Hobby 12-function limit.
const { supabase } = require('../lib/supabase');
const { sendTelegramMessage, sendDailyReport, sendNewStudentAlert } = require('../lib/telegram');

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
📊 <code>/baocao</code> — Báo cáo tổng quan hôm nay
👤 <code>/gui [tên], [SĐT], [trường], [ghi chú]</code> — Thêm học sinh mới
❓ <code>/help</code> — Xem hướng dẫn chi tiết

<i>Liên hệ admin nếu cần hỗ trợ thêm.</i>`;
  return await sendTelegramMessage(chatId, text);
}

async function handleTelegramHelp(chatId) {
  const text = `📖 <b>Hướng dẫn sử dụng Bot</b>

<b>1. Tra cứu trường</b>
<code>/truong Osan</code> — Tìm trường theo tên
<code>/truong nữ Busan</code> — Tìm theo tên Tiếng Việt
→ Bot trả về thông tin: học phí, KTX, điều kiện, chuyên ngành

<b>2. Báo cáo tổng quan</b>
<code>/baocao</code> — Xem thống kê lượt xem, IP mới, top trường hôm nay

<b>3. Thêm học sinh mới</b>
<code>/gui Nguyễn Văn A, 0978123456, Osan, Gọi lại 2h chiều</code>
→ Bot tự động tạo học sinh trong CRM + gửi thông báo

<b>4. Cảnh báo tự động</b>
Bot sẽ tự động gửi tin nhắn khi:
• 📍 Phát hiện IP mới từ thành phố lạ
• 📊 Báo cáo tổng quan mỗi sáng`;
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

  const reportSent = await sendDailyReport({ date: today, totalViews, totalSearches, totalSessions, newIps, topSchools, newCities });

  if (!reportSent) {
    await sendTelegramMessage(chatId, '❌ Chưa cấu hình TELEGRAM_ADMIN_CHAT_ID để nhận báo cáo.');
  }
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
    case '/baocao': case '/report': await handleTelegramReport(chatId); break;
    case '/gui': await handleTelegramAddStudent(chatId, args); break;
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
// ─── Main Router ───
// ═══════════════════════════════════════════════════

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Telegram-Bot-Api-Secret-Token');

  if (req.method === 'OPTIONS') return res.status(200).end();
  // Telegram webhook cho phép GET (health check) + POST; các action khác chỉ POST
  if (req.query.action === 'telegram-webhook') {
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
      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (err) {
    console.error('/api/deepseek error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};
