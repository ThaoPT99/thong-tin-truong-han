# KẾ HOẠCH XÂY DỰNG HỆ THỐNG
## Hỗ trợ tự làm hồ sơ du học Hàn Quốc

**Ngày cập nhật:** 19/07/2026  
**Phiên bản:** 1.0

---

## 1. TỔNG QUAN DỰ ÁN

### Mục tiêu MVP
Xây dựng nền tảng web帮助学生自助完成 70-80% hồ sơ du học Hàn Quốc, với:
- **Checklist tương tác** theo từng loại visa (miễn phí)
- **AI hỗ trợ** soạn Study Plan, chấm điểm bài luận, mô phỏng phỏng vấn (trả phí)
- **Knowledge Base** chứa quy định visa, mẫu giấy tờ, kinh nghiệm thực tế

### Phạm vi MVP
| Visa Type | Phạm vi |
|-----------|---------|
| D-4-1 (Học tiếng) | ✅ Đầy đủ |
| D-2 (Đại học chính quy) | ✅ Đầy đủ |
| D4→D2 (Chuyển đổi) | ✅ Đầy đủ |

---

## 2. TECH STACK

| Layer | Công nghệ | Lý do |
|-------|-----------|-------|
| **Frontend** | Next.js 15 (App Router) + Tailwind CSS | SSR/SSG, Server Components, SEO tốt |
| **Backend** | Next.js Server Actions + Supabase | Đơn giản, ít boilerplate |
| **Database** | PostgreSQL (Supabase) | Reliable, relational, free tier tốt |
| **Auth** | Supabase Auth | 50K MAU miễn phí, easy integration |
| **AI** | DeepSeek API (deepseek-v4-flash) | Rẻ, nhanh, hỗ trợ tiếng Việt tốt |
| **Storage** | Supabase Storage | 1GB miễn phí, đủ cho tài liệu |
| **Hosting** | Vercel (Free tier) + Supabase (Free tier) | **$0/tháng** cho MVP |
| **Domain** | Chưa cần (vercel.app) | Sau MVP mới cần |

### Chi phí ước tính MVP
| Items | Chi phí/tháng |
|-------|---------------|
| Vercel Free | $0 |
| Supabase Free | $0 |
| DeepSeek API (1000 users) | ~$5-15 |
| **Tổng** | **~$5-15/tháng** |

---

## 3. DATABASE SCHEMA

### Core Tables

