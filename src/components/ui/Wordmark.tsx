import { memo } from 'react';
import { BRAND } from '../../content';
import './ui.css';

/** The ingot mark — a cast bar seen end-on — with the name set like a sack mark. */
export function IngotMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M8 9h16l4 14H4z" fill="currentColor" />
      <path d="M8 9h16l1.4 4.8H6.6z" fill="var(--bg)" opacity="0.28" />
    </svg>
  );
}

function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className ? `wordmark ${className}` : 'wordmark'}>
      <IngotMark className="wordmark__mark" />
      <span className="wordmark__name">
        {BRAND.logoTop} <span className="wordmark__rest">{BRAND.logoBottom}</span>
      </span>
    </span>
  );
}

export default memo(Wordmark);
