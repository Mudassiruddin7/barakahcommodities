// A floor that is invisible except for the shadows that fall on it.
// The page's own paper shows through, so the goods look set down on the page.

import { memo } from 'react';

interface GroundProps {
  size?: number;
  opacity?: number;
  color?: string;
  y?: number;
}

function Ground({ size = 40, opacity = 0.34, color = '#2a2116', y = 0 }: GroundProps) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <shadowMaterial transparent opacity={opacity} color={color} />
    </mesh>
  );
}

export default memo(Ground);
