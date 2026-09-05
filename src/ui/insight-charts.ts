const SVG = 'http://www.w3.org/2000/svg';

function svgEl(tag: string, attrs: Record<string, string | number>): SVGElement {
  const node = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
}

/** Colored "thermometer": red → amber → green gauge with a marker at the score.
 *  `bandClass` is the English band (for color), `label` is the translated text. */
export function renderHealthGauge(
  container: HTMLElement,
  score: number,
  bandClass: string,
  label: string,
  invert = false,
): void {
  const wrap = document.createElement('div');
  wrap.className = 'gauge';
  const cls = `band-${bandClass.toLowerCase()}`;

  const num = document.createElement('div');
  num.className = 'gauge-score';
  num.innerHTML = `<span class="gauge-num ${cls}">${score}</span><span class="gauge-max">/100</span> <span class="gauge-band ${cls}">${label}</span>`;
  wrap.appendChild(num);

  const W = 300;
  const H = 16;
  const pad = 6;
  const inner = W - 2 * pad;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H + 14}`, class: 'gauge-bar' }) as SVGSVGElement;
  const green = '#38a169';
  const red = '#e53e3e';
  const zones: Array<[string, number, number]> = [
    [invert ? green : red, 0, 33],
    ['#f4a259', 33, 66],
    [invert ? red : green, 66, 100],
  ];
  for (const [color, a, b] of zones) {
    svg.appendChild(
      svgEl('rect', {
        x: pad + (a / 100) * inner,
        y: 4,
        width: ((b - a) / 100) * inner,
        height: H - 8,
        fill: color,
      }),
    );
  }
  const mx = pad + (Math.max(0, Math.min(100, score)) / 100) * inner;
  svg.appendChild(
    svgEl('polygon', {
      points: `${mx - 6},${H + 12} ${mx + 6},${H + 12} ${mx},${H - 2}`,
      fill: '#1a1a1a',
    }),
  );
  wrap.appendChild(svg);
  container.appendChild(wrap);
}

/** A marker on a Consumer ↔ Creator track, positioned by follower/following ratio. */
export function renderLeaningMeter(
  container: HTMLElement,
  ratio: number,
  labels: { consumer: string; creator: string },
): void {
  const pos = Math.max(0.04, Math.min(0.96, ratio / (ratio + 1))); // 0.5 = balanced
  const wrap = document.createElement('div');
  wrap.className = 'meter';
  wrap.innerHTML =
    `<div class="meter-track"><div class="meter-mark" style="left:${(pos * 100).toFixed(1)}%"></div></div>` +
    `<div class="meter-ends"><span>${labels.consumer}</span><span>${labels.creator}</span></div>`;
  container.appendChild(wrap);
}

/** A single labelled proportion bar, e.g. "63% of your attention → your inner circle". */
export function renderShareBar(
  container: HTMLElement,
  share: number,
  label: string,
  color = '#e0245e',
): void {
  const pct = Math.round(share * 100);
  const row = document.createElement('div');
  row.className = 'share';
  row.innerHTML =
    `<div class="share-head"><span>${label}</span><strong>${pct}%</strong></div>` +
    `<div class="share-track"><div class="share-fill" style="width:${pct}%;background:${color}"></div></div>`;
  container.appendChild(row);
}

/** Area + line of activity per calendar year. */
export function renderYearArea(
  container: HTMLElement,
  byYear: Array<{ year: number; count: number }>,
): void {
  if (byYear.length === 0) return;
  const W = 320;
  const H = 90;
  const pad = 20;
  const max = Math.max(1, ...byYear.map((d) => d.count));
  const n = byYear.length;
  const x = (i: number) => pad + (n <= 1 ? (W - 2 * pad) / 2 : (i / (n - 1)) * (W - 2 * pad));
  const y = (v: number) => H - pad - (v / max) * (H - 2 * pad);
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'hist' }) as SVGSVGElement;
  const pts = byYear.map((d, i) => `${x(i)},${y(d.count)}`).join(' ');
  svg.appendChild(
    svgEl('polygon', {
      points: `${x(0)},${H - pad} ${pts} ${x(n - 1)},${H - pad}`,
      fill: '#e0245e',
      'fill-opacity': 0.15,
    }),
  );
  svg.appendChild(
    svgEl('polyline', { points: pts, fill: 'none', stroke: '#e0245e', 'stroke-width': 2 }),
  );
  byYear.forEach((d, i) => {
    svg.appendChild(svgEl('circle', { cx: x(i), cy: y(d.count), r: 2.2, fill: '#e0245e' }));
  });
  for (const i of [0, n - 1]) {
    const label = svgEl('text', {
      x: x(i),
      y: H - 6,
      'font-size': 8,
      fill: '#999',
      'text-anchor': 'middle',
    });
    label.textContent = String(byYear[i].year);
    svg.appendChild(label);
  }
  container.appendChild(svg);
}

/** 7-bar histogram of activity by weekday. `labels` are localized day names, index 0 = Sunday. */
export function renderWeekday(container: HTMLElement, byWeekday: number[], labels: string[]): void {
  const W = 320;
  const H = 80;
  const max = Math.max(1, ...byWeekday);
  const bw = W / 7;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H + 14}`, class: 'hist' }) as SVGSVGElement;
  byWeekday.forEach((v, d) => {
    const bh = (v / max) * H;
    svg.appendChild(
      svgEl('rect', {
        x: d * bw + 4,
        y: H - bh,
        width: bw - 8,
        height: bh,
        fill: '#e0245e',
        rx: 2,
      }),
    );
    const label = svgEl('text', {
      x: d * bw + bw / 2,
      y: H + 11,
      'font-size': 8,
      fill: '#999',
      'text-anchor': 'middle',
    });
    label.textContent = labels[d] ?? '';
    svg.appendChild(label);
  });
  container.appendChild(svg);
}

