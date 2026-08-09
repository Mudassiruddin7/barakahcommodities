// ============================================
// Procedural Gold Bar — PBR
// ============================================

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GoldBarProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export default function GoldBar({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: GoldBarProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const targetScale = useRef(scale);

  useFrame(() => {
    if (!meshRef.current) return;
    targetScale.current = hovered ? scale * 1.05 : scale;
    const s = meshRef.current.scale.x;
    const newScale = s + (targetScale.current - s) * 0.08;
    meshRef.current.scale.setScalar(newScale);
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1.8, 0.4, 0.8]} />
      <meshStandardMaterial
        color="#D4AF37"
        metalness={0.7}
        roughness={0.25}
        emissive="#8B6914"
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}
