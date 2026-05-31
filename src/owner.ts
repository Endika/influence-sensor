import type { NormalizedData } from './schema'

/**
 * Instagram names the export file `instagram-<username>-<YYYY>-<MM>-<DD>-<hash>.zip`.
 * The username is the account owner — we use it to exclude self-interactions.
 */
export function ownerFromFilename(filename: string): string | null {
  const match = filename.match(/^instagram-(.+?)-\d{4}-\d{2}-\d{2}-/i)
  return match ? match[1] : null
}

/**
 * Drop the account owner from their own data: commenting on or liking your own
 * content is not "being influenced by yourself". Comparison is case-insensitive.
 */
export function excludeSelf(data: NormalizedData, self: string | null): NormalizedData {
  if (!self) return data
  const key = self.toLowerCase()
  const without = (set: Set<string> | undefined) =>
    set ? new Set([...set].filter((a) => a.toLowerCase() !== key)) : undefined
  return {
    interactions: data.interactions.filter((i) => i.account.toLowerCase() !== key),
    follows: without(data.follows)!,
    followers: without(data.followers),
    closeFriends: without(data.closeFriends),
    unattributed: data.unattributed,
  }
}
