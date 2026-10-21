// ============================================================
// BusinessSection — what is traded: three lots, three fields of colour,
// one picture of each.
// ============================================================

import { useEffect, useRef } from 'react';
import { BUSINESS, COMMODITIES, type Commodity } from '../../content';
import { revealLines } from '../../utils/motion';
import './BusinessSection.css';

/** Each lot sits on the field its goods read best against. */
const LOT_ART: Record<Commodity['id'], { field: string; src: string; width: number; height: number; alt: string }> = {
  spices: {
    field: 'cardamom',
    src: '/images/lot-spices.webp',
    width: 1681,
    height: 738,
    alt: 'A jute sack of turmeric stencilled Barakah Commodities, a brass dish of black pepper, dried chillies, cardamom, star anise and cinnamon',
  },
  'dry-fruits': {
    field: 'ink',
    src: '/images/lot-dry-fruits.webp',
    width: 1757,
    height: 738,
    alt: 'A brass dish of almonds with dates, pistachios and loose almonds beside it',
  },
  gold: {
    field: 'chilli',
    src: '/images/lot-gold.webp',
    width: 1567,
    height: 519,
    alt: 'A stepped pyramid of gold bars stamped 999.9 fine gold, with two more bars laid out in front',
  },
};

export default function BusinessSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    return revealLines(titleRef.current);
  }, []);

  return (
    <section id="business" aria-labelledby="business-title">
      <header className="business__intro section field field--bone" data-nav="bone">
        <div className="shell business__head">
          <h2 className="head" id="business-title" ref={titleRef}>
            {BUSINESS.title}
          </h2>
          <p className="lead">{BUSINESS.lede}</p>
        </div>
      </header>

      {COMMODITIES.map((c) => {
        const art = LOT_ART[c.id];
        return (
          <article key={c.id} className={`lot field field--${art.field}`} data-nav={art.field}>
            <div className="shell lot__grid">
              <div className="lot__copy">
                <h3 className="display lot__name">{c.name}</h3>
                <p className="lot__detail">{c.detail}</p>
                <p className="lot__note">{c.note}</p>
              </div>
              <img
                className="lot__art"
                src={art.src}
                width={art.width}
                height={art.height}
                alt={art.alt}
                loading="lazy"
                decoding="async"
              />
            </div>
          </article>
        );
      })}
    </section>
  );
}
