// ============================================================
// Navbar — transparent over the hero, solid once you leave it.
// ============================================================

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BRAND, CONTACT, NAV_LINKS } from '../../content';
import { useReducedMotion, useScrollLock, useSmoothScrollTo } from '../../hooks';
import { EASE } from '../../utils/motion';
import './Navbar.css';

const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1));

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('');
  const reducedMotion = useReducedMotion();
  const scrollTo = useSmoothScrollTo();

  useScrollLock(open);

  // Solidify once the hero sentinel has left the top of the page.
  useEffect(() => {
    const sentinel = document.getElementById('nav-sentinel');
    if (!sentinel) return;
    const io = new IntersectionObserver(([entry]) => setSolid(!entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  // Mark the section currently occupying the middle of the viewport.
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setOpen(false);
      scrollTo(href);
    },
    [scrollTo]
  );

  return (
    <header className={`nav ${solid ? 'nav--solid' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav__bar shell">
        <a
          href="#hero"
          className="nav__logo"
          onClick={(e) => {
            e.preventDefault();
            setOpen(false);
            window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
          }}
          aria-label={`${BRAND.name} — back to top`}
        >
          <span className="nav__logo-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              {/* Khatam star: two squares, the same motif as the desk inlay */}
              <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1.1" />
              <rect
                x="4"
                y="4"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="1.1"
                transform="rotate(45 12 12)"
              />
            </svg>
          </span>
          <span className="nav__logo-type">
            <span className="nav__logo-top">{BRAND.logoTop}</span>
            <span className="nav__logo-bottom">{BRAND.logoBottom}</span>
          </span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav__link ${active === link.href.slice(1) ? 'is-active' : ''}`}
              onClick={(e) => go(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href={CONTACT.phoneHref} className="nav__cta">
          Talk to us
        </a>

        <button
          className="nav__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="nav-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className={`nav__toggle-bar ${open ? 'is-open' : ''}`} />
          <span className={`nav__toggle-bar ${open ? 'is-open' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="nav-menu"
            className="nav__menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: reducedMotion ? 0 : 0.55, ease: EASE }}
          >
            <div className="geo-field" aria-hidden="true" />

            <nav className="nav__menu-links" aria-label="Mobile">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="nav__menu-link"
                  onClick={(e) => go(e, link.href)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.5,
                    ease: EASE,
                    delay: reducedMotion ? 0 : 0.18 + i * 0.06,
                  }}
                >
                  <span className="nav__menu-index">{`0${i + 1}`}</span>
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <motion.div
              className="nav__menu-foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reducedMotion ? 0 : 0.48, duration: 0.4 }}
            >
              <p className="nav__menu-name">{CONTACT.name}</p>
              <a href={CONTACT.phoneHref} className="nav__menu-phone">
                {CONTACT.phone}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
