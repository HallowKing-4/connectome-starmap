import * as THREE from "three";

const cache = new Map<string, THREE.CanvasTexture>();

export function glowTexture(hex: string): THREE.CanvasTexture {
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
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const c = size / 2;
  const grad = ctx.createRadialGradient(c, c, 0, c, c, c);
  grad.addColorStop(0.0, "rgba(255,255,255,0.95)");
  grad.addColorStop(0.12, `rgba(${r},${g},${b},0.95)`);
  grad.addColorStop(0.32, `rgba(${r},${g},${b},0.55)`);
  grad.addColorStop(0.58, `rgba(${r},${g},${b},0.16)`);
  grad.addColorStop(1.0, `rgba(${r},${g},${b},0)`);
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}

export function makeStarSprite(hex: string, scale: number): THREE.Sprite {
  const mat = new THREE.SpriteMaterial({
    map: glowTexture(hex),
    color: 0xffffff,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: 1,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(scale, scale, 1);
  return sprite;
}
