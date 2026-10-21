// ============================================================
// Geometry — the shapes of the goods, built in code.
//
// Nothing here is a model file. Each good is a primitive that has been
// pushed around by noise until it stops looking like a primitive, plus a
// settling routine that drops items into a heap one at a time the way a
// scoop of peppercorns actually lands.
// ============================================================

import * as THREE from 'three';
import { mulberry32 } from './textures';

// ------------------------------------------------------------
// 3D value noise
// ------------------------------------------------------------

function h3(x: number, y: number, z: number, seed: number): number {
  let h =
    Math.imul(x | 0, 374761393) +
    Math.imul(y | 0, 668265263) +
    Math.imul(z | 0, 2147483647) +
    Math.imul(seed | 0, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const sm = (t: number) => t * t * (3 - 2 * t);

export function noise3(x: number, y: number, z: number, seed = 0): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const z0 = Math.floor(z);
  const tx = sm(x - x0);
  const ty = sm(y - y0);
  const tz = sm(z - z0);
  const l = (a: number, b: number, t: number) => a + (b - a) * t;
  return l(
    l(
      l(h3(x0, y0, z0, seed), h3(x0 + 1, y0, z0, seed), tx),
      l(h3(x0, y0 + 1, z0, seed), h3(x0 + 1, y0 + 1, z0, seed), tx),
      ty
    ),
    l(
      l(h3(x0, y0, z0 + 1, seed), h3(x0 + 1, y0, z0 + 1, seed), tx),
      l(h3(x0, y0 + 1, z0 + 1, seed), h3(x0 + 1, y0 + 1, z0 + 1, seed), tx),
      ty
    ),
    tz
  );
}

export function fbm3(x: number, y: number, z: number, octaves = 3, seed = 0): number {
  let sum = 0;
  let amp = 1;
  let total = 0;
  let f = 1;
  for (let o = 0; o < octaves; o++) {
    sum += noise3(x * f, y * f, z * f, seed + o * 31) * amp;
    total += amp;
    amp *= 0.5;
    f *= 2;
  }
  return sum / total;
}

// ------------------------------------------------------------
// Displacement with corrected normals
// ------------------------------------------------------------

/**
 * Pushes every vertex along its normal by `field(position)` and rebuilds the
 * normals from the field's gradient. Computing the normal analytically (rather
 * than with computeVertexNormals) keeps UV seams from showing as creases.
 */
export function displace(
  geo: THREE.BufferGeometry,
  field: (x: number, y: number, z: number) => number,
  amount: number
): THREE.BufferGeometry {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const nor = geo.attributes.normal as THREE.BufferAttribute;
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  const g = new THREE.Vector3();
  const e = 0.01;

  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    n.fromBufferAttribute(nor, i);
    const d = field(p.x, p.y, p.z) * amount;

    g.set(
      (field(p.x + e, p.y, p.z) - field(p.x - e, p.y, p.z)) / (2 * e),
      (field(p.x, p.y + e, p.z) - field(p.x, p.y - e, p.z)) / (2 * e),
      (field(p.x, p.y, p.z + e) - field(p.x, p.y, p.z - e)) / (2 * e)
    ).multiplyScalar(amount);
    // Only the part of the gradient that lies along the surface tilts it.
    g.addScaledVector(n, -g.dot(n));

    p.addScaledVector(n, d);
    n.sub(g).normalize();
    pos.setXYZ(i, p.x, p.y, p.z);
    nor.setXYZ(i, n.x, n.y, n.z);
  }

  pos.needsUpdate = true;
  nor.needsUpdate = true;
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return geo;
}

// ------------------------------------------------------------
// The goods
// ------------------------------------------------------------

/** Black pepper: a wrinkled ball. Radius 1 — scale per instance. */
export function peppercornGeometry(): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(1, 3);
  // Icosahedron detail 3 is non-indexed with unique verts per face: merge normals
  // by position so the displaced surface shades smoothly.
  return displace(
    geo,
    (x, y, z) => {
      const ridge = 1 - Math.abs(fbm3(x * 2.2, y * 2.2, z * 2.2, 3, 4) * 2 - 1);
      return ridge - 0.5;
    },
    0.2
  );
}

