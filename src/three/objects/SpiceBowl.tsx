// ============================================================
// SpiceBowl — a hammered brass bowl heaped with ground spice,
// with whole cinnamon quills and star anise resting alongside.
//
// The heap is one instanced mesh: ~180 grains at the cost of a
// single draw call, with per-instance colour so the pile has the
// tonal variation real turmeric and chilli actually show.
// ============================================================

import { memo, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { hammeredRoughness } from '../textures';

export interface SpiceBowlProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** Warm chilli-and-turmeric mix, or the darker whole-spice palette. */
  blend?: 'turmeric' | 'chilli' | 'pepper';
  /** Low tier halves the grain count. */
  detail?: 'high' | 'low';
}

// Ground spice is darker and more varied than the powder people picture.
// Keeping the range wide is what stops the heap reading as uniform beads.
const PALETTES: Record<NonNullable<SpiceBowlProps['blend']>, string[]> = {
  turmeric: ['#A8630F', '#B87218', '#8F5209', '#C4801F', '#7C4506', '#9B5C0C'],
  chilli: ['#8A2410', '#9E2F14', '#6F1B08', '#A83C18', '#5E1505', '#7A1F0A'],
  pepper: ['#3E2C1D', '#4C3826', '#2E2013', '#584330', '#241809', '#3A2A18'],
};

function deterministic(i: number, salt: number): number {
  const n = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

/** Shallow bowl revolved from a hand-drawn profile. */
function useBowlGeometry(): THREE.LatheGeometry {
  return useMemo(() => {
    const profile: THREE.Vector2[] = [
      new THREE.Vector2(0.0, 0.03),
      new THREE.Vector2(0.13, 0.022),
      new THREE.Vector2(0.26, 0.048),
      new THREE.Vector2(0.35, 0.098),
      new THREE.Vector2(0.4, 0.16),
      new THREE.Vector2(0.425, 0.168), // rim lip
      new THREE.Vector2(0.415, 0.145),
      new THREE.Vector2(0.375, 0.085),
      new THREE.Vector2(0.28, 0.026),
      new THREE.Vector2(0.14, 0.004),
      new THREE.Vector2(0.0, 0.0),
    ];
    const geo = new THREE.LatheGeometry(profile, 48);
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function SpiceBowl({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  blend = 'turmeric',
  detail = 'high',
}: SpiceBowlProps) {
  const bowl = useBowlGeometry();
  const roughnessMap = useMemo(() => hammeredRoughness(), []);
  const grainsRef = useRef<THREE.InstancedMesh>(null);

  // Many small grains, not a few large ones: size is what made an early
  // version of this read as popcorn rather than powder.
  const count = detail === 'high' ? 420 : 180;
  const palette = PALETTES[blend];

  // Grains form a shallow dome: radius falls off as height rises, which is
  // how a poured heap of powder actually settles.
  const placements = useMemo(() => {
    const out: { p: THREE.Vector3; s: number; r: THREE.Euler; c: THREE.Color }[] = [];
    for (let i = 0; i < count; i++) {
      const a = deterministic(i, 1) * Math.PI * 2;
      const rNorm = Math.sqrt(deterministic(i, 2)); // even area distribution
      const radius = rNorm * 0.345;
      // A poured heap settles to a low dome, not a cone.
      const dome = Math.cos(rNorm * Math.PI * 0.5);
      const y = 0.045 + dome * 0.05 + deterministic(i, 3) * 0.012;
      out.push({
        p: new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius),
        s: 0.007 + deterministic(i, 4) * 0.011,
        r: new THREE.Euler(
          deterministic(i, 5) * Math.PI,
          deterministic(i, 6) * Math.PI,
          deterministic(i, 7) * Math.PI
        ),
        c: new THREE.Color(palette[Math.floor(deterministic(i, 8) * palette.length)]),
      });
    }
    return out;
  }, [count, palette]);

  useLayoutEffect(() => {
    const mesh = grainsRef.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    placements.forEach((g, i) => {
      q.setFromEuler(g.r);
      s.setScalar(g.s);
      m.compose(g.p, q, s);
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, g.c);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [placements]);

  // Cinnamon quills and star anise: whole spices, laid down not floating.
  const quills = useMemo(
    () => [
      { p: [0.6, 0.026, 0.2] as const, rot: [0, 0.5, Math.PI / 2] as const, len: 0.34 },
      { p: [0.68, 0.026, 0.34] as const, rot: [0, 0.9, Math.PI / 2] as const, len: 0.29 },
      { p: [-0.52, 0.024, 0.36] as const, rot: [0, -0.4, Math.PI / 2] as const, len: 0.31 },
    ],
    []
  );

  const aniseGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const points = 8;
    for (let i = 0; i <= points * 2; i++) {
      const ang = (i / (points * 2)) * Math.PI * 2;
      const rad = i % 2 === 0 ? 0.085 : 0.032;
      const x = Math.cos(ang) * rad;
      const y = Math.sin(ang) * rad;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.022,
      bevelEnabled: true,
      bevelSize: 0.006,
      bevelThickness: 0.006,
      bevelSegments: 1,
      curveSegments: 1,
    });
    geo.rotateX(-Math.PI / 2);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Brass vessel */}
      <mesh geometry={bowl} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#A8823A"
          metalness={0.88}
          roughness={0.3}
          roughnessMap={roughnessMap}
          envMapIntensity={1.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Heaped spice */}
      <instancedMesh ref={grainsRef} args={[undefined, undefined, count]} receiveShadow>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={1} metalness={0} envMapIntensity={0.35} />
      </instancedMesh>

      {/* Cinnamon quills */}
      {quills.map((q, i) => (
        <mesh key={i} position={q.p} rotation={q.rot} castShadow receiveShadow>
          <cylinderGeometry args={[0.026, 0.022, q.len, 8, 1]} />
          <meshStandardMaterial color="#6B3A18" roughness={0.88} metalness={0} />
        </mesh>
      ))}

      {/* Star anise */}
      <mesh
        geometry={aniseGeometry}
        position={[-0.46, 0.012, -0.28]}
        rotation={[0, 0.4, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#4A2C15" roughness={0.9} metalness={0} />
      </mesh>
      <mesh
        geometry={aniseGeometry}
        position={[0.5, 0.012, -0.42]}
        rotation={[0, -0.8, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#553318" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

export default memo(SpiceBowl);
