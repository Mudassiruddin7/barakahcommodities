// ============================================================
// 03 · Mudarabah — partnership, not a promise.
//
// A single spine drawn by scroll connects the five stages. The
// fourth stage is deliberately given two outcomes: a structure
// that can only show profit would be misrepresenting the contract.
// ============================================================

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MUDARABAH, MUDARABAH_STEPS } from '../../content';
import { useReducedMotion } from '../../hooks';
import { VIEWPORT, drawPath, maskUp, riseIn, stagger } from '../../utils/motion';
import './MudarabahFlow.css';

export default function MudarabahFlow() {
  const flowRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  // The spine draws itself as the section scrolls past.
  useEffect(() => {
    const path = pathRef.current;
    const flow = flowRef.current;
    if (!path || !flow || reducedMotion) return;

    return drawPath(path, {
      trigger: flow,
      start: 'top 76%',
      end: 'bottom 78%',
    });
  }, [reducedMotion]);

  return (
    <section className="section mudarabah" id="mudarabah" aria-labelledby="mudarabah-title">
      <div className="geo-field mudarabah__geo" aria-hidden="true" />

      <div className="shell">
        <motion.div
          className="s-head"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <motion.p className="eyebrow" variants={riseIn}>
            {MUDARABAH.eyebrow}
          </motion.p>
          <h2 className="s-head__title" id="mudarabah-title">
            <span className="reveal-mask">
              <motion.span variants={maskUp}>{MUDARABAH.title}</motion.span>
            </span>
          </h2>
          <motion.p className="lede" variants={riseIn}>
            {MUDARABAH.lede}
          </motion.p>
        </motion.div>

        <div className="mudarabah__flow" ref={flowRef}>
          {/* Connecting spine, drawn on scroll. */}
          <svg
            className="mudarabah__spine"
            viewBox="0 0 2 1000"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M1 0 L1 1000"
              stroke="var(--gold)"
              strokeWidth="1"
              fill="none"
              vectorEffect="non-scaling-stroke"
              ref={pathRef}
            />
          </svg>

          <ol className="mudarabah__steps">
            {MUDARABAH_STEPS.map((step, i) => (
              <motion.li
                key={step.id}
                className={`mudarabah__step ${
                  step.id === 'result' ? 'mudarabah__step--fork' : ''
                }`}
                initial={reducedMotion ? undefined : { opacity: 0, y: 26 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.7, delay: 0.06 * i }}
              >
                <span className="mudarabah__marker" aria-hidden="true" />

                <div className="mudarabah__step-body">
                  <p className="mudarabah__role">{step.role}</p>
                  <h3 className="mudarabah__term">{step.term}</h3>
                  <p className="mudarabah__desc">{step.description}</p>

                  {/* Both outcomes shown with equal weight. */}
                  {step.id === 'result' && (
                    <div className="mudarabah__outcomes">
                      <span className="mudarabah__outcome mudarabah__outcome--profit">
                        Profit
                      </span>
                      <span className="mudarabah__outcome-or">or</span>
                      <span className="mudarabah__outcome mudarabah__outcome--loss">
                        Loss
                      </span>
                    </div>
                  )}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <motion.p
          className="mudarabah__foot"
          initial={reducedMotion ? undefined : { opacity: 0 }}
          whileInView={reducedMotion ? undefined : { opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          The profit-sharing ratio is agreed in advance and recorded in the executed
          agreement. Returns are not fixed or guaranteed.
        </motion.p>
      </div>
    </section>
  );
}
