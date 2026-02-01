'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import HoverableText from './HoverableText';
import { useColors } from '@/contexts/ColorContext';

const Hero = () => {
  const t = useTranslations('hero');
  const { setColors } = useColors();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorScreenPosition, setCursorScreenPosition] = useState({ x: 0, y: 0 });
  const [cursorDistance, setCursorDistance] = useState(1);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [typingIndex, setTypingIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const scrollButtonRef = useRef<HTMLButtonElement>(null);
  const typingPhrases = t.raw('typing') as string[];

  // Mouse tracking for the "eyes", color calculation, and cursor aura
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorScreenPosition({ x: e.clientX, y: e.clientY });

      if (heroRef.current && circleRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });

        // Calculate distance from cursor to circle center
        const circleRect = circleRef.current.getBoundingClientRect();
        const circleCenterX = circleRect.left + circleRect.width / 2;
        const circleCenterY = circleRect.top + circleRect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(e.clientX - circleCenterX, 2) + 
          Math.pow(e.clientY - circleCenterY, 2)
        );
        
        // Normalize distance (0 = very close, 1 = far away)
        // Max distance considered is 300px for more responsive transitions
        const maxDistance = 300;
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        setCursorDistance(normalizedDistance);
      }

      // Check which element is being hovered (only for scroll button now)
      const target = e.target as HTMLElement;
      if (scrollButtonRef.current?.contains(target) || target === scrollButtonRef.current) {
        setHoveredElement('scroll');
      } else {
        setHoveredElement(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Typing animation effect
  useEffect(() => {
    const currentPhrase = typingPhrases[typingIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting && displayedText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setTypingIndex((prev) => (prev + 1) % typingPhrases.length);
      } else if (isDeleting) {
        setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
      } else {
        setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, typingIndex, typingPhrases]);

  const handleScrollDown = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const eyeX = (mousePosition.x - 50) * 0.3;
  const eyeY = (mousePosition.y - 50) * 0.3;

  // Calculate color based on cursor distance
  // Closer = brighter cyan, farther = darker cyan
  const getColorFromDistance = (distance: number) => {
    // Invert distance so closer = higher value (0-1)
    const proximity = Math.max(0, Math.min(1, 1 - distance));
    
    // Cyan color transition (#62FAD7 = rgb(98, 250, 215))
    // Far: Darker cyan rgb(0, 200, 180)
    // Close: Bright cyan rgb(98, 250, 215)
    
    // Linear interpolation between dark and bright cyan
    const r = Math.round(0 + proximity * 98); // 0 to 98
    const g = Math.round(200 + proximity * 50); // 200 to 250
    const b = Math.round(180 + proximity * 35); // 180 to 215
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getSecondaryColorFromDistance = (distance: number) => {
    const proximity = Math.max(0, Math.min(1, 1 - distance));
    
    // Secondary color for gradient - cyan variants
    // Far: Darker cyan rgb(0, 200, 180)
    // Close: Bright cyan rgb(0, 255, 200)
    
    // Linear interpolation between dark and bright cyan
    const r = Math.round(0);
    const g = Math.round(200 + proximity * 55); // 200 to 255
    const b = Math.round(180 + proximity * 20); // 180 to 200
    
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

  // Get cursor aura color based on hovered element (only for scroll button now)
  const getCursorAuraColor = () => {
    if (hoveredElement === 'scroll') {
      return primaryColor;
    }
    return 'transparent';
  };

  const cursorAuraColor = getCursorAuraColor();

  return (
    <section
      ref={heroRef}
      className="relative block flex h-screen items-center justify-center bg-gradient-to-b from-white to-zinc-50 dark:from-black dark:to-zinc-950"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-12 text-center">
          {/* Interactive Code Brackets with Eyes */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center">
              <div className="h-64 w-64 animate-pulse rounded-full blur-3xl" style={{ backgroundColor: `${primaryColor}30` }} />
            </div>

            {/* Code container */}
            <div className="relative flex items-center justify-center gap-8">
              {/* Left bracket */}
              <div 
                className="text-8xl font-bold text-zinc-400 transition-all duration-300 dark:text-zinc-600 sm:text-9xl"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = primaryColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '';
                }}
              >
                {'<'}
              </div>

              {/* Center element with eyes */}
              <div 
                ref={circleRef}
                className="relative flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48"
              >
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-zinc-300 dark:border-zinc-700 transition-colors duration-300" />
                
                {/* Inner circle with dynamic color */}
                <div 
                  className="absolute inset-8 rounded-full shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    transition: 'background 0.2s ease-out',
                  }}
                />

                {/* Eyes container */}
                <div className="absolute inset-0 flex items-center justify-center gap-8">
                  {/* Left eye */}
                  <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white dark:bg-zinc-200">
                    <div
                      className="absolute h-4 w-4 rounded-full bg-zinc-900 transition-transform duration-200 ease-out"
                      style={{
                        transform: `translate(${eyeX}px, ${eyeY}px)`,
                        top: '50%',
                        left: '50%',
                        marginTop: '-8px',
                        marginLeft: '-8px',
                      }}
                    >
                      <div className="absolute h-2 w-2 rounded-full bg-white" style={{ top: '4px', left: '4px' }} />
                    </div>
                  </div>

                  {/* Right eye */}
                  <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white dark:bg-zinc-200">
                    <div
                      className="absolute h-4 w-4 rounded-full bg-zinc-900 transition-transform duration-200 ease-out"
                      style={{
                        transform: `translate(${eyeX}px, ${eyeY}px)`,
                        top: '50%',
                        left: '50%',
                        marginTop: '-8px',
                        marginLeft: '-8px',
                      }}
                    >
                      <div className="absolute h-2 w-2 rounded-full bg-white" style={{ top: '4px', left: '4px' }} />
                    </div>
                  </div>
                </div>

                {/* Animated particles */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                  <div className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full" style={{ backgroundColor: primaryColor }} />
                </div>
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                  <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full" style={{ backgroundColor: secondaryColor }} />
                </div>
              </div>

              {/* Right bracket */}
              <div 
                className="text-8xl font-bold text-zinc-400 transition-all duration-300 dark:text-zinc-600 sm:text-9xl"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = primaryColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '';
                }}
              >
                {'>'}
              </div>
            </div>

            {/* Forward slash */}
            <div className="mt-4 text-center text-6xl font-bold text-zinc-300 dark:text-zinc-700">
                
            </div>
            <div 
              className="text-center text-6xl font-bold text-zinc-300 transition-all duration-300 dark:text-zinc-700"
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

          {/* Text content */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
              {t('greeting')}{' '}
              <HoverableText
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                defaultColor="rgb(98, 250, 215)"
                className="transition-all duration-300"
              >
                Gastón Varela
              </HoverableText>
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 sm:text-2xl">
              {t('role')}
            </p>

            {/* Typing animation */}
            <div className="mt-4 flex min-h-[2rem] items-center justify-center">
              <HoverableText
                as="p"
                primaryColor={primaryColor}
                defaultColor="rgb(98, 250, 215)"
                className="font-mono text-lg font-medium sm:text-xl"
              >
                {displayedText}
                <span className="animate-pulse">|</span>
              </HoverableText>
            </div>
          </div>

          {/* Scroll down button */}
          <button
            ref={scrollButtonRef}
            onClick={handleScrollDown}
            className="group mt-8 flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110"
            aria-label={t('scrollDown')}
            onMouseEnter={() => setHoveredElement('scroll')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <span
              className="text-sm font-medium transition-colors duration-300"
              style={{
                color: hoveredElement === 'scroll' ? primaryColor : 'rgb(113, 113, 122)',
              }}
            >
              {t('scrollDown')}
            </span>
            <div
              className="flex h-12 w-8 items-start justify-center rounded-full border-2 p-2 transition-all duration-300"
              style={{
                borderColor: hoveredElement === 'scroll' ? primaryColor : 'rgb(161, 161, 170)',
              }}
            >
              <div
                className="h-2 w-2 animate-bounce rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: hoveredElement === 'scroll' ? primaryColor : 'rgb(161, 161, 170)',
                }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full blur-3xl" style={{ backgroundColor: `${primaryColor}20` }} />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full blur-3xl" style={{ backgroundColor: `${secondaryColor}20` }} />
      </div>

      {/* Cursor aura/follower */}
      {cursorAuraColor !== 'transparent' && (
        <div
          className="pointer-events-none fixed z-50 rounded-full blur-2xl transition-all duration-200 ease-out"
          style={{
            left: `${cursorScreenPosition.x}px`,
            top: `${cursorScreenPosition.y}px`,
            width: '100px',
            height: '100px',
            transform: 'translate(-50%, -50%)',
            backgroundColor: cursorAuraColor,
            opacity: 0.3,
            boxShadow: `0 0 50px ${cursorAuraColor}, 0 0 100px ${cursorAuraColor}`,
          }}
        />
      )}
    </section>
  );
};

export default Hero;
