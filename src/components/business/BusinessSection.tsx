// ============================================================
// 01 · Business — what Barakah Commodities actually trades.
//
// Three panels over one shared 3D display. Hovering or focusing a
// panel glides the display to that good, which keeps the section
// reading as a single composition instead of three cards.
// ============================================================

import { Suspense, lazy, useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Stage from '../../three/Stage';
import {
  useDeviceTier,
  usePointerRef,
  useReducedMotion,
} from '../../hooks';
import { BUSINESS, COMMODITIES } from '../../content';
import { EASE, VIEWPORT, maskUp, riseIn, stagger } from '../../utils/motion';
import './BusinessSection.css';

const CommodityDisplayScene = lazy(
  () => import('../../three/scenes/CommodityDisplayScene')
);

export default function BusinessSection() {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const pointerRef = usePointerRef(!reducedMotion);

  // The scene reads the active index from a ref, so moving between
  // panels never re-renders the canvas tree.
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  const select = useCallback((index: number) => {
    activeRef.current = index;
    setActive(index);
  }, []);

  return (
    <section className="section business" id="business" aria-labelledby="business-title">
      <div className="shell">
        <motion.div
          className="s-head business__head"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <motion.p className="eyebrow" variants={riseIn}>
            {BUSINESS.eyebrow}
          </motion.p>
          <h2 className="s-head__title" id="business-title">
            <span className="reveal-mask">
              <motion.span variants={maskUp}>{BUSINESS.title}</motion.span>
            </span>
          </h2>
          <motion.p className="lede" variants={riseIn}>
            {BUSINESS.lede}
          </motion.p>
        </motion.div>
      </div>

      {/* One display band, with the three panels reading beneath it. */}
      <div className="business__composition">
        <div className="business__display">
          <Stage
            className="business__stage"
            label="Spices, dry fruits and physical gold displayed on stone plinths"
            camera={{ position: [-2.35, 1.05, 3.4], fov: 34, near: 0.1, far: 50 }}
            fallback={<div className="business__stage-fallback" />}
          >
            <Suspense fallback={null}>
              <CommodityDisplayScene
                activeRef={activeRef}
                pointerRef={pointerRef}
                tier={tier}
                reducedMotion={reducedMotion}
              />
            </Suspense>
          </Stage>

          {/* Names the good currently in the display, for anyone not hovering. */}
          <p className="business__display-caption" aria-hidden="true">
            {COMMODITIES[active].name}
          </p>
        </div>

        <div className="business__panels shell" role="list">
          {COMMODITIES.map((item, i) => (
            <motion.article
              key={item.id}
              role="listitem"
              className={`business__panel ${active === i ? 'is-active' : ''}`}
              onMouseEnter={() => select(i)}
              onFocus={() => select(i)}
              tabIndex={0}
              aria-current={active === i}
              initial={reducedMotion ? undefined : { opacity: 0, y: 30 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
            >
              <span className="index-num business__panel-index">{item.index}</span>

              <h3 className="business__panel-name">{item.name}</h3>
              <p className="business__panel-summary">{item.summary}</p>

              <div className="business__panel-body">
                <p className="business__panel-detail">{item.detail}</p>
                <p className="business__panel-note">{item.note}</p>
              </div>

              <span className="business__panel-explore link-quiet" aria-hidden="true">
                Explore
                <svg viewBox="0 0 16 16" width="13" height="13" fill="none">
                  <path
                    d="M2 8h11M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                </svg>
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
