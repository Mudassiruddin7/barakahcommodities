// ============================================================
// CommodityDisplayScene — one canvas serving three panels.
//
// The three goods sit in a row on a shared plinth. Selecting a
// panel glides the camera to that good and settles the other two
// back, so the section reads as a single continuous composition
// rather than three separate cards each with its own scene.
// ============================================================

import { memo, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

import Lighting from '../Lighting';
import SpiceBowl from '../objects/SpiceBowl';
import DryFruits from '../objects/DryFruits';
import GoldIngot from '../objects/GoldIngot';
import type { DeviceTier } from '../../hooks';

export interface CommodityDisplaySceneProps {
  /** Index of the panel currently under the cursor or focus. */
  activeRef: RefObject<number>;
  pointerRef: RefObject<{ x: number; y: number }>;
  tier: DeviceTier;
  reducedMotion: boolean;
}

const SPACING = 2.35;
const SLOTS = [-SPACING, 0, SPACING];

/** Wraps one good so it can rise when chosen and settle when not. */
function Pedestal({
  index,
  activeRef,
  children,
}: {
  index: number;
  activeRef: RefObject<number>;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const isActive = (activeRef.current ?? 0) === index;
    const k = 1 - Math.pow(0.006, delta);

    const targetScale = isActive ? 1 : 0.82;
    const targetY = isActive ? 0 : -0.14;
    const targetRot = isActive ? 0.32 : 0;

    g.scale.x += (targetScale - g.scale.x) * k;
    g.scale.setScalar(g.scale.x);
    g.position.y += (targetY - g.position.y) * k;
    g.rotation.y += (targetRot - g.rotation.y) * k;
  });

  return (
    <group ref={group} position={[SLOTS[index], 0, 0]}>
      {children}
      {/*
        A dark stone slab, kept very low. An earlier, taller hexagonal plinth
        read as a floating platter from this camera height and pulled attention
        away from the goods sitting on it.
      */}
      <mesh position={[0, -0.014, 0]} receiveShadow>
        <cylinderGeometry args={[0.7, 0.74, 0.028, 48]} />
        <meshStandardMaterial color="#031510" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

function CameraRig({
  activeRef,
  pointerRef,
  reducedMotion,
}: Pick<CommodityDisplaySceneProps, 'activeRef' | 'pointerRef' | 'reducedMotion'>) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const lookCurrent = useMemo(() => new THREE.Vector3(SLOTS[0], 0.2, 0), []);

  useFrame((_, delta) => {
    const idx = activeRef.current ?? 0;
    const pointer = pointerRef.current ?? { x: 0, y: 0 };
    const px = reducedMotion ? 0 : pointer.x;
    const py = reducedMotion ? 0 : pointer.y;

    target.set(SLOTS[idx] + px * 0.2, 0.82 + py * 0.08, 2.45);
    look.set(SLOTS[idx], 0.28, 0);

    const k = 1 - Math.pow(0.0035, delta);
    camera.position.lerp(target, k);
    lookCurrent.lerp(look, k);
    camera.lookAt(lookCurrent);
  });

  return null;
}

function CommodityDisplayScene({
  activeRef,
  pointerRef,
  tier,
  reducedMotion,
}: CommodityDisplaySceneProps) {
  const detail = tier === 'low' ? 'low' : 'high';

  return (
    <>
      <Lighting tier={tier} mood="daylight" />
      <CameraRig
        activeRef={activeRef}
        pointerRef={pointerRef}
        reducedMotion={reducedMotion}
      />

      <Pedestal index={0} activeRef={activeRef}>
        <SpiceBowl position={[0, 0, 0]} scale={1.15} blend="turmeric" detail={detail} />
      </Pedestal>

      <Pedestal index={1} activeRef={activeRef}>
        <DryFruits position={[0, 0, 0]} scale={1.15} detail={detail} />
      </Pedestal>

      <Pedestal index={2} activeRef={activeRef}>
        <GoldIngot position={[0, 0, 0]} rotation={[0, 0.24, 0]} scale={0.85} />
      </Pedestal>

      {tier !== 'low' && (
        <ContactShadows
          position={[0, 0.002, 0]}
          scale={8}
          resolution={tier === 'high' ? 512 : 256}
          blur={2.8}
          opacity={0.45}
          far={2}
          frames={tier === 'high' ? Infinity : 1}
          color="#12100A"
        />
      )}
    </>
  );
}

export default memo(CommodityDisplayScene);
