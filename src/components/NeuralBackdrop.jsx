import React, { useRef, useEffect } from 'react';

/*
 * NeuralBackdrop — fixed ambient layer behind every section below the hero.
 * Drifting synapse nodes with faint links, plus a glowing "signal" that
 * travels down a spine on the left edge as the visitor scrolls.
 */
export default function NeuralBackdrop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, W, H;
    let lastFrame = 0;
    let running = document.visibilityState === 'visible';
    let heroSuppressed = false;
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const frameInterval = 1000 / (mobile ? 20 : 30);
    let pts = [];

    const layout = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      pts = Array.from({ length: Math.min(mobile ? 24 : 42, Math.floor(W / (mobile ? 34 : 30))) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        c: Math.random() < 0.7 ? '56, 189, 248' : '167, 139, 250',
        r: 0.8 + Math.random() * 1.4,
        tw: Math.random() * Math.PI * 2
      }));
    };
    layout();
    window.addEventListener('resize', layout);

    let t = 0;
    const render = (timestamp = 0) => {
      if (!running) return;
      if (window.scrollY < window.innerHeight * 0.72) {
        if (!heroSuppressed) ctx.clearRect(0, 0, W, H);
        heroSuppressed = true;
        lastFrame = 0;
        raf = requestAnimationFrame(render);
        return;
      }
      heroSuppressed = false;
      if (timestamp - lastFrame < frameInterval) {
        raf = requestAnimationFrame(render);
        return;
      }
      const deltaSeconds = lastFrame ? Math.min((timestamp - lastFrame) / 1000, 0.1) : 1 / 60;
      const motionScale = deltaSeconds * 60;
      lastFrame = timestamp;
      t += deltaSeconds;
      ctx.clearRect(0, 0, W, H);

      // drifting synapse nodes
      pts.forEach((p) => {
        p.x += p.vx * motionScale;
        p.y += p.vy * motionScale;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c}, ${0.16 + 0.12 * Math.sin(t * 1.5 + p.tw)})`;
        ctx.fill();
      });

      // faint links
      ctx.lineWidth = 0.5;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 150 * 150) {
            ctx.strokeStyle = `rgba(94, 154, 220, ${(1 - Math.sqrt(d2) / 150) * 0.05})`;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // scroll spine: a signal traveling down the left edge with the visitor
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const prog = scrollable > 0 ? window.scrollY / scrollable : 0;
      const sx = 26;
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, 'rgba(34, 211, 238, 0)');
      grad.addColorStop(0.5, 'rgba(34, 211, 238, 0.10)');
      grad.addColorStop(1, 'rgba(139, 92, 246, 0.06)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, H);
      ctx.stroke();

      const py = prog * (H - 80) + 40;
      // trail
      for (let k = 4; k >= 0; k--) {
        ctx.beginPath();
        ctx.arc(sx, py - k * 14, 2.6 - k * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(103, 232, 249, ${0.5 - k * 0.09})`;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(sx, py, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = '#a5f3fc';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#22d3ee';
      ctx.fill();
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(render);
    };
    const handleVisibility = () => {
      running = document.visibilityState === 'visible';
      if (running) {
        lastFrame = 0;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(raf);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', layout);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />;
}
