// SpaceScene.jsx
// Fixed full-page background — renders behind Hero, About, and all sections
// The GasGiant planet lives here so it never "cuts" at section boundaries

import React, { useEffect, useRef } from 'react';

export default function SpaceScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w = window.innerWidth;
    let h = window.innerHeight;
    let raf;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Stars — generated once
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 0.9 + 0.1,
      a: Math.random() * 0.38 + 0.12,
      phase: Math.random() * Math.PI * 2,
      twinkle: Math.random() * 0.008 + 0.002,
    }));

    const draw = () => {
      // Void base — matches Hero's PALETTE.bg0
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      // ── Gas Giant planet ──
      // Positioned at top-right; large radius means bottom half
      // is still visible when scrolled into About section
      const px = w * 0.50;          // horizontal centre (matches Hero's planet position)
      const py = h * 0.88;          // planet center sits at 88% of viewport height
      const pr = Math.min(w, h) * 0.52;  // large — bleeds below fold into About

      // Planet body — mirrors Hero's GasGiant gradient palette
      const pg = ctx.createLinearGradient(px, py - pr, px, py + pr);
      pg.addColorStop(0,    'rgba(217,216,210,0.72)');
      pg.addColorStop(0.08, 'rgba(123,136,151,0.75)');
      pg.addColorStop(0.18, 'rgba(57,73,91,0.88)');
      pg.addColorStop(0.26, 'rgba(26,35,47,0.95)');
      pg.addColorStop(0.34, 'rgba(69,84,101,0.85)');
      pg.addColorStop(0.42, 'rgba(20,29,42,0.96)');
      pg.addColorStop(0.50, 'rgba(90,106,121,0.80)');
      pg.addColorStop(0.60, 'rgba(17,24,35,0.96)');
      pg.addColorStop(0.72, 'rgba(74,89,104,0.78)');
      pg.addColorStop(0.84, 'rgba(52,65,79,0.82)');
      pg.addColorStop(1,    'rgba(7,12,20,0.95)');

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = pg;
      ctx.fillRect(px - pr, py - pr, pr * 2, pr * 2);
      ctx.restore();

      // Planet atmosphere ring glow
      const ag = ctx.createRadialGradient(px, py, pr * 0.72, px, py, pr * 1.18);
      ag.addColorStop(0,   'rgba(77,163,255,0)');
      ag.addColorStop(0.5, 'rgba(77,163,255,0.10)');
      ag.addColorStop(1,   'rgba(77,163,255,0)');
      ctx.beginPath();
      ctx.arc(px, py, pr * 1.18, 0, Math.PI * 2);
      ctx.fillStyle = ag;
      ctx.fill();

      // Planet top-light highlight
      const hl = ctx.createRadialGradient(px - pr * 0.1, py - pr * 0.12, 0, px, py, pr * 0.85);
      hl.addColorStop(0,   'rgba(255,255,255,0.04)');
      hl.addColorStop(0.4, 'rgba(77,163,255,0.04)');
      hl.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fillStyle = hl;
      ctx.fill();

      // ── Stars ──
      stars.forEach(s => {
        s.phase += s.twinkle;
        const alpha = s.a * (0.8 + Math.sin(s.phase) * 0.2);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235,243,255,${alpha})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // fixed inset-0 z-0 — always behind everything, persists across scroll
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}