```sql
-- 1. Người dùng
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Hồ sơ du học
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  
  -- Thông tin cá nhân
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  hometown TEXT,
  current_address TEXT,
  marital_status TEXT,
  
  -- Học vấn
  education_level TEXT, -- THPT, Cao đẳng, Đại học...
  school_name TEXT,
  gpa DECIMAL(3,1),
  graduation_year INTEGER,
  tosok_level INTEGER, -- 0-6
  ielts_score DECIMAL(2,1),
  
  -- Visas
  visa_type TEXT CHECK (visa_type IN ('D-4-1', 'D-2', 'D4_to_D2')),
  target_school TEXT,
  target_major TEXT,
  
  -- Tài chính
  sponsor_name TEXT,
  sponsor_relationship TEXT,
  sponsor_occupation TEXT,
  sponsor_income_monthly DECIMAL,
  savings_amount DECIMAL,
  savings_duration_months INTEGER,
  
  -- Kinh nghiệm làm việc
  has_work_experience BOOLEAN DEFAULT FALSE,
  work_duration_months INTEGER,
  work_description TEXT,
  has_labor_contract BOOLEAN,
  has_social_insurance BOOLEAN,
  
  -- Lịch sử nhập cảnh
  has_korea_visa_before BOOLEAN DEFAULT FALSE,
  has_visa_rejection BOOLEAN DEFAULT FALSE,
  rejection_reason TEXT,
  has_illegal_residence_relative BOOLEAN DEFAULT FALSE,
  
  -- Trạng thái
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'submitted', 'approved', 'rejected')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Checklist tiến độ
CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  
  module TEXT NOT NULL, -- 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'B1'...
  item_name TEXT NOT NULL,
  description TEXT,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'not_applicable')),
  notes TEXT,
  due_date DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Giấy tờ
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  
  document_type TEXT NOT NULL, -- 'passport', 'transcript', 'diploma', 'savings_book'...
  original_status TEXT DEFAULT 'not_ready' CHECK (original_status IN ('not_ready', 'ready', 'translated', 'notarized', 'legalized')),
  
  file_url TEXT, -- Supabase Storage URL
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Study Plan drafts
CREATE TABLE study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  
  answers JSONB NOT NULL, -- Câu trả lời từ form
  ai_draft TEXT, -- Bản nháp AI tạo
  user_edit TEXT, -- Bản chỉnh sửa của user
  final_version TEXT, -- Phiên bản cuối cùng
  
  score INTEGER, -- Điểm AI chấm (0-100)
  feedback TEXT, -- Gợi ý cải thiện
  
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'reviewing', 'finalized')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Nhắc nhở deadlines
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  reminder_type TEXT CHECK (reminder_type IN ('document', 'submission', 'interview', 'other')),
  
  is_completed BOOLEAN DEFAULT FALSE,
  notified BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Phỏng vấn mô phỏng
CREATE TABLE interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  
  questions JSONB, -- Danh sách câu hỏi
  answers JSONB, -- Câu trả lời của user
  feedback TEXT, -- Đánh giá từ AI
  
  score INTEGER,
  duration_seconds INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Knowledge Base (cho RAG)
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  category TEXT NOT NULL, -- 'visa_rule', 'document_requirement', 'university_rule', 'case_study'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT, -- Nguồn tham khảo
  
  embedding VECTOR(1536), -- Cho vector search (nếu dùng)
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Cases (Case Library)
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  application_id UUID REFERENCES applications(id),
  
  visa_type TEXT,
  problems TEXT[], -- Vấn đề gặp phải
  analysis TEXT, -- Phân tích
  decision TEXT, -- Quyết định
  documents_required TEXT[], -- Giấy tờ yêu cầu
  result TEXT, -- Kết quả
  lessons_learned TEXT[], -- Bài học
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. CẤU TRÚC FOLDER

```
korea-study-abroad/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth routes (grouped)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/              # Dashboard routes (protected)
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx          # Overview
│   │   │   │   ├── applications/
│   │   │   │   │   ├── page.tsx      # List applications
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx  # Create new application
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── page.tsx  # Application detail
│   │   │   │   │       ├── checklist/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       ├── documents/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       ├── study-plan/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       ├── interview/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       └── reminders/
│   │   │   │   │           └── page.tsx
│   │   │   │   └── profile/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (marketing)/              # Public pages
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── features/
│   │   │   │   └── page.tsx
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx
│   │   │   ├── guide/
│   │   │   │   ├── page.tsx          # Hướng dẫn tổng quan
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Hướng dẫn chi tiết
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/                      # API Routes (cho webhook, AI)
│   │   │   ├── ai/
│   │   │   │   ├── study-plan/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── review/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── interview/
│   │   │   │   │   └── route.ts
│   │   │   │   └── feedback/
│   │   │   │       └── route.ts
│   │   │   ├── webhooks/
│   │   │   │   └── stripe/
│   │   │   │       └── route.ts
│   │   │   └── health/
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Redirect to landing
│   │   └── globals.css
│   │
│   ├── components/                   # Shared UI components
│   │   ├── ui/                       # Base UI (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── checklist/
│   │   │   ├── ChecklistItem.tsx
│   │   │   ├── ChecklistProgress.tsx
│   │   │   └── ChecklistModule.tsx
│   │   ├── study-plan/
│   │   │   ├── QuestionForm.tsx
│   │   │   ├── DraftViewer.tsx
│   │   │   ├── ScoreDisplay.tsx
│   │   │   └── FeedbackPanel.tsx
│   │   ├── documents/
│   │   │   ├── DocumentCard.tsx
│   │   │   ├── DocumentStatus.tsx
│   │   │   └── FileUpload.tsx
│   │   ├── interview/
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── AnswerInput.tsx
│   │   │   └── FeedbackDisplay.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       ├── Footer.tsx
│   │       └── MobileNav.tsx
│   │
│   ├── lib/                          # Utilities & configs
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server client
│   │   │   └── middleware.ts
│   │   ├── ai/
│   │   │   ├── deepseek.ts           # DeepSeek API client
│   │   │   ├── prompts.ts            # System prompts
│   │   │   └── parsers.ts            # Response parsers
│   │   ├── validators/
│   │   │   ├── application.ts        # Zod schemas
│   │   │   ├── study-plan.ts
│   │   │   └── user.ts
│   │   ├── utils/
│   │   │   ├── format.ts
│   │   │   └── date.ts
│   │   └── constants/
│   │       ├── visa-types.ts
│   │       ├── checklist-data.ts
│   │       └── document-requirements.ts
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useApplication.ts
│   │   ├── useChecklist.ts
│   │   ├── useStudyPlan.ts
│   │   └── useAI.ts
│   │
│   ├── types/                        # TypeScript types
│   │   ├── database.ts               # Generated from Supabase
│   │   ├── application.ts
│   │   └── ai.ts
│   │
│   └── data/                         # Static data (checklist, templates)
│       ├── d4-1-checklist.ts
│       ├── d2-checklist.ts
│       ├── d4-to-d2-checklist.ts
│       ├── study-plan-questions.ts
│       └── interview-questions.ts
│
├── public/                           # Static assets
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero.png
│   │   └── documents/                # Mẫu giấy tờ
│   └── fonts/
│
├── prisma/                           # Database schema (optional)
│   └── schema.prisma
│
├── .env.local                        # Environment variables
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 5. PHASE BUILD CHI TIẾT

