// ============================================================
// Procedural textures — generated on the client, zero payload.
//
// Realism in a still life comes from micro-surface, not colour: the weave
// of the jute, the wrinkles in a date, the grain of a heap of powder, the
// struck letters on a bar. Every map here is built from tileable noise,
// turned into a tangent-space normal map where it matters, and cached at
// module scope so remounting a scene never rebuilds it.
// ============================================================

import * as THREE from 'three';

const cache = new Map<string, THREE.Texture>();

function memo<T extends THREE.Texture>(key: string, build: () => T): T {
  const hit = cache.get(key);
  if (hit) return hit as T;
  const tex = build();
  cache.set(key, tex);
  return tex;
}

// ------------------------------------------------------------
// Noise
// ------------------------------------------------------------

export function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash2(x: number, y: number, seed: number): number {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Value noise that tiles seamlessly across a size×size grid. */
function tileNoise(size: number, period: number, seed: number, stretchX = 1, stretchY = 1): Float32Array {
  const out = new Float32Array(size * size);
  const px = Math.max(1, Math.round(period * stretchX));
  const py = Math.max(1, Math.round(period * stretchY));
  for (let y = 0; y < size; y++) {
    const fy = (y / size) * py;
    const y0 = Math.floor(fy);
    const ty = smooth(fy - y0);
    const ya = y0 % py;
    const yb = (y0 + 1) % py;
    for (let x = 0; x < size; x++) {
      const fx = (x / size) * px;
      const x0 = Math.floor(fx);
      const tx = smooth(fx - x0);
      const xa = x0 % px;
      const xb = (x0 + 1) % px;
      const a = hash2(xa, ya, seed);
      const b = hash2(xb, ya, seed);
      const c = hash2(xa, yb, seed);
      const d = hash2(xb, yb, seed);
      const top = a + (b - a) * tx;
      const bottom = c + (d - c) * tx;
      out[y * size + x] = top + (bottom - top) * ty;
    }
  }
  return out;
}

function fbm(
  size: number,
  basePeriod: number,
  octaves: number,
  seed: number,
  stretchX = 1,
  stretchY = 1
): Float32Array {
  const out = new Float32Array(size * size);
  let amp = 1;
  let total = 0;
  for (let o = 0; o < octaves; o++) {
    const layer = tileNoise(size, basePeriod * 2 ** o, seed + o * 17, stretchX, stretchY);
    for (let i = 0; i < out.length; i++) out[i] += layer[i] * amp;
    total += amp;
    amp *= 0.5;
  }
  for (let i = 0; i < out.length; i++) out[i] /= total;
  return out;
}

/** 1 - |2n - 1|: sharp creases where the noise crosses its middle. */
function ridged(field: Float32Array): Float32Array {
  const out = new Float32Array(field.length);
  for (let i = 0; i < field.length; i++) out[i] = 1 - Math.abs(field[i] * 2 - 1);
  return out;
}

// ------------------------------------------------------------
// Canvas plumbing
// ------------------------------------------------------------

function canvas2d(w: number, h = w): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context unavailable');
  return [canvas, ctx];
}

