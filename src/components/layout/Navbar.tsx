// ============================================
// Navbar — Premium Fixed Navigation
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS, CONTACT } from '../../utils/constants';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll detection via IntersectionObserver on a sentinel
  useEffect(() => {
    const sentinel = document.getElementById('nav-sentinel');
    if (!sentinel) {
      // Fallback: listen to scroll
      const onScroll = () => setScrolled(window.scrollY > 60);
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Body scroll lock when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMobileOpen(false);
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: 'smooth' });
    },
    []
  );

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">
        {/* Logo */}
        <div className="navbar__logo" onClick={handleLogoClick} role="button" tabIndex={0} aria-label="Scroll to top">
          <span className="navbar__logo-main">BARAKAH</span>
          <span className="navbar__logo-sub">COMMODITIES</span>
        </div>

        {/* Desktop Links */}
        <div className="navbar__links">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar__link"
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href={CONTACT.phoneHref}
          className="navbar__cta"
          style={{ display: undefined }}
        >
          Talk to Us
        </a>

        {/* Hamburger */}
        <button
          className="navbar__hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <motion.span
            className="navbar__hamburger-line"
            animate={mobileOpen
              ? { rotate: 45, y: 0, translateY: 0 }
              : { rotate: 0, y: -4, translateY: 0 }
            }
            style={{ position: 'absolute' }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="navbar__hamburger-line"
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="navbar__hamburger-line"
            animate={mobileOpen
              ? { rotate: -45, y: 0, translateY: 0 }
              : { rotate: 0, y: 4, translateY: 0 }
            }
            style={{ position: 'absolute' }}
            transition={{ duration: 0.3 }}
          />
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="navbar__mobile-link"
                onClick={(e) => handleNavClick(e, link.href)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.05 + i * 0.08, duration: 0.4 }}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href={CONTACT.phoneHref}
              className="navbar__mobile-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              Talk to Us
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
