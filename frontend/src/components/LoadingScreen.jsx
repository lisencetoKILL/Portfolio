import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const TL = {
  logoStart: 400,
  logoEnd: 6000,
  envStart: 6300,
  envEnd: 8800,
  particlesStart: 8800,
  heroStart: 10500,
  particlesEnd: 11500,
  unmount: 12000,
};

const ENV_LINES = [
  'ENTERING DEVELOPER ENVIRONMENT',
  'SYSTEM INITIALIZING...',
  'Loading creative systems',
  'Preparing AI modules',
  'Launching interface',
];

const clamp01 = (v) => Math.max(0, Math.min(1, v));

/* ─── Audio ─── */
const useAudio = () => {
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current)
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const playBootHum = useCallback(() => {
    const ac = getCtx();
    const dur = 6.0;
    const osc1 = ac.createOscillator();
    const gain1 = ac.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(52, ac.currentTime);
    osc1.frequency.linearRampToValueAtTime(70, ac.currentTime + dur);
    osc1.detune.value = -8;
    gain1.gain.setValueAtTime(0, ac.currentTime);
    gain1.gain.linearRampToValueAtTime(0.05, ac.currentTime + 1.2);
    gain1.gain.linearRampToValueAtTime(0.028, ac.currentTime + dur - 0.8);
    gain1.gain.linearRampToValueAtTime(0, ac.currentTime + dur);
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 180;
    osc1.connect(filter); filter.connect(gain1); gain1.connect(ac.destination);
    osc1.start(ac.currentTime); osc1.stop(ac.currentTime + dur);

    const osc2 = ac.createOscillator();
    const gain2 = ac.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(220, ac.currentTime);
    osc2.frequency.linearRampToValueAtTime(440, ac.currentTime + dur * 0.7);
    gain2.gain.setValueAtTime(0, ac.currentTime);
    gain2.gain.linearRampToValueAtTime(0.02, ac.currentTime + 2.0);
    gain2.gain.linearRampToValueAtTime(0.01, ac.currentTime + dur - 1.0);
    gain2.gain.linearRampToValueAtTime(0, ac.currentTime + dur);
    osc2.connect(gain2); gain2.connect(ac.destination);
    osc2.start(ac.currentTime); osc2.stop(ac.currentTime + dur);
  }, [getCtx]);

  const playTick = useCallback(() => {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ac.currentTime + 0.1);
    gain.gain.setValueAtTime(0.02, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.12);
    osc.connect(gain); gain.connect(ac.destination);
    osc.start(ac.currentTime); osc.stop(ac.currentTime + 0.15);
  }, [getCtx]);

  useEffect(() => () => { ctxRef.current?.close(); }, []);
  return { playBootHum, playTick };
};

/* ─── Video ─── */
const ParticleVideo = ({ videoRef, opacity, muted }) => (
  <video
    ref={videoRef}
    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
    src="/PS5-startup-4k.mp4"
    muted={muted}
    playsInline
    preload="auto"
    style={{ opacity }}
  />
);

const ENERGY_DURATION = TL.envStart;           // 6300ms
const LAST_SPAWN_AT   = ENERGY_DURATION - 1100; // 5200ms
const LAST_TRAVEL_MS  = 900;
const AMBIENT_COUNT   = 40;

function makeAmbient(canvasW, canvasH) {
  return {
    x:       Math.random() * canvasW,
    y:       Math.random() * canvasH,
    vx:      (Math.random() - 0.5) * 0.35,
    vy:      (Math.random() - 0.5) * 0.35,
    wobbleX: Math.random() * Math.PI * 2,
    wobbleY: Math.random() * Math.PI * 2,
    wobbleSpeedX: 0.0008 + Math.random() * 0.0006,
    wobbleSpeedY: 0.0008 + Math.random() * 0.0006,
    wobbleAmp:    8 + Math.random() * 14,
    size:    1.2 + Math.random() * 1.8,
    alpha:   0.18 + Math.random() * 0.28,
    g:       160 + Math.floor(Math.random() * 60),
    b:       20  + Math.floor(Math.random() * 40),
    converging: false,
    startX: 0, startY: 0,
    angle: 0, startDist: 0,
    travelMs: 0, spawnAt: 0,
    cx: 0, cy: 0,
  };
}

