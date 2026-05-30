import type { NormalizedData } from './schema'

export function attentionByAccount(data: NormalizedData): Map<string, number> {
  const counts = new Map<string, number>()
  for (const i of data.interactions) {
    counts.set(i.account, (counts.get(i.account) ?? 0) + 1)
  }
  return counts
}

function shares(counts: number[]): number[] {
  const total = counts.reduce((a, b) => a + b, 0)
  if (total === 0) return counts.map(() => 0)
  return counts.map((c) => c / total)
}

/** Herfindahl index: sum of squared shares. 0 = spread, 1 = fully concentrated. */
export function hhi(counts: number[]): number {
  return shares(counts).reduce((a, s) => a + s * s, 0)
}

/** Gini coefficient of the distribution. 0 = perfectly equal. */
export function gini(counts: number[]): number {
  const sorted = [...counts].sort((a, b) => a - b)
  const n = sorted.length
  const total = sorted.reduce((a, b) => a + b, 0)
  if (n === 0 || total === 0) return 0
  let weighted = 0
  for (let i = 0; i < n; i++) weighted += (i + 1) * sorted[i]
  return (2 * weighted) / (n * total) - (n + 1) / n
}

/** Shannon entropy in bits. High = diverse attention. */
export function entropy(counts: number[]): number {
  return shares(counts).reduce((a, s) => (s > 0 ? a - s * Math.log2(s) : a), 0)
}

/** Entropy normalized to [0, 1] by the max possible for the number of accounts. */
export function normalizedEntropy(counts: number[]): number {
  const active = counts.filter((c) => c > 0).length
  if (active <= 1) return 0
  return entropy(counts) / Math.log2(active)
}

/** Fraction of total attention held by the top n accounts. */
export function topNShare(counts: number[], n: number): number {
  const total = counts.reduce((a, b) => a + b, 0)
  if (total === 0) return 0
  const top = [...counts].sort((a, b) => b - a).slice(0, n)
  return top.reduce((a, b) => a + b, 0) / total
}

export interface FollowVsEngage {
  followedIgnored: string[] // followed but never engaged — "clean"
  followedEngaged: string[] // followed and engaged — captures you
  engagedNotFollowed: string[] // engaged without following — attention leak
}

export function followVsEngage(data: NormalizedData): FollowVsEngage {
  const engaged = new Set(data.interactions.map((i) => i.account))
  const followedIgnored: string[] = []
  const followedEngaged: string[] = []
  for (const account of data.follows) {
    if (engaged.has(account)) followedEngaged.push(account)
    else followedIgnored.push(account)
  }
  const engagedNotFollowed = [...engaged].filter((a) => !data.follows.has(a))
  return { followedIgnored, followedEngaged, engagedNotFollowed }
}

export type Band = 'Captured' | 'Moderate' | 'Healthy'

export interface HealthResult {
  score: number // 0..100
  band: Band
  diversity: number // normalized entropy, 0..1
  concentration: number // top-10 share, 0..1
}

const WEIGHTS = { diversity: 0.5, concentration: 0.5 }

/** Transparent 0–100 verdict combining diversity (good) and concentration (bad). */
export function healthScore(counts: number[]): HealthResult {
  const diversity = normalizedEntropy(counts)
  const concentration = topNShare(counts, 10)
  const score = Math.round(
    100 * (WEIGHTS.diversity * diversity + WEIGHTS.concentration * (1 - concentration)),
  )
  const band: Band = score >= 66 ? 'Healthy' : score >= 33 ? 'Moderate' : 'Captured'
  return { score, band, diversity, concentration }
}
