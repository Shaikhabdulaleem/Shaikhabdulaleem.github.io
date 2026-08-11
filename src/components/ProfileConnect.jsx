import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { SOCIAL_PROFILES } from '../data/portfolioExperience';

const POSES = {
  neutral: '/profile-connect/abdul-neutral.webp',
  upwork: '/profile-connect/abdul-upwork.webp',
  linkedin: '/profile-connect/abdul-linkedin.webp'
};

const POSE_MASKS = {
  neutral: [
    'radial-gradient(ellipse 24% 24% at 50% 17%, #000 0%, #000 62%, transparent 100%)',
    'radial-gradient(ellipse 45% 67% at 50% 70%, #000 0%, #000 62%, transparent 95%)'
  ].join(', '),
  upwork: [
    'radial-gradient(ellipse 24% 24% at 59% 17%, #000 0%, #000 62%, transparent 100%)',
    'radial-gradient(ellipse 44% 67% at 59% 70%, #000 0%, #000 62%, transparent 95%)',
    'radial-gradient(ellipse 24% 15% at 18% 40%, #000 0%, #000 58%, transparent 100%)',
    'radial-gradient(ellipse 21% 23% at 34% 54%, #000 0%, #000 56%, transparent 100%)'
  ].join(', '),
  linkedin: [
    'radial-gradient(ellipse 24% 24% at 45% 17%, #000 0%, #000 62%, transparent 100%)',
    'radial-gradient(ellipse 44% 67% at 43% 70%, #000 0%, #000 62%, transparent 95%)',
    'radial-gradient(ellipse 24% 15% at 84% 40%, #000 0%, #000 58%, transparent 100%)',
    'radial-gradient(ellipse 21% 23% at 70% 54%, #000 0%, #000 56%, transparent 100%)'
  ].join(', ')
};

function PlatformMark({ profile }) {
  if (profile.id === 'upwork') {
    return (
      <span
        aria-hidden="true"
        className="block w-20 sm:w-28 h-8 sm:h-10 bg-[#14a800]"
        style={{
          WebkitMask: `url(${profile.logo}) center / contain no-repeat`,
          mask: `url(${profile.logo}) center / contain no-repeat`
        }}
      />
    );
  }

  return (
    <img
      src={profile.logo}
      alt=""
      aria-hidden="true"
      className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
    />
  );
}

