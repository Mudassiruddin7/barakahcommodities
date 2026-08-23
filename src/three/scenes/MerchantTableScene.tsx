// ============================================================
// MerchantTableScene — the hero composition.
//
// A merchant's desk at the moment of a deal: bullion set down on
// the timber, a bowl of spice, dry fruit spilling from a sack,
// the ledger open beside them.
//
// Depth is created by moving the camera, not the objects. A true
// perspective shift gives near and far items genuinely different
// parallax speeds, which no per-layer offset can imitate.
// ============================================================

import { memo, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

import Lighting from '../Lighting';
import TradingTable from '../objects/TradingTable';
import GoldIngot from '../objects/GoldIngot';
import SpiceBowl from '../objects/SpiceBowl';
import DryFruits from '../objects/DryFruits';
import Crate from '../objects/Crate';
import Ledger from '../objects/Ledger';
import type { DeviceTier } from '../../hooks';

export interface MerchantTableSceneProps {
  pointerRef: RefObject<{ x: number; y: number }>;
  /** 0 at the top of the hero, 1 once it has scrolled away. */
  progressRef: RefObject<number>;
  tier: DeviceTier;
  reducedMotion: boolean;
}

const TARGET = new THREE.Vector3(0, 0.34, 0);

/**
 * Camera rig. Pointer contributes a small orbit; scroll lifts the camera
 * and eases it back, so the scene settles as the page moves on.
 */
function CameraRig({
  pointerRef,
  progressRef,
  reducedMotion,
}: Pick<MerchantTableSceneProps, 'pointerRef' | 'progressRef' | 'reducedMotion'>) {
  const { camera } = useThree();
  const base = useMemo(() => new THREE.Vector3(0.35, 2.15, 5.6), []);
  const desired = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const p = progressRef.current ?? 0;
    const pointer = pointerRef.current ?? { x: 0, y: 0 };

    // Restrained: a couple of degrees of orbit, never a swing.
    const px = reducedMotion ? 0 : pointer.x;
    const py = reducedMotion ? 0 : pointer.y;

    desired.set(
      base.x + px * 0.42,
      base.y + py * 0.2 + p * 0.85,
      base.z - py * 0.1 + p * 0.55
    );

    // Frame-rate independent damping.
    const k = 1 - Math.pow(0.0025, delta);
    camera.position.lerp(desired, k);
    camera.lookAt(TARGET);
  });

  return null;
}

function MerchantTableScene({
  pointerRef,
  progressRef,
  tier,
  reducedMotion,
}: MerchantTableSceneProps) {
  const detail = tier === 'low' ? 'low' : 'high';
  const shadows = tier !== 'low';
  const ingotRef = useRef<THREE.Group>(null);

  return (
    <>
      <Lighting tier={tier} mood="daylight" />
      <CameraRig
        pointerRef={pointerRef}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
      />

      {/*
        The whole composition sits right of the camera target so nothing
        important falls inside the mask that fades the canvas into the copy.
      */}
      <group position={[0.38, 0, 0]}>
      {/* The desk. Inlay sits behind the objects, catching light at a graze. */}
      <TradingTable
        size={[7.5, 5.2]}
        inlay={tier !== 'low'}
        inlaySize={1.15}
        inlayPosition={[0.1, -1.35]}
      />

      {/* Foreground: the bullion, closest to camera and the focal object. */}
      <group ref={ingotRef}>
        <GoldIngot position={[-0.55, 0, 0.85]} rotation={[0, 0.38, 0]} scale={0.92} />
      </group>

      {/* A second bar set back and turned away — inventory, not display. */}
      <GoldIngot
        position={[-1.15, 0, 0.05]}
        rotation={[0, -0.2, 0]}
        scale={0.85}
        interactive={false}
        stamped={false}
      />

      {/* Mid ground: the spice bowl carries the colour of the scene. */}
      <SpiceBowl
        position={[1.05, 0, 0.42]}
        rotation={[0, -0.3, 0]}
        scale={1.15}
        blend="turmeric"
        detail={detail}
      />

      {/* Dry fruit spilling from the sack toward the viewer. */}
      <DryFruits position={[0.32, 0, 1.18]} rotation={[0, 0.5, 0]} scale={0.95} detail={detail} />

      {/* Background: crates and ledger establish the depth plane. */}
      <Crate position={[-1.42, 0, -1.25]} rotation={[0, 0.42, 0]} scale={0.86} />

      <Ledger position={[1.32, 0, -1.1]} rotation={[0, -0.42, 0]} scale={1.1} open />

      {/* A single brass weight beside the ledger — a working desk. */}
      <mesh position={[0.28, 0.075, -0.72]} castShadow receiveShadow>
        <cylinderGeometry args={[0.11, 0.135, 0.15, 24]} />
        <meshPhysicalMaterial
          color="#9C7C38"
          metalness={0.95}
          roughness={0.34}
          envMapIntensity={1.15}
        />
      </mesh>

      </group>

      {shadows && (
        <ContactShadows
          position={[0, 0.004, 0]}
          scale={7}
          resolution={tier === 'high' ? 512 : 256}
          blur={2.6}
          opacity={0.52}
          far={2.4}
          frames={tier === 'high' ? Infinity : 1}
          color="#1B0F06"
          position-x={0.38}
        />
      )}
    </>
  );
}

export default memo(MerchantTableScene);
