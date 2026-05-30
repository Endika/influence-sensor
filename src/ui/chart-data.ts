export interface Point {
  x: number
  y: number
}

/** Lorenz curve points (cumulative account fraction → cumulative attention fraction). */
export function lorenzPoints(counts: number[]): Point[] {
  const sorted = [...counts].sort((a, b) => a - b)
  const total = sorted.reduce((a, b) => a + b, 0)
  const n = sorted.length
  const points: Point[] = [{ x: 0, y: 0 }]
  let cum = 0
  for (let i = 0; i < n; i++) {
    cum += sorted[i]
    points.push({ x: (i + 1) / n, y: total === 0 ? 0 : cum / total })
  }
  return points
}
