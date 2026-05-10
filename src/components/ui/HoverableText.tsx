'use client';

import React, { useState } from 'react';

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

  const handleMouseEnter = () => {
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
    transition:
      'color 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-image 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    display: 'inline-block',
  };

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
    <span
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {React.createElement(
        Component,
        {
          className,
          style,
        },
        children
      )}
    </span>
  );
};

export default HoverableText;
