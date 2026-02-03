'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useColors } from '@/contexts/ColorContext';

const FloatingEyes = () => {
  const { setColors } = useColors();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorDistance, setCursorDistance] = useState(1);
  const [currentSection, setCurrentSection] = useState(0);
  const circleRef = useRef<HTMLDivElement>(null);

  // Section IDs in order
  const sections = ['', 'projects', 'about', 'education', 'contact'];

  // Detect which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      // Check each section to see which one is in view
      for (let i = sections.length - 1; i >= 0; i--) {
        let element: HTMLElement | null = null;
        
        if (i === 0) {
          // Hero section (first section, no id)
          element = document.querySelector('section:first-of-type');
        } else {
          element = document.getElementById(sections[i]);
        }
        
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;
          
          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setCurrentSection(i);
            break;
          }
        }
      }
    };

    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigate to previous section
  const goToPrevious = () => {
    if (currentSection > 0) {
      const prevIndex = currentSection - 1;
      if (prevIndex === 0) {
        // Scroll to top (Hero section)
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(sections[prevIndex]);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  // Navigate to next section
  const goToNext = () => {
    if (currentSection < sections.length - 1) {
      const nextIndex = currentSection + 1;
      const element = document.getElementById(sections[nextIndex]);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Scroll to bottom of page
  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  // Mouse tracking for the eyes relative to the circle center
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (circleRef.current) {
        // Calculate mouse position relative to circle center
        const circleRect = circleRef.current.getBoundingClientRect();
        const circleCenterX = circleRect.left + circleRect.width / 2;
        const circleCenterY = circleRect.top + circleRect.height / 2;
        
        // Calculate offset from circle center in pixels
        const offsetX = e.clientX - circleCenterX;
        const offsetY = e.clientY - circleCenterY;
        
        // Convert to percentage relative to circle center
        // Use circle radius (half of width/height) for more accurate calculation
        const radius = circleRect.width / 2;
        const x = (offsetX / radius) * 50; // -50 to +50 range
        const y = (offsetY / radius) * 50; // -50 to +50 range
        setMousePosition({ x, y });
        
        // Calculate distance from cursor to circle center
        const distance = Math.sqrt(
          Math.pow(offsetX, 2) + 
          Math.pow(offsetY, 2)
        );
        
        // Normalize distance (0 = very close, 1 = far away)
        const maxDistance = 300;
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        setCursorDistance(normalizedDistance);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Clamp eye movement to prevent pupils from going outside the eye whites
  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
  const eyeX = clamp(mousePosition.x * 0.25, -4, 4); // Limit to ±4px for smaller eyes
  const eyeY = clamp(mousePosition.y * 0.25, -4, 4); // Limit to ±4px for smaller eyes

  // Calculate color based on cursor distance
  const getColorFromDistance = (distance: number) => {
    const proximity = Math.max(0, Math.min(1, 1 - distance));
    const r = Math.round(0 + proximity * 98);
    const g = Math.round(200 + proximity * 50);
    const b = Math.round(180 + proximity * 35);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getSecondaryColorFromDistance = (distance: number) => {
    const proximity = Math.max(0, Math.min(1, 1 - distance));
    const r = Math.round(0);
    const g = Math.round(200 + proximity * 55);
    const b = Math.round(180 + proximity * 20);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const { primaryColor, secondaryColor } = useMemo(() => {
    return {
      primaryColor: getColorFromDistance(cursorDistance),
      secondaryColor: getSecondaryColorFromDistance(cursorDistance),
    };
  }, [cursorDistance]);

  // Update global colors for other components
  useEffect(() => {
    setColors(primaryColor, secondaryColor);
  }, [primaryColor, secondaryColor, setColors]);

  return (
    <div className="fixed bottom-6 right-6 z-30 pointer-events-none">
      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-32 w-32 animate-pulse rounded-full blur-2xl" style={{ backgroundColor: `${primaryColor}30` }} />
      </div>

      {/* Code container */}
      <div className="relative flex items-center justify-center gap-2 sm:gap-3">
        {/* Left bracket */}
        <div 
          className="text-3xl sm:text-4xl font-bold text-zinc-400 transition-all duration-300 drop-shadow-lg pointer-events-auto cursor-pointer hover:scale-110"
          onClick={goToPrevious}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = primaryColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '';
          }}
          style={{
            opacity: currentSection === 0 ? 0.4 : 1,
            cursor: currentSection === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {'<'}
        </div>

        {/* Center element with eyes */}
        <div 
          ref={circleRef}
          className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center"
        >
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 sm:border-3 border-zinc-500 transition-colors duration-300 shadow-lg" style={{ borderColor: `${primaryColor}40` }} />
          
          {/* Inner circle with dynamic color */}
          <div 
            className="absolute inset-3 sm:inset-4 rounded-full shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              transition: 'background 0.2s ease-out',
              boxShadow: `0 0 20px ${primaryColor}, 0 0 40px ${secondaryColor}`,
            }}
          />

          {/* Eyes container */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 sm:gap-4">
            {/* Left eye */}
            <div className="relative h-4 w-4 sm:h-5 sm:w-5 overflow-hidden rounded-full bg-white dark:bg-zinc-200">
              <div
                className="absolute h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-zinc-900 transition-transform duration-200 ease-out"
                style={{
                  transform: `translate(${eyeX}px, ${eyeY}px)`,
                  top: '50%',
                  left: '50%',
                  marginTop: '-4px',
                  marginLeft: '-4px',
                }}
              >
                <div className="absolute h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-white" style={{ top: '2px', left: '2px' }} />
              </div>
            </div>

            {/* Right eye */}
            <div className="relative h-4 w-4 sm:h-5 sm:w-5 overflow-hidden rounded-full bg-white dark:bg-zinc-200">
              <div
                className="absolute h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-zinc-900 transition-transform duration-200 ease-out"
                style={{
                  transform: `translate(${eyeX}px, ${eyeY}px)`,
                  top: '50%',
                  left: '50%',
                  marginTop: '-4px',
                  marginLeft: '-4px',
                }}
              >
                <div className="absolute h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-white" style={{ top: '2px', left: '2px' }} />
              </div>
            </div>
          </div>

          {/* Animated particles */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
            <div className="absolute top-0 left-1/2 h-1 w-1 sm:h-1.5 sm:w-1.5 -translate-x-1/2 rounded-full" style={{ backgroundColor: primaryColor }} />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
            <div className="absolute bottom-0 left-1/2 h-1 w-1 sm:h-1.5 sm:w-1.5 -translate-x-1/2 rounded-full" style={{ backgroundColor: secondaryColor }} />
          </div>
        </div>

        {/* Right bracket */}
        <div 
          className="text-3xl sm:text-4xl font-bold text-zinc-400 transition-all duration-300 drop-shadow-lg pointer-events-auto cursor-pointer hover:scale-110"
          onClick={goToNext}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = primaryColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '';
          }}
          style={{
            opacity: currentSection === sections.length - 1 ? 0.4 : 1,
            cursor: currentSection === sections.length - 1 ? 'not-allowed' : 'pointer',
          }}
        >
          {'>'}
        </div>
      </div>

      {/* U U text below */}
      <div 
        className="mt-2 text-center text-2xl sm:text-3xl font-bold text-zinc-400 transition-all duration-300 drop-shadow-lg pointer-events-auto cursor-pointer hover:scale-110"
        onClick={scrollToBottom}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = primaryColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '';
        }}
      >
        U U
      </div>
    </div>
  );
};

export default FloatingEyes;