### PHASE 1: Foundation (Tuần 1-2)
**Mục tiêu:** Setup project + Auth + Database

| Task | Chi tiết | Thời gian |
|------|----------|-----------|
| Init Next.js project | `npx create-next-app@latest` với TypeScript + Tailwind + App Router | Ngày 1 |
| Setup Supabase | Tạo project, lấy API keys, cấu hình env | Ngày 1 |
| Setup Database | Chạy migration, tạo tables theo schema ở trên | Ngày 2 |
| Setup Auth | Login/Register với Supabase Auth (email + social) | Ngày 2-3 |
| Layout system | Header, Sidebar, Footer responsive | Ngày 3-4 |
| Landing page | Hero section + Features + CTA | Ngày 5-6 |
| Testing | Kiểm tra auth flow, database queries | Ngày 7 |

**Deliverable:** Auth works, DB connected, basic UI shell

---

### PHASE 2: Core Features - Free Tier (Tuần 3-4)
**Mục tiêu:** Checklist + Templates + Document tracking

| Task | Chi tiết | Thời gian |
|------|----------|-----------|
| Application CRUD | Tạo/sửa/xem hồ sơ du học | Ngày 1-2 |
| Dynamic Checklist | Checklist theo visa type, tick items, progress % | Ngày 3-4 |
| Document tracking | Upload + theo dõi trạng thái giấy tờ | Ngày 5-6 |
| Deadline reminders | Tạo + hiển thị reminders | Ngày 7 |
| Dashboard | Overview page với stats | Ngày 7 |

**Deliverable:** User có thể tạo hồ sơ + track tiến độ miễn phí

---

### PHASE 3: AI Features (Tuần 5-7)
**Mục tiêu:** Study Plan + Review + Interview simulation

| Task | Chi tiết | Thời gian |
|------|----------|-----------|
| DeepSeek integration | Setup API client, rate limiting | Ngày 1 |
| Study Plan Generator | Form câu hỏi → AI tạo draft | Ngày 2-4 |
| Study Plan Reviewer | AI chấm điểm + gợi ý sửa | Ngày 5-6 |
| Document Review | AI check hồ sơ tài chính | Ngày 7 |
| Interview Simulator | AI tạo câu hỏi + chấm câu trả lời | Ngày 8-10 |
| AI feedback display | UI hiển thị feedback rõ ràng | Ngày 11-12 |
| Testing & Tuning | Test prompts, optimize output | Ngày 13-14 |

**Deliverable:** AI features hoạt động, output chất lượng cao

---

### PHASE 4: Knowledge Base + Content (Tuần 8-9)
**Mục tiêu:** Guide articles + Template library

| Task | Chi tiết | Thời gian |
|------|----------|-----------|
| Guide articles | Viết hướng dẫn từng bước (D-4-1, D-2, D4→D2) | Ngày 3-5 |
| Document templates | Upload mẫu đơn từ, checklists | Ngày 6-7 |
| FAQ section | Câu hỏi thường gặp | Ngày 8 |
| SEO optimization | Meta tags, structured data | Ngày 9-10 |

