// ============================================================
// 09 · Closing — trade with trust, grow with barakah.
//
// The primary action is a conversation, not a transaction. No
// "Invest now" until the structure has been formally reviewed.
// ============================================================

import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import Stage from '../../three/Stage';
import { MagneticLink } from '../ui/MagneticButton';
import MagneticButton from '../ui/MagneticButton';
import { CLOSING, CONTACT } from '../../content';
import {
  useDeviceTier,
  useReducedMotion,
  useScrollProgressRef,
  useSmoothScrollTo,
} from '../../hooks';
import { EASE, VIEWPORT, maskUp, riseIn, stagger } from '../../utils/motion';
import './ClosingSection.css';

const ClosingScene = lazy(() => import('../../three/scenes/ClosingScene'));

export default function ClosingSection() {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const [sectionRef, progressRef] = useScrollProgressRef<HTMLElement>();
  const scrollTo = useSmoothScrollTo();

  return (
    <section
      className="closing"
      id="closing"
      ref={sectionRef}
      aria-labelledby="closing-title"
    >
      <Stage
        className="closing__stage"
        label="A gold bar coming to rest in the light"
        camera={{ position: [0.1, 1.15, 4.6], fov: 32, near: 0.1, far: 40 }}
        fallback={<div className="closing__stage-fallback" />}
      >
        <Suspense fallback={null}>
          <ClosingScene
            progressRef={progressRef}
            tier={tier}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Stage>

      <div className="closing__veil" aria-hidden="true" />
      <div className="geo-field closing__geo" aria-hidden="true" />

      <div className="shell closing__content">
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <motion.p className="eyebrow" variants={riseIn}>
            {CLOSING.eyebrow}
          </motion.p>

          <h2 className="closing__title display" id="closing-title">
            {CLOSING.headline.map((line) => (
              <span className="reveal-mask" key={line}>
                <motion.span variants={maskUp}>{line}</motion.span>
              </span>
            ))}
          </h2>

          <motion.p className="closing__lede" variants={riseIn}>
            {CLOSING.lede}
          </motion.p>
        </motion.div>

        <motion.div
          className="closing__actions"
          initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
        >
          <MagneticLink href={CONTACT.phoneHref} className="btn btn--light">
            {CLOSING.primaryCta}
            <svg className="btn__arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </MagneticLink>

          <MagneticButton
            className="btn btn--onDark"
            onClick={() => scrollTo('#mudarabah')}
          >
            {CLOSING.secondaryCta}
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
