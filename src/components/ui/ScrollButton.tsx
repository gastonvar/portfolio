'use client';

import { useState } from 'react';
import { scrollToSection } from '@/lib/scroll';

interface ScrollButtonProps {
  targetId: string;
  label: string;
  primaryColor: string;
  ariaLabel?: string;
  onClick?: () => void;
}

/**
 * Reusable scroll button with hover animation
 */
export const ScrollButton = ({ 
  targetId, 
  label, 
  primaryColor, 
  ariaLabel,
  onClick
}: ScrollButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      scrollToSection(targetId);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group flex max-w-full items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:gap-3 sm:px-8 sm:py-4 sm:text-lg"
      aria-label={ariaLabel || label}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? primaryColor : 'rgba(98, 250, 215, 0.1)',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: isHovered ? primaryColor : 'rgba(98, 250, 215, 0.3)',
        color: isHovered ? '#000000' : primaryColor,
      }}
    >
      <span className="transition-colors duration-300">
        {label}
      </span>
      <svg 
        className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};
