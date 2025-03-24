
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
        animationDelay: `${delay}s`
      }}
    >
      {children}
      
      <style jsx>{`
        @keyframes floatingAnimation {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingCard;
