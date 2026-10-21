// ============================================================
// ProfitModel — profit as arithmetic, printed the way a shop prints it.
//
// The worked example runs down an adding-machine tape: each line is
// "printed" in turn, then the result is split by the agreed ratio. The
// figures are the same lot as the records further down the page, and
// they are labelled as an illustration, not as a promise.
// ============================================================

import { useEffect, useRef, type CSSProperties } from 'react';
import { useInView } from '../../hooks';
import { PROFIT, PROFIT_LINES, PROFIT_SPLIT, formatINR } from '../../content';
import { revealLines } from '../../utils/motion';
import './ProfitModel.css';

export default function ProfitModel() {
  const [tapeRef, inView] = useInView<HTMLDivElement>({ threshold: 0.25 });
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    return revealLines(titleRef.current);
  }, []);

  return (
    <section
      className="profit section field field--bone"
      id="profit"
      data-nav="bone"
      aria-labelledby="profit-title"
    >
      <header className="shell profit__head">
        <h2 className="head" id="profit-title" ref={titleRef}>
          {PROFIT.title}
        </h2>
        <p className="lead">{PROFIT.lede}</p>
      </header>

      <div className="shell profit__grid">
        <div className="profit__tape" ref={tapeRef} data-in={inView}>
          <table>
            <caption className="sr-only">Worked example of how net business profit is calculated</caption>
            <tbody>
              {PROFIT_LINES.map((line, i) => (
                <tr
                  key={line.id}
                  className={`profit__line profit__line--${line.kind}`}
                  style={{ '--i': i } as CSSProperties}
                >
                  <th scope="row">
                    {line.operator && <em>{line.operator}</em>}
                    <span>{line.label}</span>
                    <small>{line.hint}</small>
                  </th>
                  <td className="tnum">
                    {line.kind === 'debit' ? '− ' : ''}
                    {formatINR(line.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="profit__split" data-in={inView}>
          <h3 className="profit__split-title">Agreed profit allocation</h3>
          <p className="profit__split-note">
            On an illustrative net business profit of {formatINR(PROFIT_SPLIT.net)}, at an
            illustrative agreed ratio of {PROFIT_SPLIT.investorRatio}:{PROFIT_SPLIT.managerRatio}.
          </p>

          <div className="profit__bar" role="img" aria-label={`${PROFIT_SPLIT.investorRatio} percent to the investor, ${PROFIT_SPLIT.managerRatio} percent to the manager`}>
            <span
              className="profit__share profit__share--investor"
              style={{ flexBasis: `${PROFIT_SPLIT.investorRatio}%` }}
            >
              <b className="display">{PROFIT_SPLIT.investorRatio}%</b>
            </span>
            <span
              className="profit__share profit__share--manager"
              style={{ flexBasis: `${PROFIT_SPLIT.managerRatio}%` }}
            >
              <b className="display">{PROFIT_SPLIT.managerRatio}%</b>
            </span>
          </div>

          <dl className="profit__who">
            <div style={{ flexBasis: `${PROFIT_SPLIT.investorRatio}%` }}>
              <dt>{PROFIT_SPLIT.investorLabel}</dt>
              <dd className="tnum">{formatINR(PROFIT_SPLIT.investorShare)}</dd>
            </div>
            <div style={{ flexBasis: `${PROFIT_SPLIT.managerRatio}%` }}>
              <dt>{PROFIT_SPLIT.managerLabel}</dt>
              <dd className="tnum">{formatINR(PROFIT_SPLIT.managerShare)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <aside className="shell profit__note">
        <p className="profit__note-title">{PROFIT.disclaimerLabel}</p>
        <p>{PROFIT.disclaimerBody}</p>
      </aside>
    </section>
  );
}
