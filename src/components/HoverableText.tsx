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
  defaultColor = 'rgb(37, 99, 235)',
  as: Component = 'span',
  onHoverChange,
}: HoverableTextProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update state for initial render
      setCursorPosition({ x: e.clientX, y: e.clientY });
      
      // Direct DOM update for real-time following (bypasses React batching)
      if (auraRef.current && isHovered) {
        auraRef.current.style.left = `${e.clientX}px`;
        auraRef.current.style.top = `${e.clientY}px`;
      }
    };

    // Always track mouse position for smooth following
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    // Capture position immediately on hover
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

  const style: React.CSSProperties = {
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  // If we have gradient colors, use backgroundImage with text clipping
  if (primaryColor && secondaryColor && isHovered) {
    style.backgroundImage = hoverColor;
    style.WebkitBackgroundClip = 'text';
    style.WebkitTextFillColor = 'transparent';
    style.backgroundClip = 'text';
  } else if (primaryColor && isHovered) {
    style.color = primaryColor;
  } else {
    style.color = defaultColor;
  }

  return (
    <>
      {React.createElement(
        Component,
        {
          className,
          style,
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
        },
        children
      )}
      
      {/* Cursor aura */}
      {isHovered && primaryColor && (
        <div
          ref={auraRef}
          className="pointer-events-none fixed z-50 rounded-full blur-2xl"
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
            width: '100px',
            height: '100px',
            transform: 'translate(-50%, -50%)',
            backgroundColor: primaryColor,
            opacity: 0.3,
            boxShadow: `0 0 50px ${primaryColor}, 0 0 100px ${primaryColor}`,
            transition: 'opacity 0.2s ease-out',
            willChange: 'transform, left, top',
          }}
        />
      )}
    </>
  );
};

export default HoverableText;
