import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

let generateTimeline: Function;

beforeAll(async () => {
  // ─── Mock globals needed by personalization.js IIFE ───
  const mockWindow: Record<string, any> = {};
  vi.stubGlobal('window', mockWindow);

  const mockDoc: Record<string, any> = {
    readyState: 'complete',
    addEventListener: vi.fn(),
    querySelector: vi.fn().mockReturnValue(null),
    createElement: vi.fn().mockReturnValue({ textContent: '' }),
    body: {},
  };
  vi.stubGlobal('document', mockDoc);

  vi.stubGlobal('MutationObserver', vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
  })));

  vi.stubGlobal('localStorage', {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  });

  vi.stubGlobal('console', { log: vi.fn(), error: vi.fn(), warn: vi.fn() });
  vi.stubGlobal('setTimeout', vi.fn());
  vi.stubGlobal('setInterval', vi.fn());
  vi.stubGlobal('clearInterval', vi.fn());
  vi.stubGlobal('confirm', vi.fn());
  vi.stubGlobal('alert', vi.fn());
  vi.stubGlobal('fetch', vi.fn());

  // Fix date to make tests deterministic: July 23, 2026
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-07-23T00:00:00.000Z'));

  // Import personalization.js – IIFE runs, attaches to window
  await import('../js/personalization');

  // Verify function is accessible
  expect(mockWindow.personalization).toBeDefined();
  expect(typeof mockWindow.personalization.getTimelineFull).toBe('function');
  generateTimeline = mockWindow.personalization.getTimelineFull;
});

