import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { TOOLKIT_CATEGORIES } from '../data/portfolioExperience';

const CATEGORY_STYLES = [
  {
    color: 'cyan',
    border: 'hover:border-cyan-500/40',
    hub: 'bg-cyan-400',
    glow: 'rgba(34,211,238,0.5)',
  },
  {
    color: 'purple',
    border: 'hover:border-purple-500/40',
    hub: 'bg-purple-400',
    glow: 'rgba(167,139,250,0.5)',
  },
  {
    color: 'pink',
    border: 'hover:border-pink-500/40',
    hub: 'bg-pink-400',
    glow: 'rgba(244,114,182,0.5)',
  },
  {
    color: 'amber',
    border: 'hover:border-amber-500/40',
    hub: 'bg-amber-400',
    glow: 'rgba(251,191,36,0.5)',
  },
  {
    color: 'sky',
    border: 'hover:border-sky-500/40',
    hub: 'bg-sky-400',
    glow: 'rgba(56,189,248,0.5)',
  },
];

const CATEGORIES = TOOLKIT_CATEGORIES.map((category, index) => ({ ...category, ...CATEGORY_STYLES[index] }));

export default function Toolkit() {
  return (
    <section id="toolkit" className="relative max-w-7xl mx-auto px-6 py-24 border-t border-gray-900/80">
      <SectionHeader
        kicker="Toolkit"
        title="Tools chosen for"
        highlight="the job."
        sub="A practical toolkit for product planning, automation, AI, analytics, and delivery."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat, ci) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: ci * 0.07 }}
            className={`group relative p-6 bg-[#0E1321]/70 backdrop-blur-sm rounded-2xl border border-gray-800 ${cat.border} transition-all duration-300`}
          >
            {/* hub dot */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className={`w-3 h-3 rounded-full ${cat.hub} motion-safe:animate-pulse flex-shrink-0`}
                style={{ boxShadow: `0 0 10px ${cat.glow}` }}
              />
              <span className="text-xs font-mono uppercase tracking-widest text-gray-400 font-bold">
                {cat.label}
              </span>
            </div>

            {/* wired tool nodes */}
            <ul className="space-y-2">
              {cat.tools.map((tool) => (
                <li key={tool} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <span className="text-gray-600 font-mono text-xs select-none">—•</span>
                  {tool}
                </li>
              ))}
            </ul>

            {/* corner radial glow on hover */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 0% 0%, ${cat.glow.replace('0.5', '0.06')} 0%, transparent 65%)`
              }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
