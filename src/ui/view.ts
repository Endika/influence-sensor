import type { Report } from '../report-model'
import { renderLorenz, renderTopBars } from './charts'
import { renderGraph } from './graph'
import {
  renderHealthGauge,
  renderHourHistogram,
  renderLeaningMeter,
  renderShareBar,
} from './insight-charts'

// Below this many attributable interactions the verdict is statistically meaningless.
const MIN_RELIABLE_INTERACTIONS = 10

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

function renderInsightSections(root: HTMLElement, report: Report): void {
  const ins = report.insights

  if (ins.hasFollowerData) {
    const rel = ins.relationships
    const sec = section(
      'You vs your network',
      `${rel.followYouNotBack} follow you that you don't follow back; ` +
        `${rel.youFollowNotBack} you follow don't follow you back. Only ${rel.mutual} are mutual.`,
    )
    const grid = document.createElement('div')
    grid.className = 'statgrid'
    const stat = (n: number, label: string) => {
      const d = document.createElement('div')
      d.className = 'stat'
      d.innerHTML = `<span class="stat-n">${n}</span><span class="stat-l">${label}</span>`
      return d
    }
    grid.append(stat(rel.following, 'following'), stat(rel.followers, 'followers'), stat(rel.mutual, 'mutual'))
    sec.appendChild(grid)
    const ml = document.createElement('p')
    ml.className = 'caption'
    ml.textContent =
      `Consumer ↔ Creator — a rough proxy from your follower/following ratio (${ins.influence.followerRatio.toFixed(2)}, ${ins.influence.leaning}). ` +
      'The export cannot measure your real influence on others.'
    sec.appendChild(ml)
    renderLeaningMeter(sec, ins.influence.followerRatio, {
      consumer: 'Consumer (you absorb)',
      creator: 'Creator (others absorb you)',
    })
    root.appendChild(sec)
  }

  const bubble = section(
    'Your bubble',
    'How much of your attention stays inside your own circle. High = an echo chamber of accounts you already follow; low = you look outward.',
  )
  renderShareBar(bubble, ins.bubble.followedAttentionShare, 'Attention to accounts you follow', '#e0245e')
  renderShareBar(bubble, ins.bubble.mutualAttentionShare, 'Attention to mutuals (inner circle)', '#f4a259')
  root.appendChild(bubble)

  if (report.totalFollows > 0) {
    const dead = section(
      'Dead follows',
      "Accounts you follow but give zero attention to. A high share means your following list is mostly noise you've tuned out.",
    )
    renderShareBar(
      dead,
      ins.deadFollowsPct,
      `${ins.deadFollowsCount} of ${report.totalFollows} you follow get none of your attention`,
      '#888',
    )
    root.appendChild(dead)
  }

  if (ins.temporal.dated > 0) {
    const t = section(
      'When you get hooked',
      `Your activity by hour (UTC). Busiest around ${ins.temporal.busiestHour}:00, across ${ins.temporal.spanDays} days of history.`,
    )
    renderHourHistogram(t, ins.temporal.byHour)
    root.appendChild(t)
  }

  if (ins.hasCloseFriendsData) {
    const cf = ins.closeFriends
    const sec = section(
      'Close-friends reality check',
      `Of your ${cf.total} close friends, you actually engage with ${cf.engaged}.`,
    )
    renderShareBar(sec, cf.total ? cf.engaged / cf.total : 0, 'Close friends you actually engage with', '#38a169')
    root.appendChild(sec)
  }

  if (ins.parasocial.length) {
    const sec = section(
      'Parasocial leaks',
      "Accounts you pour attention into but don't even follow.",
    )
    const list = document.createElement('div')
    list.className = 'bars'
    for (const p of ins.parasocial.slice(0, 8)) {
      const row = document.createElement('div')
      row.className = 'leak-row'
      const a = document.createElement('span')
      a.className = 'bar-label'
      a.translate = false
      a.textContent = p.account
      const n = document.createElement('span')
      n.textContent = `${p.interactions}×`
      row.append(a, n)
      list.appendChild(row)
    }
    sec.appendChild(list)
    root.appendChild(sec)
  }
}

