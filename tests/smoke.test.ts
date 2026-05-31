// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { setLocale, LOCALES } from '../src/i18n'
import { analyze } from '../src/report-model'
import { renderReport } from '../src/ui/view'
import type { Interaction, NormalizedData } from '../src/schema'

const mk = (a: string, n: number, kind: Interaction['kind'] = 'story_like'): Interaction[] =>
  Array.from({ length: n }, () => ({ account: a, kind, timestamp: 1700000000 }))

const data: NormalizedData = {
  interactions: [...mk('mutualA', 12), ...mk('creatorB', 8), ...mk('strangerC', 5), ...mk('d', 3)],
  follows: new Set(['mutualA', 'creatorB', 'dead1', 'dead2']),
  followers: new Set(['mutualA', 'fan1', 'fan2']),
  closeFriends: new Set(['mutualA', 'closeX']),
  unattributed: 100,
}

describe('renderReport smoke', () => {
  it('renders all sections in every locale without throwing', () => {
    const report = analyze(data)
    for (const { code } of LOCALES) {
      setLocale(code)
      const root = document.createElement('div')
      renderReport(root, report)
      const sections = root.querySelectorAll('section').length
      expect(sections).toBeGreaterThanOrEqual(8)
      expect(root.querySelector('.gauge')).not.toBeNull()
      expect(root.textContent).toContain('mutualA')
    }
    setLocale('en')
  })
})

import { renderTikTokReport } from '../src/ui/tiktok-view'
import type { TikTokSummary } from '../src/adapters/tiktok'

describe('renderTikTokReport smoke', () => {
  it('renders the limited TikTok report in every locale', () => {
    const s: TikTokSummary = {
      following: new Set(['a', 'b']),
      followers: new Set(['a']),
      mutual: 1,
      blocked: new Set(['x']),
      hidden: { watched: 10, likes: 3, comments: 2, favorites: 1 },
      activity: { total: 5, byYear: [{ year: 2024, count: 2 }, { year: 2025, count: 3 }], byWeekday: new Array(7).fill(1), byHour: new Array(24).fill(1), firstTs: 1700000000, lastTs: 1730000000 },
    }
    for (const { code } of LOCALES) {
      setLocale(code)
      const root = document.createElement('div')
      renderTikTokReport(root, s)
      expect(root.querySelectorAll('section').length).toBeGreaterThanOrEqual(2)
      expect(root.querySelector('.notice-warn')).not.toBeNull()
    }
    setLocale('en')
  })
})
