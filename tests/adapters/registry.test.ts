import JSZip from 'jszip'
import { describe, expect, it } from 'vitest'
import { detectAdapter } from '../../src/adapters/registry'

describe('detectAdapter', () => {
  it('returns the instagram adapter for an instagram-shaped zip', () => {
    const zip = new JSZip()
    zip.file('your_instagram_activity/likes/liked_posts.json', '{}')
    expect(detectAdapter(zip)?.id).toBe('instagram')
  })

  it('returns null when no adapter matches', () => {
    const zip = new JSZip()
    zip.file('notes.txt', 'hello')
    expect(detectAdapter(zip)).toBeNull()
  })
})
