import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { BOOKING_URL, buildWhatsAppUrl } from '../data/portfolioExperience';
import { openPortfolioChat } from './PortfolioChat';

const DIRECT_WHATSAPP_URL = buildWhatsAppUrl(
  "Hi Shaikh, I found your portfolio and would like to discuss a digital project with you."
);

const handoffSteps = [
  {
    code: '01',
    label: 'SHAPE THE SIGNAL',
    title: 'Describe the project',
    detail: 'Let the assistant ask the right questions and turn the idea into a useful brief.',
    color: '#22d3ee',
    action: 'Start project chat',
    type: 'chat'
  },
  {
    code: '02',
    label: 'GO HUMAN',
    title: 'Continue on WhatsApp',
    detail: 'Move into a live conversation with Shaikh when you are ready to discuss the work.',
    color: '#34d399',
    action: 'Open WhatsApp',
    type: 'whatsapp'
  },
  {
    code: '03',
    label: 'LOCK THE TIME',
    title: 'Book a discovery call',
    detail: 'Choose a Google Meet slot shown in your own timezone.',
    color: '#c084fc',
    action: 'View available times',
    type: 'calendar'
  }
];

function StepAction({ step }) {
  const classes = 'group inline-flex items-center gap-3 mt-6 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300';
  const content = (
    <>
      <span className="w-9 h-9 rounded-full border flex items-center justify-center transition-all group-hover:scale-110" style={{ borderColor: `${step.color}80`, color: step.color }}>+</span>
      {step.action}
    </>
  );

  if (step.type === 'chat') {
    return <button type="button" onClick={() => openPortfolioChat()} className={classes}>{content}</button>;
  }

  return (
    <a
      href={step.type === 'whatsapp' ? DIRECT_WHATSAPP_URL : BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={classes}
    >
      {content}
    </a>
  );
}

export default function Contact() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="contact" className="relative bg-[#070A12]/75 py-24 border-t border-gray-900/80 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-64 bg-cyan-500/5 blur-[110px] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6">
        <SectionHeader
          kicker="Handoff Station"
          kickerColor="text-purple-400"
          title="From project signal to"
          highlight="human conversation."
          sub="Start with clarity, continue live, or reserve focused time. Choose the route that fits where you are now."
          center
        />

        <div className="relative mt-20">
          <div className="hidden md:block absolute left-[12%] right-[12%] top-10 h-px bg-gradient-to-r from-cyan-500/20 via-emerald-400/50 to-purple-500/20">
            <motion.span
              className="absolute -top-1 w-2 h-2 rounded-full bg-white shadow-[0_0_16px_#67e8f9]"
              animate={reduceMotion ? { left: '50%', opacity: 0.7 } : { left: ['0%', '99%'], opacity: [0, 1, 1, 0] }}
              transition={reduceMotion ? { duration: 0 } : { duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {handoffSteps.map((step, index) => (
              <motion.div
                key={step.code}
                id={step.type === 'calendar' ? 'calendar' : undefined}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="relative scroll-mt-28 md:text-center"
              >
                <div className="flex md:flex-col items-start md:items-center gap-5 md:gap-0">
                  <div
                    className="relative shrink-0 w-20 h-20 rounded-full border bg-[#0B0F19] flex items-center justify-center font-mono text-sm z-10"
                    style={{ borderColor: `${step.color}80`, color: step.color, boxShadow: `0 0 30px ${step.color}18` }}
                  >
                    <span className="absolute inset-2 rounded-full border border-dashed opacity-30 motion-safe:animate-[spin_8s_linear_infinite]" style={{ borderColor: step.color }} />
                    {step.code}
                  </div>
                  <div className="md:mt-7">
                    <span className="text-[9px] font-mono tracking-[0.25em]" style={{ color: step.color }}>{step.label}</span>
                    <h3 className="text-xl font-bold text-white mt-2">{step.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mt-3 max-w-xs md:mx-auto">{step.detail}</p>
                    <StepAction step={step} />
                  </div>
                </div>
                {index < handoffSteps.length - 1 && (
                  <div className="md:hidden ml-10 h-10 w-px bg-gradient-to-b from-gray-700 to-transparent mt-4" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-gray-900 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.24em] text-gray-600">DISCOVERY SESSION</span>
            <div className="flex items-end gap-3 mt-2">
              <span className="text-5xl md:text-6xl font-black tracking-tighter text-white">BOOK</span>
              <span className="pb-2 text-sm font-mono text-purple-300">GOOGLE MEET</span>
            </div>
          </div>
          <div className="md:text-right max-w-sm">
            <p className="text-sm text-gray-400 leading-relaxed">The booking page shows live availability in your timezone and automatically protects times already busy on the connected calendar.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
