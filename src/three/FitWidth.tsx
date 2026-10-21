// ============================================================
// FitWidth — keep a composition whole at any canvas aspect ratio.
//
// A still life composed for a wide frame loses its edges on a phone.
// This pulls the camera back along its own view direction until
// `width` world units fit across the canvas, and never closer than
// the camera's authored distance. It always works from the camera's
// authored position, so running it again on resize does not drift.
// ============================================================

import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FitWidthProps {
  /** World-space width that must stay in frame, at the focus plane. */
  width: number;
  /** Projected height of the composition as seen from the camera, if it matters. */
  height?: number;
  /** Where the camera looks. */
  target?: [number, number, number];
}

export default function FitWidth({ width, height = 0, target = [0, 0.4, 0] }: FitWidthProps) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);

  useLayoutEffect(() => {
    const store = camera.userData as { home?: THREE.Vector3 };
    if (!store.home) store.home = camera.position.clone();

    const aspect = size.width / Math.max(size.height, 1);
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const needed = Math.max(width / 2 / (tan * aspect), height / 2 / tan);

    const t = new THREE.Vector3(...target);
    const dir = store.home.clone().sub(t);
    const authored = dir.length();
    dir.normalize();

    camera.position.copy(t).addScaledVector(dir, Math.max(authored, needed));
    camera.lookAt(t);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height, width, height, target]);

  return null;
}
