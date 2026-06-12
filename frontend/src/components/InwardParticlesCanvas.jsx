import React, { useEffect, useRef } from "react";

const clamp01 = (v) => Math.max(0, Math.min(1, v));

/**
 * Shows particles from outer radius flowing into the center
 * as progress goes 0 -> 1.
 * progress should be a number between 0 and 1.
 */
const InwardParticlesCanvas = ({ progress }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const centerX = w / 2;
    const centerY = h / 2;
    const maxRadius = Math.min(w, h) * 0.6;

    // Create particles once
    if (!particlesRef.current.length) {
      particlesRef.current = Array.from({ length: 260 }, () => {
        const theta = Math.random() * Math.PI * 2;
        const r = maxRadius * (0.3 + Math.random() * 0.7); // not all at edge
        return {
          theta,
          r0: r,
          size: 1 + Math.random() * 1.4,
          jitter: (Math.random() - 0.5) * 0.05,
          delay: Math.random() * 0.25, // small offset per particle
        };
      });
    }

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      const easedGlobal = 1 - Math.pow(1 - clamp01(progress), 2); // ease-out

      for (const p of particlesRef.current) {
        const localT = clamp01(easedGlobal - p.delay);
        const eased = 1 - Math.pow(1 - localT, 2); // per‑particle ease

        const r = p.r0 * (1 - eased); // move inward
        const angle = p.theta + p.jitter * eased;

        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        const alpha = 0.15 + 0.75 * eased;
        const size = p.size * (0.5 + 0.8 * (1 - eased));

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,214,90,${alpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default InwardParticlesCanvas;