// ============================================
// Balance Scale — Risk Section (Self-contained)
// ============================================

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Scale() {
  const beamRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!beamRef.current) return;
    beamRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.5) * 0.05;
  });

  const metal = { color: '#7A7D76', metalness: 0.4, roughness: 0.4, emissive: '#3A3D36', emissiveIntensity: 0.15 };

  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.4, 0.45, 0.08, 24]} />
        <meshStandardMaterial {...metal} />
      </mesh>

      {/* Pillar */}
      <mesh position={[0, 0.83, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 1.5, 12]} />
        <meshStandardMaterial {...metal} />
      </mesh>

      {/* Top pivot */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.06, 12, 8]} />
        <meshStandardMaterial {...metal} />
      </mesh>

      {/* Beam group */}
      <group ref={beamRef} position={[0, 1.55, 0]}>
        <mesh>
          <boxGeometry args={[2.0, 0.06, 0.12]} />
          <meshStandardMaterial {...metal} />
        </mesh>

        {/* Left chain + pan (PROFIT) */}
        <mesh position={[-0.9, -0.25, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.45, 6]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <mesh position={[-0.9, -0.5, 0]}>
          <cylinderGeometry args={[0.28, 0.3, 0.05, 20]} />
          <meshStandardMaterial color="#2E8B57" roughness={0.5} metalness={0.3} emissive="#1A5C42" emissiveIntensity={0.2} />
        </mesh>

        {/* Right chain + pan (RISK) */}
        <mesh position={[0.9, -0.25, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.45, 6]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <mesh position={[0.9, -0.5, 0]}>
          <cylinderGeometry args={[0.28, 0.3, 0.05, 20]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.5} metalness={0.3} emissive="#8B6914" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </group>
  );
}

export default function BalanceSceneCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 1.5, 4], fov: 35 }}
      style={{ width: '100%', height: '100%' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <ambientLight intensity={1.0} />
      <directionalLight position={[5, 8, 5]} intensity={2.0} color="#FFF5E6" />
      <directionalLight position={[-3, 4, -5]} intensity={0.6} />
      <pointLight position={[0, 3, 0]} intensity={1.0} color="#D4AF37" distance={15} />
      <Scale />
    </Canvas>
  );
}
