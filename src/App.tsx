// ============================================================
// Barakah Commodities — single landing page.
//
// Section order is the argument the page makes: who we are, what
// we trade, how it works, how profit is calculated, how it is
// recorded, what can go wrong, what we hold to, and who to call.
// ============================================================

import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';

import Navbar from './components/layout/Navbar';
import Hero from './components/hero/Hero';
import BusinessSection from './components/business/BusinessSection';
import ProcessSection from './components/process/ProcessSection';
import MudarabahFlow from './components/mudarabah/MudarabahFlow';
import ProfitModel from './components/profit/ProfitModel';
import TransparencySection from './components/transparency/TransparencySection';
import RiskSection from './components/risk/RiskSection';
import PrinciplesSection from './components/principles/PrinciplesSection';
import TrustSection from './components/trust/TrustSection';
import ClosingSection from './components/closing/ClosingSection';
import Footer from './components/layout/Footer';

import { ScrollTrigger } from './utils/motion';

export default function App() {
  // Web fonts and the first 3D frame both change layout height, so give
  // ScrollTrigger a fresh measurement once things have settled.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    const timer = window.setTimeout(refresh, 400);
    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh).catch(() => {});
    }
    window.addEventListener('load', refresh);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('load', refresh);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    /*
      Motion does not read prefers-reduced-motion by itself. With "user" it
      drops transform and layout animations for anyone who has asked for less
      motion, while still allowing opacity — so every reveal on the page
      resolves to its final state instead of animating into it. The GSAP and
      R3F paths check the setting individually via useReducedMotion.
    */
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        <Hero />
        <BusinessSection />
        <ProcessSection />
        <MudarabahFlow />
        <ProfitModel />
        <TransparencySection />
        <RiskSection />
        <PrinciplesSection />
        <TrustSection />
        <ClosingSection />
      </main>

      <Footer />
    </MotionConfig>
  );
}
