// ============================================================
// Scroll — smooth scrolling that stays out of the way.
//
// Lenis eases wheel input so the 3D, which renders on the same frame
// clock, never trails the page. It is switched off entirely for anyone
// who has asked for reduced motion and for touch devices, which already
// have native momentum.
// ============================================================

import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion';

let lenis: Lenis | null = null;

export function initScroll(): () => void {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (prefersReducedMotion() || coarse) return () => {};

  const instance = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, smoothWheel: true });
  lenis = instance;

  instance.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => instance.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    instance.destroy();
    if (lenis === instance) lenis = null;
  };
}

/** Jump to a section by hash, using Lenis when it is running. */
export function scrollToHash(hash: string): void {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;

  if (lenis) {
    lenis.scrollTo(target, {
      offset: -56,
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
  } else {
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  history.replaceState(null, '', hash);
}

/** Scroll to an absolute page position. */
export function scrollToY(y: number): void {
  if (lenis) lenis.scrollTo(y, { duration: 1.1, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  else window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

export function scrollToTop(): void {
  if (lenis) lenis.scrollTo(0, { duration: 1.1 });
  else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

/** Freeze or release scrolling (full-screen menu). */
export function setScrollLocked(locked: boolean): void {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}
