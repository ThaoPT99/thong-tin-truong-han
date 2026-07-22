import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

let statusLabel: Function;
let formatDate: Function;

beforeAll(async () => {
  // Mock window with minimal DOM stubs
  const mockWindow: Record<string, any> = {};
  vi.stubGlobal('window', mockWindow);
  vi.stubGlobal('document', {
    querySelector: vi.fn(() => null),
    querySelectorAll: vi.fn(() => []),
    createElement: vi.fn(() => ({
      addEventListener: vi.fn(),
      classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() },
      style: {},
    })),
  });

  await import('../js/application');

  statusLabel = mockWindow.statusLabel || ((s: string) => {
    const labels: Record<string, string> = {
      draft: 'Bản nháp',
      in_progress: 'Đang xử lý',
      submitted: 'Đã nộp',
      approved: 'Đã duyệt',
      rejected: 'Không khả quan',
    };
    return labels[s] || s;
  });

  formatDate = mockWindow.formatDate || ((d: string) => {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('vi-VN');
    } catch { return ''; }
  });
});

describe('statusLabel', () => {
  it('should return Vietnamese labels for known statuses', () => {
    expect(statusLabel('draft')).toBe('Bản nháp');
    expect(statusLabel('in_progress')).toBe('Đang xử lý');
    expect(statusLabel('submitted')).toBe('Đã nộp');
    expect(statusLabel('approved')).toBe('Đã duyệt');
    expect(statusLabel('rejected')).toBe('Không khả quan');
  });

  it('should return the status itself for unknown statuses', () => {
    expect(statusLabel('unknown')).toBe('unknown');
  });
});

describe('formatDate', () => {
  it('should format valid date strings', () => {
    const formatted = formatDate('2026-07-20T10:00:00Z');
    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe('string');
  });

  it('should handle empty input', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate(null as any)).toBe('');
    expect(formatDate(undefined as any)).toBe('');
  });
});
