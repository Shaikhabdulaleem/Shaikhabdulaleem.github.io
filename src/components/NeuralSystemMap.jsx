import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const caseStudies = [
  {
    id: 1,
    title: 'Valuation Management Modules',
    tag: 'Valuation Technology',
    challenge: 'Multiple valuation categories relied on repeated proposal preparation, manual formatting, and disconnected review steps.',
    solution: 'A structured system covering the journey from proposal creation and category-specific data capture through internal review and final TAQEEM approval report preparation.',
    workflow: ['Client request', 'Proposal', 'Valuation', 'Review', 'Final report'],
    outcome: 'Improved process control, reduced repeated report preparation, and created a scalable valuation workflow.'
  },
  {
    id: 2,
    title: 'AI Chatbot & Equipment Management',
    tag: 'AI & Operations',
    challenge: 'Customer inquiries, equipment availability, proposal preparation, and sales reporting lived across separate manual processes.',
    solution: 'An AI-supported operating flow connecting guided customer assistance, equipment schedules, reusable proposal layouts, and management dashboards.',
    workflow: ['Inquiry', 'AI guidance', 'Schedule', 'Proposal', 'Dashboard'],
    outcome: 'Improved support responsiveness, equipment planning, proposal consistency, and management visibility.'
  },
  {
    id: 3,
    title: 'Field Tracker System',
    tag: 'Field Operations',
    challenge: 'Managers needed to plan daily surveys across cities and districts while tracking drivers, coverage, finance, delays, and completion.',
    solution: 'A field operations system for area planning, driver assignments, daily task tracking, route progress, finance visibility, and KPI reporting.',
    workflow: ['Define area', 'Estimate scope', 'Assign drivers', 'Track progress', 'Review KPIs'],
    outcome: 'Improved field visibility, driver planning, survey completion tracking, and operational reporting.'
  }
];

