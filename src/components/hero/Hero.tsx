// ============================================================
// Hero — what the business is, in the first screen.
// ============================================================

import { Suspense, lazy, useMemo } from 'react';
import { motion } from 'framer-motion';
import Stage from '../../three/Stage';
import MagneticButton from '../ui/MagneticButton';
import {
  useDeviceTier,
  usePointerRef,
  useReducedMotion,
  useScrollProgressRef,
  useSmoothScrollTo,
} from '../../hooks';
import { HERO, COMMODITY_STRIP } from '../../content';
import './Hero.css';

const MerchantTableScene = lazy(() => import('../../three/scenes/MerchantTableScene'));

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const pointerRef = usePointerRef(!reducedMotion);
  const [sectionRef, progressRef] = useScrollProgressRef<HTMLElement>('exit');
  const scrollTo = useSmoothScrollTo();

  // Lines rise out of their mask in sequence; nothing fades in place.
  const line = useMemo(
    () => (i: number) =>
      reducedMotion
        ? {}
        : {
            initial: { y: '110%' },
            animate: { y: '0%' },
            transition: { duration: 0.95, ease: EASE, delay: 0.15 + i * 0.11 },
          },
    [reducedMotion]
  );

  const fade = useMemo(
    () => (delay: number) =>
      reducedMotion
        ? {}
        : {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.7, ease: EASE, delay },
          },
    [reducedMotion]
  );

  return (
    <section className="hero" id="hero" ref={sectionRef} aria-labelledby="hero-title">
      <span id="nav-sentinel" className="hero__sentinel" aria-hidden="true" />

      <div className="hero__grid shell">
        <div className="hero__copy">
          <motion.p className="eyebrow hero__eyebrow" {...fade(0.1)}>
            {HERO.eyebrow}
          </motion.p>

          <h1 className="hero__title display" id="hero-title">
            {HERO.headline.map((text, i) => (
              <span className="reveal-mask" key={text}>
                <motion.span {...line(i)}>{text}</motion.span>
              </span>
            ))}
          </h1>

          <motion.p className="hero__lede" {...fade(0.62)}>
            {HERO.lede}
          </motion.p>

          <motion.div className="hero__actions" {...fade(0.74)}>
            <MagneticButton className="btn" onClick={() => scrollTo('#business')}>
              {HERO.primaryCta}
              <svg className="btn__arrow" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M2 8h11M9 4l4 4-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            </MagneticButton>

            <MagneticButton
              className="btn btn--ghost"
              onClick={() => scrollTo('#mudarabah')}
            >
              {HERO.secondaryCta}
            </MagneticButton>
          </motion.div>

          <motion.ul className="hero__strip" {...fade(0.88)}>
            {COMMODITY_STRIP.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </motion.ul>
        </div>

        <div className="hero__stage-wrap">
          <Stage
            className="hero__stage"
            label="A merchant's desk: gold bullion, a brass bowl of spice, dry fruit and an open ledger"
            camera={{ position: [0.15, 1.95, 4.25], fov: 34, near: 0.1, far: 60 }}
            rootMargin="0px"
            fallback={<HeroFallback />}
          >
            <Suspense fallback={null}>
              <MerchantTableScene
                pointerRef={pointerRef}
                progressRef={progressRef}
                tier={tier}
                reducedMotion={reducedMotion}
              />
            </Suspense>
          </Stage>
        </div>
      </div>

      <motion.div className="hero__cue" {...fade(1.05)} aria-hidden="true">
        <span className="hero__cue-label">Scroll</span>
        <span className="hero__cue-line" />
      </motion.div>
    </section>
  );
}

/** Shown when WebGL is unavailable — still communicates the goods. */
function HeroFallback() {
  return (
    <div className="hero__fallback">
      <div className="geo-field" aria-hidden="true" />
      <ul className="hero__fallback-list">
        {COMMODITY_STRIP.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
