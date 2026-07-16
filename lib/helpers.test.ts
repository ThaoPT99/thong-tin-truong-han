// Note: These tests only cover guard clauses (null/empty handling)
// because vitest's vi.mock/vi.doMock cannot intercept CJS require() calls
// used by helpers.js to import supabase. Full logic tests (insert/delete/replace)
// would need integration-level testing with a real or Docker-based Supabase.

import { describe, it, expect } from 'vitest';
import {
  insertChildTable,
  replaceChildTable,
  replacePartners,
  upsertAdvisorProfile,
} from './helpers.js';

describe('Helpers', () => {
  describe('insertChildTable', () => {
    it('should be a function', () => {
      expect(typeof insertChildTable).toBe('function');
    });

    it('should handle empty/null items without error', async () => {
      // These guards return early without calling supabase
      await expect(insertChildTable('school_conditions', 'school-1', [])).resolves.toBeUndefined();
      await expect(insertChildTable('school_conditions', 'school-1', null)).resolves.toBeUndefined();
      await expect(insertChildTable('school_conditions', 'school-1', undefined)).resolves.toBeUndefined();
    });
  });

  describe('replaceChildTable', () => {
    it('should be a function', () => {
      expect(typeof replaceChildTable).toBe('function');
    });

    it('should handle empty items without error', async () => {
      await expect(replaceChildTable('school_conditions', 'school-1', [])).resolves.toBeUndefined();
    });
  });

  describe('replacePartners', () => {
    it('should be a function', () => {
      expect(typeof replacePartners).toBe('function');
    });

    it('should handle empty partners without error', async () => {
      await expect(replacePartners('school-1', [])).resolves.toBeUndefined();
    });
  });

  describe('upsertAdvisorProfile', () => {
    it('should be a function', () => {
      expect(typeof upsertAdvisorProfile).toBe('function');
    });

    it('should handle null/undefined without error', async () => {
      await expect(upsertAdvisorProfile('school-1', null)).resolves.toBeUndefined();
      await expect(upsertAdvisorProfile('school-1', undefined)).resolves.toBeUndefined();
    });
  });
});


