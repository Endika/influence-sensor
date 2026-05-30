import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { extractFollows, extractInteractions } from '../../src/adapters/instagram'

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
