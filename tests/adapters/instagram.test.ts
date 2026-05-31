import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import JSZip from 'jszip'
import { describe, expect, it } from 'vitest'
import {
  accountOf,
  entriesToInteractions,
  extractAccountSet,
  extractFollows,
  instagramAdapter,
  usernameFromUrl,
} from '../../src/adapters/instagram'

const fixturesDir = join(__dirname, '../fixtures/instagram')
const fix = (name: string) => JSON.parse(readFileSync(join(fixturesDir, name), 'utf8'))

describe('usernameFromUrl', () => {
  it('extracts the author from a story URL', () => {
    expect(usernameFromUrl('https://www.instagram.com/stories/ruben.mnzr/123')).toBe('ruben.mnzr')
  })
  it('returns null for a post permalink (no author in the URL)', () => {
    expect(usernameFromUrl('https://www.instagram.com/reel/ABC123/')).toBeNull()
    expect(usernameFromUrl('https://www.instagram.com/p/DEF456/')).toBeNull()
  })
  it('extracts the username from a plain profile URL', () => {
    expect(usernameFromUrl('https://www.instagram.com/some_user/')).toBe('some_user')
  })
  it('returns null for empty input', () => {
    expect(usernameFromUrl('')).toBeNull()
    expect(usernameFromUrl(null)).toBeNull()
  })
})

describe('accountOf', () => {
  it('reads the title (old likes / liked comments format)', () => {
    expect(accountOf({ title: 'wildsoulwolves' })).toBe('wildsoulwolves')
  })
  it('reads a story author from label_values', () => {
    expect(
      accountOf({ label_values: [{ label: 'URL', href: 'https://www.instagram.com/stories/foo/' }] }),
    ).toBe('foo')
  })
  it('returns null for a liked post whose author the export omits', () => {
    expect(
      accountOf({ label_values: [{ label: 'URL', href: 'https://www.instagram.com/reel/X/' }] }),
    ).toBeNull()
  })
  it('reads the media owner of a comment', () => {
    expect(accountOf({ string_map_data: { 'Media Owner': { value: 'owner_x' } } })).toBe('owner_x')
  })
})

describe('extractFollows', () => {
  it('reads the following list from the new-format title field', () => {
    expect(extractFollows(fix('following.json'))).toEqual(new Set(['acc_followed', 'acc_unengaged']))
  })
  it('falls back to string_list_data value for the old format', () => {
    const oldFormat = {
      relationships_following: [
        { title: '', string_list_data: [{ value: 'legacy_user', timestamp: 1 }] },
      ],
    }
    expect(extractFollows(oldFormat)).toEqual(new Set(['legacy_user']))
  })
})

describe('entriesToInteractions', () => {
  it('attributes story likes and counts nothing as lost', () => {
    const res = entriesToInteractions(fix('story_likes.json'), 'story_like')
    expect(res.interactions.map((i) => i.account)).toEqual(['story_user', 'acc_followed'])
    expect(res.unattributed).toBe(0)
  })
  it('counts liked posts as unattributed because the author is missing', () => {
    const res = entriesToInteractions(fix('liked_posts.json'), 'like_post')
    expect(res.interactions).toHaveLength(0)
    expect(res.unattributed).toBe(2)
  })
})

async function buildZip(): Promise<JSZip> {
  const zip = new JSZip()
  const put = (path: string, file: string) =>
    zip.file(path, readFileSync(join(fixturesDir, file), 'utf8'))
  put('your_instagram_activity/likes/liked_posts.json', 'liked_posts.json')
  put('your_instagram_activity/likes/liked_comments.json', 'liked_comments.json')
  put('your_instagram_activity/story_interactions/story_likes.json', 'story_likes.json')
  put('your_instagram_activity/comments/post_comments_1.json', 'post_comments_1.json')
  put('your_instagram_activity/story_interactions/polls.json', 'polls.json')
  put('connections/followers_and_following/following.json', 'following.json')
  put('connections/followers_and_following/followers_1.json', 'followers_1.json')
  put('connections/followers_and_following/close_friends.json', 'close_friends.json')
  return zip
}

describe('instagramAdapter.detect', () => {
  it('recognizes an Instagram export by its file layout', async () => {
    expect(instagramAdapter.detect(await buildZip())).toBe(true)
  })
  it('rejects an unrelated zip', async () => {
    const zip = new JSZip()
    zip.file('random.txt', 'hello')
    expect(instagramAdapter.detect(zip)).toBe(false)
  })
})

describe('instagramAdapter.parse', () => {
  it('aggregates attributable interactions across sections and reports the rest', async () => {
    const data = await instagramAdapter.parse(await buildZip())
    // 2 story likes + 1 liked comment + 1 comment + 1 poll = 5 attributable; 2 liked posts lost.
    expect(data.interactions).toHaveLength(5)
    expect(data.unattributed).toBe(2)
    const accounts = new Set(data.interactions.map((i) => i.account))
    expect(accounts).toEqual(
      new Set(['story_user', 'acc_followed', 'comment_liker', 'comment_owner', 'poll_user']),
    )
  })

  it('parses relationships: follows, followers and close friends', async () => {
    const data = await instagramAdapter.parse(await buildZip())
    expect(data.follows).toEqual(new Set(['acc_followed', 'acc_unengaged']))
    expect(data.followers).toEqual(new Set(['follower_a', 'acc_followed']))
    expect(data.closeFriends).toEqual(new Set(['cf_user']))
  })
})

describe('extractAccountSet', () => {
  it('reads close-friends usernames from the "Nombre de usuario" label', () => {
    expect(extractAccountSet(fix('close_friends.json'))).toEqual(new Set(['cf_user']))
  })
})
