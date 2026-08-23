// ============================================================
// Stage — the lazy boundary in front of every 3D scene.
//
// three.js, R3F and drei together are the largest thing on this
// page by a wide margin. Keeping them behind this boundary means
// the headline, the copy and the calls to action paint without
// waiting for any of it.
//
// The canvas is only requested once the section is near the
// viewport, so a visitor who never scrolls past the hero
// downloads exactly one 3D bundle.
// ============================================================

import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import type { CameraProps } from '@react-three/fiber';

const StageCanvas = lazy(() => import('./StageCanvas'));

export interface StageProps {
  children: ReactNode;
  camera?: CameraProps;
  /**
   * Shown only when WebGL is genuinely unavailable — not while the 3D bundle
   * loads. Rendering a designed panel during loading made every visitor see a
   * heavy placeholder flash before the scene arrived.
   */
  fallback?: ReactNode;
  className?: string;
  rootMargin?: string;
  onDemand?: boolean;
  label?: string;
}

export default function Stage({ fallback, className, ...props }: StageProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  // Request the bundle a little before the section arrives, so the
  // canvas is ready by the time it is actually on screen.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    if (typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px 0px' }
    );

    io.observe(host);
    return () => io.disconnect();
  }, []);

  // Before the section is near, and while the chunk is in flight, the slot is
  // simply empty. The layout already reserves the space, so nothing shifts.
  if (!near) {
    return <div ref={hostRef} className={className} aria-hidden="true" />;
  }

  return (
    <Suspense fallback={<div className={className} aria-hidden="true" />}>
      <StageCanvas className={className} fallback={fallback} {...props} />
    </Suspense>
  );
}