/** Lathe profile → closed ovoid, long axis +Y, length 1. */
function ovoid(
  radius: (t: number) => number,
  radial: number,
  rings: number
): THREE.LatheGeometry {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= rings; i++) {
    const t = i / rings;
    pts.push(new THREE.Vector2(Math.max(radius(t), 0.0001), t - 0.5));
  }
  return new THREE.LatheGeometry(pts, radial);
}

/** Almond: a flattened teardrop with a lengthwise seam. Length 1 on Y. */
export function almondGeometry(): THREE.BufferGeometry {
  const geo = ovoid((t) => 0.285 * Math.sin(Math.PI * t ** 0.72) * (1 - 0.18 * t), 36, 28);
  geo.scale(1, 1, 0.58);
  displace(
    geo,
    (x, y, z) => {
      const a = Math.atan2(z, x);
      return (
        0.35 * Math.sin(a * 7 + y * 1.5) + 0.5 * fbm3(x * 5, y * 5, z * 5, 3, 2) - 0.2
      );
    },
    0.012
  );
  // A slight bow, the way almonds curl along their length.
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    pos.setZ(i, pos.getZ(i) + 0.09 * (0.25 - y * y));
  }
  pos.needsUpdate = true;
  return geo;
}

/** Medjool-style date: a plump, wrinkled oblong. Length 1 on Y. */
export function dateGeometry(): THREE.BufferGeometry {
  const geo = ovoid((t) => 0.29 * Math.sqrt(Math.max(0, 1 - Math.pow(2 * t - 1, 4))), 40, 32);
  geo.scale(1, 1, 0.86);
  displace(
    geo,
    (x, y, z) => {
      const r = 1 - Math.abs(fbm3(x * 6, y * 3.2, z * 6, 3, 8) * 2 - 1);
      return r - 0.5;
    },
    0.03
  );
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    pos.setX(i, pos.getX(i) + 0.07 * (0.25 - y * y));
  }
  pos.needsUpdate = true;
  return geo;
}

/** Pistachio in its shell: a small pointed ovoid with a seam. Length 1 on Y. */
export function pistachioGeometry(): THREE.BufferGeometry {
  const geo = ovoid((t) => 0.34 * Math.sin(Math.PI * t ** 0.85) ** 0.9, 32, 22);
  geo.scale(1, 1, 0.78);
  displace(
    geo,
    (x, y, z) => {
      const a = Math.atan2(z, x);
      return 0.5 * Math.cos(a * 2) + 0.35 * fbm3(x * 7, y * 7, z * 7, 2, 5) - 0.2;
    },
    0.02
  );
  return geo;
}

/** Cardamom pod: six-ridged, tapering to both ends. Length 1 on Y. */
export function cardamomGeometry(): THREE.BufferGeometry {
  const geo = ovoid((t) => 0.2 * Math.sin(Math.PI * t ** 0.9) ** 0.85, 18, 18);
  displace(
    geo,
    (x, _y, z) => {
      const a = Math.atan2(z, x);
      return Math.abs(Math.sin(a * 3)) - 0.4;
    },
    0.04
  );
  return geo;
}

interface TubeOptions {
  points: THREE.Vector3[];
  radius: (t: number) => number;
  /** Optional tint along the length, 0..1 per channel; multiplies the material colour. */
  tint?: (t: number) => [number, number, number];
  tubular?: number;
  radial?: number;
}

/** A tube whose radius varies along its length — chillies, roots, quills. */
export function profileTube({
  points,
  radius,
  tint,
  tubular = 56,
  radial = 14,
}: TubeOptions): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
  const frames = curve.computeFrenetFrames(tubular, false);
  const length = curve.getLength();
  const step = 0.004;
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const P = new THREE.Vector3();
  const N = new THREE.Vector3();

  for (let i = 0; i <= tubular; i++) {
    const t = i / tubular;
    curve.getPointAt(t, P);
    const r = radius(t);
    const c = tint ? tint(t) : [1, 1, 1];
    // How fast the radius changes per unit of length tilts the surface normal
    // away from the ring: the flare of a calyx must not shade like a cylinder.
    const slope =
      (radius(Math.min(1, t + step)) - radius(Math.max(0, t - step))) /
      ((Math.min(1, t + step) - Math.max(0, t - step)) * length);
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      N.copy(frames.normals[i]).multiplyScalar(Math.cos(a)).addScaledVector(frames.binormals[i], Math.sin(a));
      positions.push(P.x + N.x * r, P.y + N.y * r, P.z + N.z * r);
      N.addScaledVector(frames.tangents[i], -slope).normalize();
      normals.push(N.x, N.y, N.z);
      uvs.push(j / radial, t);
      colors.push(c[0], c[1], c[2]);
    }
  }

  for (let i = 0; i < tubular; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j;
      const b = (i + 1) * (radial + 1) + j;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  if (tint) geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  return geo;
}

