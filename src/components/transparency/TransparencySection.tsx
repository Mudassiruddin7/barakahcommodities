// ============================================================
// 05 · Transparency — every rupee should have a record.
//
// The ledger is a real table: a screen reader gets a table, and
// sighted users get the same table on a sheet that rotates flat as
// it enters view. The depth is CSS 3D — a canvas here would cost
// more than it communicates.
// ============================================================

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  LEDGER_ROWS,
  RECORD_TYPES,
  TRANSPARENCY,
  formatINR,
} from '../../content';
import { useInView, useReducedMotion } from '../../hooks';
import { VIEWPORT, maskUp, riseIn, scrollReveal, stagger } from '../../utils/motion';
import './TransparencySection.css';

export default function TransparencySection() {
  const reducedMotion = useReducedMotion();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [wrapRef, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });

  // Rows post themselves one after another, the way entries are made.
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet || reducedMotion) return;

    const rows = sheet.querySelectorAll('tbody tr');
    return scrollReveal(rows, {
      trigger: sheet,
      start: 'top 80%',
      y: 14,
      stagger: 0.075,
      duration: 0.55,
    });
  }, [reducedMotion]);

  return (
    <section
      className="section transparency"
      id="transparency"
      aria-labelledby="transparency-title"
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
            {TRANSPARENCY.eyebrow}
          </motion.p>
          <h2 className="s-head__title" id="transparency-title">
            <span className="reveal-mask">
              <motion.span variants={maskUp}>{TRANSPARENCY.title}</motion.span>
            </span>
          </h2>
          <motion.p className="lede" variants={riseIn}>
            {TRANSPARENCY.lede}
          </motion.p>
        </motion.div>

        {/* ---- Ledger sheet ---- */}
        <div className="transparency__scene" ref={wrapRef}>
          <div
            className={`transparency__sheet ${inView || reducedMotion ? 'is-flat' : ''}`}
            ref={sheetRef}
          >
            <div className="transparency__sheet-head">
              <span className="transparency__sheet-title">Trading account — extract</span>
              <span className="transparency__tag">{TRANSPARENCY.dataLabel}</span>
            </div>

            <div className="transparency__table-wrap">
              <table className="transparency__table">
                <caption className="sr-only">
                  Demonstration ledger entries for a single commodity cycle
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Particulars</th>
                    <th scope="col">Ref</th>
                    <th scope="col" className="is-num">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {LEDGER_ROWS.map((row) => (
                    <tr key={row.id} className={`transparency__row--${row.kind}`}>
                      <td className="transparency__date tnum">{row.date}</td>
                      <td className="transparency__particulars">{row.particulars}</td>
                      <td className="transparency__ref tnum">{row.reference}</td>
                      <td className="transparency__amount tnum">
                        {row.kind === 'debit' && (
                          <span className="transparency__sign" aria-hidden="true">
                            −
                          </span>
                        )}
                        {formatINR(row.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="transparency__sheet-foot">{TRANSPARENCY.dataNote}</p>
          </div>
        </div>

        {/* ---- What is kept ---- */}
        <motion.ul
          className="transparency__records"
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          {RECORD_TYPES.map((record) => (
            <motion.li key={record.id} className="transparency__record" variants={riseIn}>
              <span className="transparency__record-mark" aria-hidden="true" />
              <h3 className="transparency__record-label">{record.label}</h3>
              <p className="transparency__record-detail">{record.detail}</p>
            </motion.li>
          ))}
        </motion.ul>

        <motion.p
          className="transparency__closing"
          initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.75 }}
        >
          {TRANSPARENCY.closing}
        </motion.p>
      </div>
    </section>
  );
}
