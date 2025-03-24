
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const BackgroundAnimation: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Initialize particles
    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    };
    
    const particles: Particle[] = [];
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
    
    // Create gradient colors based on theme
    const gradientColors = theme === 'dark' 
      ? ['rgba(79, 70, 229, 0.4)', 'rgba(109, 40, 217, 0.3)', 'rgba(139, 92, 246, 0.35)']
      : ['rgba(147, 197, 253, 0.25)', 'rgba(165, 180, 252, 0.25)', 'rgba(196, 181, 253, 0.25)'];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 10 + 5,
        color: gradientColors[Math.floor(Math.random() * gradientColors.length)],
        alpha: Math.random() * 0.5 + 0.2
      });
    }
    
    // Draw function
    const draw = () => {
      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      
      if (theme === 'dark') {
        // Dark theme gradient
        gradient.addColorStop(0, '#0f172a');
        gradient.addColorStop(0.5, '#1e293b');
        gradient.addColorStop(1, '#111827');
      } else {
        // Light theme gradient
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(0.5, '#e2e8f0');
        gradient.addColorStop(1, '#f1f5f9');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid pattern
      ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
      ctx.lineWidth = 1;
      
      const gridSize = 50;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      
      // Draw connection lines between nearby particles
      ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            // Fade line based on distance
            const opacity = 0.2 * (1 - distance / 150);
            ctx.strokeStyle = theme === 'dark' 
              ? `rgba(255, 255, 255, ${opacity})` 
              : `rgba(0, 0, 0, ${opacity})`;
              
            ctx.stroke();
          }
        }
      }
      
      // Add subtle glow effects
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 100 + 50;
        
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
        
        if (theme === 'dark') {
          glow.addColorStop(0, 'rgba(79, 70, 229, 0.03)');
          glow.addColorStop(1, 'rgba(79, 70, 229, 0)');
        } else {
          glow.addColorStop(0, 'rgba(147, 197, 253, 0.03)');
          glow.addColorStop(1, 'rgba(147, 197, 253, 0)');
        }
        
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    // Start animation
    draw();
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [theme]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    />
  );
};

export default BackgroundAnimation;
