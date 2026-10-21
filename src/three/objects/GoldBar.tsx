// ============================================================
// GoldBar — a cast one-kilo bar, not a box.
//
// Tapered section, rounded edges, sloped ends, fine directional
// scratches in the surface, and the maker's hallmark struck into the
// top face. Everything that makes it read as metal is in the material
// and the light; the geometry only has to be honest about its edges.
// ============================================================

import { memo, useMemo } from 'react';
import type * as THREE from 'three';
import { ingotGeometry } from '../geometry';
import { gold, goldStamp } from '../materials';
import { useFontsReady } from '../fonts';
import { BAR, BAR_TOP } from '../dims';


let sharedGeometry: THREE.BufferGeometry | null = null;
const barGeometry = () => (sharedGeometry ??= ingotGeometry(BAR.width, BAR.height, BAR.length));

export interface GoldBarProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  stamped?: boolean;
}

function GoldBar({ position, rotation, scale = 1, stamped = true }: GoldBarProps) {
  const fontsReady = useFontsReady();
  const geometry = useMemo(barGeometry, []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={geometry} material={gold()} castShadow receiveShadow />
      {stamped && fontsReady && (
        <mesh
          position={[0, BAR_TOP + 0.002, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={goldStamp()}
          renderOrder={2}
        >
          <planeGeometry args={[1.32, 0.62]} />
        </mesh>
      )}
    </group>
  );
}

export default memo(GoldBar);
