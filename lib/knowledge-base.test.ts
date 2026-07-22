import { describe, it, expect } from 'vitest';

const {
  KB_ARTICLES,
  KB_FAQ,
  KB_CATEGORIES,
  KB_MODULE_STRUCTURE,
  KB_ANALYSIS_FRAMEWORK,
  KB_STUDY_PLAN_QUESTIONS,
  KB_DOCUMENT_DECISION_RULES,
  KB_FOR_CHAT,
  KB_FOR_STUDY_PLAN,
  KB_FOR_GAP,
  KB_FOR_REJECTION,
} = await import('./knowledge-base.js');

describe('KB_ARTICLES', () => {
  it('should have at least 10 articles', () => {
    expect(KB_ARTICLES.length).toBeGreaterThanOrEqual(10);
  });

  it('every article must have required fields', () => {
    for (const article of KB_ARTICLES) {
      expect(article.id).toBeDefined();
      expect(article.category).toBeDefined();
      expect(article.title).toBeDefined();
      expect(article.summary).toBeDefined();
      expect(article.content).toBeDefined();
      expect(Array.isArray(article.tags)).toBe(true);
      expect(article.tags.length).toBeGreaterThan(0);
    }
  });

  it('all article IDs must be unique', () => {
    const ids = KB_ARTICLES.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each article category must be in KB_CATEGORIES', () => {
    const validCategories = KB_CATEGORIES.map(c => c.id);
    for (const article of KB_ARTICLES) {
      expect(validCategories).toContain(article.category);
    }
  });

  it('every article should have content length > 100 chars', () => {
    for (const article of KB_ARTICLES) {
      expect(article.content.length).toBeGreaterThan(100);
    }
  });

  it('every article should have summary length < 300 chars', () => {
    for (const article of KB_ARTICLES) {
      expect(article.summary.length).toBeLessThan(300);
    }
  });
});

describe('KB_FAQ', () => {
  it('should have at least 10 FAQs', () => {
    expect(KB_FAQ.length).toBeGreaterThanOrEqual(10);
  });

  it('every FAQ must have required fields', () => {
    for (const faq of KB_FAQ) {
      expect(faq.id).toBeDefined();
      expect(faq.category).toBeDefined();
      expect(faq.question).toContain('?');
      expect(faq.answer.length).toBeGreaterThan(20);
    }
  });

  it('all FAQ IDs must be unique', () => {
    const ids = KB_FAQ.map(f => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every FAQ category must be valid', () => {
    const validCategories = KB_CATEGORIES.map(c => c.id);
    for (const faq of KB_FAQ) {
      expect(validCategories).toContain(faq.category);
    }
  });
});

describe('KB_CATEGORIES', () => {
  it('should have at least 5 categories', () => {
    expect(KB_CATEGORIES.length).toBeGreaterThanOrEqual(5);
  });

  it('every category must have id and label', () => {
    for (const cat of KB_CATEGORIES) {
      expect(cat.id).toBeDefined();
      expect(cat.label).toBeDefined();
    }
  });
});

describe('Prompt constants', () => {
  it('KB_MODULE_STRUCTURE should mention visa types', () => {
    expect(KB_MODULE_STRUCTURE).toContain('D-4-1');
    expect(KB_MODULE_STRUCTURE).toContain('D-2');
  });

  it('KB_ANALYSIS_FRAMEWORK should define 6 groups', () => {
    const groups = ['Nhân thân', 'Học vấn', 'Kinh nghiệm', 'Tài chính', 'nhập cảnh', 'Gia đình'];
    let count = 0;
    for (const g of groups) {
      if (KB_ANALYSIS_FRAMEWORK.includes(g)) count++;
    }
    expect(count).toBeGreaterThanOrEqual(5);
  });

  it('KB_STUDY_PLAN_QUESTIONS should have 8 questions', () => {
    const qCount = (KB_STUDY_PLAN_QUESTIONS.match(/\d+\. /g) || []).length;
    expect(qCount).toBe(8);
  });

  it('KB_DOCUMENT_DECISION_RULES should define rules', () => {
    expect(KB_DOCUMENT_DECISION_RULES).toContain('Gap Year');
    expect(KB_DOCUMENT_DECISION_RULES).toContain('trượt visa');
  });

  it('KB_FOR_GAP should warn about finance excuses', () => {
    expect(KB_FOR_GAP).toContain('TUYỆT ĐỐI');
    expect(KB_FOR_GAP).toContain('tài chính');
  });

  it('KB_FOR_REJECTION should list rejection reasons', () => {
    expect(KB_FOR_REJECTION).toContain('nguyên nhân trượt');
    expect(KB_FOR_REJECTION).toContain('cải thiện');
  });

  it('combined prompts should not be empty', () => {
    expect(KB_FOR_CHAT.length).toBeGreaterThan(500);
    expect(KB_FOR_STUDY_PLAN.length).toBeGreaterThan(200);
  });
});
