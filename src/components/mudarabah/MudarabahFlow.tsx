// ============================================
// Mudarabah Flow — Partnership Visualization
// ============================================

import { motion } from 'framer-motion';
import { MUDARABAH_STEPS } from '../../utils/constants';
import { useReducedMotion } from '../../hooks';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import './MudarabahFlow.css';

export default function MudarabahFlow() {
  const reducedMotion = useReducedMotion();

  const containerVariants = reducedMotion ? {} : staggerContainer;
  const itemVariants = reducedMotion ? {} : fadeInUp;

  return (
    <section className="section mudarabah" id="mudarabah" aria-label="Mudarabah Partnership">
      <div className="container">
        <div className="section-header section-header--center">
          <p className="eyebrow section-header__eyebrow">MUDARABAH</p>
          <h2 className="section-header__title">PARTNERSHIP, NOT A PROMISE.</h2>
          <p className="section-header__description">
            A Mudarabah-based arrangement where capital meets business expertise.
          </p>
        </div>

        <motion.div
          className="mudarabah__flow"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
        >
          {MUDARABAH_STEPS.map((step, i) => (
            <div key={step.id}>
              <motion.div className="mudarabah__node" variants={itemVariants}>
                <p className="mudarabah__node-title">{step.titleAr}</p>
                <p className="mudarabah__node-subtitle">{step.titleEn}</p>
                <p className="mudarabah__node-desc">{step.description}</p>
              </motion.div>
              {i < MUDARABAH_STEPS.length - 1 && (
                <motion.div className="mudarabah__connector" variants={itemVariants}>
                  <div className="mudarabah__connector-line" />
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
