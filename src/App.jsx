import React from 'react';
import Navigation from './components/Navigation';
import BrainExperience from './components/BrainExperience';
import NeuralBackdrop from './components/NeuralBackdrop';
import About from './components/About';
import Capabilities from './components/Capabilities';
import DeliveryProcess from './components/DeliveryProcess';
import Toolkit from './components/Toolkit';
import Contact from './components/Contact';
import ProfileConnect from './components/ProfileConnect';
import Footer from './components/Footer';
import PortfolioChat from './components/PortfolioChat';

export default function App() {
  return (
    <div className="bg-[#0B0F19] text-gray-100 min-h-screen font-sans selection:bg-cyan-500/30 selection:text-cyan-300 antialiased overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed left-4 top-4 z-[200] rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* ambient neural layer behind every section */}
      <NeuralBackdrop />

      {/* Background ambient mesh glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[1200px] right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <Navigation />
      <main id="main-content" className="relative z-10">
        <BrainExperience />
        <About />
        <Capabilities />
        <DeliveryProcess />
        <Toolkit />
        <Contact />
        <ProfileConnect />
      </main>

      <Footer />
      <PortfolioChat />
    </div>
  );
}
