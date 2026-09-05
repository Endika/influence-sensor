import { getLocale, t } from '../i18n';
import type { Report } from '../report-model';
import { renderLorenz, renderTopBars } from './charts';
import { GRAPH_COLORS, renderGraph } from './graph';
import {
  renderHealthGauge,
  renderHourHistogram,
  renderLabeledBars,
  renderLeaningMeter,
  renderLegend,
  renderShareBar,
  renderVenn,
  renderWeekday,
  renderYearArea,
} from './insight-charts';

const WEEKDAY_LABELS = (): string[] =>
  Array.from({ length: 7 }, (_, d) =>
    new Date(Date.UTC(2023, 0, 1 + d)).toLocaleDateString(getLocale(), { weekday: 'short' }),
  );

// Below this many attributable interactions the verdict is statistically meaningless.
const MIN_RELIABLE_INTERACTIONS = 10;

function section(title: string, caption: string): HTMLElement {
  const wrap = document.createElement('section');
  const h = document.createElement('h2');
  h.textContent = title;
  const p = document.createElement('p');
  p.className = 'caption';
  p.textContent = caption;
  wrap.append(h, p);
  return wrap;
}

function notice(text: string, kind: 'warn' | 'info'): HTMLElement {
  const p = document.createElement('p');
  p.className = `notice notice-${kind}`;
  p.textContent = text;
  return p;
}

function pct(x: number): number {
  return Math.round(x * 100);
}

function renderInsightSections(root: HTMLElement, report: Report): void {
  const ins = report.insights;

  if (ins.hasFollowerData) {
    const rel = ins.relationships;
    const sec = section(
      t('net.title'),
      t('net.caption', {
        followYouNotBack: rel.followYouNotBack,
        youFollowNotBack: rel.youFollowNotBack,
        mutual: rel.mutual,
      }),
    );
    const grid = document.createElement('div');
    grid.className = 'statgrid';
    const stat = (n: number, label: string) => {
      const d = document.createElement('div');
      d.className = 'stat';
      d.innerHTML = `<span class="stat-n">${n}</span><span class="stat-l">${label}</span>`;
      return d;
    };
    grid.append(
      stat(rel.following, t('stat.following')),
      stat(rel.followers, t('stat.followers')),
      stat(rel.mutual, t('stat.mutual')),
    );
    sec.appendChild(grid);
    const ml = document.createElement('p');
    ml.className = 'caption';
    ml.textContent = t('leaning.caption', {
      ratio: ins.influence.followerRatio.toFixed(2),
      leaning: t(`leaning.${ins.influence.leaning}`),
    });
    sec.appendChild(ml);
    renderLeaningMeter(sec, ins.influence.followerRatio, {
      consumer: t('leaning.consumerEnd'),
      creator: t('leaning.creatorEnd'),
    });
    const vennCap = document.createElement('p');
    vennCap.className = 'caption';
    vennCap.textContent = t('venn.caption');
    sec.appendChild(vennCap);
    renderVenn(sec, rel.following, rel.followers, rel.mutual, {
      following: t('stat.following'),
      followers: t('stat.followers'),
      mutual: t('stat.mutual'),
    });
    root.appendChild(sec);
  }

  if (ins.byKind.length) {
    const sec = section(t('kind.title'), t('kind.caption'));
    renderLabeledBars(
      sec,
      ins.byKind.map((k) => ({ label: t(`kind.${k.kind}`), value: k.count })),
    );
    root.appendChild(sec);
  }

  if (ins.byYear.length > 1) {
    const sec = section(t('year.title'), t('year.caption'));
    renderYearArea(sec, ins.byYear);
    root.appendChild(sec);
  }

  if (ins.temporal.dated > 0) {
    const sec = section(t('weekday.title'), t('weekday.caption'));
    renderWeekday(sec, ins.byWeekday, WEEKDAY_LABELS());
    root.appendChild(sec);
  }

  const bubble = section(t('bubble.title'), t('bubble.caption'));
  renderShareBar(bubble, ins.bubble.followedAttentionShare, t('bubble.followed'), '#e0245e');
  renderShareBar(bubble, ins.bubble.mutualAttentionShare, t('bubble.mutual'), '#f4a259');
  root.appendChild(bubble);

  if (report.totalFollows > 0) {
    const dead = section(t('dead.title'), t('dead.caption'));
    renderShareBar(
      dead,
      ins.deadFollowsPct,
      t('dead.bar', { n: ins.deadFollowsCount, total: report.totalFollows }),
      '#888',
    );
    root.appendChild(dead);
  }

  if (ins.temporal.dated > 0) {
    const when = section(
      t('when.title'),
      t('when.caption', { hour: ins.temporal.busiestHour, days: ins.temporal.spanDays }),
    );
    renderHourHistogram(when, ins.temporal.byHour);
    root.appendChild(when);
  }

  if (ins.hasCloseFriendsData) {
    const cf = ins.closeFriends;
    const sec = section(
      t('close.title'),
      t('close.caption', { total: cf.total, engaged: cf.engaged }),
    );
    renderShareBar(sec, cf.total ? cf.engaged / cf.total : 0, t('close.bar'), '#38a169');
    root.appendChild(sec);
  }

  if (ins.parasocial.length) {
    const sec = section(t('para.title'), t('para.caption'));
    const list = document.createElement('div');
    list.className = 'bars';
    for (const p of ins.parasocial.slice(0, 8)) {
      const row = document.createElement('div');
      row.className = 'leak-row';
      const a = document.createElement('span');
      a.className = 'bar-label';
      a.translate = false;
      a.textContent = p.account;
      const n = document.createElement('span');
      n.textContent = `${p.interactions}×`;
      row.append(a, n);
      list.appendChild(row);
    }
    sec.appendChild(list);
    root.appendChild(sec);
  }

  const top3 = report.accounts.slice(0, 3);
  if (top3.length) {
    const sec = section(
      t('vectors.title'),
      t('vectors.caption', { n: top3.length, pct: Math.round(ins.infection.topThree * 100) }),
    );
    const list = document.createElement('div');
    list.className = 'bars';
    for (const a of top3) {
      const row = document.createElement('div');
      row.className = 'leak-row';
      const name = document.createElement('span');
      name.className = 'bar-label';
      name.translate = false;
      name.textContent = a.account;
      const share = document.createElement('span');
      share.textContent = `${Math.round(a.share * 100)}%`;
      row.append(name, share);
      list.appendChild(row);
    }
    sec.appendChild(list);
    root.appendChild(sec);
  }

  if (ins.concentrationByYear.length >= 2) {
    const sec = section(t('trend.title'), t(`trend.${ins.trend}`));
    renderYearArea(
      sec,
      ins.concentrationByYear.map((c) => ({ year: c.year, count: Math.round(c.top3Share * 100) })),
    );
    root.appendChild(sec);
  }
}

