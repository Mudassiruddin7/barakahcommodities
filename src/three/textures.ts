// ============================================================
// Procedural textures — generated on the client, zero payload.
// Every map is built once and cached at module scope so that
// remounting a scene never re-rasterises a canvas.
// ============================================================

import * as THREE from 'three';

type Ctx = CanvasRenderingContext2D;

const cache = new Map<string, THREE.Texture>();

function makeCanvas(size: number): [HTMLCanvasElement, Ctx] {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context unavailable');
  return [canvas, ctx];
}

function finish(
  canvas: HTMLCanvasElement,
  repeat: number,
  colorSpace: THREE.ColorSpace = THREE.SRGBColorSpace
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.colorSpace = colorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

/** Deterministic value noise so scenes look identical across reloads. */
function hash(x: number, y: number, seed = 0): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

function memo<T extends THREE.Texture>(key: string, build: () => T): T {
  const hit = cache.get(key);
  if (hit) return hit as T;
  const tex = build();
  cache.set(key, tex);
  return tex;
}

// ------------------------------------------------------------
// Walnut / rosewood trading surface
// ------------------------------------------------------------
export function woodColorMap(): THREE.CanvasTexture {
  return memo('wood-color', () => {
    const SIZE = 512;
    const [canvas, ctx] = makeCanvas(SIZE);

    ctx.fillStyle = '#4A2F1C';
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Broad tonal bands give the plank its depth before any grain lands.
    for (let i = 0; i < 26; i++) {
      const y = (i / 26) * SIZE;
      const band = hash(i, 3.7);
      ctx.fillStyle = `rgba(${58 + band * 34}, ${36 + band * 22}, ${20 + band * 14}, 0.5)`;
      ctx.fillRect(0, y, SIZE, SIZE / 26 + 2);
    }

    // Grain: long fibres that drift, the way sawn timber actually reads.
    ctx.lineWidth = 1;
    for (let i = 0; i < 190; i++) {
      const baseY = hash(i, 11.3) * SIZE;
      const warp = 5 + hash(i, 5.1) * 16;
      const dark = hash(i, 9.9);
      ctx.strokeStyle = `rgba(${28 + dark * 26}, ${16 + dark * 16}, ${8 + dark * 10}, ${0.16 + dark * 0.3})`;
      ctx.beginPath();
      for (let x = 0; x <= SIZE; x += 8) {
        const y =
          baseY +
          Math.sin((x / SIZE) * Math.PI * 2 + i) * warp +
          Math.sin((x / SIZE) * Math.PI * 7 + i * 2.3) * (warp * 0.28);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Pores — the fine speckle that keeps close-ups from looking flat.
    for (let i = 0; i < 2600; i++) {
      const x = hash(i, 21.1) * SIZE;
      const y = hash(i, 33.7) * SIZE;
      const a = hash(i, 44.2) * 0.14;
      ctx.fillStyle = `rgba(18, 10, 5, ${a})`;
      ctx.fillRect(x, y, 1.4, 1.4);
    }

    return finish(canvas, 1);
  });
}

export function woodRoughnessMap(): THREE.CanvasTexture {
  return memo('wood-rough', () => {
    const SIZE = 256;
    const [canvas, ctx] = makeCanvas(SIZE);

    ctx.fillStyle = '#9a9a9a';
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Grain runs slightly glossier than the surrounding timber.
    for (let i = 0; i < 120; i++) {
      const baseY = hash(i, 7.7) * SIZE;
      const v = Math.floor(120 + hash(i, 13.3) * 90);
      ctx.strokeStyle = `rgba(${v}, ${v}, ${v}, 0.5)`;
      ctx.lineWidth = 1 + hash(i, 3.3) * 2;
      ctx.beginPath();
      for (let x = 0; x <= SIZE; x += 8) {
        const y = baseY + Math.sin((x / SIZE) * Math.PI * 2 + i) * 8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    return finish(canvas, 1, THREE.NoColorSpace);
  });
}

// ------------------------------------------------------------
// Jute / hessian sacking
// ------------------------------------------------------------
export function juteMap(): THREE.CanvasTexture {
  return memo('jute', () => {
    const SIZE = 256;
    const [canvas, ctx] = makeCanvas(SIZE);

    ctx.fillStyle = '#9A7C4A';
    ctx.fillRect(0, 0, SIZE, SIZE);

    const step = 6;
    for (let i = 0; i * step < SIZE; i++) {
      const p = i * step;
      const warp = hash(i, 2.2);
      ctx.fillStyle = `rgba(${120 + warp * 40}, ${96 + warp * 34}, ${56 + warp * 24}, 0.85)`;
      ctx.fillRect(p, 0, step * 0.55, SIZE);
      const weft = hash(i, 8.8);
      ctx.fillStyle = `rgba(${96 + weft * 36}, ${76 + weft * 28}, ${42 + weft * 20}, 0.6)`;
      ctx.fillRect(0, p, SIZE, step * 0.55);
    }

    for (let i = 0; i < 1800; i++) {
      const x = hash(i, 55.1) * SIZE;
      const y = hash(i, 66.3) * SIZE;
      ctx.fillStyle = `rgba(60, 44, 22, ${hash(i, 77.7) * 0.2})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    return finish(canvas, 1);
  });
}

// ------------------------------------------------------------
// Ledger paper
// ------------------------------------------------------------
export function paperMap(): THREE.CanvasTexture {
  return memo('paper', () => {
    const SIZE = 256;
    const [canvas, ctx] = makeCanvas(SIZE);

    ctx.fillStyle = '#EDE4CE';
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Fibre flecks
    for (let i = 0; i < 2200; i++) {
      const x = hash(i, 12.4) * SIZE;
      const y = hash(i, 24.8) * SIZE;
      const a = hash(i, 36.1) * 0.09;
      ctx.fillStyle = `rgba(120, 100, 62, ${a})`;
      ctx.fillRect(x, y, 1.3, 1.3);
    }

    // Ruled lines — a ledger, not a notepad: faint and evenly spaced.
    ctx.strokeStyle = 'rgba(90, 108, 96, 0.30)';
    ctx.lineWidth = 1;
    for (let y = 22; y < SIZE; y += 18) {
      ctx.beginPath();
      ctx.moveTo(14, y);
      ctx.lineTo(SIZE - 14, y);
      ctx.stroke();
    }

    // Single ruled margin
    ctx.strokeStyle = 'rgba(150, 88, 70, 0.35)';
    ctx.beginPath();
    ctx.moveTo(34, 8);
    ctx.lineTo(34, SIZE - 8);
    ctx.stroke();

    return finish(canvas, 1);
  });
}

// ------------------------------------------------------------
// Brass / hammered metal roughness variation
// ------------------------------------------------------------
export function hammeredRoughness(): THREE.CanvasTexture {
  return memo('hammered', () => {
    const SIZE = 256;
    const [canvas, ctx] = makeCanvas(SIZE);

    ctx.fillStyle = '#6f6f6f';
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Overlapping soft dents read as hand-beaten metal under reflection.
    for (let i = 0; i < 220; i++) {
      const x = hash(i, 4.4) * SIZE;
      const y = hash(i, 9.2) * SIZE;
      const r = 6 + hash(i, 15.6) * 14;
      const v = Math.floor(70 + hash(i, 19.4) * 110);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${v},${v},${v},0.55)`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    return finish(canvas, 1, THREE.NoColorSpace);
  });
}

// ------------------------------------------------------------
// Fine surface noise used as a normal-ish roughness break-up on gold
// ------------------------------------------------------------
export function brushedGoldRoughness(): THREE.CanvasTexture {
  return memo('gold-rough', () => {
    const SIZE = 256;
    const [canvas, ctx] = makeCanvas(SIZE);

    ctx.fillStyle = '#3d3d3d';
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Horizontal micro-scratches: cast bullion is never mirror-clean.
    for (let i = 0; i < 900; i++) {
      const y = hash(i, 6.6) * SIZE;
      const x = hash(i, 8.1) * SIZE;
      const len = 8 + hash(i, 3.9) * 60;
      const v = Math.floor(40 + hash(i, 11.1) * 90);
      ctx.strokeStyle = `rgba(${v},${v},${v},0.4)`;
      ctx.lineWidth = hash(i, 2.4) > 0.7 ? 1.5 : 0.8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y + (hash(i, 17.3) - 0.5) * 2);
      ctx.stroke();
    }

    return finish(canvas, 1, THREE.NoColorSpace);
  });
}

/** Frees every cached GPU texture. Called when the last scene unmounts. */
export function disposeTextureCache(): void {
  cache.forEach((tex) => tex.dispose());
  cache.clear();
}

// ------------------------------------------------------------
// Bullion hallmark — struck into the top face of the ingot.
// Canvas 2D text uses system fonts, so nothing is fetched.
// ------------------------------------------------------------
export function bullionStampMap(): THREE.CanvasTexture {
  return memo('bullion-stamp', () => {
    const W = 512;
    const H = 256;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context unavailable');

    ctx.clearRect(0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const strike = 'rgba(58, 42, 12, 0.62)';

    // Hairline frame, inset like a real die strike
    ctx.strokeStyle = 'rgba(58, 42, 12, 0.34)';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 26, W - 60, H - 52);

    ctx.fillStyle = strike;
    ctx.font = '600 34px Georgia, "Times New Roman", serif';
    ctx.fillText('BARAKAH', W / 2, 78);

    ctx.font = '500 17px Georgia, serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('COMMODITIES', W / 2, 112);
    ctx.letterSpacing = '0px';

    // Divider rule
    ctx.strokeStyle = 'rgba(58, 42, 12, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 90, 138);
    ctx.lineTo(W / 2 + 90, 138);
    ctx.stroke();

    ctx.font = '600 24px Georgia, serif';
    ctx.fillText('999.9  FINE GOLD', W / 2, 168);

    ctx.font = '400 15px Georgia, serif';
    ctx.fillStyle = 'rgba(58, 42, 12, 0.45)';
    ctx.fillText('PHYSICAL  ·  ALLOCATED', W / 2, 200);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  });
}