function PlatformNode({ profile, active, onActivate, onDeactivate, onTouchEnd }) {
  return (
    <motion.a
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={profile.accessibleName}
      data-profile={profile.id}
      onMouseEnter={() => onActivate(profile.pose)}
      onMouseLeave={onDeactivate}
      onPointerEnter={() => onActivate(profile.pose)}
      onPointerLeave={onDeactivate}
      onFocus={() => onActivate(profile.pose)}
      onBlur={onDeactivate}
      onPointerDown={(event) => {
        if (event.pointerType !== 'mouse') onActivate(profile.pose);
      }}
      onPointerUp={(event) => {
        if (event.pointerType !== 'mouse') onTouchEnd();
      }}
      onPointerCancel={onDeactivate}
      animate={{ y: active ? -8 : 0, scale: active ? 1.04 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group relative z-30 flex w-[8.5rem] sm:w-44 flex-col items-center justify-center focus-visible:outline-none"
    >
      <span
        className="absolute top-0 h-[8.5rem] w-[8.5rem] sm:h-44 sm:w-44 rounded-full border border-dashed opacity-40 motion-safe:animate-[spin_10s_linear_infinite]"
        style={{ borderColor: active ? profile.color : `${profile.color}70` }}
      />
      <span
        className="absolute top-3 h-[7rem] w-[7rem] sm:top-4 sm:h-36 sm:w-36 rounded-[38%] border rotate-6 transition-transform duration-300 group-hover:rotate-12 group-focus-visible:rotate-12"
        style={{ borderColor: `${profile.color}55`, boxShadow: active ? `0 0 48px ${profile.glow}` : `0 0 22px ${profile.glow}` }}
      />
      <span
        className="relative mt-6 sm:mt-7 flex h-[6.2rem] w-[6.2rem] sm:h-32 sm:w-32 items-center justify-center rounded-[34%] border bg-[#0d131f]/95 backdrop-blur-xl transition-colors duration-300 group-focus-visible:ring-2 group-focus-visible:ring-cyan-200"
        style={{ borderColor: active ? profile.color : `${profile.color}50` }}
      >
        <span className="absolute inset-2 rounded-[30%] bg-gradient-to-br from-white/[0.06] to-transparent" />
        <PlatformMark profile={profile} />
        <motion.span
          className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#0B0F19]"
          style={{ backgroundColor: profile.color }}
          animate={active ? { scale: [1, 1.45, 1], opacity: [0.6, 1, 0.6] } : { scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.2, repeat: active ? Infinity : 0 }}
        />
      </span>
      <span className="relative mt-5 text-center">
        <span className="block text-[9px] font-mono uppercase tracking-[0.24em]" style={{ color: profile.color }}>
          {profile.eyebrow}
        </span>
        <span className="mt-1 block text-xs font-semibold text-white">{profile.label} ↗</span>
      </span>
    </motion.a>
  );
}

export default function ProfileConnect() {
  const [pose, setPose] = useState('neutral');
  const resetTimer = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const activate = (nextPose) => {
    window.clearTimeout(resetTimer.current);
    setPose(nextPose);
  };

  const deactivate = () => {
    window.clearTimeout(resetTimer.current);
    setPose('neutral');
  };

  const scheduleTouchReset = () => {
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setPose('neutral'), 900);
  };

  return (
    <section id="connect" aria-label="Professional profile links" className="relative overflow-hidden border-t border-gray-900 bg-[#020715] py-24 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_54%,rgba(34,211,238,0.10),transparent_32%),radial-gradient(circle_at_78%_42%,rgba(192,132,252,0.08),transparent_26%)]" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-3 sm:px-6">
        <div id="connect-title">
          <SectionHeader
            kicker="Profile Signal"
            kickerColor="text-emerald-400"
            title="Choose where to"
            highlight="connect."
            sub="Hover a platform and I’ll meet you there. Each signal opens my verified professional profile in a new tab."
            center
          />
        </div>

        <div className="relative mx-auto mt-12 min-h-[35rem] sm:mt-14 sm:min-h-[43rem] lg:min-h-[47rem]">
          <div aria-hidden="true" className="absolute left-[12%] right-1/2 top-[37%] h-px origin-right -rotate-[7deg] bg-gradient-to-l from-cyan-300/70 via-emerald-400/35 to-transparent sm:left-[17%] sm:top-[39%]">
            <motion.span
              className="absolute -top-1 h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_15px_#34d399]"
              animate={reduceMotion ? undefined : { left: ['100%', '0%'], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <div aria-hidden="true" className="absolute left-1/2 right-[12%] top-[37%] h-px origin-left rotate-[7deg] bg-gradient-to-r from-purple-300/70 via-blue-400/35 to-transparent sm:right-[17%] sm:top-[39%]">
            <motion.span
              className="absolute -top-1 h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_15px_#60a5fa]"
              animate={reduceMotion ? undefined : { left: ['0%', '100%'], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.35 }}
            />
          </div>

          <div className="absolute inset-x-0 top-12 z-20 flex items-start justify-between sm:top-24 lg:top-28">
            {SOCIAL_PROFILES.map((profile) => (
              <PlatformNode
                key={profile.id}
                profile={profile}
                active={pose === profile.pose}
                onActivate={activate}
                onDeactivate={deactivate}
                onTouchEnd={scheduleTouchReset}
              />
            ))}
          </div>

          <div className="absolute inset-x-0 -bottom-[2%] top-0 z-10 mx-auto w-full max-w-[38rem] sm:max-w-[44rem] lg:max-w-[48rem]" aria-hidden="true">
            {Object.entries(POSES).map(([poseName, src]) => (
              <div key={poseName} className="absolute bottom-0 left-1/2 h-full aspect-[1122/1402] -translate-x-1/2">
                <motion.div
                  className="absolute inset-0"
                  style={{
                    maskImage: POSE_MASKS[poseName],
                    WebkitMaskImage: POSE_MASKS[poseName],
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskSize: '100% 100%',
                    WebkitMaskSize: '100% 100%'
                  }}
                  initial={false}
                  animate={{
                    opacity: pose === poseName ? 1 : 0,
                    scale: pose === poseName ? 1 : 0.985,
                    y: pose === poseName ? 0 : 6
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.24, ease: 'easeOut' }}
                >
                  <img
                    src={src}
                    alt=""
                    draggable="false"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full select-none object-cover"
                  />
                </motion.div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-1 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#070A12]/75 px-4 py-2 text-[9px] font-mono uppercase tracking-[0.22em] text-gray-500 backdrop-blur-md sm:bottom-3">
            {pose === 'neutral' ? 'Awaiting profile signal' : `Routing to ${pose}`}
          </div>
        </div>
      </div>
    </section>
  );
}
