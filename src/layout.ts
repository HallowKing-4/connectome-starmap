/** Even ellipsoid packing with a hard minimum spacing. */
export function packEllipsoid(nodes, { rx = 148, ry = 96, rz = 148, minDist = 14 } = {}) {
  const n = nodes.length;
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(n - 1, 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    pts.push({
      x: Math.cos(theta) * r * rx,
      y: y * ry,
      z: Math.sin(theta) * r * rz,
    });
  }
  const min2 = minDist * minDist;
  for (let iter = 0; iter < 48; iter++) {
    let moved = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = pts[j].x - pts[i].x;
        let dy = pts[j].y - pts[i].y;
        let dz = pts[j].z - pts[i].z;
        let d2 = dx * dx + dy * dy + dz * dz;
        if (d2 >= min2 || d2 === 0) continue;
        const d = Math.sqrt(d2) || 1e-6;
        const push = ((minDist - d) / d) * 0.5;
        dx *= push; dy *= push; dz *= push;
        pts[i].x -= dx; pts[i].y -= dy; pts[i].z -= dz;
        pts[j].x += dx; pts[j].y += dy; pts[j].z += dz;
        moved++;
      }
    }
    for (const p of pts) {
      const nx = p.x / rx; const ny = p.y / ry; const nz = p.z / rz;
      const mag = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      const s = 1 / mag;
      p.x = nx * s * rx; p.y = ny * s * ry; p.z = nz * s * rz;
    }
    if (moved === 0) break;
  }
  return nodes.map((node, i) => ({
    ...node,
    x: pts[i].x, y: pts[i].y, z: pts[i].z,
    fx: pts[i].x, fy: pts[i].y, fz: pts[i].z,
  }));
}
