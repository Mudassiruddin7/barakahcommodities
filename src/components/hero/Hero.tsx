// ============================================================
// Hero — what the business is, in the first screen.
//
// A poster. The headline is set like a sack mark across the top; the
// goods that are bought and sold sit below it on the same paper, and a
// rubber stamp comes down on them once the page has settled.
// ============================================================

import { useRef, type MouseEvent } from 'react';
import { useGSAP } from '@gsap/react';
import Stamp from '../ui/Stamp';
import Arrow from '../ui/Arrow';
import { BRAND, HERO } from '../../content';
import { EASE_OUT, gsap, prefersReducedMotion, revealLines } from '../../utils/motion';
import { scrollToHash } from '../../utils/scroll';
import './Hero.css';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stampRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !titleRef.current) return;

      const undo = revealLines(titleRef.current, { start: 'top 110%' });

      gsap.from('.hero__rise', {
        opacity: 0,
        y: 14,
        duration: 0.6,
        ease: EASE_OUT,
        stagger: 0.08,
        delay: 0.35,
      });

      // The stamp comes down hard, squashes a hair, and rests.
      if (stampRef.current) {
        gsap
          .timeline({ delay: 1.0 })
          .fromTo(
            stampRef.current,
            { scale: 1.45, opacity: 0, rotate: -24 },
            { scale: 1, opacity: 0.92, rotate: -11, duration: 0.24, ease: 'power2.in' }
          )
          .to(stampRef.current, { scale: 0.955, duration: 0.07, ease: 'power1.out' })
          .to(stampRef.current, { scale: 1, duration: 0.3, ease: EASE_OUT });
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

      <div className="hero__art">
        <picture>
          <source media="(max-width: 899px)" srcSet="/images/hero-compact.webp" width="1573" height="699" />
          <img
            src="/images/hero.webp"
            width="2612"
            height="700"
            alt="A market stall laid out on paper: a jute sack of turmeric, a dish of almonds, stacked gold bars stamped with the Barakah hallmark, a dish of black pepper, chillies, dates, pistachios and spices"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <Stamp ref={stampRef} className="hero__stamp" ring={BRAND.name} lines={HERO.stamp} />
      </div>
    </section>
  );
}
