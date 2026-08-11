import React, { useState, useEffect } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Global Status Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-purple-950 border-b border-cyan-500/20 text-center py-2 px-4 text-xs font-medium tracking-wide text-cyan-300 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        Open to Consulting Projects — Available Worldwide
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B0F19]/80 backdrop-blur-md border-b border-gray-800/80 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="group flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all">
              AA
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-white leading-none">Shaikh</span>
              <span className="text-[10px] text-gray-400 tracking-widest uppercase mt-1">Digital Transformation</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            {['Services', 'Case Studies', 'Toolkit', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-cyan-400 transition-colors relative py-1 group">
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          <a href="#contact" className="relative group overflow-hidden px-5 py-2.5 rounded-lg border border-cyan-500/30 text-sm font-medium text-white transition-all duration-300">
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-100 group-hover:opacity-0 transition-opacity" />
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">Inquire Project</span>
          </a>
        </div>
      </header>
    </>
  );
}
