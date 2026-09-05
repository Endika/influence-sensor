import { describe, expect, it } from 'vitest';
import type { Report } from '../../src/report-model';
import { toGraphData } from '../../src/ui/graph-data';

const report = {
  accounts: [
    { account: 'big', interactions: 3, share: 0.75, followed: true, mutual: true },
    { account: 'followedOnly', interactions: 2, share: 0.5, followed: true, mutual: false },
    { account: 'leak', interactions: 1, share: 0.25, followed: false, mutual: false },
  ],
} as Report;

describe('toGraphData', () => {
  it('puts the user at the center and one node per account', () => {
    const { nodes, links } = toGraphData(report, 20);
    expect(nodes[0]).toMatchObject({ id: '__you__', center: true });
    expect(nodes).toHaveLength(4);
    expect(links).toEqual([
      { source: '__you__', target: 'big', weight: 0.75 },
      { source: '__you__', target: 'followedOnly', weight: 0.5 },
      { source: '__you__', target: 'leak', weight: 0.25 },
    ]);
  });

  it('categorizes each account node as mutual, followed or leak', () => {
    const { nodes } = toGraphData(report, 20);
    const cat = (id: string) => nodes.find((n) => n.id === id)!.category;
    expect(cat('big')).toBe('mutual');
    expect(cat('followedOnly')).toBe('followed');
    expect(cat('leak')).toBe('leak');
    expect(nodes.find((n) => n.id === 'big')!.radius).toBeGreaterThan(
      nodes.find((n) => n.id === 'leak')!.radius,
    );
  });

  it('limits to the top N accounts', () => {
    const many = {
      accounts: Array.from({ length: 50 }, (_, i) => ({
        account: `a${i}`,
        interactions: 50 - i,
        share: 0.02,
        followed: true,
      })),
    } as Report;
    expect(toGraphData(many, 20).nodes).toHaveLength(21); // 20 + center
  });
});
