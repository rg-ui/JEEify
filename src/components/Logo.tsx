import React from 'react';

const Logo = ({ height = 32, showText = true }: { height?: number; showText?: boolean }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <svg 
        width={height} 
        height={height} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Architectural Grid Background */}
        <path d="M10 30 H90 M10 50 H90 M10 70 H90" stroke="#E2E8F0" strokeWidth="1" />
        <path d="M30 10 V90 M50 10 V90 M70 10 V90" stroke="#E2E8F0" strokeWidth="1" />
        
        {/* Stylized 'J' with Architectural Lines */}
        <path 
          d="M60 20 V65 C60 75 52 82 42 82 C32 82 25 75 25 65" 
          stroke="#0F172A" 
          strokeWidth="8" 
          strokeLinecap="round"
        />
        
        {/* Precision Accent Lines (Ember Orange) */}
        <path d="M68 20 L68 70" stroke="#F59E0B" strokeWidth="2" />
        <circle cx="68" cy="20" r="3" fill="#F59E0B" />
        
        {/* 90 Degree Angle Indicator */}
        <path d="M50 50 L60 50 L60 40" stroke="#F59E0B" strokeWidth="1" fill="none" />
      </svg>
      {showText && (
        <span style={{ 
          fontFamily: "'Plus Jakarta Sans', sans-serif", 
          fontSize: `${height * 0.75}px`, 
          fontWeight: 800, 
          color: '#0F172A',
          letterSpacing: '-0.02em'
        }}>
          JEEify
        </span>
      )}
    </div>
  );
};

export default Logo;
