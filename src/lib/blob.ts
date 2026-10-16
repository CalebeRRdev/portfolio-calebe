// File: src/lib/blob.ts

/**
 * A closed, smooth, slightly irregular ring, like a contour line around a hill.
 * Deterministic (no Math.random) so server and client render the same path.
 */
export function contourPath(cx: number, cy: number, r: number, seed: number, wobble = 0.07, points = 14) {
  const pts: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const k =
      1 +
      wobble * Math.sin(a * 2 + seed) +
      wobble * 0.6 * Math.sin(a * 3 - seed * 1.7) +
      wobble * 0.35 * Math.cos(a * 5 + seed * 0.6);
    pts.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k]);
  }

  // Closed Catmull-Rom spline → cubic Béziers
  const f = (n: number) => n.toFixed(2);
  let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < points; i++) {
    const p0 = pts[(i - 1 + points) % points];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % points];
    const p3 = pts[(i + 2) % points];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${f(c1x)} ${f(c1y)}, ${f(c2x)} ${f(c2y)}, ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d} Z`;
}
