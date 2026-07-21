import { describe, it, expect, vi, beforeAll } from 'vitest';

let evaluateChecklistRule: Function;
let generatePersonalizedChecklist: Function;
let calculateChecklistProgress: Function;

beforeAll(async () => {
  // Tạo mock window — checklist-data.js gán các hàm vào window.*
  const mockWindow: Record<string, any> = {};
  vi.stubGlobal('window', mockWindow);

  // Import file — side effect sẽ populate window.evaluateChecklistRule, v.v.
  await import('../js/checklist-data');

  evaluateChecklistRule = mockWindow.evaluateChecklistRule;
  generatePersonalizedChecklist = mockWindow.generatePersonalizedChecklist;
  calculateChecklistProgress = mockWindow.calculateChecklistProgress;

  expect(evaluateChecklistRule).toBeDefined();
  expect(generatePersonalizedChecklist).toBeDefined();
});

// ═══════════════════════════════════════════════════════
// evaluateChecklistRule
// ═══════════════════════════════════════════════════════

describe('evaluateChecklistRule', () => {
  describe('null / undefined rule', () => {
    it('returns true when rule is null', () => {
      expect(evaluateChecklistRule(null, {})).toBe(true);
    });
    it('returns true when rule is undefined', () => {
      expect(evaluateChecklistRule(undefined, {})).toBe(true);
    });
  });

  describe('eq operator', () => {
    it('returns true when value matches boolean expected', () => {
      expect(evaluateChecklistRule({ has_topik: { eq: true } }, { hasTopik: true })).toBe(true);
    });
    it('returns false when value does not match boolean expected', () => {
      expect(evaluateChecklistRule({ has_topik: { eq: true } }, { hasTopik: false })).toBe(false);
    });
    it('returns true when value matches string expected', () => {
      expect(
        evaluateChecklistRule({ education_level: { eq: 'university' } }, { educationLevel: 'university' })
      ).toBe(true);
    });
    it('returns false when string does not match', () => {
      expect(
        evaluateChecklistRule({ education_level: { eq: 'university' } }, { educationLevel: 'high_school' })
      ).toBe(false);
    });
    it('returns true when value matches numeric expected', () => {
      expect(evaluateChecklistRule({ gap_years: { eq: 1 } }, { gapYears: 1 })).toBe(true);
    });
    it('returns false when numeric value does not match', () => {
      expect(evaluateChecklistRule({ gap_years: { eq: 1 } }, { gapYears: 2 })).toBe(false);
    });
  });

  describe('neq operator', () => {
    it('returns true when value is different from expected', () => {
      expect(evaluateChecklistRule({ has_topik: { neq: true } }, { hasTopik: false })).toBe(true);
    });
    it('returns false when value equals the expected', () => {
      expect(evaluateChecklistRule({ has_topik: { neq: true } }, { hasTopik: true })).toBe(false);
    });
    it('returns true for string neq', () => {
      expect(
        evaluateChecklistRule({ korean_level: { neq: 'none' } }, { koreanLevel: 'topik2' })
      ).toBe(true);
    });
    it('returns false for string neq when equal', () => {
      expect(
        evaluateChecklistRule({ korean_level: { neq: 'none' } }, { koreanLevel: 'none' })
      ).toBe(false);
    });
  });

  describe('gt operator', () => {
    it('returns true when value is greater than expected', () => {
      expect(evaluateChecklistRule({ gap_years: { gt: 0.5 } }, { gapYears: 1 })).toBe(true);
    });
    it('returns false when value is equal to expected', () => {
      expect(evaluateChecklistRule({ gap_years: { gt: 0.5 } }, { gapYears: 0.5 })).toBe(false);
    });
    it('returns false when value is less than expected', () => {
      expect(evaluateChecklistRule({ gap_years: { gt: 0.5 } }, { gapYears: 0.2 })).toBe(false);
    });
    it('returns false when value is undefined', () => {
      expect(evaluateChecklistRule({ gap_years: { gt: 0.5 } }, {})).toBe(false);
    });
    it('returns false when value is null', () => {
      expect(evaluateChecklistRule({ gap_years: { gt: 0.5 } }, { gapYears: null })).toBe(false);
    });
    // Number conversion edge cases
    it('works with string number value', () => {
      expect(evaluateChecklistRule({ gap_years: { gt: 0.5 } }, { gapYears: '1' })).toBe(true);
    });
    it('returns true for non-numeric string value (NaN comparison falls through)', () => {
      expect(evaluateChecklistRule({ gap_years: { gt: 0.5 } }, { gapYears: 'abc' })).toBe(true);
    });
  });

  describe('gte operator', () => {
    it('returns true when value is greater', () => {
      expect(evaluateChecklistRule({ gap_years: { gte: 0.5 } }, { gapYears: 1 })).toBe(true);
    });
    it('returns true when value is equal', () => {
      expect(evaluateChecklistRule({ gap_years: { gte: 0.5 } }, { gapYears: 0.5 })).toBe(true);
    });
    it('returns false when value is less', () => {
      expect(evaluateChecklistRule({ gap_years: { gte: 0.5 } }, { gapYears: 0.2 })).toBe(false);
    });
    it('returns false when value is undefined', () => {
      expect(evaluateChecklistRule({ gap_years: { gte: 0.5 } }, {})).toBe(false);
    });
  });

  describe('lt operator', () => {
    it('returns true when value is less than expected', () => {
      expect(evaluateChecklistRule({ korean_grade: { lt: 70 } }, { koreanGrade: 60 })).toBe(true);
    });
    it('returns false when value is equal', () => {
      expect(evaluateChecklistRule({ korean_grade: { lt: 70 } }, { koreanGrade: 70 })).toBe(false);
    });
    it('returns false when value is greater', () => {
      expect(evaluateChecklistRule({ korean_grade: { lt: 70 } }, { koreanGrade: 80 })).toBe(false);
    });
    it('returns false when value is undefined', () => {
      expect(evaluateChecklistRule({ korean_grade: { lt: 70 } }, {})).toBe(false);
    });
  });

  describe('lte operator', () => {
    it('returns true when value is less', () => {
      expect(evaluateChecklistRule({ attendance_rate: { lte: 80 } }, { attendanceRate: 70 })).toBe(true);
    });
    it('returns true when value is equal', () => {
      expect(evaluateChecklistRule({ attendance_rate: { lte: 80 } }, { attendanceRate: 80 })).toBe(true);
    });
    it('returns false when value is greater', () => {
      expect(evaluateChecklistRule({ attendance_rate: { lte: 80 } }, { attendanceRate: 90 })).toBe(false);
    });
    it('returns false when value is undefined', () => {
      expect(evaluateChecklistRule({ attendance_rate: { lte: 80 } }, {})).toBe(false);
    });
  });

  describe('in operator', () => {
    it('returns true when value is in the array', () => {
      expect(
        evaluateChecklistRule({ education_level: { in: ['high_school', 'university'] } }, { educationLevel: 'university' })
      ).toBe(true);
    });
    it('returns false when value is not in the array', () => {
      expect(
        evaluateChecklistRule({ education_level: { in: ['high_school', 'university'] } }, { educationLevel: 'master' })
      ).toBe(false);
    });
    it('returns false when expected is not an array', () => {
      expect(
        evaluateChecklistRule({ education_level: { in: 'university' } }, { educationLevel: 'university' })
      ).toBe(false);
    });
  });

  describe('not_in operator', () => {
    it('returns true when value is NOT in the array', () => {
      expect(
        evaluateChecklistRule({ education_level: { not_in: ['high_school', 'master'] } }, { educationLevel: 'university' })
      ).toBe(true);
    });
    it('returns false when value IS in the array', () => {
      expect(
        evaluateChecklistRule({ education_level: { not_in: ['high_school', 'university'] } }, { educationLevel: 'university' })
      ).toBe(false);
    });
    it('returns true when expected is not an array', () => {
      expect(
        evaluateChecklistRule({ education_level: { not_in: 'university' } }, { educationLevel: 'university' })
      ).toBe(true);
    });
  });

  describe('fieldMap translation (snake_case → camelCase)', () => {
    it('maps gap_years to gapYears', () => {
      expect(evaluateChecklistRule({ gap_years: { gt: 0.5 } }, { gapYears: 1 })).toBe(true);
    });
    it('maps education_level to educationLevel', () => {
      expect(evaluateChecklistRule({ education_level: { eq: 'university' } }, { educationLevel: 'university' })).toBe(true);
    });
    it('maps sponsor_is_self to sponsorIsSelf', () => {
      expect(evaluateChecklistRule({ sponsor_is_self: { eq: true } }, { sponsorIsSelf: true })).toBe(true);
      expect(evaluateChecklistRule({ sponsor_is_self: { eq: false } }, { sponsorIsSelf: false })).toBe(true);
    });
    it('maps has_visa_rejection to hasVisaRejection', () => {
      expect(evaluateChecklistRule({ has_visa_rejection: { eq: true } }, { hasVisaRejection: true })).toBe(true);
    });
    it('maps has_work_experience to hasWorkExperience', () => {
      expect(evaluateChecklistRule({ has_work_experience: { eq: true } }, { hasWorkExperience: true })).toBe(true);
    });
    it('maps has_topik to hasTopik', () => {
      expect(evaluateChecklistRule({ has_topik: { eq: true } }, { hasTopik: true })).toBe(true);
    });
    it('maps korean_level to koreanLevel', () => {
      expect(evaluateChecklistRule({ korean_level: { neq: 'none' } }, { koreanLevel: 'topik2' })).toBe(true);
    });
    it('maps has_labor_contract to hasLaborContract', () => {
      expect(evaluateChecklistRule({ has_labor_contract: { eq: true } }, { hasLaborContract: true })).toBe(true);
    });
    it('maps has_illegal_relative to hasIllegalRelative', () => {
      expect(evaluateChecklistRule({ has_illegal_relative: { eq: true } }, { hasIllegalRelative: true })).toBe(true);
    });
    it('maps savings_amount to savingsAmount', () => {
      expect(evaluateChecklistRule({ savings_amount: { gte: 10000 } }, { savingsAmount: 15000 })).toBe(true);
    });
    it('maps gpa to gpa', () => {
      expect(evaluateChecklistRule({ gpa: { gte: 6.0 } }, { gpa: 7.0 })).toBe(true);
    });
    it('maps new field: current_location to currentLocation', () => {
      expect(evaluateChecklistRule({ current_location: { eq: 'korea' } }, { currentLocation: 'korea' })).toBe(true);
      expect(evaluateChecklistRule({ current_location: { eq: 'korea' } }, { currentLocation: 'vietnam' })).toBe(false);
    });
    it('maps new field: korean_grade to koreanGrade', () => {
      expect(evaluateChecklistRule({ korean_grade: { lt: 70 } }, { koreanGrade: 65 })).toBe(true);
      expect(evaluateChecklistRule({ korean_grade: { lt: 70 } }, { koreanGrade: 75 })).toBe(false);
    });
    it('maps new field: attendance_rate to attendanceRate', () => {
      expect(evaluateChecklistRule({ attendance_rate: { lt: 80 } }, { attendanceRate: 75 })).toBe(true);
      expect(evaluateChecklistRule({ attendance_rate: { lt: 80 } }, { attendanceRate: 85 })).toBe(false);
    });
  });

  describe('composite rules (AND logic)', () => {
    it('returns true when all conditions are met', () => {
      expect(
        evaluateChecklistRule(
          { has_work_experience: { eq: true }, gap_years: { gt: 0 } },
          { hasWorkExperience: true, gapYears: 1 }
        )
      ).toBe(true);
    });
    it('returns false when any condition fails', () => {
      // work experience = true but gap = 0 → gap condition fails
      expect(
        evaluateChecklistRule(
          { has_work_experience: { eq: true }, gap_years: { gt: 0 } },
          { hasWorkExperience: true, gapYears: 0 }
        )
      ).toBe(false);
    });
    it('returns false when the first condition fails', () => {
      expect(
        evaluateChecklistRule(
          { has_topik: { neq: true }, korean_level: { neq: 'none' } },
          { hasTopik: true, koreanLevel: 'topik2' }
        )
      ).toBe(false); // hasTopik === true, so neq: true fails
    });
    it('handles 3+ conditions', () => {
      expect(
        evaluateChecklistRule(
          {
            has_visa_rejection: { eq: false },
            has_topik: { eq: true },
            korean_level: { neq: 'none' },
          },
          { hasVisaRejection: false, hasTopik: true, koreanLevel: 'topik3' }
        )
      ).toBe(true);
    });
  });

  describe('default operator (unrecognized)', () => {
    it('returns true for unrecognized operator', () => {
      expect(evaluateChecklistRule({ gap_years: { unknown_op: 1 } }, { gapYears: 0 })).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles empty rule object {}', () => {
      expect(evaluateChecklistRule({}, { anything: 'value' })).toBe(true);
    });
    it('handles empty profile {}', () => {
      expect(evaluateChecklistRule({ has_topik: { eq: true } }, {})).toBe(false);
    });
    it('handles missing profile field (undefined)', () => {
      expect(evaluateChecklistRule({ has_topik: { eq: true } }, { someOtherField: 'yes' })).toBe(false);
    });
    it('handles number-as-string comparison with eq', () => {
      // 'eq' is strict comparison, so string !== number
      expect(evaluateChecklistRule({ gap_years: { eq: '1' } }, { gapYears: 1 })).toBe(false);
    });
    it('direct camelCase field name lookup works without fieldMap', () => {
      // If the rule uses camelCase directly, it should still work via fallback
      expect(evaluateChecklistRule({ hasTopik: { eq: true } }, { hasTopik: true })).toBe(true);
    });
  });
});

