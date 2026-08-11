import React, { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { label: 'Services', href: '#services' },
  { label: 'Selected Work', href: '#selected-work' },
  { label: 'Toolkit', href: '#toolkit' },
  { label: 'Contact', href: '#contact' }
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <>
      <div className="flex items-center justify-center gap-2 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950 via-slate-900 to-purple-950 px-4 py-2 text-center text-xs font-medium tracking-wide text-cyan-300">
        <span className="h-2 w-2 rounded-full bg-cyan-400 motion-safe:animate-pulse" />
        Digital Transformation · SaaS · AI · Automation
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-gray-800/80 bg-[#0B0F19]/80 py-4 backdrop-blur-md' : 'bg-transparent py-6'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <a href="#" className="group flex items-center gap-3" aria-label="Shaikh Abdul Aleem portfolio home">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 text-lg font-black text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]">
              SH
            </div>
            <div className="flex flex-col">
              <span className="font-bold leading-none tracking-tight text-white">Shaikh</span>
              <span className="mt-1 text-[10px] uppercase tracking-widest text-gray-400">Digital Transformation</span>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-gray-300 md:flex" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} className="group relative py-1 transition-colors hover:text-cyan-400">
                {item.label}
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-cyan-400 transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href="#contact" className="relative hidden overflow-hidden rounded-lg border border-cyan-500/30 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 sm:block group">
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 transition-opacity group-hover:opacity-0" />
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative z-10">Start a Project</span>
            </a>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-700 text-gray-200 md:hidden"
            >
              <span aria-hidden="true" className="text-2xl leading-none">{menuOpen ? '×' : '☰'}</span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-navigation" className="mt-4 border-t border-gray-800/80 bg-[#0B0F19]/95 px-6 py-4 md:hidden" aria-label="Mobile navigation">
            <div className="mx-auto grid max-w-7xl gap-2">
              {NAV_ITEMS.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm text-gray-200 hover:bg-cyan-500/10 hover:text-cyan-300">
                  {item.label}
                </a>
              ))}
              <a href="#contact" onClick={() => setMenuOpen(false)} className="mt-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-3 text-center text-sm font-semibold text-white">Start a Project</a>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
