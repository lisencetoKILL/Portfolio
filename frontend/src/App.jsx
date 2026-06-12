import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar          from './components/Navbar';
import Hero            from './components/Hero';
import About           from './components/About';
import Skills          from './components/Skills';
import Experience      from './components/Experience';
import Projects        from './components/Projects';
import Achievements    from './components/Achievements';
import Footer          from './components/Footer';
import ScrollProgress  from './components/ScrollProgress';
import LoadingScreen   from './components/LoadingScreen';
import StarBackground  from './components/StarBackground';

function App() {
  const [loading,    setLoading]    = useState(true);
  const [booted,     setBooted]     = useState(false);   // controls home fade-in
  const [starSpeed,  setStarSpeed]  = useState(0.2);

  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }, []);

  const handleReveal = () => {
    setBooted(true); // start home fade-in while particles are still on top
  };

  const handleComplete = () => {
    setLoading(false);
  };

  return (
    <div className="bg-[#02030A] min-h-screen text-slate-300 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      <StarBackground speed={starSpeed} />

      {/* ── Home content sits underneath loader so it fades in behind particles ── */}
      <motion.div
        animate={{ opacity: booted ? 1 : 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ pointerEvents: booted ? 'auto' : 'none' }}
      >
        <ScrollProgress />
        <Navbar />

        <main className="w-full overflow-hidden">
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Achievements />
        </main>

        <Footer />
      </motion.div>

      {/* ── PS5 Loader on top — dissolves via golden particles ── */}
      <AnimatePresence>
        {loading && (
          <LoadingScreen
            key="ps5-loader"
            onReveal={handleReveal}
            onComplete={handleComplete}
            setStarSpeed={setStarSpeed}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
