// ============================================
// Commodity Table — Signature Horizontal Scroll
// ============================================

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { PROCESS_STAGES } from '../../utils/constants';
import { useReducedMotion, useWindowSize } from '../../hooks';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import './CommodityTable.css';

gsap.registerPlugin(ScrollTrigger);

export default function CommodityTable() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const { width } = useWindowSize();
  const isMobile = width < 768;

  useEffect(() => {
    if (isMobile || reducedMotion || !sectionRef.current || !trackRef.current) return;

    const track = trackRef.current;
    const totalScrollWidth = track.scrollWidth - window.innerWidth;

    const tween = gsap.to(track, {
      x: -totalScrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${totalScrollWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Update progress bar
          if (progressRef.current) {
            progressRef.current.style.width = `${self.progress * 100}%`;
          }
          // Calculate active stage
          const stageCount = PROCESS_STAGES.length;
          const newIndex = Math.min(
            Math.floor(self.progress * stageCount),
            stageCount - 1
          );
          setActiveIndex(newIndex);
        },
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === sectionRef.current)
        .forEach((t) => t.kill());
    };
  }, [isMobile, reducedMotion]);

  return (
    <section
      className="commodity-table section"
      id="commodity-table"
      ref={sectionRef}
      aria-label="Commodity Trading Process"
    >
      {/* Header */}
      <div className="commodity-table__header">
        <p className="eyebrow">THE COMMODITY TABLE</p>
        <h2 className="commodity-table__title">FROM PURCHASE TO SETTLEMENT</h2>
        <p className="commodity-table__subtitle">
          Every transaction follows a complete cycle.
        </p>
      </div>

      {/* Desktop: Horizontal scroll */}
      <div className="commodity-table__scroll-wrapper">
        <div className="commodity-table__track" ref={trackRef}>
          {PROCESS_STAGES.map((stage, i) => (
            <div key={stage.id} style={{ display: 'flex', alignItems: 'stretch' }}>
              <div
                className={`commodity-table__stage ${
                  i === activeIndex ? 'commodity-table__stage--active' : ''
                }`}
              >
                <span className="commodity-table__stage-number">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="commodity-table__stage-label">{stage.label}</p>
                <p className="commodity-table__stage-desc">{stage.description}</p>
              </div>
              {i < PROCESS_STAGES.length - 1 && (
                <div className="commodity-table__connector">
                  <div className="commodity-table__arrow" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="commodity-table__progress">
          <div
            className="commodity-table__progress-fill"
            ref={progressRef}
          />
        </div>
      </div>

      {/* Mobile: Vertical layout */}
      <motion.div
        className="commodity-table__mobile"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-50px' }}
      >
        {PROCESS_STAGES.map((stage, i) => (
          <motion.div
            key={stage.id}
            className="commodity-table__mobile-stage"
            variants={fadeInUp}
          >
            <p className="commodity-table__mobile-number">
              {String(i + 1).padStart(2, '0')}
            </p>
            <p className="commodity-table__mobile-label">{stage.label}</p>
            <p className="commodity-table__mobile-desc">{stage.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
