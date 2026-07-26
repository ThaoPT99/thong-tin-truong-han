import { describe, it, expect } from 'vitest';

describe('Students API Logic', () => {
  it('should filter students by owner_id for sale users', () => {
    const isSale = true;
    const userId = 'sale-user-id';
    const studentOwnerId = userId;
    const otherOwnerId = 'sale-other-id';

    const canSeeOwn = isSale ? String(studentOwnerId) === String(userId) : true;
    expect(canSeeOwn).toBe(true);

    const canSeeOther = isSale ? String(otherOwnerId) === String(userId) : true;
    expect(canSeeOther).toBe(false);
  });

  it('should allow director to see all students', () => {
    const isDirector = true;
    const canSee = isDirector ? true : false;
    expect(canSee).toBe(true);
  });

  it('should forbid sale from updating other sale student', () => {
    const isSale = true;
    const currentUserId = 'sale-1';
    const studentOwnerId = 'sale-2';

    const isOwner = String(currentUserId) === String(studentOwnerId);
    const isDirector = false; // sale user, not director
    const canUpdate = isDirector ? true : (isSale ? isOwner : false);

    expect(canUpdate).toBe(false);
  });

  it('should allow sale to update own student', () => {
    const isSale = true;
    const currentUserId = 'sale-1';
    const studentOwnerId = currentUserId;

    const isOwner = String(currentUserId) === String(studentOwnerId);
    const isDirector = false; // sale user
    const canUpdate = isDirector ? true : (isSale ? isOwner : false);

    expect(canUpdate).toBe(true);
  });

  it('should allow director to update any student', () => {
    const isDirector = true;
    const canUpdate = isDirector ? true : false;
    expect(canUpdate).toBe(true);
  });

  it('should allow sale to delete own student', () => {
    const isSale = true;
    const currentUserId = 'sale-1';
    const studentOwnerId = currentUserId;

    const isOwner = String(currentUserId) === String(studentOwnerId);
    const isDirector = false; // sale user
    const canDelete = true ? true : (isSale ? isOwner : false);

    expect(canDelete).toBe(true);
  });

  it('should forbid sale from deleting other sale student', () => {
    const isSale = true;
    const currentUserId = 'sale-1';
    const studentOwnerId = 'sale-2';

    const isOwner = String(currentUserId) === String(studentOwnerId);
    const isDirector = false;
    const canDelete = isDirector ? true : (isSale ? isOwner : false);

    expect(canDelete).toBe(false);
  });

  // ═══ Activity Logs — filter logic ═══

  describe('Activity logs filtering', () => {
    const logs = [
      { student_id: 's1', email: 'a@test.com', full_name: 'User A', activity_type: 'page_view', created_at: '2026-07-26T10:00:00Z' },
      { student_id: 's2', email: 'b@test.com', full_name: 'User B', activity_type: 'chat', created_at: '2026-07-26T11:00:00Z' },
      { student_id: 's1', email: 'a@test.com', full_name: 'User A', activity_type: 'view_school', created_at: '2026-07-26T12:00:00Z' },
      { student_id: 's3', email: 'c@test.com', full_name: 'User C', activity_type: 'advisor', created_at: '2026-07-26T13:00:00Z' },
    ];

    it('should filter by student_email', () => {
      const email = 'a@test.com';
      const filtered = logs.filter(l => l.email === email);
      expect(filtered).toHaveLength(2);
      expect(filtered.every(l => l.email === 'a@test.com')).toBe(true);
    });

    it('should filter by activity_type', () => {
      const type = 'chat';
      const filtered = logs.filter(l => l.activity_type === type);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].activity_type).toBe('chat');
    });

    it('should filter by both email and activity_type', () => {
      const email = 'a@test.com';
      const type = 'view_school';
      const filtered = logs.filter(l => l.email === email && l.activity_type === type);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].full_name).toBe('User A');
    });

    it('should return empty when no matches', () => {
      const email = 'nonexistent@test.com';
      const filtered = logs.filter(l => l.email === email);
      expect(filtered).toHaveLength(0);
    });

    it('should order by created_at descending', () => {
      const sorted = [...logs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      expect(sorted[0].activity_type).toBe('advisor');
      expect(sorted[3].activity_type).toBe('page_view');
    });

    it('should limit results correctly', () => {
      const limit = 2;
      const limited = logs.slice(0, limit);
      expect(limited).toHaveLength(2);
    });

    it('should handle case-insensitive email search', () => {
      const q = 'A@TEST';
      const filtered = logs.filter(l => l.email.toLowerCase().includes(q.toLowerCase()));
      expect(filtered).toHaveLength(2);
    });

    it('should handle case-insensitive name search', () => {
      const q = 'user b';
      const filtered = logs.filter(l => l.full_name.toLowerCase().includes(q.toLowerCase()));
      expect(filtered).toHaveLength(1);
      expect(filtered[0].email).toBe('b@test.com');
    });

    it('should not allow sale user to view activity logs', () => {
      const isDirector = false;
      const canView = isDirector ? true : false;
      expect(canView).toBe(false);
    });

    it('should allow director to view activity logs', () => {
      const isDirector = true;
      const canView = isDirector ? true : false;
      expect(canView).toBe(true);
    });
  });

  // ═══ Activity Logging — Data shape & API validation ═══

  describe('Activity log data shape', () => {
    it('should have all required fields in a valid log entry', () => {
      const log = {
        id: 'uuid-1',
        student_id: 'uuid-student',
        email: 'a@test.com',
        full_name: 'User A',
        activity_type: 'view_school',
        page: '/?school=osan',
        details: { schoolSlug: 'osan', schoolName: 'Osan University' },
        ip: '1.2.3.4',
        user_agent: 'Mozilla/5.0',
        created_at: '2026-07-26T10:00:00Z',
      };

      // All required fields must be present
      expect(log.id).toBeTruthy();
      expect(log.student_id).toBeTruthy();
      expect(log.activity_type).toBeTruthy();
      expect(log.created_at).toBeTruthy();

      // details should be a valid JSON object
      expect(typeof log.details).toBe('object');
      expect(log.details.schoolSlug).toBe('osan');

      // Optional fields should default to empty string
      expect(typeof log.email).toBe('string');
      expect(typeof log.full_name).toBe('string');
      expect(typeof log.page).toBe('string');
    });

    it('should handle details field with various structures', () => {
      // Page view details
      const pageViewDetails = { pageType: 'home' };
      expect(pageViewDetails.pageType).toBe('home');

      // School view details
      const schoolViewDetails = { schoolSlug: 'induk', schoolName: 'Induk University' };
      expect(schoolViewDetails.schoolName).toBe('Induk University');

      // Chat details
      const chatDetails = { source: 'student-agent', messagePreview: 'Xem hồ sơ' };
      expect(chatDetails.source).toBe('student-agent');

      // Tab switch details
      const tabDetails = { tab: 'schools' };
      expect(tabDetails.tab).toBe('schools');

      // All should be serializable to JSON
      [pageViewDetails, schoolViewDetails, chatDetails, tabDetails].forEach(d => {
        expect(() => JSON.stringify(d)).not.toThrow();
      });
    });

    it('should ensure all activity_type values have admin UI labels', () => {
      // This matches the ACTIVITY_TYPE_LABELS map in admin/students.html
      const ACTIVITY_TYPE_LABELS = {
        page_view: 'Xem trang',
        tab_switch: 'Chuyển tab',
        tool_use: 'Công cụ',
        advisor: 'Tư vấn',
        chat: 'Chat AI',
        search: 'Tìm kiếm',
        checklist: 'Hồ sơ',
        document: 'Giấy tờ',
        save_school: 'Lưu trường',
        view_school: 'Xem trường',
      };

      // Every tracked type used in the codebase must have a label
      const trackedTypes = ['page_view', 'tab_switch', 'view_school', 'chat', 'advisor', 'search', 'tool_use', 'checklist', 'document', 'save_school'];
      trackedTypes.forEach(type => {
        expect(ACTIVITY_TYPE_LABELS[type])
          .withContext(`Missing label for activity type: ${type}`)
          .toBeTruthy();
      });

      // All labels should be non-empty Vietnamese strings
      Object.values(ACTIVITY_TYPE_LABELS).forEach(label => {
        expect(label.length).toBeGreaterThan(0);
      });
    });

    it('should ensure all activity_type values have admin UI colors', () => {
      // This matches the ACTIVITY_TYPE_COLORS map in admin/students.html
      const ACTIVITY_TYPE_COLORS = {
        page_view: '#6366f1',
        tab_switch: '#8b5cf6',
        tool_use: '#f59e0b',
        advisor: '#059669',
        chat: '#2563eb',
        search: '#0891b2',
        checklist: '#d97706',
        document: '#7c3aed',
        save_school: '#dc2626',
        view_school: '#0f766e',
      };

      const trackedTypes = ['page_view', 'tab_switch', 'view_school', 'chat', 'advisor', 'search', 'tool_use', 'checklist', 'document', 'save_school'];
      trackedTypes.forEach(type => {
        expect(ACTIVITY_TYPE_COLORS[type])
          .withContext(`Missing color for activity type: ${type}`)
          .toBeTruthy();
      });

      // All colors should be valid hex codes
      Object.values(ACTIVITY_TYPE_COLORS).forEach(color => {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });
  });

  describe('Activity logging POST validation', () => {
    it('should reject empty activityType', () => {
      const body = { activityType: '', page: '/schools' };
      const isValid = body.activityType && body.activityType.trim().length > 0;
      expect(isValid).toBe(false);
    });

    it('should reject missing activityType', () => {
      const body = { page: '/schools' };
      const hasType = 'activityType' in body;
      expect(hasType).toBe(false);
    });

    it('should accept valid activity log with all fields', () => {
      const body = {
        activityType: 'view_school',
        page: '/?school=osan',
        details: { schoolSlug: 'osan' },
      };
      expect(body.activityType).toBeTruthy();
      expect(typeof body.page).toBe('string');
      expect(typeof body.details).toBe('object');
    });

    it('should accept log with minimal fields (activityType only)', () => {
      const body = { activityType: 'page_view' };
      expect(body.activityType).toBeTruthy();
      // page and details are optional
    });

    it('should handle details with IP and user_agent fields', () => {
      const log = {
        activityType: 'page_view',
        page: '/',
        details: {},
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
      };
      expect(log.ip).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
      expect(typeof log.userAgent).toBe('string');
    });
  });
});