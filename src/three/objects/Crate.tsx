// ============================================================
// Crate — slatted timber shipping crates.
//
// These replaced an earlier procedural jute sack. The sack was
// geometrically plausible but read as a turned wooden pot at every
// camera angle, which is worse than useless in a scene whose whole
// job is to say "physical goods". A crate is unmistakable.
// ============================================================

import { memo, useMemo } from 'react';

import { woodColorMap } from '../textures';

export interface CrateProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** A single crate, or a small stack of three. */
  stacked?: boolean;
  /** Fills the top crate with goods so it reads as open, not empty. */
  open?: boolean;
}

const W = 0.72;
const H = 0.44;
const D = 0.56;
const SLAT = 0.035;

/** One crate: four corner posts and horizontal slats with gaps between. */
function Box({ open }: { open: boolean }) {
  const map = useMemo(() => {
    const t = woodColorMap().clone();
    t.repeat.set(2, 2);
    t.needsUpdate = true;
    return t;
  }, []);

  const timber = (
    <meshStandardMaterial map={map} color="#C6A276" roughness={0.86} metalness={0} />
  );

  // Three slats per side, with the gaps that make a crate a crate.
  const rows = useMemo(() => [0.07, H / 2, H - 0.07], []);

  return (
    <group>
      {/* Corner posts */}
      {[
        [-W / 2 + 0.03, D / 2 - 0.03],
        [W / 2 - 0.03, D / 2 - 0.03],
        [-W / 2 + 0.03, -D / 2 + 0.03],
        [W / 2 - 0.03, -D / 2 + 0.03],
      ].map(([x, z], i) => (
        <mesh key={`p${i}`} position={[x, H / 2, z]} castShadow receiveShadow>
          <boxGeometry args={[0.055, H, 0.055]} />
          {timber}
        </mesh>
      ))}

      {/* Front and back slats */}
      {rows.map((y, i) => (
        <group key={`fb${i}`}>
          <mesh position={[0, y, D / 2 - 0.012]} castShadow receiveShadow>
            <boxGeometry args={[W, SLAT * 2.2, 0.022]} />
            {timber}
          </mesh>
          <mesh position={[0, y, -D / 2 + 0.012]} castShadow receiveShadow>
            <boxGeometry args={[W, SLAT * 2.2, 0.022]} />
            {timber}
          </mesh>
        </group>
      ))}

      {/* Side slats */}
      {rows.map((y, i) => (
        <group key={`lr${i}`}>
          <mesh position={[W / 2 - 0.012, y, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.022, SLAT * 2.2, D]} />
            {timber}
          </mesh>
          <mesh position={[-W / 2 + 0.012, y, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.022, SLAT * 2.2, D]} />
            {timber}
          </mesh>
        </group>
      ))}

      {/* Base boards */}
      <mesh position={[0, 0.018, 0]} receiveShadow castShadow>
        <boxGeometry args={[W - 0.02, 0.036, D - 0.02]} />
        {timber}
      </mesh>

      {open && (
        // Goods filling the crate, sitting below the top rail.
        <mesh position={[0, H - 0.12, 0]} receiveShadow>
          <boxGeometry args={[W - 0.09, 0.16, D - 0.09]} />
          <meshStandardMaterial color="#6E4A22" roughness={1} metalness={0} />
        </mesh>
      )}
    </group>
  );
}

function Crate({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  stacked = true,
  open = true,
}: CrateProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Box open={false} />

      {stacked && (
        <>
          {/* Second crate set a little askew — stacked by hand, not by machine */}
          <group position={[0.035, H + 0.02, -0.02]} rotation={[0, 0.09, 0]}>
            <Box open={open} />
          </group>
          {/* A third pushed off to the side */}
          <group position={[-W - 0.09, 0, 0.16]} rotation={[0, -0.24, 0]} scale={0.88}>
            <Box open={false} />
          </group>
        </>
      )}
    </group>
  );
}

export default memo(Crate);
