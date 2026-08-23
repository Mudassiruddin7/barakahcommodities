// ============================================================
// StageCanvas — the actual Canvas. Loaded only on demand.
//
// Everything that pulls in three.js lives behind this module so
// the first paint never waits on the 3D bundle. Stage.tsx is the
// lazy boundary; this is what it loads.
//
// Responsibilities:
//   • never run a render loop for a scene that is off-screen
//   • cap DPR by measured device capability, then let
//     PerformanceMonitor claw it back down if frames drop
//   • degrade to a typographic fallback with no WebGL
// ============================================================

import {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Canvas, type CameraProps } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { useDeviceTier, useWebGLSupport } from '../hooks';

export interface StageProps {
  children: ReactNode;
  camera?: CameraProps;
  /** Rendered instead of the canvas when WebGL is unavailable. */
  fallback?: ReactNode;
  className?: string;
  /** Extra margin so a scene warms up just before it scrolls into view. */
  rootMargin?: string;
  /** Scenes with no idle motion re-render only when something asks them to. */
  onDemand?: boolean;
  label?: string;
}

const DPR_CEILING: Record<'high' | 'medium' | 'low', number> = {
  high: 1.75,
  medium: 1.35,
  low: 1,
};

function StageCanvas({
  children,
  camera,
  fallback,
  className,
  rootMargin = '250px 0px',
  onDemand = false,
  label,
}: StageProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  // Both start true on purpose. Mounting the Canvas with frameloop="never"
  // means R3F never runs the frame that applies its first size measurement,
  // and the canvas stays stuck at the 300x150 default. Stage only mounts this
  // component once the section is near the viewport, so starting at "always"
  // and letting the observer pause it costs at most a frame or two.
  const [onScreen, setOnScreen] = useState(true);
  const [tabActive, setTabActive] = useState(true);
  const tier = useDeviceTier();
  const webgl = useWebGLSupport();
  const ceiling = DPR_CEILING[tier];
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio || 1, ceiling));
  }, [ceiling]);

  // Pause the loop entirely while the section is out of view. This is the
  // single biggest win on a long scrolling page with several canvases.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    if (typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin, threshold: 0 }
    );
    io.observe(host);
    return () => io.disconnect();
  }, [rootMargin]);

  // R3F sizes itself from a ResizeObserver on its own container and skips
  // creating the renderer entirely while that measurement reads zero. When the
  // Canvas arrives through a Suspense reveal — which is how Stage mounts it —
  // that first measurement can be missed and the canvas stays at the 300x150
  // HTML default with no renderer behind it. One resize event after layout has
  // settled makes it measure again, which is all it needs.
  useEffect(() => {
    let raf = 0;
    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Also stop rendering when the tab is hidden. This has to restore itself:
  // a handler that only ever pauses leaves the scene frozen for good once the
  // visitor switches tabs and comes back.
  useEffect(() => {
    const onVisibility = () => setTabActive(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const handleIncline = useCallback(
    () => setDpr(Math.min(window.devicePixelRatio || 1, ceiling)),
    [ceiling]
  );
  const handleDecline = useCallback(() => setDpr(1), []);

  if (webgl === false) {
    return (
      <div ref={hostRef} className={className} aria-hidden="true">
        {fallback}
      </div>
    );
  }

  const active = onScreen && tabActive;
  const frameloop = !active ? 'never' : onDemand ? 'demand' : 'always';

  return (
    <div ref={hostRef} className={className} role="img" aria-label={label}>
      <Canvas
        dpr={dpr}
        frameloop={frameloop}
        camera={camera}
        gl={{
          alpha: true,
          antialias: tier !== 'low',
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <PerformanceMonitor onIncline={handleIncline} onDecline={handleDecline}>
          <Suspense fallback={null}>{children}</Suspense>
        </PerformanceMonitor>
        <AdaptiveDpr pixelated={false} />
      </Canvas>
    </div>
  );
}

export default memo(StageCanvas);
