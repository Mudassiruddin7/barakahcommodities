// ============================================================
// Shared hooks — viewport state and the scroll/pointer primitives
// the 3D scenes read from.
//
// Anything a render loop consumes is exposed as a ref, not state,
// so pointer and scroll never trigger a React re-render.
// ============================================================

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';

/** Matches a media query and stays subscribed. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Honours the OS "reduce motion" setting and follows later changes. */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
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
 * the element's top reaches the bottom of the screen. `mode: 'exit'` measures
 * only how far the element has scrolled away — right for a hero already at the
 * top of the page. `mode: 'pin'` is for a tall section holding a sticky stage:
 * 0 when its top meets the top of the screen, 1 when its bottom meets the
 * bottom.
 */
export function useScrollProgressRef<T extends HTMLElement = HTMLDivElement>(
  mode: 'enter' | 'exit' | 'pin' = 'enter'
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
      const vh = window.innerHeight;
      let value: number;

      if (mode === 'exit') value = -rect.top / Math.max(rect.height, 1);
      else if (mode === 'pin') value = -rect.top / Math.max(rect.height - vh, 1);
      else value = (vh - rect.top) / Math.max(rect.height + vh, 1);

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