**Deliverable:** Nội dung phong phú, SEO tốt

---

### PHASE 5: Monetization (Tuần 10-11)
**Mục tiêu:** Payment integration

| Task | Chi tiết | Thời gian |
|------|----------|-----------|
| Pricing page | Hiển thị plans rõ ràng | Ngày 1 |
| Payment integration | LemonSqueezy hoặc Stripe | Ngày 2-4 |
| Usage tracking | Track AI usage per user | Ngày 5 |
| Paywall | Gate AI features behind payment | Ngày 6-7 |
| Receipt/Invoice | Tạo hóa đơn | Ngày 8 |

**Deliverable:** Có thể thu tiền từ users

---

### PHASE 6: Polish + Launch (Tuần 12-13)
**Mục tiêu:** UX polish + deployment

| Task | Chi tiết | Thời gian |
|------|----------|-----------|
| Responsive design | Mobile-first, tablet, desktop | Ngày 2-3 |
| Loading states | Skeleton, spinners, transitions | Ngày 4 |
| Error handling | Error boundaries, toast notifications | Ngày 5 |
| Analytics | PostHog hoặc Plausible | Ngày 6 |
| Deployment | Vercel deploy, custom domain | Ngày 7 |
| Monitoring | Error tracking (Sentry) | Ngày 8 |
| Documentation | README, user guide | Ngày 9-10 |

**Deliverable:** Production-ready MVP

---

## 6. DATA NỘI DUNG CẦN THIẾT

### 📋 Bạn cần cung cấp / xác nhận:

| # | Nội dung | Mức độ quan trọng | Ghi chú |
|---|----------|-------------------|---------|
| 1 | **Xác nhận checklist D-4-1** | 🔴 Cao | Tôi sẽ research từ nguồn chính thống, bạn review lại |
| 2 | **Checklist D-2** | 🔴 Cao | Tôi sẽ research, bạn confirm |
| 3 | **Mẫu Study Plan** | 🟡 TB | Tôi sẽ tạo template mẫu, bạn có thể thêm ví dụ thật |
| 4 | **Câu hỏi phỏng vấn** | 🟡 TB | Tôi sẽ tổng hợp từ nguồn online |
| 5 | **Quy tắc phân tích** | 🟡 TB | Tôi sẽ xây dựng rules, bạn review |
| 6 | **Hình ảnh minh họa** | 🟢 Thấp | Có thể dùng placeholder ban đầu |
| 7 | **Brand identity** | 🟢 Thấp | Logo, màu sắc, tagline |

### Tôi sẽ tự xử lý:
- ✅ Research quy định visa mới nhất 2025-2026
- ✅ Tạo checklist chi tiết cho từng visa type
- ✅ Viết prompts cho DeepSeek
- ✅ Xây rule engine đơn giản
- ✅ Tạo sample Study Plan
- ✅ Tổng hợp câu hỏi phỏng vấn

---

## 7. PROMPT TEMPLATES CHO DEEPSEEK

### 7.1 Study Plan Generator

```
System: Bạn là chuyên viên tư vấn du học Hàn Quốc với 10 năm kinh nghiệm.
Nhiệm vụ: Viết Study Plan cho học sinh Việt Nam xin visa du học Hàn Quốc.

Quy tắc:
- Viết bằng tiếng Hàn (nếu học sinh yêu cầu) hoặc tiếng Anh
- Chi tiết, cụ thể, có mốc thời gian rõ ràng
- Phù hợp với ngành học và trường đã chọn
- Tránh chung chung, phải có cá nhân hóa
- Độ dài: 500-800 từ

Dữ liệu đầu vào:
- Họ tên: {full_name}
- Ngành học: {major}
- Trường: {school}
- Visa type: {visa_type}
- Trình độ tiếng Hàn: {korean_level}
- Kế hoạch tương lai: {future_plan}
- Khoảng trống thời gian (nếu có): {gap_year}
- Thông tin gia đình/bảo lãnh: {family_info}
```

### 7.2 Study Plan Reviewer

