
import React from 'react';

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const FloatingCard: React.FC<FloatingCardProps> = ({ 
  children, 
  className = '',
  delay = 0
}) => {
  return (
    <div 
      className={`
        relative bg-background/90 backdrop-blur-sm 
        border border-border/50 rounded-xl shadow-lg
        transition-all duration-500 hover:shadow-xl
        hover:translate-y-[-5px] hover:bg-background/95
        ${className}
      `}
      style={{
        animation: `floatingAnimation 6s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        transform: 'translateZ(0)', // Force hardware acceleration
      }}
    >
      {children}
      
      <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl"></div>
        <div className="absolute -inset-[100%] animate-spin-slow opacity-20 bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-full"></div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes floatingAnimation {
            0%, 100% {
              transform: translateY(0px) translateZ(0);
            }
            50% {
              transform: translateY(-10px) translateZ(0);
            }
          }
          
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          .animate-spin-slow {
            animation: spin-slow 15s linear infinite;
          }
        `
      }} />
    </div>
  );
};

export default FloatingCard;
