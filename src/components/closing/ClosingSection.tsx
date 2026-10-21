// ============================================================
// ClosingSection — the next step is a conversation.
// ============================================================

import { useEffect, useRef, type MouseEvent } from 'react';
import Arrow from '../ui/Arrow';
import { BRAND, CLOSING, CONTACT } from '../../content';
import { revealLines } from '../../utils/motion';
import { scrollToHash } from '../../utils/scroll';
import './ClosingSection.css';

export default function ClosingSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    return revealLines(titleRef.current);
  }, []);

  const go = (hash: string) => (e: MouseEvent) => {
    e.preventDefault();
    scrollToHash(hash);
  };

  return (
    <section
      className="closing section field field--turmeric"
      id="contact"
      data-nav="turmeric"
      aria-labelledby="closing-title"
    >
      <span className="closing__arabic arabic-mark" lang="ar" aria-hidden="true">
        {BRAND.arabic}
      </span>

      <div className="shell closing__inner">
        <h2 className="display closing__title" id="closing-title" ref={titleRef}>
          {CLOSING.headline.map((line) => (
            <span key={line} className="closing__line">
              {line}
            </span>
          ))}
        </h2>

        <p className="lead closing__lede">{CLOSING.lede}</p>

        <div className="closing__actions">
          <a className="btn" href={CONTACT.phoneHref}>
            {CLOSING.primaryCta}
            <Arrow />
          </a>
          <a className="link closing__secondary" href="#returns" onClick={go('#returns')}>
            {CLOSING.secondaryCta}
          </a>
        </div>

        <p className="closing__who">
          <strong>{CONTACT.name}</strong>, {CONTACT.role}
          <br />
          <a className="link tnum" href={CONTACT.phoneHref}>
            {CONTACT.phone}
          </a>
        </p>
      </div>
    </section>
  );
}