function makeSwarmParticle(canvasW, canvasH) {
  const cx = canvasW / 2;
  const cy = canvasH / 2;
  const angle = Math.random() * Math.PI * 2;
  const startDist = 200 + Math.random() * 220;
  return {
    isFreeFloat: false,
    converging: true,
    cx, cy,
    angle,
    startDist,
    x: cx + Math.cos(angle) * startDist,
    y: cy + Math.sin(angle) * startDist,
    size:     1.4 + Math.random() * 2.2,
    travelMs: 900 + Math.random() * 1300,
    spawnAt:  0,
    g: 180 + Math.floor(Math.random() * 55),
    b: 40  + Math.floor(Math.random() * 50),
    isLast: false,
  };
}

const EnergyCanvas = ({ logoVisible, clicked }) => {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const stateRef  = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const ambient = Array.from({ length: AMBIENT_COUNT }, () =>
      makeAmbient(canvas.width, canvas.height)
    );

    stateRef.current = {
      ambient,
      swarm: [],
      lastSpawned: false,
      hitFlash: 0,
      clickedAt: null,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── CHANGE 1: staggered spawnAt so dots arrive spread across 0–4800ms ──
  useEffect(() => {
    if (!clicked) return;
    const s      = stateRef.current;
    if (!s) return;
    const canvas = canvasRef.current;
    const cx     = canvas.width  / 2;
    const cy     = canvas.height / 2;
    const now    = performance.now();
    s.clickedAt  = now;

    s.ambient.forEach((p, i) => {
      p.converging  = true;
      p.startX      = p.x;
      p.startY      = p.y;
      const dx      = cx - p.x;
      const dy      = cy - p.y;
      p.startDist   = Math.sqrt(dx * dx + dy * dy);
      p.angle       = Math.atan2(dy, dx);
      // stagger: spread all 40 dots across 0ms to 4800ms
      p.spawnAt     = (i / AMBIENT_COUNT) * 4800 + Math.random() * 300;
      // slow travel: each takes 0.8–1.4s once it starts moving
      p.travelMs    = 800 + Math.random() * 600;
      p.cx          = cx;
      p.cy          = cy;
    });
  }, [clicked]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const TARGET_R = 48;

    const draw = (now) => {
      const s = stateRef.current;
      if (!s) { rafRef.current = requestAnimationFrame(draw); return; }

      const elapsed = s.clickedAt != null ? now - s.clickedAt : null;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!logoVisible) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const cx = canvas.width  / 2;
      const cy = canvas.height / 2;

      // ── CHANGE 3: swarm spawner block REMOVED entirely ──

      /* ── Spawn the ONE final particle ── */
      if (elapsed != null && !s.lastSpawned && elapsed >= LAST_SPAWN_AT) {
        s.lastSpawned = true;
        const lp      = makeSwarmParticle(canvas.width, canvas.height);
        lp.spawnAt    = elapsed;
        lp.travelMs   = LAST_TRAVEL_MS;
        lp.startDist  = 260;
        lp.size       = 3.8;
        lp.g          = 230;
        lp.b          = 120;
        lp.isLast     = true;
        s.swarm.push(lp);
      }

      /* ── Hit flash ── */
      if (s.hitFlash > 0) {
        const fa = s.hitFlash;
        const fr = TARGET_R + (1 - fa) * 55;
        const fg = ctx.createRadialGradient(cx, cy, 0, cx, cy, fr);
        fg.addColorStop(0,   `rgba(255,255,255,${fa * 0.95})`);
        fg.addColorStop(0.3, `rgba(255,230,120,${fa * 0.6})`);
        fg.addColorStop(1,   `rgba(255,180,40,0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, fr, 0, Math.PI * 2);
        ctx.fillStyle = fg;
        ctx.fill();
        s.hitFlash = Math.max(0, s.hitFlash - 0.045);
      }

      /* ── Draw ambient floating dots ── */
      s.ambient.forEach((p, idx) => {
        if (p.converging && elapsed != null) {
          const age = elapsed - p.spawnAt;

          // ── CHANGE 2: if not yet time, keep floating freely ──
          if (age < 0) {
            p.wobbleX += p.wobbleSpeedX * 16;
            p.wobbleY += p.wobbleSpeedY * 16;
            p.x += p.vx + Math.sin(p.wobbleX) * 0.18;
            p.y += p.vy + Math.sin(p.wobbleY) * 0.18;
            if (p.x < -10) p.x = canvas.width  + 10;
            if (p.x > canvas.width  + 10) p.x = -10;
            if (p.y < -10) p.y = canvas.height + 10;
            if (p.y > canvas.height + 10) p.y = -10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,${p.g},${p.b},${p.alpha})`;
            ctx.fill();
            return;
          }

          const t      = clamp01(age / p.travelMs);
          const eased  = t * t;
          const dist   = p.startDist * (1 - eased);

          if (dist < TARGET_R) {
            s.hitFlash = Math.max(s.hitFlash, 0.35);
            s.ambient.splice(idx, 1);
            return;
          }

          const ratio = 1 - dist / p.startDist;
          p.x = p.startX + (p.cx - p.startX) * ratio;
          p.y = p.startY + (p.cy - p.startY) * ratio;

          const whiteT  = clamp01(1 - (dist - TARGET_R) / (p.startDist * 0.5));
          const cg      = Math.round(p.g + (255 - p.g) * whiteT);
          const cb      = Math.round(p.b + (255 - p.b) * whiteT);
          const fadeOut = dist < TARGET_R * 2.5
            ? clamp01((dist - TARGET_R) / (TARGET_R * 1.5)) : 1;
          const alpha   = clamp01(t * 6) * fadeOut;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 + whiteT * 0.8), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,${cg},${cb},${alpha})`;
          ctx.fill();

          if (whiteT > 0.6) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${alpha * (whiteT - 0.6) * 1.5})`;
            ctx.fill();
          }
        } else {
          p.wobbleX += p.wobbleSpeedX * 16;
          p.wobbleY += p.wobbleSpeedY * 16;
          p.x += p.vx + Math.sin(p.wobbleX) * 0.18;
          p.y += p.vy + Math.sin(p.wobbleY) * 0.18;

          if (p.x < -10) p.x = canvas.width  + 10;
          if (p.x > canvas.width  + 10) p.x = -10;
          if (p.y < -10) p.y = canvas.height + 10;
          if (p.y > canvas.height + 10) p.y = -10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,${p.g},${p.b},${p.alpha})`;
          ctx.fill();
        }
      });

      /* ── Draw swarm (final particle only) ── */
      if (elapsed != null) {
        for (let i = s.swarm.length - 1; i >= 0; i--) {
          const p   = s.swarm[i];
          const age = elapsed - p.spawnAt;
          const t   = clamp01(age / p.travelMs);

          if (t >= 1) {
            if (p.isLast) s.hitFlash = 1.0;
            s.swarm.splice(i, 1);
            continue;
          }

          const eased = t * t;
          const dist  = p.startDist * (1 - eased);

          if (dist < TARGET_R) {
            if (p.isLast) s.hitFlash = 1.0;
            s.swarm.splice(i, 1);
            continue;
          }

          const x = p.cx + Math.cos(p.angle) * dist;
          const y = p.cy + Math.sin(p.angle) * dist;

          const whiteT = clamp01(1 - (dist - TARGET_R) / (p.startDist * 0.6));
          const cr = 255;
          const cg = Math.round(p.g + (255 - p.g) * whiteT);
          const cb = Math.round(p.b + (255 - p.b) * whiteT);

          const fadeIn  = clamp01(t * 8);
          const fadeOut = dist < TARGET_R * 2.2
            ? clamp01((dist - TARGET_R) / (TARGET_R * 1.2)) : 1;
          const alpha   = fadeIn * fadeOut;

          const trailT     = Math.max(0, t - 0.12);
          const trailEased = trailT * trailT;
          const trailDist  = p.startDist * (1 - trailEased);
          const tx = p.cx + Math.cos(p.angle) * trailDist;
          const ty = p.cy + Math.sin(p.angle) * trailDist;

          const trailWhiteT = clamp01(1 - (trailDist - TARGET_R) / (p.startDist * 0.6));
          const tcg = Math.round(p.g + (255 - p.g) * trailWhiteT);
          const tcb = Math.round(p.b + (255 - p.b) * trailWhiteT);

          const grad = ctx.createLinearGradient(tx, ty, x, y);
          grad.addColorStop(0, `rgba(255,${tcg},${tcb},0)`);
          grad.addColorStop(1, `rgba(${cr},${cg},${cb},${alpha * 0.9})`);

          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(x, y);
          ctx.strokeStyle = grad;
          ctx.lineWidth   = p.size * 1.4 * (0.6 + 0.4 * (1 - eased));
          ctx.lineCap = 'round';
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(x, y, p.size * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
          ctx.fill();

          if (whiteT > 0.75) {
            ctx.beginPath();
            ctx.arc(x, y, p.size * 2.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${alpha * (whiteT - 0.75) * 3.0})`;
            ctx.fill();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
};

