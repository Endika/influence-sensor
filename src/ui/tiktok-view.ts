import type { TikTokSummary } from '../adapters/tiktok'
import { getLocale, t } from '../i18n'
import { renderHourHistogram, renderVenn, renderWeekday, renderYearArea } from './insight-charts'

function section(title: string, caption: string): HTMLElement {
  const wrap = document.createElement('section')
  const h = document.createElement('h2')
  h.textContent = title
  const p = document.createElement('p')
  p.className = 'caption'
  p.textContent = caption
  wrap.append(h, p)
  return wrap
}

function notice(text: string, kind: 'warn' | 'info'): HTMLElement {
  const p = document.createElement('p')
  p.className = `notice notice-${kind}`
  p.textContent = text
  return p
}

const weekdayLabels = (): string[] =>
  Array.from({ length: 7 }, (_, d) =>
    new Date(Date.UTC(2023, 0, 1 + d)).toLocaleDateString(getLocale(), { weekday: 'short' }),
  )

export function renderTikTokReport(root: HTMLElement, s: TikTokSummary): void {
  root.innerHTML = ''
  const a = s.activity

  if (a.firstTs) {
    const fmt = (ts: number) =>
      new Date(ts * 1000).toLocaleDateString(getLocale(), { year: 'numeric', month: 'short' })
    const years = ((a.lastTs - a.firstTs) / 86400 / 365).toFixed(1)
    const banner = document.createElement('p')
    banner.className = 'coverage'
    banner.textContent = t('coverage', { from: fmt(a.firstTs), to: fmt(a.lastTs), years })
    root.appendChild(banner)
  }

  root.appendChild(notice(t('tk.notice'), 'warn'))
  root.appendChild(
    notice(t('tk.hidden', { watched: a.total ? s.hidden.watched : 0, likes: s.hidden.likes, comments: s.hidden.comments }), 'info'),
  )

  const rel = section(
    t('tk.relTitle'),
    t('tk.relCaption', {
      following: s.following.size,
      followers: s.followers.size,
      mutual: s.mutual,
      blocked: s.blocked.size,
    }),
  )
  const grid = document.createElement('div')
  grid.className = 'statgrid'
  const stat = (n: number, label: string) => {
    const d = document.createElement('div')
    d.className = 'stat'
    d.innerHTML = `<span class="stat-n">${n}</span><span class="stat-l">${label}</span>`
    return d
  }
  grid.append(
    stat(s.following.size, t('stat.following')),
    stat(s.followers.size, t('stat.followers')),
    stat(s.mutual, t('stat.mutual')),
  )
  rel.appendChild(grid)
  renderVenn(rel, s.following.size, s.followers.size, s.mutual, {
    following: t('stat.following'),
    followers: t('stat.followers'),
    mutual: t('stat.mutual'),
  })
  root.appendChild(rel)

  if (a.total > 0) {
    const act = section(t('tk.activityTitle'), t('tk.activityCaption'))
    if (a.byYear.length > 1) renderYearArea(act, a.byYear)
    root.appendChild(act)

    const wd = section(t('weekday.title'), t('weekday.caption'))
    renderWeekday(wd, a.byWeekday, weekdayLabels())
    root.appendChild(wd)

    const busiest = a.byHour.indexOf(Math.max(...a.byHour))
    const when = section(
      t('when.title'),
      t('when.caption', { hour: busiest < 0 ? 0 : busiest, days: Math.round((a.lastTs - a.firstTs) / 86400) }),
    )
    renderHourHistogram(when, a.byHour)
    root.appendChild(when)
  }
}
