import type JSZip from 'jszip'
import type { Interaction, InteractionKind, NormalizedData } from '../schema'

// First path segments in an instagram.com URL that are NOT usernames.
const NON_USERNAME_SEGMENTS = new Set([
  'p',
  'reel',
  'reels',
  'tv',
  'explore',
  's',
  'stories',
  'share',
  'accounts',
])

/**
 * Instagram's newer export often carries the target account only inside a URL.
 * Story likes expose the author (`/stories/<user>/`); post permalinks
 * (`/reel/<code>/`, `/p/<code>/`) do NOT, so those are unrecoverable.
 */
export function usernameFromUrl(url: string | undefined | null): string | null {
  if (!url) return null
  const story = url.match(/instagram\.com\/stories\/([^/?#]+)/i)
  if (story) return decodeURIComponent(story[1])
  const profile = url.match(/instagram\.com\/([^/?#]+)\/?/i)
  if (profile && !NON_USERNAME_SEGMENTS.has(profile[1].toLowerCase())) {
    return decodeURIComponent(profile[1])
  }
  return null
}

/** Instagram wraps the payload array under an unpredictable top-level key (or none). */
function firstArray(json: unknown): any[] {
  if (Array.isArray(json)) return json
  for (const value of Object.values((json ?? {}) as Record<string, unknown>)) {
    if (Array.isArray(value)) return value
  }
  return []
}

/** Resolve the target account of an interaction entry across old and new formats. */
export function accountOf(entry: any): string | null {
  if (!entry || typeof entry !== 'object') return null
  // Old format: the username sits directly in `title` (likes, liked comments).
  if (typeof entry.title === 'string' && entry.title) return entry.title
  // New format: the username is only recoverable from a profile/story URL.
  for (const lv of entry.label_values ?? []) {
    const account = usernameFromUrl(lv?.value || lv?.href)
    if (account) return account
  }
  // Comments: the media owner is the account you engaged with.
  const owner = entry.string_map_data?.['Media Owner']?.value
  if (owner) return owner
  // Very old format: username in string_list_data[].value.
  const legacy = entry.string_list_data?.[0]?.value
  if (legacy) return legacy
  return null
}

function timestampOf(entry: any): number {
  return (
    entry?.timestamp ??
    entry?.string_list_data?.[0]?.timestamp ??
    entry?.string_map_data?.['Time']?.timestamp ??
    0
  )
}

/**
 * Turn a likes/saved/comments section into interactions, counting entries whose
 * target account the export does not expose.
 */
export function entriesToInteractions(
  json: unknown,
  kind: InteractionKind,
): { interactions: Interaction[]; unattributed: number } {
  const interactions: Interaction[] = []
  let unattributed = 0
  for (const entry of firstArray(json)) {
    const account = accountOf(entry)
    if (account) interactions.push({ account, kind, timestamp: timestampOf(entry) })
    else unattributed++
  }
  return { interactions, unattributed }
}

/** Following list: username is in `title` (new) or string_list_data[].value (old). */
export function extractFollows(json: unknown): Set<string> {
  const follows = new Set<string>()
  for (const entry of firstArray(json)) {
    const account = entry?.title || entry?.string_list_data?.[0]?.value
    if (account) follows.add(account)
  }
  return follows
}

async function readJson(file: JSZip.JSZipObject | null): Promise<unknown | null> {
  if (!file) return null
  try {
    return JSON.parse(await file.async('string'))
  } catch {
    return null
  }
}

// Which export file (by path) maps to which interaction kind.
const SECTION_KINDS: Array<{ match: (path: string) => boolean; kind: InteractionKind }> = [
  { match: (p) => p.endsWith('liked_posts.json'), kind: 'like_post' },
  { match: (p) => p.endsWith('liked_comments.json'), kind: 'like_comment' },
  { match: (p) => p.endsWith('story_likes.json'), kind: 'story_like' },
  { match: (p) => p.endsWith('saved_posts.json'), kind: 'saved' },
  { match: (p) => p.includes('/comments/') && /post_comments.*\.json$/.test(p), kind: 'comment' },
]

export const instagramAdapter = {
  id: 'instagram',
  label: 'Instagram',

  detect(zip: JSZip): boolean {
    return Object.keys(zip.files).some(
      (p) =>
        p.endsWith('liked_posts.json') ||
        p.includes('your_instagram_activity/') ||
        p.includes('followers_and_following/'),
    )
  },

  async parse(zip: JSZip): Promise<NormalizedData> {
    const interactions: Interaction[] = []
    let unattributed = 0

    for (const path of Object.keys(zip.files)) {
      const section = SECTION_KINDS.find((s) => s.match(path))
      if (!section) continue
      const json = await readJson(zip.files[path])
      if (!json) continue
      const res = entriesToInteractions(json, section.kind)
      interactions.push(...res.interactions)
      unattributed += res.unattributed
    }

    let follows = new Set<string>()
    for (const path of Object.keys(zip.files)) {
      if (path.endsWith('following.json')) {
        const json = await readJson(zip.files[path])
        if (json) follows = extractFollows(json)
        break
      }
    }

    return { interactions, follows, unattributed }
  },
}
