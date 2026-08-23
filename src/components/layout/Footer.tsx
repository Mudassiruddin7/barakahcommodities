// ============================================================
// Footer
// ============================================================

import { BRAND, CONTACT, FOOTER_LINKS, LEGAL_NOTE } from '../../content';
import { useSmoothScrollTo } from '../../hooks';
import './Footer.css';

export default function Footer() {
  const scrollTo = useSmoothScrollTo();
  const year = new Date().getFullYear();

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#') || !document.querySelector(href)) return;
    e.preventDefault();
    scrollTo(href);
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="shell">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1" />
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  strokeWidth="1"
                  transform="rotate(45 12 12)"
                />
              </svg>
            </span>
            <p className="footer__name">{BRAND.name}</p>
            <p className="footer__descriptor">{BRAND.descriptor}</p>
            <p className="footer__tagline">{BRAND.tagline}</p>
          </div>

          <nav className="footer__nav" aria-label="Footer">
            <div className="footer__col">
              <h2 className="footer__col-title">Navigate</h2>
              <ul>
                {FOOTER_LINKS.navigate.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} onClick={(e) => onNavClick(e, link.href)}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__col">
              <h2 className="footer__col-title">Legal</h2>
              <ul>
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} onClick={(e) => onNavClick(e, link.href)}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__col">
              <h2 className="footer__col-title">Contact</h2>
              <address className="footer__contact">
                <span className="footer__contact-name">{CONTACT.name}</span>
                <span className="footer__contact-role">{CONTACT.role}</span>
                <a href={CONTACT.phoneHref} className="footer__contact-phone">
                  {CONTACT.phone}
                </a>
              </address>
            </div>
          </nav>
        </div>

        <div className="footer__legal">
          <p className="footer__disclaimer">{LEGAL_NOTE}</p>
          <p className="footer__copy">
            © {year} {BRAND.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
