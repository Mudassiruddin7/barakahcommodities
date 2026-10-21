// ============================================================
// RiskSection — the brass balance, and the plain list of what can go
// wrong. The beam swings with the scroll: gold on one pan, iron on the
// other, and it does not promise to stay level.
// ============================================================

import { lazy, useEffect, useMemo, useRef } from 'react';
import Stage from '../../three/Stage';
import { useScrollProgressRef } from '../../hooks';
import { RISK, RISK_POINTS, RISK_STATEMENTS } from '../../content';
import { revealLines } from '../../utils/motion';
import './RiskSection.css';

const ScaleScene = lazy(() => import('../../three/scenes/ScaleScene'));

export default function RiskSection() {
  const [sectionRef, progressRef] = useScrollProgressRef<HTMLElement>('enter');
  const titleRef = useRef<HTMLHeadingElement>(null);

  const camera = useMemo(
    () => ({ position: [0, 3.6, 10.5] as [number, number, number], fov: 30, near: 0.1, far: 80 }),
    []
  );

  useEffect(() => {
    if (!titleRef.current) return;
    return revealLines(titleRef.current);
  }, []);

  return (
    <section
      className="risk section field field--ink"
      id="risk"
      data-nav="ink"
      ref={sectionRef}
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
          <Stage
            className="risk__stage"
            label="A brass balance with gold bars on one pan and cast-iron weights on the other, the beam tipping one way and then the other"
            camera={camera}
            fallback={<div className="risk__fallback" aria-hidden="true" />}
          >
            <ScaleScene progressRef={progressRef} />
          </Stage>
          <figcaption>
            Gold is the {RISK.pans.gold.toLowerCase()}. Iron is the {RISK.pans.iron.toLowerCase()}. The beam
            swings both ways.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
