import * as THREE from 'three';

export const JEWELS = [
  '#f472b6',
  '#a78bfa',
  '#22d3ee',
  '#34d399',
  '#fb7185',
  '#fbbf24',
  '#60a5fa',
  '#c084fc',
];

let glowTexture = null;

export function getGlowTexture() {
  if (glowTexture) return glowTexture;
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0.0, 'rgba(255,255,255,1)');
  g.addColorStop(0.18, 'rgba(255,255,255,0.85)');
  g.addColorStop(0.38, 'rgba(255,255,255,0.28)');
  g.addColorStop(0.62, 'rgba(255,255,255,0.07)');
  g.addColorStop(1.0, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  glowTexture = new THREE.CanvasTexture(canvas);
  glowTexture.needsUpdate = true;
  return glowTexture;
}

export function jewelFor(community) {
  return JEWELS[community % JEWELS.length];
}

export function makeStarSprite(node, { dim = false, hot = false } = {}) {
  const color = jewelFor(node.community ?? 0);
  const material = new THREE.SpriteMaterial({
    map: getGlowTexture(),
    color: new THREE.Color(color),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: dim ? 0.12 : hot ? 1 : 0.92,
  });
  const sprite = new THREE.Sprite(material);
  const cites = node.cited_by_count || 0;
  const base = 5.2 + Math.log1p(cites) * 1.15;
  const scale = dim ? base * 0.55 : hot ? base * 1.35 : base;
  sprite.scale.set(scale, scale, 1);
  sprite.userData.nodeId = node.id;
  return sprite;
}

export function addStarfield(scene, count = 1400) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const col = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = 420 + Math.random() * 780;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.62;
    positions[i * 3 + 2] = r * Math.cos(phi);
    const t = Math.random();
    col.setHSL(0.55 + t * 0.2, 0.15, 0.55 + Math.random() * 0.4);
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 1.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  points.name = 'starfield-dust';
  scene.add(points);
  return points;
}
