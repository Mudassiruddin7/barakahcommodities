// ============================================================
// TradingTable — the walnut surface everything rests on, with a
// brass khatam inlay set flush into the timber.
//
// The eight-point star is two overlapping squares: the oldest and
// plainest form of the motif. It is inlay, not decoration — it sits
// in the wood at grazing angles and mostly reads as a glint.
// ============================================================

import { memo, useMemo } from 'react';
import * as THREE from 'three';
import { woodColorMap, woodRoughnessMap } from '../textures';

export interface TradingTableProps {
  position?: [number, number, number];
  /** Plan dimensions of the top in world units. */
  size?: [number, number];
  thickness?: number;
  /** Draws the brass inlay. Disabled on low-tier devices. */
  inlay?: boolean;
  inlaySize?: number;
  inlayPosition?: [number, number];
}

/** One square outline built from four thin brass bars. */
function InlaySquare({
  half,
  yRotation,
  y,
}: {
  half: number;
  yRotation: number;
  y: number;
}) {
  const bar = half * 2;
  const w = 0.022;

  return (
    <group rotation={[0, yRotation, 0]}>
      {[
        [0, half],
        [0, -half],
      ].map(([x, z], i) => (
        <mesh key={`h${i}`} position={[x, y, z]}>
          <boxGeometry args={[bar + w, 0.004, w]} />
          <meshPhysicalMaterial
            color="#C9A34E"
            metalness={0.9}
            roughness={0.26}
            envMapIntensity={1.8}
          />
        </mesh>
      ))}
      {[
        [half, 0],
        [-half, 0],
      ].map(([x, z], i) => (
        <mesh key={`v${i}`} position={[x, y, z]}>
          <boxGeometry args={[w, 0.004, bar + w]} />
          <meshPhysicalMaterial
            color="#C9A34E"
            metalness={0.9}
            roughness={0.26}
            envMapIntensity={1.8}
          />
        </mesh>
      ))}
    </group>
  );
}

function TradingTable({
  position = [0, 0, 0],
  size = [7, 5],
  thickness = 0.18,
  inlay = true,
  inlaySize = 0.85,
  inlayPosition = [0, -0.9],
}: TradingTableProps) {
  const [w, d] = size;

  const colorMap = useMemo(() => {
    const t = woodColorMap().clone();
    t.repeat.set(Math.max(1, w / 3.2), Math.max(1, d / 3.2));
    t.needsUpdate = true;
    return t;
  }, [w, d]);

  const roughMap = useMemo(() => {
    const t = woodRoughnessMap().clone();
    t.repeat.set(Math.max(1, w / 3.2), Math.max(1, d / 3.2));
    t.needsUpdate = true;
    return t;
  }, [w, d]);

  return (
    <group position={position}>
      {/* Top slab. Sits so its surface is exactly y = 0. */}
      <mesh position={[0, -thickness / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[w, thickness, d]} />
        <meshPhysicalMaterial
          map={colorMap}
          roughnessMap={roughMap}
          color="#C9A183"
          roughness={0.58}
          metalness={0}
          clearcoat={0.3}
          clearcoatRoughness={0.55}
          envMapIntensity={0.85}
        />
      </mesh>

      {/* Chamfered front edge catches the key light and defines the plane. */}
      <mesh position={[0, -thickness - 0.012, 0]} receiveShadow>
        <boxGeometry args={[w * 0.995, 0.024, d * 0.995]} />
        <meshStandardMaterial color="#4A2E16" roughness={0.8} metalness={0} />
      </mesh>

      {inlay && (
        <group position={[inlayPosition[0], 0.0025, inlayPosition[1]]}>
          <InlaySquare half={inlaySize / 2} yRotation={0} y={0} />
          <InlaySquare half={inlaySize / 2} yRotation={Math.PI / 4} y={0} />
          {/* Inner ring closes the star's centre */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[inlaySize * 0.2, inlaySize * 0.2 + 0.016, 48]} />
            <meshPhysicalMaterial
              color="#C9A34E"
              metalness={0.9}
              roughness={0.26}
              envMapIntensity={1.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default memo(TradingTable);
