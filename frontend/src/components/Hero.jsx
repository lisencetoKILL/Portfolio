import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const PALETTE = {
  bg0: '#030712',
  bg1: '#050B18',
  bg2: '#071426',
};

const GOLD    = '#FFD65A';
const ICE_DIM = 'rgba(140,175,200,0.28)';

const TRAITS = [
  'Full-stack development with modern frontend and backend systems.',
  'Strong focus on performance, structure, and premium UI execution.',
  'Experience building real-world products, APIs, dashboards, and workflows.',
  'Interested in web architecture, product engineering, and AI integration.',
];

const SNAPSHOT = [
  { label: 'LOCATION', value: 'Mumbai, India' },
  { label: 'FOCUS',    value: 'Web, Mobile, AI, Product Engineering' },
  { label: 'STYLE',    value: 'Clean systems, premium execution, scalable code' },
];

const NAV_LABELS = [
  { text: 'ORBIT 01',            className: 'top-6 left-6 md:top-8 md:left-8' },
  { text: 'PORTFOLIO V3',        className: 'top-6 right-6 md:top-8 md:right-8 text-right' },
  { text: 'TRANSMISSION ACTIVE', className: 'bottom-8 right-6 md:right-8 text-right' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] },
  viewport: { once: true },
});

// ── StarField canvas ──────────────────────────────────────────────
function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, w, h, stars = [], events = [], frame = 0;
    let pointerX = 0, pointerY = 0, currentX = 0, currentY = 0, intro = 0;

    const build = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
      const total = Math.min(2200, Math.floor((w * h) / 1100));
      stars = Array.from({ length: total }, (_, i) => {
        const ratio = i / total;
        const type  = ratio < 0.80 ? 'tiny' : ratio < 0.95 ? 'mid' : 'bright';
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: type === 'tiny'   ? Math.random() * 0.65 + 0.15
           : type === 'mid'    ? Math.random() * 0.8  + 0.7
           :                     Math.random() * 1.2  + 1.2,
          a: type === 'tiny'   ? Math.random() * 0.32 + 0.10
           : type === 'mid'    ? Math.random() * 0.40 + 0.18
           :                     Math.random() * 0.32 + 0.42,
          p: type === 'tiny' ? 0.04 : type === 'mid' ? 0.10 : 0.18,
          phase:   Math.random() * Math.PI * 2,
          twinkle: type === 'bright'
            ? Math.random() * 0.018 + 0.01
            : Math.random() * 0.008 + 0.003,
        };
      });
    };

    const spawnEvent = () => {
      if (Math.random() < 0.55) {
        events.push({
          type: 'shooting',
          x: Math.random() * w * 0.7,
          y: Math.random() * h * 0.3,
          vx: 10 + Math.random() * 6,
          vy: 3  + Math.random() * 2,
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
      events = events.filter(e => e.life < e.max);
      events.forEach(e => {
        e.life++;
        const t = e.life / e.max;
        if (e.type === 'shooting') {
          const x = e.x + e.vx * e.life;
          const y = e.y + e.vy * e.life;
          ctx.strokeStyle = `rgba(220,235,255,${Math.sin(t * Math.PI) * 0.32})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - 42, y - 14);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(210,230,255,${Math.sin(t * Math.PI) * 0.22})`;
          ctx.fill();
        }
      });
    };

    const onMove = (e) => {
      pointerX = (e.clientX / w - 0.5) * 10;
      pointerY = (e.clientY / h - 0.5) * 8;
    };

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0,    PALETTE.bg2);
      bg.addColorStop(0.22, PALETTE.bg1);
      bg.addColorStop(0.45, PALETTE.bg0);
      bg.addColorStop(1,    PALETTE.bg0);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      currentX += (pointerX - currentX) * 0.028;
      currentY += (pointerY - currentY) * 0.028;
      intro = Math.min(1, intro + 0.006);

      stars.forEach(s => {
        s.phase += s.twinkle;
        const alpha = s.a * (0.78 + Math.sin(s.phase) * 0.22) * intro;
        ctx.beginPath();
        ctx.arc(s.x + currentX * s.p, s.y + currentY * s.p, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235,243,255,${alpha})`;
        ctx.fill();
      });

      const haze = ctx.createRadialGradient(w * 0.52, h * 0.70, 0, w * 0.52, h * 0.70, w * 0.55);
      haze.addColorStop(0,   'rgba(77,163,255,0.045)');
      haze.addColorStop(0.5, 'rgba(77,163,255,0.018)');
      haze.addColorStop(1,   'rgba(77,163,255,0)');
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, w, h);

      if (frame % (900 + Math.floor(Math.random() * 600)) === 0 && events.length < 3) spawnEvent();
      drawEvents();
      raf = requestAnimationFrame(draw);
    };

    build(); draw();
    window.addEventListener('resize', build);
    window.addEventListener('mousemove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', build);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />;
}

// ── Gas Giant ─────────────────────────────────────────────────────
function GasGiant() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.45, duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none absolute left-1/2 -translate-x-1/2"
      style={{
        top: '60vh',
        width:  'clamp(560px, 70vw, 920px)',
        height: 'clamp(560px, 70vw, 920px)',
        borderRadius: '50%',
        zIndex: 1,
        background: `
          radial-gradient(circle at 50% 43%, rgba(255,255,255,0.04), transparent 22%),
          radial-gradient(circle at 50% 36%, rgba(77,163,255,0.08), transparent 30%),
          linear-gradient(180deg,
            rgba(217,216,210,0.80) 0%,
            rgba(123,136,151,0.82) 8%,
            rgba(57,73,91,0.95)    16%,
            rgba(26,35,47,1)       24%,
            rgba(69,84,101,0.92)   31%,
            rgba(20,29,42,1)       39%,
            rgba(90,106,121,0.85)  47%,
            rgba(17,24,35,1)       55%,
            rgba(74,89,104,0.82)   64%,
            rgba(15,21,31,1)       72%,
            rgba(52,65,79,0.85)    80%,
            rgba(7,12,20,1)        100%
          )
        `,
        boxShadow: '0 0 120px rgba(77,163,255,0.11), 0 0 220px rgba(77,163,255,0.07)',
      }}
    >
      <div className="absolute rounded-full" style={{
        inset: '-4%',
        background: 'radial-gradient(circle, transparent 61%, rgba(170,210,255,0.09) 67%, rgba(77,163,255,0.16) 72%, transparent 79%)',
        filter: 'blur(9px)',
      }} />
      <div className="absolute inset-0 rounded-full overflow-hidden" style={{
        backgroundImage: `linear-gradient(180deg,
          transparent 0%, rgba(255,255,255,0.04) 7%, transparent 15%,
          rgba(255,255,255,0.025) 23%, transparent 31%,
          rgba(255,255,255,0.035) 40%, transparent 48%,
          rgba(255,255,255,0.02) 57%, transparent 65%,
          rgba(255,255,255,0.028) 73%, transparent 100%)`,
      }} />
      <div className="absolute inset-0 rounded-full" style={{
        background: `radial-gradient(ellipse 100% 100% at 50% 50%,
          transparent 52%,
          rgba(3,7,18,0.35) 68%,
          rgba(3,7,18,0.82) 82%,
          rgba(3,7,18,0.98) 94%,
          rgba(3,7,18,1) 100%
        )`,
      }} />
      <div className="absolute inset-0 rounded-full" style={{
        background: `linear-gradient(180deg,
          transparent 30%,
          rgba(3,7,18,0.25) 52%,
          rgba(3,7,18,0.88) 75%,
          rgba(3,7,18,1) 90%
        )`,
      }} />
    </motion.div>
  );
}

// ── Satellite ─────────────────────────────────────────────────────
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
      transition={{ duration: 22, times: [0, 0.2, 0.78, 1], repeat: Infinity, repeatDelay: 8, ease: 'linear' }}
    >
      <div className="relative h-[10px] w-[28px]">
        <div className="absolute left-[10px] top-[3px] h-[4px] w-[8px] rounded-full bg-white/35" />
        <div className="absolute left-0 top-[2px] h-[6px] w-[10px] rounded-[1px] border border-white/18 bg-white/[0.03]" />
        <div className="absolute right-0 top-[2px] h-[6px] w-[10px] rounded-[1px] border border-white/18 bg-white/[0.03]" />
        <div className="absolute left-[13px] top-0 h-[10px] w-px bg-white/20" />
      </div>
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────
export default function Hero() {
  const [ready, setReady] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    const move = (e) => {
      x.set((e.clientX / window.innerWidth  - 0.5) * 22);
      y.set((e.clientY / window.innerHeight - 0.5) * 16);
    };
    window.addEventListener('mousemove', move);
    return () => { clearTimeout(t); window.removeEventListener('mousemove', move); };
  }, [x, y]);

  return (
    <section
      id="home"
      className="relative w-full text-white overflow-hidden"
      style={{ background: 'transparent' }}
    >
      <StarField />
      <GasGiant />
      <Satellite />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 z-[4] bg-[radial-gradient(circle_at_center,transparent_34%,rgba(3,7,18,0.14)_66%,rgba(3,7,18,0.52)_100%)]" />

      {/* Corner labels */}
      {NAV_LABELS.map((item, i) => (
        <motion.div
          key={item.text}
          initial={{ opacity: 0, y: i === 2 ? 10 : -10 }}
          animate={{ opacity: ready ? 0.42 : 0, y: ready ? 0 : i === 2 ? 10 : -10 }}
          transition={{ delay: 0.95 + i * 0.12, duration: 0.7 }}
          className={`pointer-events-none absolute z-[6] font-mono text-[10px] uppercase tracking-[0.38em] text-white/40 ${item.className}`}
        />
      ))}

      {/* ── HERO CONTENT ── */}
      <div className="relative z-[7] flex h-screen min-h-[760px] w-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: ready ? 0.8 : 0, y: ready ? 0 : 14 }}
          transition={{ delay: 1.02, duration: 0.62 }}
          className="mb-5 text-[10px] uppercase tracking-[0.42em] text-[#4DA3FF]"
        >
          Establishing Orbit
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 24, filter: ready ? 'blur(0px)' : 'blur(10px)' }}
          transition={{ delay: 1.18, duration: 0.88 }}
          className="font-['Space_Grotesk',sans-serif] text-[clamp(3.5rem,10vw,8.5rem)] font-[700] uppercase leading-[0.92] tracking-[-0.04em] text-white"
          style={{ textShadow: '0 12px 50px rgba(0,0,0,0.34)' }}
        >
          JAY MAKWANA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: ready ? 0.82 : 0, y: ready ? 0 : 18 }}
          transition={{ delay: 1.4, duration: 0.7 }}
          className="mt-6 max-w-[760px] text-balance font-['Inter',sans-serif] text-[clamp(1rem,1.6vw,1.35rem)] leading-[1.6] text-white/70"
        >
          Building digital experiences for web, mobile and AI.
        </motion.p>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ delay: 1.72, duration: 0.75 }}
          className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/55">
            Everything below started as an empty folder.
          </p>
          <motion.div
            animate={{ y: [0, 7, 0], opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]"
          >
            <ChevronDown size={16} color="rgba(255,255,255,0.75)" />
          </motion.div>
        </motion.div>
      </div>

      {/* ── ABOUT CONTENT ── */}
      <div id="about" className="relative z-[7] py-28 px-6">
        <div className="max-w-6xl mx-auto">

          <motion.p {...fadeUp(0)}
            className="font-mono text-[10px] tracking-[0.45em] uppercase mb-4"
            style={{ color: GOLD }}
          >
            01. ABOUT ME
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            {/* Left */}
            <div className="flex flex-col gap-8">
              <motion.h2 {...fadeUp(0.08)}
                className="font-bold leading-tight"
                style={{ fontSize: 'clamp(1.9rem,4.5vw,3.2rem)', color: 'rgba(220,232,248,0.93)', lineHeight: 1.12 }}
              >
                Building thoughtful digital products with strong engineering foundations.
              </motion.h2>

              <motion.p {...fadeUp(0.16)}
                style={{ color: 'rgba(150,175,205,0.7)', fontSize: 'clamp(0.875rem,1.4vw,1rem)', lineHeight: 1.75, maxWidth: '54ch' }}
              >
                I am a software engineer focused on creating clean, scalable, and premium
                user experiences across web, mobile, and AI-powered products. I care deeply
                about product quality, engineering detail, and interfaces that feel polished
                from the first interaction.
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TRAITS.map((trait, i) => (
                  <motion.div key={i} {...fadeUp(0.22 + i * 0.07)}
                    className="px-4 py-4 rounded-sm"
                    style={{ background: 'rgba(10,18,40,0.55)', border: '1px solid rgba(100,140,190,0.14)', backdropFilter: 'blur(10px)' }}
                  >
                    <div className="h-px w-full mb-3" style={{ background: 'linear-gradient(90deg,rgba(100,150,210,0.25),transparent)' }} />
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(150,175,205,0.65)' }}>{trait}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-5">
              <motion.div {...fadeUp(0.1)} className="rounded-sm overflow-hidden"
                style={{ background: 'rgba(8,14,32,0.65)', border: '1px solid rgba(100,140,190,0.16)', backdropFilter: 'blur(14px)' }}
              >
                <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(100,140,190,0.1)' }}>
                  <span className="font-mono text-[9px] tracking-[0.38em] uppercase" style={{ color: ICE_DIM }}>SNAPSHOT</span>
                  <motion.span
                    className="ml-auto w-[5px] h-[5px] rounded-full"
                    style={{ background: GOLD }}
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                  />
                </div>
                <div className="px-5 py-5 flex flex-col gap-5">
                  {SNAPSHOT.map(({ label, value }) => (
                    <div key={label}>
                      <p className="font-mono text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: 'rgba(110,140,175,0.5)' }}>{label}</p>
                      <p style={{ color: 'rgba(200,218,238,0.82)', fontSize: '0.92rem' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div {...fadeUp(0.2)} className="rounded-sm overflow-hidden"
                style={{ background: 'rgba(8,14,32,0.55)', border: '1px solid rgba(100,140,190,0.13)', backdropFilter: 'blur(12px)' }}
              >
                <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(100,140,190,0.1)' }}>
                  <span className="font-mono text-[9px] tracking-[0.38em] uppercase" style={{ color: ICE_DIM }}>EDUCATION LOG</span>
                </div>
                <div className="px-5 py-5 flex flex-col gap-5">
                  {[
                    { degree: 'B.E. Computer Engineering',    inst: 'Mumbai University',       grade: 'CGPA: 7.24', year: 'Graduating July 2026' },
                    { degree: 'Diploma Computer Engineering', inst: 'Vidyalankar Polytechnic', grade: '83.71%',     year: 'July 2022' },
                  ].map((edu, i) => (
                    <div key={i} className="pl-4" style={{ borderLeft: '2px solid rgba(100,140,190,0.2)' }}>
                      <p style={{ color: 'rgba(210,225,245,0.88)', fontWeight: 600, fontSize: '0.9rem' }}>{edu.degree}</p>
                      <p style={{ color: 'rgba(140,170,205,0.6)', fontSize: '0.82rem', marginTop: 2 }}>{edu.inst} · {edu.grade}</p>
                      <p style={{ color: 'rgba(100,130,165,0.45)', fontSize: '0.75rem', marginTop: 2 }}>{edu.year}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}