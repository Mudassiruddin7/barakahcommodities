// ============================================================
// StageCanvas — the actual Canvas. Only ever loaded on demand.
//
// Everything that pulls in three.js lives behind this module so the
// first paint never waits on the 3D bundle. Stage.tsx owns the lazy
// boundary and the lifetime; this owns the render loop:
//
//   · no frames at all while the scene is off-screen or the tab hidden
//   · DPR capped by measured device tier, clawed back if frames drop
//   · a lost WebGL context swaps in the flat fallback, and a restored one
//     rebuilds the scene from scratch
// ============================================================

import { memo, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, type CameraProps } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { getGLInfo } from './gl';
import { StageContext } from './context';
import { useReducedMotion } from '../hooks';

export interface StageCanvasProps {
  children: ReactNode;
  camera?: CameraProps;
  fallback?: ReactNode;
}

function StageCanvas({ children, camera, fallback }: StageCanvasProps) {
  const info = getGLInfo();
  const hostRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Starts true on purpose. R3F only applies its first size measurement on a
  // rendered frame, so a canvas created with frameloop="never" stays at the
  // 300x150 HTML default. Stage mounts this only when the slot is near the
  // viewport, and the observers below pause it within a frame if it is not.
  const [nearScreen, setNearScreen] = useState(true);
  const [inView, setInView] = useState(false);
  const [tabActive, setTabActive] = useState(true);
  const [lost, setLost] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio || 1, info.dprCeiling));

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const near = new IntersectionObserver(([e]) => setNearScreen(e.isIntersecting), {
      rootMargin: '200px 0px',
    });
    const visible = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.2,
    });
    near.observe(host);
    visible.observe(host);
    return () => {
      near.disconnect();
      visible.disconnect();
    };
  }, []);

  // One resize after layout settles makes R3F measure a container it may have
  // read as zero-sized while arriving through Suspense.
  useEffect(() => {
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Pausing has to undo itself: a handler that only ever pauses freezes the
  // scene for good once someone switches tabs and comes back.
  useEffect(() => {
    const onVisibility = () => setTabActive(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const handleIncline = useCallback(
    () => setDpr(Math.min(window.devicePixelRatio || 1, info.dprCeiling)),
    [info.dprCeiling]
  );
  const handleDecline = useCallback(() => setDpr(1), []);

  const stage = useMemo(
    () => ({ active: inView && tabActive, tier: info.tier, reducedMotion }),
    [inView, tabActive, info.tier, reducedMotion]
  );

  return (
    <div ref={hostRef} className="stage__canvas">
      <Canvas
        key={epoch}
        shadows={info.tier === 'low' ? false : 'percentage'}
        dpr={dpr}
        frameloop={nearScreen && tabActive ? 'always' : 'never'}
        camera={camera}
        gl={{
          alpha: true,
          antialias: info.tier !== 'low',
          powerPreference: 'high-performance',
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          // Khronos PBR Neutral: built for product renders, it keeps gold gold
          // instead of sliding it toward orange the way ACES does.
          gl.toneMapping = THREE.NeutralToneMapping;
          gl.toneMappingExposure = 1;

          const el = gl.domElement;
          el.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            setLost(true);
          });
          el.addEventListener('webglcontextrestored', () => {
            setLost(false);
            setEpoch((n) => n + 1);
          });
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <PerformanceMonitor onIncline={handleIncline} onDecline={handleDecline}>
          <StageContext.Provider value={stage}>{children}</StageContext.Provider>
        </PerformanceMonitor>
      </Canvas>

      {lost && <div className="stage__lost">{fallback}</div>}
    </div>
  );
}

export default memo(StageCanvas);
