import JSZip from 'jszip'
import { describe, expect, it } from 'vitest'
import { detectTikTok, parseTikTok } from '../../src/adapters/tiktok'

const sample = {
  'Profile And Settings': {
    Following: { Following: [{ Date: '2026-01-01 10:00:00', UserName: 'a' }, { UserName: 'b' }] },
    Follower: { FansList: [{ UserName: 'a' }, { UserName: 'c' }] },
    'Block List': { BlockList: [{ UserName: 'x' }] },
  },
  'Likes and Favorites': {
    'Like List': { ItemFavoriteList: [{ date: '2025-05-20 17:46:57', link: 'https://www.tiktokv.com/share/video/1/' }] },
    'Favorite Videos': { FavoriteVideoList: [] },
  },
  Comment: { Comments: { CommentsList: [{ date: '2025-05-21 10:00:00', comment: 'hi' }] } },
  'Your Activity': { 'Watch History': { VideoList: [{ Date: '2025-05-22 12:00:00', Link: 'x' }] } },
}

async function zipOf(obj: unknown): Promise<JSZip> {
  const zip = new JSZip()
  zip.file('user_data_tiktok.json', JSON.stringify(obj))
  return zip
}

describe('tiktok adapter', () => {
  it('detects a TikTok export', async () => {
    expect(detectTikTok(await zipOf(sample))).toBe(true)
    const other = new JSZip()
    other.file('whatever.json', '{}')
    expect(detectTikTok(other)).toBe(false)
  })

  it('parses relationships and activity volume', async () => {
    const s = await parseTikTok(await zipOf(sample))
    expect(s.following).toEqual(new Set(['a', 'b']))
    expect(s.followers).toEqual(new Set(['a', 'c']))
    expect(s.mutual).toBe(1)
    expect(s.blocked).toEqual(new Set(['x']))
    expect(s.hidden).toEqual({ watched: 1, likes: 1, comments: 1, favorites: 0 })
    expect(s.activity.total).toBe(3)
    expect(s.activity.byYear).toEqual([{ year: 2025, count: 3 }])
  })
})
