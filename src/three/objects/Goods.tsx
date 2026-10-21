// ============================================================
// Goods — each commodity as a ready-to-place heap or handful.
//
// Round-ish goods (pepper, almonds, dates, pistachios, cardamom) are
// settled into heaps. Long goods (chilli, turmeric fingers, cinnamon,
// star anise) are placed by hand, because a sphere is the wrong thing
// to approximate a seven-inch chilli with.
// ============================================================

import { memo, useMemo } from 'react';
import * as THREE from 'three';
import Pile from './Pile';
import {
  almondGeometry,
  cardamomGeometry,
  chilliGeometry,
  cinnamonGeometry,
  dateGeometry,
  peppercornGeometry,
  pistachioGeometry,
  placed,
  settle,
  starAniseGeometry,
  turmericGeometry,
  type PlacedItem,
} from '../geometry';
import * as M from '../materials';

type Vec3 = [number, number, number];

export interface HeapProps {
  position?: Vec3;
  rotation?: Vec3;
  scale?: number;
  count?: number;
  seed?: number;
  /** Where the stream lands (x, z). */
  centerX?: number;
  centerZ?: number;
  spread?: number;
  floor?: (x: number, z: number) => number;
  limit?: number;
  pour?: boolean;
}

interface HeapConfig {
  geometry: () => THREE.BufferGeometry;
  material: () => THREE.Material;
  /** Collision radius in scene units. */
  radius: number;
  /** Geometry size ↔ radius: world size = geometry size × radius / unit. */
  unit: number;
  lie: boolean;
  jitter?: number;
  variation?: number;
}

const geometries = new Map<HeapConfig, THREE.BufferGeometry>();

function Heap({
  config,
  position,
  rotation,
  scale = 1,
  count = 40,
  seed = 1,
  centerX = 0,
  centerZ = 0,
  spread = 0.3,
  floor,
  limit,
  pour = false,
}: HeapProps & { config: HeapConfig }) {
  let geo = geometries.get(config);
  if (!geo) {
    geo = config.geometry();
    geometries.set(config, geo);
  }

  const items = useMemo(
    () =>
      settle({
        count,
        seed,
        radius: config.radius,
        jitter: config.jitter,
        center: [centerX, centerZ],
        spread,
        floor,
        limit,
      }),
    [config, count, seed, centerX, centerZ, spread, floor, limit]
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Pile
        geometry={geo}
        material={config.material()}
        items={items}
        unit={config.unit}
        lie={config.lie}
        variation={config.variation}
        pour={pour}
      />
    </group>
  );
}

const PEPPER: HeapConfig = {
  geometry: peppercornGeometry,
  material: M.pepper,
  radius: 0.05,
  unit: 1,
  lie: false,
  jitter: 0.14,
  variation: 0.22,
};

const ALMOND: HeapConfig = {
  geometry: almondGeometry,
  material: M.almond,
  radius: 0.16,
  unit: 0.36,
  lie: true,
  jitter: 0.1,
  variation: 0.16,
};

const DATE: HeapConfig = {
  geometry: dateGeometry,
  material: M.date,
  radius: 0.17,
  unit: 0.33,
  lie: true,
  jitter: 0.1,
  variation: 0.2,
};

const PISTACHIO: HeapConfig = {
  geometry: pistachioGeometry,
  material: M.pistachioShell,
  radius: 0.1,
  unit: 0.3,
  lie: true,
  jitter: 0.14,
  variation: 0.14,
};

const CARDAMOM: HeapConfig = {
  geometry: cardamomGeometry,
  material: M.cardamom,
  radius: 0.07,
  unit: 0.26,
  lie: true,
  jitter: 0.14,
  variation: 0.2,
};

export const Peppercorns = memo((props: HeapProps) => <Heap config={PEPPER} {...props} />);
export const Almonds = memo((props: HeapProps) => <Heap config={ALMOND} {...props} />);
export const Dates = memo((props: HeapProps) => <Heap config={DATE} {...props} />);
export const Pistachios = memo((props: HeapProps) => <Heap config={PISTACHIO} {...props} />);
export const CardamomPods = memo((props: HeapProps) => <Heap config={CARDAMOM} {...props} />);

// ------------------------------------------------------------
// Hand-placed long goods
// ------------------------------------------------------------

export interface PlacedProps {
  position?: Vec3;
  rotation?: Vec3;
  scale?: number;
  items: PlacedItem[];
  y?: number;
  pour?: boolean;
}

const chilliVariants = [1, 2, 3].map((seed) => {
  let g: THREE.BufferGeometry | null = null;
  return () => (g ??= chilliGeometry(seed));
});

/** Dried red chillies in three different bends, lying where they were dropped. */
export const Chillies = memo(function Chillies({
  position,
  rotation,
  scale = 1,
  items,
  y = 0.1,
  pour = false,
}: PlacedProps) {
  const groups = useMemo(
    () =>
      chilliVariants.map((_, v) =>
        placed(
          items
            .filter((_, i) => i % chilliVariants.length === v)
            .map((it) => ({ ...it, scale: (it.scale ?? 1) * 1.0 })),
          y
        )
      ),
    [items, y]
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {chilliVariants.map((geo, v) => (
        <Pile key={v} geometry={geo()} material={M.chilli()} items={groups[v]} pour={pour} variation={0.12} />
      ))}
    </group>
  );
});

let turmericGeo: THREE.BufferGeometry | null = null;

export const TurmericFingers = memo(function TurmericFingers({
  position,
  rotation,
  scale = 1,
  items,
  y = 0.07,
  pour = false,
}: PlacedProps) {
  const settled = useMemo(
    () => placed(items.map((it) => ({ ...it, scale: (it.scale ?? 1) * 0.58 })), y),
    [items, y]
  );
  const geo = (turmericGeo ??= turmericGeometry(5));

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Pile geometry={geo} material={M.turmericRoot()} items={settled} pour={pour} variation={0.16} />
    </group>
  );
});

let cinnamonGeo: THREE.BufferGeometry | null = null;

export const CinnamonSticks = memo(function CinnamonSticks({
  position,
  rotation,
  scale = 1,
  items,
  y = 0.06,
  pour = false,
}: PlacedProps) {
  const settled = useMemo(
    () => placed(items.map((it) => ({ ...it, scale: (it.scale ?? 1) * 0.6 })), y),
    [items, y]
  );
  const geo = (cinnamonGeo ??= cinnamonGeometry());
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Pile geometry={geo} material={M.cinnamon()} items={settled} pour={pour} variation={0.14} />
    </group>
  );
});

let starGeo: THREE.BufferGeometry | null = null;

/** Star anise lies flat, face up — placed items only need x, z and heading. */
export const StarAnise = memo(function StarAnise({
  position,
  rotation,
  scale = 1,
  items,
  y = 0.05,
  pour = false,
}: PlacedProps) {
  const settled = useMemo(
    () =>
      items.map((it, i) => ({
        position: new THREE.Vector3(it.x, it.y ?? y, it.z),
        rotation: new THREE.Euler((it.tilt ?? 0) * 0.5, it.yaw, 0, 'YXZ'),
        scale: (it.scale ?? 1) * 0.3,
        order: i / Math.max(1, items.length - 1),
      })),
    [items, y]
  );
  const geo = (starGeo ??= starAniseGeometry());
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Pile geometry={geo} material={M.starAnise()} items={settled} pour={pour} variation={0.12} />
    </group>
  );
});
