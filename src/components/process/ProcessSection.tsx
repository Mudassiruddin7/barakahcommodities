// ============================================================
// ProcessSection — one consignment, six stamps.
//
// The slip runs down the left. As each line reaches the middle of the
// screen it is stamped the way a clerk would stamp it: from above, hard,
// slightly crooked. The stage that is currently being stamped is named,
// very large, on the right.
// ============================================================

import { useRef, useState, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import { PROCESS, PROCESS_STAGES } from '../../content';
import { EASE_OUT, gsap, prefersReducedMotion, revealLines, ScrollTrigger } from '../../utils/motion';
import './ProcessSection.css';

/** A clerk's stamps never land square. */
const TILT = [-4, 3, -2.5, 4.5, -3, 2.5];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const undo = titleRef.current ? revealLines(titleRef.current) : undefined;

      gsap.utils.toArray<HTMLElement>('.process__row').forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: 'top 58%',
          end: 'bottom 42%',
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });

        const stamp = row.querySelector<HTMLElement>('.process__stamp');
        if (!stamp) return;
        const rest = TILT[i % TILT.length];

        gsap
          .timeline({ scrollTrigger: { trigger: row, start: 'top 66%', once: true } })
          .fromTo(
            stamp,
            { scale: 1.55, opacity: 0, rotate: rest - 16 },
            { scale: 1, opacity: 1, rotate: rest, duration: 0.2, ease: 'power2.in' }
          )
          .to(stamp, { scale: 0.94, duration: 0.06, ease: 'power1.out' })
          .to(stamp, { scale: 1, duration: 0.28, ease: EASE_OUT });
      });

      return undo;
    },
    { scope: sectionRef }
  );

  return (
    <section
      className="process section field field--bone"
      id="process"
      data-nav="bone"
      ref={sectionRef}
      aria-labelledby="process-title"
    >
      <header className="shell process__head">
        <h2 className="head" id="process-title" ref={titleRef}>
          {PROCESS.title}
        </h2>
        <p className="lead">{PROCESS.lede}</p>
      </header>

      <div className="shell process__body">
        <ol className="process__slip">
          {PROCESS_STAGES.map((stage, i) => (
            <li
              key={stage.id}
              className="process__row"
              data-active={i === active}
              style={{ '--tilt': `${TILT[i % TILT.length]}deg` } as CSSProperties}
            >
              <div className="process__what">
                <h3 className="process__label">{stage.label}</h3>
                <p>{stage.description}</p>
              </div>
              <span className="process__stamp" aria-label={`Stamped: ${stage.stamp}`}>
                {stage.stamp}
              </span>
            </li>
          ))}
        </ol>

        <div className="process__word" aria-hidden="true">
          <span className="display process__word-text" key={active}>
            {PROCESS_STAGES[active].label}
          </span>
        </div>
      </div>
    </section>
  );
}
