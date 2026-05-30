export type InteractionKind = 'like_post' | 'like_comment' | 'comment' | 'saved' | 'story_like'

/** A single outbound action by the user toward another account. */
export interface Interaction {
  account: string
  kind: InteractionKind
  timestamp: number // unix seconds, 0 if unknown
}

/** The platform-agnostic shape every adapter must produce. */
export interface NormalizedData {
  interactions: Interaction[]
  follows: Set<string>
  /** Entries that record an interaction but whose target account the export omits
   *  (e.g. Instagram's newer liked_posts no longer names the post author). */
  unattributed?: number
}
