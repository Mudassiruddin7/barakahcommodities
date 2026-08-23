// ============================================================
// 08 · Trust — three commitments and a named person.
//
// No counts, no logos, no testimonials. The only verifiable claim
// available is who is accountable, so that is what is shown.
// ============================================================

import { motion } from 'framer-motion';
import { CONTACT, TRUST } from '../../content';
import { VIEWPORT, maskUp, riseIn, stagger } from '../../utils/motion';
import './TrustSection.css';

export default function TrustSection() {
  return (
    <section className="section section--alt trust" id="contact" aria-labelledby="trust-title">
      <div className="shell trust__grid">
        <div className="trust__intro">
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <motion.p className="eyebrow" variants={riseIn}>
              {TRUST.eyebrow}
            </motion.p>
            <h2 className="s-head__title" id="trust-title">
              <span className="reveal-mask">
                <motion.span variants={maskUp}>{TRUST.title}</motion.span>
              </span>
            </h2>
          </motion.div>

          {/* The accountable person, given the weight of a signature. */}
          <motion.div
            className="trust__card"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="trust__card-eyebrow">Speak to</p>
            <p className="trust__card-name">{CONTACT.name}</p>
            <p className="trust__card-role">{CONTACT.role}</p>
            <a href={CONTACT.phoneHref} className="trust__card-phone">
              {CONTACT.phone}
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
                <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </a>
          </motion.div>
        </div>

        <motion.ol
          className="trust__pillars"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          {TRUST.pillars.map((pillar) => (
            <motion.li key={pillar.index} className="trust__pillar" variants={riseIn}>
              <span className="index-num trust__pillar-index">{pillar.index}</span>
              <div>
                <h3 className="trust__pillar-title">{pillar.title}</h3>
                <p className="trust__pillar-detail">{pillar.detail}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
