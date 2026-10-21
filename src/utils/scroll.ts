// ============================================================
// Scroll — native, on purpose.
//
// The page used to smooth and re-time the scroll itself. That made
// scrolling feel heavy on modest devices, so it is back to the browser's
// own scrolling; these helpers only handle in-page jumps and the menu lock.
// ============================================================

import { prefersReducedMotion } from './motion';

/** Jump to a section by hash. */
export function scrollToHash(hash: string): void {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;
  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', hash);
}

export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

/** Freeze or release scrolling while the full-screen menu is open. */
export function setScrollLocked(locked: boolean): void {
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}
