// ============================================================
// Navbar — a plain bar: the name, a few links, one action.
//
// It takes the colour of whatever section is under it, so it never
// reads as a strip laid across the page. On a phone the links open
// into a full-screen sheet set in the big stencil type.
// ============================================================

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import Wordmark from '../ui/Wordmark';
import { BRAND, NAV_ACTION, NAV_LINKS } from '../../content';
import { scrollToHash, scrollToTop, setScrollLocked } from '../../utils/scroll';
import './Navbar.css';

type Field = 'bone' | 'ink' | 'turmeric' | 'chilli' | 'cardamom';

export default function Navbar() {
  const [field, setField] = useState<Field>('bone');
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Whichever section sits under the bar decides its colour.
  useEffect(() => {
    let queued = false;

    const measure = () => {
      queued = false;
      const probe = 32;
      const sections = document.querySelectorAll<HTMLElement>('[data-nav]');
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          setField((el.dataset.nav as Field) ?? 'bone');
          return;
        }
      }
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // A pinned section can change colour without any scroll event firing.
    const watch = new MutationObserver(onScroll);
    watch.observe(document.getElementById('main') ?? document.body, {
      attributes: true,
      attributeFilter: ['data-nav'],
      subtree: true,
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      watch.disconnect();
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.field = field;
  }, [field]);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      setScrollLocked(false);
    };
  }, [open, close]);

  const go = (hash: string) => (e: MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // Let the sheet release its scroll lock before the page moves.
    requestAnimationFrame(() => scrollToHash(hash));
  };

  const ground = open ? 'ink' : field;

  return (
    <header className={`nav field field--${ground}`} data-open={open}>
      <div className="nav__bar shell">
        <a
          className="nav__brand"
          href="#hero"
          aria-label={`${BRAND.name}, back to top`}
          onClick={(e) => {
            e.preventDefault();
            setOpen(false);
            scrollToTop();
          }}
        >
          <Wordmark />
        </a>

        <nav className="nav__links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} className="nav__link" href={link.href} onClick={go(link.href)}>
              {link.label}
            </a>
          ))}
        </nav>

        <a className="btn nav__action" href={NAV_ACTION.href} onClick={go(NAV_ACTION.href)}>
          {NAV_ACTION.label}
        </a>

        <button
          ref={toggleRef}
          className="nav__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="sheet"
          onClick={() => (open ? close() : setOpen(true))}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="nav__bars" aria-hidden="true" />
        </button>
      </div>

      <div id="sheet" className="nav__sheet" hidden={!open}>
        <ul className="nav__sheet-list shell">
          {[...NAV_LINKS, NAV_ACTION].map((link, i) => (
            <li key={link.href} style={{ '--i': i } as CSSProperties}>
              <a ref={i === 0 ? firstLinkRef : undefined} href={link.href} onClick={go(link.href)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
