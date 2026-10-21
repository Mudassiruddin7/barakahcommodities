// ============================================================
// TrustSection — three things, and a person to speak to.
// ============================================================

import { useEffect, useRef } from 'react';
import { CONTACT, TRUST } from '../../content';
import { revealLines } from '../../utils/motion';
import './TrustSection.css';

export default function TrustSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    return revealLines(titleRef.current);
  }, []);

  return (
    <section
      className="trust section field field--bone"
      id="trust"
      data-nav="bone"
      aria-labelledby="trust-title"
    >
      <div className="shell trust__grid">
        <div className="trust__who">
          <h2 className="head" id="trust-title" ref={titleRef}>
            {TRUST.title}
          </h2>

          <div className="trust__person field field--ink">
            <p className="trust__speak">{TRUST.speakTo}</p>
            <p className="display trust__name">{CONTACT.name}</p>
            <p className="trust__role">{CONTACT.role}</p>
            <a className="trust__phone tnum link" href={CONTACT.phoneHref}>
              {CONTACT.phone}
            </a>
          </div>
        </div>

        <ol className="trust__pillars">
          {TRUST.pillars.map((p) => (
            <li key={p.title}>
              <h3 className="display">{p.title}</h3>
              <p>{p.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