/** Horizontal labelled bars (e.g. interactions by type). */
export function renderLabeledBars(
  container: HTMLElement,
  items: Array<{ label: string; value: number }>,
): void {
  const list = document.createElement('div');
  list.className = 'bars';
  const max = items.reduce((m, it) => Math.max(m, it.value), 0) || 1;
  for (const it of items) {
    const row = document.createElement('div');
    row.className = 'bar-row';
    const label = document.createElement('span');
    label.className = 'bar-label';
    label.textContent = it.label;
    const track = document.createElement('div');
    track.className = 'bar-track';
    const fill = document.createElement('div');
    fill.className = 'bar-fill';
    fill.style.width = `${(it.value / max) * 100}%`;
    fill.textContent = String(it.value);
    track.appendChild(fill);
    row.append(label, track);
    list.appendChild(row);
  }
  container.appendChild(list);
}

/** Two proportional, overlapping circles for following vs followers, overlap = mutual. */
export function renderVenn(
  container: HTMLElement,
  following: number,
  followers: number,
  mutual: number,
  labels: { following: string; followers: string; mutual: string },
): void {
  const W = 320;
  const H = 150;
  const scale = 46 / Math.sqrt(Math.max(following, followers, 1));
  const rA = Math.max(20, Math.sqrt(following) * scale);
  const rB = Math.max(20, Math.sqrt(followers) * scale);
  const cy = 70;
  const cxA = 120;
  const cxB = 200;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'venn' }) as SVGSVGElement;
  svg.appendChild(svgEl('circle', { cx: cxA, cy, r: rA, fill: '#f4a259', 'fill-opacity': 0.55 }));
  svg.appendChild(svgEl('circle', { cx: cxB, cy, r: rB, fill: '#4a90d9', 'fill-opacity': 0.45 }));
  const txt = (x: number, y: number, s: string, weight = '400', size = 9) => {
    const t = svgEl('text', {
      x,
      y,
      'font-size': size,
      'font-weight': weight,
      fill: '#222',
      'text-anchor': 'middle',
    });
    t.textContent = s;
    svg.appendChild(t);
  };
  txt(cxA - rA / 2, cy - 4, `${following}`, '700', 11);
  txt(cxA - rA / 2, cy + 8, labels.following);
  txt(cxB + rB / 2, cy - 4, `${followers}`, '700', 11);
  txt(cxB + rB / 2, cy + 8, labels.followers);
  txt((cxA + cxB) / 2, cy - 2, `${mutual}`, '700', 11);
  txt((cxA + cxB) / 2, cy + 9, labels.mutual);
  container.appendChild(svg);
}

/** Small color legend for the ego graph categories. */
export function renderLegend(
  container: HTMLElement,
  items: Array<{ color: string; label: string }>,
): void {
  const wrap = document.createElement('div');
  wrap.className = 'legend';
  for (const it of items) {
    const span = document.createElement('span');
    span.className = 'legend-item';
    span.innerHTML = `<i style="background:${it.color}"></i>${it.label}`;
    wrap.appendChild(span);
  }
  container.appendChild(wrap);
}

/** 24-bar histogram of activity by hour of day. */
export function renderHourHistogram(container: HTMLElement, byHour: number[]): void {
  const W = 300;
  const H = 70;
  const max = Math.max(1, ...byHour);
  const bw = W / 24;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H + 12}`, class: 'hist' }) as SVGSVGElement;
  byHour.forEach((v, h) => {
    const bh = (v / max) * H;
    svg.appendChild(
      svgEl('rect', {
        x: h * bw + 1,
        y: H - bh,
        width: bw - 2,
        height: bh,
        fill: '#e0245e',
        rx: 1,
      }),
    );
  });
  for (const h of [0, 6, 12, 18]) {
    const t = svgEl('text', { x: h * bw + 1, y: H + 10, 'font-size': 8, fill: '#999' });
    t.textContent = `${h}h`;
    svg.appendChild(t);
  }
  container.appendChild(svg);
}