/* ─── JM Logo ─── */
const JMLogo = ({ visible, needsUnlock, onUnlock, clicked }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.9 } }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
           {!clicked && [1, 1.35, 1.7].map((scale, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: 0, height: 0,
            }}
          >
            <motion.div
              className="rounded-full border"
              style={{
                width: 120, height: 120,
                marginTop: -60, marginLeft: -60,
                borderColor: `rgba(255,214,90,${0.12 - i * 0.03})`,
              }}
              animate={{ scale: [scale, scale * 1.18, scale], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.55, ease: 'easeInOut' }}
            />
          </div>
        ))}

        {clicked && [1.7, 1.35, 1.0].map((scale, i) => (
          <motion.div
            key={`imp${i}`}
            className="absolute rounded-full border"
            style={{
              width: 120, height: 120,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              borderColor: 'rgba(255,214,90,0.45)',
              zIndex: 11,
            }}
            initial={{ scale, opacity: 0.55 }}
            animate={{ scale: 0.82, opacity: 0 }}
            transition={{ duration: 0.55, delay: i * 0.07, ease: 'easeIn' }}
          />
        ))}

        <motion.button
          type="button"
          onClick={onUnlock}
          className="relative flex items-center justify-center rounded-full pointer-events-auto"
          style={{
            width: 96, height: 96,
            background: 'radial-gradient(circle at 38% 36%, rgba(255,214,90,0.22) 0%, rgba(255,180,40,0.1) 50%, rgba(0,0,0,0.55) 100%)',
            border: '1px solid rgba(255,214,90,0.35)',
            boxShadow: '0 0 32px rgba(255,196,60,0.28), 0 0 8px rgba(255,214,90,0.4) inset',
            zIndex: 12,
          }}
          animate={clicked ? {
            scale: [1, 1.18, 0.94, 1.1, 1],
            boxShadow: [
              '0 0 32px rgba(255,196,60,0.28), 0 0 8px rgba(255,214,90,0.4) inset',
              '0 0 90px rgba(255,200,50,1),    0 0 36px rgba(255,214,90,0.9) inset',
              '0 0 55px rgba(255,196,60,0.5),  0 0 14px rgba(255,214,90,0.5) inset',
              '0 0 70px rgba(255,200,50,0.7),  0 0 22px rgba(255,214,90,0.6) inset',
              '0 0 44px rgba(255,196,60,0.35), 0 0 10px rgba(255,214,90,0.4) inset',
            ],
          } : {
            scale: [1, 1.04, 1],
            boxShadow: [
              '0 0 32px rgba(255,196,60,0.28), 0 0 8px rgba(255,214,90,0.4) inset',
              '0 0 55px rgba(255,196,60,0.5),  0 0 14px rgba(255,214,90,0.6) inset',
              '0 0 32px rgba(255,196,60,0.28), 0 0 8px rgba(255,214,90,0.4) inset',
            ],
          }}
          transition={clicked
            ? { duration: 0.65, ease: 'easeOut' }
            : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <span
            className="font-mono font-bold tracking-widest select-none text-lg"
            style={{ color: '#FFD65A', textShadow: '0 0 14px rgba(255,214,90,0.9)' }}
          >
            JM
          </span>
        </motion.button>

        <AnimatePresence>
          {needsUnlock && !clicked && (
            <motion.p
              className="font-mono text-[10px] tracking-[0.22em] uppercase pointer-events-none"
              style={{ color: 'rgba(255,214,90,0.82)', zIndex: 12 }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              Tap In The Circle To Get In - Audio Starts
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─── Env Text ─── */
const EnvText = ({ visible, visibleLines }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col items-center gap-[10px]">
          {ENV_LINES.map((line, i) => (
            <AnimatePresence key={i}>
              {visibleLines > i && (
                <motion.p
                  className="font-mono text-center"
                  style={{
                    fontSize:
                      i === 0 ? 'clamp(0.65rem, 2.2vw, 0.9rem)'
                      : i === 1 ? 'clamp(0.55rem, 1.6vw, 0.72rem)'
                      : 'clamp(0.5rem, 1.4vw, 0.65rem)',
                    letterSpacing: i < 2 ? '0.38em' : '0.22em',
                    textTransform: i < 2 ? 'uppercase' : 'none',
                    color:
                      i === 0 ? 'rgba(255,214,90,0.9)'
                      : i === 1 ? 'rgba(226,232,240,0.65)'
                      : 'rgba(148,163,184,0.55)',
                    textShadow: i === 0
                      ? '0 0 18px rgba(255,196,60,0.5)'
                      : '0 0 10px rgba(255,214,90,0.15)',
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                >
                  {i < 2 ? line : `> ${line}`}
                </motion.p>
              )}
            </AnimatePresence>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─── LoadingScreen ─── */
const LoadingScreen = ({ onReveal, onComplete }) => {
  const [timelineTime, setTimelineTime]       = useState(0);
  const [sequenceStarted, setSequenceStarted] = useState(false);
  const [clicked, setClicked]                 = useState(false);

  const videoRef       = useRef(null);
  const rafRef         = useRef(0);
  const startRef       = useRef(0);
  const didRevealRef   = useRef(false);
  const didCompleteRef = useRef(false);
  const didBootHumRef  = useRef(false);
  const didTickRef     = useRef(ENV_LINES.map(() => false));

  const { playBootHum, playTick } = useAudio();

  const handleAudioUnlock = useCallback(() => {
    if (clicked) return;
    setClicked(true);
    setSequenceStarted(true);
  }, [clicked]);

  useEffect(() => {
    if (!sequenceStarted) return;
    startRef.current = performance.now();
    const frame = (now) => {
      const elapsed = now - startRef.current;
      const clamped = Math.min(elapsed, TL.unmount);
      setTimelineTime(clamped);
      if (clamped < TL.unmount) rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [sequenceStarted]);

  useEffect(() => {
    const t = timelineTime;
    if (t >= TL.heroStart && !didRevealRef.current) {
      didRevealRef.current = true; onReveal?.();
    }
    if (t >= TL.unmount && !didCompleteRef.current) {
      didCompleteRef.current = true; onComplete?.();
    }
    if (!sequenceStarted) return;
    if (t >= TL.logoStart && !didBootHumRef.current) {
      didBootHumRef.current = true; playBootHum();
    }
    const lineStep = (TL.envEnd - TL.envStart) / (ENV_LINES.length - 1);
    for (let i = 0; i < ENV_LINES.length; i++) {
      const lineTime = TL.envStart + lineStep * i;
      if (t >= lineTime && !didTickRef.current[i]) {
        didTickRef.current[i] = true; playTick();
      }
    }
  }, [onComplete, onReveal, playBootHum, playTick, sequenceStarted, timelineTime]);

  useEffect(() => {
    if (!sequenceStarted || timelineTime < TL.particlesStart) return;
    const v = videoRef.current;
    if (!v || v.dataset.started === 'true') return;
    v.dataset.started = 'true';
    v.muted = false; v.volume = 0.65; v.currentTime = 0;
    const p = v.play(); if (p?.catch) p.catch(() => {});
  }, [sequenceStarted, timelineTime]);

  useEffect(() => {
    if (!sequenceStarted || timelineTime < TL.particlesStart || timelineTime >= TL.particlesEnd) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = false; v.volume = 0.65;
    if (v.paused && !v.ended) { const p = v.play(); if (p?.catch) p.catch(() => {}); }
  }, [sequenceStarted, timelineTime]);

  const logoVisible  = !sequenceStarted || (timelineTime >= TL.logoStart && timelineTime < TL.logoEnd);
  const envVisible   = timelineTime >= TL.envStart && timelineTime < TL.particlesStart;
  const lineStep     = (TL.envEnd - TL.envStart) / (ENV_LINES.length - 1);
  const visibleLines = envVisible
    ? ENV_LINES.filter((_, i) => timelineTime >= TL.envStart + i * lineStep).length
    : 0;

  let particleOpacity = 0;
  if (timelineTime >= TL.particlesStart && timelineTime < TL.particlesStart + 800)
    particleOpacity = clamp01((timelineTime - TL.particlesStart) / 800);
  else if (timelineTime >= TL.particlesStart + 800 && timelineTime < TL.heroStart)
    particleOpacity = 1;
  else if (timelineTime >= TL.heroStart && timelineTime < TL.particlesEnd)
    particleOpacity = 1 - clamp01((timelineTime - TL.heroStart) / 1000);

  const veilOpacity = 1 - clamp01((timelineTime - TL.heroStart) / 1200);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{ background: '#000000' }}>
      <div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: veilOpacity }} />

      <EnergyCanvas logoVisible={logoVisible} clicked={clicked} />

      <JMLogo
        visible={logoVisible}
        needsUnlock={!sequenceStarted}
        onUnlock={handleAudioUnlock}
        clicked={clicked}
      />

      <EnvText visible={envVisible} visibleLines={visibleLines} />
      <ParticleVideo videoRef={videoRef} opacity={particleOpacity} muted={!sequenceStarted} />
    </div>
  );
};

export default LoadingScreen;