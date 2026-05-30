import type JSZip from 'jszip'
import type { Interaction, InteractionKind, NormalizedData } from '../schema'

/** Instagram wraps the payload array under an unpredictable top-level key. */
function firstArray(json: unknown): any[] {
  if (Array.isArray(json)) return json
  for (const value of Object.values((json ?? {}) as Record<string, unknown>)) {
    if (Array.isArray(value)) return value
  }
  return []
}

function timestampOf(entry: any): number {
  return entry?.string_list_data?.[0]?.timestamp ?? 0
}

/**
 * Build interactions from a likes/saved section.
 * `accountField` is where the username lives: `title` for likes/saved.
 */
export function extractInteractions(
  json: unknown,
  accountField: 'title' | 'value',
  kind: InteractionKind,
): Interaction[] {
  const out: Interaction[] = []
  for (const entry of firstArray(json)) {
    const account =
      accountField === 'title' ? entry?.title : entry?.string_list_data?.[0]?.value
    if (!account) continue
    out.push({ account, kind, timestamp: timestampOf(entry) })
  }
  return out
}

/** Build the follow set from following.json (username is in string_list_data[].value). */
export function extractFollows(json: unknown): Set<string> {
  const follows = new Set<string>()
  for (const entry of firstArray(json)) {
    const account = entry?.string_list_data?.[0]?.value
    if (account) follows.add(account)
  }
  return follows
}

/** Find the first file whose path ends with `suffix` (handles nested/old layouts). */
function findFile(zip: JSZip, suffix: string): JSZip.JSZipObject | null {
  for (const path of Object.keys(zip.files)) {
    if (path.endsWith(suffix)) return zip.files[path]
  }
  return null
}

async function readJson(file: JSZip.JSZipObject | null): Promise<unknown | null> {
  if (!file) return null
  try {
    return JSON.parse(await file.async('string'))
  } catch {
    return null
  }
}

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

    const likedPosts = await readJson(findFile(zip, 'liked_posts.json'))
    if (likedPosts) interactions.push(...extractInteractions(likedPosts, 'title', 'like_post'))

    const likedComments = await readJson(findFile(zip, 'liked_comments.json'))
    if (likedComments) interactions.push(...extractInteractions(likedComments, 'title', 'like_comment'))

    const saved = await readJson(findFile(zip, 'saved_posts.json'))
    if (saved) interactions.push(...extractInteractions(saved, 'title', 'saved'))

    const followingJson = await readJson(findFile(zip, 'following.json'))
    const follows = followingJson ? extractFollows(followingJson) : new Set<string>()

    return { interactions, follows }
  },
}
