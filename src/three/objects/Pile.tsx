// ============================================================
// Pile — hundreds of the same good in one draw call.
//
// Items arrive from `settle()` already resting where a poured heap would
// leave them. With `pour`, they fall in on first sight: each one drops from
// above its final place and bounces to rest, staggered in the order it was
// settled, so the heap builds from the middle out the way a scoop lands.
// ============================================================

import { memo, useContext, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mulberry32 } from '../textures';
import type { Settled } from '../geometry';
import { PourGateContext, useStage } from '../context';

export interface PileProps {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  items: Settled[];
  /** Scale that maps the geometry's own size to a collision radius of 1. */
  unit?: number;
  /** Lay a long (Y-axis) item flat, with a random heading. */
  lie?: boolean;
  /** Extra per-axis scale, for items that are not round. */
  stretch?: [number, number, number];
  /** Brightness wobble per item, 0..1. */
  variation?: number;
  /** Drop in on first sight instead of appearing in place. */
  pour?: boolean;
  dropHeight?: number;
  /** Seconds the whole heap takes to land. */
  pourTime?: number;
}

const FALL = 0.55;
const UNSTRETCHED: [number, number, number] = [1, 1, 1];

function bounceOut(x: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
}

function Pile({
  geometry,
  material,
  items,
  unit = 1,
  lie = false,
  stretch = UNSTRETCHED,
  variation = 0.18,
  pour = false,
  dropHeight = 1.6,
  pourTime = 1.7,
}: PileProps) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const { active, reducedMotion } = useStage();
  const gate = useContext(PourGateContext);
  const animate = pour && !reducedMotion;
  const start = useRef<number | null>(null);
  // Latched: once the goods have landed they stay landed, however often the
  // stage is paused, resumed or re-rendered around them.
  const landed = useRef(!animate);

  const base = useMemo(() => {
    const rand = mulberry32(items.length * 7919 + 13);
    return items.map((item) => {
      const q = new THREE.Quaternion();
      if (lie) {
        q.setFromEuler(
          new THREE.Euler(
            Math.PI / 2 + (rand() - 0.5) * 0.34,
            rand() * Math.PI * 2,
            (rand() - 0.5) * 0.3,
            'YXZ'
          )
        );
      } else {
        q.setFromEuler(item.rotation);
      }
      const s = item.scale / unit;
      return {
        position: item.position,
        quaternion: q,
        scale: new THREE.Vector3(s * stretch[0], s * stretch[1], s * stretch[2]),
        tone: 1 + (rand() - 0.5) * 2 * variation,
      };
    });
  }, [items, unit, lie, stretch, variation]);

  const m = useMemo(() => new THREE.Matrix4(), []);
  const p = useMemo(() => new THREE.Vector3(), []);
  const hidden = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const c = new THREE.Color();
    const waiting = animate && !landed.current;
    base.forEach((b, i) => {
      m.compose(b.position, b.quaternion, waiting ? hidden : b.scale);
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, c.setScalar(Math.min(1.25, Math.max(0.55, b.tone))));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    if (!animate) landed.current = true;
  }, [base, animate, m, hidden]);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh || landed.current || !active || !gate.current) return;
    if (start.current === null) start.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - start.current;

    let settled = true;
    const spread = Math.max(0.01, pourTime - FALL);
    for (let i = 0; i < base.length; i++) {
      const b = base[i];
      const local = (t - items[i].order * spread) / FALL;
      if (local < 1) settled = false;
      if (local <= 0) {
        m.compose(b.position, b.quaternion, hidden);
      } else {
        const k = Math.min(1, local);
        p.copy(b.position);
        p.y += (1 - bounceOut(k)) * dropHeight;
        m.compose(p, b.quaternion, b.scale);
      }
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (settled) landed.current = true;
  });

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, items.length]}
      frustumCulled={false}
      castShadow
      receiveShadow
    />
  );
}

export default memo(Pile);
