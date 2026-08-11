import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { caseStudies } from '../data/caseStudies';

/*
 * BrainExperience — the interactive first page.
 * Stage flow (mirrors the reference video):
 *   intro  : procedural neural skeleton with light pulses traveling its pathways
 *   burst  : click shockwave, the neural system expands and dissolves
 *   field  : AI circuit-brains drifting in energy streams, one per project
 *   detail : zoomed AI brain with a HUD case-study panel
 */

const EMBER_COLORS = ['#fbbf24', '#f59e0b', '#ef4444', '#fb7185'];

/* ------------------------------------------------------------------ */
/* 3D brain point cloud: two wrinkled hemispheres + cerebellum + stem  */
/* ------------------------------------------------------------------ */
function buildBrainCloud() {
  const pts = [];

  // cortex surface
  for (let i = 0; i < 260; i++) {
    const u = Math.random() * 2 - 1;
    const phi = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    let x = s * Math.cos(phi) * 1.18; // front-back (long axis)
    let y = u * 0.88; // up-down
    let z = s * Math.sin(phi) * 0.98; // left-right

    // cortical wrinkles: radial ripple + jitter
    const wr = 1 + 0.055 * Math.sin(6 * phi) * Math.sin(5 * Math.acos(u)) + (Math.random() - 0.5) * 0.06;
    x *= wr; y *= wr; z *= wr;

    // flatter base, tapered frontal lobe
    if (y < -0.42) y = -0.42 + (y + 0.42) * 0.35;
    if (x > 0.55) z *= 0.88;

    // hemisphere fissure along the midline
    z += Math.sign(z || 1) * 0.06;

    pts.push({ x, y, z, kind: 'cortex' });
  }

  // cerebellum (small wrinkled lobe, lower back)
  for (let i = 0; i < 52; i++) {
    const u = Math.random() * 2 - 1;
    const phi = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const wr = 1 + (Math.random() - 0.5) * 0.1;
    pts.push({
      x: -0.62 + s * Math.cos(phi) * 0.4 * wr,
      y: -0.62 + u * 0.28 * wr,
      z: s * Math.sin(phi) * 0.52 * wr,
      kind: 'cereb'
    });
  }

  // brain stem
  for (let i = 0; i < 18; i++) {
    const t = i / 17;
    const a = Math.random() * Math.PI * 2;
    const r = 0.085 * Math.sqrt(Math.random());
    pts.push({
      x: -0.18 + t * 0.1 + Math.cos(a) * r,
      y: -0.68 - t * 0.42 + (Math.random() - 0.5) * 0.03,
      z: Math.sin(a) * r,
      kind: 'stem'
    });
  }

  const coreIndex = pts.length;
  pts.push({ x: 0, y: -0.02, z: 0, kind: 'core' });

  // Anatomical lobe tinting adds depth while keeping the established cyan/purple palette.
  pts.forEach((p) => {
    if (p.kind === 'core') {
      p.lobe = 'core';
      p.c = '255, 255, 255';
    } else if (p.kind === 'stem') {
      p.lobe = 'stem';
      p.c = '125, 211, 252';
    } else if (p.kind === 'cereb') {
      p.lobe = 'cerebellum';
      p.c = '167, 139, 250';
    } else if (p.x > 0.42) {
      p.lobe = 'frontal';
      p.c = '103, 232, 249';
    } else if (p.x < -0.52) {
      p.lobe = 'occipital';
      p.c = '192, 132, 252';
    } else if (p.y < -0.08) {
      p.lobe = 'temporal';
      p.c = '96, 165, 250';
    } else {
      p.lobe = 'parietal';
      p.c = '56, 189, 248';
    }
  });

  // k-nearest-neighbor edges (computed once)
  const edges = [];
  const adj = pts.map(() => []);
  for (let i = 0; i < pts.length; i++) {
    const dists = [];
    for (let j = 0; j < pts.length; j++) {
      if (i === j) continue;
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const dz = pts[i].z - pts[j].z;
      dists.push({ j, d: dx * dx + dy * dy + dz * dz });
    }
    dists.sort((a, b) => a.d - b.d);
    for (let k = 0; k < 3; k++) {
      const { j, d } = dists[k];
      if (d > 0.09) continue; // skip long stragglers
      if (i < j) edges.push([i, j]);
      if (!adj[i].includes(j)) adj[i].push(j);
      if (!adj[j].includes(i)) adj[j].push(i);
    }
  }

  // Twelve inner spokes connect the surface network to the central light core.
  const cortexIndices = pts.map((point, index) => ({ point, index })).filter(({ point }) => point.kind === 'cortex');
  const coreEdges = [];
  for (let anchor = 0; anchor < 12; anchor++) {
    const angle = (anchor / 12) * Math.PI * 2;
    const targetY = ((anchor % 3) - 1) * 0.42;
    let best = cortexIndices[0];
    let bestScore = -Infinity;
    cortexIndices.forEach((candidate) => {
      const point = candidate.point;
      const length = Math.hypot(point.x, point.y, point.z) || 1;
      const score = (point.x * Math.cos(angle) + point.z * Math.sin(angle) + point.y * targetY) / length;
      if (score > bestScore) {
        bestScore = score;
        best = candidate;
      }
    });
    if (!coreEdges.some(([, index]) => index === best.index)) {
      coreEdges.push([coreIndex, best.index]);
      edges.push([coreIndex, best.index]);
      adj[coreIndex].push(best.index);
      adj[best.index].push(coreIndex);
    }
  }

  return { pts, edges, adj, coreIndex, coreEdges };
}

