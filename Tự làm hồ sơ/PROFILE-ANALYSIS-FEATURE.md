# 📊 Tính năng Phân tích Hồ sơ (Profile Analysis)

> **Mô tả:** Hệ thống phân tích hồ sơ học sinh du học Hàn Quốc theo **6 nhóm** dựa trên `KB_ANALYSIS_FRAMEWORK`, bao gồm cả rule-based engine và tích hợp DeepSeek AI.

---

## 🎯 Tổng quan

Tính năng này cho phép học sinh sau khi khai báo hồ sơ (cá nhân, học vấn, tài chính, rủi ro) có thể xem phân tích chi tiết về:

| Nhóm | Icon | Nội dung |
|------|------|----------|
| **Nhân thân** | 👤 | Tuổi, giới tính, khu vực |
| **Học vấn** | 🎓 | GPA, TOPIK/IELTS, gap year, thư giới thiệu |
| **Kinh nghiệm** | 💼 | Đã đi làm? HĐLĐ? BHXH? |
| **Tài chính** | 💰 | Sổ tiết kiệm, người bảo lãnh |
| **Nhập cảnh** | 🛂 | Trượt visa, lịch sử |
| **Gia đình** | 👨‍👩‍👧‍👧 | Người thân tại Hàn, bất hợp pháp |

Mỗi nhóm xác định **5 yếu tố**:
- ✅ Điểm mạnh
- ⚠️ Điểm yếu
- 🚨 Rủi ro
- 📋 Chứng cứ còn thiếu
- 🎯 Hành động đề xuất

---

## 🏗 Kiến trúc

```
┌─────────────────────────────────────────────────────────────┐
│                   User UI (checklist.js)                     │
│  Step 5: Analysis — rule-based hiện ngay + nút AI analysis  │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
┌──────────────────┐    ┌──────────────────────────┐
│ Rule-based Engine │    │   DeepSeek AI Analysis   │
│ (instant, local)  │    │   (async, API call)      │
│                   │    │                          │
│ profile-analysis  │    │ POST /api/deepseek        │
│ .js               │    │ ?action=profile-analysis  │
│                   │    │                          │
│ analyzeStudent    │    │ handleProfileAnalysis()   │
│ Profile(profile)  │    │ → fetchSimilarCases      │
│ → 6 groups        │    │ → Build system prompt    │
│ → overall score   │    │ → Call DeepSeek API      │
│ → decisions       │    │ → Parse JSON response    │
└──────────────────┘    └──────────────────────────┘
```

## 🗂 File structure

```
api/
  deepseek.js              # + handleProfileAnalysis (action=profile-analysis)
lib/
  knowledge-base.js        # KB_ANALYSIS_FRAMEWORK, KB_DOCUMENT_DECISION_RULES...
public/
  js/
    profile-analysis.js    # Rule-based engine + window.analyzeWithAI()
    checklist.js           # renderAnalysis() — UI tích hợp cả 2 engine
  styles.css               # CSS cho profile analysis (pa-*, pa-ai-*)
  index.html               # <script src="/js/profile-analysis.js">
```

---

## 📦 1. Rule-based Engine (`profile-analysis.js`)

### Cách hoạt động

Chạy hoàn toàn ở client-side, không cần gọi API. Phân tích dựa trên các rules được định nghĩa sẵn.

**Hàm chính:**
```js
window.analyzeStudentProfile(profile)
// → { groups: [...], overall: { score, label, decisions, topActions } }
```

**Các rules phân tích cho từng nhóm:**

| Nhóm | Rules chính |
|------|-------------|
| **Nhân thân** | Tuổi 18-25 là lý tưởng; >28 là rủi ro; Nam có rủi ro cao hơn nữ; Khu vực có tỉ lệ vi phạm cao (Nghệ An, Hà Tĩnh,...) |
| **Học vấn** | GPA >= 7 tốt; GPA < 5 rủi ro; TOPIK 3+ lợi thế; Gap > 2 năm cần giải trình |
| **Kinh nghiệm** | Có HĐLĐ = điểm mạnh; Gap + không việc = rủi ro |
| **Tài chính** | Sổ tiết kiệm >= 10,000 USD (D-4-1) / 18,000 USD (D-2); Bảo lãnh từ người thân khác = rủi ro |
| **Nhập cảnh** | Trượt visa = cần giải trình + chờ 3 tháng |
| **Gia đình** | Người thân bất hợp pháp = rủi ro cực cao |

**Điểm overall:**
```
Score = 100 - (risks × 10) - (weaknesses × 5) + (strengths × 3)
→  80+  ✅ Tốt
→  60+  ⚠ Trung bình
→  40+  ⚠ Rủi ro
→  <40  ❌ Rủi ro cao
```

---

## 🤖 2. DeepSeek AI Analysis

### Backend (`api/deepseek.js`)

```js
POST /api/deepseek?action=profile-analysis
Body: { profile: { fullName, gpa, koreanLevel, savingsAmount, ... } }
```

**System prompt** được xây dựng từ:
- `KB_ANALYSIS_FRAMEWORK` — framework 6 nhóm
- `KB_DOCUMENT_DECISION_RULES` — logic quyết định giấy tờ
- `KB_FOR_GAP` — phân tích gap year
- `KB_FOR_REJECTION` — phân tích trượt visa

