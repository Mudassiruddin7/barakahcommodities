// ============================================================
// 07 · Islamic business principles — built around amanah.
//
// Each principle carries a line mark drawn from the same geometric
// family as the desk inlay, so the section belongs to the rest of
// the page rather than importing an icon set.
// ============================================================

import type { ReactElement } from 'react';
import { motion } from 'framer-motion';
import { PRINCIPLES, PRINCIPLES_SECTION } from '../../content';
import { VIEWPORT, maskUp, riseIn, stagger } from '../../utils/motion';
import './PrinciplesSection.css';

/** Line marks, one per principle. Constructed, not illustrated. */
const MARKS: Record<string, ReactElement> = {
  // Amanah — two squares interlocked: something held on behalf of another
  amanah: (
    <>
      <rect x="8" y="8" width="26" height="26" />
      <rect x="8" y="8" width="26" height="26" transform="rotate(45 21 21)" />
    </>
  ),
  // Sidq — a plumb line: true, or not
  sidq: (
    <>
      <path d="M21 5v22" />
      <path d="M21 27l-5 6h10l-5-6z" />
      <path d="M9 5h24" />
    </>
  ),
  // Adl — equal division about a centre
  adl: (
    <>
      <path d="M6 21h30" />
      <rect x="8" y="11" width="11" height="11" />
      <rect x="23" y="11" width="11" height="11" />
      <path d="M21 8v26" />
    </>
  ),
  // No riba — a closed loop, struck through
  'no-riba': (
    <>
      <circle cx="21" cy="21" r="13" />
      <path d="M11 31 31 11" />
    </>
  ),
  // Halal trade — the eight-point star: permitted, complete
  'halal-trade': (
    <>
      <rect x="9" y="9" width="24" height="24" />
      <rect x="9" y="9" width="24" height="24" transform="rotate(45 21 21)" />
      <circle cx="21" cy="21" r="6" />
    </>
  ),
};

export default function PrinciplesSection() {
  return (
    <section
      className="section principles"
      id="principles"
      aria-labelledby="principles-title"
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
            {PRINCIPLES_SECTION.eyebrow}
          </motion.p>
          <h2 className="s-head__title" id="principles-title">
            <span className="reveal-mask">
              <motion.span variants={maskUp}>{PRINCIPLES_SECTION.title}</motion.span>
            </span>
          </h2>
          <motion.p className="lede" variants={riseIn}>
            {PRINCIPLES_SECTION.lede}
          </motion.p>
        </motion.div>

        <motion.ul
          className="principles__list"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          {PRINCIPLES.map((principle) => (
            <motion.li key={principle.id} className="principles__item" variants={riseIn}>
              <span className="principles__mark" aria-hidden="true">
                <svg viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1">
                  {MARKS[principle.id]}
                </svg>
              </span>

              <h3 className="principles__term">{principle.term}</h3>
              <p className="principles__english">{principle.english}</p>
              <p className="principles__desc">{principle.description}</p>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          className="note principles__note"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6 }}
        >
          <p className="note__label">Status of the structure</p>
          <p className="note__text">{PRINCIPLES_SECTION.disclaimer}</p>
        </motion.div>
      </div>
    </section>
  );
}
