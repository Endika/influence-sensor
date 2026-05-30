export type InteractionKind = 'like_post' | 'like_comment' | 'comment' | 'saved'

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
}
