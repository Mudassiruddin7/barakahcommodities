// ============================================
// Footer — Full Premium Footer
// ============================================

import {
  FOOTER_LINKS,
  CONTACT,
  LEGAL_DISCLAIMER,
  SHARIAH_DISCLAIMER,
} from '../../utils/constants';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          {/* Brand Column */}
          <div>
            <div className="footer__brand-logo">
              <span className="footer__brand-main">BARAKAH</span>
              <span className="footer__brand-sub">COMMODITIES</span>
            </div>
            <p className="footer__tagline">
              Real commodities. Real business. Real barakah.
            </p>
            <p className="footer__legal-text">{LEGAL_DISCLAIMER}</p>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="footer__heading">Navigation</h3>
            <div className="footer__link-list">
              {FOOTER_LINKS.main.map((link) => (
                <a key={link.href} href={link.href} className="footer__link">
                  {link.label}
                </a>
              ))}
            </div>
            <div className="footer__link-divider" />
            <div className="footer__link-list">
              {FOOTER_LINKS.legal.map((link) => (
                <a key={link.href} href={link.href} className="footer__link">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="footer__heading">Contact</h3>
            <p className="footer__contact-name">{CONTACT.name}</p>
            <p className="footer__contact-title">{CONTACT.title}</p>
            <a href={CONTACT.phoneHref} className="footer__contact-phone">
              {CONTACT.phone}
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} Barakah Commodities. All rights reserved.
          </p>
          <p className="footer__shariah-note">{SHARIAH_DISCLAIMER}</p>
        </div>
      </div>
    </footer>
  );
}
