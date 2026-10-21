// ============================================================
// Motion — one place that registers the GSAP plugins and decides
// how this site moves.
//
// The house easing is a strong exponential ease-out: movement starts
// fast and settles late, so the page answers a scroll or a click the
// instant it happens. Nothing ever eases in. UI feedback is CSS;
// scroll-linked storytelling is GSAP ScrollTrigger; the 3D has its own
// loop. No element is animated by two of them at once.
// ============================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { CustomBounce } from 'gsap/CustomBounce';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase, CustomBounce);

/** Same curve as --ease-out in the stylesheet. */
export const EASE_OUT = CustomEase.create('barakah-out', '0.23, 1, 0.32, 1');

/** A rubber stamp coming down: lands hard, rebounds a hair, rests. */
export const EASE_STAMP = CustomBounce.create('barakah-stamp', {
  strength: 0.28,
  squash: 0,
  endAtStart: false,
});

export { gsap, ScrollTrigger, SplitText };

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Lines of a heading slide up out of a mask, one after another. The text is
 * already in the DOM and fully visible if this never runs.
 */
export function revealLines(el: Element, options: { delay?: number; start?: string } = {}): () => void {
  if (prefersReducedMotion()) return () => {};

  const split = SplitText.create(el as HTMLElement, {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 108,
        duration: 0.95,
        ease: EASE_OUT,
        stagger: 0.075,
        delay: options.delay ?? 0,
        scrollTrigger: { trigger: el, start: options.start ?? 'top 88%', once: true },
      }),
  });

  return () => split.revert();
}