/** Dried red chilli with a woody stem. Length ≈ 1 along its curve. */
export function chilliGeometry(seed = 1): THREE.BufferGeometry {
  const rand = mulberry32(seed);
  const bend = 0.12 + rand() * 0.14;
  const pts = [
    new THREE.Vector3(0, 0.06, 0),
    new THREE.Vector3(0.015, -0.02, bend * 0.15),
    new THREE.Vector3(0.05, -0.28, bend * 0.55),
    new THREE.Vector3(0.02, -0.6, bend),
    new THREE.Vector3(-0.09, -0.86, bend * 0.9),
    new THREE.Vector3(-0.2, -1.02, bend * 0.55),
  ];
  const geo = profileTube({
    points: pts,
    tubular: 72,
    radial: 14,
    // Woody brown stem, fading into the red of the pod at the shoulder.
    tint: (t) => {
      const k = Math.min(1, Math.max(0, (t - 0.11) / 0.12));
      return [0.4 + 0.6 * k, 0.28 + 0.72 * k, 0.18 + 0.82 * k];
    },
    // One continuous profile: a thin stem, a shoulder that swells into the body,
    // then a long taper to the tip. No flange where the calyx meets the pod.
    radius: (t) => {
      const smooth = (x: number) => x * x * (3 - 2 * x);
      const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
      const stem = 0.02;
      const peak = 0.15;
      const swell = smooth(clamp01((t - 0.07) / 0.24));
      let r = stem + (peak - stem) * swell;
      if (t > 0.3) r = peak * Math.pow(1 - clamp01((t - 0.3) / 0.7), 0.82);
      r *= 1 + 0.04 * Math.sin(t * 38 + seed) * swell;
      // close both ends so the tube is never open
      return Math.max(0.003, r) * Math.min(1, t / 0.012) * Math.min(1, (1 - t) / 0.02);
    },
  });
  geo.center();
  return geo;
}

/** Whole turmeric finger: knobbly, ringed, slightly bent. */
export function turmericGeometry(seed = 3): THREE.BufferGeometry {
  const rand = mulberry32(seed);
  const b = (rand() - 0.5) * 0.12;
  const geo = profileTube({
    points: [
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(b, 0.17, 0.03),
      new THREE.Vector3(b * 1.3, -0.2, -0.02),
      new THREE.Vector3(b * 0.7, -0.5, 0),
    ],
    tubular: 40,
    radial: 20,
    radius: (t) => {
      const cap = Math.sin(Math.PI * t) ** 0.45;
      return 0.165 * cap * (1 + 0.035 * Math.sin(t * 38 + seed * 2));
    },
  });
  return displace(geo, (x, y, z) => fbm3(x * 9, y * 9, z * 9, 3, seed) - 0.5, 0.03);
}

/** Star anise: eight boat-shaped pods around a hub. Lies in the XY plane. */
export function starAniseGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const arms = 8;
  const steps = 160;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const lobe = Math.abs(Math.cos((a * arms) / 2));
    const r = 0.16 + 0.34 * lobe ** 1.5;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.035,
    bevelSegments: 3,
    curveSegments: 1,
  });
  geo.center();
  geo.rotateX(-Math.PI / 2);
  return geo;
}

