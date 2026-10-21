// ============================================================
// MudarabahFlow — how the partnership is put together.
//
// Two parties feed one activity; the activity produces a result; the
// result is a profit or a loss with equal weight; any profit is shared
// by the agreed ratio. The connectors are thick bars that draw
// themselves in once the diagram is on screen.
// ============================================================

import { useEffect, useRef } from 'react';
import { useInView } from '../../hooks';
import { MUDARABAH, MUDARABAH_STEPS } from '../../content';
import { revealLines } from '../../utils/motion';
import './MudarabahFlow.css';

const [capital, manager, trading, result, sharing] = MUDARABAH_STEPS;

function Node({
  step,
  className,
  children,
}: {
  step: (typeof MUDARABAH_STEPS)[number];
  className: string;
  children?: React.ReactNode;
}) {
  return (
    <article className={`flow__node ${className}`}>
      <h3 className="flow__term display">{step.term}</h3>
      <p className="flow__role">{step.role}</p>
      <p className="flow__desc">{step.description}</p>
      {children}
    </article>
  );
}

export default function MudarabahFlow() {
  const [diagramRef, inView] = useInView<HTMLDivElement>({ threshold: 0.18 });
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    return revealLines(titleRef.current);
  }, []);

  return (
    <section
      className="flow section field field--chilli"
      id="mudarabah"
      data-nav="chilli"
      aria-labelledby="mudarabah-title"
    >
      <header className="shell flow__head">
        <h2 className="head" id="mudarabah-title" ref={titleRef}>
          {MUDARABAH.title}
        </h2>
        <p className="lead">{MUDARABAH.lede}</p>
      </header>

      <div className="shell flow__diagram" ref={diagramRef} data-in={inView}>
        <div className="flow__pair">
          <Node step={capital} className="flow__node--capital" />
          <Node step={manager} className="flow__node--manager" />
        </div>

        <span className="flow__join" aria-hidden="true" />

        <Node step={trading} className="flow__node--trading" />

        <span className="flow__stem" aria-hidden="true" />

        <Node step={result} className="flow__node--result">
          <div className="flow__outcomes">
            <div className="flow__outcome flow__outcome--profit">
              <span className="display">Profit</span>
              <p>Shared by the agreed ratio.</p>
            </div>
            <div className="flow__outcome flow__outcome--loss">
              <span className="display">Loss</span>
              <p>Borne as the agreement sets out.</p>
            </div>
          </div>
          <p className="flow__equal">{MUDARABAH.resultNote}</p>
        </Node>

        <span className="flow__stem" aria-hidden="true" />

        <Node step={sharing} className="flow__node--sharing" />
      </div>
    </section>
  );
}
