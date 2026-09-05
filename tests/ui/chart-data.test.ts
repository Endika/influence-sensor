import { describe, expect, it } from 'vitest';
import { lorenzPoints } from '../../src/ui/chart-data';

describe('lorenzPoints', () => {
  it('returns the diagonal for a perfectly equal distribution', () => {
    const pts = lorenzPoints([1, 1, 1, 1]);
    expect(pts[0]).toEqual({ x: 0, y: 0 });
    expect(pts[pts.length - 1]).toEqual({ x: 1, y: 1 });
    const mid = pts[2];
    expect(mid.x).toBeCloseTo(0.5);
    expect(mid.y).toBeCloseTo(0.5);
  });

  it('bows below the diagonal for an unequal distribution', () => {
    const pts = lorenzPoints([7, 1, 1, 1]); // sorted ascending internally
    const mid = pts[2];
    expect(mid.y).toBeLessThan(mid.x); // cumulative attention lags behind account count
  });
});
