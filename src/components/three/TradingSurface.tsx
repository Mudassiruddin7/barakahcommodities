// ============================================
// Dark Wooden Trading Surface
// ============================================

export default function TradingSurface() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial
        color="#3D2415"
        roughness={0.85}
        metalness={0.05}
        emissive="#1A0E08"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}
