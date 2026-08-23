// ============================================================
// 02 · The commodity table — from purchase to settlement.
//
// The section is tall; a sticky viewport holds the desk while
// ScrollTrigger scrubs the camera along it and lights each station
// as it arrives. Mobile gets a vertical timeline instead: the
// horizontal travel has nowhere to go on a narrow screen.
// ============================================================

import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Stage from '../../three/Stage';
import { useDeviceTier, useIsMobile, useReducedMotion } from '../../hooks';
import { PROCESS, PROCESS_STAGES } from '../../content';
import { VIEWPORT, gsap, maskUp, riseIn, stagger } from '../../utils/motion';
import './ProcessSection.css';

const CommodityDeskScene = lazy(() => import('../../three/scenes/CommodityDeskScene'));

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();

  // Scrub the camera and the active station from scroll position.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isMobile) return;

    const trigger = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          const index = Math.min(
            PROCESS_STAGES.length - 1,
            Math.floor(self.progress * PROCESS_STAGES.length)
          );
          setActive((prev) => (prev === index ? prev : index));
        },
      },
    });

    return () => {
      trigger.scrollTrigger?.kill();
      trigger.kill();
    };
  }, [isMobile]);

  if (isMobile) {
    return <ProcessTimeline />;
  }

  const current = PROCESS_STAGES[active];

  return (
    <section
      className="section--dark process"
      id="process"
      ref={sectionRef}
      aria-labelledby="process-title"
    >
      <div className="process__sticky">
        <Stage
          className="process__stage"
          label="A long trading desk: sacking, brass weights, crates, spice, an open ledger and bullion"
          camera={{ position: [-6.85, 1.32, 2.55], fov: 40, near: 0.1, far: 60 }}
          fallback={<div className="process__stage-fallback" />}
        >
          <Suspense fallback={null}>
            <CommodityDeskScene
              progressRef={progressRef}
              tier={tier}
              reducedMotion={reducedMotion}
            />
          </Suspense>
        </Stage>

        <div className="process__veil" aria-hidden="true" />

        <div className="process__content shell">
          <motion.header
            className="process__head"
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <motion.p className="eyebrow" variants={riseIn}>
              {PROCESS.eyebrow}
            </motion.p>
            <h2 className="process__title" id="process-title">
              <span className="reveal-mask">
                <motion.span variants={maskUp}>{PROCESS.title}</motion.span>
              </span>
            </h2>
          </motion.header>

          {/* The station currently in front of the camera. */}
          <div className="process__current" aria-live="polite">
            <span className="index-num process__current-index">{current.index}</span>
            <h3 className="process__current-label">{current.label}</h3>
            <p className="process__current-desc">{current.description}</p>
          </div>

          {/* The full run, with progress drawn along it. */}
          <ol className="process__track">
            <span
              className="process__track-fill"
              style={{
                transform: `scaleX(${(active + 1) / PROCESS_STAGES.length})`,
              }}
              aria-hidden="true"
            />
            {PROCESS_STAGES.map((stage, i) => (
              <li
                key={stage.id}
                className={`process__station ${i === active ? 'is-active' : ''} ${
                  i < active ? 'is-passed' : ''
                }`}
              >
                <span className="process__station-dot" aria-hidden="true" />
                <span className="process__station-label">{stage.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** Mobile: the same six stages, read top to bottom. */
function ProcessTimeline() {
  return (
    <section
      className="section section--dark process-list"
      id="process"
      aria-labelledby="process-title-m"
    >
      <div className="shell">
        <motion.div
          className="s-head"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <motion.p className="eyebrow" variants={riseIn}>
            {PROCESS.eyebrow}
          </motion.p>
          <h2 className="s-head__title" id="process-title-m">
            <span className="reveal-mask">
              <motion.span variants={maskUp}>{PROCESS.title}</motion.span>
            </span>
          </h2>
          <motion.p className="lede" variants={riseIn}>
            {PROCESS.lede}
          </motion.p>
        </motion.div>

        <ol className="process-list__items">
          {PROCESS_STAGES.map((stage, i) => (
            <motion.li
              key={stage.id}
              className="process-list__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            >
              <span className="index-num">{stage.index}</span>
              <div>
                <h3 className="process-list__label">{stage.label}</h3>
                <p className="process-list__desc">{stage.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
