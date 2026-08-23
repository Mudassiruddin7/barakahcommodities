// ============================================================
// BalanceScene — profit and risk on the same beam.
//
// The tilt is driven by the section's own scroll progress and
// swings both ways before settling level. That is the argument the
// section is making: neither outcome is fixed.
// ============================================================

import { memo, useLayoutEffect, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

import Lighting from '../Lighting';
import BalanceScale from '../objects/BalanceScale';
import type { DeviceTier } from '../../hooks';

export interface BalanceSceneProps {
  progressRef: RefObject<number>;
  tier: DeviceTier;
  reducedMotion: boolean;
}

/**
 * Aims at the beam rather than the origin. The balance is 1.4 units tall,
 * so a camera pointed at the floor frames the base and crops the very part
 * of the object that carries the meaning.
 */
function Framing() {
  const camera = useThree((state) => state.camera);

  useLayoutEffect(() => {
    camera.position.set(0, 1.5, 5.4);
    camera.lookAt(0, 0.92, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

function TiltedScale({
  progressRef,
  reducedMotion,
}: Pick<BalanceSceneProps, 'progressRef' | 'reducedMotion'>) {
  const tilt = useRef(0);

  useFrame(() => {
    if (reducedMotion) {
      tilt.current = 0;
      return;
    }
    const p = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);
    // One full swing across the section, damped to level at the end.
    const swing = Math.sin(p * Math.PI * 2);
    const settle = 1 - Math.pow(p, 3);
    tilt.current = swing * settle;
  });

  return <BalanceScale tiltRef={tilt} position={[0, 0, 0]} scale={0.88} />;
}

function BalanceScene({ progressRef, tier, reducedMotion }: BalanceSceneProps) {
  return (
    <>
      <Lighting tier={tier} mood="vault" />
      <Framing />
      <TiltedScale progressRef={progressRef} reducedMotion={reducedMotion} />

      {tier !== 'low' && (
        <ContactShadows
          position={[0, 0.002, 0]}
          scale={5}
          resolution={256}
          blur={2.8}
          opacity={0.4}
          far={2}
          frames={1}
          color="#02100A"
        />
      )}
    </>
  );
}

export default memo(BalanceScene);
