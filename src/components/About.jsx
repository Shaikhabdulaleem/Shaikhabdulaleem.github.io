import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SectionHeader from './SectionHeader';

const signals = [
  {
    label: 'BUSINESS',
    detail: 'Understand the operation',
    color: '#22d3ee',
    position: 'left-0 top-8 md:left-3 md:top-10',
    line: 'left-[26%] top-[27%] w-[30%] rotate-[24deg]'
  },
  {
    label: 'TECHNOLOGY',
    detail: 'Design the right system',
    color: '#c084fc',
    position: 'right-0 top-4 md:right-2 md:top-8',
    line: 'left-[52%] top-[27%] w-[29%] -rotate-[28deg]'
  },
  {
    label: 'DELIVERY',
    detail: 'Move it into reality',
    color: '#34d399',
    position: 'left-[8%] bottom-2 md:left-[12%] md:bottom-6',
    line: 'left-[28%] top-[68%] w-[29%] -rotate-[28deg]'
  }
];

export default function About() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="about" className="relative max-w-7xl mx-auto px-6 py-24 overflow-hidden">
      <div className="grid lg:grid-cols-12 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6"
        >
          <SectionHeader
            kicker="About Shaikh"
            title="Systems built around"
            highlight="the business."
          />
          <div className="space-y-5 text-sm text-gray-300 font-light leading-relaxed max-w-2xl -mt-6">
            <p>
              I'm <span className="text-white font-medium">Shaikh Abdul Aleem</span>, a digital transformation
              consultant who turns business needs into clear system requirements and practical delivery plans.
            </p>
            <p>
              I begin with how the work happens today, identify where it slows down, then design a practical path
              forward with the right people, process, and technology in mind.
            </p>
            <p className="border-l border-cyan-400/50 pl-4 text-cyan-100/80">
              Every engagement connects three essentials: what the business needs, what the system must do, and how the team will use it.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="lg:col-span-6 relative min-h-[360px] md:min-h-[420px]"
          aria-label="Business, technology, and delivery converge into one system-building approach"
        >
          <div className="absolute inset-[14%] rounded-full border border-cyan-500/10 motion-safe:animate-[spin_12s_linear_infinite]" />
          <div className="absolute inset-[23%] rounded-full border border-dashed border-purple-500/15 motion-safe:animate-[spin_9s_linear_infinite_reverse]" />

          {signals.map((signal, index) => (
            <React.Fragment key={signal.label}>
              <div
                className={`absolute h-px origin-left ${signal.line}`}
                style={{ background: `linear-gradient(90deg, transparent, ${signal.color}, transparent)` }}
              >
                <span
                  className="absolute left-1/2 -top-1 w-2 h-2 rounded-full motion-safe:animate-pulse"
                  style={{ backgroundColor: signal.color, boxShadow: `0 0 14px ${signal.color}` }}
                />
              </div>
              <motion.div
                className={`absolute ${signal.position} max-w-[150px]`}
                animate={reduceMotion ? undefined : { y: [0, index % 2 === 0 ? -5 : 5, 0] }}
                transition={reduceMotion ? undefined : { duration: 2.8 + index * 0.35, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: signal.color, boxShadow: `0 0 12px ${signal.color}` }} />
                  <span className="text-[10px] font-mono tracking-[0.22em]" style={{ color: signal.color }}>{signal.label}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed pl-4">{signal.detail}</p>
              </motion.div>
            </React.Fragment>
          ))}

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="absolute w-44 h-44 rounded-full bg-cyan-500/5 blur-2xl motion-safe:animate-pulse" />
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border border-cyan-400/30 bg-[#0B0F19]/90 flex flex-col items-center justify-center text-center shadow-[0_0_55px_rgba(34,211,238,0.12)]">
              <span className="text-[10px] font-mono tracking-[0.2em] text-gray-500">WORKING APPROACH</span>
              <span className="text-lg md:text-xl font-black text-white mt-2 leading-tight">SYSTEM<br />BUILDER</span>
              <span className="w-8 h-px bg-gradient-to-r from-cyan-400 to-purple-400 mt-3" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