// ═══════════════════════════════════════════════════════
// generatePersonalizedChecklist
// ═══════════════════════════════════════════════════════

describe('generatePersonalizedChecklist', () => {
  it('returns null for unknown visa type', () => {
    expect(generatePersonalizedChecklist('INVALID', {})).toBeNull();
  });

  it('generates a valid checklist for D-4-1 with empty profile', () => {
    const result = generatePersonalizedChecklist('D-4-1', {});
    expect(result).not.toBeNull();
    expect(result.visaType).toBe('D-4-1');
    expect(result.name).toContain('D-4-1');
    expect(Array.isArray(result.modules)).toBe(true);
    expect(result.totalItems).toBeGreaterThan(0);
    expect(result.requiredItems).toBeGreaterThan(0);
    expect(result.generatedAt).toBeDefined();
  });

  it('generates a valid checklist for D-2 with empty profile', () => {
    const result = generatePersonalizedChecklist('D-2', {});
    expect(result).not.toBeNull();
    expect(result.visaType).toBe('D-2');
    expect(result.totalItems).toBeGreaterThan(0);
  });

  it('generates a valid checklist for D4-to-D2 with empty profile', () => {
    const result = generatePersonalizedChecklist('D4-to-D2', {});
    expect(result).not.toBeNull();
    expect(result.visaType).toBe('D4-to-D2');
    expect(result.totalItems).toBeGreaterThan(0);
  });

  describe('filtering by rules', () => {
    it('includes gap explanation item when gap_years > 0.5', () => {
      const result = generatePersonalizedChecklist('D-4-1', { gapYears: 1 });
      const allItems = result.modules.flatMap((m: any) => m.items);
      const gapItem = allItems.find((i: any) => i.id === 'A2-3');
      expect(gapItem).toBeDefined();
    });

    it('excludes gap explanation item when no gap', () => {
      const result = generatePersonalizedChecklist('D-4-1', { gapYears: 0 });
      const allItems = result.modules.flatMap((m: any) => m.items);
      const gapItem = allItems.find((i: any) => i.id === 'A2-3');
      expect(gapItem).toBeUndefined();
    });

    it('includes university items when education_level is university', () => {
      const result = generatePersonalizedChecklist('D-4-1', { educationLevel: 'university' });
      const allItems = result.modules.flatMap((m: any) => m.items);
      const uniDiploma = allItems.find((i: any) => i.id === 'A2-4');
      expect(uniDiploma).toBeDefined();
    });

    it('excludes university items when education_level is not university', () => {
      const result = generatePersonalizedChecklist('D-4-1', { educationLevel: 'high_school' });
      const allItems = result.modules.flatMap((m: any) => m.items);
      const uniDiploma = allItems.find((i: any) => i.id === 'A2-4');
      expect(uniDiploma).toBeUndefined();
    });

    it('includes sponsor items when sponsor_is_self is false', () => {
      const result = generatePersonalizedChecklist('D-4-1', { sponsorIsSelf: false });
      const allItems = result.modules.flatMap((m: any) => m.items);
      const sponsorItem = allItems.find((i: any) => i.id === 'A4-3');
      expect(sponsorItem).toBeDefined();
    });

    it('includes self-income item when sponsor_is_self is true', () => {
      const result = generatePersonalizedChecklist('D-4-1', { sponsorIsSelf: true });
      const allItems = result.modules.flatMap((m: any) => m.items);
      const selfIncome = allItems.find((i: any) => i.id === 'A4-6');
      expect(selfIncome).toBeDefined();
    });

    it('includes visa rejection items when has_visa_rejection is true', () => {
      const result = generatePersonalizedChecklist('D-4-1', { hasVisaRejection: true });
      const allItems = result.modules.flatMap((m: any) => m.items);
      const rejectionItem = allItems.find((i: any) => i.id === 'RISK-1');
      expect(rejectionItem).toBeDefined();
    });

    it('includes TOPIK certificate item when has_topik is true', () => {
      const result = generatePersonalizedChecklist('D-4-1', { hasTopik: true });
      const allItems = result.modules.flatMap((m: any) => m.items);
      const topikItem = allItems.find((i: any) => i.id === 'RISK-4');
      expect(topikItem).toBeDefined();
    });

    it('includes illegal relative item when has_illegal_relative is true', () => {
      const result = generatePersonalizedChecklist('D-4-1', { hasIllegalRelative: true });
      const allItems = result.modules.flatMap((m: any) => m.items);
      const illegalItem = allItems.find((i: any) => i.id === 'RISK-7');
      expect(illegalItem).toBeDefined();
    });

    it('includes only null-rule items in RISK module when no conditional risk matches', () => {
      // Use koreanLevel: 'none' to prevent RISK-6 and RISK-9 from matching
      const result = generatePersonalizedChecklist('D-4-1', { koreanLevel: 'none' });
      const riskModule = result.modules.find((m: any) => m.id === 'RISK');
      expect(riskModule).toBeDefined();
      // Only items with rule: null (always show) should appear
      const conditionalItems = riskModule.items.filter((i: any) =>
        ['RISK-1','RISK-2','RISK-3','RISK-4','RISK-6','RISK-7','RISK-9'].includes(i.id)
      );
      expect(conditionalItems.length).toBe(0);
    });

    it('adds conditional risk items when their rules match', () => {
      const result = generatePersonalizedChecklist('D-4-1', { hasVisaRejection: true });
      const riskModule = result.modules.find((m: any) => m.id === 'RISK');
      expect(riskModule).toBeDefined();
      // RISK-1 and RISK-2 should now appear
      const risk1 = riskModule.items.find((i: any) => i.id === 'RISK-1');
      expect(risk1).toBeDefined();
      const risk2 = riskModule.items.find((i: any) => i.id === 'RISK-2');
      expect(risk2).toBeDefined();
    });

    it('includes RISK module when at least one risk item matches', () => {
      const result = generatePersonalizedChecklist('D-4-1', { hasVisaRejection: true });
      const riskModule = result.modules.find((m: any) => m.id === 'RISK');
      expect(riskModule).toBeDefined();
      expect(riskModule.items.length).toBeGreaterThan(0);
    });

    it('includes D4→D2 specific item: sao kê tài khoản Hàn Quốc khi current_location === korea', () => {
      const result = generatePersonalizedChecklist('D4-to-D2', { currentLocation: 'korea' });
      const allItems = result.modules.flatMap((m: any) => m.items);
      const koreaBankItem = allItems.find((i: any) => i.id === 'C4-7');
      expect(koreaBankItem).toBeDefined();
    });

    it('excludes D4→D2 sao kê tài khoản Hàn khi current_location là vietnam', () => {
      const result = generatePersonalizedChecklist('D4-to-D2', { currentLocation: 'vietnam' });
      const allItems = result.modules.flatMap((m: any) => m.items);
      const koreaBankItem = allItems.find((i: any) => i.id === 'C4-7');
      expect(koreaBankItem).toBeUndefined();
    });

    it('handles the RISK-D4D2 module: shows low korean_grade warning', () => {
      const result = generatePersonalizedChecklist('D4-to-D2', { koreanGrade: 65 });
      const riskModule = result.modules.find((m: any) => m.id === 'RISK-D4D2');
      expect(riskModule).toBeDefined();
      const riskItem = riskModule.items.find((i: any) => i.id === 'RISK-D4D2-1');
      expect(riskItem).toBeDefined();
    });

    it('excludes conditional D4→D2 risk items when conditions are not met, but keeps null-rule items', () => {
      const result = generatePersonalizedChecklist('D4-to-D2', { koreanGrade: 85, attendanceRate: 95 });
      const riskModule = result.modules.find((m: any) => m.id === 'RISK-D4D2');
      expect(riskModule).toBeDefined();
      // Conditional items should be hidden
      const risk1 = riskModule.items.find((i: any) => i.id === 'RISK-D4D2-1');
      expect(risk1).toBeUndefined();
      const risk2 = riskModule.items.find((i: any) => i.id === 'RISK-D4D2-2');
      expect(risk2).toBeUndefined();
      // Null-rule items should still show
      const risk5 = riskModule.items.find((i: any) => i.id === 'RISK-D4D2-5');
      expect(risk5).toBeDefined();
    });

    it('handles composite rule: RISK-3 (has_work_experience AND gap_years>0)', () => {
      const result = generatePersonalizedChecklist('D-4-1', {
        hasWorkExperience: true,
        gapYears: 2,
      });
      const allItems = result.modules.flatMap((m: any) => m.items);
      const risk3 = allItems.find((i: any) => i.id === 'RISK-3');
      expect(risk3).toBeDefined();
    });

    it('excludes composite RISK-3 when only one condition matches', () => {
      const result = generatePersonalizedChecklist('D-4-1', {
        hasWorkExperience: true,
        gapYears: 0,
      });
      const allItems = result.modules.flatMap((m: any) => m.items);
      const risk3 = allItems.find((i: any) => i.id === 'RISK-3');
      expect(risk3).toBeUndefined();
    });
  });

  describe('item metadata', () => {
    it('marks required items correctly', () => {
      const result = generatePersonalizedChecklist('D-4-1', {});
      const allItems = result.modules.flatMap((m: any) => m.items);

      // A1-1 is always required
      const passportItem = allItems.find((i: any) => i.id === 'A1-1');
      expect(passportItem.required).toBe(true);

      // A4-7 is always optional/recommended
      const assetItem = allItems.find((i: any) => i.id === 'A4-7');
      expect(assetItem.required).toBe(false);
      expect(assetItem.recommended).toBe(true);
    });

    it('calculates correct counts', () => {
      const result = generatePersonalizedChecklist('D-4-1', {});
      const allItems = result.modules.flatMap((m: any) => m.items);

      expect(result.totalItems).toBe(allItems.length);
      expect(result.requiredItems).toBe(allItems.filter((i: any) => i.required).length);
      expect(result.recommendedItems).toBe(allItems.filter((i: any) => i.recommended && !i.required).length);
    });
  });
});