/* Precomputed neural routes keep light pulses coherent without pathfinding per frame. */
function buildSignalRoutes(brain, count) {
  return Array.from({ length: count }, (_, routeIndex) => {
    const anchor = brain.coreEdges[(routeIndex * 2) % brain.coreEdges.length][1];
    const outward = [brain.coreIndex, anchor];
    let previous = brain.coreIndex;
    let current = anchor;
    for (let step = 0; step < 9 + (routeIndex % 4); step++) {
      const candidates = brain.adj[current].filter((index) => index !== previous && index !== brain.coreIndex && !outward.includes(index));
      if (!candidates.length) break;
      const next = candidates[(routeIndex * 3 + step * 2) % candidates.length];
      previous = current;
      current = next;
      outward.push(current);
    }
    const path = outward.reverse();
    return {
      path,
      phase: (routeIndex * 0.193) % 1,
      speed: 0.38 + (routeIndex % 3) * 0.045,
      color: routeIndex % 3 === 0 ? '#c4b5fd' : routeIndex % 3 === 1 ? '#a5f3fc' : '#ffffff'
    };
  }).filter((route) => route.path.length > 3);
}

/* ------------------------------------------------------------------ */
/* Neuron cluster: a glowing synapse web — each project is a part of  */
/* the brain (a neuron), like the reference render                    */
/* ------------------------------------------------------------------ */
function seededRandom(seed) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function NeuronCluster({ size = 120, glow = '#38bdf8', seed = 1, pulse = false }) {
  const rnd = seededRandom(seed * 97 + 13);
  const C = 110; // center in a 220x220 box
  const satellites = [];
  const outer = [];
  const n = 9;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rnd() * 0.7;
    const r = 52 + rnd() * 34;
    const sx = C + Math.cos(a) * r;
    const sy = C + Math.sin(a) * r * 0.92;
    satellites.push({ x: sx, y: sy, r: 3 + rnd() * 3.2, a });
    // second hop: a dimmer node further out on ~half the branches
    if (rnd() < 0.55) {
      const a2 = a + (rnd() - 0.5) * 0.8;
      const r2 = 24 + rnd() * 22;
      outer.push({ from: { x: sx, y: sy }, x: sx + Math.cos(a2) * r2, y: sy + Math.sin(a2) * r2, r: 1.6 + rnd() * 2 });
    }
  }

  return (
    <svg
      viewBox="0 0 220 220"
      width={size}
      height={size}
      style={{ filter: `drop-shadow(0 0 ${size / 10}px ${glow}) drop-shadow(0 0 ${size / 4}px ${glow}44)` }}
    >
      <defs>
        <radialGradient id={`core-${seed}-${glow.slice(1)}`}>
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="35%" stopColor={glow} stopOpacity="0.85" />
          <stop offset="75%" stopColor={glow} stopOpacity="0.25" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* dendrites: curved filaments from core to satellites */}
      {satellites.map((s, i) => {
        const mx = (C + s.x) / 2 + Math.cos(s.a + Math.PI / 2) * 9;
        const my = (C + s.y) / 2 + Math.sin(s.a + Math.PI / 2) * 9;
        return (
          <path
            key={`d${i}`}
            d={`M ${C} ${C} Q ${mx} ${my} ${s.x} ${s.y}`}
            fill="none"
            stroke={glow}
            strokeWidth="1.1"
            opacity="0.8"
          />
        );
      })}
      {/* web: chords between neighbouring satellites */}
      {satellites.map((s, i) => {
        const nb = satellites[(i + 1) % satellites.length];
        return <line key={`w${i}`} x1={s.x} y1={s.y} x2={nb.x} y2={nb.y} stroke={glow} strokeWidth="0.55" opacity="0.35" />;
      })}
      {/* outer hops */}
      {outer.map((o, i) => (
        <g key={`o${i}`}>
          <line x1={o.from.x} y1={o.from.y} x2={o.x} y2={o.y} stroke={glow} strokeWidth="0.7" opacity="0.5" />
          <circle cx={o.x} cy={o.y} r={o.r} fill={glow} opacity="0.7" />
        </g>
      ))}
      {/* satellite nodes */}
      {satellites.map((s, i) => (
        <circle key={`s${i}`} cx={s.x} cy={s.y} r={s.r} fill={glow} opacity="0.95" />
      ))}
      {/* soma: bright glowing core */}
      <circle cx={C} cy={C} r="34" fill={`url(#core-${seed}-${glow.slice(1)})`}>
        {pulse && (
          <animate attributeName="r" values="30;37;30" dur="2.6s" repeatCount="indefinite" />
        )}
      </circle>
      <circle cx={C} cy={C} r="13" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

