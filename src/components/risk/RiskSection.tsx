// ============================================================
// RiskSection — the brass balance, and the plain list of what can go
// wrong. Gold on one pan, iron on the other: it does not promise to
// stay level.
// ============================================================

import { useEffect, useRef } from 'react';
import { RISK, RISK_POINTS, RISK_STATEMENTS } from '../../content';
import { revealLines } from '../../utils/motion';
import './RiskSection.css';

export default function RiskSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    return revealLines(titleRef.current);
  }, []);

  return (
    <section
      className="risk section field field--ink"
      id="risk"
      data-nav="ink"
      aria-labelledby="risk-title"
    >
      <div className="shell risk__grid">
        <div className="risk__copy">
          <h2 className="head" id="risk-title" ref={titleRef}>
            {RISK.title}
          </h2>
          <p className="lead">{RISK.lede}</p>

          <ul className="risk__points">
            {RISK_POINTS.map((p) => (
              <li key={p.id}>
                <h3>{p.label}</h3>
                <p>{p.detail}</p>
              </li>
            ))}
          </ul>

          <ul className="risk__statements">
            {RISK_STATEMENTS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <figure className="risk__figure">
          <img
            src="/images/balance.webp"
            width="1684"
            height="971"
            alt="A brass balance with gold bars on one pan and cast-iron weights on the other, the beam tipped to one side"
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            Gold is the {RISK.pans.gold.toLowerCase()}. Iron is the {RISK.pans.iron.toLowerCase()}. The beam
            swings both ways.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
