// ============================================================
// Materials — one place that decides what each good is made of.
//
// Built once and shared by every scene. A material is not tied to a
// renderer, so the hero, the commodity lots and the scale all reuse the
// same compiled shaders and the same uploaded textures.
// ============================================================

import * as THREE from 'three';
import {
  almondSkin,
  bullionSurface,
  grainNormal,
  hallmark,
  hammeredNormal,
  juteSurface,
  lengthwiseWrinkleNormal,
  mottledColor,
  wrinkleNormal,
} from './textures';

const cache = new Map<string, THREE.Material>();

function memo<T extends THREE.Material>(key: string, build: () => T): T {
  const hit = cache.get(key);
  if (hit) return hit as T;
  const m = build();
  cache.set(key, m);
  return m;
}

/** Same image, own UV transform — a clone shares its GPU upload. */
function tiled(tex: THREE.Texture, x: number, y = x): THREE.Texture {
  const t = tex.clone();
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(x, y);
  t.needsUpdate = true;
  return t;
}

export const gold = () =>
  memo('gold', () => {
    const { normal, roughness } = bullionSurface();
    return new THREE.MeshPhysicalMaterial({
      // Filament's measured gold, nudged a touch deeper so it survives tone mapping.
      color: new THREE.Color('#ffc863'),
      metalness: 1,
      roughness: 0.24,
      roughnessMap: roughness,
      normalMap: normal,
      normalScale: new THREE.Vector2(0.28, 0.28),
      envMapIntensity: 1,
    });
  });

/** The struck letters: same metal, rougher and darker where it was pressed. */
export const goldStamp = () =>
  memo('gold-stamp', () => {
    const { alpha, normal } = hallmark();
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#a9772a'),
      metalness: 1,
      roughness: 0.52,
      normalMap: normal,
      normalScale: new THREE.Vector2(1.6, 1.6),
      alphaMap: alpha,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
      envMapIntensity: 1,
    });
  });

export const brass = () =>
  memo('brass', () => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#d7a24a'),
      metalness: 1,
      roughness: 0.36,
      normalMap: tiled(hammeredNormal(), 2, 1),
      normalScale: new THREE.Vector2(0.55, 0.55),
      envMapIntensity: 1.25,
    });
  });

export const jute = () =>
  memo('jute', () => {
    const { color, normal } = juteSurface();
    return new THREE.MeshStandardMaterial({
      map: tiled(color, 3, 2.4),
      normalMap: tiled(normal, 3, 2.4),
      normalScale: new THREE.Vector2(1.1, 1.1),
      roughness: 0.96,
      side: THREE.DoubleSide,
    });
  });

export const turmericPowder = () =>
  memo('turmeric-powder', () => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#e49a05'),
      roughness: 1,
      envMapIntensity: 0.55,
      normalMap: tiled(grainNormal(), 5),
      normalScale: new THREE.Vector2(0.9, 0.9),
      // Dry powder scatters light at grazing angles — the velvety rim.
      sheen: 1,
      sheenRoughness: 0.55,
      sheenColor: new THREE.Color('#ffd14a'),
    });
  });

export const turmericRoot = () =>
  memo('turmeric-root', () => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#a8651c'),
      roughness: 0.82,
      envMapIntensity: 0.5,
      normalMap: tiled(grainNormal(), 3),
      normalScale: new THREE.Vector2(0.8, 0.8),
    });
  });

export const chilli = () =>
  memo('chilli', () => {
    return new THREE.MeshPhysicalMaterial({
      map: mottledColor('chilli', [128, 20, 14], [204, 44, 28], 51, 3),
      vertexColors: true,
      roughness: 0.58,
      envMapIntensity: 0.4,
      normalMap: lengthwiseWrinkleNormal(),
      normalScale: new THREE.Vector2(0.55, 0.55),
    });
  });

export const pepper = () =>
  memo('pepper', () => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#33291f'),
      roughness: 0.62,
      envMapIntensity: 0.7,
      normalMap: tiled(wrinkleNormal(), 2),
      normalScale: new THREE.Vector2(0.6, 0.6),
    });
  });

export const almond = () =>
  memo('almond', () => {
    const { color, normal } = almondSkin();
    return new THREE.MeshStandardMaterial({
      map: tiled(color, 1, 1),
      normalMap: tiled(normal, 1, 1),
      normalScale: new THREE.Vector2(0.8, 0.8),
      roughness: 0.62,
      envMapIntensity: 0.5,
    });
  });

export const date = () =>
  memo('date', () => {
    return new THREE.MeshPhysicalMaterial({
      map: mottledColor('date', [58, 24, 11], [104, 52, 24], 66),
      roughness: 0.4,
      clearcoat: 0.3,
      clearcoatRoughness: 0.4,
      envMapIntensity: 0.65,
      normalMap: tiled(wrinkleNormal(), 1.5),
      normalScale: new THREE.Vector2(0.85, 0.85),
    });
  });

export const pistachioShell = () =>
  memo('pistachio-shell', () => {
    return new THREE.MeshStandardMaterial({
      map: mottledColor('pistachio', [186, 168, 122], [226, 212, 170], 83, 2),
      roughness: 0.72,
      envMapIntensity: 0.45,
      normalMap: lengthwiseWrinkleNormal(),
      normalScale: new THREE.Vector2(0.45, 0.45),
    });
  });

export const cardamom = () =>
  memo('cardamom', () => {
    return new THREE.MeshStandardMaterial({
      map: mottledColor('cardamom', [86, 108, 48], [146, 168, 84], 93, 3),
      roughness: 0.6,
      envMapIntensity: 0.5,
      normalMap: lengthwiseWrinkleNormal(),
      normalScale: new THREE.Vector2(0.5, 0.5),
    });
  });

export const starAnise = () =>
  memo('star-anise', () => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#5d3820'),
      roughness: 0.5,
      clearcoat: 0.18,
      envMapIntensity: 0.6,
      normalMap: tiled(wrinkleNormal(), 2),
      normalScale: new THREE.Vector2(0.5, 0.5),
    });
  });

export const cinnamon = () =>
  memo('cinnamon', () => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8e5030'),
      roughness: 0.82,
      envMapIntensity: 0.45,
      side: THREE.DoubleSide,
      normalMap: lengthwiseWrinkleNormal(),
      normalScale: new THREE.Vector2(0.9, 0.9),
    });
  });

export const ink = () =>
  memo('ink', () => new THREE.MeshStandardMaterial({ color: '#14120e', roughness: 0.85 }));

/** The sack's stencilled mark, laid over the weave. */
export const sackMark = (map: THREE.Texture) =>
  new THREE.MeshStandardMaterial({
    map,
    transparent: true,
    roughness: 0.95,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -3,
    polygonOffsetUnits: -3,
  });
