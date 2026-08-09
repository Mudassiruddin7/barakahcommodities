// ============================================
// Barakah Commodities — Root Application
// ============================================

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/layout/Navbar';
import Hero from './components/hero/Hero';
import BusinessSection from './components/business/BusinessSection';
import CommodityTable from './components/commodity-table/CommodityTable';
import MudarabahFlow from './components/mudarabah/MudarabahFlow';
import ProfitModel from './components/profit/ProfitModel';
import TransparencySection from './components/transparency/TransparencySection';
import RiskSection from './components/risk/RiskSection';
import PrinciplesSection from './components/principles/PrinciplesSection';
import TrustSection from './components/trust/TrustSection';
import FinalCTA from './components/cta/FinalCTA';
import Footer from './components/layout/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  // Refresh ScrollTrigger after all content has loaded
  useEffect(() => {
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BusinessSection />
        <CommodityTable />
        <MudarabahFlow />
        <ProfitModel />
        <TransparencySection />
        <RiskSection />
        <PrinciplesSection />
        <TrustSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

export default App;
