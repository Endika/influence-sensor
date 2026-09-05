import { describe, expect, it } from 'vitest';
import { excludeSelf, ownerFromFilename } from '../src/owner';
import type { NormalizedData } from '../src/schema';

describe('ownerFromFilename', () => {
  it('extracts the username from an Instagram export filename', () => {
    expect(ownerFromFilename('instagram-endika_iglesias-2026-05-30-QSxZWh2s.zip')).toBe(
      'endika_iglesias',
    );
  });
  it('returns null for an unrelated filename', () => {
    expect(ownerFromFilename('my-export.zip')).toBeNull();
  });
});

describe('excludeSelf', () => {
  const data: NormalizedData = {
    interactions: [
      { account: 'friend', kind: 'story_like', timestamp: 1 },
      { account: 'Endika_Iglesias', kind: 'comment', timestamp: 2 },
    ],
    follows: new Set(['friend', 'endika_iglesias']),
    unattributed: 3,
  };

  it('removes the owner from interactions and follows, case-insensitively', () => {
    const out = excludeSelf(data, 'endika_iglesias');
    expect(out.interactions.map((i) => i.account)).toEqual(['friend']);
    expect(out.follows).toEqual(new Set(['friend']));
    expect(out.unattributed).toBe(3);
  });

  it('is a no-op when the owner is unknown', () => {
    expect(excludeSelf(data, null)).toBe(data);
  });
});
