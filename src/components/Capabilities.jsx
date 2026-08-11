import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { PORTFOLIO_SERVICES } from '../data/portfolioExperience';
import { openPortfolioChat } from './PortfolioChat';

const desktopNodes = {
  saas: 'left-[40%] top-0',
  ai: 'right-0 top-[24%]',
  automation: 'right-[8%] bottom-[4%]',
  bi: 'left-[8%] bottom-[2%]',
  delivery: 'left-0 top-[27%]'
};

const connectors = {
  saas: 'w-[190px] -rotate-90',
  ai: 'w-[205px] -rotate-[27deg]',
  automation: 'w-[205px] rotate-[38deg]',
  bi: 'w-[205px] rotate-[142deg]',
  delivery: 'w-[210px] rotate-[202deg]'
};

function ServiceDetail({ service }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={service.id}
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.28 }}
        className="relative border-l-2 pl-6 md:pl-8"
        style={{ borderColor: service.color }}
        aria-live="polite"
      >
        <span className="absolute -left-[5px] top-0 w-2 h-2 rounded-full" style={{ backgroundColor: service.color, boxShadow: `0 0 16px ${service.color}` }} />
        <span className="text-[10px] font-mono tracking-[0.24em] text-gray-500">SIGNAL // {service.code}</span>
        <h3 className="text-2xl md:text-3xl font-black text-white mt-3">{service.title}</h3>
        <p className="text-sm font-medium mt-2" style={{ color: service.color }}>{service.short}</p>
        <p className="text-sm text-gray-400 leading-relaxed mt-5">{service.description}</p>
        <div className="mt-7">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-600">Typical outcomes</span>
          <p className="text-xs text-gray-300 leading-7 mt-2">{service.examples.join('  /  ')}</p>
        </div>
        <button
          type="button"
          onClick={() => openPortfolioChat(service.id)}
          className="group mt-8 inline-flex items-center gap-3 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          <span className="w-9 h-9 rounded-full border flex items-center justify-center transition-transform group-hover:scale-110" style={{ borderColor: `${service.color}80`, color: service.color }}>+</span>
          Tell the assistant about this project
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Capabilities() {
  const [activeId, setActiveId] = useState(PORTFOLIO_SERVICES[0].id);
  const activeService = PORTFOLIO_SERVICES.find((service) => service.id === activeId) || PORTFOLIO_SERVICES[0];

  return (
    <section id="services" className="relative max-w-7xl mx-auto px-6 py-24 border-t border-gray-900/80 scroll-mt-24">
      <SectionHeader
        kicker="Core Expertise"
        title="Route the need to"
        highlight="the right signal."
        sub="Select the business need closest to yours. The network will isolate the capability and show how it can move forward."
      />

      <div className="hidden md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(330px,0.85fr)] gap-16 items-center min-h-[560px]">
        <div className="relative h-[520px]" aria-label="Interactive service network">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {PORTFOLIO_SERVICES.map((service) => (
              <div
                key={service.id}
                className={`absolute left-0 top-0 h-px origin-left transition-all duration-500 ${connectors[service.id]}`}
                style={{
                  background: activeId === service.id
                    ? `linear-gradient(90deg, ${service.color}, ${service.color}55, transparent)`
                    : 'linear-gradient(90deg, rgba(71,85,105,0.45), transparent)',
                  boxShadow: activeId === service.id ? `0 0 12px ${service.color}66` : 'none'
                }}
              >
                {activeId === service.id && (
                  <motion.span
                    className="absolute -top-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: service.color, boxShadow: `0 0 14px ${service.color}` }}
                    animate={{ left: ['0%', '88%'], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </div>
            ))}

            <div className="relative -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-cyan-500/25 bg-[#0B0F19]/95 flex flex-col items-center justify-center text-center shadow-[0_0_70px_rgba(34,211,238,0.1)]">
              <div className="absolute inset-3 rounded-full border border-dashed border-purple-400/15 animate-[spin_9s_linear_infinite]" />
              <span className="relative text-[9px] font-mono tracking-[0.18em] text-gray-500">ROUTER CORE</span>
              <span className="relative text-base font-black text-white mt-2 leading-tight">YOUR<br />BUSINESS NEED</span>
              <span className="relative w-2 h-2 rounded-full bg-cyan-300 mt-3 animate-pulse shadow-[0_0_14px_#67e8f9]" />
            </div>
          </div>

          {PORTFOLIO_SERVICES.map((service) => {
            const active = activeId === service.id;
            return (
              <button
                key={service.id}
                type="button"
                data-testid={`service-node-${service.id}`}
                aria-pressed={active}
                onClick={() => setActiveId(service.id)}
                onMouseEnter={() => setActiveId(service.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveId(service.id);
                  }
                }}
                className={`absolute ${desktopNodes[service.id]} group flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 rounded-full`}
              >
                <span
                  className="relative w-14 h-14 rounded-full border flex items-center justify-center font-mono text-xs transition-all duration-300"
                  style={{
                    borderColor: active ? service.color : '#334155',
                    color: active ? service.color : '#64748b',
                    backgroundColor: active ? `${service.color}14` : '#0B0F19',
                    boxShadow: active ? `0 0 28px ${service.color}33` : 'none'
                  }}
                >
                  {service.code}
                  <span className="absolute -right-1 top-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: active ? service.color : '#334155' }} />
                </span>
                <span>
                  <span className={`block text-xs font-bold transition-colors ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>{service.title}</span>
                  <span className="block text-[9px] font-mono tracking-wider text-gray-700 mt-1">SELECT SIGNAL</span>
                </span>
              </button>
            );
          })}
        </div>

        <ServiceDetail service={activeService} />
      </div>

      <div className="md:hidden">
        <div className="relative border-l border-cyan-500/20 ml-4 pl-7 space-y-7">
          {PORTFOLIO_SERVICES.map((service) => {
            const active = activeId === service.id;
            return (
              <button
                key={service.id}
                type="button"
                data-testid={`service-node-mobile-${service.id}`}
                aria-pressed={active}
                onClick={() => setActiveId(service.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveId(service.id);
                  }
                }}
                className="relative block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <span
                  className="absolute -left-[34px] top-1 w-3 h-3 rounded-full border-2 border-[#0B0F19] transition-all"
                  style={{ backgroundColor: active ? service.color : '#334155', boxShadow: active ? `0 0 14px ${service.color}` : 'none' }}
                />
                <span className="text-[9px] font-mono text-gray-600">{service.code}</span>
                <span className={`block text-sm font-bold mt-0.5 ${active ? 'text-white' : 'text-gray-500'}`}>{service.title}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-12">
          <ServiceDetail service={activeService} />
        </div>
      </div>
    </section>
  );
}
