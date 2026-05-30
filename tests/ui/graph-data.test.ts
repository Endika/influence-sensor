import { describe, expect, it } from 'vitest'
import type { Report } from '../../src/report-model'
import { toGraphData } from '../../src/ui/graph-data'

const report = {
  accounts: [
    { account: 'big', interactions: 3, share: 0.75, followed: true },
    { account: 'leak', interactions: 1, share: 0.25, followed: false },
  ],
} as Report

describe('toGraphData', () => {
  it('puts the user at the center and one node per account', () => {
    const { nodes, links } = toGraphData(report, 20)
    expect(nodes[0]).toMatchObject({ id: '__you__', center: true })
    expect(nodes).toHaveLength(3)
    expect(links).toEqual([
      { source: '__you__', target: 'big', weight: 0.75 },
      { source: '__you__', target: 'leak', weight: 0.25 },
    ])
  })

  it('categorizes each account node and scales radius by share', () => {
    const { nodes } = toGraphData(report, 20)
    const big = nodes.find((n) => n.id === 'big')!
    const leak = nodes.find((n) => n.id === 'leak')!
    expect(big.category).toBe('captures')
    expect(leak.category).toBe('leak')
    expect(big.radius).toBeGreaterThan(leak.radius)
  })

  it('limits to the top N accounts', () => {
    const many = { accounts: Array.from({ length: 50 }, (_, i) => ({ account: `a${i}`, interactions: 50 - i, share: 0.02, followed: true })) } as Report
    expect(toGraphData(many, 20).nodes).toHaveLength(21) // 20 + center
  })
})
