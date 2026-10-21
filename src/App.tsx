// ============================================================
// Barakah Commodities — single landing page.
//
// Section order is the argument the page makes: who we are, what
// we trade, how a consignment moves, what the partnership is, what
// it is targeted to return, how profit is calculated, how it is
// recorded, what can go wrong, what we hold to, and who to call.
// ============================================================

import { useEffect } from 'react';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/hero/Hero';
import BusinessSection from './components/business/BusinessSection';
import ProcessSection from './components/process/ProcessSection';
import MudarabahFlow from './components/mudarabah/MudarabahFlow';
import ReturnsCalculator from './components/returns/ReturnsCalculator';
import ProfitModel from './components/profit/ProfitModel';
import TransparencySection from './components/transparency/TransparencySection';
import RiskSection from './components/risk/RiskSection';
import PrinciplesSection from './components/principles/PrinciplesSection';
import ClosingSection from './components/closing/ClosingSection';

import { ScrollTrigger } from './utils/motion';

export default function App() {
  // Web fonts and the first 3D frame both change layout height, so give
  // ScrollTrigger a fresh measurement once things have settled.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const timer = window.setTimeout(refresh, 400);
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener('load', refresh);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('load', refresh);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        <Hero />
        <BusinessSection />
        <ProcessSection />
        <MudarabahFlow />
        <ReturnsCalculator />
        <ProfitModel />
        <TransparencySection />
        <RiskSection />
        <PrinciplesSection />
        <ClosingSection />
      </main>

      <Footer />
    </>
  );
}
