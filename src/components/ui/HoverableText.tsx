'use client';

import React, { useState, useEffect, useRef } from 'react';

interface HoverableTextProps {
  children: React.ReactNode;
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  defaultColor?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  onHoverChange?: (isHovered: boolean) => void;
}

const HoverableText = ({
  children,
  className = '',
  primaryColor,
  secondaryColor,
  defaultColor = 'rgb(98, 250, 215)',
  as: Component = 'span',
  onHoverChange,
}: HoverableTextProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const textRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleMouseEnter = (e: React.MouseEvent) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
    setIsHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange?.(false);
  };

  const hoverColor = primaryColor && secondaryColor
    ? `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
    : primaryColor || defaultColor;

  const glowColor = primaryColor || defaultColor;
  
  // Multi-layer glowing text shadow for impressive depth
  const textShadow = isHovered
    ? `0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 30px ${glowColor}CC, 0 0 40px ${glowColor}AA, 0 0 70px ${glowColor}80, 0 0 100px ${glowColor}60`
    : 'none';

  const style: React.CSSProperties = {
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    display: 'inline-block',
    transform: isHovered ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
    filter: isHovered ? 'brightness(1.2)' : 'brightness(1)',
    zIndex: isHovered ? 10 : 1,
  };

  // If we have gradient colors, use backgroundImage with text clipping
  if (primaryColor && secondaryColor && isHovered) {
    style.backgroundImage = hoverColor;
    style.WebkitBackgroundClip = 'text';
    style.WebkitTextFillColor = 'transparent';
    style.backgroundClip = 'text';
    style.filter = `drop-shadow(0 0 10px ${glowColor}CC) drop-shadow(0 0 20px ${glowColor}AA) drop-shadow(0 0 30px ${glowColor}80) brightness(1.2)`;
  } else if (primaryColor && isHovered) {
    style.color = primaryColor;
    style.textShadow = textShadow;
  } else {
    style.color = defaultColor;
  }

  return (
    <span
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main text element */}
      {React.createElement(
        Component,
        {
          className,
          style,
          ref: (el: HTMLElement | null) => {
            textRef.current = el;
          },
        },
        children
      )}
      
      {/* Animated shimmer overlay */}
      {isHovered && primaryColor && (
        <span
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(110deg, transparent 30%, ${primaryColor}40 50%, transparent 70%)`,
            backgroundSize: '200% 100%',
            backgroundPosition: '0% 0%',
            backgroundRepeat: 'no-repeat',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'hoverable-shimmer 2s infinite',
            mixBlendMode: 'screen',
          }}
        >
          {children}
        </span>
      )}

      {/* Glowing particles around text */}
      {isHovered && primaryColor && (
        <>
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="absolute pointer-events-none rounded-full blur-sm"
              style={{
                width: `${4 + i * 2}px`,
                height: `${4 + i * 2}px`,
                backgroundColor: primaryColor,
                left: `${20 + i * 15}%`,
                top: `${-10 + (i % 2) * 120}%`,
                opacity: 0.6,
                animation: `hoverable-float ${2 + i * 0.3}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                boxShadow: `0 0 ${10 + i * 5}px ${primaryColor}`,
              }}
            />
          ))}
        </>
      )}

      {/* Pulsing glow rings */}
      {isHovered && primaryColor && (
        <>
          <span
            className="absolute inset-0 pointer-events-none rounded-lg blur-xl"
            style={{
              backgroundImage: `radial-gradient(circle, ${primaryColor}40 0%, transparent 70%)`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              transform: 'scale(1.5)',
              animation: 'hoverable-pulse 2s ease-in-out infinite',
              zIndex: -1,
            }}
          />
          <span
            className="absolute inset-0 pointer-events-none rounded-lg blur-2xl"
            style={{
              backgroundImage: `radial-gradient(circle, ${primaryColor}30 0%, transparent 70%)`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              transform: 'scale(2)',
              animation: 'hoverable-pulse 2s ease-in-out infinite 0.5s',
              zIndex: -2,
            }}
          />
        </>
      )}

      {/* Animated gradient border */}
      {isHovered && primaryColor && (
        <span
          className="absolute inset-0 pointer-events-none rounded-md"
          style={{
            backgroundImage: `linear-gradient(135deg, ${primaryColor}40, ${secondaryColor || primaryColor}40)`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            animation: 'hoverable-rotate 3s linear infinite',
            zIndex: -1,
          }}
        />
      )}

    </span>
  );
};

export default HoverableText;