function finish(
  canvas: HTMLCanvasElement,
  colorSpace: THREE.ColorSpace,
  wrap = true
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  if (wrap) tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = colorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/** Height field → tangent-space normal map (OpenGL convention, +Y up). */
function normalFromHeight(h: Float32Array, size: number, strength: number): THREE.CanvasTexture {
  const [canvas, ctx] = canvas2d(size);
  const img = ctx.createImageData(size, size);
  const at = (x: number, y: number) => h[((y + size) % size) * size + ((x + size) % size)];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * 0.5 * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * 0.5 * strength;
      // Image y runs down, uv v runs up: the sign of dy flips.
      const len = Math.hypot(dx, dy, 1);
      const i = (y * size + x) * 4;
      img.data[i] = ((-dx / len) * 0.5 + 0.5) * 255;
      img.data[i + 1] = ((dy / len) * 0.5 + 0.5) * 255;
      img.data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return finish(canvas, THREE.NoColorSpace);
}

function grayscale(h: Float32Array, size: number, lo = 0, hi = 1): THREE.CanvasTexture {
  const [canvas, ctx] = canvas2d(size);
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < h.length; i++) {
    const v = (lo + (hi - lo) * h[i]) * 255;
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return finish(canvas, THREE.NoColorSpace);
}

// ------------------------------------------------------------
// Surfaces
// ------------------------------------------------------------

/** Wrinkled skin — dates, dried chilli, peppercorns. */
export function wrinkleNormal(): THREE.CanvasTexture {
  return memo('wrinkle-n', () => {
    const size = 256;
    const a = ridged(fbm(size, 5, 4, 11));
    const b = fbm(size, 16, 2, 29);
    const h = new Float32Array(size * size);
    for (let i = 0; i < h.length; i++) h[i] = a[i] * 0.75 + b[i] * 0.25;
    return normalFromHeight(h, size, 5.5);
  });
}

/** Wrinkles stretched along the length of the object (v direction). */
export function lengthwiseWrinkleNormal(): THREE.CanvasTexture {
  return memo('wrinkle-long-n', () => {
    const size = 256;
    const a = ridged(fbm(size, 6, 4, 41, 1, 0.22));
    const b = fbm(size, 20, 2, 7);
    const h = new Float32Array(size * size);
    for (let i = 0; i < h.length; i++) h[i] = a[i] * 0.8 + b[i] * 0.2;
    return normalFromHeight(h, size, 5);
  });
}

/** Fine, dry grain — powders and the surface of nuts. */
export function grainNormal(): THREE.CanvasTexture {
  return memo('grain-n', () => {
    const size = 256;
    const a = fbm(size, 64, 2, 3);
    const b = fbm(size, 8, 2, 90);
    const h = new Float32Array(size * size);
    for (let i = 0; i < h.length; i++) h[i] = a[i] * 0.7 + b[i] * 0.3;
    return normalFromHeight(h, size, 3);
  });
}

/** Hand-beaten brass: overlapping soft dents. */
export function hammeredNormal(): THREE.CanvasTexture {
  return memo('hammered-n', () => {
    const size = 256;
    const h = new Float32Array(size * size).fill(0.5);
    const rand = mulberry32(5);
    for (let n = 0; n < 160; n++) {
      const cx = rand() * size;
      const cy = rand() * size;
      const r = 8 + rand() * 16;
      const depth = 0.06 + rand() * 0.1;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const d = Math.hypot(dx, dy) / r;
          if (d >= 1) continue;
          const x = (Math.floor(cx + dx) + size) % size;
          const y = (Math.floor(cy + dy) + size) % size;
          h[y * size + x] -= depth * (1 - d * d) ** 2;
        }
      }
    }
    return normalFromHeight(h, size, 6);
  });
}

/** Cast bullion is never mirror-clean: fine directional scratches. */
export function bullionSurface(): { normal: THREE.CanvasTexture; roughness: THREE.CanvasTexture } {
  const normal = memo('bullion-n', () => {
    const size = 512;
    const h = fbm(size, 3, 3, 71);
    const rand = mulberry32(8);
    for (let n = 0; n < 380; n++) {
      const y = Math.floor(rand() * size);
      const x0 = Math.floor(rand() * size);
      const len = 30 + rand() * 150;
      const depth = 0.05 + rand() * 0.07;
      for (let i = 0; i < len; i++) {
        const x = (x0 + i) % size;
        const yy = (y + Math.floor((rand() - 0.5) * 1.2) + size) % size;
        h[yy * size + x] -= depth * (1 - i / len);
      }
    }
    return normalFromHeight(h, size, 2.2);
  });

  const roughness = memo('bullion-r', () => {
    const size = 256;
    const h = fbm(size, 4, 3, 19);
    return grayscale(h, size, 0.35, 0.8);
  });

  return { normal, roughness };
}

