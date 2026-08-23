// ============================================================
// Ledger — a bound book lying open on the desk.
//
// Pages are given a slight cylindrical lift away from the spine so
// the paper looks bound rather than printed onto the tabletop.
// ============================================================

import { memo, useMemo } from 'react';
import * as THREE from 'three';
import { paperMap } from '../textures';

export interface LedgerProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** Closed books stack better in tight compositions. */
  open?: boolean;
}

/** A page plane bowed upward toward its outer edge. */
function pageGeometry(w: number, d: number, side: 1 | -1): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(w, d, 12, 6);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    // 0 at the spine, 1 at the fore-edge
    const t = THREE.MathUtils.clamp((x * side + w / 2) / w, 0, 1);
    pos.setY(i, Math.sin(t * Math.PI * 0.85) * 0.022);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  geo.translate((side * w) / 2, 0, 0);
  return geo;
}

function Ledger({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  open = true,
}: LedgerProps) {
  const paper = useMemo(() => paperMap(), []);
  const W = 0.52;
  const D = 0.72;

  const leftPage = useMemo(() => pageGeometry(W, D, -1), []);
  const rightPage = useMemo(() => pageGeometry(W, D, 1), []);

  if (!open) {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        <mesh position={[0, 0.035, 0]} castShadow receiveShadow>
          <boxGeometry args={[W * 2, 0.07, D]} />
          <meshStandardMaterial color="#0A3A2A" roughness={0.72} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.035, 0]} castShadow>
          <boxGeometry args={[W * 1.95, 0.05, D * 0.96]} />
          <meshStandardMaterial color="#E4DAC0" roughness={0.95} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Leather cover, open flat */}
      <mesh position={[0, 0.008, 0]} castShadow receiveShadow>
        <boxGeometry args={[W * 2.1, 0.016, D * 1.06]} />
        <meshPhysicalMaterial
          color="#0A3A2A"
          roughness={0.68}
          metalness={0.04}
          clearcoat={0.25}
          clearcoatRoughness={0.7}
        />
      </mesh>

      {/* Page block on each side */}
      <mesh position={[-W / 2, 0.026, 0]} castShadow>
        <boxGeometry args={[W * 0.98, 0.022, D * 0.96]} />
        <meshStandardMaterial color="#E9E0C6" roughness={0.95} />
      </mesh>
      <mesh position={[W / 2, 0.026, 0]} castShadow>
        <boxGeometry args={[W * 0.98, 0.022, D * 0.96]} />
        <meshStandardMaterial color="#E9E0C6" roughness={0.95} />
      </mesh>

      {/* Ruled top sheets */}
      <mesh geometry={leftPage} position={[0, 0.038, 0]} receiveShadow>
        <meshStandardMaterial map={paper} roughness={0.94} metalness={0} />
      </mesh>
      <mesh geometry={rightPage} position={[0, 0.038, 0]} receiveShadow>
        <meshStandardMaterial map={paper} roughness={0.94} metalness={0} />
      </mesh>

      {/* Spine shadow line */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.012, 0.004, D * 0.94]} />
        <meshStandardMaterial color="#6E6144" roughness={1} />
      </mesh>

      {/* Brass page marker */}
      <mesh position={[W * 0.72, 0.041, D * 0.18]} rotation={[0, 0.15, 0]}>
        <boxGeometry args={[0.055, 0.003, 0.16]} />
        <meshPhysicalMaterial
          color="#A8863C"
          metalness={1}
          roughness={0.3}
          envMapIntensity={1.2}
        />
      </mesh>
    </group>
  );
}

export default memo(Ledger);
