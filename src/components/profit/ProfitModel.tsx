// ============================================
// Profit Model — Animated Accounting Flow
// ============================================

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PROFIT_EXAMPLE } from '../../utils/constants';
import { useReducedMotion, useInView } from '../../hooks';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import './ProfitModel.css';

function formatINR(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}

export default function ProfitModel() {
  const reducedMotion = useReducedMotion();
  const [barRef, inView] = useInView({ threshold: 0.3 } as IntersectionObserverInit);
  const [animated, setAnimated] = useState(false);
  const investorBarRef = useRef<HTMLDivElement>(null);
  const managerBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView && !animated) {
      setAnimated(true);
      // Animate bars
      if (investorBarRef.current) {
        investorBarRef.current.style.width = `${PROFIT_EXAMPLE.investorRatio}%`;
      }
      if (managerBarRef.current) {
        managerBarRef.current.style.width = `${PROFIT_EXAMPLE.managerRatio}%`;
      }
    }
  }, [inView, animated]);

  const containerVariants = reducedMotion ? {} : staggerContainer;
  const itemVariants = reducedMotion ? {} : fadeInUp;

  return (
    <section className="section section--alt profit" id="profit" aria-label="Profit Model">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow section-header__eyebrow">PROFIT SHARING</p>
          <h2 className="section-header__title">HOW PROFIT IS CALCULATED</h2>
        </div>

        <div className="profit__grid" ref={barRef}>
          {/* Accounting Flow */}
          <motion.div
            className="profit__flow"
            variants={containerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
          >
            <motion.div className="profit__flow-step" variants={itemVariants}>
              <span className="profit__flow-label">Gross Sales</span>
              <span className="profit__flow-amount profit__flow-amount--credit">
                {formatINR(PROFIT_EXAMPLE.grossSales)}
              </span>
            </motion.div>

            <motion.p className="profit__flow-operator" variants={itemVariants}>minus</motion.p>

            <motion.div className="profit__flow-step" variants={itemVariants}>
              <span className="profit__flow-label">Cost of Goods</span>
              <span className="profit__flow-amount profit__flow-amount--debit">
                {formatINR(PROFIT_EXAMPLE.costOfGoods)}
              </span>
            </motion.div>

            <motion.p className="profit__flow-operator" variants={itemVariants}>minus</motion.p>

            <motion.div className="profit__flow-step" variants={itemVariants}>
              <span className="profit__flow-label">Direct Expenses</span>
              <span className="profit__flow-amount profit__flow-amount--debit">
                {formatINR(PROFIT_EXAMPLE.directExpenses)}
              </span>
            </motion.div>

            <motion.p className="profit__flow-operator" variants={itemVariants}>equals</motion.p>

            <motion.div className="profit__flow-step profit__flow-step--result" variants={itemVariants}>
              <span className="profit__flow-label">Net Profit</span>
              <span className="profit__flow-amount profit__flow-amount--result">
                {formatINR(PROFIT_EXAMPLE.netProfit)}
              </span>
            </motion.div>
          </motion.div>

          {/* Allocation Visual */}
          <motion.div
            className="profit__allocation"
            initial={reducedMotion ? undefined : { opacity: 0, y: 30 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h3 className="profit__allocation-heading">Profit Allocation</h3>
            <p className="profit__allocation-example">
              Illustrative example: {formatINR(PROFIT_EXAMPLE.illustrativeNet)} net profit
            </p>

            {/* Investor bar */}
            <div className="profit__bar-group">
              <div className="profit__bar-header">
                <span className="profit__bar-label">
                  Investor (Rab-ul-Mal) — {PROFIT_EXAMPLE.investorRatio}%
                </span>
                <span className="profit__bar-value">
                  {formatINR(PROFIT_EXAMPLE.investorShare)}
                </span>
              </div>
              <div className="profit__bar-track">
                <div
                  className="profit__bar-fill profit__bar-fill--investor"
                  ref={investorBarRef}
                  style={{ width: animated ? `${PROFIT_EXAMPLE.investorRatio}%` : '0%' }}
                />
              </div>
            </div>

            {/* Manager bar */}
            <div className="profit__bar-group">
              <div className="profit__bar-header">
                <span className="profit__bar-label">
                  Manager (Mudarib) — {PROFIT_EXAMPLE.managerRatio}%
                </span>
                <span className="profit__bar-value">
                  {formatINR(PROFIT_EXAMPLE.managerShare)}
                </span>
              </div>
              <div className="profit__bar-track">
                <div
                  className="profit__bar-fill profit__bar-fill--manager"
                  ref={managerBarRef}
                  style={{ width: animated ? `${PROFIT_EXAMPLE.managerRatio}%` : '0%' }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* DISCLAIMER — Prominently displayed */}
        <motion.div
          className="profit__disclaimer"
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="profit__disclaimer-title">
            ⚠ ILLUSTRATIVE EXAMPLE — NOT A FORECAST OR GUARANTEED RETURN
          </p>
          <p className="profit__disclaimer-text">
            The above figures are for illustration purposes only. Actual business results
            depend on market conditions, commodity prices, and operational factors. Past
            performance does not guarantee future results. Profit is not fixed or guaranteed.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
