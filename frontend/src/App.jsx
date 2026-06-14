import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import StarBackground from './components/StarBackground';

function PortfolioPage() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <Experience />
        <Projects />
        <Achievements />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const [loadingDone, setLoadingDone] = useState(false);
  const [starSpeed, setStarSpeed] = useState(0.05);

  return (
    <Routes>

      {/* /home — skips loading screen, straight to portfolio */}
      <Route path="/home" element={<PortfolioPage />} />

      {/* / — cinematic loading screen → portfolio */}
      <Route
        path="/"
        element={
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
            {loadingDone && <PortfolioPage />}
          </>
        }
      />

      {/* Catch-all → / */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}