```
System: Bạn là evaluator cho Study Plan du học Hàn Quốc.
Nhiệm vụ: Đánh giá bản Study Plan và đưa ra feedback chi tiết.

Tiêu chí đánh giá (mỗi tiêu chí 0-20 điểm):
1. Tính cụ thể (Specificity) - Có mốc thời gian, mục tiêu rõ ràng?
2. Tính khả thi (Feasibility) - Kế hoạch có thực tế không?
3. Tính nhất quán (Consistency) - Nhất quán với hồ sơ?
4. Động lực (Motivation) - Thể hiện đam mê, mục tiêu rõ?
5. Tương lai (Future Plan) - Có kế hoạch sau tốt nghiệp?

Output:
- Tổng điểm: /100
- Điểm mạnh: [list]
- Điểm yếu: [list]
- Gợi ý cải thiện: [list]
- Bản draft cải thiện: [nếu điểm < 70]

Study Plan cần đánh giá:
{study_plan_text}

Thông tin bổ sung:
- Visa type: {visa_type}
- Ngành học: {major}
```

### 7.3 Interview Simulator

```
System: Bạn là lãnh sự viên phỏng vấn visa du học Hàn Quốc.
Nhiệm vụ: Đặt câu hỏi phỏng vấn và đánh giá câu trả lời.

Quy tắc:
- Đặt 5-10 câu hỏi phù hợp với visa type
- Đánh giá câu trả lời: nội dung, sự tự tin, tính nhất quán
- Gợi ý câu trả lời tốt hơn nếu cần
- Đánh giá mức độ sẵn sàng: Ready / Needs Improvement / Not Ready

Thông tin học sinh:
- Visa type: {visa_type}
- Ngành học: {major}
- Trường: {school}
- Trình độ tiếng: {language_level}

Bắt đầu phỏng vấn mô phỏng. Đặt câu hỏi đầu tiên.
```

---

## 8. CHECKLIST DATA (D-4-1 EXAMPLE)

