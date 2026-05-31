const SVG = 'http://www.w3.org/2000/svg'

function svgEl(tag: string, attrs: Record<string, string | number>): SVGElement {
  const node = document.createElementNS(SVG, tag)
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v))
  return node
}

/** Colored "thermometer": red → amber → green gauge with a marker at the score. */
export function renderHealthGauge(
  container: HTMLElement,
  score: number,
  band: string,
): void {
  const wrap = document.createElement('div')
  wrap.className = 'gauge'

  const num = document.createElement('div')
  num.className = 'gauge-score'
  num.innerHTML = `<span class="gauge-num band-${band.toLowerCase()}">${score}</span><span class="gauge-max">/100</span> <span class="gauge-band band-${band.toLowerCase()}">${band}</span>`
  wrap.appendChild(num)

  const W = 300
  const H = 16
  const pad = 6
  const inner = W - 2 * pad
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H + 14}`, class: 'gauge-bar' }) as SVGSVGElement
  const zones: Array<[string, number, number]> = [
    ['#e53e3e', 0, 33],
    ['#f4a259', 33, 66],
    ['#38a169', 66, 100],
  ]
  for (const [color, a, b] of zones) {
    svg.appendChild(
      svgEl('rect', {
        x: pad + (a / 100) * inner,
        y: 4,
        width: ((b - a) / 100) * inner,
        height: H - 8,
        fill: color,
      }),
    )
  }
  const mx = pad + (Math.max(0, Math.min(100, score)) / 100) * inner
  svg.appendChild(svgEl('polygon', { points: `${mx - 6},${H + 12} ${mx + 6},${H + 12} ${mx},${H - 2}`, fill: '#1a1a1a' }))
  wrap.appendChild(svg)
  container.appendChild(wrap)
}

/** A marker on a Consumer ↔ Creator track, positioned by follower/following ratio. */
export function renderLeaningMeter(
  container: HTMLElement,
  ratio: number,
  labels: { consumer: string; creator: string },
): void {
  const pos = Math.max(0.04, Math.min(0.96, ratio / (ratio + 1))) // 0.5 = balanced
  const wrap = document.createElement('div')
  wrap.className = 'meter'
  wrap.innerHTML =
    `<div class="meter-track"><div class="meter-mark" style="left:${(pos * 100).toFixed(1)}%"></div></div>` +
    `<div class="meter-ends"><span>${labels.consumer}</span><span>${labels.creator}</span></div>`
  container.appendChild(wrap)
}

/** A single labelled proportion bar, e.g. "63% of your attention → your inner circle". */
export function renderShareBar(
  container: HTMLElement,
  share: number,
  label: string,
  color = '#e0245e',
): void {
  const pct = Math.round(share * 100)
  const row = document.createElement('div')
  row.className = 'share'
  row.innerHTML =
    `<div class="share-head"><span>${label}</span><strong>${pct}%</strong></div>` +
    `<div class="share-track"><div class="share-fill" style="width:${pct}%;background:${color}"></div></div>`
  container.appendChild(row)
}

/** 24-bar histogram of activity by hour of day. */
export function renderHourHistogram(container: HTMLElement, byHour: number[]): void {
  const W = 300
  const H = 70
  const max = Math.max(1, ...byHour)
  const bw = W / 24
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H + 12}`, class: 'hist' }) as SVGSVGElement
  byHour.forEach((v, h) => {
    const bh = (v / max) * H
    svg.appendChild(
      svgEl('rect', { x: h * bw + 1, y: H - bh, width: bw - 2, height: bh, fill: '#e0245e', rx: 1 }),
    )
  })
  for (const h of [0, 6, 12, 18]) {
    const t = svgEl('text', { x: h * bw + 1, y: H + 10, 'font-size': 8, fill: '#999' })
    t.textContent = `${h}h`
    svg.appendChild(t)
  }
  container.appendChild(svg)
}