export function renderReport(root: HTMLElement, report: Report): void {
  root.innerHTML = ''

  // Honest guard: too little attributable data to say anything reliable.
  if (report.totalInteractions < MIN_RELIABLE_INTERACTIONS) {
    root.appendChild(
      notice(
        `Only ${report.totalInteractions} attributable interactions found — not enough for a reliable verdict. ` +
          'The numbers below are shown for transparency, but treat the score as indicative only. ' +
          'Re-export from Instagram in JSON with a wider date range and "Story interactions" included.',
        'warn',
      ),
    )
  }

  let concentrationCaveat = ''
  if (report.uniqueAccountsEngaged <= 10) {
    concentrationCaveat =
      ' (You have ≤10 engaged accounts, so top-10 concentration is naturally ~100% and the score is rough here.)'
  }

  const verdict = section(
    'Network Health',
    'A transparent heuristic. Higher = a diverse, balanced diet. Lower = a few voices own your attention. ' +
      `Diversity ${Math.round(report.health.diversity * 100)}% · Top-10 concentration ${Math.round(report.health.concentration * 100)}%.` +
      concentrationCaveat,
  )
  renderHealthGauge(verdict, report.health.score, report.health.band)
  root.appendChild(verdict)

  // Instagram's newer export strips the author from liked posts — be explicit about it.
  if (report.unattributed > 0) {
    root.appendChild(
      notice(
        `${report.unattributed} liked posts couldn't be attributed: Instagram's current export no longer ` +
          'records who authored a liked post, so those are excluded. Story likes, comments and liked comments ' +
          'still carry the account and are included.',
        'info',
      ),
    )
  }

  const headline = document.createElement('p')
  headline.className = 'headline'
  const top = report.accounts[0]
  if (top) {
    const account = document.createElement('span')
    account.translate = false // never let the browser translate a username
    account.textContent = top.account
    headline.append(
      `You follow ${report.totalFollows} accounts, but `,
      account,
      ` alone takes ${Math.round(top.share * 100)}% of your ${report.totalInteractions} logged interactions.`,
    )
    root.appendChild(headline)
  }

  const graphSec = section(
    'Your attention graph',
    'You are at the center. Each node is an account you engage with — bigger = more of your attention. ' +
      'Pink = accounts you follow and engage with (they capture you). Orange = you engage without following (attention leak). Drag nodes to explore.',
  )
  const graphHost = document.createElement('div')
  graphHost.className = 'graph-host'
  graphSec.appendChild(graphHost)
  root.appendChild(graphSec)
  renderGraph(graphHost, report)

  renderInsightSections(root, report)

  const lorenzSec = section(
    'How unevenly is your attention spread?',
    'The further the curve bows below the dotted diagonal, the more your attention concentrates in a few accounts. ' +
      `Gini ${report.gini.toFixed(2)}.`,
  )
  renderLorenz(lorenzSec, report.accounts.map((a) => a.interactions))
  root.appendChild(lorenzSec)

  const barsSec = section(
    'Where your attention goes',
    'Share of your total interactions held by your top accounts.',
  )
  renderTopBars(barsSec, report.accounts.slice(0, 15))
  root.appendChild(barsSec)

  const tableSec = section(
    'The raw data',
    'Every account you engaged with, ranked. Nothing here is hidden or modeled away.',
  )
  const table = document.createElement('table')
  table.innerHTML =
    '<thead><tr><th>#</th><th>Account</th><th>Interactions</th><th>Share</th><th>Followed?</th></tr></thead>'
  const tbody = document.createElement('tbody')
  report.accounts.forEach((a, i) => {
    const tr = document.createElement('tr')
    // Use textContent: account names come from the user's export and must not be
    // interpreted as HTML.
    const cells = [
      String(i + 1),
      a.account,
      String(a.interactions),
      `${Math.round(a.share * 100)}%`,
      a.followed ? 'yes' : 'no',
    ]
    cells.forEach((text, col) => {
      const td = document.createElement('td')
      td.textContent = text
      if (col === 1) td.translate = false // the account column is a username
      tr.appendChild(td)
    })
    tbody.appendChild(tr)
  })
  table.appendChild(tbody)
  const scroll = document.createElement('div')
  scroll.className = 'table-scroll'
  scroll.appendChild(table)
  tableSec.appendChild(scroll)
  root.appendChild(tableSec)
}
