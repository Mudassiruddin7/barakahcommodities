// ============================================================
// BalanceScale — a merchant's brass balance.
//
// The beam is driven by an external `tilt` value and damped toward
// it, so the movement reads as weight settling rather than an
// animation playing. Left pan is profit, right pan is risk; the
// point of the object is that neither side is fixed.
// ============================================================

import { memo, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { hammeredRoughness } from '../textures';

export interface BalanceScaleProps {
  /**
   * Live tilt: -1 tips toward risk, +1 toward profit, 0 is level.
   * Passed as a ref so the driver can update it every frame without
   * re-rendering the scene graph.
   */
  tiltRef?: RefObject<number>;
  /** Static tilt, for scenes that never change it. */
  tilt?: number;
  position?: [number, number, number];
  scale?: number;
}

const BRASS = {
  color: '#9C7C38',
  metalness: 0.96,
  roughness: 0.32,
  envMapIntensity: 1.2,
} as const;

const ARM = 0.95;
const PIVOT_Y = 1.42;

/** Shallow dish revolved from a profile. */
function panGeometry(): THREE.LatheGeometry {
  const profile = [
    new THREE.Vector2(0.0, 0.018),
    new THREE.Vector2(0.1, 0.012),
    new THREE.Vector2(0.2, 0.022),
    new THREE.Vector2(0.27, 0.052),
    new THREE.Vector2(0.285, 0.058),
    new THREE.Vector2(0.272, 0.044),
    new THREE.Vector2(0.19, 0.012),
    new THREE.Vector2(0.09, 0.002),
    new THREE.Vector2(0.0, 0.0),
  ];
  const geo = new THREE.LatheGeometry(profile, 36);
  geo.computeVertexNormals();
  return geo;
}

/** Three cords rising from the pan rim to a single suspension point. */
function Suspension({ drop }: { drop: number }) {
  const cords = useMemo(() => [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3], []);
  return (
    <>
      {cords.map((a, i) => {
        const x = Math.cos(a) * 0.24;
        const z = Math.sin(a) * 0.24;
        const len = Math.hypot(drop, 0.24);
        const mid = new THREE.Vector3(x / 2, -drop / 2, z / 2);
        const dir = new THREE.Vector3(x, -drop, z).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir
        );
        const euler = new THREE.Euler().setFromQuaternion(quat);
        return (
          <mesh
            key={i}
            position={[mid.x, mid.y, mid.z]}
            rotation={[euler.x, euler.y, euler.z]}
          >
            <cylinderGeometry args={[0.005, 0.005, len, 5]} />
            <meshStandardMaterial {...BRASS} roughness={0.45} />
          </mesh>
        );
      })}
    </>
  );
}

function BalanceScale({
  tiltRef,
  tilt = 0,
  position = [0, 0, 0],
  scale = 1,
}: BalanceScaleProps) {
  const beamRef = useRef<THREE.Group>(null);
  const leftRef = useRef<THREE.Group>(null);
  const rightRef = useRef<THREE.Group>(null);
  const pan = useMemo(panGeometry, []);
  const roughnessMap = useMemo(() => hammeredRoughness(), []);

  const MAX_TILT = 0.17;
  const DROP = 0.46;

  useFrame((_, delta) => {
    const beam = beamRef.current;
    if (!beam) return;

    const live = tiltRef ? (tiltRef.current ?? 0) : tilt;
    const target = THREE.MathUtils.clamp(live, -1, 1) * MAX_TILT;
    // Critically-damped approach: quick to respond, no overshoot, no bounce.
    const k = 1 - Math.pow(0.004, delta);
    beam.rotation.z += (target - beam.rotation.z) * k;

    // Pans hang plumb regardless of how the beam sits.
    const z = beam.rotation.z;
    if (leftRef.current) leftRef.current.rotation.z = -z;
    if (rightRef.current) rightRef.current.rotation.z = -z;
  });

  return (
    <group position={position} scale={scale}>
      {/* Weighted base */}
      <mesh position={[0, 0.045, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.44, 0.5, 0.09, 40]} />
        <meshPhysicalMaterial {...BRASS} roughnessMap={roughnessMap} />
      </mesh>
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.32, 0.06, 32]} />
        <meshPhysicalMaterial {...BRASS} />
      </mesh>

      {/* Column */}
      <mesh position={[0, PIVOT_Y / 2 + 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.032, 0.05, PIVOT_Y - 0.1, 16]} />
        <meshPhysicalMaterial {...BRASS} />
      </mesh>

      {/* Pivot cap */}
      <mesh position={[0, PIVOT_Y + 0.04, 0]} castShadow>
        <sphereGeometry args={[0.055, 20, 14]} />
        <meshPhysicalMaterial {...BRASS} roughness={0.24} />
      </mesh>

      {/* Beam and both hanging pans */}
      <group ref={beamRef} position={[0, PIVOT_Y, 0]}>
        <mesh castShadow>
          <boxGeometry args={[ARM * 2, 0.04, 0.055]} />
          <meshPhysicalMaterial {...BRASS} />
        </mesh>
        {/* End finials stop the beam looking like a plank */}
        {[-ARM, ARM].map((x) => (
          <mesh key={x} position={[x, 0, 0]} castShadow>
            <sphereGeometry args={[0.036, 14, 10]} />
            <meshPhysicalMaterial {...BRASS} roughness={0.26} />
          </mesh>
        ))}

        <group ref={leftRef} position={[-ARM, 0, 0]}>
          <Suspension drop={DROP} />
          <mesh geometry={pan} position={[0, -DROP, 0]} castShadow receiveShadow>
            <meshPhysicalMaterial
              {...BRASS}
              color="#0A5138"
              metalness={0.85}
              roughness={0.38}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        <group ref={rightRef} position={[ARM, 0, 0]}>
          <Suspension drop={DROP} />
          <mesh geometry={pan} position={[0, -DROP, 0]} castShadow receiveShadow>
            <meshPhysicalMaterial
              {...BRASS}
              color="#C9A34E"
              metalness={0.95}
              roughness={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default memo(BalanceScale);
