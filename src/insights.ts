import { attentionByAccount } from './metrics'
import type { NormalizedData } from './schema'

export type InfluenceLeaning = 'consumer' | 'balanced' | 'creator'

export interface Insights {
  hasFollowerData: boolean
  hasCloseFriendsData: boolean
  relationships: {
    following: number
    followers: number
    mutual: number // you follow them AND they follow you
    youFollowNotBack: number // you follow, they don't follow back
    followYouNotBack: number // they follow you, you don't follow back
  }
  deadFollowsCount: number // accounts you follow but never engage with
  deadFollowsPct: number // 0..1
  parasocial: Array<{ account: string; interactions: number }> // engaged a lot, NOT followed
  influence: { followerRatio: number; leaning: InfluenceLeaning }
  /** Bias toward your own circle: share of attention spent on mutuals / on accounts you follow. */
  bubble: { mutualAttentionShare: number; followedAttentionShare: number }
  closeFriends: { total: number; engaged: number }
  temporal: {
    byHour: number[]
    busiestHour: number
    spanDays: number
    dated: number
    firstTs: number // unix seconds of the earliest dated interaction
    lastTs: number // unix seconds of the latest dated interaction
  }
}

const intersectSize = (a: Set<string>, b: Set<string>): number => {
  let n = 0
  for (const x of a) if (b.has(x)) n++
  return n
}

export function computeInsights(data: NormalizedData): Insights {
  const byAccount = attentionByAccount(data)
  const engaged = new Set(byAccount.keys())
  const total = data.interactions.length

  const following = data.follows
  const followers = data.followers ?? new Set<string>()
  const close = data.closeFriends ?? new Set<string>()
  const hasFollowerData = data.followers !== undefined && data.followers.size > 0
  const hasCloseFriendsData = data.closeFriends !== undefined && data.closeFriends.size > 0

  const mutual = intersectSize(following, followers)

  const dead = [...following].filter((a) => !engaged.has(a))
  const deadFollowsCount = dead.length

  const parasocial = [...byAccount.entries()]
    .filter(([account]) => !following.has(account))
    .map(([account, interactions]) => ({ account, interactions }))
    .sort((a, b) => b.interactions - a.interactions)

  const followerRatio = following.size === 0 ? 0 : followers.size / following.size
  const leaning: InfluenceLeaning =
    followerRatio >= 1.5 ? 'creator' : followerRatio <= 0.67 ? 'consumer' : 'balanced'

  let mutualAttention = 0
  let followedAttention = 0
  for (const [account, count] of byAccount) {
    const isFollowed = following.has(account)
    if (isFollowed) followedAttention += count
    if (isFollowed && followers.has(account)) mutualAttention += count
  }

  const byHour = new Array(24).fill(0)
  const stamps: number[] = []
  for (const i of data.interactions) {
    if (!i.timestamp) continue
    stamps.push(i.timestamp)
    byHour[new Date(i.timestamp * 1000).getUTCHours()]++
  }
  const busiestHour = byHour.indexOf(Math.max(...byHour))
  const firstTs = stamps.length ? Math.min(...stamps) : 0
  const lastTs = stamps.length ? Math.max(...stamps) : 0
  const spanDays = stamps.length > 1 ? Math.round((lastTs - firstTs) / 86400) : 0

  return {
    hasFollowerData,
    hasCloseFriendsData,
    relationships: {
      following: following.size,
      followers: followers.size,
      mutual,
      youFollowNotBack: following.size - mutual,
      followYouNotBack: followers.size - mutual,
    },
    deadFollowsCount,
    deadFollowsPct: following.size === 0 ? 0 : deadFollowsCount / following.size,
    parasocial,
    influence: { followerRatio, leaning },
    bubble: {
      mutualAttentionShare: total === 0 ? 0 : mutualAttention / total,
      followedAttentionShare: total === 0 ? 0 : followedAttention / total,
    },
    closeFriends: {
      total: close.size,
      engaged: [...close].filter((a) => engaged.has(a)).length,
    },
    temporal: {
      byHour,
      busiestHour: busiestHour < 0 ? 0 : busiestHour,
      spanDays,
      dated: stamps.length,
      firstTs,
      lastTs,
    },
  }
}
