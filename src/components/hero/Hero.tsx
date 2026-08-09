// ============================================
// Hero Section
// ============================================

import { Suspense, lazy, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion, useWebGLAvailable } from '../../hooks';
import './Hero.css';

const HeroScene = lazy(() => import('./HeroScene'));

const transition = { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const webglAvailable = useWebGLAvailable();

  const scrollTo = useCallback((id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const anim = (delay: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 25 },
          animate: { opacity: 1, y: 0 },
          transition: { ...transition, delay },
        };

  return (
    <section className="hero" id="hero" aria-label="Hero">
      {/* Sentinel for navbar scroll detection */}
      <div id="nav-sentinel" style={{ position: 'absolute', top: 0, height: 1, width: 1 }} />

      <div className="hero__inner container">
        {/* Text Column */}
        <div className="hero__content">
          <motion.p className="hero__eyebrow" {...anim(0.15)}>
            BARAKAH COMMODITIES
          </motion.p>

          <h1 className="hero__title">
            <motion.span className="hero__title-line" {...anim(0.25)}>
              REAL COMMODITIES.
            </motion.span>
            <motion.span className="hero__title-line" {...anim(0.38)}>
              REAL BUSINESS.
            </motion.span>
            <motion.span className="hero__title-line" {...anim(0.50)}>
              REAL BARAKAH.
            </motion.span>
          </h1>

          <motion.p className="hero__description" {...anim(0.6)}>
            Halal commodity trading built on transparent business practices, real physical
            trade, and Mudarabah-based profit-sharing partnerships.
          </motion.p>

          <motion.div className="hero__divider" {...anim(0.68)} />

          <motion.div className="hero__buttons" {...anim(0.75)}>
            <button
              className="hero__btn-primary"
              onClick={() => scrollTo('#business')}
              type="button"
            >
              Explore Our Business
            </button>
            <button
              className="hero__btn-secondary"
              onClick={() => scrollTo('#mudarabah')}
              type="button"
            >
              View Partnership Model
            </button>
          </motion.div>

          <motion.p className="hero__trust" {...anim(0.9)}>
            Spices &nbsp;•&nbsp; Dry Fruits &nbsp;•&nbsp; Physical Gold &nbsp;•&nbsp; Commodity Trading
          </motion.p>
        </div>

        {/* 3D Scene Column */}
        <div className="hero__scene">
          {webglAvailable ? (
            <Suspense
              fallback={
                <div className="hero__scene-fallback">
                  <span className="hero__scene-fallback-text">Loading…</span>
                </div>
              }
            >
              <HeroScene />
            </Suspense>
          ) : (
            <div className="hero__scene-fallback">
              <span className="hero__scene-fallback-text">
                Spices • Dry Fruits • Gold
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
