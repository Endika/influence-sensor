import type JSZip from 'jszip'

/**
 * TikTok's data export hides the creator behind every like / comment / watched
 * video (each entry is only an anonymous video link), so per-account attention
 * analysis is impossible. Only relationships and activity volume are recoverable.
 */
export interface TikTokSummary {
  following: Set<string>
  followers: Set<string>
  mutual: number
  blocked: Set<string>
  hidden: { watched: number; likes: number; comments: number; favorites: number }
  activity: {
    total: number
    byYear: Array<{ year: number; count: number }>
    byWeekday: number[] // index 0 = Sunday
    byHour: number[]
    firstTs: number
    lastTs: number
  }
}

const TIKTOK_FILE = 'user_data_tiktok.json'

function findFile(zip: JSZip): JSZip.JSZipObject | null {
  for (const path of Object.keys(zip.files)) {
    if (path.endsWith(TIKTOK_FILE)) return zip.files[path]
  }
  return null
}

/** A TikTok export is a single user_data_tiktok.json. */
export function detectTikTok(zip: JSZip): boolean {
  return findFile(zip) !== null
}

function arr(obj: any, ...path: string[]): any[] {
  let cur = obj
  for (const p of path) cur = cur?.[p]
  return Array.isArray(cur) ? cur : []
}

/** Parse "YYYY-MM-DD HH:MM:SS" (UTC) into unix seconds; 0 if unparseable. */
function parseDate(s: unknown): number {
  if (typeof s !== 'string') return 0
  const t = Date.parse(s.replace(' ', 'T') + 'Z')
  return Number.isNaN(t) ? 0 : Math.floor(t / 1000)
}

function usernames(entries: any[]): Set<string> {
  const set = new Set<string>()
  for (const e of entries) if (e?.UserName) set.add(e.UserName)
  return set
}

export async function parseTikTok(zip: JSZip): Promise<TikTokSummary> {
  const file = findFile(zip)
  const json = file ? JSON.parse(await file.async('string')) : {}

  const following = usernames(arr(json, 'Profile And Settings', 'Following', 'Following'))
  const followers = usernames(arr(json, 'Profile And Settings', 'Follower', 'FansList'))
  const blocked = usernames(arr(json, 'Profile And Settings', 'Block List', 'BlockList'))
  let mutual = 0
  for (const u of following) if (followers.has(u)) mutual++

  const likes = arr(json, 'Likes and Favorites', 'Like List', 'ItemFavoriteList')
  const favorites = arr(json, 'Likes and Favorites', 'Favorite Videos', 'FavoriteVideoList')
  const comments = arr(json, 'Comment', 'Comments', 'CommentsList')
  const watched = arr(json, 'Your Activity', 'Watch History', 'VideoList')

  const byYear = new Map<number, number>()
  const byWeekday = new Array(7).fill(0)
  const byHour = new Array(24).fill(0)
  let first = 0
  let last = 0
  let total = 0
  const ingest = (entries: any[], field: string) => {
    for (const e of entries) {
      const ts = parseDate(e?.[field])
      if (!ts) continue
      total++
      const d = new Date(ts * 1000)
      byYear.set(d.getUTCFullYear(), (byYear.get(d.getUTCFullYear()) ?? 0) + 1)
      byWeekday[d.getUTCDay()]++
      byHour[d.getUTCHours()]++
      if (!first || ts < first) first = ts
      if (ts > last) last = ts
    }
  }
  ingest(likes, 'date')
  ingest(favorites, 'Date')
  ingest(comments, 'date')
  ingest(watched, 'Date')

  return {
    following,
    followers,
    mutual,
    blocked,
    hidden: {
      watched: watched.length,
      likes: likes.length,
      comments: comments.length,
      favorites: favorites.length,
    },
    activity: {
      total,
      byYear: [...byYear.entries()].map(([year, count]) => ({ year, count })).sort((a, b) => a.year - b.year),
      byWeekday,
      byHour,
      firstTs: first,
      lastTs: last,
    },
  }
}