export function renderReport(root: HTMLElement, report: Report): void {
  root.innerHTML = '';

  // Coverage indicator: the export's date range drives everything below.
  const tmp = report.insights.temporal;
  if (tmp.dated > 0) {
    const fmt = (ts: number) =>
      new Date(ts * 1000).toLocaleDateString(getLocale(), { year: 'numeric', month: 'short' });
    const banner = document.createElement('p');
    banner.className = 'coverage';
    banner.textContent = t('coverage', {
      from: fmt(tmp.firstTs),
      to: fmt(tmp.lastTs),
      years: (tmp.spanDays / 365).toFixed(1),
    });
    root.appendChild(banner);
  }

  if (report.totalInteractions < MIN_RELIABLE_INTERACTIONS) {
    root.appendChild(notice(t('notice.lowData', { n: report.totalInteractions }), 'warn'));
  }

  const caveat = report.uniqueAccountsEngaged <= 10 ? t('verdict.fewAccounts') : '';
  const verdict = section(
    t('verdict.title'),
    t('verdict.caption', {
      div: pct(report.health.diversity),
      conc: pct(report.health.concentration),
    }) + caveat,
  );
  renderHealthGauge(
    verdict,
    report.health.score,
    report.health.band,
    t(`band.${report.health.band}`),
  );
  root.appendChild(verdict);

  // Infection index: the visceral capstone — how captured you are by a few others.
  const inf = report.insights.infection;
  const infClass =
    inf.band === 'high' ? 'Captured' : inf.band === 'medium' ? 'Moderate' : 'Healthy';
  const infSec = section(t('infection.title'), t('infection.caption'));
  renderHealthGauge(infSec, inf.index, infClass, t(`infection.${inf.band}`), true);
  root.appendChild(infSec);

  if (report.unattributed > 0) {
    root.appendChild(notice(t('notice.unattributed', { n: report.unattributed }), 'info'));
  }

  const top = report.accounts[0];
  if (top) {
    const headline = document.createElement('p');
    headline.className = 'headline';
    const account = document.createElement('span');
    account.translate = false;
    account.textContent = top.account;
    headline.append(
      t('headline.before', { follows: report.totalFollows }),
      account,
      t('headline.after', { pct: pct(top.share), total: report.totalInteractions }),
    );
    root.appendChild(headline);
  }

  const graphSec = section(t('graph.title'), t('graph.caption'));
  const graphHost = document.createElement('div');
  graphHost.className = 'graph-host';
  graphSec.appendChild(graphHost);
  root.appendChild(graphSec);
  renderGraph(graphHost, report);
  renderLegend(graphSec, [
    { color: GRAPH_COLORS.mutual, label: t('legend.mutual') },
    { color: GRAPH_COLORS.followed, label: t('legend.followed') },
    { color: GRAPH_COLORS.leak, label: t('legend.leak') },
  ]);

  renderInsightSections(root, report);

  const lorenzSec = section(
    t('lorenz.title'),
    t('lorenz.caption', { gini: report.gini.toFixed(2) }),
  );
  renderLorenz(
    lorenzSec,
    report.accounts.map((a) => a.interactions),
  );
  root.appendChild(lorenzSec);

  const barsSec = section(t('bars.title'), t('bars.caption'));
  renderTopBars(barsSec, report.accounts.slice(0, 15));
  root.appendChild(barsSec);

  const tableSec = section(t('table.title'), t('table.caption'));
  const table = document.createElement('table');
  const head = document.createElement('thead');
  const hr = document.createElement('tr');
  for (const key of [
    'table.colRank',
    'table.colAccount',
    'table.colInteractions',
    'table.colShare',
    'table.colFollowed',
  ]) {
    const th = document.createElement('th');
    th.textContent = t(key);
    hr.appendChild(th);
  }
  head.appendChild(hr);
  table.appendChild(head);
  const tbody = document.createElement('tbody');
  report.accounts.forEach((a, i) => {
    const tr = document.createElement('tr');
    const cells = [
      String(i + 1),
      a.account,
      String(a.interactions),
      `${pct(a.share)}%`,
      a.followed ? t('table.yes') : t('table.no'),
    ];
    cells.forEach((text, col) => {
      const td = document.createElement('td');
      td.textContent = text;
      if (col === 1) td.translate = false;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  const scroll = document.createElement('div');
  scroll.className = 'table-scroll';
  scroll.appendChild(table);
  tableSec.appendChild(scroll);
  root.appendChild(tableSec);
}
