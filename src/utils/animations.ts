// ============================================
// Barakah Commodities — Animation Utilities
// ============================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ---- Reusable GSAP Defaults ----
export const GSAP_DEFAULTS = {
  ease: 'power3.out',
  duration: 0.8,
};

// ---- Fade-in from below ----
export function createFadeInUp(
  element: string | Element | Element[],
  options?: {
    trigger?: string | Element;
    start?: string;
    delay?: number;
    y?: number;
    duration?: number;
    stagger?: number;
  }
) {
  const {
    trigger,
    start = 'top 85%',
    delay = 0,
    y = 40,
    duration = 0.8,
    stagger = 0,
  } = options || {};

  return gsap.from(element, {
    y,
    opacity: 0,
    duration,
    delay,
    stagger,
    ease: 'power3.out',
    scrollTrigger: trigger
      ? {
          trigger,
          start,
          toggleActions: 'play none none none',
        }
      : undefined,
  });
}

// ---- Staggered reveal for lists ----
export function createStaggerReveal(
  elements: string | Element | Element[],
  trigger: string | Element,
  options?: {
    start?: string;
    stagger?: number;
    y?: number;
    duration?: number;
  }
) {
  const {
    start = 'top 80%',
    stagger = 0.12,
    y = 30,
    duration = 0.7,
  } = options || {};

  return gsap.from(elements, {
    y,
    opacity: 0,
    duration,
    stagger,
    ease: 'power3.out',
    scrollTrigger: {
      trigger,
      start,
      toggleActions: 'play none none none',
    },
  });
}

// ---- Horizontal scroll pinning ----
export function createHorizontalScroll(
  container: string | Element,
  scrollContent: string | Element,
  options?: {
    start?: string;
    end?: string;
    scrub?: number | boolean;
  }
) {
  const { start = 'top top', end, scrub = 1 } = options || {};

  const content =
    typeof scrollContent === 'string'
      ? document.querySelector(scrollContent)
      : scrollContent;

  if (!content) return;

  const scrollWidth = (content as HTMLElement).scrollWidth;
  const viewportWidth = window.innerWidth;

  return gsap.to(scrollContent, {
    x: -(scrollWidth - viewportWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start,
      end: end || `+=${scrollWidth - viewportWidth}`,
      pin: true,
      scrub,
      invalidateOnRefresh: true,
    },
  });
}

// ---- Number counter animation ----
export function animateCounter(
  element: Element,
  endValue: number,
  options?: {
    duration?: number;
    prefix?: string;
    suffix?: string;
    separator?: boolean;
  }
) {
  const {
    duration = 1.5,
    prefix = '',
    suffix = '',
    separator = true,
  } = options || {};

  const obj = { value: 0 };

  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      const formatted = separator
        ? Math.round(obj.value).toLocaleString('en-IN')
        : Math.round(obj.value).toString();
      element.textContent = `${prefix}${formatted}${suffix}`;
    },
  });
}

// ---- Line draw animation ----
export function animateLineDraw(
  svgPath: SVGPathElement,
  options?: {
    duration?: number;
    delay?: number;
    trigger?: string | Element;
    start?: string;
  }
) {
  const { duration = 1.2, delay = 0, trigger, start = 'top 75%' } = options || {};

  const length = svgPath.getTotalLength();

  gsap.set(svgPath, {
    strokeDasharray: length,
    strokeDashoffset: length,
  });

  return gsap.to(svgPath, {
    strokeDashoffset: 0,
    duration,
    delay,
    ease: 'power2.inOut',
    scrollTrigger: trigger
      ? {
          trigger,
          start,
          toggleActions: 'play none none none',
        }
      : undefined,
  });
}

// ---- Clean up all ScrollTriggers ----
export function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

// ---- Refresh ScrollTrigger ----
export function refreshScrollTrigger() {
  ScrollTrigger.refresh();
}

// ---- Framer Motion Variants ----
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};
