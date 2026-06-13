import React from 'react';
import Hero from './Hero';
import About from './About';

export default function Home() {
  return (
    <main
      className="relative text-white"
      style={{
        // Single continuous background for the entire page
        background: `linear-gradient(180deg, #071426 0%, #050B18 25%, #030712 50%, #030712 100%)`,
      }}
    >
      {/* ── Planet — lives on main, not inside any section ── */}
      {/* Positioned so it spans the Hero/About boundary naturally */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{
          top: '42vh',                          // starts in lower Hero
          width: 'clamp(520px, 68vw, 900px)',
          height: 'clamp(520px, 68vw, 900px)',
          borderRadius: '50%',
          zIndex: 1,
          background: `
            radial-gradient(circle at 50% 43%, rgba(255,255,255,0.045), transparent 22%),
            radial-gradient(circle at 50% 36%, rgba(77,163,255,0.09), transparent 30%),
            linear-gradient(180deg,
              rgba(217,216,210,0.82) 0%,
              rgba(123,136,151,0.84) 8%,
              rgba(57,73,91,0.96)    16%,
              rgba(26,35,47,1)       24%,
              rgba(69,84,101,0.93)   31%,
              rgba(20,29,42,1)       39%,
              rgba(90,106,121,0.86)  47%,
              rgba(17,24,35,1)       55%,
              rgba(74,89,104,0.83)   64%,
              rgba(15,21,31,1)       72%,
              rgba(52,65,79,0.86)    80%,
              rgba(7,12,20,1)        100%
            )
          `,
          // Glow ring
          boxShadow: `
            0 0 0 1px rgba(77,163,255,0.06),
            0 0 80px rgba(77,163,255,0.10),
            0 0 200px rgba(77,163,255,0.06)
          `,
        }}
      >
        {/* Atmosphere rim */}
        <div
          className="absolute rounded-full"
          style={{
            inset: '-5%',
            background:
              'radial-gradient(circle, transparent 60%, rgba(140,190,255,0.08) 66%, rgba(77,163,255,0.14) 71%, transparent 78%)',
            filter: 'blur(10px)',
          }}
        />
        {/* Band shimmer */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(180deg,
              transparent 0%, rgba(255,255,255,0.04) 7%, transparent 15%,
              rgba(255,255,255,0.025) 23%, transparent 32%,
              rgba(255,255,255,0.03) 41%, transparent 50%,
              rgba(255,255,255,0.02) 59%, transparent 68%,
              rgba(255,255,255,0.025) 77%, transparent 100%
            )`,
          }}
        />
        {/* Bottom fade — blends into void, kills hard circle edge */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(180deg,
              transparent 35%,
              rgba(5,11,24,0.3) 55%,
              rgba(3,7,18,0.75) 72%,
              rgba(3,7,18,0.97) 88%,
              rgba(3,7,18,1) 100%
            )`,
          }}
        />
        {/* Side fades — kills hard left/right circle edges */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(ellipse 100% 100% at 50% 50%,
              transparent 55%,
              rgba(3,7,18,0.4) 72%,
              rgba(3,7,18,0.88) 85%,
              rgba(3,7,18,1) 100%
            )`,
          }}
        />
      </div>

      {/* Blue ambient glow at Hero/About boundary */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{
          top: '82vh',
          width: '85vw',
          height: '35vh',
          zIndex: 1,
          background:
            'radial-gradient(ellipse at center, rgba(77,163,255,0.06) 0%, transparent 70%)',
          filter: 'blur(28px)',
        }}
      />

      {/* Sections — transparent, z-10 so they sit above planet */}
      <div className="relative" style={{ zIndex: 10 }}>
        <Hero />
        <About />
      </div>
    </main>
  );
}