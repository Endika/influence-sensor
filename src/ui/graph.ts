import { drag } from 'd3-drag';
import { forceCenter, forceLink, forceManyBody, forceSimulation, type Simulation } from 'd3-force';
import { select } from 'd3-selection';
import type { Report } from '../report-model';
import { toGraphData, YOU_ID, type GraphLink, type GraphNode } from './graph-data';

export const GRAPH_COLORS: Record<string, string> = {
  you: '#222',
  mutual: '#e0245e', // you follow them and they follow you — your inner circle
  followed: '#f4a259', // you follow them, one-way
  leak: '#4a90d9', // you engage but don't follow — parasocial leak
};

const SVG = 'http://www.w3.org/2000/svg';

export function renderGraph(container: HTMLElement, report: Report, topN = 25): void {
  const width = container.clientWidth || 640;
  // Mobile-first: fewer nodes on narrow screens so the graph stays legible/usable.
  const effectiveTopN = width < 480 ? 12 : topN;
  const { nodes, links } = toGraphData(report, effectiveTopN);
  const height = width < 480 ? 360 : 480;

  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  container.appendChild(svg);

  const linkEls = links.map((l) => {
    const line = document.createElementNS(SVG, 'line');
    line.setAttribute('stroke', '#ccc');
    line.setAttribute('stroke-width', String(1 + l.weight * 6));
    svg.appendChild(line);
    return line;
  });

  const nodeEls = nodes.map((n) => {
    const circle = document.createElementNS(SVG, 'circle');
    circle.setAttribute('r', String(n.radius));
    circle.setAttribute('fill', GRAPH_COLORS[n.category]);
    const title = document.createElementNS(SVG, 'title');
    title.textContent = n.label;
    circle.appendChild(title);
    svg.appendChild(circle);
    return circle;
  });

  // Username labels so you can see who each node is (not just on hover).
  const labelEls = nodes.map((n) => {
    if (n.center) return null;
    const text = document.createElementNS(SVG, 'text');
    text.setAttribute('font-size', '9');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#333');
    text.setAttribute('translate', 'no');
    text.textContent = n.label;
    svg.appendChild(text);
    return text;
  });

  type SimNode = GraphNode & { x?: number; y?: number; fx?: number | null; fy?: number | null };
  const simNodes = nodes as SimNode[];
  const you = simNodes.find((n) => n.id === YOU_ID)!;
  you.fx = width / 2;
  you.fy = height / 2;

  const sim: Simulation<SimNode, GraphLink> = forceSimulation(simNodes)
    .force('charge', forceManyBody().strength(-180))
    .force(
      'link',
      forceLink<SimNode, GraphLink>(links)
        .id((d) => d.id)
        .distance(90),
    )
    .force('center', forceCenter(width / 2, height / 2))
    .on('tick', () => {
      links.forEach((l, i) => {
        const s = l.source as unknown as SimNode;
        const t = l.target as unknown as SimNode;
        linkEls[i].setAttribute('x1', String(s.x));
        linkEls[i].setAttribute('y1', String(s.y));
        linkEls[i].setAttribute('x2', String(t.x));
        linkEls[i].setAttribute('y2', String(t.y));
      });
      simNodes.forEach((n, i) => {
        nodeEls[i].setAttribute('cx', String(n.x));
        nodeEls[i].setAttribute('cy', String(n.y));
        const label = labelEls[i];
        if (label) {
          label.setAttribute('x', String(n.x));
          label.setAttribute('y', String((n.y ?? 0) + n.radius + 9));
        }
      });
    });

  select(svg)
    .selectAll<SVGCircleElement, unknown>('circle')
    .data(simNodes)
    .call(
      drag<SVGCircleElement, SimNode>()
        .on('start', (event, d) => {
          if (!event.active) sim.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) sim.alphaTarget(0);
          if (d.id !== YOU_ID) {
            d.fx = null;
            d.fy = null;
          }
        }),
    );
}
