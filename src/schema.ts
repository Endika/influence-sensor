export type InteractionKind =
  | 'like_post'
  | 'like_comment'
  | 'comment'
  | 'saved'
  | 'story_like'
  | 'story_poll'
  | 'story_slider'
  | 'story_reaction'
  | 'watch';

/** A single outbound action by the user toward another account. */
export interface Interaction {
  account: string;
  kind: InteractionKind;
  timestamp: number; // unix seconds, 0 if unknown
}

/** The platform-agnostic shape every adapter must produce. */
export interface NormalizedData {
  interactions: Interaction[];
  /** Accounts the user follows. */
  follows: Set<string>;
  /** Accounts that follow the user (when the export includes it). */
  followers?: Set<string>;
  /** The user's "close friends" list (when present). */
  closeFriends?: Set<string>;
  /** Entries that record an interaction but whose target account the export omits
   *  (e.g. Instagram's newer liked_posts no longer names the post author). */
  unattributed?: number;
}
