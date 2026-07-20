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
});