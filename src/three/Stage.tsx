// ============================================================
// Stage — the boundary every 3D scene lives behind.
//
// Three responsibilities, none of which the scene itself needs to know:
//
//   1. Load nothing until the slot is near the viewport. three.js, R3F and
//      drei are the heaviest thing on the page by a wide margin; the copy,
//      headlines and calls to action paint without them.
//   2. Hold at most a couple of live WebGL contexts. A canvas is created when
//      its slot gets within ~one screen of the viewport and destroyed again
//      once it is more than two and a half screens away. Browsers kill the
//      oldest context past 16 — which is how earlier scenes used to go blank.
//   3. Never leave a hole. No WebGL, a lost context, a failed chunk or a
//      throwing scene all resolve to the designed `fallback`.
// ============================================================

import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import type { CameraProps } from '@react-three/fiber';
import { getGLInfo } from './gl';

const StageCanvas = lazy(() => import('./StageCanvas'));

export interface StageProps {
  children: ReactNode;
  camera?: CameraProps;
  /** Flat illustration shown instead of the canvas when 3D is unavailable. */
  fallback?: ReactNode;
  className?: string;
  label?: string;
}

interface BoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

class SceneBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('[Stage] scene failed, showing the fallback instead.', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function Stage({ children, camera, fallback, className, label }: StageProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { supported } = getGLInfo();

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !supported) return;

    if (typeof IntersectionObserver === 'undefined') {
      setMounted(true);
      return;
    }

    const arrive = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: '90% 0px' }
    );
    const depart = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setMounted(false);
      },
      { rootMargin: '260% 0px' }
    );

    arrive.observe(host);
    depart.observe(host);
    return () => {
      arrive.disconnect();
      depart.disconnect();
    };
  }, [supported]);

  const classes = className ? `stage ${className}` : 'stage';

  if (!supported) {
    return (
      <div className={classes} role="img" aria-label={label}>
        {fallback}
      </div>
    );
  }

  return (
    <div ref={hostRef} className={classes} role="img" aria-label={label}>
      {mounted && (
        <SceneBoundary fallback={fallback}>
          <Suspense fallback={null}>
            <StageCanvas camera={camera} fallback={fallback}>
              {children}
            </StageCanvas>
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}
