import type { Report } from '../report-model';

export type NodeCategory = 'mutual' | 'followed' | 'leak';

export interface GraphNode {
  id: string;
  label: string;
  center: boolean;
  radius: number;
  category: NodeCategory | 'you';
}

export interface GraphLink {
  source: string;
  target: string;
  weight: number;
}

export const YOU_ID = '__you__';

const MIN_R = 6;
const MAX_R = 40;

export function toGraphData(
  report: Report,
  topN: number,
): { nodes: GraphNode[]; links: GraphLink[] } {
  const top = report.accounts.slice(0, topN);
  const maxShare = top.reduce((m, a) => Math.max(m, a.share), 0) || 1;

  const nodes: GraphNode[] = [
    { id: YOU_ID, label: 'You', center: true, radius: MAX_R, category: 'you' },
  ];
  const links: GraphLink[] = [];

  for (const a of top) {
    nodes.push({
      id: a.account,
      label: a.account,
      center: false,
      radius: MIN_R + (MAX_R - MIN_R) * Math.sqrt(a.share / maxShare),
      category: a.mutual ? 'mutual' : a.followed ? 'followed' : 'leak',
    });
    links.push({ source: YOU_ID, target: a.account, weight: a.share });
  }

  return { nodes, links };
}
