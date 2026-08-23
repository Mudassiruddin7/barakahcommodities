// ============================================================
// Motion — one easing curve, one set of variants, one GSAP helper.
//
// Framer Motion owns discrete UI transitions (reveals, hovers,
// menus). GSAP ScrollTrigger owns scroll-linked storytelling.
// Nothing is animated by both.
// ============================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Variants } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

/** The single easing curve the whole site moves on. */
export const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
export const GSAP_EASE = 'power3.out';

export const DURATION = {
  fast: 0.24,
  base: 0.52,
  slow: 0.78,
  cinematic: 1.25,
} as const;

// ---------- Framer variants ----------

export const riseIn: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.base, ease: EASE } },
};

export const maskUp: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.9, ease: EASE } },
};

export const stagger = (each = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren: delay } },
});

/** Standard viewport config: fire once, slightly before fully in view. */
export const VIEWPORT = { once: true, margin: '-12% 0px -12% 0px' } as const;

// ---------- GSAP ----------

interface ScrollRevealOptions {
  trigger: Element;
  start?: string;
  y?: number;
  stagger?: number;
  duration?: number;
}

/**
 * Reveals a set of elements as their section enters view.
 * Returns a disposer that kills the tween and its ScrollTrigger.
 */
export function scrollReveal(
  targets: Element[] | NodeListOf<Element>,
  { trigger, start = 'top 78%', y = 26, stagger: each = 0.09, duration = 0.8 }: ScrollRevealOptions
): () => void {
  const list = Array.from(targets);
  if (!list.length) return () => {};

  const tween = gsap.from(list, {
    y,
    opacity: 0,
    duration,
    stagger: each,
    ease: GSAP_EASE,
    scrollTrigger: { trigger, start, toggleActions: 'play none none none' },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set(list, { clearProps: 'all' });
  };
}

/**
 * Draws an SVG path as its section scrolls through the viewport.
 * `scrub` ties the draw to scroll position rather than to a clock.
 */
export function drawPath(
  path: SVGPathElement | SVGLineElement,
  { trigger, start = 'top 72%', end = 'bottom 60%' }: { trigger: Element; start?: string; end?: string }
): () => void {
  const length = path.getTotalLength();
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

  const tween = gsap.to(path, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: { trigger, start, end, scrub: 0.6 },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

/** Counts a number up when its element enters view. */
export function countUp(
  el: HTMLElement,
  value: number,
  { trigger, format }: { trigger: Element; format: (n: number) => string }
): () => void {
  const proxy = { n: 0 };

  const tween = gsap.to(proxy, {
    n: value,
    duration: DURATION.cinematic,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = format(Math.round(proxy.n));
    },
    scrollTrigger: { trigger, start: 'top 80%', toggleActions: 'play none none none' },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

export { gsap, ScrollTrigger };
