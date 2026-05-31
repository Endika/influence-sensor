import { describe, expect, it } from 'vitest'
import type { NormalizedData } from '../src/schema'
import { analyze } from '../src/report-model'

function build(): NormalizedData {
  return {
    interactions: [
      { account: 'big', kind: 'like_post', timestamp: 10 },
      { account: 'big', kind: 'like_post', timestamp: 11 },
      { account: 'big', kind: 'comment', timestamp: 12 },
      { account: 'small', kind: 'like_post', timestamp: 13 },
    ],
    follows: new Set(['big', 'never_engaged']),
  }
}

describe('analyze', () => {
  it('assembles a complete report', () => {
    const r = analyze(build())
    expect(r.totalInteractions).toBe(4)
    expect(r.totalFollows).toBe(2)
    expect(r.uniqueAccountsEngaged).toBe(2)
    expect(r.accounts[0]).toEqual({ account: 'big', interactions: 3, share: 0.75, followed: true, mutual: false })
    expect(r.accounts[1]).toEqual({ account: 'small', interactions: 1, share: 0.25, followed: false, mutual: false })
    expect(r.health.band).toBeDefined()
    expect(r.followVsEngage).toEqual({ followedIgnored: 1, followedEngaged: 1, engagedNotFollowed: 1 })
  })
})
