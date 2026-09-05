import type JSZip from 'jszip';
import type { Interaction, InteractionKind, NormalizedData } from '../schema';

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
]);

/**
 * Instagram's newer export often carries the target account only inside a URL.
 * Story likes expose the author (`/stories/<user>/`); post permalinks
 * (`/reel/<code>/`, `/p/<code>/`) do NOT, so those are unrecoverable.
 */
export function usernameFromUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  const story = url.match(/instagram\.com\/stories\/([^/?#]+)/i);
  if (story) return decodeURIComponent(story[1]);
  const profile = url.match(/instagram\.com\/([^/?#]+)\/?/i);
  if (profile && !NON_USERNAME_SEGMENTS.has(profile[1].toLowerCase())) {
    return decodeURIComponent(profile[1]);
  }
  return null;
}

/** Instagram wraps the payload array under an unpredictable top-level key (or none). */
function firstArray(json: unknown): unknown[] {
  if (Array.isArray(json)) return json;
  for (const value of Object.values((json ?? {}) as Record<string, unknown>)) {
    if (Array.isArray(value)) return value;
  }
  return [];
}

// label_values labels (localized) that hold a username directly.
const USERNAME_LABELS = new Set(['Nombre de usuario', 'Username']);

/** The union of the loose entry shapes Instagram uses across its export sections. */
interface ExportEntry {
  title?: string;
  timestamp?: number;
  string_map_data?: Record<string, { value?: string; timestamp?: number } | undefined>;
  string_list_data?: Array<{ value?: string; timestamp?: number } | undefined>;
  label_values?: Array<{ label?: string; value?: string; href?: string } | undefined>;
}

/** Resolve the target account of an interaction entry across old and new formats. */
export function accountOf(entry: unknown): string | null {
  if (!entry || typeof entry !== 'object') return null;
  const e = entry as ExportEntry;
  // Old format: the username sits directly in `title` (likes, liked comments).
  if (typeof e.title === 'string' && e.title) return e.title;
  // Comments: the media owner is the account you engaged with.
  const owner = e.string_map_data?.['Media Owner']?.value;
  if (owner) return owner;
  for (const lv of e.label_values ?? []) {
    // Some sections (close friends) carry the username under a labelled field.
    if (lv?.value && lv.label && USERNAME_LABELS.has(lv.label)) return lv.value;
    // Otherwise the username is only recoverable from a profile/story URL.
    const account = usernameFromUrl(lv?.value || lv?.href);
    if (account) return account;
  }
  // Very old format: username in string_list_data[].value.
  const legacy = e.string_list_data?.[0]?.value;
  if (legacy) return legacy;
  return null;
}

function timestampOf(entry: unknown): number {
  const e = (entry ?? {}) as ExportEntry;
  return (
    e.timestamp ?? e.string_list_data?.[0]?.timestamp ?? e.string_map_data?.Time?.timestamp ?? 0
  );
}

/**
 * Turn a likes/saved/comments section into interactions, counting entries whose
 * target account the export does not expose.
 */
export function entriesToInteractions(
  json: unknown,
  kind: InteractionKind,
): { interactions: Interaction[]; unattributed: number } {
  const interactions: Interaction[] = [];
  let unattributed = 0;
  for (const entry of firstArray(json)) {
    const account = accountOf(entry);
    if (account) interactions.push({ account, kind, timestamp: timestampOf(entry) });
    else unattributed++;
  }
  return { interactions, unattributed };
}

/** Collect a set of accounts from a relationship section (following, followers, close friends). */
export function extractAccountSet(json: unknown): Set<string> {
  const set = new Set<string>();
  for (const entry of firstArray(json)) {
    const account = accountOf(entry);
    if (account) set.add(account);
  }
  return set;
}

/** Following list. Kept as a named export for clarity; same logic as a generic set. */
export const extractFollows = extractAccountSet;

async function readJson(file: JSZip.JSZipObject | null): Promise<unknown | null> {
  if (!file) return null;
  try {
    return JSON.parse(await file.async('string'));
  } catch {
    return null;
  }
}

// Which export file (by path) maps to which interaction kind. Sections not listed
// here (stories_viewed, quizzes, questions) carry no recoverable account and are skipped.
const SECTION_KINDS: Array<{ match: (path: string) => boolean; kind: InteractionKind }> = [
  { match: (p) => p.endsWith('liked_posts.json'), kind: 'like_post' },
  { match: (p) => p.endsWith('liked_comments.json'), kind: 'like_comment' },
  { match: (p) => p.endsWith('story_likes.json'), kind: 'story_like' },
  { match: (p) => p.endsWith('polls.json'), kind: 'story_poll' },
  { match: (p) => p.endsWith('emoji_sliders.json'), kind: 'story_slider' },
  { match: (p) => p.endsWith('story_reaction_sticker_reactions.json'), kind: 'story_reaction' },
  { match: (p) => p.endsWith('avatar_story_reactions.json'), kind: 'story_reaction' },
  { match: (p) => p.endsWith('saved_posts.json'), kind: 'saved' },
  {
    match: (p) => p.includes('/comments/') && /(post_comments|reels_comments).*\.json$/.test(p),
    kind: 'comment',
  },
];

/** Aggregate the accounts from every file whose path matches `pred` (e.g. followers_1, followers_2). */
async function readAccountSet(zip: JSZip, pred: (path: string) => boolean): Promise<Set<string>> {
  const set = new Set<string>();
  for (const path of Object.keys(zip.files)) {
    if (!pred(path)) continue;
    const json = await readJson(zip.files[path]);
    if (json) for (const account of extractAccountSet(json)) set.add(account);
  }
  return set;
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
    );
  },

  async parse(zip: JSZip): Promise<NormalizedData> {
    const interactions: Interaction[] = [];
    let unattributed = 0;

    for (const path of Object.keys(zip.files)) {
      const section = SECTION_KINDS.find((s) => s.match(path));
      if (!section) continue;
      const json = await readJson(zip.files[path]);
      if (!json) continue;
      const res = entriesToInteractions(json, section.kind);
      interactions.push(...res.interactions);
      unattributed += res.unattributed;
    }

    const follows = await readAccountSet(zip, (p) => p.endsWith('following.json'));
    const followers = await readAccountSet(zip, (p) => /(^|\/)followers(_\d+)?\.json$/.test(p));
    const closeFriends = await readAccountSet(zip, (p) => p.endsWith('close_friends.json'));

    return { interactions, follows, followers, closeFriends, unattributed };
  },
};
