import { describe, expect, it } from 'vitest';
import { computeInsights } from '../src/insights';
import type { Interaction, NormalizedData } from '../src/schema';

const T = 1700000000; // fixed timestamp (UTC hour 22)
const mk = (account: string, n: number): Interaction[] =>
  Array.from({ length: n }, () => ({ account, kind: 'story_like' as const, timestamp: T }));

const data: NormalizedData = {
  interactions: [...mk('mutualA', 3), ...mk('creatorB', 1), ...mk('strangerC', 2)],
  follows: new Set(['mutualA', 'creatorB', 'deadD']),
  followers: new Set(['mutualA', 'fanE', 'fanF']),
  closeFriends: new Set(['mutualA', 'closeG']),
};
const ins = computeInsights(data);

describe('computeInsights', () => {
  it('computes relationship counts', () => {
    expect(ins.relationships).toEqual({
      following: 3,
      followers: 3,
      mutual: 1,
      youFollowNotBack: 2,
      followYouNotBack: 2,
    });
  });
  it('counts dead follows (followed but never engaged)', () => {
    expect(ins.deadFollowsCount).toBe(1);
    expect(ins.deadFollowsPct).toBeCloseTo(1 / 3);
  });
  it('ranks parasocial leaks (engaged, not followed)', () => {
    expect(ins.parasocial).toEqual([{ account: 'strangerC', interactions: 2 }]);
  });
  it('classifies influence direction', () => {
    expect(ins.influence.followerRatio).toBeCloseTo(1);
    expect(ins.influence.leaning).toBe('balanced');
  });
  it('measures bubble (in-group) attention share', () => {
    expect(ins.bubble.mutualAttentionShare).toBeCloseTo(3 / 6);
    expect(ins.bubble.followedAttentionShare).toBeCloseTo(4 / 6);
  });
  it('checks close-friends engagement', () => {
    expect(ins.closeFriends).toEqual({ total: 2, engaged: 1 });
  });
  it('builds a temporal histogram', () => {
    expect(ins.temporal.dated).toBe(6);
    expect(ins.temporal.byHour[ins.temporal.busiestHour]).toBe(6);
  });
});

describe('computeInsights with no relationship data', () => {
  it('flags missing follower/close-friends data', () => {
    const bare = computeInsights({ interactions: mk('x', 1), follows: new Set() });
    expect(bare.hasFollowerData).toBe(false);
    expect(bare.hasCloseFriendsData).toBe(false);
  });
});
