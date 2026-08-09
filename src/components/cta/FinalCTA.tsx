// ============================================
// Final CTA — Cinematic Closing
// ============================================

import { Suspense, lazy, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion, useInView, useWebGLAvailable } from '../../hooks';
import './FinalCTA.css';

const CTAScene = lazy(() => import('../three/CTAGoldBar'));

export default function FinalCTA() {
  const reducedMotion = useReducedMotion();
  const webglAvailable = useWebGLAvailable();
  const [sceneRef, sceneInView] = useInView({ rootMargin: '100px 0px' } as IntersectionObserverInit);

  const scrollTo = useCallback((id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section className="section final-cta" aria-label="Call to Action">
      <div className="container final-cta__inner">
        {/* Text */}
        <motion.div
          className="final-cta__content"
          initial={reducedMotion ? undefined : { opacity: 0, y: 30 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="final-cta__title">
            TRADE WITH TRUST.
            <br />
            GROW WITH BARAKAH.
          </h2>
          <div className="final-cta__buttons">
            <button
              className="final-cta__btn-primary"
              onClick={() => scrollTo('#contact')}
              type="button"
            >
              Talk to Barakah Commodities
            </button>
            <button
              className="final-cta__btn-secondary"
              onClick={() => scrollTo('#mudarabah')}
              type="button"
            >
              View Partnership Model
            </button>
          </div>
        </motion.div>

        {/* 3D Scene — Canvas is inside CTAScene itself */}
        <div className="final-cta__scene" ref={sceneRef}>
          {webglAvailable && sceneInView ? (
            <Suspense fallback={null}>
              <CTAScene />
            </Suspense>
          ) : null}
        </div>
      </div>
    </section>
  );
}
