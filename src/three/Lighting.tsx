// ============================================================
// Lighting — a product-photography softbox rig, rebuilt in code.
//
// Metal looks like metal when it has something bright to reflect and
// something dark to reflect between the bright things. So the room is
// near-black, and a handful of very bright panels sit in it: a large
// overhead, a key in front, two narrow strips that draw the edges of
// every bar, and a pale card on the floor that bounces the page's own
// paper colour back up into the undersides.
//
// The panels are baked into a cube map once (frames={1}) — no HDR
// download, no per-frame cost.
// ============================================================

import { memo, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

/** A soft vertical falloff for a fill panel: bright above, dark below. */
let falloff: THREE.CanvasTexture | null = null;
function verticalFalloff(): THREE.CanvasTexture {
  if (falloff) return falloff;
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 0, 128);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.55, '#8a8a8a');
  g.addColorStop(1, '#111111');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 128);
  falloff = new THREE.CanvasTexture(c);
  falloff.colorSpace = THREE.SRGBColorSpace;
  return falloff;
}
import type { DeviceTier } from './gl';

interface LightingProps {
  tier?: DeviceTier;
  /** Key-light colour temperature. Gold wants it slightly warm. */
  warm?: boolean;
  /** Bounce colour from the ground — match the page the scene sits on. */
  ground?: string;
  /** World x the key light and its shadow should stay centred on. */
  followX?: RefObject<number>;
}

function Lighting({ tier = 'high', warm = true, ground = '#e6e3da', followX }: LightingProps) {
  const key = warm ? '#fff1dc' : '#ffffff';
  const light = useRef<THREE.DirectionalLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);

  // A shadow map only covers so much floor. For a scene that travels, the key
  // light and the point it aims at travel with the camera.
  useFrame(() => {
    if (!followX || !light.current) return;
    const x = followX.current ?? 0;
    light.current.position.set(x - 4.5, 7.5, 5.5);
    target.position.set(x, 0, 0);
  });

  return (
    <>
      <Environment resolution={tier === 'low' ? 128 : 256} frames={1}>
        {/* A dark, warm room: metal needs dark to reflect between the bright. */}
        <color attach="background" args={['#1d1a14']} />

        {/* Overhead softbox: the sky for every upward-facing surface. */}
        <Lightformer form="rect" intensity={1.25} position={[0, 7, 1]} scale={[11, 8, 1]} color={key} />

        {/* Key, front-left and high. */}
        <Lightformer form="rect" intensity={2.4} position={[-6, 4, 5]} scale={[6.5, 6.5, 1]} color={key} />

        {/* Wide fill behind the camera with a falloff: the front faces of the bars read it as a gradient. */}
        <Lightformer
          form="rect"
          map={verticalFalloff()}
          intensity={1.5}
          position={[0, 0.8, 10]}
          scale={[18, 5, 1]}
          color={key}
        />

        {/* Two strips: the long, hard reflections that make a bar look cast. */}
        <Lightformer form="rect" intensity={5} position={[7.5, 2.4, 1.5]} scale={[1.3, 8, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={3.5} position={[-8, 1.5, -2]} scale={[1, 7, 1]} color="#fff4e6" />

        {/* Rim from behind: what the top faces, seen at a low angle, reflect. */}
        <Lightformer form="rect" intensity={0.8} position={[2, 3.6, -8]} scale={[16, 4.5, 1]} color={key} />

        {/* Dim fill from the right, so end faces never go to black. */}
        <Lightformer form="rect" intensity={0.5} position={[9, 1.5, 3]} scale={[5, 5, 1]} color={key} />

        {/* The paper the scene sits on, bounced back up. */}
        <Lightformer
          form="rect"
          intensity={0.9}
          position={[0, -3.4, 2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[16, 10, 1]}
          color={ground}
        />
      </Environment>

      <hemisphereLight args={['#fff7ea', '#b8aa91', 0.62]} />
      <primitive object={target} />
      <directionalLight
        ref={light}
        target={target}
        position={[-4.5, 7.5, 5.5]}
        intensity={1.9}
        color={key}
        castShadow={tier !== 'low'}
        shadow-mapSize={tier === 'high' ? [2048, 2048] : [1024, 1024]}
        shadow-bias={-0.0006}
        shadow-normalBias={0.025}
        shadow-radius={6}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
      />
      {tier !== 'low' && <directionalLight position={[6, 3, -2]} intensity={0.55} color="#e8eef2" />}
    </>
  );
}

export default memo(Lighting);