// ═══════════════════════════════════════════════════════
// calculateChecklistProgress
// ═══════════════════════════════════════════════════════

describe('calculateChecklistProgress', () => {
  it('returns 0 for null/undefined checklist', () => {
    expect(calculateChecklistProgress(null)).toBe(0);
    expect(calculateChecklistProgress(undefined)).toBe(0);
  });

  it('returns 0 for checklist with no items', () => {
    const checklist = { modules: [{ items: [] }] };
    expect(calculateChecklistProgress(checklist)).toBe(0);
  });

  it('calculates 0% when nothing is completed', () => {
    const result = generatePersonalizedChecklist('D-4-1', {});
    expect(calculateChecklistProgress(result)).toBe(0);
  });

  it('calculates 50% when half is completed', () => {
    const result = generatePersonalizedChecklist('D-4-1', {});
    // Mark first half as completed
    let count = 0;
    const half = Math.floor(result.totalItems / 2);
    for (const mod of result.modules) {
      for (const item of mod.items) {
        if (count < half) {
          item.status = 'completed';
          count++;
        }
      }
    }
    expect(calculateChecklistProgress(result)).toBe(Math.round((half / result.totalItems) * 100));
  });

  it('counts not_applicable as completed', () => {
    const result = generatePersonalizedChecklist('D-4-1', {});
    // Mark first as completed, second as not_applicable
    if (result.modules[0]?.items[0]) result.modules[0].items[0].status = 'completed';
    if (result.modules[0]?.items[1]) result.modules[0].items[1].status = 'not_applicable';
    const completed = 2;
    expect(calculateChecklistProgress(result)).toBe(Math.round((completed / result.totalItems) * 100));
  });
});
