import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const PALETTE = {
  bg0: '#030712',
  bg1: '#050B18',
  bg2: '#071426',
  navy: '#0A1424',
  blueGray: '#41566D',
  charcoal: '#1A232F',
  ivory: '#D9D8D2',
  accent: '#4DA3FF',
  white: '#FFFFFF',
};

const labels = [
  { text: 'ORBIT 01', className: 'top-6 left-6 md:top-8 md:left-8' },
  { text: 'PORTFOLIO V3', className: 'top-6 right-6 md:top-8 md:right-8 text-right' },
  { text: 'TRANSMISSION ACTIVE', className: 'bottom-8 right-6 md:right-8 text-right' },
];

function useParallax() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 20, mass: 1 });
  const sy = useSpring(y, { stiffness: 60, damping: 20, mass: 1 });

  useEffect(() => {
    const move = (e) => {
      x.set((e.clientX / window.innerWidth - 0.5) * 22);
      y.set((e.clientY / window.innerHeight - 0.5) * 16);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  return { sx, sy };
}

function StarField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let w = 0;
    let h = 0;
    let stars = [];
    let events = [];
    let pointerX = 0;
    let pointerY = 0;
    let currentX = 0;
    let currentY = 0;
    let intro = 0;
    let frame = 0;

    const build = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const total = Math.min(1800, Math.floor((w * h) / 1200));
      stars = Array.from({ length: total }, (_, i) => {
        const ratio = i / total;
        const type = ratio < 0.8 ? 'tiny' : ratio < 0.95 ? 'mid' : 'bright';
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: type === 'tiny' ? Math.random() * 0.65 + 0.15 : type === 'mid' ? Math.random() * 0.8 + 0.7 : Math.random() * 1.2 + 1.2,
          a: type === 'tiny' ? Math.random() * 0.35 + 0.12 : type === 'mid' ? Math.random() * 0.42 + 0.2 : Math.random() * 0.35 + 0.45,
          p: type === 'tiny' ? 0.04 : type === 'mid' ? 0.1 : 0.18,
          phase: Math.random() * Math.PI * 2,
          twinkle: type === 'bright' ? Math.random() * 0.018 + 0.01 : Math.random() * 0.008 + 0.003,
        };
      });
      events = [];
    };

    const onMove = (e) => {
      pointerX = (e.clientX / w - 0.5) * 10;
      pointerY = (e.clientY / h - 0.5) * 8;
    };

    const spawnEvent = () => {
      const roll = Math.random();
      if (roll < 0.55) {
        events.push({
          type: 'shooting',
          x: Math.random() * w * 0.7,
          y: Math.random() * h * 0.45,
          vx: 10 + Math.random() * 6,
          vy: 3 + Math.random() * 2,
          life: 0,
          max: 28 + Math.random() * 12,
        });
      } else {
        events.push({
          type: 'glint',
          x: Math.random() * w,
          y: Math.random() * h * 0.55,
          life: 0,
          max: 80 + Math.random() * 40,
          size: 0.8 + Math.random() * 1.4,
        });
      }
    };

    const drawEvents = () => {
      events = events.filter((e) => e.life < e.max);
      events.forEach((e) => {
        e.life += 1;
        const t = e.life / e.max;
        if (e.type === 'shooting') {
          const x = e.x + e.vx * e.life;
          const y = e.y + e.vy * e.life;
          const alpha = Math.sin(t * Math.PI) * 0.35;
          ctx.strokeStyle = `rgba(220,235,255,${alpha})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - 42, y - 14);
          ctx.stroke();
        } else {
          const alpha = Math.sin(t * Math.PI) * 0.25;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(210,230,255,${alpha})`;
          ctx.fill();
        }
      });
    };

    const draw = () => {
      frame += 1;
      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, PALETTE.bg2);
      bg.addColorStop(0.48, PALETTE.bg1);
      bg.addColorStop(1, PALETTE.bg0);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      currentX += (pointerX - currentX) * 0.028;
      currentY += (pointerY - currentY) * 0.028;
      intro = Math.min(1, intro + 0.008);

      stars.forEach((star) => {
        star.phase += star.twinkle;
        const alpha = star.a * (0.78 + Math.sin(star.phase) * 0.22) * intro;
        const x = star.x + currentX * star.p;
        const y = star.y + currentY * star.p;
        ctx.beginPath();
        ctx.arc(x, y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235,243,255,${alpha})`;
        ctx.fill();
      });

      const haze = ctx.createRadialGradient(w * 0.52, h * 0.7, 0, w * 0.52, h * 0.7, w * 0.6);
      haze.addColorStop(0, 'rgba(77,163,255,0.05)');
      haze.addColorStop(0.45, 'rgba(77,163,255,0.02)');
      haze.addColorStop(1, 'rgba(77,163,255,0)');
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, w, h);

      if (frame % (900 + Math.floor(Math.random() * 800)) === 0 && events.length < 3) spawnEvent();
      drawEvents();
      raf = requestAnimationFrame(draw);
    };

    build();
    draw();
    window.addEventListener('resize', build);
    window.addEventListener('mousemove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', build);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

return <canvas ref={ref} className="absolute inset-0 h-full w-full" style={{ zIndex: 0 }} />;
}

function GasGiant() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.45, duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none absolute left-1/2 top-[78%] z-[2] h-[72vw] w-[72vw] min-h-[620px] min-w-[620px] -translate-x-1/2 rounded-full md:top-[79%] md:h-[56vw] md:w-[56vw] lg:h-[48vw] lg:w-[48vw]"
      style={{
        background: `
          radial-gradient(circle at 50% 43%, rgba(255,255,255,0.04), transparent 22%),
          radial-gradient(circle at 50% 36%, rgba(77,163,255,0.08), transparent 30%),
          linear-gradient(180deg,
            rgba(217,216,210,0.80) 0%,
            rgba(123,136,151,0.82) 8%,
            rgba(57,73,91,0.95) 16%,
            rgba(26,35,47,1) 24%,
            rgba(69,84,101,0.92) 31%,
            rgba(20,29,42,1) 39%,
            rgba(90,106,121,0.85) 47%,
            rgba(17,24,35,1) 55%,
            rgba(74,89,104,0.82) 64%,
            rgba(15,21,31,1) 72%,
            rgba(52,65,79,0.85) 80%,
            rgba(7,12,20,1) 100%)
        `,
        boxShadow: '0 0 120px rgba(77,163,255,0.12), 0 0 220px rgba(77,163,255,0.08)',
      }}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-full"
        animate={{ backgroundPositionX: ['0%', '100%'] }}
        transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: `
            linear-gradient(180deg,
              transparent 0%,
              rgba(255,255,255,0.05) 7%,
              transparent 15%,
              rgba(255,255,255,0.03) 23%,
              transparent 31%,
              rgba(255,255,255,0.04) 40%,
              transparent 48%,
              rgba(255,255,255,0.025) 57%,
              transparent 65%,
              rgba(255,255,255,0.035) 73%,
              transparent 83%,
              rgba(255,255,255,0.025) 92%,
              transparent 100%)
          `,
          backgroundSize: '180% 100%',
          mixBlendMode: 'screen',
        }}
      />

      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 260, repeat: Infinity, ease: 'linear' }}
        style={{
          background: `
            radial-gradient(ellipse 16% 7% at 60% 40%, rgba(255,255,255,0.045), transparent 72%),
            radial-gradient(ellipse 22% 9% at 34% 56%, rgba(18,26,38,0.28), transparent 75%),
            radial-gradient(ellipse 14% 6% at 68% 62%, rgba(255,255,255,0.035), transparent 72%),
            radial-gradient(ellipse 9% 5% at 44% 46%, rgba(12,18,28,0.34), transparent 75%)
          `,
        }}
      />

      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ x: [0, 18, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: `
            radial-gradient(circle at 55% 46%, rgba(18,26,38,0.42) 0%, rgba(18,26,38,0.18) 26%, transparent 44%),
            radial-gradient(circle at 56% 46%, rgba(255,255,255,0.05) 0%, transparent 18%)
          `,
          filter: 'blur(1px)',
        }}
      />

      <div
        className="absolute inset-[-3%] rounded-full"
        style={{
          background: 'radial-gradient(circle, transparent 61%, rgba(170,210,255,0.10) 67%, rgba(77,163,255,0.18) 72%, transparent 79%)',
          filter: 'blur(8px)',
        }}
      />

      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 22%, rgba(3,7,18,0.08) 38%, rgba(3,7,18,0.52) 67%, rgba(3,7,18,0.95) 100%)',
        }}
      />
    </motion.div>
  );
}

function Satellite() {
  return (
    <motion.div
      className="pointer-events-none absolute z-[3]"
      initial={{ x: '-12vw', y: '52vh', opacity: 0 }}
      animate={{
        x: ['-12vw', '26vw', '58vw', '102vw'],
        y: ['52vh', '47vh', '44vh', '40vh'],
        opacity: [0, 0.22, 0.24, 0],
      }}
      transition={{
        duration: 22,
        times: [0, 0.2, 0.78, 1],
        repeat: Infinity,
        repeatDelay: 8,
        ease: 'linear',
      }}
    >
      <div className="relative h-[10px] w-[28px]">
        <div className="absolute left-[10px] top-[3px] h-[4px] w-[8px] rounded-full bg-white/35 shadow-[0_0_8px_rgba(255,255,255,0.15)]" />
        <div className="absolute left-0 top-[2px] h-[6px] w-[10px] rounded-[1px] border border-white/18 bg-white/[0.03]" />
        <div className="absolute right-0 top-[2px] h-[6px] w-[10px] rounded-[1px] border border-white/18 bg-white/[0.03]" />
        <div className="absolute left-[13px] top-0 h-[10px] w-px bg-white/20" />
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const [ready, setReady] = useState(false);
  const { sx, sy } = useParallax();

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="home"
      className="relative flex h-screen min-h-[760px] w-full items-center justify-center overflow-hidden text-white"
      style={{
        background: `linear-gradient(180deg, ${PALETTE.bg2} 0%, ${PALETTE.bg1} 48%, ${PALETTE.bg0} 100%)`,
      }}
    >
      <StarField />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ x: sx, y: sy }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 78% 48% at 50% 76%, rgba(77,163,255,0.08), rgba(77,163,255,0.03) 34%, transparent 66%)',
          }}
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ x: sx.get() * 0.22, y: sy.get() * 0.22 }}
      >
        <div
          className="absolute left-1/2 top-[71%] h-[26vh] w-[80vw] -translate-x-1/2 rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(214,233,255,0.22) 0%, rgba(141,192,255,0.12) 26%, rgba(77,163,255,0.05) 48%, transparent 72%)',
            filter: 'blur(34px)',
          }}
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ x: sx.get() * 0.35, y: sy.get() * 0.35 }}
      >
        <GasGiant />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{ x: sx.get() * 0.55, y: sy.get() * 0.55 }}
      >
        <Satellite />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-[4] bg-[radial-gradient(circle_at_center,transparent_34%,rgba(3,7,18,0.14)_66%,rgba(3,7,18,0.58)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[4] bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,transparent_18%,transparent_82%,rgba(255,255,255,0.03)_100%)]" />

      {labels.map((item, i) => (
        <motion.div
          key={item.text}
          initial={{ opacity: 0, y: i === 2 ? 10 : -10 }}
          animate={{ opacity: ready ? 0.42 : 0, y: ready ? 0 : i === 2 ? 10 : -10 }}
          transition={{ delay: 0.95 + i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-none absolute z-[6] font-['Inter',sans-serif] text-[10px] uppercase tracking-[0.38em] text-white/40 ${item.className}`}
        >
          {item.text}
        </motion.div>
      ))}

      <motion.div
        className="relative z-[7] flex max-w-[1100px] flex-col items-center px-6 text-center"
        style={{ x: sx.get() * 0.06, y: sy.get() * 0.06 }}
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: ready ? 0.8 : 0, y: ready ? 0 : 14 }}
          transition={{ delay: 1.02, duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 text-[10px] uppercase tracking-[0.42em] text-[#4DA3FF] md:mb-6"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Establishing Orbit
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 24, filter: ready ? 'blur(0px)' : 'blur(10px)' }}
          transition={{ delay: 1.18, duration: 0.88, ease: [0.16, 1, 0.3, 1] }}
          className="font-['Space_Grotesk',sans-serif] text-[clamp(3.5rem,10vw,8.5rem)] font-[700] uppercase leading-[0.92] tracking-[-0.04em] text-white"
          style={{ textShadow: '0 12px 50px rgba(0,0,0,0.34), 0 0 60px rgba(141,192,255,0.06)' }}
        >
          JAY MAKWANA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: ready ? 0.82 : 0, y: ready ? 0 : 18 }}
          transition={{ delay: 1.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-[760px] text-balance font-['Inter',sans-serif] text-[clamp(1rem,1.6vw,1.35rem)] font-[400] leading-[1.6] text-white/70 md:mt-7"
        >
          Building digital experiences for web, mobile and AI.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
        transition={{ delay: 1.72, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-9 left-1/2 z-[7] flex -translate-x-1/2 flex-col items-center gap-3 px-4 text-center md:bottom-10"
      >
        <p className="max-w-[28ch] text-[11px] uppercase tracking-[0.22em] text-white/55 md:text-[12px]">
          Everything below started as an empty folder.
        </p>
        <motion.div
          animate={{ y: [0, 7, 0], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]"
        >
          <ChevronDown size={16} color="rgba(255,255,255,0.75)" />
        </motion.div>
      </motion.div>
    </section>
  );
}