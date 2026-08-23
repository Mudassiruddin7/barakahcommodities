// ============================================================
// 04 · Profit model — how profit is calculated.
//
// A worked example, labelled as one. No live counter, no rate, no
// monthly figure: the point is the method, and the method is
// subtraction.
// ============================================================

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PROFIT, PROFIT_LINES, PROFIT_SPLIT, formatINR } from '../../content';
import { useInView, useReducedMotion } from '../../hooks';
import { VIEWPORT, countUp, maskUp, riseIn, stagger } from '../../utils/motion';
import './ProfitModel.css';

export default function ProfitModel() {
  const reducedMotion = useReducedMotion();
  const flowRef = useRef<HTMLDivElement>(null);
  const amountRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const [splitRef, splitInView] = useInView<HTMLDivElement>({ threshold: 0.35 });

  // Each figure counts up once, as its own line arrives.
  useEffect(() => {
    const flow = flowRef.current;
    if (!flow) return;

    if (reducedMotion) {
      PROFIT_LINES.forEach((line) => {
        const el = amountRefs.current.get(line.id);
        if (el) el.textContent = formatINR(line.amount);
      });
      return;
    }

    const disposers = PROFIT_LINES.map((line) => {
      const el = amountRefs.current.get(line.id);
      if (!el) return () => {};
      return countUp(el, line.amount, { trigger: flow, format: formatINR });
    });

    return () => disposers.forEach((dispose) => dispose());
  }, [reducedMotion]);

  const registerAmount = (id: string) => (el: HTMLSpanElement | null) => {
    if (el) amountRefs.current.set(id, el);
    else amountRefs.current.delete(id);
  };

  return (
    <section className="section section--sand profit" id="profit" aria-labelledby="profit-title">
      <div className="shell">
        <motion.div
          className="s-head"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <motion.p className="eyebrow" variants={riseIn}>
            {PROFIT.eyebrow}
          </motion.p>
          <h2 className="s-head__title" id="profit-title">
            <span className="reveal-mask">
              <motion.span variants={maskUp}>{PROFIT.title}</motion.span>
            </span>
          </h2>
          <motion.p className="lede" variants={riseIn}>
            {PROFIT.lede}
          </motion.p>
        </motion.div>

        <div className="profit__grid">
          {/* ---- The calculation ---- */}
          <div className="profit__flow" ref={flowRef}>
            <table className="profit__table">
              <caption className="sr-only">
                Illustrative calculation of net business profit
              </caption>
              <tbody>
                {PROFIT_LINES.map((line) => (
                  <motion.tr
                    key={line.id}
                    className={`profit__row profit__row--${line.kind}`}
                    initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
                    whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 0.55 }}
                  >
                    <th scope="row" className="profit__cell-label">
                      {line.operator && (
                        <span className="profit__operator">{line.operator}</span>
                      )}
                      <span className="profit__label">{line.label}</span>
                      <span className="profit__hint">{line.hint}</span>
                    </th>
                    <td className="profit__cell-amount tnum">
                      <span ref={registerAmount(line.id)}>{formatINR(0)}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ---- The split ---- */}
          <div className="profit__split" ref={splitRef}>
            <h3 className="profit__split-title">Agreed profit allocation</h3>
            <p className="profit__split-note">
              On an illustrative net business profit of{' '}
              <strong>{formatINR(PROFIT_SPLIT.net)}</strong>, at an illustrative agreed
              ratio of {PROFIT_SPLIT.investorRatio}:{PROFIT_SPLIT.managerRatio}.
            </p>

            {/* One bar, divided — the ratio is a single quantity being shared. */}
            <div
              className="profit__bar"
              role="img"
              aria-label={`${PROFIT_SPLIT.investorRatio} percent to the investor, ${PROFIT_SPLIT.managerRatio} percent to the manager`}
            >
              {/*
                The ratio is already the flex basis of each part, so the
                transform only animates the fill from empty to full. Scaling
                by the ratio as well would apply it twice.
              */}
              <span
                className="profit__bar-part profit__bar-part--investor"
                style={{ transform: `scaleX(${splitInView || reducedMotion ? 1 : 0})` }}
              />
              <span
                className="profit__bar-part profit__bar-part--manager"
                style={{
                  transform: `scaleX(${splitInView || reducedMotion ? 1 : 0})`,
                  transitionDelay: '160ms',
                }}
              />
            </div>

            <dl className="profit__shares">
              <div className="profit__share">
                <dt>
                  <span className="profit__swatch profit__swatch--investor" aria-hidden="true" />
                  {PROFIT_SPLIT.investorLabel}
                  <span className="profit__ratio tnum">{PROFIT_SPLIT.investorRatio}%</span>
                </dt>
                <dd className="tnum">{formatINR(PROFIT_SPLIT.investorShare)}</dd>
              </div>
              <div className="profit__share">
                <dt>
                  <span className="profit__swatch profit__swatch--manager" aria-hidden="true" />
                  {PROFIT_SPLIT.managerLabel}
                  <span className="profit__ratio tnum">{PROFIT_SPLIT.managerRatio}%</span>
                </dt>
                <dd className="tnum">{formatINR(PROFIT_SPLIT.managerShare)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <motion.div
          className="note profit__note"
          initial={reducedMotion ? undefined : { opacity: 0, y: 14 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6 }}
        >
          <p className="note__label">{PROFIT.disclaimerLabel}</p>
          <p className="note__text">{PROFIT.disclaimerBody}</p>
        </motion.div>
      </div>
    </section>
  );
}
