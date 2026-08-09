// ============================================
// Islamic Principles Section
// ============================================

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { PRINCIPLES, SHARIAH_DISCLAIMER } from '../../utils/constants';
import { useReducedMotion } from '../../hooks';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import './PrinciplesSection.css';

// Inline SVG icons for each principle
const PRINCIPLE_ICONS: Record<string, ReactNode> = {
  amanah: (
    <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 4l-12 8v12l12 8 12-8V12L18 4z" />
      <path d="M18 12v12M12 16l6 4 6-4" />
    </svg>
  ),
  sidq: (
    <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 6h18a4 4 0 014 4v16a4 4 0 01-4 4H10a4 4 0 01-4-4V6z" />
      <path d="M10 14h14M10 20h10M6 6l6-2v4" />
    </svg>
  ),
  adl: (
    <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 4v28M6 10l4 10a6 6 0 0016 0l4-10" />
      <line x1="6" y1="10" x2="14" y2="10" />
      <line x1="22" y1="10" x2="30" y2="10" />
    </svg>
  ),
  'no-riba': (
    <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="18" cy="18" r="13" />
      <line x1="8" y1="8" x2="28" y2="28" />
      <path d="M15 14h4a2 2 0 010 4h-4a2 2 0 000 4h4" />
    </svg>
  ),
  'halal-trade': (
    <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="18" cy="18" r="13" />
      <path d="M12 18l4 4 8-8" />
    </svg>
  ),
};

export default function PrinciplesSection() {
  const reducedMotion = useReducedMotion();

  const containerVariants = reducedMotion ? {} : staggerContainer;
  const itemVariants = reducedMotion ? {} : fadeInUp;

  return (
    <section
      className="section section--emerald principles"
      id="principles"
      aria-label="Shariah Principles"
    >
      <div className="container">
        <div className="section-header section-header--center">
          <p className="eyebrow section-header__eyebrow">SHARIAH PRINCIPLES</p>
          <h2 className="section-header__title heading-serif--dark">
            BUILT AROUND AMANAH.
          </h2>
        </div>

        <motion.div
          className="principles__cards"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
        >
          {PRINCIPLES.map((p) => (
            <motion.div key={p.id} className="principles__card" variants={itemVariants}>
              <div className="principles__card-icon">
                {PRINCIPLE_ICONS[p.id] || null}
              </div>
              <p className="principles__card-title-ar">{p.titleAr}</p>
              <p className="principles__card-title-en">{p.titleEn}</p>
              <p className="principles__card-desc">{p.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <p className="principles__disclaimer">{SHARIAH_DISCLAIMER}</p>
      </div>
    </section>
  );
}
