// SpaceScene.jsx
// Renders a tall static background spanning Hero + About (200vh)
// Planet is a CSS div — no canvas clipping issues
// Hero and About both stay transparent

import React from 'react';

export default function SpaceScene() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0"
      style={{ height: '200vh' }} // covers Hero (100vh) + About (~100vh)
    >
      {/* ── Deep space base gradient ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg,
            #071426 0%,
            #050B18 30%,
            #030712 55%,
            #030712 100%
          )`,
        }}
      />

      {/* ── Gas Giant planet ── */}
      {/* Centered horizontally, top at ~55vh so it straddles Hero/About boundary */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: '55vh',
          width: 'min(72vw, 820px)',
          height: 'min(72vw, 820px)',
          borderRadius: '50%',
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
          boxShadow: '0 0 120px rgba(77,163,255,0.12), 0 0 220px rgba(77,163,255,0.07)',
        }}
      >
        {/* Atmosphere ring */}
        <div
          className="absolute rounded-full"
          style={{
            inset: '-4%',
            background: 'radial-gradient(circle, transparent 61%, rgba(170,210,255,0.09) 67%, rgba(77,163,255,0.16) 72%, transparent 79%)',
            filter: 'blur(8px)',
          }}
        />
        {/* Surface band shimmer */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(180deg,
              transparent 0%,
              rgba(255,255,255,0.04) 7%,
              transparent 15%,
              rgba(255,255,255,0.025) 23%,
              transparent 31%,
              rgba(255,255,255,0.035) 40%,
              transparent 48%,
              rgba(255,255,255,0.02) 57%,
              transparent 65%,
              rgba(255,255,255,0.03) 73%,
              transparent 100%
            )`,
          }}
        />
        {/* Bottom dark fade — blends planet into void */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(180deg, transparent 40%, rgba(3,7,18,0.5) 70%, rgba(3,7,18,0.92) 100%)',
          }}
        />
      </div>

      {/* ── Blue ambient glow below planet ── */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: '88vh',
          width: '90vw',
          height: '40vh',
          background: 'radial-gradient(ellipse at center, rgba(77,163,255,0.07) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />
    </div>
  );
}