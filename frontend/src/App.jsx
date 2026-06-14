import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroAbout from './components/Hero';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import StarBackground from './components/StarBackground';

export default function App() {
  const [loadingDone, setLoadingDone] = useState(false);
  const [starSpeed, setStarSpeed] = useState(0.05);

  return (
    <>
      {!loadingDone && (
        <>
          <StarBackground speed={starSpeed} />
          <LoadingScreen
            onComplete={() => setLoadingDone(true)}
            onSpeedChange={setStarSpeed}
          />
        </>
      )}

      {loadingDone && (
        <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
          <Navbar />
          <main>
            <HeroAbout />
            <Skills />
            <Experience />
            <Projects />
            <Achievements />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}