/** Plain-weave sacking: warp over weft over warp, with slubs in the yarn. */
export function juteSurface(): { color: THREE.CanvasTexture; normal: THREE.CanvasTexture } {
  const size = 512;
  const cells = 28;

  const build = () => {
    const slub = fbm(size, 6, 3, 23, 1, 2);
    const fibre = tileNoise(size, 128, 61, 1, 1);
    const height = new Float32Array(size * size);
    const tone = new Float32Array(size * size);
    const p = size / cells;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = Math.floor(x / p);
        const j = Math.floor(y / p);
        const u = (x / p) % 1;
        const v = (y / p) % 1;
        const warpOver = (i + j) % 2 === 0;
        const bump = warpOver ? Math.sin(Math.PI * u) : Math.sin(Math.PI * v);
        const s = slub[y * size + x];
        height[y * size + x] = (0.25 + 0.75 * bump) * (0.8 + 0.4 * s) + fibre[y * size + x] * 0.12;
        // Gaps between yarns sit darker; yarns brighten with their bump.
        tone[y * size + x] = 0.35 + 0.65 * bump * (0.75 + 0.5 * s);
      }
    }
    return { height, tone };
  };

  const data = (() => {
    let d: ReturnType<typeof build> | null = null;
    return () => (d ??= build());
  })();

  const normal = memo('jute-n', () => normalFromHeight(data().height, size, 4.5));

  const color = memo('jute-c', () => {
    const { tone } = data();
    const [canvas, ctx] = canvas2d(size);
    const img = ctx.createImageData(size, size);
    const dark = [92, 70, 40];
    const light = [201, 166, 108];
    for (let i = 0; i < tone.length; i++) {
      const t = Math.min(1, Math.max(0, tone[i]));
      for (let c = 0; c < 3; c++) img.data[i * 4 + c] = dark[c] + (light[c] - dark[c]) * t;
      img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return finish(canvas, THREE.SRGBColorSpace);
  });

  return { color, normal };
}

/** Almond skin: warm brown with fine lengthwise streaks. u runs around, v along. */
export function almondSkin(): { color: THREE.CanvasTexture; normal: THREE.CanvasTexture } {
  const size = 256;
  const streak = () => ridged(fbm(size, 14, 3, 33, 1, 0.12));

  const normal = memo('almond-n', () => {
    const s = streak();
    const g = fbm(size, 40, 2, 5);
    const h = new Float32Array(size * size);
    for (let i = 0; i < h.length; i++) h[i] = s[i] * 0.65 + g[i] * 0.35;
    return normalFromHeight(h, size, 3.2);
  });

  const color = memo('almond-c', () => {
    const s = streak();
    const base = fbm(size, 3, 3, 12);
    const [canvas, ctx] = canvas2d(size);
    const img = ctx.createImageData(size, size);
    const dark = [104, 62, 32];
    const light = [176, 120, 70];
    for (let i = 0; i < s.length; i++) {
      const t = Math.min(1, Math.max(0, s[i] * 0.55 + base[i] * 0.6 - 0.1));
      for (let c = 0; c < 3; c++) img.data[i * 4 + c] = dark[c] + (light[c] - dark[c]) * t;
      img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return finish(canvas, THREE.SRGBColorSpace);
  });

  return { color, normal };
}

/** Turns a flat colour into a hand-varied one — used for dried chilli. */
export function mottledColor(
  key: string,
  dark: [number, number, number],
  light: [number, number, number],
  seed: number,
  stretchY = 1
): THREE.CanvasTexture {
  return memo(`mottle-${key}`, () => {
    const size = 256;
    const a = fbm(size, 4, 4, seed, 1, stretchY);
    const [canvas, ctx] = canvas2d(size);
    const img = ctx.createImageData(size, size);
    for (let i = 0; i < a.length; i++) {
      const t = Math.min(1, Math.max(0, a[i] * 1.5 - 0.25));
      for (let c = 0; c < 3; c++) img.data[i * 4 + c] = dark[c] + (light[c] - dark[c]) * t;
      img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return finish(canvas, THREE.SRGBColorSpace);
  });
}

// ------------------------------------------------------------
// Bullion hallmark
//
// Struck letters are recessed. The mask becomes an alpha for the decal and a
// bevelled normal map, so the strike catches light on its edges instead of
// being printed on flat.
// ------------------------------------------------------------

export function hallmark(): {
  alpha: THREE.CanvasTexture;
  normal: THREE.CanvasTexture;
} {
  const W = 1024;
  const H = 512;

  const draw = (): HTMLCanvasElement => {
    const [canvas, ctx] = canvas2d(W, H);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.lineWidth = 7;
    ctx.strokeRect(46, 40, W - 92, H - 80);

    ctx.font = '800 118px "Big Shoulders Stencil", Impact, "Arial Narrow", sans-serif';
    ctx.letterSpacing = '10px';
    ctx.fillText('BARAKAH', W / 2, 150);
    ctx.font = '700 62px "Big Shoulders Stencil", Impact, "Arial Narrow", sans-serif';
    ctx.letterSpacing = '22px';
    ctx.fillText('COMMODITIES', W / 2, 232);
    ctx.letterSpacing = '0px';

    ctx.fillRect(W / 2 - 250, 288, 500, 6);

    ctx.font = '800 92px "Libre Franklin", "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('999.9', W / 2, 372);
    ctx.font = '600 38px "Libre Franklin", "Helvetica Neue", Arial, sans-serif';
    ctx.letterSpacing = '9px';
    ctx.fillText('FINE GOLD  ·  1 KG', W / 2, 440);
    ctx.letterSpacing = '0px';
    return canvas;
  };

  const heightOf = () => {
    const canvas = draw();
    const ctx = canvas.getContext('2d')!;
    const data = ctx.getImageData(0, 0, W, H).data;
    // Soften the mask so the edge has a ramp for the normal map to read.
    const mask = new Float32Array(W * H);
    for (let i = 0; i < mask.length; i++) mask[i] = data[i * 4] / 255;
    const blurred = new Float32Array(W * H);
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        let sum = 0;
        for (let oy = -2; oy <= 2; oy++) for (let ox = -2; ox <= 2; ox++) sum += mask[(y + oy) * W + (x + ox)];
        blurred[y * W + x] = sum / 25;
      }
    }
    return { mask, blurred };
  };

  const heights = (() => {
    let d: ReturnType<typeof heightOf> | null = null;
    return () => (d ??= heightOf());
  })();

  const alpha = memo('hallmark-a', () => {
    const { mask } = heights();
    const [canvas, ctx] = canvas2d(W, H);
    const img = ctx.createImageData(W, H);
    for (let i = 0; i < mask.length; i++) {
      img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = mask[i] * 255;
      img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return finish(canvas, THREE.NoColorSpace, false);
  });

  const normal = memo('hallmark-n', () => {
    const { blurred } = heights();
    const [canvas, ctx] = canvas2d(W, H);
    const img = ctx.createImageData(W, H);
    const at = (x: number, y: number) => blurred[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))];
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        // The strike is recessed, so height falls where the mask is white.
        const dx = (at(x + 1, y) - at(x - 1, y)) * -0.5 * 14;
        const dy = (at(x, y + 1) - at(x, y - 1)) * -0.5 * 14;
        const len = Math.hypot(dx, dy, 1);
        const i = (y * W + x) * 4;
        img.data[i] = ((-dx / len) * 0.5 + 0.5) * 255;
        img.data[i + 1] = ((dy / len) * 0.5 + 0.5) * 255;
        img.data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return finish(canvas, THREE.NoColorSpace, false);
  });

  return { alpha, normal };
}

