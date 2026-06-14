import React, { useEffect, useRef } from 'react';

const StarBackground = ({ speed = 0.05 }) => {
  const canvasRef = useRef(null);
  const speedRef = useRef(speed);
  const targetSpeedRef = useRef(speed);
  const starsRef = useRef([]);

  // Sync prop changes to target speed
  useEffect(() => {
    targetSpeedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    if (starsRef.current.length === 0) {
      starsRef.current = Array.from({ length: 120 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 0.5,
        size: Math.random() * 1.5,
        opacity: Math.random() * 0.5 + 0.2,
      }));
    }

    let animId;
    const animate = () => {
      speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.05;

      ctx.fillStyle = '#02030A';
      ctx.fillRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, width * 0.8
      );
      gradient.addColorStop(0, 'rgba(20, 30, 60, 0.03)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      starsRef.current.forEach((star) => {
        star.y += speedRef.current * star.z;

        if (star.y > height) {
          star.y = -10;
          star.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(200, 220, 255, ${star.opacity})`;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default StarBackground;