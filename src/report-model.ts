import type { NormalizedData } from './schema'
import {
  attentionByAccount,
  entropy,
  followVsEngage,
  gini,
  healthScore,
  hhi,
  topNShare,
  type Band,
  type HealthResult,
} from './metrics'

export type { Band }

export interface AccountStat {
  account: string
  interactions: number
  share: number
  followed: boolean
}

export interface Report {
  totalInteractions: number
  totalFollows: number
  uniqueAccountsEngaged: number
  health: HealthResult
  hhi: number
  gini: number
  entropy: number
  topTenShare: number
  accounts: AccountStat[] // ranked by interactions desc
  followVsEngage: { followedIgnored: number; followedEngaged: number; engagedNotFollowed: number }
}

export function analyze(data: NormalizedData): Report {
  const byAccount = attentionByAccount(data)
  const counts = [...byAccount.values()]
  const total = data.interactions.length

  const accounts: AccountStat[] = [...byAccount.entries()]
    .map(([account, interactions]) => ({
      account,
      interactions,
      share: total === 0 ? 0 : interactions / total,
      followed: data.follows.has(account),
    }))
    .sort((a, b) => b.interactions - a.interactions)

  const fve = followVsEngage(data)

  return {
    totalInteractions: total,
    totalFollows: data.follows.size,
    uniqueAccountsEngaged: byAccount.size,
    health: healthScore(counts),
    hhi: hhi(counts),
    gini: gini(counts),
    entropy: entropy(counts),
    topTenShare: topNShare(counts, 10),
    accounts,
    followVsEngage: {
      followedIgnored: fve.followedIgnored.length,
      followedEngaged: fve.followedEngaged.length,
      engagedNotFollowed: fve.engagedNotFollowed.length,
    },
  }
}
