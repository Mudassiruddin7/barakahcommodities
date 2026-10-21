// ============================================================
// Stamp — a round rubber stamp, inked a little unevenly.
//
// The business works in stamps: received, weighed, passed, paid. Used
// where the page wants to say that something was done, not just claim it.
// ============================================================

import { memo, useId, type Ref } from 'react';
import './ui.css';

interface StampProps {
  /** Words around the rim. */
  ring: string;
  /** Words across the middle, one per line. */
  lines: readonly string[];
  className?: string;
  ref?: Ref<SVGSVGElement>;
}

function Stamp({ ring, lines, className, ref }: StampProps) {
  const id = useId();
  const path = `stamp-ring-${id}`;
  const filter = `stamp-ink-${id}`;
  const repeated = `${ring}  ·  ${ring}  ·  `;

  return (
    <svg
      ref={ref}
      className={className ? `stamp ${className}` : 'stamp'}
      viewBox="0 0 200 200"
      role="img"
      aria-label={`${ring}: ${lines.join(', ')}`}
    >
      <defs>
        {/* Rubber never prints a clean edge: pull it about a pixel off true. */}
        <filter id={filter} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" />
        </filter>
        <path id={path} d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
      </defs>

      <g filter={`url(#${filter})`} fill="currentColor">
        <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="5" />
        <circle cx="100" cy="100" r="52" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <text className="stamp__ring" fontSize="15" fontWeight="800" letterSpacing="2.4">
          <textPath href={`#${path}`} startOffset="0">
            {repeated}
          </textPath>
        </text>
        {lines.map((line, i) => (
          <text
            key={line}
            className="stamp__line"
            x="100"
            y={100 + (i - (lines.length - 1) / 2) * 22 + 7}
            textAnchor="middle"
            fontSize="21"
            fontWeight="850"
          >
            {line}
          </text>
        ))}
      </g>
    </svg>
  );
}

export default memo(Stamp);
