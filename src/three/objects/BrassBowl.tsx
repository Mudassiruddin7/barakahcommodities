// ============================================================
// BrassBowl — a shallow hammered dish. The contents go in as children,
// positioned in the bowl's own space.
// ============================================================

import { memo, useMemo, type ReactNode } from 'react';
import { bowlGeometry } from '../geometry';
import { brass } from '../materials';

export interface BrassBowlProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  radius?: number;
  children?: ReactNode;
}

function BrassBowl({ position, rotation, scale = 1, radius = 1, children }: BrassBowlProps) {
  const geometry = useMemo(() => bowlGeometry(radius), [radius]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={geometry} material={brass()} castShadow receiveShadow />
      {children}
    </group>
  );
}

export default memo(BrassBowl);
