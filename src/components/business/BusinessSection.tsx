// ============================================================
// BusinessSection — what is traded, one lot at a time.
//
// A tall track with a sticky stage inside it. Scrolling the track slides
// a camera along a shelf of the three lots, and the same scroll position
// changes the words and the colour of the whole field, so the page, the
// copy and the goods are always on the same lot.
// ============================================================

import { lazy, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Stage from '../../three/Stage';
import { LOT_COUNT, lotIndex } from '../../three/lots';
import { usePointerRef, useReducedMotion, useIsMobile } from '../../hooks';
import { BUSINESS, COMMODITIES } from '../../content';
import { revealLines } from '../../utils/motion';
import { scrollToY } from '../../utils/scroll';
import './BusinessSection.css';

const LotsScene = lazy(() => import('../../three/scenes/LotsScene'));

/** Each lot gets the field its goods sit best against. */
const FIELDS = ['cardamom', 'ink', 'chilli'] as const;

export default function BusinessSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const progressRef = useRef(0);
  const [lot, setLot] = useState(0);
  const reducedMotion = useReducedMotion();
  const mobile = useIsMobile();
  const pointerRef = usePointerRef(!reducedMotion && !mobile);

  const camera = useMemo(
    () => ({ position: [0, 3.2, 9.5] as [number, number, number], fov: 30, near: 0.1, far: 120 }),
    []
  );

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let queued = false;

    const measure = () => {
      queued = false;
      const r = el.getBoundingClientRect();
      const p = Math.min(Math.max(-r.top / Math.max(r.height - window.innerHeight, 1), 0), 1);
      progressRef.current = p;
      const next = lotIndex(p);
      setLot((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!titleRef.current) return;
    return revealLines(titleRef.current);
  }, []);

  const jumpTo = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    scrollToY(top + travel * ((index + 0.3) / LOT_COUNT));
  };

  const field = FIELDS[lot];

  return (
    <section
      className={`business field field--${field}`}
      id="business"
      data-nav={field}
      aria-labelledby="business-title"
    >
      <header className="business__intro shell">
        <h2 className="head business__title" id="business-title" ref={titleRef}>
          {BUSINESS.title}
        </h2>
        <p className="lead">{BUSINESS.lede}</p>
      </header>

      <div className="business__track" ref={trackRef}>
        <div className="business__pin">
          <Stage
            className="business__stage"
            label="Three lots on one shelf: a jute sack of turmeric with chillies and a dish of pepper, a dish of almonds with dates and pistachios, and a stepped pyramid of stamped gold bars"
            camera={camera}
            fallback={<div className="business__fallback" aria-hidden="true" />}
          >
            <LotsScene progressRef={progressRef} pointerRef={pointerRef} />
          </Stage>

          <div className="business__copy shell">
            <div className="business__lots">
              {COMMODITIES.map((c, i) => (
                <article
                  key={c.id}
                  className="business__lot"
                  data-active={i === lot}
                  aria-hidden={i !== lot}
                >
                  <h3 className="display business__name">{c.name}</h3>
                  <p className="business__detail">{c.detail}</p>
                  <p className="business__note">{c.note}</p>
                </article>
              ))}
            </div>

            <ul className="business__switch" aria-label="Choose a lot">
              {COMMODITIES.map((c, i) => (
                <li key={c.id} style={{ '--i': i } as CSSProperties}>
                  <button type="button" data-active={i === lot} onClick={() => jumpTo(i)}>
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
