// POST /api/deepseek?action=advisor|generate-zalo|search-parse|generate-description|telegram-webhook
// Consolidated endpoint to stay within Vercel Hobby 12-function limit.
const { supabase } = require('../lib/supabase');
const { requireAdmin } = require('../lib/auth');
const { sendTelegramMessage, sendDailyReport, sendNewCityAlert, sendNewStudentAlert } = require('../lib/telegram');
const http = require('http');
const { KB_FOR_CHAT, KB_FOR_STUDY_PLAN, KB_FOR_GAP, KB_FOR_REJECTION, KB_ANALYSIS_FRAMEWORK, KB_DOCUMENT_DECISION_RULES } = require('../lib/knowledge-base');
const { getDeepSeekKey, callDeepSeek, getBotToken, verifyTelegramWebhook, escapeHtmlTelegram } = require('../lib/ai/common');

// ─── Helper: Tìm case tương tự từ Case DB (Phase 4: Learning Agent) ───
async function fetchSimilarCases(profile) {
  try {
    const { visaType, gender, age, gpa, korean, visaFail } = profile || {};
    // Build query: ưu tiên case đã confirm, cùng visa type, có điểm tương đồng
    let matchConditions = 0;
    if (visaType) matchConditions++;
    if (gender) matchConditions++;
    if (korean && korean !== 'none') matchConditions++;
    if (visaFail === 'yes') matchConditions++;

    let query = supabase
      .from('advisor_cases')
      .select('student_profile, visa_type, result, top_schools, lessons_learned, notes, created_at')
      .not('result', 'eq', 'pending')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data } = await query;
    if (!data || data.length === 0) return [];

    // Score similarity client-side
    return data
      .map(function(c) {
        var p = c.student_profile || {};
        var sim = 0;
        if (p.visaType === visaType) sim += 3;
        if (p.gender === gender) sim += 2;
        if (p.korean === korean) sim += 2;
        if (Math.abs((p.age || 0) - (age || 0)) <= 2) sim += 1;
        if (Math.abs((p.gpa || 0) - (gpa || 0)) <= 0.5) sim += 1;
        if (p.visaFail === visaFail) sim += 2;
        return { case: c, similarity: sim };
      })
      .filter(function(c) { return c.similarity >= 3; })
      .sort(function(a, b) { return b.similarity - a.similarity; })
      .slice(0, 3)
      .map(function(c) { return c.case; });
  } catch (e) {
    console.error('fetchSimilarCases error:', e.message);
    return [];
  }
}

