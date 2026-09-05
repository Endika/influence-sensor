import { lorenzPoints } from './chart-data';

const SVG = 'http://www.w3.org/2000/svg';

function el(tag: string, attrs: Record<string, string | number>): SVGElement {
  const node = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
}

/** Lorenz curve: how unequally attention is spread. Diagonal = perfectly even. */
export function renderLorenz(container: HTMLElement, counts: number[]): void {
  const size = 240;
  const pad = 24;
  const svg = el('svg', {
    viewBox: `0 0 ${size} ${size}`,
    width: size,
    height: size,
  }) as SVGSVGElement;
  const scale = (v: number) => pad + v * (size - 2 * pad);

  svg.appendChild(
    el('line', {
      x1: scale(0),
      y1: scale(1),
      x2: scale(1),
      y2: scale(0),
      stroke: '#bbb',
      'stroke-dasharray': '4 4',
    }),
  );

  const pts = lorenzPoints(counts)
    .map((p) => `${scale(p.x)},${scale(1 - p.y)}`)
    .join(' ');
  svg.appendChild(
    el('polyline', { points: pts, fill: 'none', stroke: '#e0245e', 'stroke-width': 2 }),
  );

  container.appendChild(svg);
}

/** Horizontal bars for the top accounts by share of attention. */
export function renderTopBars(
  container: HTMLElement,
  accounts: Array<{ account: string; share: number }>,
): void {
  const list = document.createElement('div');
  list.className = 'bars';
  const max = accounts.reduce((m, a) => Math.max(m, a.share), 0) || 1;
  for (const a of accounts) {
    const row = document.createElement('div');
    row.className = 'bar-row';
    const label = document.createElement('span');
    label.className = 'bar-label';
    label.translate = false; // bar labels are usernames; don't let the browser translate them
    label.textContent = a.account;
    const track = document.createElement('div');
    track.className = 'bar-track';
    const fill = document.createElement('div');
    fill.className = 'bar-fill';
    fill.style.width = `${(a.share / max) * 100}%`;
    fill.textContent = `${Math.round(a.share * 100)}%`;
    track.appendChild(fill);
    row.append(label, track);
    list.appendChild(row);
  }
  container.appendChild(list);
}
