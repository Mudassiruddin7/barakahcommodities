// ============================================
// Transparency Section — Animated Ledger
// ============================================

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LEDGER_ENTRIES, TRANSPARENCY_PILLARS } from '../../utils/constants';
import { useReducedMotion } from '../../hooks';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import './TransparencySection.css';

gsap.registerPlugin(ScrollTrigger);

function formatINR(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}

// Simple SVG icons for pillars
const PILLAR_ICONS: Record<string, ReactNode> = {
  'Purchase Records': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 3h18v18H3zM3 9h18M9 9v12" />
    </svg>
  ),
  'Sales Records': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v20M2 12h20M6 6l12 12" />
    </svg>
  ),
  'Expense Records': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h16v16H4zM4 10h16M10 4v16" />
    </svg>
  ),
  'Inventory': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 6h16M4 6v14h16V6M4 10h16M4 14h16M10 6v14" />
    </svg>
  ),
  'Profit & Loss': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 20l5-5 4 4 9-11" />
      <path d="M17 4h4v4" />
    </svg>
  ),
  'Investor Reporting': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2" />
    </svg>
  ),
};

export default function TransparencySection() {
  const ledgerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !ledgerRef.current) return;

    const rows = ledgerRef.current.querySelectorAll('.transparency__ledger-row');

    gsap.from(Array.from(rows), {
      opacity: 0,
      x: -20,
      stagger: 0.12,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ledgerRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === ledgerRef.current)
        .forEach((t) => t.kill());
    };
  }, [reducedMotion]);

  return (
    <section
      className="section section--dark transparency"
      id="transparency"
      aria-label="Transparency"
    >
      <div className="container">
        <div className="section-header section-header--center">
          <p className="eyebrow section-header__eyebrow">FULL TRANSPARENCY</p>
          <h2 className="section-header__title heading-serif--dark">
            EVERY RUPEE SHOULD HAVE A RECORD.
          </h2>
        </div>

        {/* Animated Ledger */}
        <div className="transparency__ledger" ref={ledgerRef}>
          <span className="transparency__ledger-label">DEMONSTRATION DATA</span>
          <div className="transparency__ledger-header">
            <span>ENTRY</span>
            <span>TYPE</span>
            <span style={{ textAlign: 'right' }}>AMOUNT</span>
          </div>
          {LEDGER_ENTRIES.map((entry) => (
            <div key={entry.label} className="transparency__ledger-row">
              <span className="transparency__ledger-entry">{entry.label}</span>
              <span
                className={`transparency__ledger-type transparency__ledger-type--${entry.type}`}
              >
                {entry.type.toUpperCase()}
              </span>
              <span className="transparency__ledger-amount">
                {formatINR(entry.amount)}
              </span>
            </div>
          ))}
        </div>

        {/* Pillars */}
        <motion.div
          className="transparency__pillars"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
        >
          {TRANSPARENCY_PILLARS.map((pillar) => (
            <motion.div key={pillar} className="transparency__pillar" variants={fadeInUp}>
              <div className="transparency__pillar-icon" style={{ color: 'var(--color-gold)' }}>
                {PILLAR_ICONS[pillar] || null}
              </div>
              <p className="transparency__pillar-name">{pillar}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          className="transparency__quote"
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          &ldquo;Transparency is not a feature. It is the foundation.&rdquo;
        </motion.blockquote>
      </div>
    </section>
  );
}
