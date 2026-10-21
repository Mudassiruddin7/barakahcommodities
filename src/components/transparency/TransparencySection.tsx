// ============================================================
// TransparencySection — the books, shown as books.
//
// A ledger page, ruled the way an accountant's page is ruled, filled in
// line by line. It is demonstration data and says so twice: in the
// caption, and on a stamp across the page.
// ============================================================

import { useEffect, useRef, type CSSProperties } from 'react';
import { useInView } from '../../hooks';
import { LEDGER_ROWS, TRANSPARENCY, formatINR } from '../../content';
import { revealLines } from '../../utils/motion';
import './TransparencySection.css';

export default function TransparencySection() {
  const [bookRef, inView] = useInView<HTMLElement>({ threshold: 0.2 });
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    return revealLines(titleRef.current);
  }, []);

  return (
    <section
      className="records section field field--cardamom"
      id="transparency"
      data-nav="cardamom"
      aria-labelledby="records-title"
    >
      <div className="shell records__grid">
        <div className="records__copy">
          <h2 className="head" id="records-title" ref={titleRef}>
            {TRANSPARENCY.title}
          </h2>
          <p className="lead">{TRANSPARENCY.lede}</p>
          <p className="records__closing">{TRANSPARENCY.closing}</p>
        </div>

        <figure className="records__book" ref={bookRef} data-in={inView}>
          <table className="records__table">
            <caption>
              <strong>{TRANSPARENCY.dataLabel}.</strong> {TRANSPARENCY.dataNote}
            </caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Particulars</th>
                <th scope="col">Ref.</th>
                <th scope="col" className="records__money">
                  Out (₹)
                </th>
                <th scope="col" className="records__money">
                  In (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {LEDGER_ROWS.map((row, i) => (
                <tr
                  key={row.id}
                  className={`records__row records__row--${row.kind}`}
                  style={{ '--i': i } as CSSProperties}
                >
                  <td className="tnum">{row.date}</td>
                  <td>{row.particulars}</td>
                  <td className="tnum">{row.reference}</td>
                  <td className="records__money tnum">
                    {row.kind === 'debit' ? formatINR(row.amount).replace('₹', '') : ''}
                  </td>
                  <td className="records__money tnum">
                    {row.kind !== 'debit' ? formatINR(row.amount).replace('₹', '') : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <span className="records__sample" aria-hidden="true">
            Sample
            <br />
            entries
          </span>
        </figure>
      </div>
    </section>
  );
}