/** Cinnamon quill: a rolled bark tube with a visible seam. Length 1 on Y. */
export function cinnamonGeometry(): THREE.BufferGeometry {
  const geo = new THREE.CylinderGeometry(0.07, 0.066, 1, 24, 16, true);
  displace(
    geo,
    (x, y, z) => {
      const a = Math.atan2(z, x);
      return 0.5 * Math.sin(a * 2.0) + 0.5 * fbm3(x * 12, y * 8, z * 12, 2, 6) - 0.25;
    },
    0.02
  );
  return geo;
}

// ------------------------------------------------------------
// Vessels and containers
// ------------------------------------------------------------

/** Cast bar: tapered cross-section, rounded edges, sloped ends. Long axis X, sitting on y=0. */
export function ingotGeometry(width = 1, height = 0.3, length = 1.95): THREE.BufferGeometry {
  const topWidth = width * 0.8;
  const s = new THREE.Shape();
  s.moveTo(-width / 2, 0);
  s.lineTo(width / 2, 0);
  s.lineTo(topWidth / 2, height);
  s.lineTo(-topWidth / 2, height);
  s.closePath();

  const bevel = 0.05;
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: length - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 6,
    curveSegments: 1,
  });
  geo.translate(0, bevel, -(length - bevel * 2) / 2);

  // Cast bars slope at the ends as well as the sides.
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const t = THREE.MathUtils.clamp(pos.getY(i) / (height + bevel * 2), 0, 1);
    pos.setZ(i, pos.getZ(i) * (1 - 0.085 * t));
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  geo.rotateY(Math.PI / 2);
  geo.computeBoundingBox();
  return geo;
}

/** Lathe from [radius, y] pairs, smoothed with a spline. */
export function lathe(profile: [number, number][], segments = 64, samples = 48): THREE.LatheGeometry {
  const curve = new THREE.SplineCurve(profile.map(([r, y]) => new THREE.Vector2(r, y)));
  return new THREE.LatheGeometry(curve.getPoints(samples), segments);
}

/** Open jute sack, top rolled down into a fat collar. Base on y=0, ~1.2 tall. */
export function sackGeometry(): THREE.BufferGeometry {
  const profile: [number, number][] = [
    [0.001, 0.0],
    [0.4, 0.015],
    [0.58, 0.1],
    [0.66, 0.34],
    [0.68, 0.62],
    [0.64, 0.86],
    [0.6, 1.0],
    [0.64, 1.08],
    [0.71, 1.07],
    [0.74, 0.99],
    [0.69, 0.93],
    [0.58, 0.97],
    [0.54, 0.9],
    [0.53, 0.78],
    [0.001, 0.76],
  ];
  const geo = lathe(profile, 72, 90);
  // Fabric slumps: broad folds that taper toward the base, a little noise on top.
  return displace(
    geo,
    (x, y, z) => {
      const a = Math.atan2(z, x);
      const fold = 0.5 + 0.5 * Math.sin(a * 5 + y * 3.1) * (0.35 + 0.65 * Math.min(1, y / 0.7));
      return fold * 0.55 + 0.45 * fbm3(x * 3.2, y * 3.2, z * 3.2, 3, 14) - 0.4;
    },
    0.1
  );
}

/** Shallow hammered brass dish: bowl and rolled rim in one lathe. */
export function bowlGeometry(radius = 1, depth = 0.38): THREE.BufferGeometry {
  const r = radius;
  const profile: [number, number][] = [
    [0.001, 0.02],
    [r * 0.45, 0.025],
    [r * 0.78, depth * 0.25],
    [r * 0.95, depth * 0.72],
    [r * 1.0, depth * 0.98],
    [r * 1.03, depth * 1.04],
    [r * 1.0, depth * 1.08],
    [r * 0.96, depth * 1.03],
    [r * 0.92, depth * 0.94],
    [r * 0.74, depth * 0.3],
    [r * 0.4, 0.06],
    [0.001, 0.06],
  ];
  return lathe(profile, 72, 80);
}

/** A bell-shaped brass weight with a ball finial. */
export function weightGeometry(): THREE.BufferGeometry {
  return lathe(
    [
      [0.001, 0],
      [0.27, 0],
      [0.285, 0.02],
      [0.25, 0.2],
      [0.17, 0.32],
      [0.11, 0.36],
      [0.1, 0.4],
      [0.12, 0.46],
      [0.1, 0.52],
      [0.001, 0.54],
    ],
    48,
    64
  );
}

