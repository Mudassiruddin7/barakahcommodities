// ============================================
// Procedural Dry Fruit Cluster
// ============================================

import { useMemo } from 'react';

const FRUIT_COLORS = ['#8B6914', '#6B4423', '#A0522D', '#DEB887', '#CD853F', '#9B7340'];

interface DryFruitsProps {
  position?: [number, number, number];
  scale?: number;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function DryFruits({ position = [0, 0, 0], scale = 1 }: DryFruitsProps) {
  const fruits = useMemo(() => {
    const items: Array<{
      pos: [number, number, number];
      radius: number;
      color: string;
      scaleY: number;
      rotation: [number, number, number];
    }> = [];

    for (let i = 0; i < 10; i++) {
      const angle = seededRandom(i * 8.3 + 100) * Math.PI * 2;
      const dist = seededRandom(i * 4.7 + 101) * 0.45;
      items.push({
        pos: [
          Math.cos(angle) * dist,
          seededRandom(i * 3.9 + 102) * 0.06 + 0.06,
          Math.sin(angle) * dist,
        ],
        radius: 0.06 + seededRandom(i * 6.1 + 103) * 0.07,
        color: FRUIT_COLORS[Math.floor(seededRandom(i * 5.3 + 104) * FRUIT_COLORS.length)],
        scaleY: 0.6 + seededRandom(i * 7.7 + 105) * 0.3,
        rotation: [
          seededRandom(i * 2.1 + 106) * 0.5,
          seededRandom(i * 3.3 + 107) * Math.PI * 2,
          seededRandom(i * 4.9 + 108) * 0.3,
        ],
      });
    }

    return items;
  }, []);

  return (
    <group position={position} scale={scale}>
      {fruits.map((f, i) => (
        <mesh
          key={i}
          position={f.pos}
          rotation={f.rotation}
          scale={[1, f.scaleY, 1]}
          castShadow
        >
          <dodecahedronGeometry args={[f.radius, 0]} />
          <meshStandardMaterial
            color={f.color}
            roughness={0.65}
            metalness={0.05}
            emissive={f.color}
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}