/** Sack-mark lettering for the jute decal: black paint through a stencil. */
export function sackStencil(): THREE.CanvasTexture {
  return memo('sack-stencil', () => {
    const W = 512;
    const H = 512;
    const [canvas, ctx] = canvas2d(W, H);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(20, 18, 14, 0.92)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '800 150px "Big Shoulders Stencil", Impact, "Arial Narrow", sans-serif';
    ctx.fillText('BARAKAH', W / 2, 150);
    ctx.font = '700 70px "Big Shoulders Stencil", Impact, "Arial Narrow", sans-serif';
    ctx.letterSpacing = '8px';
    ctx.fillText('COMMODITIES', W / 2, 252);
    ctx.letterSpacing = '0px';
    ctx.fillRect(W / 2 - 190, 306, 380, 7);
    ctx.font = '800 64px "Big Shoulders Stencil", Impact, "Arial Narrow", sans-serif';
    ctx.fillText('SPICES  50 KG NET', W / 2, 372);

    // Paint never takes evenly through jute: knock back a scatter of the weave.
    const rand = mulberry32(77);
    ctx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 2600; i++) {
      ctx.fillStyle = `rgba(0,0,0,${0.25 + rand() * 0.6})`;
      ctx.fillRect(rand() * W, rand() * H, 1 + rand() * 3, 1 + rand() * 2);
    }
    return finish(canvas, THREE.SRGBColorSpace, false);
  });
}

/** Frees every cached GPU texture. */
export function disposeTextureCache(): void {
  cache.forEach((tex) => tex.dispose());
  cache.clear();
}
