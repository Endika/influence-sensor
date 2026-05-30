import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import JSZip from 'jszip'
import { extractFollows, extractInteractions, instagramAdapter } from '../../src/adapters/instagram'

const fix = (name: string) =>
  JSON.parse(readFileSync(join(__dirname, '../fixtures/instagram', name), 'utf8'))

describe('extractInteractions', () => {
  it('reads liked posts as like_post interactions keyed by title', () => {
    const out = extractInteractions(fix('liked_posts.json'), 'title', 'like_post')
    expect(out).toHaveLength(3)
    expect(out[0]).toEqual({ account: 'big_creator', kind: 'like_post', timestamp: 1700000000 })
  })

  it('reads saved posts as saved interactions', () => {
    const out = extractInteractions(fix('saved_posts.json'), 'title', 'saved')
    expect(out).toEqual([{ account: 'small_creator', kind: 'saved', timestamp: 1700000300 }])
  })
})

describe('extractFollows', () => {
  it('reads the following list from string_list_data value', () => {
    expect(extractFollows(fix('following.json'))).toEqual(new Set(['big_creator', 'ghost']))
  })
})

async function buildZip(): Promise<JSZip> {
  const zip = new JSZip()
  zip.file('your_instagram_activity/likes/liked_posts.json', readFileSync(join(__dirname, '../fixtures/instagram/liked_posts.json'), 'utf8'))
  zip.file('connections/followers_and_following/following.json', readFileSync(join(__dirname, '../fixtures/instagram/following.json'), 'utf8'))
  zip.file('your_instagram_activity/saved/saved_posts.json', readFileSync(join(__dirname, '../fixtures/instagram/saved_posts.json'), 'utf8'))
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
  it('produces normalized data from the export', async () => {
    const data = await instagramAdapter.parse(await buildZip())
    expect(data.interactions).toHaveLength(4) // 3 likes + 1 saved
    expect(data.follows).toEqual(new Set(['big_creator', 'ghost']))
    const accounts = data.interactions.map((i) => i.account)
    expect(accounts.filter((a) => a === 'big_creator')).toHaveLength(2)
  })
})
