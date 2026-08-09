// ============================================
// Hero 3D Scene — R3F Canvas (Simplified & Robust)
// ============================================

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ---- Simple gold bar ---- */
function GoldBar() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3;
  });
  return (
    <mesh ref={ref} position={[-0.5, 0.3, 0]} castShadow>
      <boxGeometry args={[1.6, 0.35, 0.7]} />
      <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.6} emissive="#6B4F1D" emissiveIntensity={0.25} />
    </mesh>
  );
}

/* ---- Spice cluster ---- */
function SpiceCluster() {
  const colors = ['#8B4513', '#D2691E', '#CD853F', '#A0522D', '#DEB887'];
  const items = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2 + i * 0.5;
    const r = 0.15 + (i % 3) * 0.12;
    return {
      pos: [Math.cos(a) * r, 0.04 + Math.random() * 0.03, Math.sin(a) * r] as [number, number, number],
      size: 0.035 + (i % 4) * 0.012,
      color: colors[i % colors.length],
    };
  });
  return (
    <group position={[1.3, 0, -0.1]}>
      {items.map((s, i) => (
        <mesh key={i} position={s.pos}>
          <sphereGeometry args={[s.size, 8, 6]} />
          <meshStandardMaterial color={s.color} roughness={0.7} emissive={s.color} emissiveIntensity={0.15} />
        </mesh>
      ))}
    </group>
  );
}

/* ---- Dry fruit cluster ---- */
function DryFruitCluster() {
  const colors = ['#8B6914', '#6B4423', '#A0522D', '#CD853F'];
  const items = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + i * 0.7;
    const r = 0.12 + (i % 3) * 0.1;
    return {
      pos: [Math.cos(a) * r, 0.06, Math.sin(a) * r] as [number, number, number],
      size: 0.05 + (i % 3) * 0.02,
      color: colors[i % colors.length],
    };
  });
  return (
    <group position={[-1.5, 0, -0.3]}>
      {items.map((f, i) => (
        <mesh key={i} position={f.pos} scale={[1, 0.7, 1]}>
          <dodecahedronGeometry args={[f.size, 0]} />
          <meshStandardMaterial color={f.color} roughness={0.6} emissive={f.color} emissiveIntensity={0.12} />
        </mesh>
      ))}
    </group>
  );
}

/* ---- Wooden surface ---- */
function Surface() {
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[7, 7]} />
      <meshStandardMaterial color="#3D2415" roughness={0.9} emissive="#1A0E08" emissiveIntensity={0.15} />
    </mesh>
  );
}

/* ---- Scene group with subtle mouse follow ---- */
function SceneContent() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ pointer }) => {
    if (!group.current) return;
    group.current.rotation.y += 0.001;
    group.current.position.x += (pointer.x * 0.2 - group.current.position.x) * 0.02;
    group.current.position.y += (pointer.y * 0.1 - group.current.position.y) * 0.02;
  });

  return (
    <group ref={group}>
      <Surface />
      <GoldBar />
      <SpiceCluster />
      <DryFruitCluster />
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 3, 5.5], fov: 38 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100%', height: '100%' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      {/* Lights — strong enough to see without env map */}
      <ambientLight intensity={1.0} />
      <directionalLight position={[5, 8, 5]} intensity={2.0} color="#FFF5E6" />
      <directionalLight position={[-4, 5, -3]} intensity={0.8} color="#E0E4F0" />
      <pointLight position={[0, 4, 2]} intensity={1.5} color="#D4AF37" distance={15} />
      <directionalLight position={[0, 2, 6]} intensity={0.7} />

      <SceneContent />
    </Canvas>
  );
}
