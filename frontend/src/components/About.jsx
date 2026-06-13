// About.jsx — Space Edition
// transparent bg so StarBackground bleeds through from global layer
// matches Hero's cold ice-blue HUD palette

import React from 'react';
import { motion } from 'framer-motion';

const GOLD     = '#FFD65A';
const ICE      = 'rgba(160,195,220,0.65)';
const ICE_DIM  = 'rgba(140,175,200,0.28)';

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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] },
  viewport: { once: true },
});

const About = () => (
  <section
    id="about"
    className="relative py-28 overflow-hidden"
    style={{ background: 'transparent' }}
  >
    {/* Subtle section ambient — cold blue radial, faint */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse 70% 60% at 60% 40%, rgba(40,70,150,0.07) 0%, transparent 70%)',
      }}
    />

    <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">

      {/* Section label */}
      <motion.p
        {...fadeUp(0)}
        className="font-mono text-[10px] tracking-[0.45em] uppercase mb-4"
        style={{ color: GOLD }}
      >
        01. ABOUT ME
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

        {/* ── Left: Headline + bio + trait cards ── */}
        <div className="flex flex-col gap-8">

          <motion.h2
            {...fadeUp(0.08)}
            className="font-bold leading-tight"
            style={{
              fontSize: 'clamp(1.9rem, 4.5vw, 3.2rem)',
              color: 'rgba(220,232,248,0.93)',
              lineHeight: 1.12,
            }}
          >
            Building thoughtful digital products with strong engineering foundations.
          </motion.h2>

          <motion.p
            {...fadeUp(0.16)}
            style={{
              color: 'rgba(150,175,205,0.7)',
              fontSize: 'clamp(0.875rem, 1.4vw, 1rem)',
              lineHeight: 1.75,
              maxWidth: '54ch',
            }}
          >
            I am a software engineer focused on creating clean, scalable, and premium
            user experiences across web, mobile, and AI-powered products. I care deeply
            about product quality, engineering detail, and interfaces that feel polished
            from the first interaction.
          </motion.p>

          {/* Trait cards — 2×2 glass grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TRAITS.map((trait, i) => (
              <motion.div
                key={i}
                {...fadeUp(0.22 + i * 0.07)}
                className="px-4 py-4 rounded-sm"
                style={{
                  background: 'rgba(10,18,40,0.55)',
                  border: '1px solid rgba(100,140,190,0.14)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                {/* Top accent line */}
                <div
                  className="h-px w-full mb-3"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(100,150,210,0.25), transparent)',
                  }}
                />
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(150,175,205,0.65)' }}
                >
                  {trait}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Right: Snapshot card + Education ── */}
        <div className="flex flex-col gap-5">

          {/* Snapshot panel */}
          <motion.div
            {...fadeUp(0.1)}
            className="rounded-sm overflow-hidden"
            style={{
              background: 'rgba(8,14,32,0.65)',
              border: '1px solid rgba(100,140,190,0.16)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
            }}
          >
            {/* Panel header */}
            <div
              className="px-5 py-3 flex items-center gap-2"
              style={{ borderBottom: '1px solid rgba(100,140,190,0.1)' }}
            >
              <span
                className="font-mono text-[9px] tracking-[0.38em] uppercase"
                style={{ color: ICE_DIM }}
              >
                SNAPSHOT
              </span>
              {/* Gold status dot */}
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
                  <p
                    className="font-mono text-[9px] tracking-[0.3em] uppercase mb-1"
                    style={{ color: 'rgba(110,140,175,0.5)' }}
                  >
                    {label}
                  </p>
                  <p style={{ color: 'rgba(200,218,238,0.82)', fontSize: '0.92rem' }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Education card */}
          <motion.div
            {...fadeUp(0.2)}
            className="rounded-sm overflow-hidden"
            style={{
              background: 'rgba(8,14,32,0.55)',
              border: '1px solid rgba(100,140,190,0.13)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <div
              className="px-5 py-3"
              style={{ borderBottom: '1px solid rgba(100,140,190,0.1)' }}
            >
              <span
                className="font-mono text-[9px] tracking-[0.38em] uppercase"
                style={{ color: ICE_DIM }}
              >
                EDUCATION LOG
              </span>
            </div>
            <div className="px-5 py-5 flex flex-col gap-5">
              {[
                {
                  degree: 'B.E. Computer Engineering',
                  inst: 'Mumbai University',
                  grade: 'CGPA: 7.24',
                  year: 'Graduating July 2026',
                },
                {
                  degree: 'Diploma Computer Engineering',
                  inst: 'Vidyalankar Polytechnic',
                  grade: '83.71%',
                  year: 'July 2022',
                },
              ].map((edu, i) => (
                <div
                  key={i}
                  className="pl-4"
                  style={{ borderLeft: '2px solid rgba(100,140,190,0.2)' }}
                >
                  <p style={{ color: 'rgba(210,225,245,0.88)', fontWeight: 600, fontSize: '0.9rem' }}>
                    {edu.degree}
                  </p>
                  <p style={{ color: 'rgba(140,170,205,0.6)', fontSize: '0.82rem', marginTop: 2 }}>
                    {edu.inst} · {edu.grade}
                  </p>
                  <p style={{ color: 'rgba(100,130,165,0.45)', fontSize: '0.75rem', marginTop: 2 }}>
                    {edu.year}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  </section>
);

export default About;