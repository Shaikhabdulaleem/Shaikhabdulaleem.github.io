import React from 'react';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-gray-800 bg-[#070A12]/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-black text-base shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              SH
            </div>
            <div>
              <span className="block font-bold tracking-tight text-white leading-none">Shaikh</span>
              <span className="block text-[10px] text-gray-500 tracking-widest uppercase mt-1">Digital Transformation</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 font-light leading-relaxed max-w-xs">
            Smart digital systems for growing businesses - SaaS planning, AI implementation, automation, and BI.
          </p>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block mb-4">Navigate</span>
          <ul className="space-y-2.5">
            {[
              ['Case Studies', '#case-studies'],
              ['About', '#about'],
              ['Services', '#services'],
              ['Toolkit', '#toolkit'],
              ['Contact', '#contact']
            ].map(([label, href]) => (
              <li key={href}>
                <a href={href} className="text-xs text-gray-400 hover:text-cyan-300 transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 block mb-4">Start a conversation</span>
          <p className="max-w-xs text-xs leading-relaxed text-gray-500">
            Use the project assistant to shape your need, then continue through WhatsApp or Google Calendar.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 motion-safe:animate-pulse" />
            <span className="text-[11px] text-gray-500">WhatsApp and Calendar contact routes</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col items-center gap-2 text-center sm:items-start sm:text-left lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[11px] text-gray-600">&copy; {new Date().getFullYear()} Shaikh Abdul Aleem. All rights reserved.</p>
          <p className="text-[10px] font-mono text-gray-700 tracking-widest">SIGNAL END / NEURAL ARCHIVE v1.0</p>
        </div>
      </div>
    </footer>
  );
}
