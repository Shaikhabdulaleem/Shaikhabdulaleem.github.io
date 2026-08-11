import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 md:py-32 grid md:grid-cols-12 gap-12 items-center">
      <div className="md:col-span-7 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Smart digital systems for <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">growing businesses.</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl font-light leading-relaxed">
            SaaS product planning, AI implementation, workflow automation, business intelligence dashboards, and structured project delivery.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="p-5 rounded-xl border border-gray-800 bg-[#0F1422]/60 backdrop-blur-sm border-l-4 border-l-cyan-400 max-w-2xl"
        >
          <p className="text-sm text-gray-300 leading-relaxed font-medium">
            "Turn manual, scattered, and difficult-to-track processes into structured digital systems that are easier to manage, measure, and scale."
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-wrap items-center gap-4"
        >
          <a href="#case-studies" className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-[0_4px_20px_rgba(6,182,212,0.25)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.45)] hover:scale-[1.02] transition-all">
            Explore Case Studies
          </a>
          <a href="#contact" className="px-6 py-3.5 bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:border-gray-700 rounded-xl text-sm font-medium transition-all">
            Discuss Your Workflow
          </a>
        </motion.div>
      </div>

      {/* Metric Dashboard Box Component */}
      <div className="md:col-span-5 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="w-full bg-[#0E1321]/90 rounded-2xl border border-gray-800/80 p-6 shadow-2xl relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-500"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400">Sample Business Command Center</span>
            </div>
            <span className="text-[10px] bg-cyan-950 text-cyan-400 font-mono px-2 py-0.5 rounded border border-cyan-500/20">LIVE METRICS</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { label: 'Revenue View', val: '$142.8K', color: 'text-emerald-400', sub: 'Live Stream' },
              { label: 'AI Support', val: '98.4%', color: 'text-cyan-400', sub: 'Active Model' },
              { label: 'Workflows', val: '41 active', color: 'text-purple-400', sub: 'Automated' },
              { label: 'Projects', val: '100%', color: 'text-blue-400', sub: 'On track' }
            ].map((stat, idx) => (
              <div key={idx} className="p-3.5 bg-[#141B2D]/60 rounded-xl border border-gray-800/50">
                <span className="text-xs text-gray-500 block">{stat.label}</span>
                <span className={`text-xl font-bold tracking-tight block my-0.5 ${stat.color}`}>{stat.val}</span>
                <span className="text-[10px] text-gray-400 font-mono">{stat.sub}</span>
              </div>
            ))}
          </div>

          {/* Trend Micro-graph Canvas simulation */}
          <div className="h-16 w-full mt-2 relative">
            <svg viewBox="0 0 300 60" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M 0 45 Q 30 20 60 38 T 120 15 T 180 40 T 240 10 T 300 5" fill="none" stroke="url(#sparklineGrad)" strokeWidth="12" />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d="M 0 45 Q 30 20 60 38 T 120 15 T 180 40 T 240 10 T 300 5"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="300" cy="5" r="3.5" fill="#06b6d4" className="animate-pulse" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
