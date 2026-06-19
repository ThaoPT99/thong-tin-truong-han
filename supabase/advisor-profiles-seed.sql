-- ============================================================
-- Advisor Profile cho 18 trường (chạy trong Supabase SQL Editor)
-- Dựa trên: khu vực, hệ đào tạo, học phí, giới tính, uy tín
-- ============================================================

-- Xóa cũ (nếu chạy lại)
DELETE FROM school_advisor_profiles;

-- ============================================================
-- 1. Seoul (3 trường)
-- ============================================================

-- Induk: Công lập, Seoul, cao đẳng, học phí giảm 50% toàn khóa
INSERT INTO school_advisor_profiles (school_id, gender, cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
SELECT id, 'all', 3, 5, 5, 4, 3, 2, ARRAY['prestige', 'public']
FROM schools WHERE slug = 'dh-induk';

-- DongDuk (Nữ Đồng Đức): Đại học, Seoul, chỉ nữ, học phí ~2.1tr/kỳ (sau giảm 50%)
INSERT INTO school_advisor_profiles (school_id, gender, cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
SELECT id, 'female', 3, 4, 4, 4, 3, 3, ARRAY['female-only', 'seoul']
FROM schools WHERE slug = 'dh-nu-sinh-dongduk';

-- Sangmyung: Đại học, Seoul, tư thục uy tín, học phí giảm 50% kỳ đầu
INSERT INTO school_advisor_profiles (school_id, gender, cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
SELECT id, 'all', 4, 4, 5, 4, 3, 3, ARRAY['prestige', 'seoul']
FROM schools WHERE slug = 'dh-sangmyung';

-- ============================================================
-- 2. Busan (3 trường)
-- ============================================================

-- Busan Catholic: Cao đẳng, Busan, học bổng 50% kỳ đầu
INSERT INTO school_advisor_profiles (school_id, gender, cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
SELECT id, 'all', 3, 4, 3, 3, 3, 2, ARRAY['busan']
FROM schools WHERE slug = 'dh-busan-catholic';

-- Dong-Eui: Đại học, Busan, học phí 1.8tr/năm (học bổng 100% kỳ 1), uy tín
INSERT INTO school_advisor_profiles (school_id, gender, cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
SELECT id, 'all', 2, 4, 4, 4, 3, 3, ARRAY['busan', 'low-cost', 'high-visa']
FROM schools WHERE slug = 'dh-dongeui';

-- Nữ Busan: Cao đẳng, chỉ nữ, học bổng 50% kỳ đầu
INSERT INTO school_advisor_profiles (school_id, gender, cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
SELECT id, 'female', 3, 4, 3, 3, 3, 2, ARRAY['female-only', 'busan']
FROM schools WHERE slug = 'dh-nu-sinh-busan';

-- ============================================================
-- 3. Gyeonggi/Incheon - Gần Seoul (4 trường)
-- ============================================================

-- Osan: Cao đẳng, Gyeonggi, học bổng 50% toàn khóa, RẺ NHẤT
INSERT INTO school_advisor_profiles (school_id, gender, cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
SELECT id, 'all', 1, 4, 3, 3, 3, 2, ARRAY['low-cost', 'near-seoul', 'high-visa']
FROM schools WHERE slug = 'cd-osan';

-- KyungGin (Nữ KyungIn): Cao đẳng, Incheon, chỉ nữ, 1.48tr/kỳ (sau giảm), KTX rẻ
INSERT INTO school_advisor_profiles (school_id, gender, cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
SELECT id, 'female', 2, 4, 3, 3, 3, 2, ARRAY['female-only', 'near-seoul', 'low-cost']
FROM schools WHERE slug = 'dh-nu-sinh-kyungin';

-- Dongnam (Y Tế Đông Nam): Cao đẳng, Gyeonggi, chuyên y tế/du lịch
INSERT INTO school_advisor_profiles (school_id, gender, cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
SELECT id, 'all', 2, 4, 4, 3, 3, 2, ARRAY['near-seoul', 'specialized-medical']
FROM schools WHERE slug = 'dh-y-te-dongnam';

-- YeonSung: Cao đẳng, Gyeonggi, học bổng 50% kỳ đầu
INSERT INTO school_advisor_profiles (school_id, gender, cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
SELECT id, 'all', 2, 3, 3, 3, 3, 2, ARRAY['near-seoul', 'low-cost']
FROM schools WHERE slug = 'dh-yeonsung';

-- ============================================================
-- 4. Các tỉnh khác (8 trường)
-- ============================================================

-- Suncheon Jeil (Jeollanam): Cao đẳng, học bổng 50% toàn khóa, RẺ
INSERT INTO school_advisor_profiles (school_id, gender, cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
SELECT id, 'all', 1, 3, 2, 2, 3, 2, ARRAY['low-cost', 'province']
FROM schools WHERE slug = 'cd-suncheon-jeil';

-- Catholic Kwandong (Gangwon): Đại học 4 năm, công lập y tế uy tín
INSERT INTO school_advisor_profiles (school_id, gender, cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
SELECT id, 'all', 3, 4, 4, 4, 4, 3, ARRAY['prestige', 'medical', 'province']
FROM schools WHERE slug = 'dh-catholic-kwandong';

-- Daewon (Chungcheongbuk): Cao đẳng, học bổng 50% kỳ đầu
INSERT INTO school_advisor_profiles (school_id, gender, cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
SELECT id, 'all', 2, 3, 2, 2, 3, 2, ARRAY['low-cost', 'province']
FROM schools WHERE slug = 'dh-daewon';

-- Gimhae (Gyeongsangnam): Cao đẳng, học bổng 50% kỳ đầu
INSERT INTO school_advisor_profiles (school_id, gender, cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
SELECT id, 'all', 2, 3, 2, 2, 3, 2, ARRAY['low-cost', 'province']
FROM schools WHERE slug = 'dh-gimhae';

-- Gwangju (Quảng Châu): Đại học 4 năm, học bổng 50% kỳ đầu
INSERT INTO school_advisor_profiles (school_id, gender, cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
SELECT id, 'all', 3, 3, 3, 3, 3, 2, ARRAY['province']
FROM schools WHERE slug = 'dh-gwangju';

-- Jeonju (Jeollabuk): Đại học 4 năm, học phí theo ngành
INSERT INTO school_advisor_profiles (school_id, gender, cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
SELECT id, 'all', 3, 3, 3, 3, 3, 3, ARRAY['province']
FROM schools WHERE slug = 'dh-jeonju';

-- Nambu (Quảng Nam): Đại học 4 năm, học bổng 50% kỳ đầu
INSERT INTO school_advisor_profiles (school_id, gender, cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
SELECT id, 'all', 3, 3, 3, 3, 3, 2, ARRAY['province']
FROM schools WHERE slug = 'dh-nambu';

-- Sengmyung (Chungcheongbuk): Đại học 4 năm, học bổng 50% kỳ đầu
INSERT INTO school_advisor_profiles (school_id, gender, cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
SELECT id, 'all', 3, 3, 3, 3, 3, 2, ARRAY['province']
FROM schools WHERE slug = 'dh-sengmyung';

-- ============================================================
-- Verify
-- ============================================================
SELECT s.slug, s.name, ap.cost_level, ap.visa_chance, ap.job_opportunity, ap.e7_opportunity, ap.study_load, ap.gender, ap.tags
FROM school_advisor_profiles ap
JOIN schools s ON s.id = ap.school_id
ORDER BY 
  CASE ap.cost_level WHEN 1 THEN 1 WHEN 2 THEN 2 ELSE 3 END,
  ap.visa_chance DESC;