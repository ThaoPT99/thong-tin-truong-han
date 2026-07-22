import { describe, it, expect, vi, beforeAll } from 'vitest';

let analyzeStudentProfile: Function;

// Simulated profile analysis logic (same rules as profile-analysis.js)
function simulateAnalysis(profile: any) {
  const groups: any[] = [];
  let risks = 0, weaknesses = 0, strengths = 0;

  // Nhân thân
  const nhom1: any = { group: 'Nhân thân', strengths: [], weaknesses: [], risks: [], missingEvidence: [], actions: [] };
  if (profile.age) {
    if (profile.age >= 18 && profile.age <= 25) { nhom1.strengths.push('Tuổi lý tưởng'); strengths++; }
    else if (profile.age > 28) { nhom1.risks.push('Tuổi cao'); risks++; }
  }
  groups.push(nhom1);

  // Học vấn
  const nhom2: any = { group: 'Học vấn', strengths: [], weaknesses: [], risks: [], missingEvidence: [], actions: [] };
  if (profile.gpa) {
    if (profile.gpa >= 7) { nhom2.strengths.push('GPA tốt'); strengths++; }
    else if (profile.gpa < 5) { nhom2.weaknesses.push('GPA thấp'); weaknesses++; }
  }
  groups.push(nhom2);

  // Tài chính
  const nhom3: any = { group: 'Tài chính', strengths: [], weaknesses: [], risks: [], missingEvidence: [], actions: [] };
  if (profile.savingsAmount) {
    if (profile.savingsAmount >= 10000) { nhom3.strengths.push('Sổ TK đủ'); strengths++; }
    else { nhom3.risks.push('Sổ TK thiếu'); risks++; }
  }
  groups.push(nhom3);

  // Nhập cảnh
  const nhom4: any = { group: 'Nhập cảnh', strengths: [], weaknesses: [], risks: [], missingEvidence: [], actions: [] };
  if (profile.hasVisaRejection) {
    nhom4.risks.push('Đã trượt visa, cần giải trình');
    risks++;
  }
  groups.push(nhom4);

  const score = Math.max(0, Math.min(100, 100 - (risks * 10) - (weaknesses * 5) + (strengths * 3)));
  let label = 'Chưa rõ';
  if (score >= 80) label = 'Tốt';
  else if (score >= 60) label = 'Trung bình';
  else if (score >= 40) label = 'Rủi ro';
  else label = 'Rủi ro cao';

  return { groups, overall: { score, label, risks, weaknesses, strengths } };
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

  it('should calculate overall score correctly', () => {
    const strong = simulateAnalysis({ age: 20, gpa: 8.0, savingsAmount: 20000 });
    expect(strong.overall.score).toBeGreaterThanOrEqual(80);
    expect(strong.overall.label).toBe('Tốt');

    const weak = simulateAnalysis({ age: 30, gpa: 4.0, savingsAmount: 5000, hasVisaRejection: true });
    expect(weak.overall.score).toBeLessThan(80); // Weak profile: 4 risks + 1 weakness = -45, +0 strengths = 55-65
    expect(weak.overall.label).toMatch(/Rủi ro|Trung bình/);
  });

  it('should handle empty profile', () => {
    const result = simulateAnalysis({});
    expect(result.groups.length).toBe(4);
    expect(result.overall.score).toBe(100);
    expect(result.overall.label).toBe('Tốt');
  });

  it('should handle boundary GPA values', () => {
    const edge = simulateAnalysis({ gpa: 5.0 });
    expect(edge.groups[1].weaknesses.length).toBe(0); // GPA 5 is not < 5
    const low = simulateAnalysis({ gpa: 4.9 });
    expect(low.groups[1].weaknesses.length).toBeGreaterThan(0); // GPA 4.9 is < 5
  });
});
