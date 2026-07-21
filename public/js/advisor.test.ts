import { describe, it, expect, vi, beforeAll } from 'vitest';

// Mock api-loader module
vi.mock('../js/api-loader', () => ({
  REGION_LABELS: {
    any: 'không ưu tiên khu vực',
    seoul: 'Seoul',
    'near-seoul': 'gần Seoul',
    busan: 'Busan',
    gwangju: 'Gwangju',
  },
}));

let parseQuickProfile: Function;

beforeAll(async () => {
  // Set up window with all globals advisor.js expects
  const mockWindow: Record<string, any> = {};
  vi.stubGlobal('window', mockWindow);

  // Import advisor.js — side effects execute and populate window.*
  await import('../js/advisor');

  // Advisor.js exposes parseQuickProfile on window for testing
  parseQuickProfile = mockWindow.parseQuickProfile;
  expect(parseQuickProfile).toBeDefined();
});

describe('Advisor Logic', () => {
  it('should parse quick profile - region detection', () => {
    expect(parseQuickProfile('seoul').region).toBe('seoul');
    expect(parseQuickProfile('gyeonggi').region).toBe('near-seoul');
    expect(parseQuickProfile('incheon').region).toBe('near-seoul');
    expect(parseQuickProfile('busan').region).toBe('busan');
    expect(parseQuickProfile('gwangju').region).toBe('gwangju');
  });

  it('should parse quick profile - gender detection', () => {
    expect(parseQuickProfile('nữ').gender).toBe('female');
    expect(parseQuickProfile('nu').gender).toBe('female');
    expect(parseQuickProfile('female').gender).toBe('female');
    expect(parseQuickProfile('nam').gender).toBe('male');
    expect(parseQuickProfile('male').gender).toBe('male');
  });

  it('should parse quick profile - age and GPA', () => {
    const profile = parseQuickProfile('20t, GPA 6.5');
    expect(profile.age).toBe(20);
    expect(profile.gpa).toBe(6.5);
  });

  it('should parse quick profile - korean level', () => {
    expect(parseQuickProfile('topik 2').korean).toBe('topik2');
    expect(parseQuickProfile('topik 3').korean).toBe('topik3');
    expect(parseQuickProfile('sejong').korean).toBe('sejong2b');
  });

  it('should parse quick profile - visa fail', () => {
    expect(parseQuickProfile('truot visa').visaFail).toBe('yes');
    expect(parseQuickProfile('trượt').visaFail).toBe('yes');
    expect(parseQuickProfile('fail').visaFail).toBe('yes');
  });

  it('should parse quick profile - budget', () => {
    expect(parseQuickProfile('tiết kiệm').budget).toBe('low');
    expect(parseQuickProfile('rẻ').budget).toBe('low');
    expect(parseQuickProfile('thấp').budget).toBe('low');
    expect(parseQuickProfile('cao').budget).toBe('high');
  });

  it('should parse quick profile - priorities', () => {
    expect(parseQuickProfile('visa').priorities).toContain('visa');
    expect(parseQuickProfile('việc làm').priorities).toContain('job');
    expect(parseQuickProfile('e7').priorities).toContain('e7');
    expect(parseQuickProfile('chi phí').priorities).toContain('cost');
    expect(parseQuickProfile('học ít').priorities).toContain('low-study');
    expect(parseQuickProfile('uy tín').priorities).toContain('prestige');
  });
});
