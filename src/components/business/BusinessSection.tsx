// ============================================
// Business Section — "What We Trade"
// ============================================

import { useEffect, useRef } from 'react';
import { COMMODITIES } from '../../utils/constants';
import { useReducedMotion } from '../../hooks';
import { createStaggerReveal } from '../../utils/animations';
import './BusinessSection.css';

const PANEL_VARIANTS: Record<string, string> = {
  spices: 'business__panel--spices',
  'dry-fruits': 'business__panel--dry-fruits',
  gold: 'business__panel--gold',
};

export default function BusinessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const panels = sectionRef.current.querySelectorAll('.business__panel');
    const ctx = createStaggerReveal(
      Array.from(panels),
      sectionRef.current,
      { stagger: 0.15, y: 40, start: 'top 80%' }
    );

    return () => { ctx?.kill(); };
  }, [reducedMotion]);

  return (
    <section className="section business" id="business" ref={sectionRef} aria-label="Our Business">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow section-header__eyebrow">OUR BUSINESS</p>
          <h2 className="section-header__title">
            WE TRADE WHAT PEOPLE ACTUALLY USE.
          </h2>
          <p className="section-header__description">
            Physical commodities. Real supply chains. Genuine business activity.
          </p>
        </div>

        <div className="business__panels">
          {COMMODITIES.map((item) => (
            <div
              key={item.id}
              className={`business__panel ${PANEL_VARIANTS[item.id] || ''}`}
            >
              <span className="business__panel-number">{item.name}</span>
              <p className="business__panel-label">{item.label}</p>
              <p className="business__panel-desc">{item.description}</p>
              <p className="business__panel-detail">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
