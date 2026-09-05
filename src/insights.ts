import { attentionByAccount, topNShare } from './metrics';
import type { InteractionKind, NormalizedData } from './schema';

export type InfluenceLeaning = 'consumer' | 'balanced' | 'creator';
export type InfectionBand = 'low' | 'medium' | 'high';
export type Trend = 'rising' | 'falling' | 'flat';

export interface Insights {
  hasFollowerData: boolean;
  hasCloseFriendsData: boolean;
  relationships: {
    following: number;
    followers: number;
    mutual: number; // you follow them AND they follow you
    youFollowNotBack: number; // you follow, they don't follow back
    followYouNotBack: number; // they follow you, you don't follow back
  };
  deadFollowsCount: number; // accounts you follow but never engage with
  deadFollowsPct: number; // 0..1
  parasocial: Array<{ account: string; interactions: number }>; // engaged a lot, NOT followed
  influence: { followerRatio: number; leaning: InfluenceLeaning };
  /** Bias toward your own circle: share of attention spent on mutuals / on accounts you follow. */
  bubble: { mutualAttentionShare: number; followedAttentionShare: number };
  closeFriends: { total: number; engaged: number };
  byKind: Array<{ kind: InteractionKind; count: number }>; // how you engage, ranked
  byYear: Array<{ year: number; count: number }>; // activity per calendar year
  byWeekday: number[]; // length 7, index 0 = Sunday (UTC)
  /** How captured you are by a few external accounts (0..100, higher = more infected). */
  infection: {
    index: number;
    band: InfectionBand;
    concentration: number; // top-10 share
    topThree: number; // top-3 share — your main "infection vectors"
    parasocialShare: number; // share of attention to accounts you don't follow
  };
  /** Per-year top-3 concentration, to see if capture grows over time. */
  concentrationByYear: Array<{ year: number; top3Share: number; count: number }>;
  trend: Trend;
  temporal: {
    byHour: number[];
    busiestHour: number;
    spanDays: number;
    dated: number;
    firstTs: number; // unix seconds of the earliest dated interaction
    lastTs: number; // unix seconds of the latest dated interaction
  };
}

const intersectSize = (a: Set<string>, b: Set<string>): number => {
  let n = 0;
  for (const x of a) if (b.has(x)) n++;
  return n;
};

export function computeInsights(data: NormalizedData): Insights {
  const byAccount = attentionByAccount(data);
  const engaged = new Set(byAccount.keys());
  const total = data.interactions.length;

  const following = data.follows;
  const followers = data.followers ?? new Set<string>();
  const close = data.closeFriends ?? new Set<string>();
  const hasFollowerData = data.followers !== undefined && data.followers.size > 0;
  const hasCloseFriendsData = data.closeFriends !== undefined && data.closeFriends.size > 0;

  const mutual = intersectSize(following, followers);

  const dead = [...following].filter((a) => !engaged.has(a));
  const deadFollowsCount = dead.length;

  const parasocial = [...byAccount.entries()]
    .filter(([account]) => !following.has(account))
    .map(([account, interactions]) => ({ account, interactions }))
    .sort((a, b) => b.interactions - a.interactions);

  const followerRatio = following.size === 0 ? 0 : followers.size / following.size;
  const leaning: InfluenceLeaning =
    followerRatio >= 1.5 ? 'creator' : followerRatio <= 0.67 ? 'consumer' : 'balanced';

  let mutualAttention = 0;
  let followedAttention = 0;
  for (const [account, count] of byAccount) {
    const isFollowed = following.has(account);
    if (isFollowed) followedAttention += count;
    if (isFollowed && followers.has(account)) mutualAttention += count;
  }

  const byHour = new Array(24).fill(0);
  const byWeekday = new Array(7).fill(0);
  const yearCounts = new Map<number, number>();
  const yearAccounts = new Map<number, Map<string, number>>();
  const kindCounts = new Map<InteractionKind, number>();
  const stamps: number[] = [];
  for (const i of data.interactions) {
    kindCounts.set(i.kind, (kindCounts.get(i.kind) ?? 0) + 1);
    if (!i.timestamp) continue;
    stamps.push(i.timestamp);
    const d = new Date(i.timestamp * 1000);
    byHour[d.getUTCHours()]++;
    byWeekday[d.getUTCDay()]++;
    const y = d.getUTCFullYear();
    yearCounts.set(y, (yearCounts.get(y) ?? 0) + 1);
    let ya = yearAccounts.get(y);
    if (!ya) {
      ya = new Map();
      yearAccounts.set(y, ya);
    }
    ya.set(i.account, (ya.get(i.account) ?? 0) + 1);
  }
  const byKind = [...kindCounts.entries()]
    .map(([kind, count]) => ({ kind, count }))
    .sort((a, b) => b.count - a.count);
  const byYear = [...yearCounts.entries()]
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);

  // Infection: concentration + parasocial pull (higher = more captured by a few others).
  const counts = [...byAccount.values()];
  const concentration = topNShare(counts, 10);
  const topThree = topNShare(counts, 3);
  const parasocialShare =
    total === 0 ? 0 : parasocial.reduce((s, p) => s + p.interactions, 0) / total;
  const infectionIndex = Math.round(
    100 * (0.45 * concentration + 0.35 * topThree + 0.2 * parasocialShare),
  );
  const infectionBand: InfectionBand =
    infectionIndex >= 66 ? 'high' : infectionIndex >= 33 ? 'medium' : 'low';

  const concentrationByYear = [...yearAccounts.entries()]
    .map(([year, m]) => {
      const c = [...m.values()];
      return { year, count: c.reduce((a, b) => a + b, 0), top3Share: topNShare(c, 3) };
    })
    .filter((x) => x.count >= 10)
    .sort((a, b) => a.year - b.year);
  let trend: Trend = 'flat';
  if (concentrationByYear.length >= 2) {
    const first = concentrationByYear[0].top3Share;
    const last = concentrationByYear[concentrationByYear.length - 1].top3Share;
    trend = last > first + 0.05 ? 'rising' : last < first - 0.05 ? 'falling' : 'flat';
  }
  const busiestHour = byHour.indexOf(Math.max(...byHour));
  const firstTs = stamps.length ? Math.min(...stamps) : 0;
  const lastTs = stamps.length ? Math.max(...stamps) : 0;
  const spanDays = stamps.length > 1 ? Math.round((lastTs - firstTs) / 86400) : 0;

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
    byKind,
    byYear,
    byWeekday,
    infection: {
      index: infectionIndex,
      band: infectionBand,
      concentration,
      topThree,
      parasocialShare,
    },
    concentrationByYear,
    trend,
    temporal: {
      byHour,
      busiestHour: busiestHour < 0 ? 0 : busiestHour,
      spanDays,
      dated: stamps.length,
      firstTs,
      lastTs,
    },
  };
}
