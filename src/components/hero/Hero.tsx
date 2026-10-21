// ============================================================
// Hero — what the business is, in the first screen.
//
// A poster. The headline is set like a sack mark across the top; the
// goods that are bought and sold are laid out below it on the same paper,
// and a rubber stamp comes down on them once the page has settled.
// ============================================================

import { lazy, useMemo, useRef, type MouseEvent } from 'react';
import { useGSAP } from '@gsap/react';
import Stage from '../../three/Stage';
import Stamp from '../ui/Stamp';
import Arrow from '../ui/Arrow';
import { useIsMobile, usePointerRef, useReducedMotion, useScrollProgressRef } from '../../hooks';
import { BRAND, HERO } from '../../content';
import { EASE_OUT, gsap, prefersReducedMotion, revealLines } from '../../utils/motion';
import { scrollToHash } from '../../utils/scroll';
import './Hero.css';

const HeroScene = lazy(() => import('../../three/scenes/HeroScene'));

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const mobile = useIsMobile();
  const pointerRef = usePointerRef(!reducedMotion && !mobile);
  const [sectionRef, progressRef] = useScrollProgressRef<HTMLElement>('exit');
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stampRef = useRef<SVGSVGElement>(null);

  const camera = useMemo(
    () => ({ position: [0.3, 4.6, 8.6] as [number, number, number], fov: 30, near: 0.1, far: 80 }),
    []
  );

  useGSAP(
    () => {
      if (prefersReducedMotion() || !titleRef.current) return;

      const undo = revealLines(titleRef.current, { start: 'top 110%' });

      gsap.from('.hero__rise', {
        opacity: 0,
        y: 14,
        duration: 0.7,
        ease: EASE_OUT,
        stagger: 0.09,
        delay: 0.5,
      });

      // The stamp comes down hard, squashes a hair, and rests.
      const stamp = stampRef.current;
      if (stamp) {
        gsap
          .timeline({ delay: 1.45 })
          .fromTo(
            stamp,
            { scale: 1.45, opacity: 0, rotate: -24 },
            { scale: 1, opacity: 0.92, rotate: -11, duration: 0.24, ease: 'power2.in' }
          )
          .to(stamp, { scale: 0.955, duration: 0.07, ease: 'power1.out' })
          .to(stamp, { scale: 1, duration: 0.3, ease: EASE_OUT });
      }

      return undo;
    },
    { scope: sectionRef }
  );

  const go = (hash: string) => (e: MouseEvent) => {
    e.preventDefault();
    scrollToHash(hash);
  };

  return (
    <section
      className="hero field field--bone"
      id="hero"
      data-nav="bone"
      ref={sectionRef}
      aria-labelledby="hero-title"
    >
      <div className="hero__top shell">
        <h1 className="hero__title display" id="hero-title" ref={titleRef}>
          {HERO.headline.map((line) => (
            <span className="hero__line" key={line}>
              {line}
            </span>
          ))}
        </h1>

        <div className="hero__aside">
          <p className="hero__lede lead hero__rise">{HERO.lede}</p>
          <div className="hero__actions hero__rise">
            <a className="btn" href="#returns" onClick={go('#returns')}>
              {HERO.primaryCta}
              <Arrow />
            </a>
            <a className="link hero__secondary" href="#mudarabah" onClick={go('#mudarabah')}>
              {HERO.secondaryCta}
            </a>
          </div>
        </div>
      </div>

      <Stage
        className="hero__stage"
        label="A market stall laid out on paper: a jute sack of turmeric, a dish of almonds, stacked gold bars stamped with the Barakah hallmark, a dish of black pepper, chillies, dates, pistachios and spices"
        camera={camera}
        fallback={<HeroFallback />}
      >
        <HeroScene pointerRef={pointerRef} progressRef={progressRef} compact={mobile} />
      </Stage>

      <Stamp ref={stampRef} className="hero__stamp" ring={BRAND.name} lines={HERO.stamp} />
    </section>
  );
}

/** Flat drawing of the same goods, for when WebGL is not available. */
function HeroFallback() {
  return (
    <svg className="hero__fallback" viewBox="0 0 960 300" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <ellipse cx="480" cy="270" rx="420" ry="16" fill="var(--ink)" opacity="0.12" />
      <path d="M380 262h200l32 -56H412z" fill="var(--turmeric)" />
      <path d="M412 206h200l-10 -26H422z" fill="var(--turmeric-2)" />
      <path d="M70 262c-26-80 6-132 62-132s90 52 62 132z" fill="#b99557" />
      <path d="M96 138c16-30 62-30 78 0z" fill="var(--turmeric)" />
      <ellipse cx="780" cy="254" rx="96" ry="20" fill="#d7a24a" />
      <ellipse cx="780" cy="244" rx="78" ry="14" fill="var(--ink)" opacity="0.8" />
    </svg>
  );
}
