// ============================================================
// Shared hooks — capability detection, viewport state, and the
// scroll/pointer primitives the 3D scenes read from.
//
// Anything a render loop consumes is exposed as a ref, not state,
// so pointer and scroll never trigger a React re-render.
// ============================================================

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';

export type DeviceTier = 'high' | 'medium' | 'low';

/** Honours the OS "reduce motion" setting and follows later changes. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/**
 * Coarse device tier used to pick geometry detail, DPR ceiling and
 * whether shadows are worth their cost.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>('medium');

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');

    if (!gl) {
      setTier('low');
      return;
    }

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      hardwareConcurrency?: number;
    };
    const memory = nav.deviceMemory ?? 4;
    const cores = nav.hardwareConcurrency ?? 4;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const narrow = window.innerWidth < 768;

    if ((coarse && narrow) || memory <= 2 || cores <= 2) {
      setTier('low');
    } else if (memory <= 4 || cores <= 4 || coarse) {
      setTier('medium');
    } else {
      setTier('high');
    }

    // Release the probe context immediately.
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  }, []);

  return tier;
}

/** null while undetermined, so nothing flashes a fallback on first paint. */
export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
      setSupported(Boolean(gl));
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}

/** Matches a media query and stays subscribed. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

export function useIsTablet(): boolean {
  return useMediaQuery('(max-width: 1023px)');
}

/**
 * Element visibility. `once` latches on first intersection, which is what
 * most reveal animations want.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(options?: {
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}): [RefObject<T | null>, boolean] {
  const { rootMargin = '0px', threshold = 0, once = true } = options ?? {};
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold, once]);

  return [ref, inView];
}

/**
 * Normalised pointer position (-1..1) written straight into a ref.
 * Render loops read `.current` without ever re-rendering React.
 */
export function usePointerRef(enabled = true): RefObject<{ x: number; y: number }> {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const onLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  return pointer;
}

/**
 * How far an element has travelled, 0..1, written to a ref and updated on a
 * single passive scroll listener.
 *
 * `mode: 'enter'` counts the full pass across the viewport, from the moment
 * the element's top reaches the bottom of the screen. That is wrong for a
 * section already at the top of the page — a hero would start life at ~0.5 —
 * so `mode: 'exit'` measures only how far the element has scrolled away.
 */
export function useScrollProgressRef<T extends HTMLElement = HTMLDivElement>(
  mode: 'enter' | 'exit' = 'enter'
): [RefObject<T | null>, RefObject<number>] {
  const ref = useRef<T>(null);
  const progress = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let queued = false;

    const measure = () => {
      queued = false;
      const rect = el.getBoundingClientRect();

      const value =
        mode === 'exit'
          ? -rect.top / Math.max(rect.height, 1)
          : (window.innerHeight - rect.top) / Math.max(rect.height + window.innerHeight, 1);

      progress.current = Math.min(Math.max(value, 0), 1);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [mode]);

  return [ref, progress];
}

/**
 * Magnetic hover: the element leans toward the cursor and springs back.
 * Skipped entirely for reduced motion and coarse pointers.
 */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(
  strength = 0.28
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const fine = useMediaQuery('(pointer: fine)');

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !fine) return;

    let frame = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const tick = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      el.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;

      if (Math.abs(target.x - current.x) > 0.05 || Math.abs(target.y - current.y) > 0.05) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      target.x = (e.clientX - (rect.left + rect.width / 2)) * strength;
      target.y = (e.clientY - (rect.top + rect.height / 2)) * strength;
      start();
    };

    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      start();
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
      el.style.transform = '';
    };
  }, [strength, reduced, fine]);

  return ref;
}

/** Locks body scroll while a full-screen layer is open. */
export function useScrollLock(locked: boolean): void {
  useLayoutEffect(() => {
    if (!locked) return;
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [locked]);
}

/** Smooth in-page navigation that respects reduced motion. */
export function useSmoothScrollTo() {
  const reduced = useReducedMotion();

  return useCallback(
    (hash: string) => {
      const target = document.querySelector(hash);
      if (!target) return;
      target.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      });
    },
    [reduced]
  );
}
