import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { DELIVERY_STEPS } from '../data/portfolioExperience';

const steps = DELIVERY_STEPS.map((title, index) => ({ id: String(index + 1).padStart(2, '0'), title }));

/* axon geometry: six synapses along one undulating nerve fiber */
const NODES = [
  [70, 80],
  [286, 140],
  [502, 80],
  [718, 140],
  [934, 80],
  [1150, 140]
];
let AXON_D = `M ${NODES[0][0]} ${NODES[0][1]}`;
for (let i = 1; i < NODES.length; i++) {
  const [x1, y1] = NODES[i - 1];
  const [x2, y2] = NODES[i];
  AXON_D += ` C ${x1 + 110} ${y1}, ${x2 - 110} ${y2}, ${x2} ${y2}`;
}

export default function DeliveryProcess() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="process" className="relative bg-[#070A12]/70 py-24 border-y border-gray-900/80 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          kicker="How I Work"
          kickerColor="text-purple-400"
          title="From first conversation to"
          highlight="handover."
          sub="A clear delivery process that moves from understanding the need to testing, handover, and support."
          center
        />

        {/* desktop: the axon */}
        <div className="hidden md:block relative">
          <svg
            viewBox="0 0 1220 220"
            className="w-full"
            style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.35))' }}
          >
            <defs>
              <linearGradient id="axonGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="55%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>

            {/* nerve fiber */}
            <path d={AXON_D} fill="none" stroke="url(#axonGrad)" strokeWidth="1.6" opacity="0.7" />
            <path d={AXON_D} fill="none" stroke="url(#axonGrad)" strokeWidth="6" opacity="0.08" />

            {/* synapses */}
            {NODES.map(([x, y], i) => {
              const above = y < 110;
              return (
                <g key={i}>
                  {/* dendrite decorations */}
                  <line x1={x} y1={y} x2={x - 14} y2={above ? y + 22 : y - 22} stroke="#38bdf8" strokeWidth="0.7" opacity="0.35" />
                  <line x1={x} y1={y} x2={x + 16} y2={above ? y + 18 : y - 18} stroke="#38bdf8" strokeWidth="0.7" opacity="0.35" />
                  <circle cx={x - 14} cy={above ? y + 22 : y - 22} r="1.6" fill="#38bdf8" opacity="0.5" />
                  <circle cx={x + 16} cy={above ? y + 18 : y - 18} r="1.6" fill="#38bdf8" opacity="0.5" />

                  <circle cx={x} cy={y} r="13" fill="#0B0F19" stroke="url(#axonGrad)" strokeWidth="1.4" />
                  <circle cx={x} cy={y} r="4.5" fill="#67e8f9">
                    {!reduceMotion && <animate attributeName="opacity" values="0.5;1;0.5" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />}
                  </circle>

                  <text
                    x={x}
                    y={above ? y - 34 : y + 44}
                    textAnchor="middle"
                    fill="#c084fc"
                    fontSize="11"
                    fontFamily="ui-monospace, monospace"
                    fontWeight="bold"
                  >
                    {steps[i].id}
                  </text>
                  <text
                    x={x}
                    y={above ? y - 20 : y + 58}
                    textAnchor="middle"
                    fill="#e2e8f0"
                    fontSize="12.5"
                    fontWeight="600"
                  >
                    {steps[i].title}
                  </text>
                </g>
              );
            })}

            {/* traveling signals */}
            {!reduceMotion && (
              <>
                <circle r="5" fill="#e0f2fe">
                  <animateMotion dur="7s" repeatCount="indefinite" path={AXON_D} />
                  <animate attributeName="opacity" values="1;0.6;1" dur="0.6s" repeatCount="indefinite" />
                </circle>
                <circle r="3" fill="#f0abfc" opacity="0.85">
                  <animateMotion dur="7s" begin="3.5s" repeatCount="indefinite" path={AXON_D} />
                </circle>
              </>
            )}
          </svg>
        </div>

        {/* mobile: vertical nerve */}
        <div className="md:hidden relative pl-8">
          <div className="absolute left-[9px] top-1 bottom-1 w-px bg-gradient-to-b from-cyan-400/60 via-blue-400/40 to-purple-400/60" />
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.id} className="relative">
                <span className="absolute -left-8 top-0.5 w-[19px] h-[19px] rounded-full bg-[#0B0F19] border border-cyan-400/60 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 motion-safe:animate-pulse" />
                </span>
                <span className="block font-mono text-[10px] text-purple-400 font-bold">{step.id}</span>
                <span className="text-sm font-semibold text-gray-200">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables Shelf */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 bg-gradient-to-r from-gray-950/80 via-[#0C101E]/80 to-gray-950/80 rounded-2xl border border-cyan-900/30 p-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-sm font-mono tracking-wider uppercase text-cyan-400 font-bold mb-1">
                Typical Deliverables
              </h3>
              <p className="text-xs text-gray-400">Strategic engineering artifacts delivered across engagement lifecycles.</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {['Workflow map', 'Requirements & roles', 'KPI structure', 'Automation plan', 'Testing & handover'].map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 bg-gray-900/90 border border-gray-800 text-xs font-medium text-gray-300 rounded-md hover:border-cyan-500/40 transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