export default function BrainExperience() {
  const [stage, setStage] = useState('intro'); // intro | burst | field | detail
  const [activeStudy, setActiveStudy] = useState(null);
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef(null);
  const stageRef = useRef(stage);
  const burstStartRef = useRef(0);
  stageRef.current = stage;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let W, H;
    let lastFrame = 0;
    let inViewport = false;
    let pageVisible = document.visibilityState === 'visible';
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const frameInterval = reducedMotion ? 250 : 1000 / (mobile ? 20 : 30);

    let embers = [];
    let streams = [];
    const brain = buildBrainCloud();
    const brainSignals = buildSignalRoutes(brain, mobile ? 4 : 6);

    const layout = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;

      embers = Array.from({ length: Math.min(mobile ? 36 : 64, Math.floor(W / (mobile ? 22 : 18))) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 1 + Math.random() * 2.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        c: EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)],
        tw: Math.random() * Math.PI * 2
      }));

      streams = Array.from({ length: 7 }, (_, i) => ({
        y: (H / 8) * (i + 1),
        amp: 30 + Math.random() * 60,
        speed: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.5 ? '139, 92, 246' : '59, 130, 246'
      }));
    };

    layout();
    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    let t = 0;
    const render = (timestamp = 0) => {
      if (!inViewport || !pageVisible) return;
      if (timestamp - lastFrame < frameInterval) {
        raf = requestAnimationFrame(render);
        return;
      }
      const deltaSeconds = lastFrame ? Math.min((timestamp - lastFrame) / 1000, 0.1) : 1 / 60;
      const motionScale = deltaSeconds * 60;
      lastFrame = timestamp;
      t += deltaSeconds;
      const st = stageRef.current;
      ctx.clearRect(0, 0, W, H);

      // --- ambient embers, always on ---
      embers.forEach((p) => {
        p.x += p.vx * motionScale;
        p.y += p.vy * motionScale;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
        const a = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2 + p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = st === 'intro' || st === 'burst' ? a * 0.7 : a * 0.35;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // --- rotating procedural brain skeleton (intro & burst) ---
      if (st === 'intro' || st === 'burst') {
        const burstAge = st === 'burst'
          ? Math.min((performance.now() - burstStartRef.current) / 900, 1)
          : 0;
        const brainAlpha = 1 - burstAge;
        const angle = reducedMotion ? -0.38 : t * 0.24 - 0.38;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const baseScale = Math.min(W * 0.25, H * 0.31);
        const scale = baseScale * (1 + burstAge * 1.15);
        const cx = W / 2;
        const cy = H * 0.55 + (reducedMotion ? 0 : Math.sin(t * 0.85) * 5);

        const projected = brain.pts.map((point) => {
          const rx = point.x * cos + point.z * sin;
          const rz = -point.x * sin + point.z * cos;
          const perspective = 3.8 / (3.8 - rz);
          return {
            x: cx + rx * scale * perspective,
            y: cy - point.y * scale * perspective,
            z: rz,
            perspective,
            color: point.c,
            kind: point.kind,
            lobe: point.lobe
          };
        });

        const aura = ctx.createRadialGradient(cx, cy, scale * 0.05, cx, cy, scale * 1.45);
        aura.addColorStop(0, `rgba(56, 189, 248, ${0.12 * brainAlpha})`);
        aura.addColorStop(0.48, `rgba(37, 99, 235, ${0.055 * brainAlpha})`);
        aura.addColorStop(1, 'rgba(5, 7, 13, 0)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(cx, cy, scale * 1.45, 0, Math.PI * 2);
        ctx.fill();

        // Layered translucent tissue gives the point cloud an anatomical volume.
        ctx.save();
        ctx.globalAlpha = brainAlpha;
        const tissue = ctx.createRadialGradient(cx - scale * 0.22, cy - scale * 0.2, scale * 0.08, cx, cy, scale * 1.08);
        tissue.addColorStop(0, 'rgba(165, 243, 252, 0.12)');
        tissue.addColorStop(0.48, 'rgba(37, 99, 235, 0.055)');
        tissue.addColorStop(0.82, 'rgba(76, 29, 149, 0.035)');
        tissue.addColorStop(1, 'rgba(2, 6, 23, 0)');
        ctx.fillStyle = tissue;
        ctx.beginPath();
        ctx.ellipse(cx, cy - scale * 0.03, scale * 1.13, scale * 0.83, -0.035, 0, Math.PI * 2);
        ctx.fill();

        const hemisphereSeparation = Math.max(scale * 0.035, Math.abs(sin) * scale * 0.2);
        [-1, 1].forEach((side) => {
          const hx = cx + side * hemisphereSeparation;
          const lobeGlow = ctx.createRadialGradient(hx - side * scale * 0.12, cy - scale * 0.17, scale * 0.04, hx, cy, scale * 0.8);
          lobeGlow.addColorStop(0, side < 0 ? 'rgba(96, 165, 250, 0.1)' : 'rgba(192, 132, 252, 0.09)');
          lobeGlow.addColorStop(1, 'rgba(15, 23, 42, 0)');
          ctx.fillStyle = lobeGlow;
          ctx.beginPath();
          ctx.ellipse(hx, cy - scale * 0.05, scale * 0.78, scale * 0.72, side * 0.055, 0, Math.PI * 2);
          ctx.fill();
        });

        const cerebellumGlow = ctx.createRadialGradient(cx - scale * 0.5, cy + scale * 0.42, 0, cx - scale * 0.5, cy + scale * 0.42, scale * 0.48);
        cerebellumGlow.addColorStop(0, 'rgba(192, 132, 252, 0.11)');
        cerebellumGlow.addColorStop(1, 'rgba(76, 29, 149, 0)');
        ctx.fillStyle = cerebellumGlow;
        ctx.beginPath();
        ctx.ellipse(cx - scale * 0.48 * cos, cy + scale * 0.43, scale * 0.44, scale * 0.3, -0.12, 0, Math.PI * 2);
        ctx.fill();

        if (Math.abs(sin) > 0.15) {
          ctx.beginPath();
          ctx.moveTo(cx, cy - scale * 0.72);
          ctx.bezierCurveTo(cx - sin * scale * 0.05, cy - scale * 0.3, cx + sin * scale * 0.06, cy + scale * 0.1, cx - sin * scale * 0.03, cy + scale * 0.48);
          ctx.strokeStyle = `rgba(2, 6, 23, ${Math.min(0.5, Math.abs(sin) * 0.7) * brainAlpha})`;
          ctx.lineWidth = Math.max(1, scale * 0.012);
          ctx.stroke();
        }
        ctx.restore();

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        brain.edges.forEach(([fromIndex, toIndex]) => {
          const from = projected[fromIndex];
          const to = projected[toIndex];
          const depth = Math.max(0.2, Math.min(1, 0.56 + (from.z + to.z) * 0.16));
          const coreConnection = fromIndex === brain.coreIndex || toIndex === brain.coreIndex;
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.strokeStyle = coreConnection
            ? `rgba(165, 243, 252, ${0.42 * depth * brainAlpha})`
            : `rgba(72, 190, 255, ${0.38 * depth * brainAlpha})`;
          ctx.lineWidth = Math.max(coreConnection ? 1.6 : 1.05, (coreConnection ? 2.2 : 1.65) * ((from.perspective + to.perspective) / 2));
          ctx.stroke();
        });

        [...projected]
          .sort((a, b) => a.z - b.z)
          .forEach((point) => {
            if (point.kind === 'core') return;
            const depth = Math.max(0.22, Math.min(1, 0.58 + point.z * 0.2));
            const radius = (point.kind === 'stem' ? 1.45 : point.kind === 'cereb' ? 1.9 : 2.15) * point.perspective;
            ctx.beginPath();
            ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${point.color}, ${0.7 * depth * brainAlpha})`;
            ctx.fill();
          });

        let coreEnergy = 0;
        if (!reducedMotion) {
          brainSignals.forEach((signal) => {
            const route = signal.path;
            if (route.length < 2) return;
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;

            // A faint axon route remains visible beneath the travelling light.
            ctx.beginPath();
            route.forEach((pointIndex, index) => {
              const point = projected[pointIndex];
              if (index === 0) ctx.moveTo(point.x, point.y);
              else ctx.lineTo(point.x, point.y);
            });
            ctx.strokeStyle = signal.color === '#c4b5fd'
              ? `rgba(196, 181, 253, ${0.1 * brainAlpha})`
              : `rgba(165, 243, 252, ${0.1 * brainAlpha})`;
            ctx.lineWidth = 2.1;
            ctx.stroke();

            const progress = (signal.phase + t * signal.speed) % 1;
            const envelope = 0.4 + Math.sin(progress * Math.PI) * 0.6;
            coreEnergy = Math.max(coreEnergy, Math.max(0, 1 - (1 - progress) / 0.1));
            for (let trail = 7; trail >= 0; trail--) {
              const trailProgress = progress - trail * 0.014;
              if (trailProgress < 0) continue;
              const routePosition = trailProgress * (route.length - 1);
              const segmentIndex = Math.min(route.length - 2, Math.floor(routePosition));
              const segmentProgress = routePosition - segmentIndex;
              const from = projected[route[segmentIndex]];
              const to = projected[route[segmentIndex + 1]];
              const x = from.x + (to.x - from.x) * segmentProgress;
              const y = from.y + (to.y - from.y) * segmentProgress;
              const trailStrength = (1 - trail / 8) * envelope * brainAlpha;
              ctx.beginPath();
              ctx.arc(x, y, trail === 0 ? 3.6 : 1.15 + trailStrength, 0, Math.PI * 2);
              ctx.fillStyle = signal.color;
              ctx.globalAlpha = trailStrength;
              ctx.shadowBlur = trail === 0 ? 20 : 0;
              ctx.shadowColor = signal.color;
              ctx.fill();
            }
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
          });
        }

        // The routes converge here; arriving pulses briefly intensify the living core.
        const core = projected[brain.coreIndex];
        const corePulse = reducedMotion ? 0.45 : 0.52 + Math.sin(t * 4.8) * 0.12;
        const coreStrength = Math.min(1, corePulse + coreEnergy * 0.55);
        const coreRadius = Math.max(13, Math.min(23, scale * 0.075)) * core.perspective;
        const coreGlow = ctx.createRadialGradient(core.x, core.y, 0, core.x, core.y, coreRadius);
        coreGlow.addColorStop(0, `rgba(255, 255, 255, ${0.98 * brainAlpha})`);
        coreGlow.addColorStop(0.18, `rgba(165, 243, 252, ${0.95 * coreStrength * brainAlpha})`);
        coreGlow.addColorStop(0.5, `rgba(56, 189, 248, ${0.5 * coreStrength * brainAlpha})`);
        coreGlow.addColorStop(1, 'rgba(37, 99, 235, 0)');
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 22 + coreEnergy * 10;
        ctx.shadowColor = '#67e8f9';
        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(core.x, core.y, coreRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(core.x, core.y, 2.8 + coreEnergy * 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(165, 243, 252, ${(0.42 + coreEnergy * 0.4) * brainAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(core.x, core.y, coreRadius * (0.62 + corePulse * 0.12), 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      // --- energy streams (field & detail) ---
      if (st === 'field' || st === 'detail') {
        streams.forEach((s) => {
          ctx.beginPath();
          for (let x = 0; x <= W; x += 14) {
            const y =
              s.y +
              Math.sin(x * 0.006 + t * s.speed + s.phase) * s.amp +
              Math.sin(x * 0.017 - t * s.speed * 1.6) * s.amp * 0.3;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(${s.hue}, ${st === 'detail' ? 0.08 : 0.16})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        });
      }

      // Expanding energy rings complete the brain-to-project transition.
      if (st === 'burst') {
        const burstAge = Math.min((performance.now() - burstStartRef.current) / 900, 1);
        const cx = W / 2;
        const cy = H * 0.55;
        ctx.globalCompositeOperation = 'lighter';
        for (let k = 0; k < 3; k++) {
          const radius = burstAge * (H * 0.7) + k * 40;
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(radius, 1), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(34, 211, 238, ${Math.max(0.5 - burstAge * 0.5 - k * 0.12, 0)})`;
          ctx.lineWidth = 2 - k * 0.5;
          ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
      }

      raf = requestAnimationFrame(render);
    };
    const resume = () => {
      if (!inViewport || !pageVisible) return;
      cancelAnimationFrame(raf);
      lastFrame = 0;
      raf = requestAnimationFrame(render);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      if (inViewport) resume();
      else cancelAnimationFrame(raf);
    }, { rootMargin: '120px 0px' });
    const handleVisibility = () => {
      pageVisible = document.visibilityState === 'visible';
      if (pageVisible) resume();
      else cancelAnimationFrame(raf);
    };
    observer.observe(canvas);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [reducedMotion]);

  const triggerBurst = useCallback(() => {
    if (stageRef.current !== 'intro') return;
    burstStartRef.current = performance.now();
    setStage('burst');
    setTimeout(() => setStage('field'), reducedMotion ? 0 : 900);
  }, [reducedMotion]);

  const openStudy = (study) => {
    setActiveStudy(study);
    setStage('detail');
  };

  const backToField = () => {
    setActiveStudy(null);
    setStage('field');
  };

  // drifting positions for the project brains (percent based)
  const fieldSpots = [
    'left-[30%] top-[30%] md:left-[18%]',
    'left-1/2 top-[52%]',
    'left-[70%] top-[28%] md:left-[78%]'
  ];

  return (
    <section id="case-studies" className="relative h-screen min-h-[660px] w-full overflow-hidden bg-[#05070D]">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full" aria-hidden="true" />

      {/* ------------------------------ INTRO ------------------------------ */}
      <AnimatePresence>
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            className="absolute inset-0 z-10"
          >
            {/* intro copy */}
            <div className="absolute top-[10%] left-0 right-0 text-center px-6 pointer-events-none">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-[11px] md:text-xs font-mono uppercase tracking-[0.35em] text-cyan-400"
              >
                Digital Transformation · SaaS · AI · Automation
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.8 }}
                className="mt-3 text-4xl md:text-6xl font-black tracking-tight text-white"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">Shaikh</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="mt-4 text-sm md:text-base text-gray-400 font-light max-w-xl mx-auto leading-relaxed"
              >
                I turn manual, scattered processes into smart digital systems —
                every project starts as a spark inside this brain.
              </motion.p>
            </div>

            {/* clickable brain hotspot */}
            <button
              type="button"
              onClick={triggerBurst}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  triggerBurst();
                }
              }}
              aria-label="Click the Brain to explore my Projects"
              className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[52vmin] h-[46vmin] cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-4 focus-visible:ring-offset-[#05070D]"
              title="Click the Brain to explore my Projects"
            />

            {/* animated cursor hint that taps the brain, like the video */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: [30, 0, 0, 30], y: [40, 0, 0, 40], scale: [1, 1, 0.82, 1] }}
              transition={{ delay: 1.4, duration: 2.6, repeat: Infinity, times: [0, 0.4, 0.55, 1] }}
              className="absolute left-[56%] top-[60%] z-20 pointer-events-none text-white"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1">
                <path d="M4 2 L20 12 L12 13.5 L16 21 L13 22.5 L9.5 15 L4 19 Z" />
              </svg>
            </motion.div>

            {/* pulsing instruction chip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute bottom-[8%] left-0 right-0 flex justify-center pointer-events-none"
            >
              <span className="px-5 py-2.5 rounded-full border border-cyan-500/40 bg-cyan-950/50 backdrop-blur-sm text-xs md:text-sm font-mono text-cyan-300 animate-pulse tracking-wide">
                ⬢ Click the Brain to explore my Projects
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------ BURST ------------------------------ */}
      {stage === 'burst' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <span className="text-xs font-mono tracking-[0.3em] text-cyan-300 animate-pulse">
            IGNITING NEURAL PROJECT GRID…
          </span>
        </div>
      )}

      {/* ------------------------------ FIELD ------------------------------ */}
      <AnimatePresence>
        {stage === 'field' && (
          <motion.div
            key="field"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute inset-0 z-10"
          >
            <div className="absolute top-[8%] left-0 right-0 text-center px-6 pointer-events-none">
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-purple-400">Neural Project Grid</span>
              <h2 className="text-2xl md:text-4xl font-bold text-white mt-2">Every project is a part of my brain.</h2>
              <p className="text-xs md:text-sm text-gray-400 mt-2">Each neuron holds one — click it to open the case study.</p>
            </div>

            {caseStudies.map((study, i) => (
              <div key={study.id} className={`absolute -translate-x-1/2 -translate-y-1/2 ${fieldSpots[i % fieldSpots.length]}`}>
                <motion.button
                  onClick={() => openStudy(study)}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
                  transition={{
                    opacity: { delay: 0.15 * i, duration: 0.5 },
                    scale: { delay: 0.15 * i, type: 'spring', stiffness: 120 },
                    y: { delay: 0.12 * i, duration: 2.8 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  whileHover={{ scale: 1.12 }}
                  className="group flex flex-col items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  <div>
                    <div className="group-hover:hidden">
                      <NeuronCluster size={150} glow="#38bdf8" seed={study.id} pulse />
                    </div>
                    <div className="hidden group-hover:block">
                      <NeuronCluster size={150} glow="#c084fc" seed={study.id} pulse />
                    </div>
                  </div>
                  <div className="text-center max-w-[220px]">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-purple-400">{study.tag}</span>
                    <span className="block text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mt-1">
                      {study.title}
                    </span>
                  </div>
                </motion.button>
              </div>
            ))}

            <button
              onClick={() => setStage('intro')}
              className="absolute top-5 left-5 z-20 px-3 py-1.5 text-[11px] font-mono text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 rounded-lg bg-black/40 backdrop-blur-sm transition-colors"
            >
              ← Back to brain
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------ DETAIL ------------------------------ */}
      <AnimatePresence>
        {stage === 'detail' && activeStudy && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.25 } }}
            className="absolute inset-0 z-10 flex items-center justify-center px-4 md:px-8 py-6 overflow-y-auto"
          >
            <div className="w-full max-w-5xl grid md:grid-cols-[minmax(180px,1fr)_2fr] gap-6 items-center">
              {/* zoomed AI brain */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }}
                transition={{ scale: { type: 'spring', stiffness: 90 }, y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } }}
                className="hidden md:flex flex-col items-center gap-4"
              >
                <NeuronCluster size={230} glow="#c084fc" seed={activeStudy.id} pulse />
                <span className="text-[10px] font-mono tracking-[0.25em] text-purple-300 uppercase">Neural Unit 0{activeStudy.id}</span>
              </motion.div>

              {/* HUD panel */}
              <div className="bg-[#080B13]/90 backdrop-blur-md border border-cyan-900/40 rounded-2xl p-5 md:p-7 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
                <div className="flex items-start justify-between border-b border-gray-800 pb-4 mb-5">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-900/50 tracking-wider">
                      PROJECT: CASE STUDY · {activeStudy.tag}
                    </span>
                    <h3 className="text-lg md:text-2xl font-bold text-white mt-2">{activeStudy.title}</h3>
                  </div>
                  <button
                    onClick={backToField}
                    aria-label="Close case study and return to project grid"
                    className="shrink-0 p-2 border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white rounded-lg text-xs font-mono transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-900/60 rounded-xl border border-gray-800/60">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-purple-400 mb-1.5">Challenge</h4>
                    <p className="text-xs text-gray-300 leading-relaxed font-light">{activeStudy.challenge}</p>
                  </div>
                  <div className="p-4 bg-gray-900/60 rounded-xl border border-gray-800/60">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 mb-1.5">Engineered Solution</h4>
                    <p className="text-xs text-gray-300 leading-relaxed font-light">{activeStudy.solution}</p>
                  </div>
                  <div className="p-4 bg-gray-900/60 rounded-xl border border-gray-800/60">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-2">Process Sequence Map</h4>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {activeStudy.workflow.map((node, idx) => (
                        <React.Fragment key={idx}>
                          <span className="text-[10px] font-mono bg-slate-950 px-2 py-1 border border-gray-800 rounded text-gray-300">{node}</span>
                          {idx < activeStudy.workflow.length - 1 && <span className="text-gray-600 text-xs font-mono">→</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-cyan-950/25 to-transparent rounded-xl border border-cyan-900/30">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 mb-1.5">Quantifiable Outcome</h4>
                    <p className="text-xs text-cyan-100 leading-relaxed font-medium">{activeStudy.outcome}</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-900 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-gray-600 tracking-widest">ENG // 0{activeStudy.id} · NEURAL ARCHIVE</span>
                  <button
                    onClick={backToField}
                    className="px-4 py-2 bg-gray-900 text-xs font-semibold text-gray-300 hover:text-white rounded-lg border border-gray-800 hover:border-gray-600 transition-colors"
                  >
                    Return to Project Grid
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* scroll cue */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 text-gray-600 text-[10px] font-mono tracking-widest animate-bounce pointer-events-none">
        SCROLL ▾
      </div>
    </section>
  );
}
