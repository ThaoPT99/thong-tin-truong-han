import { describe, it, expect } from 'vitest';

describe('Utility Functions', () => {
  describe('extractKRWValue logic', () => {
    const extractKRWValue = (str) => {
      if (!str) return null;
      const normal = str.replace(/\./g, '');
      const m = normal.match(/([\d,]+)\s*(?:KRW|원|won)/i);
      if (m) return parseInt(m[1].replace(/,/g, ''), 10);
      return null;
    };

    it('should extract number from KRW string', () => {
      expect(extractKRWValue('1,234,567 KRW')).toBe(1234567);
      expect(extractKRWValue('500,000 원')).toBe(500000);
      expect(extractKRWValue('1.234.567 KRW')).toBe(1234567);
    });

    it('should return null for invalid input', () => {
      expect(extractKRWValue('invalid')).toBeNull();
      expect(extractKRWValue('')).toBeNull();
      expect(extractKRWValue(null)).toBeNull();
    });
  });

  describe('normalizeRegionForFilter logic', () => {
    const normalizeRegionForFilter = (cardRegion, filterRegion) => {
      if (!cardRegion) return '';
      const r = String(cardRegion).toLowerCase().trim();
      if (filterRegion === 'near-seoul') {
        if (r === 'gyeonggi' || r === 'incheon' || r === 'near-seoul') return 'near-seoul';
      }
      return r;
    };

    it('should normalize gyeonggi/incheon to near-seoul', () => {
      expect(normalizeRegionForFilter('gyeonggi', 'near-seoul')).toBe('near-seoul');
      expect(normalizeRegionForFilter('incheon', 'near-seoul')).toBe('near-seoul');
      expect(normalizeRegionForFilter('seoul', 'near-seoul')).toBe('seoul');
      expect(normalizeRegionForFilter('busan', 'near-seoul')).toBe('busan');
    });
  });

  describe('parseSearchIntent logic', () => {
    const INTENT_MAP = {
      region: [
        { patterns: [/seoul|서울/], value: 'seoul', label: 'Seoul' },
        { patterns: [/gần.*seoul|near.*seoul|경기/], value: 'near-seoul', label: 'Gần Seoul' },
        { patterns: [/busan|pusan|부산/], value: 'busan', label: 'Busan' },
      ],
    };

    const parseSearchIntent = (query) => {
      const q = (query || '').toLowerCase().trim();
      const intents = { region: null, tags: [] };
      if (q.length < 2) return intents;
      INTENT_MAP.region.forEach((rule) => {
        rule.patterns.forEach((p) => {
          if (p.test(q)) intents.region = rule.value;
        });
      });
      return intents;
    };

    it('should detect seoul intent', () => {
      expect(parseSearchIntent('seoul')).toEqual({ region: 'seoul', tags: [] });
      expect(parseSearchIntent('gần seoul')).toEqual({ region: 'near-seoul', tags: [] });
      expect(parseSearchIntent('busan')).toEqual({ region: 'busan', tags: [] });
      expect(parseSearchIntent('')).toEqual({ region: null, tags: [] });
    });
  });
});