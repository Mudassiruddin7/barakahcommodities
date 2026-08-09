// ============================================
// Cinematic CTA Gold Bar — Slow Drift (Self-contained)
// ============================================

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function DriftingBar() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.rotation.y = t * 0.15;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.08;
    ref.current.position.y = Math.sin(t * 0.4) * 0.12;
  });

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[2.0, 0.45, 0.9]} />
      <meshStandardMaterial color="#D4AF37" metalness={0.6} roughness={0.25} emissive="#8B6914" emissiveIntensity={0.25} />
    </mesh>
  );
}

export default function CTAScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 1, 4], fov: 35 }}
      style={{ width: '100%', height: '100%' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <ambientLight intensity={1.0} />
      <directionalLight position={[5, 8, 5]} intensity={2.0} color="#FFF5E6" />
      <directionalLight position={[-3, 4, -5]} intensity={0.6} />
      <pointLight position={[0, 3, 0]} intensity={1.5} color="#D4AF37" distance={15} />
      <DriftingBar />
    </Canvas>
  );
}
