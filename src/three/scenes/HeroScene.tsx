// ============================================================
// HeroScene — the still life on the first screen.
//
// A market stall laid out along the bottom of the page: turmeric in a
// jute sack, a dish of almonds, a stack of gold, a dish of pepper, and
// everything else that is bought and sold, scattered on the page's own
// paper. Lit like a product shoot. The goods pour in the first time the
// scene is seen; after that the only motion is a slow lean toward the
// cursor and a drift as the page scrolls away.
// ============================================================

import { memo, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import Lighting from '../Lighting';
import FitWidth from '../FitWidth';
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
import { useStage } from '../context';
import type { PlacedItem } from '../geometry';

export interface HeroSceneProps {
  pointerRef: RefObject<{ x: number; y: number }>;
  progressRef: RefObject<number>;
  /** A narrower composition for a phone-sized frame. */
  compact?: boolean;
}

const TARGET_WIDE: [number, number, number] = [0.3, 0.55, 0.5];
const TARGET_COMPACT: [number, number, number] = [0.2, 0.7, 0.8];

const CHILLIES: PlacedItem[] = [
  { x: -4.2, z: 1.55, yaw: 0.6 },
  { x: -3.85, z: 1.95, yaw: 1.15, scale: 0.94 },
  { x: -4.55, z: 2.15, yaw: 0.2, scale: 1.04 },
  { x: -3.45, z: 1.45, yaw: 0.95, scale: 0.9 },
  { x: -5.0, z: 1.75, yaw: 1.5, scale: 0.96 },
  { x: -4.15, z: 2.55, yaw: 0.85, scale: 0.88 },
];

const TURMERIC: PlacedItem[] = [
  { x: -5.75, z: 1.2, yaw: 0.35 },
  { x: -5.4, z: 1.65, yaw: 1.35, scale: 0.92 },
  { x: -5.95, z: 1.7, yaw: 2.2, scale: 1.06 },
];

const STARS: PlacedItem[] = [
  { x: 1.65, z: 2.25, yaw: 0.4, scale: 1 },
  { x: 2.1, z: 2.65, yaw: 1.1, scale: 0.92 },
  { x: 1.2, z: 2.7, yaw: 2.4, scale: 0.88 },
];

const CINNAMON: PlacedItem[] = [
  { x: 3.1, z: 1.7, yaw: 1.2, scale: 1.1 },
  { x: 3.4, z: 1.95, yaw: 1.32, scale: 1 },
  { x: 2.95, z: 2.15, yaw: 1.05, scale: 1.06 },
];

const COMPACT_TURMERIC: PlacedItem[] = [
  { x: -3.2, z: 1.3, yaw: 0.35 },
  { x: -2.8, z: 1.7, yaw: 1.35, scale: 0.92 },
];

function WideStall() {
  const floor = useMemo(() => (x: number, z: number) => bowlFloor(Math.hypot(x, z)), []);

  return (
    <>
      {/* Turmeric, heaped in a sack of the kind it travels in. */}
      <SpiceSack position={[-5.0, 0, -0.55]} rotation={[0, 0.5, 0]} scale={1.25} />
      <Chillies items={CHILLIES} pour />
      <TurmericFingers items={TURMERIC} pour />

      {/* Almonds in a dish. */}
      <BrassBowl position={[-1.95, 0, -0.55]} scale={1.05}>
        <Almonds count={64} seed={21} spread={0.28} floor={floor} limit={0.78} pour />
      </BrassBowl>
      <Dates position={[-1.9, 0, 2.3]} count={7} seed={9} spread={0.24} pour />

      {/* Gold: two bars and a third bridged across them. */}
      <GoldBar position={[1.05, 0, -0.58]} rotation={[0, 0.02, 0]} />
      <GoldBar position={[1.0, 0, 0.52]} rotation={[0, -0.025, 0]} />
      <GoldBar position={[1.03, BAR_TOP - 0.03, -0.03]} rotation={[0, 0.045, 0]} />
      <GoldBar position={[-0.1, 0, 1.95]} rotation={[0, -0.3, 0]} scale={0.88} />
      <StarAnise items={STARS} pour />

      {/* Pepper in a hammered brass dish. */}
      <BrassBowl position={[4.55, 0, -0.35]} scale={1.1}>
        <Peppercorns count={300} seed={4} spread={0.26} floor={floor} limit={0.8} pour />
      </BrassBowl>
      <CinnamonSticks items={CINNAMON} pour />
      <Pistachios position={[4.7, 0, 2.15]} count={13} seed={11} spread={0.26} pour />
      <CardamomPods position={[5.9, 0, 1.2]} count={9} seed={7} spread={0.2} pour />
    </>
  );
}

function CompactStall() {
  const floor = useMemo(() => (x: number, z: number) => bowlFloor(Math.hypot(x, z)), []);

  return (
    <>
      <SpiceSack position={[-2.5, 0, -0.4]} rotation={[0, 0.5, 0]} scale={1.2} />
      <TurmericFingers items={COMPACT_TURMERIC} pour />
      <GoldBar position={[0.55, 0, -0.5]} rotation={[0, 0.02, 0]} />
      <GoldBar position={[0.5, 0, 0.54]} rotation={[0, -0.025, 0]} />
      <GoldBar position={[0.53, BAR_TOP - 0.03, 0]} rotation={[0, 0.045, 0]} />
      <BrassBowl position={[3.2, 0, -0.1]} scale={1.05}>
        <Peppercorns count={240} seed={4} spread={0.26} floor={floor} limit={0.8} pour />
      </BrassBowl>
      <Almonds position={[1.6, 0, 2.3]} count={9} seed={3} spread={0.3} pour />
    </>
  );
}

function Still({ pointerRef, progressRef, compact }: HeroSceneProps) {
  const { reducedMotion } = useStage();
  const root = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = root.current;
    if (!g) return;
    const px = reducedMotion ? 0 : (pointerRef.current?.x ?? 0);
    const py = reducedMotion ? 0 : (pointerRef.current?.y ?? 0);
    const scroll = progressRef.current ?? 0;
    const k = 1 - Math.pow(0.008, delta);

    g.rotation.y += (px * 0.1 - scroll * 0.2 - g.rotation.y) * k;
    g.rotation.x += (-py * 0.025 - g.rotation.x) * k;
  });

  return <group ref={root}>{compact ? <CompactStall /> : <WideStall />}</group>;
}

function HeroScene({ compact = false, ...props }: HeroSceneProps) {
  const { tier } = useStage();

  return (
    <>
      <Lighting tier={tier} />
      <FitWidth
        width={compact ? 7.4 : 13.6}
        height={compact ? 4.3 : 5.9}
        target={compact ? TARGET_COMPACT : TARGET_WIDE}
      />
      <Still compact={compact} {...props} />
      <Ground />
    </>
  );
}

export default memo(HeroScene);