**Response JSON:**
```json
{
  "groups": [
    {
      "group": "Nhân thân",
      "icon": "👤",
      "strengths": ["Tuổi phù hợp..."],
      "weaknesses": ["..."],
      "risks": ["..."],
      "missingEvidence": ["..."],
      "actions": ["..."]
    }
    // ... 5 nhóm còn lại
  ],
  "overall": {
    "score": 75,
    "label": "⚠ Hồ sơ trung bình",
    "summary": "Hồ sơ có điểm mạnh về...",
    "decisions": ["Có thể nhận hồ sơ..."],
    "topActions": ["Cần học TOPIK...", "Tăng sổ tiết kiệm..."]
  }
}
```

**RAG context:** Tự động tìm các case tương tự từ `advisor_cases` (Phase 4 Learning Agent) và thêm vào prompt để AI tham khảo.

### Frontend (`profile-analysis.js`)

```js
// Gọi AI analysis
await window.analyzeWithAI(profile)
// → parsed JSON hoặc { rawText: "..." } fallback
```

---

## 🖥 3. UI Components

### Màn hình phân tích (Step 5 trong checklist)

```
┌─────────────────────────────────────────────┐
│ 📊 Phân tích hồ sơ của bạn                   │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────── Overall Score ──────────┐ │
│  │  [SVG ring] 75/100  ⚠ Trung bình       │ │
│  │  📋 Quyết định: ...                     │ │
│  │  🎯 Hành động: ...                      │ │
│  └─────────────────────────────────────────┘ │
│                                             │
│  ┌─── Checklist Stats ───────────────────┐   │
│  │ 12 giấy tờ  ·  8 bắt buộc  ·  4 bổ sung│  │
│  └─────────────────────────────────────────┘ │
│                                             │
│  ┌─── Hồ sơ của bạn (toggle) ────────────┐  │
│  │ Visa: D-4-1 | GPA: 7.5 | ...          │  │
│  └─────────────────────────────────────────┘ │
│                                             │
│  ┌─── 6 Groups (2-cột grid) ────────────┐   │
│  │ 👤 Nhân thân     │ 🎓 Học vấn         │  │
│  │ ✅ Điểm mạnh     │ ✅ Điểm mạnh       │  │
│  │ ⚠️ Điểm yếu     │ ⚠️ Điểm yếu       │  │
│  │ 🚨 Rủi ro       │ 🚨 Rủi ro         │  │
│  │ ...             │ ...               │  │
│  ├─────────────────┼───────────────────┤  │
│  │ 💼 Kinh nghiệm  │ 💰 Tài chính      │  │
│  │ ...             │ ...               │  │
│  ├─────────────────┼───────────────────┤  │
│  │ 🛂 Nhập cảnh   │ 👨‍👩‍👧‍👧 Gia đình   │  │
│  └─────────────────┴───────────────────┘  │
│                                           │
│  ┌─── AI Analysis ───────────────────┐     │
│  │ 🧠 Phân tích bằng DeepSeek AI     │     │
│  │ [🤖 Phân tích bằng AI] button     │     │
│  │ ┌─ AI Results ─────────────────┐  │     │
│  │ │ 📊 Kết quả từ AI             │  │     │
│  │ │ Score, decisions, groups...  │  │     │
│  │ └──────────────────────────────┘  │     │
│  └────────────────────────────────────┘     │
│                                             │
│  [📋 Xem checklist cá nhân →]                │
└─────────────────────────────────────────────┘
```

### CSS classes

| Class | Mục đích |
|-------|----------|
| `.pa-overall` | Overall score card (nền dark) |
| `.pa-score-ring` | SVG ring progress |
| `.pa-groups` | Grid 2 cột cho 6 nhóm |
| `.pa-group-card` | Card từng nhóm (toggle) |
| `.pa-section-strength` | Sub-section màu xanh lá |
| `.pa-section-weakness` | Sub-section màu vàng |
| `.pa-section-risk` | Sub-section màu đỏ |
| `.pa-section-missing` | Sub-section màu xanh dương |
| `.pa-section-action` | Sub-section màu tím |
| `.pa-ai-section` | AI analysis section (viền tím dashed) |
| `.pa-ai-groups` | Grid 2 cột cho AI results |

---

## 🔧 Hướng dẫn sử dụng

### Người dùng (học sinh)

1. Vào tab **"Hồ sơ của tôi"** → khai báo thông tin qua 5 bước
2. Ở bước **"Phân tích"**, xem ngay kết quả rule-based (6 nhóm + điểm)
3. Bấm **"🤖 Phân tích bằng AI"** để AI phân tích sâu hơn
4. So sánh cả 2 kết quả, xem checklist cá nhân

### Developer

**Thêm rule mới** — edit `profile-analysis.js`:
```js
function analyzeEducation(profile) {
  // Thêm rules mới vào đây
  if (/* condition */) {
    result.strengths.push('...')
  }
}
```

**Tinh chỉnh AI prompt** — edit `api/deepseek.js`:
```js
const systemPrompt = `...${KB_ANALYSIS_FRAMEWORK}...`
// Thêm/bớt KB module vào prompt
```

---

## ✅ Tests

```bash
npx vitest run
# 114 tests passed (5 files)
```

Test files liên quan:
- `public/js/checklist-data.test.ts` — test rule engine
- `public/js/advisor.test.ts` — test quick profile parse

---

## 🚀 Future improvements

- [ ] Lưu kết quả AI analysis vào `advisor_cases` DB để làm Learning Agent
- [ ] Thêm unit tests cho `profile-analysis.js`
- [ ] Hiển thị so sánh rule-based vs AI analysis side-by-side
- [ ] Export kết quả phân tích ra PDF
