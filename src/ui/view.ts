import type { Report } from '../report-model'
import { renderLorenz, renderTopBars } from './charts'
import { renderGraph } from './graph'

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

export function renderReport(root: HTMLElement, report: Report): void {
  root.innerHTML = ''

  const verdict = section(
    `Network Health: ${report.health.score}/100 — ${report.health.band}`,
    'A transparent heuristic. Higher = a diverse, balanced diet. Lower = a few voices own your attention. ' +
      `Diversity ${Math.round(report.health.diversity * 100)}% · Top-10 concentration ${Math.round(report.health.concentration * 100)}%.`,
  )
  root.appendChild(verdict)

  const headline = document.createElement('p')
  headline.className = 'headline'
  const top = report.accounts[0]
  if (top) {
    headline.textContent = `You follow ${report.totalFollows} accounts, but ${top.account} alone takes ${Math.round(
      top.share * 100,
    )}% of your ${report.totalInteractions} logged interactions.`
  }
  root.appendChild(headline)

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
    for (const text of cells) {
      const td = document.createElement('td')
      td.textContent = text
      tr.appendChild(td)
    }
    tbody.appendChild(tr)
  })
  table.appendChild(tbody)
  const scroll = document.createElement('div')
  scroll.className = 'table-scroll'
  scroll.appendChild(table)
  tableSec.appendChild(scroll)
  root.appendChild(tableSec)
}