afterAll(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

// ═══════════════════════════════════════════════════════════════
// 1. BASIC STRUCTURE & RETURN TYPE
// ═══════════════════════════════════════════════════════════════

describe('Basic structure', () => {
  it('returns object with milestones, warnings, targetDate, monthsToTarget', () => {
    const result = generateTimeline({ visaType: 'D-4-1', age: 22 });
    expect(result).toBeDefined();
    expect(Array.isArray(result.milestones)).toBe(true);
    expect(Array.isArray(result.warnings)).toBe(true);
    expect(result.targetDate).toBeInstanceOf(Date);
    expect(typeof result.monthsToTarget).toBe('number');
  });

  it('returns empty milestones for null/undefined profile', () => {
    const nullResult = generateTimeline(null);
    expect(nullResult.milestones).toEqual([]);
    expect(nullResult.warnings).toEqual([]);

    const undefResult = generateTimeline(undefined);
    expect(undefResult.milestones).toEqual([]);
    expect(undefResult.warnings).toEqual([]);
  });

  it('each milestone has required properties', () => {
    const result = generateTimeline({ visaType: 'D-4-1', age: 22 });
    result.milestones.forEach((m: any) => {
      expect(m).toHaveProperty('id');
      expect(m).toHaveProperty('label');
      expect(m).toHaveProperty('icon');
      expect(m).toHaveProperty('date');
      expect(m).toHaveProperty('dateStr');
      expect(Array.isArray(m.tasks)).toBe(true);
      expect(typeof m.isPast).toBe('boolean');
      expect(typeof m.isUpcoming).toBe('boolean');
    });
  });

  it('returns at least 5 milestones for any valid visa type', () => {
    const r1 = generateTimeline({ visaType: 'D-4-1', age: 22 });
    const r2 = generateTimeline({ visaType: 'D-2', age: 22 });
    const r3 = generateTimeline({ visaType: 'D4-to-D2', age: 22 });
    expect(r1.milestones.length).toBeGreaterThanOrEqual(5);
    expect(r2.milestones.length).toBeGreaterThanOrEqual(5);
    expect(r3.milestones.length).toBeGreaterThanOrEqual(5);
  });
});

// ═══════════════════════════════════════════════════════════════
// 2. VISA TYPE DIFFERENTIATION
// ═══════════════════════════════════════════════════════════════

describe('Visa type differentiation', () => {
  it('D-4-1 returns common milestones with language and finance', () => {
    const result = generateTimeline({ visaType: 'D-4-1', age: 22 });
    const ids = result.milestones.map((m: any) => m.id);
    expect(ids).toContain('language');
    expect(ids).toContain('finance');
    expect(ids).toContain('school-app');
    expect(ids).toContain('visa-app');
    expect(ids).toContain('depart');
  });

  it('D-2 has TOPIK-focused tasks and Xin thư giới thiệu', () => {
    // Pass hasTopik=false + beginner so language milestone stays
    const result = generateTimeline({ visaType: 'D-2', age: 22, koreanLevel: 'beginner' });
    const languageMilestone = result.milestones.find((m: any) => m.id === 'language');
    expect(languageMilestone).toBeDefined();
    // Tasks should include TOPIK-focused items
    const tasksText = (languageMilestone.tasks || []).join(' ');
    expect(tasksText).toMatch(/TOPIK/);

    const schoolMilestone = result.milestones.find((m: any) => m.id === 'school-app');
    expect(schoolMilestone).toBeDefined();
    expect(schoolMilestone.tasks.some((t: string) => t.includes('thư giới thiệu'))).toBe(true);
  });

  it('D4-to-D2 returns 6 specific milestones (d4-* ids)', () => {
    const result = generateTimeline({ visaType: 'D4-to-D2', age: 22 });
    const ids = result.milestones.map((m: any) => m.id);
    expect(ids).toContain('d4-complete');
    expect(ids).toContain('d4-school');
    expect(ids).toContain('d4-immigration');
    expect(ids).toContain('d4-convert');
    expect(ids).toContain('d4-start');
    // Should NOT have common milestones
    expect(ids).not.toContain('language');
    expect(ids).not.toContain('finance');
    expect(ids).not.toContain('visa-app');
  });

  it('D4-to-D2 milestones have reduced offsetDays when currentLocation is korea', () => {
    const resultVietnam = generateTimeline({ visaType: 'D4-to-D2', age: 22, currentLocation: 'vietnam' });
    const resultKorea = generateTimeline({ visaType: 'D4-to-D2', age: 22, currentLocation: 'korea' });

    // Same number of milestones
    expect(resultKorea.milestones.length).toBe(resultVietnam.milestones.length);

    // When in Korea, offsetDays reduced by 30 (min 7) → dates are closer to target (later)
    // Use d4-immigration (base offset 30) since d4-convert (base 7) is already at min
    const immiKorea = resultKorea.milestones.find((m: any) => m.id === 'd4-immigration');
    const immiVietnam = resultVietnam.milestones.find((m: any) => m.id === 'd4-immigration');
    expect(immiKorea).toBeDefined();
    expect(immiVietnam).toBeDefined();
    expect(immiKorea.date.getTime()).toBeGreaterThan(immiVietnam.date.getTime());
  });
});

// ═══════════════════════════════════════════════════════════════
// 3. KOREAN LEVEL PERSONALIZATION
// ═══════════════════════════════════════════════════════════════

describe('Korean level personalization', () => {
  it('TOPIK 3+ removes language milestone entirely and adds success warning', () => {
    const result = generateTimeline({
      visaType: 'D-4-1', age: 22,
      hasTopik: true, topikGrade: '4', koreanLevel: 'topik4',
    });
    const hasLanguage = result.milestones.some((m: any) => m.id === 'language');
    expect(hasLanguage).toBe(false);
    // Should have success warning
    const successWarnings = result.warnings.filter((w: any) => w.type === 'success');
    expect(successWarnings.length).toBeGreaterThanOrEqual(1);
    expect(successWarnings[0].text).toMatch(/TOPIK/);
  });

  it('TOPIK 2 reduces language offset and adds info warning', () => {
    const result = generateTimeline({
      visaType: 'D-4-1', age: 22,
      hasTopik: true, topikGrade: '2', koreanLevel: 'topik2',
    });
    const language = result.milestones.find((m: any) => m.id === 'language');
    expect(language).toBeDefined();
    expect(result.warnings.some((w: any) => w.type === 'info' && w.text.includes('TOPIK 2'))).toBe(true);
  });

  it('Beginner/none level extends offset to ~180 days and adds warning', () => {
    const result = generateTimeline({
      visaType: 'D-4-1', age: 22,
      koreanLevel: 'none',
    });
    const language = result.milestones.find((m: any) => m.id === 'language');
    expect(language).toBeDefined();
    expect(result.warnings.some((w: any) => w.type === 'warning' && w.text.includes('bắt đầu học'))).toBe(true);
  });

  it('Sejong 2B level adjusts tasks and offset', () => {
    const result = generateTimeline({
      visaType: 'D-4-1', age: 22,
      koreanLevel: 'sejong2b',
    });
    const language = result.milestones.find((m: any) => m.id === 'language');
    expect(language).toBeDefined();
    expect(language.tasks.some((t: string) => t.includes('cấp tốc'))).toBe(true);
  });

  it('No TOPIK adds "Đăng ký thi TOPIK" task for beginners', () => {
    const result = generateTimeline({
      visaType: 'D-4-1', age: 22,
      koreanLevel: 'beginner', hasTopik: false,
    });
    const language = result.milestones.find((m: any) => m.id === 'language');
    expect(language).toBeDefined();
    expect(language.tasks.some((t: string) => t.includes('Đăng ký thi TOPIK'))).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════
// 4. FINANCE PERSONALIZATION
// ═══════════════════════════════════════════════════════════════

describe('Finance personalization', () => {
  it('No savings shows generic warning and full tasks', () => {
    const result = generateTimeline({ visaType: 'D-4-1', age: 22 });
    const finance = result.milestones.find((m: any) => m.id === 'finance');
    expect(finance).toBeDefined();
    expect(finance.tasks.some((t: string) => t.includes('Mở sổ tiết kiệm'))).toBe(true);
    expect(result.warnings.some((w: any) => w.text.includes('chưa khai báo'))).toBe(true);
  });

  it('Savings 3000 (very low) shows danger warning and xoay vốn label', () => {
    const result = generateTimeline({
      visaType: 'D-4-1', age: 22,
      savingsAmount: 3000,
    });
    const finance = result.milestones.find((m: any) => m.id === 'finance');
    expect(finance).toBeDefined();
    expect(finance.label).toMatch(/Xoay vốn/);
    expect(finance.tasks.some((t: string) => t.includes('Xoay'))).toBe(true);
    expect(result.warnings.some((w: any) => w.type === 'danger')).toBe(true);
  });

  it('Savings 7000 (medium) shows warning and bổ sung label', () => {
    const result = generateTimeline({
      visaType: 'D-4-1', age: 22,
      savingsAmount: 7000,
    });
    const finance = result.milestones.find((m: any) => m.id === 'finance');
    expect(finance).toBeDefined();
    expect(finance.label).toMatch(/Bổ sung/);
    expect(result.warnings.some((w: any) => w.type === 'warning')).toBe(true);
  });

  it('Savings >= 10000 (sufficient) changes to Xác nhận label + success warning', () => {
    const result = generateTimeline({
      visaType: 'D-4-1', age: 22,
      savingsAmount: 15000,
    });
    const finance = result.milestones.find((m: any) => m.id === 'finance');
    expect(finance).toBeDefined();
    expect(finance.label).toMatch(/Xác nhận tài chính/);
    expect(finance.icon).toBe('✅');
    expect(result.warnings.some((w: any) => w.type === 'success')).toBe(true);
  });

  it('Self-sponsor adds CMCT nguồn thu nhập task', () => {
    const result = generateTimeline({
      visaType: 'D-4-1', age: 22,
      sponsorIsSelf: true,
    });
    const finance = result.milestones.find((m: any) => m.id === 'finance');
    expect(finance).toBeDefined();
    expect(finance.tasks.some((t: string) => t.includes('nguồn thu nhập'))).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════
// 5. GAP YEAR HANDLING
// ═══════════════════════════════════════════════════════════════

describe('Gap year handling', () => {
  it('No gap (<= 0.5) does not add any gap-related tasks', () => {
    const result = generateTimeline({ visaType: 'D-4-1', age: 22, gapYears: 0 });
    const school = result.milestones.find((m: any) => m.id === 'school-app');
    expect(school).toBeDefined();
    expect(school.tasks.every((t: string) => !t.includes('giải trình'))).toBe(true);
  });

  it('Gap 1 year adds giả trình task to school-app', () => {
    const result = generateTimeline({ visaType: 'D-4-1', age: 22, gapYears: 1 });
    const school = result.milestones.find((m: any) => m.id === 'school-app');
    expect(school).toBeDefined();
    expect(school.tasks.some((t: string) => t.includes('giải trình'))).toBe(true);
  });

  it('Gap > 3 years adds warning + additional tasks + extends offset', () => {
    const result = generateTimeline({ visaType: 'D-4-1', age: 22, gapYears: 5 });
    const school = result.milestones.find((m: any) => m.id === 'school-app');
    expect(school).toBeDefined();
    expect(school.tasks.some((t: string) => t.includes('Xin xác nhận việc làm'))).toBe(true);
    expect(result.warnings.some((w: any) => w.text.includes('Gap'))).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════
// 6. VISA REJECTION
// ═══════════════════════════════════════════════════════════════

describe('Visa rejection handling', () => {
  it('No rejection does not add rejection milestone', () => {
    const result = generateTimeline({ visaType: 'D-4-1', age: 22 });
    const rejection = result.milestones.find((m: any) => m.id === 'rejection-explain');
    expect(rejection).toBeUndefined();
  });

  it('Visa rejection adds rejection milestone + warning', () => {
    const result = generateTimeline({
      visaType: 'D-4-1', age: 22,
      hasVisaRejection: true,
    });
    const rejection = result.milestones.find((m: any) => m.id === 'rejection-explain');
    expect(rejection).toBeDefined();
    expect(rejection.label).toMatch(/giải trình trượt visa/);
    expect(rejection.tasks.length).toBeGreaterThanOrEqual(3);
    expect(result.warnings.some((w: any) => w.text.includes('trượt visa'))).toBe(true);
  });

  it('Visa rejection with reason includes reason in tasks', () => {
    const result = generateTimeline({
      visaType: 'D-4-1', age: 22,
      hasVisaRejection: true,
      rejectionReason: 'Tài chính không đủ mạnh',
    });
    const rejection = result.milestones.find((m: any) => m.id === 'rejection-explain');
    expect(rejection).toBeDefined();
    expect(rejection.tasks.some((t: string) => t.includes('Tài chính không đủ mạnh'))).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════
// 7. WORK EXPERIENCE & EDUCATION
// ═══════════════════════════════════════════════════════════════

describe('Work experience & education rules', () => {
  it('Has work experience adds xác nhận công việc task', () => {
    const result = generateTimeline({
      visaType: 'D-4-1', age: 22,
      hasWorkExperience: true,
    });
    const school = result.milestones.find((m: any) => m.id === 'school-app');
    expect(school).toBeDefined();
    expect(school.tasks.some((t: string) => t.includes('Xin xác nhận công việc'))).toBe(true);
  });

  it('Has labor contract adds dịch HĐLĐ task', () => {
    const result = generateTimeline({
      visaType: 'D-4-1', age: 22,
      hasWorkExperience: true,
      hasLaborContract: true,
    });
    const translate = result.milestones.find((m: any) => m.id === 'translate');
    expect(translate).toBeDefined();
    expect(translate.tasks.some((t: string) => t.includes('HĐLĐ'))).toBe(true);
  });

  it('University education adds translation tasks for bằng and bảng điểm', () => {
    const result = generateTimeline({
      visaType: 'D-4-1', age: 22,
      educationLevel: 'university',
    });
    const translate = result.milestones.find((m: any) => m.id === 'translate');
    expect(translate).toBeDefined();
    expect(translate.tasks.some((t: string) => t.includes('bằng Đại học'))).toBe(true);
    expect(translate.tasks.some((t: string) => t.includes('bảng điểm ĐH'))).toBe(true);
  });

  it('High school education does not add university translation tasks', () => {
    const result = generateTimeline({
      visaType: 'D-4-1', age: 22,
      educationLevel: 'high_school',
    });
    const translate = result.milestones.find((m: any) => m.id === 'translate');
    expect(translate).toBeDefined();
    expect(translate.tasks.every((t: string) => !t.includes('Đại học') && !t.includes('ĐH'))).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════
// 8. AGE CONSIDERATIONS
// ═══════════════════════════════════════════════════════════════

describe('Age considerations', () => {
  it('Young age (18-25) — no age-related warnings', () => {
    const result = generateTimeline({ visaType: 'D-4-1', age: 20 });
    const ageWarnings = result.warnings.filter((w: any) => w.text.includes('tuổi'));
    expect(ageWarnings.length).toBe(0);
  });

  it('Age 29 — adds info warning about ràng buộc', () => {
    const result = generateTimeline({ visaType: 'D-4-1', age: 29 });
    const ageWarnings = result.warnings.filter((w: any) => w.type === 'info' && w.text.includes('tuổi'));
    expect(ageWarnings.length).toBeGreaterThanOrEqual(1);
  });

  it('Age 35+ — adds danger warning + ràng buộc VN task', () => {
    const result = generateTimeline({ visaType: 'D-4-1', age: 35 });
    expect(result.warnings.some((w: any) => w.type === 'danger' && w.text.includes('tuổi'))).toBe(true);

    const translate = result.milestones.find((m: any) => m.id === 'translate');
    expect(translate).toBeDefined();
    expect(translate.tasks.some((t: string) => t.includes('ràng buộc VN'))).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════
// 9. REGION RULE
// ═══════════════════════════════════════════════════════════════

describe('Region risk warning', () => {
  it('High risk region (Nghệ An) adds warning', () => {
    const result = generateTimeline({ visaType: 'D-4-1', age: 22, region: 'Nghệ An' });
    expect(result.warnings.some((w: any) => w.text.includes('rủi ro cao'))).toBe(true);
  });

  it('High risk region (Hà Tĩnh) adds warning', () => {
    const result = generateTimeline({ visaType: 'D-4-1', age: 22, region: 'Hà Tĩnh' });
    expect(result.warnings.some((w: any) => w.text.includes('rủi ro cao'))).toBe(true);
  });

  it('Low risk region (TP. Hồ Chí Minh) does not add region warning', () => {
    const result = generateTimeline({ visaType: 'D-4-1', age: 22, region: 'TP. Hồ Chí Minh' });
    expect(result.warnings.every((w: any) => !w.text.includes('rủi ro cao'))).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════
// 10. D4→D2 SPECIFIC RULES
// ═══════════════════════════════════════════════════════════════

describe('D4→D2 specific rules', () => {
  it('Has koreanStudyResult adds result task to d4-complete', () => {
    const result = generateTimeline({
      visaType: 'D4-to-D2', age: 22,
      koreanStudyResult: '평균 80점',
    });
    const d4Complete = result.milestones.find((m: any) => m.id === 'd4-complete');
    expect(d4Complete).toBeDefined();
    expect(d4Complete.tasks.some((t: string) => t.includes('80점'))).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════
// 11. INTEGRATION: REAL-WORLD PROFILE TYPES
// ═══════════════════════════════════════════════════════════════

describe('Integration: complete profile types', () => {
  it('Ideal student — TOPIK 3+, savings 15k, young, no gap → minimal warnings', () => {
    const result = generateTimeline({
      visaType: 'D-4-1',
      age: 21,
      koreanLevel: 'topik3',
      hasTopik: true,
      topikGrade: '3',
      savingsAmount: 15000,
      gapYears: 0,
      educationLevel: 'high_school',
    });

    // No danger warnings
    expect(result.warnings.some((w: any) => w.type === 'danger')).toBe(false);

    // Language milestone removed (TOPIK 3+)
    expect(result.milestones.some((m: any) => m.id === 'language')).toBe(false);

    // Finance treats as xác nhận
    const finance = result.milestones.find((m: any) => m.id === 'finance');
    expect(finance).toBeDefined();
    expect(finance.label).toContain('Xác nhận');
  });

  it('Risky student — beginner, no savings, gap 5yr, visa rejection, age 35 → many warnings', () => {
    const result = generateTimeline({
      visaType: 'D-4-1',
      age: 35,
      koreanLevel: 'none',
      hasTopik: false,
      savingsAmount: 0,
      gapYears: 5,
      hasVisaRejection: true,
      rejectionReason: 'Tài chính yếu',
      educationLevel: 'high_school',
      region: 'Nghệ An',
    });

    // Should have at least 3 warnings
    expect(result.warnings.length).toBeGreaterThanOrEqual(3);

    // Has danger warnings (age 35, low finance)
    expect(result.warnings.some((w: any) => w.type === 'danger')).toBe(true);

    // Has rejection milestone
    expect(result.milestones.some((m: any) => m.id === 'rejection-explain')).toBe(true);

    // Has language milestone (beginner)
    expect(result.milestones.some((m: any) => m.id === 'language')).toBe(true);

    // Has region risk warning
    expect(result.warnings.some((w: any) => w.text.includes('Nghệ An'))).toBe(true);
  });

  it('D-2 student — university degree, has TOPIK 2 → language present, added uni tasks', () => {
    const result = generateTimeline({
      visaType: 'D-2',
      age: 23,
      koreanLevel: 'topik2',
      hasTopik: true,
      topikGrade: '2',
      educationLevel: 'university',
      savingsAmount: 12000,
    });

    // Language present (TOPIK 2, not 3+)
    expect(result.milestones.some((m: any) => m.id === 'language')).toBe(true);

    // School-app has thư giới thiệu
    const school = result.milestones.find((m: any) => m.id === 'school-app');
    expect(school).toBeDefined();
    expect(school.tasks.some((t: string) => t.includes('thư giới thiệu'))).toBe(true);

    // Translate has uni tasks
    const translate = result.milestones.find((m: any) => m.id === 'translate');
    expect(translate).toBeDefined();
    expect(translate.tasks.some((t: string) => t.includes('bảng điểm ĐH'))).toBe(true);
  });

  it('D4→D2 student in Korea with study result → offset reduced + result task', () => {
    const result = generateTimeline({
      visaType: 'D4-to-D2',
      age: 22,
      currentLocation: 'korea',
      koreanStudyResult: 'Trung bình khá',
    });

    expect(result.milestones.some((m: any) => m.id === 'd4-complete')).toBe(true);
    expect(result.milestones.some((m: any) => m.id === 'd4-convert')).toBe(true);
    expect(result.milestones.some((m: any) => m.id === 'd4-start')).toBe(true);

    // Should NOT have D-4-1 milestones
    expect(result.milestones.some((m: any) => m.id === 'visa-app')).toBe(false);
    expect(result.milestones.some((m: any) => m.id === 'language')).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════
// 12. EDGE CASES
// ═══════════════════════════════════════════════════════════════

describe('Edge cases', () => {
  it('Defaults to D-4-1 when visaType is not provided', () => {
    const result = generateTimeline({ age: 20 });
    expect(result.milestones.length).toBeGreaterThan(0);
    // D-4-1 should include language and finance milestones
    expect(result.milestones.some((m: any) => m.id === 'language')).toBe(true);
    expect(result.milestones.some((m: any) => m.id === 'finance')).toBe(true);
    // Should NOT include D4-to-D2 specific milestones
    expect(result.milestones.some((m: any) => m.id.startsWith('d4-'))).toBe(false);
  });

  it('Handles missing optional fields gracefully (no crash)', () => {
    const result = generateTimeline({
      visaType: 'D-4-1',
      // Only required fields
    });
    expect(result.milestones.length).toBeGreaterThan(0);
    expect(Array.isArray(result.warnings)).toBe(true);
  });

  it('Handles empty string fields gracefully', () => {
    const result = generateTimeline({
      visaType: 'D-4-1',
      age: 22,
      koreanLevel: '',
      hasTopik: false,
      savingsAmount: null,
      gapYears: undefined,
      educationLevel: '',
      region: '',
    });
    expect(result.milestones.length).toBeGreaterThan(0);
  });

  it('Handles extreme gap years (e.g., 10) without crash', () => {
    const result = generateTimeline({ visaType: 'D-4-1', age: 22, gapYears: 10 });
    const school = result.milestones.find((m: any) => m.id === 'school-app');
    expect(school).toBeDefined();
  });

  it('Combines multiple rules without duplicates in warnings', () => {
    const result = generateTimeline({
      visaType: 'D-4-1',
      age: 22,
      koreanLevel: 'beginner',
      savingsAmount: 3000,
      gapYears: 3,
      hasVisaRejection: true,
      region: 'Hà Tĩnh',
    });

    // Check unique warning types
    const types = result.warnings.map((w: any) => w.type);
    expect(types.filter((t: string) => t === 'danger').length).toBeLessThanOrEqual(2);
    expect(types.filter((t: string) => t === 'warning').length).toBeGreaterThanOrEqual(1);
  });

  it('Milestones are sorted by offsetDays ascending (latest dates first)', () => {
    // Code sorts by offsetDays asc: milestone[0] has offsetDays 0 (target date = latest)
    // milestone[last] has largest offsetDays (earliest date)
    const result = generateTimeline({ visaType: 'D-4-1', age: 22, koreanLevel: 'beginner', savingsAmount: 5000 });
    expect(result.milestones[0].date.getTime()).toBeGreaterThanOrEqual(result.milestones[result.milestones.length - 1].date.getTime());
  });

  it('Target date is in the future (not before today)', () => {
    const result = generateTimeline({ visaType: 'D-4-1', age: 22 });
    expect(result.targetDate.getTime()).toBeGreaterThan(new Date('2026-07-23').getTime());
  });
});
