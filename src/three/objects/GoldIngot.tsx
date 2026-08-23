// ============================================================
// GoldIngot — a cast bar, not a box.
//
// Real bullion is a tapered frustum with softened edges, struck
// with a hallmark on the top face. The taper is what makes the
// silhouette read as "poured metal" rather than "cube".
// ============================================================

import { memo, useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { brushedGoldRoughness, bullionStampMap } from '../textures';

export interface GoldIngotProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** Enables the hover lift. Off for purely cinematic scenes. */
  interactive?: boolean;
  stamped?: boolean;
}

const WIDTH = 1.05;
const DEPTH = 0.62;
const HEIGHT = 0.26;
const TAPER = 0.86; // top face is 86% of the base — standard cast draft angle
const CORNER = 0.05;

function roundedRectShape(w: number, d: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -d / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + d - r);
  s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d);
  s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function buildIngotGeometry(): THREE.BufferGeometry {
  const shape = roundedRectShape(WIDTH, DEPTH, CORNER);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: HEIGHT,
    bevelEnabled: true,
    bevelThickness: 0.022,
    bevelSize: 0.022,
    bevelOffset: 0,
    bevelSegments: 2,
    curveSegments: 4,
  });

  // Extrusion runs along +Z; stand the bar up on the table.
  geo.rotateX(-Math.PI / 2);
  geo.computeBoundingBox();
  const bb = geo.boundingBox as THREE.Box3;
  geo.translate(0, -bb.min.y, 0);

  // Apply the draft angle by narrowing each vertex ring toward the top.
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const top = bb.max.y - bb.min.y;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = THREE.MathUtils.clamp(y / top, 0, 1);
    const k = THREE.MathUtils.lerp(1, TAPER, t);
    pos.setX(i, pos.getX(i) * k);
    pos.setZ(i, pos.getZ(i) * k);
  }
  pos.needsUpdate = true;

  geo.computeVertexNormals();
  geo.computeBoundingBox();
  return geo;
}

function GoldIngot({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  interactive = true,
  stamped = true,
}: GoldIngotProps) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const geometry = useMemo(buildIngotGeometry, []);
  const roughnessMap = useMemo(() => brushedGoldRoughness(), []);
  const stampMap = useMemo(() => (stamped ? bullionStampMap() : null), [stamped]);

  const topY = useMemo(() => {
    geometry.computeBoundingBox();
    return (geometry.boundingBox as THREE.Box3).max.y;
  }, [geometry]);

  // Hover is a lift and a slight roll toward the viewer — the gesture of
  // picking a bar up off the table, damped so it never snaps.
  useFrame((_, delta) => {
    if (!group.current || !interactive) return;
    const k = 1 - Math.pow(0.0015, delta);
    const targetY = position[1] + (hovered ? 0.055 : 0);
    const targetTilt = rotation[0] + (hovered ? -0.07 : 0);
    group.current.position.y += (targetY - group.current.position.y) * k;
    group.current.rotation.x += (targetTilt - group.current.rotation.x) * k;
  });

  const enter = (e: ThreeEvent<PointerEvent>) => {
    if (!interactive) return;
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const leave = () => {
    if (!interactive) return;
    setHovered(false);
    document.body.style.cursor = '';
  };

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <mesh
        geometry={geometry}
        castShadow
        receiveShadow
        onPointerOver={enter}
        onPointerOut={leave}
      >
        {/*
          Fully metallic gold has no diffuse term, so any face pointed away
          from a light source renders black. Backing metalness off slightly
          and lifting the base colour keeps the sides reading as gold while
          the environment still supplies the specular that sells the metal.
        */}
        <meshPhysicalMaterial
          color="#D9A83F"
          metalness={0.92}
          roughness={0.3}
          roughnessMap={roughnessMap}
          envMapIntensity={2.1}
        />
      </mesh>

      {/* Struck hallmark, sunk very slightly into the top face. */}
      {stampMap && (
        <mesh position={[0, topY + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[WIDTH * 0.62, DEPTH * 0.62]} />
          <meshPhysicalMaterial
            map={stampMap}
            transparent
            opacity={0.82}
            metalness={0.8}
            roughness={0.7}
            envMapIntensity={0.9}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>
      )}
    </group>
  );
}

export default memo(GoldIngot);
