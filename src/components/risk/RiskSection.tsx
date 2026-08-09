// ============================================
// Risk Section — Honest Disclosure + 3D Scale
// ============================================

import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { RISK_POINTS, RISK_DISCLAIMERS } from '../../utils/constants';
import { useReducedMotion, useInView, useWebGLAvailable } from '../../hooks';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import './RiskSection.css';

const BalanceSceneCanvas = lazy(() => import('../three/BalanceScale'));

function ScaleFallbackIcon() {
  return (
    <div className="risk__scene-fallback">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 3v18M3 7l3 7h0a6 6 0 0012 0h0l3-7" />
        <circle cx="6" cy="14" r="3" />
        <circle cx="18" cy="14" r="3" />
      </svg>
    </div>
  );
}

export default function RiskSection() {
  const reducedMotion = useReducedMotion();
  const webglAvailable = useWebGLAvailable();
  const [sceneRef, sceneInView] = useInView({ rootMargin: '100px 0px' } as IntersectionObserverInit);

  const containerVariants = reducedMotion ? {} : staggerContainer;
  const itemVariants = reducedMotion ? {} : fadeInUp;

  return (
    <section className="section risk" id="risk" aria-label="Risk Disclosure">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow section-header__eyebrow">RISK DISCLOSURE</p>
          <h2 className="section-header__title">REAL BUSINESS MEANS REAL RISK.</h2>
        </div>

        <div className="risk__grid">
          {/* Text Column */}
          <div>
            <motion.div
              className="risk__points"
              variants={containerVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-60px' }}
            >
              {RISK_POINTS.map((point, i) => (
                <motion.div key={i} className="risk__point" variants={itemVariants}>
                  <span className="risk__point-bullet" />
                  <p className="risk__point-text">{point.text}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="risk__disclaimers"
              initial={reducedMotion ? undefined : { opacity: 0, x: -15 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {RISK_DISCLAIMERS.map((d, i) => (
                <p key={i} className="risk__disclaimer-item">{d}</p>
              ))}
            </motion.div>
          </div>

          {/* 3D Scene Column — Canvas is inside the component itself now */}
          <div className="risk__scene" ref={sceneRef}>
            {webglAvailable && sceneInView ? (
              <Suspense fallback={<ScaleFallbackIcon />}>
                <BalanceSceneCanvas />
              </Suspense>
            ) : (
              <ScaleFallbackIcon />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
