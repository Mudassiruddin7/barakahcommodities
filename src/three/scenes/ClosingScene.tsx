// ============================================================
// ClosingScene — the bar arrives.
//
// A single ingot enters from the left and settles into the light
// as the closing section scrolls into place. One move, slow, and
// then it stops: the last thing the page should do is fidget.
// ============================================================

import { memo, useLayoutEffect, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

import Lighting from '../Lighting';
import GoldIngot from '../objects/GoldIngot';
import type { DeviceTier } from '../../hooks';

/** Where the bar comes to rest: clear of the headline, in the open right side. */
const REST_X = 1.85;

export interface ClosingSceneProps {
  progressRef: RefObject<number>;
  tier: DeviceTier;
  reducedMotion: boolean;
}

/**
 * Aims left of where the bar comes to rest. Pointing the camera at the bar
 * would centre it — and the centre is where the headline is. Offsetting the
 * look-at pushes the bar into the open right-hand third of the frame.
 */
function Framing() {
  const camera = useThree((state) => state.camera);

  useLayoutEffect(() => {
    camera.position.set(0.1, 1.15, 4.6);
    camera.lookAt(0.6, 0.04, 0.3);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

function ArrivingIngot({
  progressRef,
  reducedMotion,
}: Pick<ClosingSceneProps, 'progressRef' | 'reducedMotion'>) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;

    if (reducedMotion) {
      g.position.set(REST_X, 0, 0);
      g.rotation.set(0, -0.28, 0);
      return;
    }

    // Map the section's travel to a single arrival, easing out at the end.
    const p = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);
    const eased = 1 - Math.pow(1 - p, 3);

    const targetX = THREE.MathUtils.lerp(REST_X - 2.3, REST_X, eased);
    const targetY = THREE.MathUtils.lerp(0.55, 0, eased);
    const targetRotY = THREE.MathUtils.lerp(-1.15, -0.28, eased);

    const k = 1 - Math.pow(0.0022, delta);
    g.position.x += (targetX - g.position.x) * k;
    g.position.y += (targetY - g.position.y) * k;
    g.rotation.y += (targetRotY - g.rotation.y) * k;
  });

  return (
    <group ref={group} position={[REST_X - 2.3, 0.55, 0.35]} rotation={[0, -1.15, 0]}>
      <GoldIngot position={[0, 0, 0]} scale={1.05} interactive={false} />
    </group>
  );
}

function ClosingScene({ progressRef, tier, reducedMotion }: ClosingSceneProps) {
  return (
    <>
      <Lighting tier={tier} mood="vault" />
      <Framing />
      <ArrivingIngot progressRef={progressRef} reducedMotion={reducedMotion} />

      {tier !== 'low' && (
        <ContactShadows
          position={[REST_X, -0.002, 0.35]}
          scale={6}
          resolution={256}
          blur={3}
          opacity={0.55}
          far={1.6}
          color="#01100A"
        />
      )}
    </>
  );
}

export default memo(ClosingScene);
