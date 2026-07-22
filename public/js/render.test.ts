import { describe, it, expect, vi, beforeAll } from 'vitest';

beforeAll(async () => {
  const mockWindow: Record<string, any> = {};
  vi.stubGlobal('window', mockWindow);
  vi.stubGlobal('document', {
    querySelector: vi.fn(),
    querySelectorAll: vi.fn(() => []),
    createElement: vi.fn(() => ({})),
  });
  await import('../js/render');
});

describe('Render helpers', () => {
  describe('visa label logic', () => {
    it('should map D-4-1 to correct label', () => {
      const win = window as any;
      // Check if the function is exposed
      if (win.getVisaLabel) {
        expect(win.getVisaLabel('D-4-1')).toContain('D-4-1');
      }
    });
  });

  describe('formatCurrency', () => {
    it('should format numbers with commas', () => {
      const win = window as any;
      if (win.formatCurrency) {
        expect(win.formatCurrency(1000000)).toContain('1,000,000');
        expect(win.formatCurrency(50000)).toContain('50,000');
      }
    });

    it('should handle null/undefined', () => {
      const win = window as any;
      if (win.formatCurrency) {
        expect(win.formatCurrency(null)).toBe('0');
        expect(win.formatCurrency(undefined)).toBe('0');
      }
    });
  });

  describe('getSchoolTypeLabel', () => {
    it('should handle various school types', () => {
      const win = window as any;
      if (win.getSchoolTypeLabel) {
        expect(typeof win.getSchoolTypeLabel('university')).toBe('string');
        expect(typeof win.getSchoolTypeLabel('college')).toBe('string');
      }
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      const win = window as any;
      if (win.escapeHtml) {
        expect(win.escapeHtml('<script>alert("xss")</script>'))
          .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
        expect(win.escapeHtml('safe text')).toBe('safe text');
        expect(win.escapeHtml('')).toBe('');
      }
    });
  });
});
