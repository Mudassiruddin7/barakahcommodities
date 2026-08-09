// ============================================
// Shared 3D Lighting Setup
// ============================================

export default function SceneLighting() {
  return (
    <>
      {/* Strong ambient fill so objects are always visible */}
      <ambientLight intensity={0.8} color="#FFF8F0" />

      {/* Key light — warm directional from upper right */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.8}
        color="#FFF5E6"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />

      {/* Fill light — from opposite side */}
      <directionalLight
        position={[-3, 4, -5]}
        intensity={0.6}
        color="#E8EAF0"
      />

      {/* Gold accent point light from above */}
      <pointLight
        position={[0, 4, 2]}
        intensity={1.0}
        color="#C9A34E"
        distance={15}
        decay={2}
      />

      {/* Front fill to ensure objects are lit from camera direction */}
      <directionalLight
        position={[0, 2, 8]}
        intensity={0.5}
        color="#FFFFFF"
      />
    </>
  );
}
