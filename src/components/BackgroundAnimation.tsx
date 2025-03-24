
import React from 'react';
import { useTheme } from '../context/ThemeContext';

const BackgroundAnimation: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br transition-colors duration-500"
        style={{ 
          background: theme === 'dark' 
            ? 'linear-gradient(225deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' 
            : 'linear-gradient(225deg, #f5f7fa 0%, #e4e8f0 50%, #c3cfe2 100%)'
        }}
      />
      
      {/* Animated shapes */}
      <div className="absolute w-full h-full">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute rounded-full opacity-20
              animate-pulse-subtle
              ${theme === 'dark' ? 'bg-primary/30' : 'bg-primary/20'}
            `}
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${Math.random() * 7 + 10}s`,
              transform: `scale(${Math.random() * 0.3 + 0.7})`,
              filter: 'blur(50px)'
            }}
          />
        ))}
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};

export default BackgroundAnimation;