export default function NeuralSystemMap() {
  const [systemState, setSystemState] = useState(1);
  const [activeStudy, setActiveStudy] = useState(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = 450);

    const nodes = [];
    const nodeCount = 55;

    for (let i = 0; i < nodeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 60 + Math.random() * 80;
      nodes.push({
        baseX: width / 2 + Math.cos(angle) * radius,
        baseY: height / 2 + Math.sin(angle) * radius * 0.8,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius * 0.8,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    let pulseTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      pulseTime += systemState === 2 ? 0.3 : 0.03;

      nodes.forEach((n) => {
        if (systemState === 1) {
          n.x += n.vx;
          n.y += n.vy;
          const dist = Math.hypot(n.x - (width / 2), n.y - (height / 2));
          if (dist > 150) {
            n.vx *= -1;
            n.vy *= -1;
          }
        } else if (systemState >= 3) {
          const targetX = n.baseX + (n.baseX > width / 2 ? 140 : -140);
          n.x += (targetX - n.x) * 0.1;
        }

        nodes.forEach((target) => {
          const distance = Math.hypot(target.x - n.x, target.y - n.y);
          if (distance < 75) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(target.x, target.y);

            if (systemState === 2) {
              ctx.strokeStyle = `rgba(34, 211, 238, ${1 - distance / 75})`;
              ctx.lineWidth = 1.8;
            } else {
              ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - distance / 75) * 0.25})`;
              ctx.lineWidth = 0.8;
            }
            ctx.stroke();
          }
        });

        ctx.beginPath();
        const nodePulse = systemState === 2 ? 4 : 2 + Math.sin(pulseTime + n.pulseOffset) * 1;
        ctx.arc(n.x, n.y, nodePulse, 0, Math.PI * 2);
        ctx.fillStyle = systemState === 2 ? '#22d3ee' : '#a78bfa';
        ctx.shadowBlur = systemState === 2 ? 15 : 0;
        ctx.shadowColor = '#22d3ee';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [systemState]);

  const triggerNeuralTrigger = () => {
    if (systemState !== 1) return;
    setSystemState(2);
    setTimeout(() => {
      setSystemState(3);
    }, 1200);
  };

  const handleBrainBlast = (study) => {
    setActiveStudy(study);
    setSystemState(4);
  };

  const resetNeuralMap = () => {
    setSystemState(1);
    setActiveStudy(null);
  };

  return (
    <section id="case-studies" className="max-w-7xl mx-auto px-6 py-24 min-h-[700px] flex flex-col justify-center relative">
      <div className="text-center mb-10">
        <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">Interactive Canvas Engine</span>
        <h2 className="text-3xl font-bold tracking-tight text-white mt-1">Neural System Map</h2>
        <p className="text-xs text-gray-400 max-w-md mx-auto mt-2">Initialize the system map core engine to decompose unstructured client processes into architectural modules.</p>
      </div>

      <div className="relative w-full border border-gray-800/80 bg-[#0A0D16] rounded-2xl overflow-hidden min-h-[480px] flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {systemState === 1 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 backdrop-blur-[2px] cursor-pointer group" onClick={triggerNeuralTrigger}>
            <div className="px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-xs font-mono text-cyan-300 animate-pulse tracking-wide group-hover:border-cyan-400 transition-colors">
              Click to Explore Systems
            </div>
          </div>
        )}

        {systemState === 2 && (
          <div className="absolute text-center">
            <span className="text-xs font-mono tracking-widest text-cyan-400 block animate-bounce">PROCESSING STREAMS...</span>
            <span className="text-[10px] font-mono text-gray-500 block mt-1">CIRCULATING SYSTEM ENERGY CHANNELS</span>
          </div>
        )}

        {systemState === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 grid md:grid-cols-3 gap-6 p-8 items-center z-20 bg-slate-950/30 backdrop-blur-sm">
            {caseStudies.map((study, idx) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, type: 'spring', stiffness: 100 }}
                onClick={() => handleBrainBlast(study)}
                className="cursor-pointer group border border-cyan-500/20 bg-slate-900/90 hover:bg-[#0F1526] hover:border-cyan-400/80 p-5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col justify-between h-48 relative overflow-hidden"
              >
                <div className="absolute -right-4 -bottom-4 w-16 h-16 border border-dashed border-gray-800 rounded-full group-hover:border-cyan-500/20 transition-colors" />
                <div className="absolute right-2 top-2 font-mono text-[9px] text-gray-600 tracking-tight">ENG // 0{study.id}</div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-purple-400 block mb-1 tracking-wider">{study.tag}</span>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight line-clamp-2">{study.title}</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono font-medium pt-4 border-t border-gray-800/80">
                  <span>Burst Engine</span>
                  <span className="group-hover:translate-x-1 transition-transform">➔</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <AnimatePresence>
          {systemState === 4 && activeStudy && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute inset-0 z-30 bg-[#080B13] p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
                  <div>
                    <span className="text-xs font-mono uppercase text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-900/50">{activeStudy.tag}</span>
                    <h3 className="text-xl font-bold text-white mt-2">{activeStudy.title}</h3>
                  </div>
                  <button onClick={resetNeuralMap} className="p-2 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white rounded-lg text-xs font-mono transition-colors">
                    ✕ Clear Filter
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-900/60 rounded-xl border border-gray-800/60">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-purple-400 mb-1">Challenge</h4>
                      <p className="text-xs text-gray-300 leading-relaxed font-light">{activeStudy.challenge}</p>
                    </div>
                    <div className="p-4 bg-gray-900/60 rounded-xl border border-gray-800/60">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">Engineered Solution</h4>
                      <p className="text-xs text-gray-300 leading-relaxed font-light">{activeStudy.solution}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-900/60 rounded-xl border border-gray-800/60">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">Process Sequence Map</h4>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {activeStudy.workflow.map((node, stepIdx) => (
                          <React.Fragment key={stepIdx}>
                            <span className="text-[11px] font-mono bg-slate-950 px-2 py-1 border border-gray-800 rounded text-gray-300">{node}</span>
                            {stepIdx < activeStudy.workflow.length - 1 && <span className="text-gray-600 text-xs font-mono">→</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-cyan-950/20 to-transparent rounded-xl border border-cyan-900/30">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-300 mb-1">Quantifiable Outcome</h4>
                      <p className="text-xs text-cyan-100 leading-relaxed font-medium">{activeStudy.outcome}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-900 flex justify-end">
                <button onClick={resetNeuralMap} className="px-5 py-2 bg-gray-900 text-xs font-semibold text-gray-300 hover:text-white rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                  Return to Network View
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
