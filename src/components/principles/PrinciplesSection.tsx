// ============================================================
// PrinciplesSection — five commitments, five strips of colour.
//
// Each strip is a plain colour with its word set upright down the side.
// Point at one, focus it, or tap it, and it opens to say what it means.
// On a phone the strips stack and open downward.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { PRINCIPLES, PRINCIPLES_SECTION } from '../../content';
import { revealLines } from '../../utils/motion';
import './PrinciplesSection.css';

const TONES = ['turmeric', 'chilli', 'cardamom', 'ink', 'sand'] as const;

export default function PrinciplesSection() {
  const [open, setOpen] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    return revealLines(titleRef.current);
  }, []);

  return (
    <section
      className="principles section field field--bone"
      id="principles"
      data-nav="bone"
      aria-labelledby="principles-title"
    >
      <header className="shell principles__head">
        <h2 className="head" id="principles-title" ref={titleRef}>
          {PRINCIPLES_SECTION.title}
        </h2>
        <p className="lead">{PRINCIPLES_SECTION.lede}</p>
      </header>

      <ul className="principles__strips">
        {PRINCIPLES.map((p, i) => {
          const isOpen = i === open;
          return (
            <li
              key={p.id}
              className={`strip strip--${TONES[i]}`}
              data-open={isOpen}
              onPointerEnter={(e) => {
                if (e.pointerType === 'mouse') setOpen(i);
              }}
            >
              <button
                type="button"
                className="strip__button"
                aria-expanded={isOpen}
                aria-controls={`strip-${p.id}`}
                onClick={() => setOpen(i)}
                onFocus={() => setOpen(i)}
              >
                <span className="strip__side display">{p.term}</span>
                <span className="strip__title">
                  <span className="display strip__term">{p.term}</span>
                  <span className="strip__english">{p.english}</span>
                </span>
              </button>
              <div className="strip__panel" id={`strip-${p.id}`} role="region" aria-label={p.term}>
                <p>{p.description}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <aside className="shell principles__note">
        <p className="principles__note-title">{PRINCIPLES_SECTION.disclaimerLabel}</p>
        <p>{PRINCIPLES_SECTION.disclaimer}</p>
      </aside>
    </section>
  );
}
