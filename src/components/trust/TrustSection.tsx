// ============================================
// Trust Section — Three Pillars + Contact
// ============================================

import { motion } from 'framer-motion';
import { TRUST_PILLARS, CONTACT } from '../../utils/constants';
import { useReducedMotion } from '../../hooks';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import './TrustSection.css';

export default function TrustSection() {
  const reducedMotion = useReducedMotion();

  const containerVariants = reducedMotion ? {} : staggerContainer;
  const itemVariants = reducedMotion ? {} : fadeInUp;

  return (
    <section className="section trust" id="contact" aria-label="Trust and Contact">
      <div className="container">
        <div className="section-header section-header--center">
          <p className="eyebrow section-header__eyebrow">TRUST</p>
          <h2 className="section-header__title">BUILT ON THREE THINGS</h2>
        </div>

        <motion.div
          className="trust__pillars"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
        >
          {TRUST_PILLARS.map((pillar) => (
            <motion.div key={pillar.number} className="trust__pillar" variants={itemVariants}>
              <p className="trust__pillar-number">{pillar.number}</p>
              <h3 className="trust__pillar-title">{pillar.title}</h3>
              <p className="trust__pillar-desc">{pillar.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact */}
        <motion.div
          className="trust__contact"
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h3 className="trust__contact-heading">Talk to Barakah Commodities</h3>
          <p className="trust__contact-name">{CONTACT.name}</p>
          <a href={CONTACT.phoneHref} className="trust__contact-phone">
            {CONTACT.phone}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
