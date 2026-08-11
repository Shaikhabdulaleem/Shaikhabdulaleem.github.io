import React from 'react';
import SectionHeader from './SectionHeader';

const questions = [
  {
    question: 'What can we discuss in a first conversation?',
    answer: 'A manual process, a digital product idea, an AI use case, a reporting need, an automation opportunity, or a delivery blocker. The goal is to establish useful business context before choosing the next step.'
  },
  {
    question: 'What should I prepare before getting in touch?',
    answer: 'A short description of what happens today, where work slows down, who is involved, the tools or information already in use, and what improvement would matter most.'
  },
  {
    question: 'Can we discuss an existing digital project?',
    answer: 'Yes. The documented delivery approach covers requirements, scope, roles, testing, coordination, and handover for projects that need more structure.'
  },
];

export default function ClientFAQ() {
  return (
    <section id="faq" className="relative border-t border-gray-900/80 py-24 scroll-mt-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeader
          kicker="Client FAQ"
          kickerColor="text-emerald-400"
          title="Questions answered"
          highlight="before the first call."
          sub="A clear starting point for clients who are still defining the right digital solution."
          center
        />
        <div className="mt-12 space-y-3">
          {questions.map((item) => (
            <details key={item.question} className="group rounded-xl border border-gray-800 bg-[#0E1321]/70 px-5">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold text-white marker:content-none">
                {item.question}
                <span aria-hidden="true" className="text-xl text-cyan-300 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="border-t border-gray-800 pb-5 pt-4 text-sm leading-relaxed text-gray-400">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
