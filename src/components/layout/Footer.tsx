// ============================================================
// Footer — the name comes back at full width, the way it is stencilled
// across the end of a sack.
// ============================================================

import type { MouseEvent } from 'react';
import { BRAND, CONTACT, FOOTER_LINKS, LEGAL_NOTE } from '../../content';
import { scrollToHash } from '../../utils/scroll';
import './Footer.css';

export default function Footer() {
  const go = (hash: string) => (e: MouseEvent) => {
    e.preventDefault();
    scrollToHash(hash);
  };

  return (
    <footer className="footer field field--ink" data-nav="ink">
      <div className="footer__main shell">
        <p className="footer__descriptor lead">{BRAND.descriptor}</p>

        <nav className="footer__col" aria-label="Footer">
          <p className="footer__heading">Navigate</p>
          <ul>
            {[...FOOTER_LINKS.navigate, ...FOOTER_LINKS.legal].map((l) => (
              <li key={l.href}>
                <a className="link" href={l.href} onClick={go(l.href)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <p className="footer__heading">Contact</p>
          <p className="footer__name">{CONTACT.name}</p>
          <p className="muted">{CONTACT.role}</p>
          <a className="link footer__phone tnum" href={CONTACT.phoneHref}>
            {CONTACT.phone}
          </a>
        </div>
      </div>

      <div className="shell">
        <p className="footer__legal muted small">
          {LEGAL_NOTE} © {new Date().getFullYear()} {BRAND.name}.
        </p>
      </div>

      <div className="footer__wordmark" aria-hidden="true">
        <span className="footer__wordmark-top">{BRAND.logoTop}</span>
        <span className="footer__wordmark-bottom">{BRAND.logoBottom}</span>
      </div>
    </footer>
  );
}
