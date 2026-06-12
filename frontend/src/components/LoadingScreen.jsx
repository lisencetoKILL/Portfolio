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

const useAudio = () => {
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
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

    osc1.connect(filter);
    filter.connect(gain1);
    gain1.connect(ac.destination);
    osc1.start(ac.currentTime);
    osc1.stop(ac.currentTime + dur);

    const osc2 = ac.createOscillator();
    const gain2 = ac.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(220, ac.currentTime);
    osc2.frequency.linearRampToValueAtTime(440, ac.currentTime + dur * 0.7);
    gain2.gain.setValueAtTime(0, ac.currentTime);
    gain2.gain.linearRampToValueAtTime(0.02, ac.currentTime + 2.0);
    gain2.gain.linearRampToValueAtTime(0.01, ac.currentTime + dur - 1.0);
    gain2.gain.linearRampToValueAtTime(0, ac.currentTime + dur);
    osc2.connect(gain2);
    gain2.connect(ac.destination);
    osc2.start(ac.currentTime);
    osc2.stop(ac.currentTime + dur);
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
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.15);
  }, [getCtx]);

  useEffect(() => () => {
    ctxRef.current?.close();
  }, []);

  return { playBootHum, playTick };
};

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

const JMLogo = ({ visible, needsUnlock, onUnlock }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.9 } }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        {[1, 1.35, 1.7].map((scale, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: 120,
              height: 120,
              borderColor: `rgba(255,214,90,${0.12 - i * 0.03})`,
            }}
            animate={{
              scale: [scale, scale * 1.18, scale],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.55, ease: 'easeInOut' }}
          />
        ))}

        <motion.button
          type="button"
          onClick={onUnlock}
          className="relative flex items-center justify-center rounded-full pointer-events-auto"
          style={{
            width: 96,
            height: 96,
            background: 'radial-gradient(circle at 38% 36%, rgba(255,214,90,0.22) 0%, rgba(255,180,40,0.1) 50%, rgba(0,0,0,0.55) 100%)',
            border: '1px solid rgba(255,214,90,0.35)',
            boxShadow: '0 0 32px rgba(255,196,60,0.28), 0 0 8px rgba(255,214,90,0.4) inset',
          }}
          animate={{
            scale: [1, 1.04, 1],
            boxShadow: [
              '0 0 32px rgba(255,196,60,0.28), 0 0 8px rgba(255,214,90,0.4) inset',
              '0 0 55px rgba(255,196,60,0.5), 0 0 14px rgba(255,214,90,0.6) inset',
              '0 0 32px rgba(255,196,60,0.28), 0 0 8px rgba(255,214,90,0.4) inset',
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span
            className="font-mono font-bold tracking-widest select-none text-lg"
            style={{ color: '#FFD65A', textShadow: '0 0 14px rgba(255,214,90,0.9)' }}
          >
            JM
          </span>
        </motion.button>

        <AnimatePresence>
          {needsUnlock && (
            <motion.p
              className="font-mono text-[10px] tracking-[0.22em] uppercase pointer-events-none"
              style={{ color: 'rgba(255,214,90,0.82)' }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
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

const LoadingScreen = ({ onReveal, onComplete }) => {
  const [timelineTime, setTimelineTime] = useState(0);
  const [sequenceStarted, setSequenceStarted] = useState(false);

  const videoRef = useRef(null);
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const didRevealRef = useRef(false);
  const didCompleteRef = useRef(false);
  const didBootHumRef = useRef(false);
  const didTickRef = useRef(ENV_LINES.map(() => false));

  const { playBootHum, playTick } = useAudio();

  const handleAudioUnlock = useCallback(() => {
    setSequenceStarted(true);
  }, []);

  useEffect(() => {
    if (!sequenceStarted) return;

    startRef.current = performance.now();

    const frame = (now) => {
      const elapsed = now - startRef.current;
      const clamped = Math.min(elapsed, TL.unmount);
      setTimelineTime(clamped);

      if (clamped < TL.unmount) {
        rafRef.current = requestAnimationFrame(frame);
      }
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(rafRef.current);
  }, [sequenceStarted]);

  useEffect(() => {
    const t = timelineTime;

    if (t >= TL.heroStart && !didRevealRef.current) {
      didRevealRef.current = true;
      onReveal?.();
    }

    if (t >= TL.unmount && !didCompleteRef.current) {
      didCompleteRef.current = true;
      onComplete?.();
    }

    if (!sequenceStarted) return;

    if (t >= TL.logoStart && !didBootHumRef.current) {
      didBootHumRef.current = true;
      playBootHum();
    }

    const lineStep = (TL.envEnd - TL.envStart) / (ENV_LINES.length - 1);
    for (let i = 0; i < ENV_LINES.length; i++) {
      const lineTime = TL.envStart + lineStep * i;
      if (t >= lineTime && !didTickRef.current[i]) {
        didTickRef.current[i] = true;
        playTick();
      }
    }
  }, [
    onComplete,
    onReveal,
    playBootHum,
    playTick,
    sequenceStarted,
    timelineTime,
  ]);

  useEffect(() => {
    if (!sequenceStarted || timelineTime < TL.particlesStart) return;
    const v = videoRef.current;
    if (!v) return;
    if (v.dataset.started === 'true') return;

    v.dataset.started = 'true';
    v.muted = false;
    v.volume = 0.65;
    v.currentTime = 0;
    const p = v.play();
    if (p?.catch) p.catch(() => {});
  }, [sequenceStarted, timelineTime]);

  useEffect(() => {
    if (!sequenceStarted || timelineTime < TL.particlesStart || timelineTime >= TL.particlesEnd) return;
    const v = videoRef.current;
    if (!v) return;

    v.muted = false;
    v.volume = 0.65;
    if (v.paused && !v.ended) {
      const p = v.play();
      if (p?.catch) p.catch(() => {});
    }
  }, [sequenceStarted, timelineTime]);

  const logoVisible = !sequenceStarted || (timelineTime >= TL.logoStart && timelineTime < TL.logoEnd);
  const envVisible = timelineTime >= TL.envStart && timelineTime < TL.particlesStart;
  const lineStep = (TL.envEnd - TL.envStart) / (ENV_LINES.length - 1);
  const visibleLines = envVisible
    ? ENV_LINES.filter((_, i) => timelineTime >= TL.envStart + i * lineStep).length
    : 0;

  let particleOpacity = 0;
  if (timelineTime >= TL.particlesStart && timelineTime < TL.particlesStart + 800) {
    particleOpacity = clamp01((timelineTime - TL.particlesStart) / 800);
  } else if (timelineTime >= TL.particlesStart + 800 && timelineTime < TL.heroStart) {
    particleOpacity = 1;
  } else if (timelineTime >= TL.heroStart && timelineTime < TL.particlesEnd) {
    particleOpacity = 1 - clamp01((timelineTime - TL.heroStart) / 1000);
  }

  const heroRevealProgress = clamp01((timelineTime - TL.heroStart) / 1200);
  const veilOpacity = 1 - heroRevealProgress;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{ background: '#000000' }}>
      <div
        className="absolute inset-0 bg-black pointer-events-none"
        style={{ opacity: veilOpacity }}
      />

      <JMLogo
        visible={logoVisible}
        needsUnlock={!sequenceStarted}
        onUnlock={handleAudioUnlock}
      />

      <EnvText visible={envVisible} visibleLines={visibleLines} />

      <ParticleVideo videoRef={videoRef} opacity={particleOpacity} muted={!sequenceStarted} />
    </div>
  );
};

export default LoadingScreen;
