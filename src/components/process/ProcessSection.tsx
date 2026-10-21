// ============================================================
// ProcessSection — one consignment, six stamps.
//
// Six short cards, each stamped the way a clerk would stamp it: from
// above, hard, slightly crooked, one after another once the section is
// on screen. Pure CSS; nothing here listens to scroll.
// ============================================================

import { useEffect, useRef, type CSSProperties } from 'react';
import { useInView } from '../../hooks';
import { PROCESS, PROCESS_STAGES } from '../../content';
import { revealLines } from '../../utils/motion';
import './ProcessSection.css';

/** A clerk's stamps never land square. */
const TILT = [-4, 3, -2.5, 4.5, -3, 2.5];

export default function ProcessSection() {
  const [gridRef, inView] = useInView<HTMLOListElement>({ threshold: 0.2 });
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    return revealLines(titleRef.current);
  }, []);

  return (
    <section
      className="process section field field--bone"
      id="process"
      data-nav="bone"
      aria-labelledby="process-title"
    >
      <header className="shell process__head">
        <h2 className="head" id="process-title" ref={titleRef}>
          {PROCESS.title}
        </h2>
        <p className="lead">{PROCESS.lede}</p>
      </header>

      <ol className="shell process__grid" ref={gridRef} data-in={inView}>
        {PROCESS_STAGES.map((stage, i) => (
          <li
            key={stage.id}
            className="process__card"
            style={{ '--i': i, '--tilt': `${TILT[i % TILT.length]}deg` } as CSSProperties}
          >
            <h3 className="process__label">{stage.label}</h3>
            <p>{stage.description}</p>
            <span className="process__stamp" aria-label={`Stamped: ${stage.stamp}`}>
              {stage.stamp}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
