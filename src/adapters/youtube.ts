import type JSZip from 'jszip'
import type { Interaction, NormalizedData } from '../schema'

/**
 * YouTube (Google Takeout). Folder and file names are localized to the account's
 * language, so everything is located by STRUCTURE, never by path. Watch history
 * attributes a channel per video (`subtitles[0]`), and subscriptions are the follows;
 * comments / liked videos carry only a video id, so they are not attributable here.
 */

interface WatchEntry {
  header?: string
  titleUrl?: string
  subtitles?: Array<{ name?: string; url?: string }>
  time?: string
}

/** Extract a channel id (UC…) from a /channel/ URL. */
function channelId(url: string | undefined): string | null {
  const m = url?.match(/\/channel\/(UC[\w-]+)/)
  return m ? m[1] : null
}

/**
 * How many entries attribute a channel (`subtitles[].url` → /channel/). Search history
 * and watch history both carry `header` + `watch?v=` titleUrls, so channel attribution
 * is what tells them apart — only the watch history has it in bulk.
 */
function channelAttributedCount(json: unknown): number {
  if (!Array.isArray(json)) return 0
  let n = 0
  for (const e of json) {
    if (e && typeof e === 'object' && channelId((e as WatchEntry).subtitles?.[0]?.url)) n++
  }
  return n
}

async function readJsonArray(file: JSZip.JSZipObject): Promise<unknown> {
  try {
    return JSON.parse(await file.async('string'))
  } catch {
    return null
  }
}

/** Minimal RFC-4180-ish CSV row parser: handles quoted fields and embedded commas. */
function parseCsvRow(line: string): string[] {
  const out: string[] = []
  let field = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (quoted) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          field += '"'
          i++
        } else quoted = false
      } else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') {
      out.push(field)
      field = ''
    } else field += c
  }
  out.push(field)
  return out
}

const isYouTubePath = (p: string) => /(^|\/)YouTube[^/]*\//i.test(p) || /\/Takeout\//i.test(p)

/**
 * Find the watch-history JSON by content, not by its (localized) name: among all
 * YouTube JSON arrays, pick the one with the most channel-attributed entries.
 */
async function findWatchHistory(zip: JSZip): Promise<WatchEntry[] | null> {
  let best: WatchEntry[] | null = null
  let bestScore = 0
  for (const path of Object.keys(zip.files)) {
    if (!path.toLowerCase().endsWith('.json') || !isYouTubePath(path)) continue
    const json = await readJsonArray(zip.files[path])
    const score = channelAttributedCount(json)
    if (score > bestScore) {
      bestScore = score
      best = json as WatchEntry[]
    }
  }
  return best
}

/** Find the subscriptions CSV by structure: a row whose 2nd column is a /channel/ URL. */
async function findSubscriptions(zip: JSZip): Promise<Array<[string, string]>> {
  for (const path of Object.keys(zip.files)) {
    if (!path.toLowerCase().endsWith('.csv') || !isYouTubePath(path)) continue
    const text = await zip.files[path].async('string')
    const rows = text.split(/\r?\n/).filter((l) => l.trim()).map(parseCsvRow)
    const dataRows = rows.slice(1) // drop the (localized) header
    if (!dataRows.some((r) => channelId(r[1]))) continue
    // [channel id, channel title]
    return dataRows.filter((r) => channelId(r[1])).map((r) => [channelId(r[1])!, (r[2] ?? '').trim()])
  }
  return []
}

export const youtubeAdapter = {
  id: 'youtube',
  label: 'YouTube',

  // A YouTube Takeout always has a "YouTube …" folder (localized suffix, stable prefix).
  detect(zip: JSZip): boolean {
    return Object.keys(zip.files).some((p) => /(^|\/)YouTube[^/]*\//i.test(p))
  },

  async parse(zip: JSZip): Promise<NormalizedData> {
    const history = (await findWatchHistory(zip)) ?? []

    const interactions: Interaction[] = []
    let unattributed = 0
    const idToName = new Map<string, string>()

    for (const entry of history) {
      const sub = entry.subtitles?.[0]
      const account = sub?.name
      if (!account) {
        unattributed++
        continue
      }
      const id = channelId(sub?.url)
      if (id && !idToName.has(id)) idToName.set(id, account)
      const ts = entry.time ? Math.floor(Date.parse(entry.time) / 1000) : 0
      interactions.push({ account, kind: 'watch', timestamp: Number.isNaN(ts) ? 0 : ts })
    }

    // Subscriptions → follows, reconciled to the watch-history name when the id is known
    // (survives channel renames so follow-vs-engage stays accurate).
    const follows = new Set<string>()
    for (const [id, title] of await findSubscriptions(zip)) {
      follows.add(idToName.get(id) ?? title)
    }

    return { interactions, follows, unattributed }
  },
}
