// ============================================================
// LotsScene — three lots on one long shelf, one camera.
//
// Spices, dry fruit and gold sit side by side. The camera dollies along
// the shelf as the section scrolls; each lot turns slightly as it passes,
// as if it were being walked past. Its key light and shadow travel with
// it, so every lot is lit the same way as it arrives.
// ============================================================

import { memo, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import Lighting from '../Lighting';
import Ground from '../objects/Ground';
import GoldBar from '../objects/GoldBar';
import SpiceSack from '../objects/SpiceSack';
import BrassBowl from '../objects/BrassBowl';
import { BAR_TOP, bowlFloor } from '../dims';
import {
  Almonds,
  CardamomPods,
  Chillies,
  CinnamonSticks,
  Dates,
  Peppercorns,
  Pistachios,
  StarAnise,
  TurmericFingers,
} from '../objects/Goods';
import { LOT_SPACING, lotPosition } from '../lots';
import { PourGateContext, useStage } from '../context';
import type { PlacedItem } from '../geometry';

export interface LotsSceneProps {
  /** 0..1 across the pinned scroll of the section. */
  progressRef: RefObject<number>;
  pointerRef: RefObject<{ x: number; y: number }>;
}

const CHILLIES: PlacedItem[] = [
  { x: -1.2, z: 1.55, yaw: 0.5 },
  { x: -0.6, z: 1.85, yaw: 1.2, scale: 0.94 },
  { x: -1.7, z: 2.0, yaw: 0.15, scale: 1.04 },
  { x: -0.1, z: 1.6, yaw: 0.9, scale: 0.9 },
  { x: -0.9, z: 2.35, yaw: 0.8, scale: 0.9 },
  { x: 0.4, z: 2.1, yaw: 1.4, scale: 0.96 },
];
const TURMERIC: PlacedItem[] = [
  { x: -2.4, z: 1.2, yaw: 0.35 },
  { x: -2.1, z: 1.65, yaw: 1.35, scale: 0.92 },
  { x: -2.7, z: 1.7, yaw: 2.2, scale: 1.06 },
];
const STARS: PlacedItem[] = [
  { x: 0.9, z: 2.35, yaw: 0.4 },
  { x: 1.35, z: 2.7, yaw: 1.1, scale: 0.92 },
];
const CINNAMON: PlacedItem[] = [
  { x: 2.6, z: 1.7, yaw: 1.2, scale: 1.1 },
  { x: 2.9, z: 1.95, yaw: 1.32 },
];

function Spices() {
  const floor = useMemo(() => (x: number, z: number) => bowlFloor(Math.hypot(x, z)), []);
  return (
    <>
      <SpiceSack position={[-1.3, 0, -0.5]} rotation={[0, 0.45, 0]} scale={1.4} />
      <BrassBowl position={[2.0, 0, 0.3]} scale={1.1}>
        <Peppercorns count={320} seed={4} spread={0.26} floor={floor} limit={0.8} pour />
      </BrassBowl>
      <Chillies items={CHILLIES} pour />
      <TurmericFingers items={TURMERIC} pour />
      <CardamomPods position={[3.1, 0, 1.2]} count={10} seed={7} spread={0.22} pour />
      <StarAnise items={STARS} pour />
      <CinnamonSticks items={CINNAMON} pour />
    </>
  );
}

function DryFruits() {
  const floor = useMemo(() => (x: number, z: number) => bowlFloor(Math.hypot(x, z)), []);
  return (
    <>
      <BrassBowl position={[-0.9, 0, -0.1]} scale={1.45}>
        <Almonds count={80} seed={21} spread={0.3} floor={floor} limit={0.78} pour />
      </BrassBowl>
      <Dates position={[2.4, 0, 0.7]} count={20} seed={31} spread={0.4} pour />
      <Pistachios position={[-2.5, 0, 1.7]} count={42} seed={12} spread={0.38} pour />
      <Almonds position={[0.5, 0, 2.2]} count={12} seed={5} spread={0.55} pour />
      <CardamomPods position={[1.8, 0, 2.4]} count={6} seed={3} spread={0.3} pour />
    </>
  );
}

function Gold() {
  const rise = BAR_TOP - 0.03;
  return (
    <group scale={0.82} position={[0, 0, -0.3]}>
      {/* A stepped pyramid: three, two, one. */}
      {[-1.14, 0, 1.14].map((z, i) => (
        <GoldBar key={z} position={[(i - 1) * 0.015, 0, z]} rotation={[0, (i - 1) * 0.012, 0]} />
      ))}
      {[-0.57, 0.57].map((z, i) => (
        <GoldBar key={z} position={[(i - 0.5) * 0.04, rise, z]} rotation={[0, (0.5 - i) * 0.018, 0]} />
      ))}
      <GoldBar position={[0.02, rise * 2, 0]} rotation={[0, 0.02, 0]} />

      {/* Two more laid out in front, so the hallmark can be read. */}
      <GoldBar position={[-2.7, 0, 2.5]} rotation={[0, 0.22, 0]} scale={0.92} />
      <GoldBar position={[2.65, 0, 2.7]} rotation={[0, -0.28, 0]} scale={0.92} />
    </group>
  );
}

function Shelf({ progressRef, pointerRef }: LotsSceneProps) {
  const { reducedMotion, tier } = useStage();
  const groups = useRef<(THREE.Group | null)[]>([]);
  // One gate per lot: open while the camera is within reach of it.
  const gates = useMemo(() => [0, 1, 2].map(() => ({ current: false })), []);
  const camX = useRef(0);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const look = useMemo(() => new THREE.Vector3(), []);
  const lookCurrent = useMemo(() => new THREE.Vector3(0, 0.55, 0), []);

  // How far back the camera needs to be to keep a ~8-unit lot in frame.
  const distance = useMemo(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    return Math.max(9.2, 8.6 / 2 / (tan * aspect));
  }, [camera.fov, size.width, size.height]);

  useFrame((_, delta) => {
    const t = lotPosition(progressRef.current ?? 0);
    const px = reducedMotion ? 0 : (pointerRef.current?.x ?? 0);
    const py = reducedMotion ? 0 : (pointerRef.current?.y ?? 0);
    const k = reducedMotion ? 1 : 1 - Math.pow(0.002, delta);

    camX.current = t * LOT_SPACING;

    camera.position.x += (camX.current + px * 0.35 - camera.position.x) * k;
    // Same ~19° elevation at every distance, or the bars go dark at a grazing angle.
    camera.position.y += (0.55 + distance * 0.325 + py * 0.18 - camera.position.y) * k;
    camera.position.z += (distance * 0.946 - camera.position.z) * k;
    look.set(camX.current, 0.55, 0);
    lookCurrent.lerp(look, k);
    camera.lookAt(lookCurrent);

    groups.current.forEach((g, i) => {
      if (!g) return;
      const away = i - t;
      gates[i].current = Math.abs(away) < 0.45;
      g.rotation.y += (-away * 0.42 - g.rotation.y) * k;
    });
  });

  return (
    <>
      <Lighting tier={tier} followX={camX} />
      <Ground size={80} />
      {[Spices, DryFruits, Gold].map((Lot, i) => (
        <group
          key={i}
          position={[i * LOT_SPACING, 0, 0]}
          ref={(el) => {
            groups.current[i] = el;
          }}
        >
          <PourGateContext.Provider value={gates[i]}>
            <Lot />
          </PourGateContext.Provider>
        </group>
      ))}
    </>
  );
}

function LotsScene(props: LotsSceneProps) {
  return <Shelf {...props} />;
}

export default memo(LotsScene);
