// ============================================================
// MagneticButton — a button that leans toward the cursor.
//
// The lean is applied to a wrapper so the button's own transform
// stays free for hover states, and it is disabled outright for
// coarse pointers and reduced-motion users.
// ============================================================

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { useMagnetic } from '../../hooks';

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  strength?: number;
}

const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  function MagneticButton({ children, strength = 0.22, type = 'button', ...rest }, ref) {
    const magnetRef = useMagnetic<HTMLSpanElement>(strength);

    return (
      <span ref={magnetRef} className="magnetic">
        <button ref={ref} type={type} {...rest}>
          {children}
        </button>
      </span>
    );
  }
);

export default MagneticButton;

/** Anchor variant, for links that must remain links. */
export const MagneticLink = forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { strength?: number }
>(function MagneticLink({ children, strength = 0.22, ...rest }, ref) {
  const magnetRef = useMagnetic<HTMLSpanElement>(strength);

  return (
    <span ref={magnetRef} className="magnetic">
      <a ref={ref} {...rest}>
        {children}
      </a>
    </span>
  );
});
