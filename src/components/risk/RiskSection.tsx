// ============================================================
// 06 · Risk — stated plainly, neither hidden nor dramatised.
// ============================================================

import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import Stage from '../../three/Stage';
import { RISK, RISK_POINTS, RISK_STATEMENTS } from '../../content';
import { useDeviceTier, useReducedMotion, useScrollProgressRef } from '../../hooks';
import { VIEWPORT, maskUp, riseIn, stagger } from '../../utils/motion';
import './RiskSection.css';

const BalanceScene = lazy(() => import('../../three/scenes/BalanceScene'));

export default function RiskSection() {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const [sectionRef, progressRef] = useScrollProgressRef<HTMLElement>();

  return (
    <section
      className="section section--dark risk"
      id="risk"
      ref={sectionRef}
      aria-labelledby="risk-title"
    >
      <div className="shell risk__grid">
        <div className="risk__copy">
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <motion.p className="eyebrow" variants={riseIn}>
              {RISK.eyebrow}
            </motion.p>
            <h2 className="s-head__title" id="risk-title">
              <span className="reveal-mask">
                <motion.span variants={maskUp}>{RISK.title}</motion.span>
              </span>
            </h2>
            <motion.p className="lede" variants={riseIn}>
              {RISK.lede}
            </motion.p>
          </motion.div>

          <motion.ul
            className="risk__points"
            variants={stagger(0.08, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            {RISK_POINTS.map((point) => (
              <motion.li key={point.id} className="risk__point" variants={riseIn}>
                <h3 className="risk__point-label">{point.label}</h3>
                <p className="risk__point-detail">{point.detail}</p>
              </motion.li>
            ))}
          </motion.ul>

          <motion.ul
            className="risk__statements"
            variants={stagger(0.07, 0.15)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            {RISK_STATEMENTS.map((statement) => (
              <motion.li key={statement} variants={riseIn}>
                {statement}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div className="risk__visual">
          <Stage
            className="risk__stage"
            label="A brass balance with profit on one pan and risk on the other"
            camera={{ position: [0, 1.5, 5.4], fov: 34, near: 0.1, far: 40 }}
            fallback={<div className="risk__stage-fallback" />}
          >
            <Suspense fallback={null}>
              <BalanceScene
                progressRef={progressRef}
                tier={tier}
                reducedMotion={reducedMotion}
              />
            </Suspense>
          </Stage>

          <div className="risk__pans" aria-hidden="true">
            <span className="risk__pan-label risk__pan-label--profit">Profit</span>
            <span className="risk__pan-label risk__pan-label--risk">Risk</span>
          </div>
        </div>
      </div>
    </section>
  );
}