// ─── Action: Advisor — CÁ NHÂN HOÁ theo visa type ───
async function handleAdvisor(req, res) {
  const apiKey = getDeepSeekKey();
  if (!apiKey) {
    return res.status(503).json({ success: false, error: 'DEEPSEEK_API_KEY chưa được cấu hình.' });
  }

  const profile = req.body || {};
  const { gender, age, gpa, absences, korean, visaFail, region, budget, priorities, visaType } = profile;
  const vt = visaType || 'D2-6';

  // ─── Fetch similar past cases (Learning Agent) ───
  const similarCases = await fetchSimilarCases(profile);

  // ─── Filter schools by visa_type ───
  let schoolsQuery = supabase.from('schools').select('*').order('slug');
  if (vt === 'D4-1') {
    schoolsQuery = schoolsQuery.eq('visa_type', 'D4-1');
  } else {
    // D2-6 hoặc default — lấy trường D2-6
    schoolsQuery = schoolsQuery.eq('visa_type', 'D2-6');
  }

  const [schoolsRes, profilesRes] = await Promise.all([
    schoolsQuery,
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

  // ─── Visa type labels ───
  const visaLabels = {
    'D2-6': 'Visa D2-6 (trao đổi sinh viên)',
    'D4-1': 'Visa D4-1 (học tiếng Hàn)',
  };
  const visaLabel = visaLabels[vt] || vt;

  const systemPrompt = `Bạn là chuyên gia tư vấn du học Hàn Quốc, chuyên về ${visaLabel}. Làm việc cho một trung tâm tư vấn du học.\n\nDữ liệu ${schools.length} trường Hàn Quốc đang tuyển sinh kỳ này (${visaLabel}):\n\n${schoolTexts}\n\nNHIỆM VỤ:\nPhân tích hồ sơ học sinh và đề xuất Top 3 trường phù hợp nhất.\n\nYÊU CẦU TRẢ LỜI:\n1. **Top 3 trường phù hợp nhất** kèm số % phù hợp\n2. Với mỗi trường, nêu:\n   - **Lý do phù hợp** (2-3 ý, dựa trên hồ sơ thực tế)\n   - **Rủi ro cần kiểm tra** (nếu có)\n3. Kết luận ngắn: trường nào nên ưu tiên nhất\n\nQUY TẮC:\n- Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu\n- KHÔNG thêm thông tin không có trong dữ liệu\n- Nếu hồ sơ có vấn đề (tuổi cao, GPA thấp, trượt visa) → cảnh báo rõ\n- Ưu tiên trường phù hợp với: khu vực, giới tính, học lực, ngân sách`;

  const priorityText = (priorities && priorities.length) ? `Ưu tiên: ${priorities.join(', ')}.` : '';

  // ─── Thêm case tương tự vào prompt (RAG từ Case DB) ───
  let caseContext = '';
  if (similarCases.length > 0) {
    caseContext = '\n\n=== CASE TƯƠNG TỰ (KẾT QUẢ THỰC TẾ) ===';
    similarCases.forEach(function(c, i) {
      var p = c.student_profile || {};
      var schools = (c.top_schools || []).slice(0, 3).map(function(s) { return s.name || ''; }).join(', ');
      var lessons = (c.lessons_learned || []).length ? 'Bài học: ' + c.lessons_learned.join('; ') : '';
      caseContext += '\nCase ' + (i + 1) + ' (KQ: ' + (c.result === 'approved' ? 'ĐÃ ĐỖ VISA' : c.result === 'rejected' ? 'TRƯỢT VISA' : c.result || 'Unknown') + '):';
      caseContext += '\n  • Hồ sơ: ' + (p.gender === 'female' ? 'Nữ' : 'Nam') + ', ' + (p.age || '?') + 't, GPA ' + (p.gpa || '?') + ', Tiếng Hàn: ' + (p.korean || '?') + (p.visaFail === 'yes' ? ', ĐÃ trượt visa' : '');
      caseContext += '\n  • Trường đề xuất: ' + (schools || 'Không rõ');
      caseContext += '\n  • Ghi chú: ' + (c.notes || 'Không có');
      if (lessons) caseContext += '\n  • ' + lessons;
    });
    caseContext += '\n\nLƯU Ý: Dùng các case trên THAM KHẢO để đưa ra lời khuyên chính xác hơn. Đây là kết quả thực tế từ các hồ sơ tương tự.';
  }

  const userMessage = `Phân tích hồ sơ học sinh sau (${visaLabel}):\n- Giới tính: ${gender || 'Không rõ'}\n- Tuổi: ${age || 'Không rõ'}\n- GPA: ${gpa || 'Không rõ'}\n- Số buổi nghỉ: ${absences || 'Không rõ'}\n- Tiếng Hàn: ${korean || 'Chưa có'}\n- Đã từng trượt visa: ${visaFail === 'yes' ? 'Có' : 'Không'}\n- Khu vực mong muốn: ${region || 'Không ưu tiên'}\n- Ngân sách: ${budget || 'Trung bình'}\n${priorityText}${caseContext}`;

  const advice = await callDeepSeek(
    [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
    { temperature: 0.3, maxTokens: 2000, timeout: 30000 }
  );

  // ─── Save case to Case DB (Phase 4: Learning Agent) ───
  if (advice) {
    try {
      // Parse top schools from advice (simple heuristic: find school names)
      const topSchoolIds = [];
      const topSchoolNames = (advice.match(/\*\*\d+\.\s*([^*]+)/g) || [])
        .map(function(m) { return m.replace(/^\*\*\d+\.\s*/, '').split('—')[0].trim(); })
        .filter(Boolean)
        .slice(0, 3);

      // Build top_schools array
      var schoolsList = topSchoolNames.map(function(name, idx) {
        return { name: name, rank: idx + 1, score: null, level: null };
      });

      await supabase.from('advisor_cases').insert({
        student_name: req.body.studentName || '',
        student_phone: req.body.studentPhone || '',
        student_profile: profile,
        visa_type: vt,
        top_schools: schoolsList,
        ai_advice: advice.substring(0, 3000), // Giới hạn độ dài
        result: 'pending',
        tags: profile.visaFail === 'yes' ? ['visa_fail'] : (profile.gpa && profile.gpa < 5.0 ? ['low_gpa'] : []),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } catch (caseErr) {
      // Silent fail — không để lỗi save case ảnh hưởng response
      console.error('Save advisor case error:', caseErr.message);
    }
  }

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


=== KIẾN THỨC NỀN TẢNG XỬ LÝ HỒ SƠ ===
${KB_FOR_CHAT}

HƯỚNG DẪN TRẢ LỜI:
1. Trả lời bằng tiếng Việt, thân thiện, ngắn gọn (tối đa 3-4 câu)
2. CHỈ dùng thông tin có trong dữ liệu trên, KHÔNG bịa thêm
3. Nếu câu hỏi về trường cụ thể → tra trong danh sách và trả lời chi tiết
4. Nếu câu hỏi về visa/điều kiện/thủ tục → dùng checklist + phỏng vấn
5. Nếu câu hỏi về quy trình làm hồ sơ → dùng kiến thức nền tảng + module A1-A6 để hướng dẫn từng bước
6. Nếu câu hỏi về phân tích hồ sơ → dùng framework phân tích 6 nhóm để đánh giá
7. Nếu không có thông tin → nói "Thông tin này chưa có trong dữ liệu hiện tại"
8. Kết thúc gợi ý: mời vào web xem chi tiết hoặc tham gia group Zalo
9. Có thể dùng emoji nhẹ nhàng 😊`;

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
// ─── TOOL CALLING — Definitions for Student Agent ───
// Phase 1: search schools, get detail, compare, update profile, checklist, filter
// ═══════════════════════════════════════════════════

const STUDENT_TOOLS = {
  search_schools: {
    description: 'Tìm kiếm trường Hàn Quốc theo tên, khu vực hoặc hệ đào tạo',
    params: {
      query: { type: 'string', description: 'Tên trường cần tìm (có thể không đầy đủ)', required: true },
      region: { type: 'string', description: 'Lọc theo khu vực: seoul, near-seoul, busan, gyeonggi, incheon, gwangju, gangwon,...', required: false },
      system: { type: 'string', description: 'Hệ đào tạo: D2-6 hoặc D4-1', required: false },
      limit: { type: 'number', description: 'Số kết quả tối đa (mặc định 5)', required: false, default: 5 },
    },
    handler: async function(params) {
      var q = supabase.from('schools').select('id, slug, name, name_kr, system, location, region, tuition, ktx, quota, intro');
      if (params.query) q = q.or('name.ilike.%' + params.query + '%,name_kr.ilike.%' + params.query + '%,slug.ilike.%' + params.query + '%');
      if (params.region) q = q.eq('region', params.region);
      if (params.system) q = q.eq('visa_type', params.system);
      if (params.limit) q = q.limit(Math.min(params.limit, 10));
      else q = q.limit(5);
      var { data } = await q;
      return (data || []).map(function(s) {
        return {
          id: s.id, slug: s.slug, name: s.name, nameKr: s.name_kr,
          system: s.system, location: s.location, region: s.region,
          tuition: s.tuition, ktx: s.ktx, quota: s.quota, intro: s.intro,
        };
      });
    },
  },

  get_school_detail: {
    description: 'Xem chi tiết 1 trường: học phí, KTX, điều kiện, chuyên ngành, ưu điểm',
    params: {
      slug: { type: 'string', description: 'Slug của trường (VD: osan, induk)', required: true },
    },
    handler: async function(params) {
      var { data: school } = await supabase
        .from('schools')
        .select('*, school_conditions(text), school_majors(text), school_advantages(text), school_conversions(text), school_documents(text), school_partners(code, name)')
        .eq('slug', params.slug)
        .single();
      if (!school) return null;
      var { data: ap } = await supabase
        .from('school_advisor_profiles')
        .select('*')
        .eq('school_id', school.id)
        .maybeSingle();
      return {
        id: school.id, slug: school.slug, name: school.name, nameKr: school.name_kr, nameEn: school.name_en,
        system: school.system, location: school.location, region: school.region,
        tuition: school.tuition, ktx: school.ktx, quota: school.quota,
        website: school.website, catalogUrl: school.catalog_url, intro: school.intro,
        conditions: (school.school_conditions || []).map(function(c) { return c.text; }),
        majors: (school.school_majors || []).map(function(m) { return m.text; }),
        advantages: (school.school_advantages || []).map(function(a) { return a.text; }),
        conversions: (school.school_conversions || []).map(function(c) { return c.text; }),
        documents: (school.school_documents || []).map(function(d) { return d.text; }),
        advisorProfile: ap ? {
          gender: ap.gender, costLevel: ap.cost_level, visaChance: ap.visa_chance,
          jobOpportunity: ap.job_opportunity, e7Opportunity: ap.e7_opportunity,
          region: ap.region, tags: ap.tags, notes: ap.notes,
        } : null,
      };
    },
  },

  compare_schools: {
    description: 'So sánh 2 trường Hàn Quốc',
    params: {
      slug1: { type: 'string', description: 'Slug trường thứ nhất', required: true },
      slug2: { type: 'string', description: 'Slug trường thứ hai', required: true },
    },
    handler: async function(params) {
      var { data: schools } = await supabase
        .from('schools')
        .select('*, school_conditions(text), school_majors(text), school_advantages(text)')
        .in('slug', [params.slug1, params.slug2]);
      if (!schools || schools.length < 2) return { error: 'Không tìm thấy đủ 2 trường' };
      var [s1, s2] = schools;
      var formatOne = function(s) {
        return {
          name: s.name, nameKr: s.name_kr, slug: s.slug,
          system: s.system, location: s.location, region: s.region,
          tuition: s.tuition, ktx: s.ktx, quota: s.quota,
          conditions: (s.school_conditions || []).map(function(c) { return c.text; }),
          majors: (s.school_majors || []).slice(0, 8).map(function(m) { return m.text; }),
          advantages: (s.school_advantages || []).map(function(a) { return a.text; }),
        };
      };
      return { school1: formatOne(s1), school2: formatOne(s2) };
    },
  },



  interview_simulator: {
    description: 'Luyen phong van visa KVAC voi AI. Dung tool nay khi hoc sinh muon luyen phong van.',
    params: {
      action: { type: 'string', description: 'start (bat dau) hoac answer (tra loi cau hoi)', required: true },
      answer: { type: 'string', description: 'Cau tra loi cua hoc sinh (chi can khi action=answer)', required: false },
    },
    handler: async function(params, profile) {
      var vt = profile.visaType || 'D4-1';
      var p = {
        fullName: profile.fullName || 'Hoc sinh', visaType: vt,
        educationLevel: profile.educationLevel || 'THPT', koreanLevel: profile.koreanLevel || 'none',
        gpa: profile.gpa || null, hasVisaRejection: profile.hasVisaRejection || false,
        gapYears: profile.gapYears || 0, chosenSchool: profile.chosenSchool || '', chosenMajor: profile.chosenMajor || '',
      };
      var topics = {
        'D4-1': ['Gioi thieu ban than va muc dich du hoc','Ly do chon Han Quoc de hoc tieng','Tai sao khong hoc tieng Han o Viet Nam?','Ke hoach hoc tieng cu the va muc tieu TOPIK','Sau khi hoc tieng xong du dinh lam gi?','Tai chinh va nguoi bao lanh'],
        'D2-6': ['Gioi thieu ban than va muc dich du hoc','Ly do chon Han Quoc','Tai sao chon truong va nganh nay?','Ke hoach hoc tap cu the tu tung hoc ky','Tai chinh va nguoi bao lanh','Du dinh sau khi tot nghiep'],
      };
      var interviewTopics = topics[vt] || topics['D4-1'];
      if (params.action === 'start') {
        var topicsText = interviewTopics.map(function(t, i) { return (i+1) + '. ' + t; }).join('\n');
        var sys = 'Ban la nhan vien phong van visa Han Quoc tai KVAC. Phong van hs xin visa ' + vt + '.\nTHONG TIN HS: ' + p.fullName + ', ' + (p.educationLevel === 'university' ? 'DH' : 'THPT') + (p.gpa ? ', GPA: ' + p.gpa : '') + ', Tieng Han: ' + p.koreanLevel + (p.chosenSchool ? ', Truong: ' + p.chosenSchool : '') + (p.chosenMajor ? ', Nganh: ' + p.chosenMajor : '') + (p.hasVisaRejection ? ', DA truot visa' : '') + '\nCAC CAU HOI:\n' + topicsText + '\nHay bat dau bang cau hoi DAU TIEN. Chi hoi 1 cau, bang tieng Viet.';
        var result = await callDeepSeek([{ role: 'system', content: sys }, { role: 'user', content: 'Hoi cau hoi dau tien.' }], { temperature: 0.5, maxTokens: 400, timeout: 15000 });
        if (!result) return { error: 'AI khong phan hoi, vui long thu lai.' };
        return { type: 'interview_question', questionNumber: 1, totalQuestions: interviewTopics.length, question: result.replace(/```[sS]*?```/g, '').trim(), message: 'Toi se phong van ban. Hay tra loi tu nhien nhe!' };
      }
      if (params.action === 'answer') {
        var sys2 = 'Ban la nhan vien phong van visa Han Quoc tai KVAC. Danh gia cau tra loi cua hs.\nHS: ' + p.fullName + ', visa ' + vt + '\nCAU TRA LOI: "' + (params.answer || '') + '"\nNHIEM VU: 1. Danh gia (2-3 cau, tinh than xay dung) 2. Hoi cau tiep theo (chi 1 cau) 3. Neu het, bao KET_THUC';
        var result2 = await callDeepSeek([{ role: 'system', content: sys2 }, { role: 'user', content: 'Danh gia va hoi cau tiep theo.' }], { temperature: 0.4, maxTokens: 500, timeout: 15000 });
        if (!result2) return { error: 'AI khong phan hoi.' };
        var cleaned = result2.replace(/```[sS]*?```/g, '').trim();
        if (cleaned.includes('KET_THUC') || cleaned.includes('ket thuc')) {
          return { type: 'interview_complete', feedback: cleaned.replace('KET_THUC', '').trim(), message: 'Cam on ban da tham gia phong van!' };
        }
        return { type: 'interview_answer', feedback: cleaned, message: 'Hay tra loi cau hoi tiep theo!' };
      }
      return { error: 'Action khong hop le.' };
    },
  },

  upload_document: {
    description: 'Kiem tra trang thai giay to ho so can chuan bi',
    params: {
      docType: { type: 'string', description: 'De trong de xem tat ca, hoac nhap ten giay to', required: false },
    },
    handler: async function(params, profile) {
      if (!profile || !profile.email) return { error: 'Can dang nhap de kiem tra giay to.' };
      var { data: sp } = await supabase.from('student_profiles').select('id').eq('email', profile.email).maybeSingle();
      if (!sp) return { error: 'Khong tim thay tai khoan.' };
      var { data: docs } = await supabase.from('student_documents').select('doc_type, status, file_url').eq('student_id', sp.id);
      var docMap = {};
      for (var di = 0; di < (docs || []).length; di++) docMap[docs[di].doc_type] = docs[di];
      var required = [
        { type: 'passport', label: 'Ho chieu' }, { type: 'id_card', label: 'CCCD/CMND' },
        { type: 'photo', label: 'Anh 3.5x4.5' }, { type: 'household_registration', label: 'So ho khau' },
        { type: 'birth_certificate', label: 'Giay khai sinh' }, { type: 'diploma', label: 'Bang THPT' },
        { type: 'transcript', label: 'Hoc ba' }, { type: 'admission_letter', label: 'Thu nhap hoc' },
        { type: 'savings_book', label: 'So tiet kiem' }, { type: 'bank_statement', label: 'Xac nhan so du' },
        { type: 'income_proof', label: 'Giay to thu nhap' }, { type: 'health_check', label: 'Kham lao phoi' },
        { type: 'study_plan', label: 'Study Plan' },
      ];
      var statusLabels = { 'not_ready': 'Chua co', 'ready': 'Da co', 'translated': 'Da dich', 'notarized': 'Da cong chung', 'legalized': 'Da hop phap hoa', 'uploaded': 'Da upload' };
      var statusColors = { 'not_ready': '#dc2626', 'ready': '#2563eb', 'translated': '#7c3aed', 'notarized': '#7c3aed', 'legalized': '#059669', 'uploaded': '#059669' };
      var filtered = required;
      if (params.docType) {
        var dt = params.docType.toLowerCase();
        filtered = required.filter(function(d) { return d.type.includes(dt) || d.label.toLowerCase().includes(dt); });
      }
      var result = filtered.map(function(doc) {
        var ex = docMap[doc.type];
        var s = ex ? ex.status : 'not_ready';
        return { type: doc.type, label: doc.label, status: statusLabels[s] || s, statusRaw: s, color: statusColors[s] || '#6b7280', hasFile: !!(ex && ex.file_url) };
      });
      var ready = result.filter(function(d) { return d.statusRaw === 'uploaded' || d.statusRaw === 'legalized'; }).length;
      return { type: 'document_status', documents: result, summary: ready + '/' + result.length + ' giay to da san sang', message: ready === result.length ? 'Tat ca giay to da san sang!' : 'Con ' + (result.length - ready) + ' giay to can chuan bi.' };
    },
  },



  generate_study_plan: {
    description: 'Soan Study Plan cho hoc sinh dua tren ho so va cau tra loi cua ban',
    params: {
      type: { type: 'string', description: 'Loai: study_plan (mac dinh), gap_explanation, visa_rejection_explanation', required: false },
      visaType: { type: 'string', description: 'D-4-1 hoac D2-6', required: false },
    },
    handler: async function(params, profile) {
      if (!profile || !profile.fullName) return { error: 'Can co ho so hoc sinh de soan Study Plan. Hay nhap thong tin truoc.' };
      try {
        var vt = params.visaType || profile.visaType || 'D-4-1';
        var type = params.type || 'study_plan';

        // Build system prompt based on type & visaType — same logic as handleGenerateChecklist
        var systemPrompt, userPrompt;

        if (type === 'study_plan') {
          var baseRules = 'QUY TẮC CHUNG:\n- Viết bằng tiếng Hàn nếu học sinh có chứng chỉ/đang học tiếng Hàn, nếu không thì viết bằng tiếng Anh\n- Chi tiết, cụ thể, có mốc thời gian rõ ràng\n- Cá nhân hoá theo thông tin học sinh\n- Tránh chung chung, phải thể hiện mục đích học thật\n- Kết thúc bằng cam kết tuân thủ luật và về nước đúng hạn\n- TUYỆT ĐỐI KHÔNG đề cập vấn đề tài chính trong Study Plan (tài chính là phần riêng của hồ sơ)';
          var studyPlanPrompts = {
            'D-4-1': 'Bạn là chuyên viên tư vấn du học Hàn Quốc với 10 năm kinh nghiệm. Viết Study Plan cho học sinh Việt Nam xin visa D-4-1 (học tiếng Hàn).\n\nMỤC TIÊU CỦA STUDY PLAN D-4-1:\n- Thể hiện động lực học tiếng Hàn mạnh mẽ: tại sao phải học tại Hàn Quốc?\n- Có mục tiêu TOPIK rõ ràng theo từng giai đoạn (VD: 6 tháng → TOPIK 2, 1 năm → TOPIK 3...)\n- Kế hoạch học tập cụ thể: mỗi ngày học mấy tiếng, phương pháp học gì?\n- KHÔNG tập trung vào ngành nghề hay nghiên cứu — đây là visa học tiếng\n- Sau khóa học sẽ về Việt Nam hoặc có dự định tương lai rõ ràng (không ở lại bất hợp pháp)\n- Độ dài: 500-700 từ\n\n' + baseRules,
            'D-2': 'Bạn là chuyên viên tư vấn du học Hàn Quốc với 10 năm kinh nghiệm. Viết Study Plan cho học sinh Việt Nam xin visa D-2 (đại học chính quy).\n\nMỤC TIÊU CỦA STUDY PLAN D-2:\n- Thể hiện động lực học tập nghiêm túc: tại sao chọn Hàn Quốc để học đại học?\n- Chứng minh năng lực học thuật: GPA, chứng chỉ tiếng, kiến thức nền tảng\n- Lý do chọn ngành cụ thể, liên quan đến định hướng nghề nghiệp\n- Kế hoạch học tập chi tiết theo từng học kỳ (mục tiêu GPA, thực tập, ngoại khóa...)\n- Kế hoạch sau tốt nghiệp: về Việt Nam làm việc hoặc xin E7 (không ở lại bất hợp pháp)\n- Có thể đề cập mong muốn học lên cao học nếu phù hợp\n- Độ dài: 800-1200 từ\n\n' + baseRules,
            'D4-to-D2': 'Bạn là chuyên viên tư vấn du học Hàn Quốc với 10 năm kinh nghiệm. Viết Study Plan cho học sinh Việt Nam đang học tiếng tại Hàn với visa D-4-1, muốn chuyển lên visa D-2 (chuyển đổi).\n\nMỤC TIÊU CỦA STUDY PLAN CHUYỂN ĐỔI:\n- Thể hiện sự tiến bộ trong quá trình học tiếng Hàn\n- Giải thích lý do chọn ngành học đại học cụ thể\n- Kế hoạch học tập chi tiết khi lên đại học\n- Chứng minh đủ năng lực tiếng Hàn để theo học đại học\n- Kế hoạch sau tốt nghiệp: về Việt Nam hoặc xin visa E7 (không ở lại bất hợp pháp)\n- Độ dài: 800-1000 từ\n\n' + baseRules,
          };
          systemPrompt = studyPlanPrompts[vt] || studyPlanPrompts['D-4-1'];
          userPrompt = 'Viết Study Plan cho học sinh:\n- Họ tên: ' + (profile.fullName || 'Học sinh') + '\n- Giới tính: ' + (profile.gender || 'Không rõ') + '\n- GPA: ' + (profile.gpa || 'Không rõ') + '\n- Trình độ tiếng Hàn: ' + (profile.koreanLevel || 'Chưa có') + '\n- Học vấn: ' + (profile.educationLevel === 'university' ? 'Đại học' : 'THPT') + '\n- Năm tốt nghiệp: ' + (profile.graduationYear || 'Không rõ') + (profile.gapYears > 0 ? '\n- Khoảng trống: ' + profile.gapYears + ' năm' : '') + (profile.hasVisaRejection ? '\n- Đã từng trượt visa: Có' : '') + '\n- Visa: ' + vt + '\n\n' + (KB_FOR_STUDY_PLAN || '');
        } else if (type === 'gap_explanation') {
          systemPrompt = 'Bạn là chuyên viên tư vấn du học Hàn Quốc. Viết GIẢI TRÌNH KHOẢNG TRỐNG THỜI GIAN (Gap Year Explanation) cho học sinh Việt Nam.\n\nQUY TẮC:\n- Viết bằng tiếng Hàn hoặc tiếng Anh\n- Lý do gap phải hợp lý với hoàn cảnh: học thêm ngoại ngữ/kỹ năng, đi làm tích lũy kinh nghiệm, chờ đủ tuổi/điều kiện, lý do sức khoẻ cá nhân\n- TUYỆT ĐỐI KHÔNG viện lý do tài chính gia đình khó khăn\n- Thể hiện rằng thời gian gap là giai đoạn chuẩn bị cho việc du học\n- Nếu có đi làm, mô tả công việc đã làm và kinh nghiệm học được\n- Độ dài: 200-400 từ';
          userPrompt = 'Viết giải trình khoảng trống thời gian cho học sinh:\n- Họ tên: ' + (profile.fullName || 'Học sinh') + '\n- Tốt nghiệp: ' + (profile.graduationYear || 'Không rõ') + '\n- Gap: ' + (profile.gapYears || 0) + ' năm\n- Đã đi làm: ' + (profile.hasWorkExperience ? 'Có' : 'Không') + (profile.hasWorkExperience && profile.workCompany ? '\n- Công ty: ' + profile.workCompany : '') + (profile.hasWorkExperience && profile.workPosition ? '\n- Vị trí: ' + profile.workPosition : '') + (profile.workDuration ? '\n- Thời gian làm: ' + profile.workDuration + ' năm' : '') + '\n- Trình độ tiếng Hàn: ' + (profile.koreanLevel || 'Chưa có') + '\n- Visa: ' + vt + '\n\n' + KB_FOR_GAP;
        } else if (type === 'visa_rejection_explanation') {
          systemPrompt = 'Bạn là chuyên viên tư vấn du học Hàn Quốc. Viết GIẢI TRÌNH LÝ DO TRƯỢT VISA cho học sinh Việt Nam.\n\nQUY TẮC:\n- Viết bằng tiếng Hàn hoặc tiếng Anh\n- Phân tích nguyên nhân trượt, thể hiện hiểu rõ vấn đề\n- Dựa vào lý do trượt cụ thể để suy luận cách khắc phục\n- TUYỆT ĐỐI KHÔNG dùng mẫu chung chung, phải cá nhân hoá\n- Cam kết hồ sơ lần này đã hoàn chỉnh hơn\n- Độ dài: 200-400 từ\n- Thể hiện sự chân thành và thiện chí';
          userPrompt = 'Viết giải trình lý do trượt visa cho học sinh:\n- Họ tên: ' + (profile.fullName || 'Học sinh') + '\n- Lý do trượt: ' + (profile.rejectionReason || 'Không rõ nguyên nhân') + '\n- Visa: ' + vt + '\n\n' + KB_FOR_REJECTION;
        } else {
          return { error: 'Loai Study Plan khong hop le. Chi ho tro: study_plan, gap_explanation, visa_rejection_explanation.' };
        }

        var draft = await callDeepSeek(
          [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          { temperature: 0.4, maxTokens: 1500, timeout: 30000 }
        );

        if (draft) {
          return { type: 'study_plan_draft', draft: draft.substring(0, 3000), message: 'Day la ban nhap Study Plan cua ban. Ban co the yeu cau chinh sua hoac luu lai.' };
        }
        return { error: 'AI khong phan hoi. Vui long thu lai.' };
      } catch (e) {
        return { error: 'Loi ket noi AI: ' + e.message };
      }
    },
  },

  get_advisor_history: {
    description: 'Xem lich su tu van AI truoc day (cac phan tich ho so da thuc hien)',
    params: {
      limit: { type: 'number', description: 'So luong ket qua toi da', required: false },
    },
    handler: async function(params, profile) {
      if (!profile || !profile.email) return { error: 'Can dang nhap de xem lich su tu van.' };
      // Look up phone from student_profiles by email, then query advisor_cases
      var phone = profile.phone || '';
      if (!phone) {
        var { data: sp } = await supabase
          .from('student_profiles')
          .select('phone')
          .eq('email', profile.email)
          .maybeSingle();
        if (sp && sp.phone) phone = sp.phone;
      }
      if (!phone) return { error: 'Khong tim thay so dien thoai lien ket voi tai khoan.' };
      var { data: cases } = await supabase
        .from('advisor_cases')
        .select('id, student_name, visa_type, top_schools, result, ai_advice, created_at')
        .eq('student_phone', phone)
        .order('created_at', { ascending: false })
        .limit(params.limit || 10);
      if (!cases || cases.length === 0) {
        return { message: 'Ban chua co lich su tu van AI nao. Hay dung cong cu Phan tich ho so truoc.' };
      }
      return {
        type: 'advisor_history',
        cases: cases.map(function(c) {
          return {
            id: c.id, studentName: c.student_name || 'Khong ro',
            visaType: c.visa_type || 'Khong ro',
            schools: (c.top_schools || []).slice(0, 3).map(function(s) { return s.name || ''; }).filter(Boolean).join(', '),
            result: c.result || 'pending',
            advicePreview: (c.ai_advice || '').substring(0, 200),
            createdAt: c.created_at,
          };
        }),
      };
    },
  },

  check_deadlines: {
    description: 'Xem cac han nop giay to sap toi va nhac nho con dang do',
    params: {},
    handler: async function(params, profile) {
      if (!profile || !profile.email) return { error: 'Can dang nhap de xem han nop giay to.' };
      var { data: sp } = await supabase.from('student_profiles').select('id').eq('email', profile.email).maybeSingle();
      if (!sp) return { error: 'Khong tim thay tai khoan.' };
      var { data: reminders } = await supabase
        .from('reminders')
        .select('id, title, description, due_date, reminder_type, is_completed')
        .eq('student_id', sp.id)
        .order('due_date', { ascending: true });
      if (!reminders || reminders.length === 0) {
        return { message: 'Ban chua co nhac nho nao. Hay tao nhac nho bang tool set_reminder.' };
      }
      var now = new Date();
      var typeLabels = {
        document: 'Giay to', submission: 'Nop ho so', interview: 'Phong van',
        health_check: 'Suc khoe', visa_appointment: 'Hen visa', other: 'Khac',
      };
      var rows = reminders.map(function(r) {
        var due = new Date(r.due_date);
        var daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
        var statusColor = daysLeft < 0 ? '#dc2626' : daysLeft <= 7 ? '#d97706' : '#059669';
        var statusText = daysLeft < 0 ? 'Qua han!' : daysLeft <= 7 ? 'Sap den han' : 'Con ' + daysLeft + ' ngay';
        return {
          id: r.id, title: r.title, description: r.description || '',
          dueDate: r.due_date, type: typeLabels[r.reminder_type] || r.reminder_type,
          daysLeft: daysLeft, statusColor: statusColor, statusText: statusText,
          completed: r.is_completed,
        };
      });
      var overdue = rows.filter(function(r) { return r.daysLeft < 0 && !r.completed; }).length;
      var upcoming = rows.filter(function(r) { return r.daysLeft >= 0 && r.daysLeft <= 7 && !r.completed; }).length;
      return {
        type: 'deadlines',
        reminders: rows,
        summary: 'Co ' + rows.length + ' nhac nho',
        warnings: overdue > 0 ? (overdue + ' nhac nho qua han!') : (upcoming > 0 ? (upcoming + ' nhac nho sap den han trong 7 ngay') : 'Khong co nhac nho nao sap den han'),
      };
    },
  },
  get_checklist: {
    description: 'Xem checklist giấy tờ và tiến độ hồ sơ hiện tại',
    params: {},
    handler: async function() {
      return { message: 'Hãy yêu cầu cụ thể: "Mục A1 còn thiếu gì?" hoặc "Tôi cần chuẩn bị giấy tờ gì?"' };
    },
  },

  apply_school: {
    description: 'Gửi đơn đăng ký nhập học vào một trường Hàn Quốc',
    params: {
      schoolName: { type: 'string', description: 'Tên trường muốn gửi đơn', required: true },
      fullName: { type: 'string', description: 'Họ tên đầy đủ (tiếng Việt)', required: true },
      phone: { type: 'string', description: 'Số điện thoại', required: false },
      email: { type: 'string', description: 'Email', required: false },
      major: { type: 'string', description: 'Ngành/chuyên ngành muốn học', required: false },
    },
    handler: async function(params, profile) {
      // Look up student by email from profile
      if (!profile || !profile.email) return { error: 'Cần đăng nhập để gửi đơn. Vui lòng nhập email trong hồ sơ.' };
      var { data: studentProfile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('email', profile.email)
        .maybeSingle();
      if (!studentProfile) return { error: 'Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.' };
      var profileId = studentProfile.id;

      // Look up school by name
      var schoolQuery = params.schoolName || '';
      var { data: schools } = await supabase
        .from('schools')
        .select('id, name, slug')
        .or('name.ilike.%' + schoolQuery + '%,name_kr.ilike.%' + schoolQuery + '%')
        .limit(3);
      var schoolId = (schools && schools.length > 0) ? schools[0].id : null;

      // Check for duplicate
      if (schoolId) {
        var { data: existing } = await supabase
          .from('school_applications')
          .select('id')
          .eq('student_profile_id', profileId)
          .eq('school_id', schoolId)
          .maybeSingle();
        if (existing) {
          var schoolName = schools[0].name || params.schoolName;
          return { error: 'Bạn đã gửi đơn vào ' + schoolName + ' trước đó rồi! Vào mục "📨 Gửi đơn" để xem chi tiết.' };
        }
      }

      var insertData = {
        student_profile_id: profileId,
        full_name: params.fullName || '',
        phone: params.phone || '',
        email: params.email || profile.email || '',
        school_id: schoolId || null,
        status: 'draft',
      };

      var { data: app, error } = await supabase
        .from('school_applications')
        .insert(insertData)
        .select('id, full_name, status, created_at')
        .single();

      if (error) return { error: 'Lỗi tạo đơn: ' + (error.message || 'Không xác định') };

      var targetSchool = schools && schools.length > 0 ? schools[0].name : (params.schoolName || 'Chưa xác định');
      return {
        success: true,
        application: {
          id: app.id, studentName: app.full_name, schoolName: targetSchool,
          status: app.status, createdAt: app.created_at,
        },
        message: '✅ Đã tạo đơn thành công! Vào tab "📨 Gửi đơn" để theo dõi.',
      };
    },
  },

  get_applications: {
    description: 'Xem danh sách đơn đăng ký nhập học đã gửi và trạng thái',
    params: {},
    handler: async function(params, profile) {
      if (!profile || !profile.email) return { error: 'Cần đăng nhập để xem đơn đăng ký.' };
      var { data: studentProfile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('email', profile.email)
        .maybeSingle();
      if (!studentProfile) return { error: 'Không tìm thấy thông tin tài khoản.' };

      var { data: apps } = await supabase
        .from('school_applications')
        .select('id, full_name, status, created_at, updated_at, school_id')
        .eq('student_profile_id', studentProfile.id)
        .order('created_at', { ascending: false });

      if (!apps || apps.length === 0) {
        return { message: 'Bạn chưa gửi đơn nào. Nói "Gửi đơn vào trường..." để bắt đầu!' };
      }

      // Fetch school names
      var schoolIds = apps.map(function(a) { return a.school_id; }).filter(Boolean);
      var { data: schools } = schoolIds.length > 0 ? await supabase
        .from('schools').select('id, name').in('id', schoolIds) : { data: [] };
      var schoolMap = {};
      for (var si = 0; si < (schools || []).length; si++) {
        schoolMap[schools[si].id] = schools[si].name;
      }

      var statusLabels = {
        draft: '📝 Nháp', submitted: '📨 Đã nộp', reviewing: '🔄 Đang xét',
        approved: '✅ Đã duyệt', rejected: '❌ Bị từ chối',
      };

      return {
        applications: (apps || []).map(function(a) {
          return {
            id: a.id, studentName: a.full_name,
            schoolName: schoolMap[a.school_id] || 'Chưa rõ',
            status: statusLabels[a.status] || a.status,
            statusRaw: a.status, createdAt: a.created_at,
          };
        }),
      };
    },
  },

  set_reminder: {
    description: 'Tạo nhắc nhở cho một hạng mục giấy tờ hoặc sự kiện',
    params: {
      title: { type: 'string', description: 'Tiêu đề nhắc nhở (VD: "Nộp sổ TK", "Đặt lịch KVAC")', required: true },
      dueDate: { type: 'string', description: 'Ngày hạn (YYYY-MM-DD)', required: true },
      description: { type: 'string', description: 'Mô tả chi tiết', required: false },
      reminderType: { type: 'string', description: 'Loại: document, submission, interview, health_check, visa_appointment, other', required: false },
    },
    handler: async function(params, profile) {
      if (!profile || !profile.email) return { error: 'Cần đăng nhập để tạo nhắc nhở.' };
      var { data: studentProfile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('email', profile.email)
        .maybeSingle();
      if (!studentProfile) return { error: 'Không tìm thấy thông tin tài khoản.' };

      // Validate date
      var dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(params.dueDate)) return { error: 'Ngày hạn không đúng định dạng. VD: 2026-09-15' };

      var typeMap = {
        'giấy tờ': 'document', 'hồ sơ': 'document', 'giấy': 'document',
        'sổ tk': 'document', 'sổ tiết kiệm': 'document',
        'nộp': 'submission', 'kvac': 'visa_appointment', 'hẹn': 'visa_appointment',
        'sức khỏe': 'health_check', 'khám': 'health_check', 'lao phổi': 'health_check',
        'phỏng vấn': 'interview', 'visa': 'visa_appointment',
      };
      var rType = params.reminderType || 'other';
      var titleLower = (params.title || '').toLowerCase();
      for (var key in typeMap) {
        if (titleLower.includes(key)) { rType = typeMap[key]; break; }
      }

      var { data: reminder, error } = await supabase
        .from('reminders')
        .insert({
          student_id: studentProfile.id,
          title: params.title,
          description: params.description || '',
          due_date: params.dueDate,
          reminder_type: rType,
        })
        .select('id, title, due_date, reminder_type')
        .single();

      if (error) return { error: 'Lỗi tạo nhắc nhở: ' + (error.message || 'Không xác định') };

      return {
        success: true,
        reminder: {
          id: reminder.id, title: reminder.title,
          dueDate: reminder.due_date, type: reminder.reminder_type,
        },
        message: '✅ Đã tạo nhắc nhở "' + reminder.title + '" hạn ngày ' + reminder.due_date + '!',
      };
    },
  },

  list_by_criteria: {
    description: 'Lọc trường theo tiêu chí: khu vực, chi phí, hệ đào tạo, giới tính',
    params: {
      region: { type: 'string', description: 'Khu vực: seoul, near-seoul, busan, gyeonggi,...', required: false },
      system: { type: 'string', description: 'Hệ: D2-6 hoặc D4-1', required: false },
      gender: { type: 'string', description: 'Giới tính tuyển sinh: female (chỉ nữ), all (nam/nữ)', required: false },
      limit: { type: 'number', description: 'Số kết quả tối đa (mặc định 5)', required: false, default: 5 },
    },
    handler: async function(params) {
      var q = supabase.from('schools').select('id, slug, name, name_kr, system, location, region, tuition, ktx, visa_type');
      if (params.region) q = q.eq('region', params.region);
      if (params.system) q = q.eq('visa_type', params.system);
      q = q.limit(Math.min(params.limit || 5, 10));
      var { data: schools } = await q;
      var schoolIds = (schools || []).map(function(s) { return s.id; });
      var { data: profiles } = schoolIds.length > 0 ? await supabase
        .from('school_advisor_profiles')
        .select('school_id, gender, cost_level, visa_chance, job_opportunity, region, tags')
        .in('school_id', schoolIds) : { data: [] };
      var profileMap = {};
      for (var i = 0; i < (profiles || []).length; i++) {
        profileMap[profiles[i].school_id] = profiles[i];
      }
      var filtered = (schools || []).filter(function(s) {
        var ap = profileMap[s.id];
        if (params.gender === 'female' && ap && ap.gender !== 'female') return false;
        if (params.gender === 'all' && ap && ap.gender === 'female') return false;
        return true;
      });
      return filtered.map(function(s) {
        var ap = profileMap[s.id] || {};
        return {
          slug: s.slug, name: s.name, nameKr: s.name_kr, system: s.system,
          location: s.location, region: s.region,
          tuition: s.tuition, ktx: s.ktx, visaType: s.visa_type,
          gender: ap.gender || 'all', costLevel: ap.cost_level || null,
          visaChance: ap.visa_chance || null,
        };
      });
    },
  },
};

// ─── Execute a tool call ───
async function executeStudentTool(toolName, params, profile) {
  var tool = STUDENT_TOOLS[toolName];
  if (!tool) return { error: 'Tool không tồn tại: ' + toolName };
  try {
    var result = await tool.handler(params || {}, profile || {});
    return { success: true, result: result };
  } catch (e) {
    console.error('Tool execution error [' + toolName + ']:', e.message);
    return { error: e.message || 'Lỗi thực thi tool' };
  }
}

// ─── Build tool description for system prompt ───
function buildToolsSystemPrompt() {
  var lines = ['\n\n=== CÔNG CỤ SẴN CÓ ==='];
  lines.push('Bạn có thể dùng các công cụ sau để tra cứu dữ liệu thực tế thay vì tự suy luận:');
  lines.push('');
  Object.keys(STUDENT_TOOLS).forEach(function(key) {
    var tool = STUDENT_TOOLS[key];
    lines.push('• ' + key + ' — ' + tool.description);
    var paramKeys = Object.keys(tool.params || {});
    if (paramKeys.length > 0) {
      lines.push('  Tham số: ' + paramKeys.map(function(p) {
        var info = tool.params[p];
        return p + (info.required ? ' (bắt buộc)' : ' (tùy chọn)');
      }).join(', '));
    }
  });
  lines.push('');
  lines.push('CÁCH DÙNG:');
  lines.push('Khi học sinh yêu cầu tra cứu thông tin (tìm trường, xem chi tiết, so sánh, lọc...), hãy trả lời bằng cách xuất dòng sau:');
  lines.push('---TOOL_CALL:tên_tool---');
  lines.push('{"param1": "value1", "param2": "value2"}');
  lines.push('---END TOOL---');
  lines.push('');
  lines.push('Ví dụ: Khi học sinh hỏi "Tìm trường Osan", bạn xuất:');
  lines.push('---TOOL_CALL:search_schools---');
  lines.push('{"query": "Osan"}');
  lines.push('---END TOOL---');
  lines.push('Sau đó tôi sẽ chạy tool và trả kết quả cho bạn để trả lời học sinh.');
  lines.push('');
  lines.push('QUY TẮC QUAN TRỌNG:');
  lines.push('- Nếu học sinh muốn SỬA thông tin hồ sơ → dùng tool update_profile (hoặc action cũ nếu cần)');
  lines.push('- Nếu học sinh muốn TÌM trường cụ thể → dùng search_schools hoặc list_by_criteria');
  lines.push('- Nếu học sinh muốn XEM CHI TIẾT trường → dùng get_school_detail');
  lines.push('- Nếu học sinh muốn SO SÁNH trường → dùng compare_schools');
  lines.push('- Nếu học sinh hỏi về hồ sơ/checklist/sửa thông tin → KHÔNG cần tool, trả lời trực tiếp');
  return lines.join('\n');
}

// ═══════════════════════════════════════════════════
// ─── Action: Student Agent (action=student-agent)
// Personal AI Agent cho học sinh đã đăng nhập — chat + thao tác dữ liệu
// ═══════════════════════════════════════════════════
async function handleStudentAgent(req, res) {
  const apiKey = getDeepSeekKey();
  if (!apiKey) {
    return res.json({ success: false, reply: 'AI chưa được cấu hình. Vui lòng thử lại sau!' });
  }

  const { message, studentProfile, conversation } = req.body || {};
  if (!message || message.trim().length < 2) {
    return res.json({ success: false, reply: 'Vui lòng nhập câu hỏi hoặc yêu cầu.' });
  }

  try {
    const query = message.trim();

    // ─── Load schools + visa data for context ───
    const [schoolsRes, apRes] = await Promise.all([
      supabase.from('schools').select('slug, name, name_kr, system, location, region, tuition, ktx').order('slug'),
      supabase.from('school_advisor_profiles').select('school_id, gender, cost_level, visa_chance, job_opportunity, region, tags'),
    ]);

    const schools = schoolsRes.data || [];
    const advisorProfiles = apRes.data || [];

    // ─── Student profile summary ───
    var profileSummary = '';
    if (studentProfile && Object.keys(studentProfile).length > 0) {
      var p = studentProfile;
      profileSummary = [
        '=== HỒ SƠ CỦA BẠN ===',
        'Tên: ' + (p.fullName || 'Chưa nhập'),
        'SĐT: ' + (p.phone || 'Chưa nhập'),
        'Email: ' + (p.email || 'Chưa nhập'),
        'Giới tính: ' + (p.gender === 'female' ? 'Nữ' : p.gender === 'male' ? 'Nam' : 'Chưa nhập'),
        'Tuổi: ' + (p.age || (p.dateOfBirth ? calculateAge(p.dateOfBirth) + 't' : 'Chưa nhập')),
        'GPA: ' + (p.gpa || 'Chưa nhập'),
        'Tiếng Hàn: ' + (p.koreanLevel || 'Chưa nhập'),
        'TOPIK: ' + (p.hasTopik ? 'Có (Topik ' + (p.topikGrade || '') + ')' : 'Chưa có'),
        'IELTS: ' + (p.ieltsScore || 'Chưa có'),
        'Loại visa: ' + (p.visaType || 'Chưa chọn'),
        'Gap year: ' + (p.gapYears ? p.gapYears + ' năm' : 'Không có'),
        'Trượt visa: ' + (p.hasVisaRejection ? 'Có' : 'Không'),
        'Trường dự định: ' + (p.chosenSchool || 'Chưa chọn'),
        'Ngành dự định: ' + (p.chosenMajor || 'Chưa chọn'),
        'Người bảo lãnh: ' + (p.sponsorIsSelf ? 'Tự thân' : p.sponsorRelation === 'parent' ? 'Cha/Mẹ' : 'Người thân'),
        'Sổ tiết kiệm: ' + (p.savingsAmount ? p.savingsAmount.toLocaleString() + ' USD' : 'Chưa nhập'),
        'Đã đi làm: ' + (p.hasWorkExperience ? 'Có' : 'Chưa'),
        'Người thân bất hợp pháp: ' + (p.hasIllegalRelative ? 'Có' : 'Không'),
      ].join('\n');
    }

    // ─── School summary ───
    var schoolSummary = '';
    if (schools.length > 0) {
      var apMap = {};
      for (var i = 0; i < advisorProfiles.length; i++) {
        apMap[advisorProfiles[i].school_id] = advisorProfiles[i];
      }
      schoolSummary = '\n=== DANH SÁCH TRƯỜNG ===\n' + schools.map(function(s) {
        var ap = apMap[s.id] || {};
        return '• ' + s.name + ' (' + s.name_kr + ') | KV: ' + (ap.region || s.region) + ' | Học phí: ' + (s.tuition || 'Chưa rõ') + ' | KTX: ' + (s.ktx || 'Chưa rõ');
      }).join('\n');
    }

    // ─── Conversation history (last 6 exchanges) ───
    var convHistory = '';
    if (conversation && conversation.length > 0) {
      var recent = conversation.slice(-6);
      convHistory = '\n=== LỊCH SỬ TRÒ CHUYỆN ===\n' + recent.map(function(m) {
        return (m.role === 'user' ? 'Học sinh: ' : 'Trợ lý: ') + m.content.replace(/<[^>]+>/g, '');
      }).join('\n');
    }

    const toolPrompt = buildToolsSystemPrompt();

    const systemPrompt = `Bạn là Trợ lý AI Cá nhân cho học sinh làm hồ sơ du học Hàn Quốc.

NHIỆM VỤ CỦA BẠN:
Bạn là trợ lý cá nhân, có thể:
1. Trả lời câu hỏi về trường, visa, thủ tục (dùng dữ liệu trường bên dưới)
2. XEM và SỬA thông tin hồ sơ của học sinh (dùng hồ sơ bên dưới)
3. HƯỚNG DẪN học sinh từng bước làm hồ sơ
4. GỢI Ý trường phù hợp dựa trên hồ sơ
5. Dùng CÔNG CỤ để tra cứu dữ liệu thực tế từ database

QUY TẮC:
- Trả lời bằng tiếng Việt, thân thiện, ngắn gọn
- Nếu học sinh muốn SỬA thông tin, hãy trả lời xác nhận và kèm JSON action ở cuối:
  ---ACTION:update_profile---
  { "gpa": 7.5, "phone": "0901234567" }
  ---END ACTION---
  (Chỉ gửi các field cần cập nhật, gửi dưới dạng JSON hợp lệ)
- Nếu học sinh muốn cập nhật CHECKLIST, dùng:
  ---ACTION:update_checklist---
  { "moduleIdx": 0, "itemIdx": 2, "status": "completed" }
  ---END ACTION---
- Nếu chỉ hỏi đáp thông thường, KHÔNG cần gửi action
- Dùng emoji nhẹ nhàng
- LUÔN xưng hô "bạn" - "tôi"
- KHÔNG dùng tool nếu câu hỏi đơn giản không cần tra cứu
- Nếu dùng tool → CHỈ xuất tool call, KHÔNG trả lời thêm. Sau khi có kết quả tool, tôi sẽ trả lời.
${toolPrompt}
${profileSummary}
${schoolSummary}
${convHistory}`;

    const answer = await callDeepSeek(
      [{ role: 'system', content: systemPrompt }, { role: 'user', content: query }],
      { temperature: 0.3, maxTokens: 1000, timeout: 20000 }
    );

    if (!answer) {
      return res.json({ success: false, reply: 'Xin lỗi, tôi chưa có câu trả lời. Vui lòng thử lại!' });
    }

    // ─── Parse actions from response ───
    var reply = answer;
    var updatedProfile = null;
    var updatedChecklist = null;
    var toolResults = null;

    // Check for tool calls first (highest priority)
    var toolMatch = answer.match(/---TOOL_CALL:([a-z_]+)---\n?([\s\S]*?)---END TOOL---/);
    if (toolMatch) {
      var toolName = toolMatch[1].trim();
      var toolParams = {};
      try {
        toolParams = JSON.parse(toolMatch[2].trim()) || {};
      } catch (e) {
        console.error('Parse tool params error:', e.message);
      }
      var execResult = await executeStudentTool(toolName, toolParams, studentProfile);
      if (execResult.success && execResult.result) {
        toolResults = { tool: toolName, params: toolParams, data: execResult.result };
        // Preserve any introductory text the AI wrote before the tool call
        reply = answer.substring(0, toolMatch.index).trim();
      } else {
        var errMsg = (execResult && execResult.error) || 'Không tìm thấy kết quả';
        reply = '❌ Lỗi khi tra cứu: ' + errMsg;
      }
    }

    var profileMatch = answer.match(/---ACTION:update_profile---([\s\S]*?)---END ACTION---/);
    if (profileMatch) {
      try {
        updatedProfile = JSON.parse(profileMatch[1].trim());
        reply = reply.replace(profileMatch[0], '').trim();
      } catch (e) {
        console.error('Parse profile action error:', e.message);
      }
    }

    var checklistMatch = answer.match(/---ACTION:update_checklist---([\s\S]*?)---END ACTION---/);
    if (checklistMatch) {
      try {
        updatedChecklist = JSON.parse(checklistMatch[1].trim());
        reply = reply.replace(checklistMatch[0], '').trim();
      } catch (e) {
        console.error('Parse checklist action error:', e.message);
      }
    }

    return res.json({
      success: true,
      reply: reply || (toolResults ? '🔍 Đang tra cứu...' : '✅ Đã xử lý yêu cầu của bạn!'),
      updatedProfile: updatedProfile,
      updatedChecklist: updatedChecklist,
      toolResults: toolResults,
    });
  } catch (err) {
    console.error('Student agent error:', err);
    return res.json({
      success: false,
      reply: '❌ Đã có lỗi xảy ra. Vui lòng thử lại sau!',
    });
  }
}

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return 0;
  var birth = new Date(dateOfBirth);
  var today = new Date();
  var age = today.getFullYear() - birth.getFullYear();
  var m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// ═══════════════════════════════════════════════════
  // ─── Action: Generate Checklist (action=generate-checklist)
  // Soạn Study Plan hoặc giải trình gap year / trượt visa bằng AI
  // ═══════════════════════════════════════════════════
  async function handleGenerateChecklist(req, res) {
    const apiKey = getDeepSeekKey();
    if (!apiKey) {
      return res.json({ success: false, error: 'AI chưa được cấu hình.', draft: null });
    }

    const { type, profile, visaType, extraData } = req.body || {};
    if (!type || !profile) {
      return res.status(400).json({ success: false, error: 'Missing type or profile', draft: null });
    }

    // Build extra context from study plan answers
    let extraContext = '';
    if (extraData) {
      if (extraData.studyPlanAnswers) {
        const a = extraData.studyPlanAnswers;
        // Map dong: lay tat ca key co san trong cau tra loi, khong bi gioi han boi 8 key cu
        var extraLines = [];
        if (a.reasonKorea) extraLines.push('- Ly do chon Han Quoc: ' + a.reasonKorea);
        if (a.reasonSchool) extraLines.push('- Ly do chon truong: ' + a.reasonSchool);
        if (a.studyPlan) extraLines.push('- Ke hoach hoc tap: ' + a.studyPlan);
        if (a.futurePlan) extraLines.push('- Ke hoach tuong lai: ' + a.futurePlan);
        if (a.careerGoal) extraLines.push('- Dinh huong nghe nghiep: ' + a.careerGoal);
        if (a.gapActivity) extraLines.push('- Hoat dong gap year: ' + a.gapActivity);
        if (a.familyFinance) extraLines.push('- Gia dinh/bao lanh: ' + a.familyFinance);
        if (a.languageLevel) extraLines.push('- Trinh do ngon ngu: ' + a.languageLevel);
        // D-4-1 keys
        if (a.topikGoal) extraLines.push('- Muc tieu TOPIK: ' + a.topikGoal);
        // D-2 keys
        if (a.higherStudy) extraLines.push('- Du dinh hoc len cao: ' + a.higherStudy);
        if (a.extracurricular) extraLines.push('- Hoat dong ngoai khoa/thuc tap: ' + a.extracurricular);
        // D4-to-D2 keys
        if (a.currentStudy) extraLines.push('- Tinh hinh hoc tap hien tai: ' + a.currentStudy);
        if (a.reasonUpgrade) extraLines.push('- Ly do chuyen doi visa: ' + a.reasonUpgrade);
        if (a.koreaExperience) extraLines.push('- Kinh nghiem song tai Han: ' + a.koreaExperience);
        if (extraLines.length > 0) {
          extraContext = '\nTHONG TIN BO SUNG TU HOC SINH:\n' + extraLines.join('\n');
        }
      }
      if (extraData.extraInfo) {
        extraContext += `\nTHONG TIN BO SUNG: ${extraData.extraInfo}`;
      }
    }

    // ─── System prompt cho Study Plan — CÁ NHÂN HOÁ theo visa type ───
    function getStudyPlanSystemPrompt(vt) {
      const baseRules = `QUY TẮC CHUNG:
- Viết bằng tiếng Hàn nếu học sinh có chứng chỉ/đang học tiếng Hàn, nếu không thì viết bằng tiếng Anh
- Chi tiết, cụ thể, có mốc thời gian rõ ràng
- Cá nhân hoá theo thông tin học sinh
- Tránh chung chung, phải thể hiện mục đích học thật
- Kết thúc bằng cam kết tuân thủ luật và về nước đúng hạn
- TUYỆT ĐỐI KHÔNG đề cập vấn đề tài chính trong Study Plan (tài chính là phần riêng của hồ sơ)`;

      const prompts = {
        'D-4-1': `Bạn là chuyên viên tư vấn du học Hàn Quốc với 10 năm kinh nghiệm. Viết Study Plan cho học sinh Việt Nam xin visa D-4-1 (học tiếng Hàn).

MỤC TIÊU CỦA STUDY PLAN D-4-1:
- Thể hiện động lực học tiếng Hàn mạnh mẽ: tại sao phải học tại Hàn Quốc?
- Có mục tiêu TOPIK rõ ràng theo từng giai đoạn (VD: 6 tháng → TOPIK 2, 1 năm → TOPIK 3...)
- Kế hoạch học tập cụ thể: mỗi ngày học mấy tiếng, phương pháp học gì?
- KHÔNG tập trung vào ngành nghề hay nghiên cứu — đây là visa học tiếng
- Sau khóa học sẽ về Việt Nam hoặc có dự định tương lai rõ ràng (không ở lại bất hợp pháp)
- Độ dài: 500-700 từ

${baseRules}`,

        'D-2': `Bạn là chuyên viên tư vấn du học Hàn Quốc với 10 năm kinh nghiệm. Viết Study Plan cho học sinh Việt Nam xin visa D-2 (đại học chính quy).

MỤC TIÊU CỦA STUDY PLAN D-2:
- Thể hiện động lực học tập nghiêm túc: tại sao chọn Hàn Quốc để học đại học?
- Chứng minh năng lực học thuật: GPA, chứng chỉ tiếng, kiến thức nền tảng
- Lý do chọn ngành cụ thể, liên quan đến định hướng nghề nghiệp
- Kế hoạch học tập chi tiết theo từng học kỳ (mục tiêu GPA, thực tập, ngoại khóa...)
- Kế hoạch sau tốt nghiệp: về Việt Nam làm việc hoặc xin E7 (không ở lại bất hợp pháp)
- Có thể đề cập mong muốn học lên cao học nếu phù hợp
- Độ dài: 800-1200 từ

${baseRules}`,

        'D4-to-D2': `Bạn là chuyên viên tư vấn du học Hàn Quốc với 10 năm kinh nghiệm. Viết Study Plan cho học sinh Việt Nam đang học tiếng tại Hàn với visa D-4-1, muốn chuyển lên visa D-2 (chuyển đổi).

MỤC TIÊU CỦA STUDY PLAN CHUYỂN ĐỔI D4→D2:
- Thể hiện quá trình học tiếng tại Hàn thành công (kết quả, kinh nghiệm)
- Tại sao muốn chuyển lên đại học thay vì về nước?
- Trình độ tiếng Hàn hiện tại đủ để học đại học (nêu rõ TOPIK nếu có)
- Lý do chọn trường và ngành học cụ thể
- Kế hoạch học tập chi tiết cho chương trình đại học
- Cam kết tuân thủ luật, gia hạn visa đúng hạn, không ở lại bất hợp pháp
- Độ dài: 700-1000 từ

${baseRules}`
      };

      return prompts[vt] || prompts['D-4-1'];
    }

    const prompts = {
      study_plan: {
        system: getStudyPlanSystemPrompt(visaType || 'D-4-1'),
        user: (p) => `Viết Study Plan cho học sinh sau:
- Họ tên: ${p.fullName || 'Học sinh'}
- Ngày sinh: ${p.dateOfBirth || 'Không rõ'}
- Visa: ${visaType || 'D-4-1'}
- Trình độ học vấn: ${p.educationLevel === 'university' ? 'Đại học' : 'THPT'}
- GPA: ${p.gpa || 'Không rõ'}
- Trình độ tiếng Hàn: ${p.koreanLevel || 'Chưa có'}
${p.hasTopik && p.topikGrade ? `- Chứng chỉ TOPIK: Topik ${p.topikGrade}
` : ''}${p.ieltsScore ? `- IELTS: ${p.ieltsScore}
` : ''}- Năm tốt nghiệp: ${p.graduationYear || 'Không rõ'}
${p.gapYears > 0 ? `- Khoảng trống: ${p.gapYears} năm sau tốt nghiệp
` : ''}${p.chosenSchool ? `- Trường dự định: ${p.chosenSchool}
` : ''}${p.chosenMajor ? `- Ngành dự định: ${p.chosenMajor}
` : ''}
Kiến thức nền tảng:
${KB_FOR_STUDY_PLAN}

Viết Study Plan chi tiết cho học sinh này.`
      },
      gap_explanation: {
        system: `Bạn là chuyên viên tư vấn du học Hàn Quốc. Viết GIẢI TRÌNH KHOẢNG TRỐNG THỜI GIAN (Gap Year Explanation) cho học sinh Việt Nam.

QUY TẮC:
- Viết bằng tiếng Hàn hoặc tiếng Anh
- Lý do gap phải hợp lý với hoàn cảnh: học thêm ngoại ngữ/kỹ năng, đi làm tích lũy kinh nghiệm, chờ đủ tuổi/điều kiện, lý do sức khoẻ cá nhân
- TUYỆT ĐỐI KHÔNG viện lý do tài chính gia đình khó khăn (vì học sinh đã đủ điều kiện tài chính để đi du học)
- Thể hiện rằng thời gian gap là giai đoạn chuẩn bị cho việc du học, không làm giảm động lực học tập
- Nếu có đi làm, mô tả công việc đã làm và kinh nghiệm học được
- Độ dài: 200-400 từ`,
        user: (p) => `Viết giải trình khoảng trống thời gian cho học sinh:
- Họ tên: ${p.fullName || 'Học sinh'}
- Tốt nghiệp: ${p.graduationYear || 'Không rõ'}
- Gap: ${p.gapYears || 0} năm
- Đã đi làm: ${p.hasWorkExperience ? 'Có' : 'Không'}
${p.hasWorkExperience ? `- Có HĐLĐ/BHXH: ${p.hasLaborContract ? 'Có' : 'Không'}
` : ''}${p.hasWorkExperience && p.workCompany ? `- Công ty: ${p.workCompany}
- Vị trí: ${p.workPosition || 'Không rõ'}
- Thời gian làm: ${p.workDuration ? p.workDuration + ' năm' : 'Không rõ'}
` : ''}- Trình độ tiếng Hàn: ${p.koreanLevel || 'Chưa có'}
- Visa đăng ký: ${visaType || 'D-4-1'}

${KB_FOR_GAP}

Viết giải trình cho học sinh này.`
      },
      visa_rejection_explanation: {
        system: `Bạn là chuyên viên tư vấn du học Hàn Quốc. Viết GIẢI TRÌNH LÝ DO TRƯỢT VISA cho học sinh Việt Nam.

QUY TẮC:
- Viết bằng tiếng Hàn hoặc tiếng Anh
- Phân tích nguyên nhân trượt (không đổ lỗi, thể hiện hiểu rõ vấn đề)
- Dựa vào lý do trượt cụ thể để suy luận cách khắc phục (VD: thiếu giấy tờ → đã bổ sung, Study Plan yếu → đã viết lại chi tiết, tài chính chưa rõ → đã chuẩn bị đầy đủ)
- TUYỆT ĐỐI KHÔNG dùng mẫu chung chung, phải cá nhân hoá theo lý do trượt thực tế
- Cam kết hồ sơ lần này đã hoàn chỉnh hơn
- Độ dài: 200-400 từ
- Thể hiện sự chân thành và thiện chí`,
        user: (p) => `Viết giải trình lý do trượt visa cho học sinh:
- Họ tên: ${p.fullName || 'Học sinh'}
- Lý do trượt: ${p.rejectionReason || 'Không rõ nguyên nhân'}
- Visa đăng ký: ${visaType || 'D-4-1'}

${KB_FOR_REJECTION}

Viết giải trình cho học sinh này.`
      }
    };

    const promptConfig = prompts[type];
    if (!promptConfig) {
      return res.status(400).json({ success: false, error: `Unknown type: ${type}`, draft: null });
    }

    // Build user message with profile data + extra context
    let userMessage = promptConfig.user(profile);
    if (extraContext) {
      userMessage += `\n\n${extraContext}`;
    }

    const draft = await callDeepSeek(
      [
        { role: 'system', content: promptConfig.system },
        { role: 'user', content: userMessage }
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
  // ─── Action: Interview Simulator (action=interview-simulator)
  // Mo phong phong van visa KVAC bang AI
  // ═══════════════════════════════════════════════════
  async function handleInterviewSimulator(req, res) {
    const apiKey = getDeepSeekKey();
    if (!apiKey) {
      return res.json({ success: false, error: 'AI chua duoc cau hinh.' });
    }

    var { action_type, history, profile, answer, visaType } = req.body || {};

    var defaultProfile = {
      fullName: 'Hoc sinh',
      visaType: visaType || 'D-4-1',
      educationLevel: 'THPT',
      koreanLevel: 'none',
      gpa: null,
      hasVisaRejection: false,
      gapYears: 0,
      sponsorIsSelf: true
    };
    profile = Object.assign({}, defaultProfile, profile || {});

    // ─── Tạo chủ đề phỏng vấn theo loại visa ───
    function getInterviewTopics(vt) {
      const baseTopics = [
        '1. Gioi thieu ban than & muc dich du hoc',
        '2. Ly do chon Han Quoc',
        '6. Tai chinh & nguoi bao lanh',
      ];

      var visaTopics = {
        'D-4-1': [
          ...baseTopics.slice(0, 2),
          '3. Tai sao chon hoc tieng Han tai Han Quoc? Mot trang tam tieng Viet van co the hoc?',
          '4. Ke hoach hoc tieng cu the: Muc tieu TOPIK theo giai doan, phuong phap hoc, thoi gian hoc',
          '5. Sau khi hoan thanh khoa hoc tieng (1-2 nam), ban du dinh lam gi?',
          ...baseTopics.slice(2),
          '7. Ban da tung hoc tieng Han chua? Trinh do hien tai the nao?',
        ],
        'D-2': [
          ...baseTopics.slice(0, 2),
          '3. Tai sao chon truong dai hoc nay? Ban biet gi ve chuong trinh dao tao?',
          '4. Tai sao chon nganh nay? No lien quan the nao dinh huong nghe nghiep?',
          '5. Ke hoach hoc tap cu the tu tung hoc ky? Muc tieu GPA?',
          ...baseTopics.slice(2),
          '7. Trinh do tieng Han/Anh co dap ung yeu cau dau vao khong?',
          '8. Sau khi tot nghiep du dinh lam gi? (ve nuoc, E7, hoc len?)',
        ],
        'D4-to-D2': [
          '1. Ban dang hoc tieng Han o truong nao? Ket qua the nao?',
          '2. Vi sao muon chuyen tu D-4-1 len D-2 thay vi ve Viet Nam?',
          '3. Tai sao chon truong dai hoc va nganh nay?',
          '4. Trinh do tieng Han hien tai du de hoc dai hoc chua? (TOPIK may?)',
          '5. Ke hoach hoc tap cu the khi len dai hoc?',
          '6. Tai chinh & nguoi bao lanh trong thoi gian hoc dai hoc?',
          '7. Sau khi tot nghiep dai hoc du dinh lam gi?',
        ]
      };
      return visaTopics[vt] || visaTopics['D-4-1'];
    }

    if (action_type === 'next') {
      // Generate first question based on profile
      var interviewTopics = getInterviewTopics(profile.visaType || 'D-4-1');
      var topicsText = interviewTopics.map(function(t, i) { return (i+1) + '. ' + t; }).join('\n');
      var totalQ = interviewTopics.length;

      var systemPrompt = `Ban la nhan vien phong van visa Han Quoc tai KVAC. Ban can phong van hoc sinh xin visa ${profile.visaType || 'D-4-1'}.

THONG TIN HOC SINH:
- Ho ten: ${profile.fullName}
- Visa: ${profile.visaType || 'D-4-1'}
- Hoc van: ${profile.educationLevel === 'university' ? 'Dai hoc' : 'THPT'}${profile.gpa ? '\n- GPA: ' + profile.gpa : ''}
- Tieng Han: ${profile.koreanLevel || 'Chua co'}${profile.gapYears > 0 ? '\n- Gap year: ' + profile.gapYears + ' nam' : ''}${profile.hasVisaRejection ? '\n- Da tuong truot visa: Co' : ''}${profile.chosenSchool ? '\n- Truong du dinh: ' + profile.chosenSchool : ''}${profile.chosenMajor ? '\n- Nganh du dinh: ' + profile.chosenMajor : ''}

NHIEM VU:
Ban se phong van hoc sinh bang tieng Viet. Moi lan hoi 1 cau hoi. Tong cong ${totalQ} cau hoi.

CAC CHU DE CAN HOI (theo thu tu):
${topicsText}

QUY TAC:
- Hoi bang tieng Viet, than thien nhung chuyen nghiep
- KHONG hoi qua nhieu cung luc (chi 1 cau)
- Dieu chinh do kho cau hoi dua tren ho so hoc sinh
- Khi hoc sinh tra loi xong, ban danh gia va hoi cau tiep theo

Tra ve KET QUA DUOI DANG JSON, KHONG co text khac:
{
  "question": "Cau hoi phong van...",
  "questionNumber": 1,
  "totalQuestions": ${totalQ},
  "category": "gioi-thieu",
  "hint": "Goi y tra loi..."
}`;

      var result = await callDeepSeek(
        [{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Hay bat dau phong van hoc sinh. Hay hoi cau hoi DAU TIEN.' }],
        { temperature: 0.5, maxTokens: 500, timeout: 15000 }
      );

      if (result) {
        try {
          var jsonStr = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          var parsed = JSON.parse(jsonStr);
          return res.json({ success: true, interview: {
            question: parsed.question || 'Hay gioi thieu ve ban than va muc dich du hoc Han Quoc?',
            questionNumber: parsed.questionNumber || 1,
            totalQuestions: parsed.totalQuestions || 6,
            category: parsed.category || 'gioi-thieu',
            hint: parsed.hint || 'Hay tra loi tu nhien, trung thuc'
          }});
        } catch (e) {
          return res.json({ success: true, interview: {
            question: result || 'Hay gioi thieu ve ban than va muc dich du hoc Han Quoc?',
            questionNumber: 1, totalQuestions: 6, category: 'gioi-thieu', hint: ''
          }});
        }
      }
      return res.json({ success: false, error: 'AI khong phan hoi' });
    }

    if (action_type === 'answer') {
      var qNum = 1;
      var totalQ = 6;
      if (history && history.length > 0) {
        // Find the last question number from history
        for (var i = history.length - 1; i >= 0; i--) {
          if (history[i].role === 'assistant' && history[i].questionNumber) {
            qNum = history[i].questionNumber;
            break;
          }
        }
      }

      var historyText = '';
      if (history && history.length > 0) {
        historyText = history.map(function(h) {
          if (h.role === 'assistant') return 'KVAC: ' + h.content;
          if (h.role === 'user') return 'Hoc sinh: ' + h.content;
          return '';
        }).join('\n');
      }

      var systemPrompt = `Ban la nhan vien phong van visa Han Quoc tai KVAC. Danh gia cau tra loi cua hoc sinh.

THONG TIN HOC SINH:
- Ho ten: ${profile.fullName}
- Visa: ${profile.visaType || 'D-4-1'}
- Hoc van: ${profile.educationLevel === 'university' ? 'Dai hoc' : 'THPT'}${profile.gpa ? '\n- GPA: ' + profile.gpa : ''}
- Tieng Han: ${profile.koreanLevel || 'Chua co'}${profile.gapYears > 0 ? '\n- Gap year: ' + profile.gapYears + ' nam' : ''}${profile.hasVisaRejection ? '\n- Da tuong truot visa: Co' : ''}

LICH SU PHONG VAN:\n${historyText || 'Chua co'}

CAU TRA LOI MOI: "${answer}"

NHIEM VU:
1. Danh gia cau tra loi cua hoc sinh (2-3 cau, bang tieng Viet)
2. Cho diem tu 1-10
3. Hoi cau tiep theo (chi 1 cau)

Tra ve KET QUA DUOI DANG JSON:
{
  "feedback": "Nhan xet ve cau tra loi... (2-3 cau, tinh than xay dung)",
  "score": <1-10>,
  "nextQuestion": "Cau hoi tiep theo...",
  "questionNumber": ${qNum + 1},
  "totalQuestions": ${totalQ},
  "category": "...",
  "hint": "Goi y tra loi..."
}`;

      var result = await callDeepSeek(
        [{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Hay danh gia cau tra loi va hoi cau tiep theo.' }],
        { temperature: 0.4, maxTokens: 600, timeout: 15000 }
      );

      if (result) {
        try {
          var jsonStr = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          var parsed = JSON.parse(jsonStr);
          return res.json({ success: true, interview: {
            feedback: parsed.feedback || 'Cam on cau tra loi cua ban.',
            score: parsed.score || 5,
            nextQuestion: parsed.nextQuestion || 'Cam on ban. Toi khong co them cau hoi nao khac.',
            questionNumber: parsed.questionNumber || qNum + 1,
            totalQuestions: parsed.totalQuestions || 6,
            category: parsed.category || 'khac',
            hint: parsed.hint || ''
          }});
        } catch (e) {
          return res.json({ success: true, interview: {
            feedback: result || 'Cam on cau tra loi.',
            score: 5,
            nextQuestion: 'Cam on ban. Con cau hoi nao ban muon hoi them khong?',
            questionNumber: qNum + 1, totalQuestions: 6, category: 'khac', hint: ''
          }});
        }
      }
      return res.json({ success: false, error: 'AI khong phan hoi' });
    }

    if (action_type === 'complete') {
      var historyText = '';
      if (history && history.length > 0) {
        historyText = history.map(function(h) {
          if (h.role === 'assistant') return 'KVAC: ' + (h.content || '');
          if (h.role === 'user') return 'Hoc sinh: ' + (h.content || '');
          return '';
        }).join('\n');
      }

      var systemPrompt = `Ban la nhan vien phong van visa Han Quoc tai KVAC. Tong ket buoi phong van.

THONG TIN HOC SINH:
- Ho ten: ${profile.fullName}
- Visa: ${profile.visaType || 'D-4-1'}

TOAN BO BUOI PHONG VAN:\n${historyText}

NHIEM VU:
Tong ket buoi phong van, danh gia tong the va dua ra loi khuyen.

Tra ve JSON:
{
  "overallScore": <1-10>,
  "overallFeedback": "Nhan xet tong the... (2-3 cau)",
  "strengths": ["Diem manh 1", "Diem manh 2", "Diem manh 3"],
  "weaknesses": ["Diem yeu 1", "Diem yeu 2"],
  "tips": ["Loi khuyen 1", "Loi khuyen 2", "Loi khuyen 3"]
}`;

      var result = await callDeepSeek(
        [{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Hay tong ket buoi phong van va cho loi khuyen.' }],
        { temperature: 0.4, maxTokens: 1000, timeout: 20000 }
      );

      if (result) {
        try {
          var jsonStr = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          var parsed = JSON.parse(jsonStr);
          return res.json({ success: true, summary: {
            overallScore: parsed.overallScore || 5,
            overallFeedback: parsed.overallFeedback || 'Cam on ban da tham gia buoi phong van.',
            strengths: parsed.strengths || [],
            weaknesses: parsed.weaknesses || [],
            tips: parsed.tips || []
          }});
        } catch (e) {
          return res.json({ success: true, summary: {
            overallScore: 5,
            overallFeedback: result || 'Cam on ban.',
            strengths: [], weaknesses: [], tips: [result || 'Cam on ban da tham gia.']
          }});
        }
      }
      return res.json({ success: false, error: 'AI khong phan hoi' });
    }

    return res.status(400).json({ success: false, error: 'Unknown action_type' });
  }

  // ═══════════════════════════════════════════════════
  // ─── Action: Review Study Plan (action=review-study-plan)
  // Check diem va goi y cai thien Study Plan bang AI
  // ═══════════════════════════════════════════════════
  async function handleReviewStudyPlan(req, res) {
    const apiKey = getDeepSeekKey();
    if (!apiKey) {
      return res.json({ success: false, error: 'AI chua duoc cau hinh.', review: null });
    }

    const { studyPlan, visaType, profile } = req.body || {};
    if (!studyPlan || studyPlan.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Study Plan qua ngan. Vui long nhap it nhat 50 ky tu.',
        review: null
      });
    }

    const profileInfo = profile ? `
THONG TIN HOC SINH:
- Ho ten: ${profile.fullName || 'Khong ro'}
- Visa: ${visaType || profile.visaType || 'D-4-1'}
- Hoc van: ${profile.educationLevel === 'university' ? 'Dai hoc' : 'THPT'}
- GPA: ${profile.gpa || 'Khong ro'}
- Tieng Han: ${profile.koreanLevel || 'Chua co'}
- Nam tot nghiep: ${profile.graduationYear || 'Khong ro'}${profile.gapYears > 0 ? '\n- Khoang trong hoc tap: ' + profile.gapYears + ' nam' : ''}${profile.hasVisaRejection ? '\n- Da tuong truot visa: Co' : ''}${profile.sponsorIsSelf === false ? '\n- Bao lanh tai chinh: Nguoi than' : '\n- Bao lanh tai chinh: Tu than'}\n` : '\n(Khong co thong tin ho so)';

    const systemPrompt = `Ban la chuyen vien tu van du hoc Han Quoc voi 15 nam kinh nghiem, chuyen danh gia Study Plan xin visa du hoc.

NHIEM VU:
Doc va danh gia Study Plan cua hoc sinh. Cham diem tren 6 tieu chi, moi tieu chi tu 1-10.

6 TIEU CHI DANH GIA:
1. **Cau truc** — Study Plan co du cac phan: gioi thieu ban than, ly do chon Han Quoc, ly do chon truong, ke hoach hoc tap cu the, ke hoach sau khi tot nghiep, cam ket tuan thu luat va ve nuoc dung han khong?
2. **Ca nhan hoa** — Noi dung co cu the cho hoan canh ca nhan cua hoc sinh khong? Hay chi la ban sao chep tu template?
3. **Tinh thuyet phuc** — Ly do chon Han Quoc, chon truong co thuyet phuc khong? Co the hien duoc dong luc hoc tap that khong?
4. **Ngon ngu** — Ngon ngu phu hop (tieng Han neu co TOPIK, tieng Anh neu chua)? Chinh ta, ngu phap co tot khong?
5. **Day du** — Co de cap den nhung yeu to quan trong: muc dich hoc tap ro rang, ke hoach cu the, ket noi voi dinh huong tuong lai, cam quyet ve nuoc khong?
6. **Tuan thu quy dinh visa** — Co vi pham nhung quy tac cua Study Plan visa Han Quoc khong? (VD: khong duoc de cap tai chinh, khong duoc the hien y dinh dinh cu, khong duoc noi se di lam them...)

QUY TAC DANH GIA:
- Cham diem cong bang, khong qua khen hoac qua che
- Nhan xet cu the, chi ra doan nao yeu va tai sao
- Goi y cai thien ro rang, co the ap dung duoc
- Tinh than xay dung, giup hoc sinh viet Study Plan tot hon

Tra ve KET QUA DUOI DANG JSON, KHONG co text khac ngoai JSON:
{
  "overallScore": <so tu 1-10, 2 so le>,
  "criteria": [
    {
      "name": "Cau truc",
      "score": <1-10>,
      "comment": "Nhan xet ngan ve tieu chi nay...",
      "suggestion": "Goi y cai thien cu the..."
    },
    ...(6 tieu chi)
  ],
  "strengths": ["Diem manh 1", "Diem manh 2", "Diem manh 3"],
  "weaknesses": ["Diem yeu 1", "Diem yeu 2", "Diem yeu 3"],
  "suggestions": ["Goi y cai thien 1", "Goi y cai thien 2", "Goi y cai thien 3", "Goi y cai thien 4", "Goi y cai thien 5"]
}`;

    const userMessage = `${profileInfo}

STUDY PLAN CAN DANH GIA:
---
${studyPlan}
---

Hay danh gia Study Plan tren va tra ve JSON theo dung format quy dinh.`;

    const result = await callDeepSeek(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      { temperature: 0.3, maxTokens: 2500, timeout: 30000 }
    );

    if (result) {
      try {
        const jsonStr = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(jsonStr);
        return res.json({
          success: true,
          review: {
            overallScore: parsed.overallScore || 5,
            criteria: parsed.criteria || [],
            strengths: parsed.strengths || [],
            weaknesses: parsed.weaknesses || [],
            suggestions: parsed.suggestions || []
          }
        });
      } catch (e) {
        // Neu AI khong tra ve JSON dung, tra ve text thay the
        return res.json({
          success: true,
          review: {
            overallScore: 5,
            criteria: [
              { name: 'Tong quan', score: 5, comment: 'Khong the phan tich du lieu JSON tu AI.', suggestion: 'Vui long thu lai.' }
            ],
            strengths: [],
            weaknesses: [],
            suggestions: [result || 'AI khong phan hoi.']
          }
        });
      }
    }

    return res.json({
      success: false,
      error: 'AI khong phan hoi, vui long thu lai sau.',
      review: null
    });
  }

  // ═══════════════════════════════════════════════════
  // ─── Cron: Daily Report (action=telegram-daily-report)
// Goi endpoint nay moi sang bang cron-job.org de nhan bao cao tu dong
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
      try {
        const { error: viewErr } = await supabase.from('analytics_page_views').insert({ page_type: pageType, school_slug: schoolSlug || null, school_name: schoolName || null, referrer: referrer || null, session_id: sessionId || null, user_agent: userAgent || null, ip: clientIp || null });
        if (viewErr) console.warn('Analytics insert warning:', viewErr.message);
      } catch (e) {
        console.warn('Analytics insert error:', e.message);
      }
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
      try { await supabase.from('analytics_searches').insert({ query, result_count: resultCount || 0, has_results: hasResults !== false, filters_used: filtersUsed || null, search_type: searchType || 'text', session_id: sessionId || null }); } catch (e) { console.warn('Analytics search error:', e.message); }
      break;
    }
    case 'event': {
      const { eventType, eventData, schoolSlug, sessionId } = data;
      if (!eventType) return { error: 'eventType is required' };
      try { await supabase.from('analytics_events').insert({ event_type: eventType, event_data: eventData || null, school_slug: schoolSlug || null, session_id: sessionId || null }); } catch (e) { console.warn('Analytics event error:', e.message); }
      break;
    }
    case 'session': {
      const { sessionId, action, pageType, referrer, userAgent } = data;
      if (!sessionId) return { error: 'sessionId is required' };
      if (action === 'start') {
        try {
          const { data: existing } = await supabase.from('analytics_sessions').select('id, page_views').eq('session_id', sessionId).maybeSingle();
          if (existing) { await supabase.from('analytics_sessions').update({ last_activity: new Date().toISOString(), page_views: (existing.page_views || 0) + 1, user_agent: userAgent || existing.user_agent }).eq('session_id', sessionId); }
          else { await supabase.from('analytics_sessions').insert({ session_id: sessionId, ip: clientIp || null, user_agent: userAgent || null, referrer: referrer || null, landing_page: pageType || null, page_views: 1, started_at: new Date().toISOString(), last_activity: new Date().toISOString() }); }
        } catch (e) { console.warn('Analytics session error:', e.message); }
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

// ─── Action: Profile Analysis (action=profile-analysis)
// Phân tích hồ sơ học sinh bằng AI dựa trên KB_ANALYSIS_FRAMEWORK
async function handleProfileAnalysis(req, res) {
  const apiKey = getDeepSeekKey();
  if (!apiKey) {
    return res.status(503).json({ success: false, error: 'DEEPSEEK_API_KEY chưa được cấu hình.' });
  }

  const { profile } = req.body || {};
  if (!profile || typeof profile !== 'object') {
    return res.status(400).json({ success: false, error: 'Thiếu thông tin hồ sơ.' });
  }

  const p = profile;
  const visaType = p.visaType || 'D-4-1';

  // Fetch similar cases for RAG context
  const similarCases = await fetchSimilarCases(p);

  // Build profile summary for AI
  var profileSummary = `=== HỒ SƠ HỌC SINH ===\n`;
  profileSummary += `Loại visa: ${visaType}\n`;
  profileSummary += `Họ tên: ${p.fullName || 'Chưa rõ'}\n`;
  profileSummary += `Giới tính: ${p.gender === 'male' ? 'Nam' : p.gender === 'female' ? 'Nữ' : 'Chưa rõ'}\n`;
  profileSummary += `Ngày sinh: ${p.dateOfBirth || 'Chưa rõ'}\n`;
  profileSummary += `Học vấn: ${p.educationLevel === 'university' ? 'Đại học/Cao đẳng' : 'THPT'}\n`;
  profileSummary += `Trường THPT: ${p.highSchoolName || 'Chưa rõ'}\n`;
  profileSummary += `GPA: ${p.gpa || 'Chưa rõ'}/10\n`;
  profileSummary += `Năm tốt nghiệp: ${p.graduationYear || 'Chưa rõ'}\n`;
  profileSummary += `Tiếng Hàn: ${p.koreanLevel || 'Chưa có'}\n`;
  profileSummary += `TOPIK: ${p.hasTopik && p.topikGrade ? 'Có - Topik ' + p.topikGrade : 'Chưa có'}\n`;
  profileSummary += `IELTS: ${p.ieltsScore || 'Chưa có'}\n`;
  profileSummary += `Gap year: ${p.gapYears ? p.gapYears + ' năm' : 'Không có'}\n`;
  profileSummary += `Trường dự định: ${p.chosenSchool || 'Chưa chọn'}\n`;
  profileSummary += `Ngành dự định: ${p.chosenMajor || 'Chưa chọn'}\n`;
  profileSummary += `Sổ tiết kiệm: ${p.savingsAmount ? p.savingsAmount.toLocaleString() + ' USD' : 'Chưa rõ'}\n`;
  profileSummary += `Bảo lãnh: ${p.sponsorIsSelf ? 'Tự thân' : p.sponsorRelation === 'parent' ? 'Cha/Mẹ' : 'Người thân khác'}\n`;
  if (!p.sponsorIsSelf) {
    profileSummary += `Người bảo lãnh: ${p.sponsorName || 'Chưa rõ'} - ${p.sponsorOccupation || 'Chưa rõ'}\n`;
  }
  profileSummary += `Đã từng trượt visa: ${p.hasVisaRejection ? 'Có' : 'Không'}\n`;
  if (p.hasVisaRejection) {
    profileSummary += `Lý do trượt: ${p.rejectionReason || 'Không rõ'}\n`;
  }
  profileSummary += `Người thân bất hợp pháp: ${p.hasIllegalRelative ? 'Có (!)' : 'Không'}\n`;
  profileSummary += `Kinh nghiệm làm việc: ${p.hasWorkExperience ? 'Có' : 'Không'}\n`;
  if (p.hasWorkExperience) {
    profileSummary += `Công ty: ${p.workCompany || 'Chưa rõ'}\n`;
    profileSummary += `Vị trí: ${p.workPosition || 'Chưa rõ'}\n`;
    profileSummary += `Thời gian: ${p.workDuration ? p.workDuration + ' năm' : 'Chưa rõ'}\n`;
    profileSummary += `HĐLĐ/BHXH: ${p.hasLaborContract ? 'Có' : 'Không'}\n`;
  }
  if (visaType === 'D-2') {
    profileSummary += `Thư giới thiệu: ${p.hasRecommendation ? 'Có' : 'Chưa có'}\n`;
  }
  if (visaType === 'D4-to-D2') {
    profileSummary += `Trường tiếng hiện tại: ${p.currentKoreanSchool || 'Chưa rõ'}\n`;
    profileSummary += `Level: ${p.currentKoreanLevel || 'Chưa rõ'}\n`;
    profileSummary += `Vị trí: ${p.currentLocation === 'korea' ? 'Đang ở Hàn' : 'Việt Nam'}\n`;
  }

  // Build similar cases context
  var caseContext = '';
  if (similarCases.length > 0) {
    caseContext = '\n=== CASE TƯƠNG TỰ (THAM KHẢO) ===';
    similarCases.forEach(function(c, i) {
      var sp = c.student_profile || {};
      caseContext += '\nCase ' + (i + 1) + ' (' + (c.result === 'approved' ? 'ĐÃ ĐỖ' : c.result === 'rejected' ? 'TRƯỢT' : c.result || 'Đang xử lý') + '):';
      caseContext += '\n  • ' + (sp.gender === 'female' ? 'Nữ' : 'Nam') + ', ' + (sp.age || '?') + 't, GPA ' + (sp.gpa || '?') + ', Tiếng Hàn: ' + (sp.korean || '?');
      caseContext += '\n  • KQ: ' + (c.result || 'Unknown') + ' | Ghi chú: ' + (c.notes || 'Không có');
    });
  }

  // Guard: kiểm tra hồ sơ có đủ dữ liệu để phân tích
  var hasData = p.fullName || p.gpa || p.dateOfBirth || p.koreanLevel || p.savingsAmount || p.hasVisaRejection !== undefined;
  if (!hasData) {
    return res.json({ success: false, error: 'Hồ sơ chưa có đủ thông tin để phân tích bằng AI. Vui lòng khai báo đầy đủ trước.' });
  }

  const systemPrompt = `Bạn là chuyên gia phân tích hồ sơ du học Hàn Quốc. Nhiệm vụ của bạn là phân tích hồ sơ học sinh theo FRAMEWORK dưới đây và trả về kết quả dạng JSON.

${KB_ANALYSIS_FRAMEWORK}

${KB_DOCUMENT_DECISION_RULES}

${KB_FOR_GAP}

${KB_FOR_REJECTION}

QUY TẮC QUAN TRỌNG:
1. Phân tích CHI TIẾT từng nhóm, không bỏ sót
2. Với mỗi nhóm, xác định rõ: điểm mạnh, điểm yếu, rủi ro, chứng cứ thiếu, hành động
3. Đánh giá tổng thể: hồ sơ tốt/trung bình/rủi ro cao
4. Đưa ra quyết định sau phân tích (có nhận không? cần bổ sung gì? có cần đổi trường?)
5. TUYỆT ĐỐI CHÍNH XÁC: chỉ phân tích dựa trên thông tin được cung cấp

${caseContext}

TRẢ VỀ JSON CHUẨN (KHÔNG markdown, KHÔNG giải thích thêm):
{
  "groups": [
    {
      "group": "Nhân thân",
      "icon": "👤",
      "strengths": ["..."],
      "weaknesses": ["..."],
      "risks": ["..."],
      "missingEvidence": ["..."],
      "actions": ["..."]
    },
    {
      "group": "Học vấn",
      "icon": "🎓",
      "strengths": ["..."],
      "weaknesses": ["..."],
      "risks": ["..."],
      "missingEvidence": ["..."],
      "actions": ["..."]
    },
    {
      "group": "Kinh nghiệm",
      "icon": "💼",
      "strengths": ["..."],
      "weaknesses": ["..."],
      "risks": ["..."],
      "missingEvidence": ["..."],
      "actions": ["..."]
    },
    {
      "group": "Tài chính",
      "icon": "💰",
      "strengths": ["..."],
      "weaknesses": ["..."],
      "risks": ["..."],
      "missingEvidence": ["..."],
      "actions": ["..."]
    },
    {
      "group": "Nhập cảnh",
      "icon": "🛂",
      "strengths": ["..."],
      "weaknesses": ["..."],
      "risks": ["..."],
      "missingEvidence": ["..."],
      "actions": ["..."]
    },
    {
      "group": "Gia đình",
      "icon": "👨‍👩‍👧‍👧",
      "strengths": ["..."],
      "weaknesses": ["..."],
      "risks": ["..."],
      "missingEvidence": ["..."],
      "actions": ["..."]
    }
  ],
  "overall": {
    "score": 0-100,
    "label": "✅ Hồ sơ tốt" hoặc "⚠ Hồ sơ trung bình" hoặc "⚠ Hồ sơ rủi ro" hoặc "❌ Hồ sơ rủi ro cao",
    "summary": "Đánh giá tổng quan 1-2 câu",
    "decisions": ["Quyết định 1", "Quyết định 2", "..."],
    "topActions": ["Hành động ưu tiên 1", "Hành động ưu tiên 2", "..."]
  }
}`;

  const userMessage = `Phân tích hồ sơ học sinh sau theo framework 6 nhóm:\n\n${profileSummary}`;

  const analysis = await callDeepSeek(
    [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
    { temperature: 0.3, maxTokens: 3000, timeout: 30000 }
  );

  if (!analysis) {
    return res.json({ success: false, error: 'Không nhận được phản hồi từ AI.' });
  }

  // Parse JSON từ response
  try {
    var jsonStr = analysis.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    var parsed = JSON.parse(jsonStr);
    return res.json({ success: true, analysis: parsed });
  } catch (e) {
    // Nếu parse JSON thất bại, trả về text gốc để frontend xử lý
    console.error('Profile analysis JSON parse error:', e.message);
    return res.json({ success: true, analysis: null, rawAnalysis: analysis });
  }
}

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
      case 'review-study-plan': return await handleReviewStudyPlan(req, res);
      case 'interview-simulator': return await handleInterviewSimulator(req, res);
      case 'student-agent': return await handleStudentAgent(req, res);
      case 'analytics': return await handleAnalytics(req, res);
      case 'profile-analysis': return await handleProfileAnalysis(req, res);
      case 'telegram-daily-report': return await handleTelegramDailyReport(req, res);
      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (err) {
    console.error('/api/deepseek error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};
