// src/components/StarryBackground.tsx
"use client";

import React, { useEffect, useRef } from 'react';

interface StarryBackgroundProps {
  starCount?: number;
  starSize?: number;
  className?: string;
}

export default function StarryBackground({ 
  starCount = 200, 
  starSize = 2,
  className = ""
}: StarryBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Star data
    let stars: {x: number; y: number; size: number; speed: number; brightness: number}[] = [];

    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Recreate stars when resizing to ensure they fill the new dimensions
      createStars();
      // Update canvas immediately after resize
      updateCanvas();
    };
    
    // Create stars
    const createStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * starSize + 0.1,
          speed: Math.random() * 0.05,
          brightness: Math.random() * 0.5 + 0.5
        });
      }
    };
    
    // Draw stars and background
    const updateCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background gradient
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.4, 0,
        canvas.width * 0.3, canvas.height * 0.4, canvas.width * 0.8
      );
      gradient.addColorStop(0, 'rgba(76, 0, 255, 0.03)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.7, canvas.height * 0.6, 0,
        canvas.width * 0.7, canvas.height * 0.6, canvas.width * 0.8
      );
      gradient2.addColorStop(0, 'rgba(0, 198, 255, 0.03)');
      gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.fill();
      }
    };
    
    // Animate stars
    const animateStars = () => {
      for (const star of stars) {
        star.brightness = 0.5 + Math.sin(Date.now() * star.speed) * 0.2;
        star.size = Math.max(0.1, Math.random() * starSize + Math.sin(Date.now() * star.speed) * 0.5);
      }
      
      updateCanvas();
      requestAnimationFrame(animateStars);
    };
    
    // Initialize: set dimensions, create stars, start animation
    window.addEventListener('resize', handleResize);
    
    // IMPORTANT: Call handleResize immediately to set initial dimensions
    handleResize();
    
    // Start animation
    animateStars();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [starCount, starSize]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 -z-10 bg-black ${className}`}
    />
  );
}