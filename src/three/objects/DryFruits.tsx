// ============================================================
// DryFruits — almonds, dates, pistachios and walnuts.
//
// Each kind gets its own silhouette rather than a recoloured
// sphere. Irregularity is deterministic, so the arrangement is
// identical on every load but never looks repeated.
// ============================================================

import { memo, useMemo } from 'react';
import * as THREE from 'three';

export interface DryFruitsProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  detail?: 'high' | 'low';
}

function rnd(i: number, salt: number): number {
  const n = Math.sin(i * 45.164 + salt * 91.377) * 43758.5453;
  return n - Math.floor(n);
}

/** Sphere tapered to a point at +Z and flattened — an almond. */
function almondGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.5, 14, 10);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const t = (z + 0.5) / 1; // 0 at back, 1 at tip
    const taper = 1 - Math.pow(t, 2.1) * 0.86;
    pos.setX(i, x * taper * 0.62);
    pos.setY(i, y * taper * 0.46);
    pos.setZ(i, z * 1.35);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/** Ellipsoid with a subtle wrinkle — a date. */
function dateGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.5, 16, 12);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const wrinkle = 1 + Math.sin(z * 14) * 0.035 + Math.sin(y * 11) * 0.025;
    pos.setX(i, x * 0.58 * wrinkle);
    pos.setY(i, y * 0.55 * wrinkle);
    pos.setZ(i, z * 1.25 * wrinkle);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/** Lobed nut with a seam — a walnut half. */
function walnutGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.5, 16, 12);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const lobes = 1 + Math.sin(Math.atan2(v.z, v.x) * 4) * 0.07;
    const bumps = 1 + Math.sin(v.y * 18) * 0.03;
    v.multiplyScalar(lobes * bumps);
    v.y *= 0.82;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

type Kind = 'almond' | 'date' | 'pistachio' | 'walnut';

interface Piece {
  kind: Kind;
  p: [number, number, number];
  r: [number, number, number];
  s: number;
}

const LAYOUT: Piece[] = [
  { kind: 'date', p: [0.0, 0.055, 0.02], r: [0, 0.4, 0.1], s: 1 },
  { kind: 'date', p: [0.17, 0.052, -0.14], r: [0.1, -0.9, 0], s: 0.92 },
  { kind: 'date', p: [-0.19, 0.05, 0.13], r: [0, 1.5, -0.08], s: 0.96 },
  { kind: 'almond', p: [0.3, 0.028, 0.22], r: [0, 0.8, 0], s: 1 },
  { kind: 'almond', p: [-0.32, 0.028, -0.06], r: [0, -0.5, 0.05], s: 0.94 },
  { kind: 'almond', p: [0.08, 0.028, 0.33], r: [0, 2.1, 0], s: 1.04 },
  { kind: 'almond', p: [-0.06, 0.028, -0.31], r: [0, 1.1, 0], s: 0.9 },
  { kind: 'walnut', p: [0.42, 0.06, -0.28], r: [0, 0.6, 0], s: 1 },
  { kind: 'walnut', p: [-0.44, 0.058, 0.3], r: [0, -1.2, 0], s: 0.88 },
  { kind: 'pistachio', p: [0.26, 0.03, -0.42], r: [0, 0.3, 0], s: 1 },
  { kind: 'pistachio', p: [-0.15, 0.03, 0.44], r: [0, -0.7, 0], s: 0.95 },
  { kind: 'pistachio', p: [0.46, 0.03, 0.08], r: [0, 1.9, 0], s: 0.9 },
];

function DryFruits({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  detail = 'high',
}: DryFruitsProps) {
  const almond = useMemo(almondGeometry, []);
  const date = useMemo(dateGeometry, []);
  const walnut = useMemo(walnutGeometry, []);

  const pieces = useMemo(
    () => (detail === 'high' ? LAYOUT : LAYOUT.filter((_, i) => i % 2 === 0)),
    [detail]
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {pieces.map((piece, i) => {
        // Small per-piece jitter so no two of a kind sit identically.
        const jitter = (rnd(i, 3) - 0.5) * 0.06;
        const tilt = (rnd(i, 5) - 0.5) * 0.35;
        const key = `${piece.kind}-${i}`;

        if (piece.kind === 'almond') {
          return (
            <mesh
              key={key}
              geometry={almond}
              position={[piece.p[0] + jitter, piece.p[1], piece.p[2]]}
              rotation={[piece.r[0] + tilt * 0.3, piece.r[1], piece.r[2]]}
              scale={0.19 * piece.s}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial
                color={i % 3 === 0 ? '#B98A5C' : '#C89A6B'}
                roughness={0.72}
                metalness={0}
                envMapIntensity={0.7}
              />
            </mesh>
          );
        }

        if (piece.kind === 'date') {
          return (
            <mesh
              key={key}
              geometry={date}
              position={[piece.p[0] + jitter, piece.p[1], piece.p[2]]}
              rotation={[piece.r[0], piece.r[1], piece.r[2] + tilt * 0.2]}
              scale={0.2 * piece.s}
              castShadow
              receiveShadow
            >
              {/* Dates are faintly glossy — the sheen is what identifies them. */}
              <meshPhysicalMaterial
                color="#4B2A16"
                roughness={0.42}
                metalness={0}
                clearcoat={0.4}
                clearcoatRoughness={0.55}
                envMapIntensity={0.9}
              />
            </mesh>
          );
        }

        if (piece.kind === 'walnut') {
          return (
            <mesh
              key={key}
              geometry={walnut}
              position={[piece.p[0] + jitter, piece.p[1], piece.p[2]]}
              rotation={[piece.r[0], piece.r[1], piece.r[2]]}
              scale={0.145 * piece.s}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color="#8A6A44" roughness={0.86} metalness={0} />
            </mesh>
          );
        }

        // Pistachio: a split shell, the two halves parted just enough to read.
        return (
          <group
            key={key}
            position={[piece.p[0] + jitter, piece.p[1], piece.p[2]]}
            rotation={[piece.r[0], piece.r[1], piece.r[2]]}
            scale={0.13 * piece.s}
          >
            <mesh position={[0, 0, 0.06]} scale={[0.72, 0.62, 1.1]} castShadow>
              <sphereGeometry args={[0.5, 12, 8, 0, Math.PI]} />
              <meshStandardMaterial
                color="#D9CDA8"
                roughness={0.78}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh
              position={[0, 0, -0.06]}
              rotation={[0, Math.PI, 0]}
              scale={[0.72, 0.62, 1.1]}
              castShadow
            >
              <sphereGeometry args={[0.5, 12, 8, 0, Math.PI]} />
              <meshStandardMaterial
                color="#D2C49E"
                roughness={0.78}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Kernel glimpsed through the split */}
            <mesh scale={[0.52, 0.46, 0.9]}>
              <sphereGeometry args={[0.5, 10, 8]} />
              <meshStandardMaterial color="#7E8F4B" roughness={0.7} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default memo(DryFruits);
