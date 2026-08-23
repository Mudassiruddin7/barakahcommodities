// ============================================================
// CommodityDeskScene — a long merchant's desk seen end to end.
//
// Six stations sit along the timber in the order a consignment
// actually moves through them. The camera tracks the section's
// pinned scroll progress, so the movement is the reading, not an
// idle animation playing beside it.
// ============================================================

import { memo, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

import Lighting from '../Lighting';
import TradingTable from '../objects/TradingTable';
import Crate from '../objects/Crate';
import SpiceBowl from '../objects/SpiceBowl';
import DryFruits from '../objects/DryFruits';
import Ledger from '../objects/Ledger';
import GoldIngot from '../objects/GoldIngot';
import type { DeviceTier } from '../../hooks';

export interface CommodityDeskSceneProps {
  /** 0..1 across the pinned scroll of the section. */
  progressRef: RefObject<number>;
  tier: DeviceTier;
  reducedMotion: boolean;
}

/** Station centres along the desk, matching PROCESS_STAGES order. */
const STATION_X = [-7.2, -4.3, -1.4, 1.5, 4.4, 7.3];
const DESK_LENGTH = 19;

/** Brass weights — the purchase station. */
function WeightSet({ position }: { position: [number, number, number] }) {
  const sizes = [
    { r: [0.14, 0.17] as const, h: 0.2, x: 0 },
    { r: [0.11, 0.135] as const, h: 0.16, x: 0.34 },
    { r: [0.085, 0.105] as const, h: 0.13, x: 0.6 },
  ];

  return (
    <group position={position}>
      {sizes.map((w, i) => (
        <mesh key={i} position={[w.x, w.h / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[w.r[0], w.r[1], w.h, 24]} />
          <meshPhysicalMaterial
            color="#9C7C38"
            metalness={0.95}
            roughness={0.34}
            envMapIntensity={1.15}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Stacked invoices — accounting, kept physical. */
function Invoices({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[i * 0.012, 0.006 + i * 0.008, i * 0.006]}
          rotation={[0, (i - 1.5) * 0.05, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.42, 0.008, 0.58]} />
          <meshStandardMaterial color="#EDE4CE" roughness={0.95} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

function DeskCamera({
  progressRef,
  reducedMotion,
}: Pick<CommodityDeskSceneProps, 'progressRef' | 'reducedMotion'>) {
  const { camera } = useThree();
  const desired = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const lookCurrent = useMemo(() => new THREE.Vector3(STATION_X[0], 0.3, 0), []);

  useFrame((_, delta) => {
    const p = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);

    // Travel the length of the desk, easing at both ends.
    const eased = p * p * (3 - 2 * p);
    const x = THREE.MathUtils.lerp(STATION_X[0], STATION_X[5], eased);

    // A shallow arc: the camera rises slightly over the middle of the run.
    const arc = Math.sin(eased * Math.PI);
    desired.set(x + 0.35, 1.32 + arc * 0.2, 2.55 - arc * 0.18);
    look.set(x, 0.28, 0);

    const k = reducedMotion ? 1 : 1 - Math.pow(0.004, delta);
    camera.position.lerp(desired, k);
    lookCurrent.lerp(look, k);
    camera.lookAt(lookCurrent);
  });

  return null;
}

function CommodityDeskScene({
  progressRef,
  tier,
  reducedMotion,
}: CommodityDeskSceneProps) {
  const detail = tier === 'low' ? 'low' : 'high';
  const shadowRef = useRef<THREE.Group>(null);

  return (
    <>
      <Lighting tier={tier} mood="daylight" />
      <DeskCamera progressRef={progressRef} reducedMotion={reducedMotion} />

      <TradingTable size={[DESK_LENGTH, 3.4]} inlay={false} />

      {/* 01 Source — goods arriving from the supplier */}
      <group position={[STATION_X[0], 0, 0]}>
        <Crate position={[-0.45, 0, -0.2]} rotation={[0, 0.32, 0]} scale={0.78} stacked={false} />
        <SpiceBowl
          position={[0.62, 0, 0.2]}
          rotation={[0, -0.4, 0]}
          scale={0.85}
          blend="chilli"
          detail={detail}
        />
      </group>

      {/* 02 Purchase — weighed and paid for */}
      <group position={[STATION_X[1], 0, 0]}>
        <WeightSet position={[-0.4, 0, 0.1]} />
        <Invoices position={[0.55, 0, -0.1]} />
      </group>

      {/* 03 Storage — stock held */}
      <Crate position={[STATION_X[2] + 0.3, 0, -0.05]} rotation={[0, -0.18, 0]} scale={0.95} />

      {/* 04 Trade — goods moving to market */}
      <group position={[STATION_X[3], 0, 0]}>
        <SpiceBowl
          position={[-0.45, 0, 0]}
          rotation={[0, 0.2, 0]}
          scale={0.95}
          blend="turmeric"
          detail={detail}
        />
        <DryFruits position={[0.55, 0, 0.22]} scale={0.85} detail={detail} />
      </group>

      {/* 05 Accounting — entries made as they happen */}
      <group position={[STATION_X[4], 0, 0]}>
        <Ledger position={[-0.2, 0, 0]} rotation={[0, 0.16, 0]} scale={1.05} open />
        <Invoices position={[0.85, 0, 0.15]} />
      </group>

      {/* 06 Settlement — the result, in metal */}
      <group position={[STATION_X[5], 0, 0]}>
        <GoldIngot position={[0, 0, 0.1]} rotation={[0, -0.22, 0]} scale={0.95} interactive={false} />
        <WeightSet position={[0.85, 0, -0.2]} />
      </group>

      {tier !== 'low' && (
        <group ref={shadowRef}>
          <ContactShadows
            position={[0, 0.004, 0]}
            scale={DESK_LENGTH}
            resolution={tier === 'high' ? 1024 : 512}
            blur={2.4}
            opacity={0.5}
            far={1.8}
            frames={1}
            color="#1B0F06"
          />
        </group>
      )}
    </>
  );
}

export default memo(CommodityDeskScene);
