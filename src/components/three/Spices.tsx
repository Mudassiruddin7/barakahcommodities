// ============================================
// Procedural Spice Cluster
// ============================================

import { useMemo } from 'react';

const SPICE_COLORS = ['#8B4513', '#D2691E', '#CD853F', '#A0522D', '#DEB887', '#B8860B'];

interface SpicesProps {
  position?: [number, number, number];
  scale?: number;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function Spices({ position = [0, 0, 0], scale = 1 }: SpicesProps) {
  const particles = useMemo(() => {
    const items: Array<{
      pos: [number, number, number];
      radius: number;
      color: string;
      type: 'sphere' | 'stick';
      rotation: [number, number, number];
    }> = [];

    // Spice seeds/granules — small spheres
    for (let i = 0; i < 18; i++) {
      const angle = seededRandom(i * 7.3) * Math.PI * 2;
      const dist = seededRandom(i * 3.1 + 5) * 0.5;
      items.push({
        pos: [
          Math.cos(angle) * dist,
          seededRandom(i * 2.7 + 1) * 0.08 + 0.04,
          Math.sin(angle) * dist,
        ],
        radius: 0.04 + seededRandom(i * 5.9 + 2) * 0.05,
        color: SPICE_COLORS[Math.floor(seededRandom(i * 4.3 + 3) * SPICE_COLORS.length)],
        type: 'sphere',
        rotation: [0, 0, 0],
      });
    }

    // Cinnamon sticks
    for (let i = 0; i < 3; i++) {
      const angle = seededRandom(i * 11.7 + 20) * Math.PI * 2;
      items.push({
        pos: [
          Math.cos(angle) * 0.25,
          0.06,
          Math.sin(angle) * 0.25,
        ],
        radius: 0.025,
        color: '#6B3410',
        type: 'stick',
        rotation: [
          0,
          seededRandom(i * 9.1 + 30) * Math.PI,
          Math.PI / 2 + (seededRandom(i * 6.3 + 40) - 0.5) * 0.3,
        ],
      });
    }

    return items;
  }, []);

  return (
    <group position={position} scale={scale}>
      {particles.map((p, i) =>
        p.type === 'sphere' ? (
          <mesh key={i} position={p.pos} castShadow>
            <sphereGeometry args={[p.radius, 8, 6]} />
            <meshStandardMaterial
              color={p.color}
              roughness={0.75}
              metalness={0.0}
              emissive={p.color}
              emissiveIntensity={0.1}
            />
          </mesh>
        ) : (
          <mesh key={i} position={p.pos} rotation={p.rotation} castShadow>
            <cylinderGeometry args={[p.radius, p.radius * 0.8, 0.3, 6]} />
            <meshStandardMaterial
              color={p.color}
              roughness={0.8}
              metalness={0.0}
              emissive={p.color}
              emissiveIntensity={0.05}
            />
          </mesh>
        )
      )}
    </group>
  );
}
