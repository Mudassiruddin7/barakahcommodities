// ============================================================
// Lighting — a merchant's window, rebuilt as a lighting rig.
//
// The gold reads as gold because it has something to reflect:
// Lightformer panels are baked into a small cube map once
// (frames={1}), so there is no HDR download and no per-frame cost.
// ============================================================

import { memo } from 'react';
import { Environment, Lightformer } from '@react-three/drei';

interface LightingProps {
  /** Low tier skips shadow casting and the secondary rim. */
  tier?: 'high' | 'medium' | 'low';
  /** Warm-to-cool balance; the closing scene runs cooler and deeper. */
  mood?: 'daylight' | 'vault';
}

function Lighting({ tier = 'high', mood = 'daylight' }: LightingProps) {
  const vault = mood === 'vault';

  return (
    <>
      {/* Environment: the reflected world. Rendered once, then static. */}
      <Environment resolution={tier === 'low' ? 128 : 256} frames={1}>
        {/*
          Overhead panel. Upward-facing polished metal reflects whatever sits
          directly above it, and with nothing at the zenith the tops of the
          bullion came out near-black. This is the sky for that reflection.
        */}
        <Lightformer
          form="rect"
          intensity={vault ? 2.6 : 2.4}
          position={[0, 6, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[10, 10, 1]}
          color={vault ? '#EADCBC' : '#FFFAF0'}
        />

        {/* Broad window softbox — the dominant reflection in the metal */}
        <Lightformer
          form="rect"
          intensity={vault ? 1.6 : 2.6}
          position={[2.5, 4, 3]}
          rotation={[-Math.PI / 3, 0, 0]}
          scale={[8, 5, 1]}
          color={vault ? '#F0E2BE' : '#FFF6E4'}
        />
        {/* Cool bounce from the opposite wall keeps highlights from going flat */}
        <Lightformer
          form="rect"
          intensity={vault ? 0.5 : 0.9}
          position={[-4, 2, -3]}
          rotation={[0, Math.PI / 2.4, 0]}
          scale={[6, 4, 1]}
          color="#C8D4D8"
        />
        {/* Warm gold card under the horizon — where the ingot picks up its glow */}
        <Lightformer
          form="rect"
          intensity={vault ? 1.4 : 1.0}
          position={[0, -1.2, 2.5]}
          rotation={[Math.PI / 2.6, 0, 0]}
          scale={[6, 2.5, 1]}
          color="#C9A34E"
        />
        {/* Narrow specular strip that draws the ingot's top edge */}
        <Lightformer
          form="rect"
          intensity={vault ? 2.4 : 2.0}
          position={[-1.5, 3.5, 1]}
          rotation={[-Math.PI / 2.2, 0, Math.PI / 8]}
          scale={[0.6, 4, 1]}
          color="#FFFFFF"
        />
        {/* Deep emerald surround — ties the 3D to the brand */}
        <Lightformer
          form="ring"
          intensity={0.5}
          position={[0, 1, -6]}
          scale={[10, 10, 1]}
          color="#0A4E36"
        />

        {/*
          Metal only reads as metal when there is something dark for it to
          reflect between the highlights. These two panels give the lower
          hemisphere a warm, dim bounce instead of the black void that made
          an earlier version of the bullion look like a flat yellow block.
        */}
        <Lightformer
          form="rect"
          intensity={0.42}
          position={[0, -2.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[12, 12, 1]}
          color="#6B5433"
        />
        <Lightformer
          form="rect"
          intensity={0.9}
          position={[3.5, 1.2, -2]}
          rotation={[0, -Math.PI / 2.6, 0]}
          scale={[5, 4, 1]}
          color="#F2DFB4"
        />
      </Environment>

      {/* Direct lights carry the shadows the environment cannot. */}
      <ambientLight intensity={vault ? 0.38 : 0.4} color="#FFF4E2" />

      <directionalLight
        position={[4, 7, 4]}
        intensity={vault ? 2.1 : 2.2}
        color={vault ? '#F5E7C4' : '#FFF3DE'}
        castShadow={tier !== 'low'}
        shadow-mapSize={tier === 'high' ? 1024 : 512}
        shadow-bias={-0.0008}
        shadow-normalBias={0.02}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />

      {tier !== 'low' && (
        <directionalLight
          position={[-5, 3, -4]}
          intensity={0.45}
          color="#B9C9CE"
        />
      )}

      {/* A single close warm source — the lamp on the merchant's desk. */}
      <pointLight
        position={[1.6, 2.2, 1.8]}
        intensity={vault ? 5 : 3}
        distance={9}
        decay={2}
        color="#E8C88A"
      />
    </>
  );
}

export default memo(Lighting);
