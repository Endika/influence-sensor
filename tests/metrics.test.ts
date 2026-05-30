import { describe, expect, it } from 'vitest'
import type { NormalizedData } from '../src/schema'
import {
  attentionByAccount,
  entropy,
  gini,
  hhi,
  normalizedEntropy,
  topNShare,
} from '../src/metrics'

function data(interactions: Array<[string, number]>): NormalizedData {
  return {
    interactions: interactions.flatMap(([account, n]) =>
      Array.from({ length: n }, () => ({ account, kind: 'like_post' as const, timestamp: 0 })),
    ),
    follows: new Set<string>(),
  }
}

describe('attentionByAccount', () => {
  it('counts interactions per account', () => {
    const counts = attentionByAccount(data([['a', 3], ['b', 1]]))
    expect(counts.get('a')).toBe(3)
    expect(counts.get('b')).toBe(1)
  })
})

describe('hhi', () => {
  it('is 1 when one account owns all attention', () => {
    expect(hhi([10])).toBeCloseTo(1)
  })
  it('is 1/n for a uniform distribution', () => {
    expect(hhi([1, 1, 1, 1])).toBeCloseTo(0.25)
  })
})

describe('gini', () => {
  it('is 0 for a uniform distribution', () => {
    expect(gini([1, 1, 1, 1])).toBeCloseTo(0)
  })
  it('approaches 1 - 1/n for a single holder', () => {
    expect(gini([0, 0, 0, 1])).toBeCloseTo(0.75)
  })
})

describe('entropy', () => {
  it('equals log2(n) for a uniform distribution', () => {
    expect(entropy([1, 1, 1, 1])).toBeCloseTo(2)
  })
  it('is 0 when all attention is on one account', () => {
    expect(entropy([5])).toBeCloseTo(0)
  })
})

describe('normalizedEntropy', () => {
  it('is 1 for a uniform distribution', () => {
    expect(normalizedEntropy([1, 1, 1, 1])).toBeCloseTo(1)
  })
  it('is 0 for a single account', () => {
    expect(normalizedEntropy([7])).toBe(0)
  })
})

describe('topNShare', () => {
  it('returns the share held by the top n accounts', () => {
    expect(topNShare([5, 3, 1, 1], 2)).toBeCloseTo(0.8)
  })
  it('caps at the full distribution when n exceeds account count', () => {
    expect(topNShare([2, 2], 10)).toBeCloseTo(1)
  })
})
