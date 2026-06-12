// Hero.jsx — Singularity Core
// Deep space golden energy hero for Jay Makwana's portfolio
// Stack: React + TailwindCSS + Framer Motion

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const MODULES = [
  { id: 'projects',    label: 'PROJECT ARCHIVE',   sub: '12 SELECTED OPERATIONS' },
  { id: 'experience',  label: 'SYSTEM EXPERIENCE',  sub: '4+ YEARS DEPLOYED'       },
  { id: 'skills',      label: 'TECH STACK',          sub: 'FULL-SPECTRUM CAPABILITY' },
  { id: 'contact',     label: 'CONTACT CHANNEL',     sub: 'OPEN TRANSMISSION'       },
];

const SOCIALS = [
  { href: 'https://github.com/jaypmakwana',       icon: Github,   label: 'GitHub'   },
  { href: 'https://linkedin.com/in/jaypmakwana',  icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:jaypmakwana007@gmail.com',      icon: Mail,     label: 'Email'    },
];

const GOLD        = '#F3E5AB';
const GOLD_BRIGHT = 'rgba(255,214,90,1)';
const GOLD_MID    = 'rgba(255,214,90,0.5)';
const GOLD_DIM    = 'rgba(255,214,90,0.15)';
const GOLD_FAINT  = 'rgba(255,214,90,0.06)';

// ─── Starfield Canvas ─────────────────────────────────────────────────────────
// Tiny white/warm stars with slow drift. Separate from golden dust layer.

const StarCanvas = () => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width  = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let raf;

    const stars = Array.from({ length: 160 }, () => ({
      x:     Math.random() * w,
      y:     Math.random() * h,
      r:     0.2 + Math.random() * 0.9,
      vx:    (Math.random() - 0.5) * 0.04,
      vy:    (Math.random() - 0.5) * 0.04,
      alpha: 0.04 + Math.random() * 0.28,
      phase: Math.random() * Math.PI * 2,
      spd:   0.002 + Math.random() * 0.004,
    }));

    const resize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.phase += s.spd;
        s.x     += s.vx;
        s.y     += s.vy;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;
        const a = s.alpha * (0.5 + 0.5 * Math.sin(s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        // Warm white-gold tint for stars
        ctx.fillStyle = `rgba(255,245,220,${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
};

// ─── Cosmic Dust Canvas ───────────────────────────────────────────────────────
// Faint golden particles floating slowly upward — distinct from stars.

const CosmicDustCanvas = () => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width  = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let raf;

    const dust = Array.from({ length: 55 }, () => ({
      x:     Math.random() * w,
      y:     Math.random() * h,
      r:     0.4 + Math.random() * 1.1,
      vy:    -(0.06 + Math.random() * 0.18), // upward drift
      vx:    (Math.random() - 0.5) * 0.05,
      alpha: 0.02 + Math.random() * 0.1,
      phase: Math.random() * Math.PI * 2,
      spd:   0.003 + Math.random() * 0.006,
    }));

    const resize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dust) {
        d.phase += d.spd;
        d.x     += d.vx;
        d.y     += d.vy;
        // Wrap: re-spawn at bottom when particle exits top
        if (d.y < -4) { d.y = h + 4; d.x = Math.random() * w; }
        if (d.x < 0) d.x = w;
        if (d.x > w) d.x = 0;
        const a = d.alpha * (0.5 + 0.5 * Math.sin(d.phase));
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,214,90,${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 1 }}
    />
  );
};

// ─── Singularity Core ─────────────────────────────────────────────────────────
// Central golden energy sphere with breathing animation + orbital rings.

const OrbitParticle = ({ angle, radius, duration, size = 2 }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      top: '50%',
      left: '50%',
      background: GOLD_BRIGHT,
      boxShadow: `0 0 6px rgba(255,214,90,0.6)`,
      opacity: 0.35,
    }}
    animate={{
      x: [
        Math.cos((angle * Math.PI) / 180) * radius - size / 2,
        Math.cos(((angle + 360) * Math.PI) / 180) * radius - size / 2,
      ],
      y: [
        Math.sin((angle * Math.PI) / 180) * radius - size / 2,
        Math.sin(((angle + 360) * Math.PI) / 180) * radius - size / 2,
      ],
    }}
    transition={{ duration, repeat: Infinity, ease: 'linear' }}
  />
);

const SingularityCore = () => (
  <div
    className="absolute pointer-events-none"
    style={{
      top: '50%', left: '50%',
      transform: 'translate(-50%, -52%)',
      width: 500, height: 500,
    }}
  >
    {/* Outermost ambient haze */}
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{
        background: `radial-gradient(circle, rgba(255,214,90,0.05) 0%, rgba(255,214,90,0.02) 45%, transparent 70%)`,
        filter: 'blur(12px)',
      }}
      animate={{ scale: [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Core glow — the singularity body */}
    <motion.div
      className="absolute rounded-full"
      style={{
        inset: 130,
        background: `radial-gradient(
          circle,
          rgba(255,214,90,0.25),
          rgba(255,214,90,0.10),
          rgba(255,214,90,0.03),
          transparent
        )`,
        filter: 'blur(4px)',
      }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Inner bright nucleus */}
    <motion.div
      className="absolute rounded-full"
      style={{
        inset: 218,
        background: `radial-gradient(circle, rgba(255,236,160,0.45), rgba(255,214,90,0.2), transparent)`,
        filter: 'blur(2px)',
      }}
      animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Pulse ring — outer */}
    <motion.div
      className="absolute rounded-full"
      style={{
        inset: 90,
        border: `1px solid rgba(255,214,90,0.08)`,
      }}
      animate={{ scale: [1, 1.14, 1], opacity: [0.4, 0, 0.4] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Pulse ring — inner */}
    <motion.div
      className="absolute rounded-full"
      style={{
        inset: 140,
        border: `1px solid rgba(255,214,90,0.1)`,
      }}
      animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0, 0.35] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
    />

    {/* Orbiting particles — slow gravity paths */}
    <OrbitParticle angle={0}   radius={210} duration={90}  size={2}   />
    <OrbitParticle angle={120} radius={210} duration={90}  size={1.5} />
    <OrbitParticle angle={240} radius={210} duration={90}  size={2}   />
    <OrbitParticle angle={60}  radius={178} duration={110} size={1.4} />
    <OrbitParticle angle={200} radius={178} duration={110} size={1.4} />
    <OrbitParticle angle={300} radius={155} duration={130} size={1.2} />
    <OrbitParticle angle={80}  radius={155} duration={130} size={1.2} />
    <OrbitParticle angle={160} radius={195} duration={75}  size={1.6} />
  </div>
);

// ─── Magnetic Cursor Hook ─────────────────────────────────────────────────────

const useMagnet = (strength = 0.3) => {
  const x  = useMotionValue(0);
  const y  = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  const onMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }, [x, y, strength]);

  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return { sx, sy, onMove, onLeave };
};

// ─── Interface Module Card ────────────────────────────────────────────────────

const ModuleCard = ({ mod, index }) => {
  const { sx, sy, onMove, onLeave } = useMagnet(0.25);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={`#${mod.id}`}
      className="relative block overflow-hidden rounded-sm cursor-pointer select-none"
      style={{ x: sx, y: sy }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 2.8 + index * 0.14,
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ scale: 1.04, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
      whileTap={{ scale: 0.97 }}
      onMouseMove={onMove}
      onMouseLeave={() => { onLeave(); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
    >
      <div
        className="relative px-5 py-4 flex flex-col gap-1"
        style={{
          background: hovered
            ? 'rgba(255,214,90,0.04)'
            : 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border: `1px solid ${hovered ? 'rgba(255,214,90,0.5)' : GOLD_DIM}`,
          boxShadow: hovered ? '0 0 25px rgba(255,214,90,0.2)' : 'none',
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease, background 0.4s ease',
          minWidth: 148,
        }}
      >
        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px]"
          animate={{
            background: hovered
              ? `linear-gradient(90deg, transparent, rgba(255,214,90,0.6), transparent)`
              : `linear-gradient(90deg, transparent, rgba(255,214,90,0.08), transparent)`,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Label */}
        <span
          className="font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{ color: hovered ? GOLD : 'rgba(200,190,160,0.65)' }}
        >
          {mod.label}
        </span>

        {/* Sub text */}
        <span
          className="font-mono text-[8.5px] tracking-[0.22em]"
          style={{ color: 'rgba(160,148,110,0.55)' }}
        >
          {mod.sub}
        </span>

        {/* Hover shimmer */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,214,90,0.04) 0%, transparent 60%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        {/* Bottom glow on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
              style={{
                width: 60, height: 1,
                background: 'rgba(255,214,90,0.7)',
                boxShadow: '0 0 14px rgba(255,214,90,0.5)',
                filter: 'blur(0.5px)',
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.35 }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.a>
  );
};

// ─── Side Dock ────────────────────────────────────────────────────────────────

const DockItem = ({ social, index }) => {
  const Icon = social.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative flex items-center"
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 3.2 + index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="absolute left-10 font-mono text-[9px] tracking-[0.28em] uppercase whitespace-nowrap pointer-events-none"
            style={{ color: 'rgba(255,214,90,0.6)' }}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.2 }}
          >
            {social.label}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.a
        href={social.href}
        target="_blank"
        rel="noreferrer"
        className="relative flex items-center justify-center rounded-sm"
        style={{
          width: 34, height: 34,
          background: hovered ? 'rgba(255,214,90,0.07)' : 'rgba(255,255,255,0.025)',
          border: `1px solid ${hovered ? 'rgba(255,214,90,0.3)' : 'rgba(255,214,90,0.08)'}`,
          backdropFilter: 'blur(12px)',
          color: hovered ? GOLD : 'rgba(150,140,100,0.7)',
          transition: 'all 0.3s ease',
          boxShadow: hovered ? '0 0 14px rgba(255,214,90,0.18)' : 'none',
        }}
        whileHover={{ scale: 1.14, y: -2 }}
        whileTap={{ scale: 0.93 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Icon size={14} />
      </motion.a>
    </motion.div>
  );
};

const SideDock = () => (
  <motion.div
    className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-3"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 3.1, duration: 1 }}
  >
    <div
      className="w-[1px] h-14"
      style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,214,90,0.12))' }}
    />
    {SOCIALS.map((s, i) => (
      <DockItem key={s.label} social={s} index={i} />
    ))}
    <div
      className="w-[1px] h-14"
      style={{ background: 'linear-gradient(to top, transparent, rgba(255,214,90,0.12))' }}
    />
  </motion.div>
);

// ─── HUD Corners ──────────────────────────────────────────────────────────────

const HUDCorners = () => {
  const corners = [
    'top-5 left-5 border-t border-l',
    'top-5 right-5 border-t border-r',
    'bottom-5 left-5 border-b border-l',
    'bottom-5 right-5 border-b border-r',
  ];
  return (
    <>
      {corners.map((c, i) => (
        <motion.div
          key={i}
          className={`absolute w-6 h-6 pointer-events-none ${c}`}
          style={{ borderColor: 'rgba(255,214,90,0.12)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.08, duration: 0.8 }}
        />
      ))}
    </>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero = () => (
  <div
    id="home"
    className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center"
    style={{ background: '#000000' }}
  >
    {/* ── Layer 1: Starfield ── */}
    <StarCanvas />

    {/* ── Layer 2: Cosmic golden dust ── */}
    <CosmicDustCanvas />

    {/* ── Layer 3: Deep space radial ambient ── */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 50%,
          rgba(255,214,90,0.03) 0%,
          rgba(120,90,20,0.015) 40%,
          transparent 72%
        )`,
      }}
    />

    {/* ── Singularity Core (behind text) ── */}
    <SingularityCore />

    {/* ── Large center radial glow ── */}
    <motion.div
      className="absolute pointer-events-none"
      style={{
        top: '50%', left: '50%',
        transform: 'translate(-50%, -52%)',
        width: 680, height: 480,
        background: `radial-gradient(ellipse at center,
          rgba(255,214,90,0.04) 0%,
          rgba(180,140,40,0.015) 45%,
          transparent 72%
        )`,
        filter: 'blur(6px)',
      }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* ── HUD corners ── */}
    <HUDCorners />

    {/* ── Side dock ── */}
    <SideDock />

    {/* ── Bottom system bar ── */}
    <motion.div
      className="absolute bottom-5 left-0 right-0 flex justify-between px-8 pointer-events-none z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.4, duration: 0.9 }}
    >
      <span className="font-mono text-[8px] tracking-[0.36em] uppercase"
        style={{ color: 'rgba(120,100,50,0.5)' }}>
        SINGULARITY.CORE
      </span>
      <motion.span
        className="font-mono text-[8px] tracking-[0.36em] uppercase"
        style={{ color: 'rgba(255,214,90,0.3)' }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        ● SYSTEM ONLINE
      </motion.span>
      <span className="font-mono text-[8px] tracking-[0.36em] uppercase"
        style={{ color: 'rgba(120,100,50,0.5)' }}>
        JAY MAKWANA
      </span>
    </motion.div>

    {/* ── Main content ── */}
    <div className="relative z-20 flex flex-col items-center text-center px-6 gap-8">

      {/* Identity emergence — name forms from singularity light */}
      <div className="flex flex-col items-center leading-none gap-2">

        {/* JAY — primary identity */}
        <motion.h1
          className="font-light select-none"
          style={{
            fontSize: 'clamp(5.5rem, 18vw, 13rem)',
            lineHeight: 0.88,
            letterSpacing: '0.12em',
            color: GOLD,
            textShadow: `
              0 0 40px rgba(255,214,90,0.25),
              0 0 80px rgba(255,214,90,0.1),
              0 0 120px rgba(255,214,90,0.05)
            `,
            fontWeight: 300,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 1.5, ease: 'easeOut' }}
        >
          JAY
        </motion.h1>

        {/* MAKWANA — secondary identity */}
        <motion.div
          className="flex items-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1.2, ease: 'easeOut' }}
        >
          <div
            className="h-[1px] w-10"
            style={{ background: `linear-gradient(90deg, transparent, rgba(255,214,90,0.3))` }}
          />
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 'clamp(0.55rem, 1.6vw, 0.9rem)',
              letterSpacing: '0.55em',
              color: 'rgba(200,180,110,0.55)',
            }}
          >
            MAKWANA
          </span>
          <div
            className="h-[1px] w-10"
            style={{ background: `linear-gradient(90deg, rgba(255,214,90,0.3), transparent)` }}
          />
        </motion.div>
      </div>

      {/* Mission statement */}
      <motion.div
        className="flex flex-col items-center gap-0.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.1, ease: 'easeOut' }}
      >
        {[
          'ENGINEERING DIGITAL REALITY',
          'THROUGH SCALABLE SYSTEMS',
          'AND IMMERSIVE DESIGN',
        ].map((line, i) => (
          <p
            key={i}
            className="font-mono uppercase"
            style={{
              fontSize: 'clamp(0.5rem, 1.2vw, 0.7rem)',
              letterSpacing: '0.3em',
              color: 'rgba(180,160,90,0.35)',
              fontWeight: 300,
            }}
          >
            {line}
          </p>
        ))}
      </motion.div>

      {/* Interface modules */}
      <div className="flex flex-wrap justify-center gap-3 mt-1">
        {MODULES.map((mod, i) => (
          <ModuleCard key={mod.id} mod={mod} index={i} />
        ))}
      </div>

    </div>
  </div>
);

export default Hero;
