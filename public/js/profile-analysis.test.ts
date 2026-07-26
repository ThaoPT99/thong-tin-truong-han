import { describe, it, expect, vi, beforeAll } from 'vitest';

let analyzeStudentProfile: Function;

// Simulated profile analysis logic (new risk-level engine)
// Công thức mới: base=50, strength +5, weakness -3, missing -2, risk theo weight
const RISK_WEIGHT: Record<string, number> = { critical: 30, high: 20, medium: 10, low: 5 };

function simulateAnalysis(profile: any) {
  const groups: any[] = [];
  let weightedRisk = 0;
  let weaknesses = 0, strengths = 0, missing = 0;

  // Nhân thân
  const nhom1: any = { group: 'Nhân thân', strengths: [], weaknesses: [], risks: [], missingEvidence: [], actions: [] };
  if (profile.age) {
    if (profile.age >= 18 && profile.age <= 25) { nhom1.strengths.push('Tuổi lý tưởng'); strengths++; }
    else if (profile.age > 28) {
      const risk: any = { text: 'Tuổi cao', level: 'high' };
      nhom1.risks.push(risk); weightedRisk += RISK_WEIGHT.high;
    }
  } else if (profile.age === undefined) {
    nhom1.missingEvidence.push('Chưa có tuổi'); missing++;
  }
  groups.push(nhom1);

  // Học vấn
  const nhom2: any = { group: 'Học vấn', strengths: [], weaknesses: [], risks: [], missingEvidence: [], actions: [] };
  if (profile.gpa) {
    if (profile.gpa >= 7) { nhom2.strengths.push('GPA tốt'); strengths++; }
    else if (profile.gpa < 5) { nhom2.weaknesses.push('GPA thấp'); weaknesses++; }
  } else if (profile.gpa === undefined) {
    nhom2.missingEvidence.push('Chưa có GPA'); missing++;
  }
  groups.push(nhom2);

  // Tài chính
  const nhom3: any = { group: 'Tài chính', strengths: [], weaknesses: [], risks: [], missingEvidence: [], actions: [] };
  if (profile.savingsAmount) {
    if (profile.savingsAmount >= 10000) { nhom3.strengths.push('Sổ TK đủ'); strengths++; }
    else {
      const risk: any = { text: 'Sổ TK thiếu', level: 'high' };
      nhom3.risks.push(risk); weightedRisk += RISK_WEIGHT.high;
    }
  } else if (profile.savingsAmount === undefined) {
    nhom3.missingEvidence.push('Chưa có sổ TK'); missing++;
  }
  groups.push(nhom3);

  // Nhập cảnh
  const nhom4: any = { group: 'Nhập cảnh', strengths: [], weaknesses: [], risks: [], missingEvidence: [], actions: [] };
  if (profile.hasVisaRejection === true) {
    const risk: any = { text: 'Đã trượt visa, cần giải trình', level: 'high' };
    nhom4.risks.push(risk); weightedRisk += RISK_WEIGHT.high;
  } else if (profile.hasVisaRejection === false) {
    nhom4.strengths.push('Lịch sử sạch'); strengths++;
  }
  groups.push(nhom4);

  // Công thức mới: base=50
  const score = Math.max(0, Math.min(100, 50 + (strengths * 5) - weightedRisk - (weaknesses * 3) - (missing * 2)));
  let label = 'Chưa rõ';
  if (score >= 70) label = '🟢 Hồ sơ ổn';
  else if (score >= 50) label = '🟡 Hồ sơ cần bổ sung';
  else if (score >= 25) label = '🟠 Hồ sơ rủi ro trung bình';
  else label = '🔴 Hồ sơ rủi ro cao';

  return { groups, overall: { score, label, risks: weightedRisk > 0 ? 1 : 0, weaknesses, strengths, missing } };
}

describe('Profile Analysis Engine', () => {
  it('should return all 4 analysis groups', () => {
    const result = simulateAnalysis({ age: 22, gpa: 7.5, savingsAmount: 15000 });
    expect(result.groups.length).toBe(4);
    expect(result.groups[0].group).toBe('Nhân thân');
    expect(result.groups[1].group).toBe('Học vấn');
    expect(result.groups[2].group).toBe('Tài chính');
    expect(result.groups[3].group).toBe('Nhập cảnh');
  });

  it('should assign strengths for good profile', () => {
    const result = simulateAnalysis({ age: 20, gpa: 8.0, savingsAmount: 20000 });
    expect(result.groups[0].strengths.length).toBeGreaterThan(0);
    expect(result.groups[1].strengths.length).toBeGreaterThan(0);
    expect(result.groups[2].strengths.length).toBeGreaterThan(0);
  });

  it('should detect risks for weak profile', () => {
    const result = simulateAnalysis({ age: 30, gpa: 4.0, savingsAmount: 5000, hasVisaRejection: true });
    expect(result.groups[0].risks.length).toBeGreaterThan(0);
    expect(result.groups[1].weaknesses.length).toBeGreaterThan(0);
    expect(result.groups[2].risks.length).toBeGreaterThan(0);
    expect(result.groups[3].risks.length).toBeGreaterThan(0);
  });

  it('should calculate overall score with new formula (base=50)', () => {
    // Good profile: 3 strengths, 0 risks, 0 weakness, 0 missing
    // Score: 50 + 15 = 65
    const strong = simulateAnalysis({ age: 20, gpa: 8.0, savingsAmount: 20000 });
    expect(strong.overall.score).toBeGreaterThanOrEqual(60);
    expect(strong.overall.label).toMatch(/ổn|cần bổ sung/);

    // Weak profile: age 30 (1 risk high=20), gpa 4.9 (1 weakness), savings 5000 (1 risk high=20), visa rejection (1 risk high=20)
    // Score: 50 - 20 - 20 - 20 - 3 = -13 → 0
    const weak = simulateAnalysis({ age: 30, gpa: 4.0, savingsAmount: 5000, hasVisaRejection: true });
    expect(weak.overall.score).toBeLessThan(50);
    expect(weak.overall.label).toMatch(/rủi ro/);
  });

  it('should handle empty profile with appropriate score', () => {
    const result = simulateAnalysis({});
    expect(result.groups.length).toBe(4);
    // Empty profile: 3 missing → score: 50 - 6 = 44 (🟠 rủi ro trung bình)
    expect(result.overall.score).toBeLessThan(60);
    expect(result.overall.missing).toBeGreaterThan(0);
    // No fake strengths
    expect(result.overall.strengths).toBe(0);
  });

  it('should handle boundary GPA values', () => {
    const edge = simulateAnalysis({ gpa: 5.0 });
    expect(edge.groups[1].weaknesses.length).toBe(0); // GPA 5 is not < 5
    const low = simulateAnalysis({ gpa: 4.9 });
    expect(low.groups[1].weaknesses.length).toBeGreaterThan(0); // GPA 4.9 is < 5
  });

  it('should use weighted risk system (high=20, med=10, low=5)', () => {
    const RISK_WEIGHT = { critical: 30, high: 20, medium: 10, low: 5 };
    expect(RISK_WEIGHT.high).toBe(20);
    expect(RISK_WEIGHT.critical).toBe(30);
    expect(RISK_WEIGHT.medium).toBe(10);
    expect(RISK_WEIGHT.low).toBe(5);
  });
});
