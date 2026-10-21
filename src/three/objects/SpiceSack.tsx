// ============================================================
// SpiceSack — an open jute sack, rolled at the mouth, heaped with
// turmeric powder and stencilled the way the real ones are marked.
// ============================================================

import { memo, useMemo } from 'react';
import * as THREE from 'three';
import { Decal } from '@react-three/drei';
import { displace, fbm3, sackGeometry } from '../geometry';
import { jute, sackMark, turmericPowder } from '../materials';
import { sackStencil } from '../textures';
import { useFontsReady } from '../fonts';
import { SACK_HEAP } from '../dims';

export interface SpiceSackProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

function SpiceSack({ position, rotation, scale = 1 }: SpiceSackProps) {
  const fontsReady = useFontsReady();
  const sack = useMemo(sackGeometry, []);

  const heap = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 80, 44, 0, Math.PI * 2, 0, Math.PI / 2);
    g.scale(SACK_HEAP.radius, SACK_HEAP.height, SACK_HEAP.radius);
    // Scooped, slumped powder: broad lumps first, a faint ripple over them.
    displace(
      g,
      (x, y, z) => fbm3(x * 4.2, y * 4.2, z * 4.2, 3, 21) * 0.8 + 0.2 * fbm3(x * 14, y * 14, z * 14, 2, 4) - 0.45,
      0.17
    );
    g.translate(0, SACK_HEAP.base, 0);
    return g;
  }, []);

  const mark = useMemo(() => (fontsReady ? sackMark(sackStencil()) : null), [fontsReady]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={sack} material={jute()} castShadow receiveShadow>
        {mark && (
          <Decal
            position={[0, 0.5, 0.68]}
            rotation={[0, 0, 0]}
            scale={[0.78, 0.78, 0.5]}
            material={mark}
          />
        )}
      </mesh>
      <mesh geometry={heap} material={turmericPowder()} castShadow receiveShadow />
    </group>
  );
}

export default memo(SpiceSack);
