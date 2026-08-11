import React from 'react';
import SectionHeader from './SectionHeader';
import { caseStudies } from '../data/caseStudies';

function ProjectVisualPlaceholder({ study }) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-cyan-500/15 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.12),transparent_34%),radial-gradient(circle_at_82%_82%,rgba(192,132,252,0.12),transparent_38%),#090E1B]">
      <div className="absolute inset-5 rounded-lg border border-dashed border-gray-700/80" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-cyan-300">Project visual space</span>
        <span className="mt-2 text-xs text-gray-500">A project screenshot will be added here.</span>
      </div>
      <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-[#0B0F19]/80 px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider text-gray-400">{study.tag}</span>
    </div>
  );
}

export default function CaseStudyPreview() {
  return (
    <section id="selected-work" className="relative border-t border-gray-900/80 bg-[#080C16]/65 py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          kicker="Selected Work"
          kickerColor="text-cyan-400"
          title="Documented work for"
          highlight="real operations."
          sub="A clear view of the business challenge, the system approach, and the documented outcome behind each project."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <article key={study.id} className="flex h-full flex-col rounded-2xl border border-gray-800 bg-[#0E1321]/70 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
              <ProjectVisualPlaceholder study={study} />
              <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
                <h3 className="text-xl font-bold text-white">{study.title}</h3>
                <dl className="mt-5 space-y-4 text-sm leading-relaxed">
                  <div>
                    <dt className="text-[10px] font-mono uppercase tracking-[0.18em] text-purple-300">Challenge</dt>
                    <dd className="mt-1 text-gray-400">{study.challenge}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-300">Approach</dt>
                    <dd className="mt-1 text-gray-300">{study.solution}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-300">Documented outcome</dt>
                    <dd className="mt-1 text-gray-300">{study.outcome}</dd>
                  </div>
                </dl>
                <a href="#case-studies" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-100">
                  Explore case-study details <span aria-hidden="true" className="ml-2">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
