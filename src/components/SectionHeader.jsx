import React from 'react';

/* Shared section header so every section speaks the hero's visual language. */
export default function SectionHeader({ kicker, kickerColor = 'text-cyan-400', title, highlight, sub, center = false }) {
  return (
    <div className={`mb-14 ${center ? 'text-center' : 'text-center md:text-left'}`}>
      <span className={`inline-flex items-center gap-2 text-[11px] uppercase font-mono tracking-[0.3em] ${kickerColor}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current motion-safe:animate-pulse" />
        {kicker}
      </span>
      <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-3">
        {title}
        {highlight && (
          <>
            {' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
              {highlight}
            </span>
          </>
        )}
      </h2>
      {sub && (
        <p className={`text-sm text-gray-400 mt-3 max-w-xl font-light leading-relaxed ${center ? 'mx-auto' : ''}`}>
          {sub}
        </p>
      )}
    </div>
  );
}
