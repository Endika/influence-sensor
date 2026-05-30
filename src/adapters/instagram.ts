import type { Interaction, InteractionKind } from '../schema'

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