// ------------------------------------------------------------
// Settling — dropping items into a heap
// ------------------------------------------------------------

export interface Settled {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  /** Uniform scale = the item's own radius. */
  scale: number;
  /** 0..1 stagger for pour animations, in drop order. */
  order: number;
}

export interface SettleOptions {
  count: number;
  seed: number;
  /** Item radius, with ±jitter (fraction). */
  radius: number;
  jitter?: number;
  /** Where the stream lands, and how widely it scatters. */
  center?: [number, number];
  spread?: number;
  /** The container floor: y of the surface at (x, z). Defaults to flat 0. */
  floor?: (x: number, z: number) => number;
  /** Items rolling past this radius from the centre are pulled back in. */
  limit?: number;
}

/**
 * Random sequential deposition with rolling. Each item falls from above its
 * landing point, rests on whatever is highest beneath it, then rolls downhill
 * if it came to rest on a slope. The result is a heap with a believable angle
 * of repose rather than a scatter of floating spheres.
 */
export function settle({
  count,
  seed,
  radius,
  jitter = 0.18,
  center = [0, 0],
  spread = 0.25,
  floor = () => 0,
  limit = Infinity,
}: SettleOptions): Settled[] {
  const rand = mulberry32(seed);
  const gauss = () => (rand() + rand() + rand() + rand() - 2) / 0.58;
  const items: { x: number; y: number; z: number; r: number }[] = [];

  const restHeight = (x: number, z: number, r: number): number => {
    let y = floor(x, z) + r;
    for (const o of items) {
      const dx = x - o.x;
      const dz = z - o.z;
      const d2 = dx * dx + dz * dz;
      const min = (r + o.r) * 0.92;
      if (d2 < min * min) y = Math.max(y, o.y + Math.sqrt(Math.max(0, min * min - d2)));
    }
    return y;
  };

  const out: Settled[] = [];

  for (let n = 0; n < count; n++) {
    const r = radius * (1 + (rand() - 0.5) * 2 * jitter);
    let x = center[0] + gauss() * spread;
    let z = center[1] + gauss() * spread;
    let y = restHeight(x, z, r);

    for (let step = 0; step < 14; step++) {
      let bestY = y;
      let bestX = x;
      let bestZ = z;
      for (let k = 0; k < 6; k++) {
        const a = rand() * Math.PI * 2;
        const cx = x + Math.cos(a) * r * 0.75;
        const cz = z + Math.sin(a) * r * 0.75;
        if (Math.hypot(cx - center[0], cz - center[1]) > limit) continue;
        const cy = restHeight(cx, cz, r);
        if (cy < bestY - r * 0.12) {
          bestY = cy;
          bestX = cx;
          bestZ = cz;
        }
      }
      if (bestX === x && bestZ === z) break;
      x = bestX;
      z = bestZ;
      y = bestY;
    }

    items.push({ x, y, z, r });
    out.push({
      position: new THREE.Vector3(x, y, z),
      rotation: new THREE.Euler(rand() * Math.PI * 2, rand() * Math.PI * 2, rand() * Math.PI * 2),
      scale: r,
      order: n / Math.max(1, count - 1),
    });
  }

  return out;
}

// ------------------------------------------------------------
// Hand placement — for long goods that a sphere-settle cannot place
// ------------------------------------------------------------

export interface PlacedItem {
  x: number;
  z: number;
  /** Heading about the vertical axis, radians. */
  yaw: number;
  /** Height of the item's axis above the table. */
  y?: number;
  /** Rolls the item off horizontal (radians). */
  tilt?: number;
  scale?: number;
}

/** Items lying on their side at explicit spots. Their long axis is geometry Y. */
export function placed(list: PlacedItem[], defaultY = 0.08): Settled[] {
  return list.map((it, i) => ({
    position: new THREE.Vector3(it.x, it.y ?? defaultY, it.z),
    rotation: new THREE.Euler(Math.PI / 2 + (it.tilt ?? 0), it.yaw, 0, 'YXZ'),
    scale: it.scale ?? 1,
    order: i / Math.max(1, list.length - 1),
  }));
}
