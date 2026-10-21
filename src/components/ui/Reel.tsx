// ============================================================
// Reel — a number made of rolling digits, like an old mechanical
// counter. Each digit is a column of 0–9 that slides to its value, so a
// figure that changes reads as something being wound, not swapped.
// ============================================================

import { memo } from 'react';
import './ui.css';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

interface ReelProps {
  value: number;
  prefix?: string;
  className?: string;
}

function Reel({ value, prefix = '₹', className }: ReelProps) {
  const text = value.toLocaleString('en-IN');

  // Digits are keyed by place value counted from the right, so when the number
  // grows a digit the existing columns keep rolling instead of remounting.
  const cells: { key: string; digit: number | null; ch: string }[] = [];
  let place = 0;
  for (let i = text.length - 1; i >= 0; i--) {
    const ch = text[i];
    if (/\d/.test(ch)) cells.unshift({ key: `d${place++}`, digit: Number(ch), ch });
    else cells.unshift({ key: `s${place}`, digit: null, ch });
  }

  return (
    <span className={className ? `reel ${className}` : 'reel'} role="img" aria-label={`${prefix}${text}`}>
      {prefix && (
        <span className="reel__sep" aria-hidden="true">
          {prefix}
        </span>
      )}
      {cells.map((cell) =>
        cell.digit === null ? (
          <span className="reel__sep" aria-hidden="true" key={cell.key}>
            {cell.ch}
          </span>
        ) : (
          <span className="reel__digit" aria-hidden="true" key={cell.key}>
            <span className="reel__stack" style={{ '--d': cell.digit } as React.CSSProperties}>
              {DIGITS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        )
      )}
    </span>
  );
}

export default memo(Reel);
