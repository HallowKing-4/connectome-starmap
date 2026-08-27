import * as THREE from "three";
import { hexToRgb } from "./helpers";

const cache = new Map<string, THREE.CanvasTexture>();

function glowTexture(hex: string): THREE.CanvasTexture {
  const key = hex.toLowerCase();
  const hit = cache.get(key);
  if (hit) return hit;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    const tex = new THREE.CanvasTexture(canvas);
    cache.set(key, tex);
    return tex;
  }
  const [r, g, b] = hexToRgb(hex);
  const c = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  c.addColorStop(0.0, "rgba(255,255,255,1)");
  c.addColorStop(0.12, `rgba(${r},${g},${b},0.95)`);
  c.addColorStop(0.32, `rgba(${r},${g},${b},0.45)`);
  c.addColorStop(0.58, `rgba(${r},${g},${b},0.12)`);
  c.addColorStop(1.0, "rgba(0,0,0,0)");
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = c;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  cache.set(key, tex);
  return tex;
}

export function makeStarSprite(color: string, scale: number, opacity = 1): THREE.Sprite {
  const mat = new THREE.SpriteMaterial({
    map: glowTexture(color),
    color: 0xffffff,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(scale, scale, 1);
  return sprite;
}

export function makeStarfield(count = 1400): THREE.Points {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = 520 + Math.random() * 680;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
    const twinkle = 0.55 + Math.random() * 0.45;
    col[i * 3] = 0.72 * twinkle;
    col[i * 3 + 1] = 0.78 * twinkle;
    col[i * 3 + 2] = 0.95 * twinkle;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: 1.6,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
}
