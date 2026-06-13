import React from 'react';
import SpaceScene from './SpaceScene';
import Hero from './Hero';
import About from './About';

export default function Home() {
  return (
    <main className="relative overflow-x-hidden bg-[#030712] text-white">
      <SpaceScene />
      <Hero />
      <About />
    </main>
  );
}