```typescript
// src/data/d4-1-checklist.ts

export const D4_1_CHECKLIST = {
  visa_type: 'D-4-1',
  name: 'Visa D-4-1: Du học tiếng Hàn',
  
  modules: [
    {
      id: 'A1',
      name: 'Giấy tờ hành chính cá nhân',
      required: true,
      items: [
        {
          id: 'A1-1',
          name: 'Đơn xin visa mẫu KSD0-2014',
          description: 'Tải mẫu từ website ĐSQ/LSQ Hàn Quốc',
          required: true,
          document_type: 'visa_application_form',
        },
        {
          id: 'A1-2',
          name: 'Hộ chiếu còn hạn',
          description: 'Còn hạn ít nhất 6 tháng, còn trang trống',
          required: true,
          document_type: 'passport',
        },
        {
          id: 'A1-3',
          name: 'Ảnh 3.5x4.5cm',
          description: 'Nền trắng, chụp trong 6 tháng',
          required: true,
          document_type: 'photo',
        },
        {
          id: 'A1-4',
          name: 'CCCD/CMND',
          description: 'Bản photo rõ ràng',
          required: true,
          document_type: 'id_card',
        },
        {
          id: 'A1-5',
          name: 'Hộ khẩu',
          description: 'Bản photo (có thể cần dịch thuật)',
          required: true,
          document_type: 'household_registration',
        },
        {
          id: 'A1-6',
          name: 'Giấy khai sinh',
          description: 'Bản sao có xác nhận',
          required: true,
          document_type: 'birth_certificate',
        },
      ],
    },
    {
      id: 'A2',
      name: 'Giấy tờ học vấn',
      required: true,
      items: [
        {
          id: 'A2-1',
          name: 'Bằng tốt nghiệp THPT',
          description: 'Bản gốc + bản dịch công chứng',
          required: true,
          document_type: 'diploma',
        },
        {
          id: 'A2-2',
          name: 'Học bạ THPT',
          description: 'Bản gốc + bản dịch công chứng',
          required: true,
          document_type: 'transcript',
        },
        {
          id: 'A2-3',
          name: 'Giải trình khoảng trống thời gian',
          description: 'Nếu có gap > 6 tháng sau tốt nghiệp',
          required: false, // Conditional
          conditional: 'gap_year > 6',
          document_type: 'gap_explanation',
        },
      ],
    },
    {
      id: 'A3',
      name: 'Giấy tờ từ trường (nhận từ trường)',
      required: true,
      items: [
        {
          id: 'A3-1',
          name: 'Admission Letter / Certificate of Admission',
          description: 'Nhận từ trường đại học Hàn Quốc',
          required: true,
          document_type: 'admission_letter',
          source: 'school',
        },
        {
          id: 'A3-2',
          name: 'Invoice học phí',
          description: 'Chi tiết học phí năm đầu',
          required: true,
          document_type: 'tuition_invoice',
          source: 'school',
        },
      ],
    },
    {
      id: 'A4',
      name: 'Chứng minh tài chính',
      required: true,
      items: [
        {
          id: 'A4-1',
          name: 'Sổ tiết kiệm',
          description: 'Tối thiểu 9,000 USD (~200 triệu VND), đủ kỳ hạn 1 tháng',
          required: true,
          document_type: 'savings_book',
        },
        {
          id: 'A4-2',
          name: 'Xác nhận số dư tài khoản',
          description: 'From ngân hàng, trong 3 tháng gần nhất',
          required: true,
          document_type: 'bank_statement',
        },
        {
          id: 'A4-3',
          name: 'Giấy cam kết bảo lãnh',
          description: 'Nếu người đứng tên khác học sinh',
          required: false,
          conditional: 'sponsor != self',
          document_type: 'sponsorship_letter',
        },
        {
          id: 'A4-4',
          name: 'Giấy tờ chứng minh quan hệ với bảo lãnh',
          description: 'Giấy khai sinh, đăng ký kết hôn...',
          required: false,
          conditional: 'sponsor != self',
          document_type: 'relationship_proof',
        },
        {
          id: 'A4-5',
          name: 'Hợp đồng lao động / Giấy tờ thu nhập',
          description: 'Của người bảo lãnh',
          required: true,
          document_type: 'income_proof',
        },
        {
          id: 'A4-6',
          name: 'Dịch công chứng toàn bộ',
          description: 'Dịch sang tiếng Hàn hoặc tiếng Anh',
          required: true,
          document_type: 'notarized_translation',
        },
      ],
    },
    {
      id: 'A5',
      name: 'Study Plan / Personal Statement',
      required: true,
      items: [
        {
          id: 'A5-1',
          name: 'Study Plan',
          description: 'Viết bằng tiếng Hàn hoặc tiếng Anh, 500-800 từ',
          required: true,
          document_type: 'study_plan',
          ai_assisted: true,
        },
        {
          id: 'A5-2',
          name: 'Personal Statement',
          description: 'Giới thiệu bản thân, động lực du học',
          required: false,
          document_type: 'personal_statement',
          ai_assisted: true,
        },
      ],
    },
    {
      id: 'A6',
      name: 'Nộp hồ sơ & Theo dõi',
      required: true,
      items: [
        {
          id: 'A6-1',
          name: 'Đặt lịch hẹn KVAC',
          description: 'visaforkorea-vt.com (HN) hoặc visaforkorea-hc.com (HCM)',
          required: true,
          document_type: 'kvac_booking',
        },
        {
          id: 'A6-2',
          name: 'Khám lao phổi',
          description: 'Tại bệnh viện được chỉ định',
          required: true,
          document_type: 'health_check',
        },
        {
          id: 'A6-3',
          name: 'Nộp hồ sơ',
          description: 'Đúng lịch hẹn, mang đủ giấy tờ',
          required: true,
          document_type: 'submission',
        },
        {
          id: 'A6-4',
          name: 'Theo dõi kết quả',
          description: 'Thời gian xử lý: 5-20 ngày làm việc',
          required: true,
          document_type: 'result_tracking',
        },
      ],
    },
  ],
};
```

---

## 9. NEXT STEPS

### Bạn cần làm:
1. ✅ **Review kế hoạch này** — Cho tôi biết có gì cần sửa/thêm
2. 🔑 **Tạo tài khoản Supabase** — https://supabase.com (miễn phí)
3. 🔑 **Tạo tài khoản DeepSeek** — https://platform.deepseek.com (lấy API key)
4. 🎨 **Chọn tên domain** (tùy chọn, có thể dùng vercel.app trước)
5. 📝 **Cung cấp thêm data** nếu có (mẫu Study Plan thật, câu hỏi phỏng vấn thực tế)

### Tôi sẽ bắt đầu build:
1. Setup Next.js project + Supabase
2. Database schema + migrations
3. Auth system
4. Landing page
5. Checklist system
6. ...và tiếp tục theo plan

---

*Plan được tạo bởi Buffy - Strategic Coding Assistant*
