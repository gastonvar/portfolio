'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import HoverableText from './HoverableText';

const Hero = () => {
  const t = useTranslations('hero');
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
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const eyeX = (mousePosition.x - 50) * 0.3;
  const eyeY = (mousePosition.y - 50) * 0.3;

  // Calculate color based on cursor distance
  // Closer = warmer colors (red/orange), farther = cooler colors (blue/purple)
  const getColorFromDistance = (distance: number) => {
    // Invert distance so closer = higher value (0-1)
    const proximity = Math.max(0, Math.min(1, 1 - distance));
    
    // More dramatic color transition
    // Cool colors (far): Blue #3b82f6 to Purple #9333ea
    // Warm colors (close): Red #ef4444 to Orange #f97316
    
    // Linear interpolation between cool and warm
    const r = Math.round(59 + proximity * 196); // 59 (blue) to 255 (red/orange)
    const g = Math.round(130 - proximity * 62); // 130 (blue) to 68 (red)
    const b = Math.round(246 - proximity * 224); // 246 (blue) to 22 (orange)
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getSecondaryColorFromDistance = (distance: number) => {
    const proximity = Math.max(0, Math.min(1, 1 - distance));
    
    // Secondary color for gradient
    // Cool: Purple #9333ea to Pink #ec4899
    // Warm: Orange #f97316 to Yellow #fbbf24
    
    if (proximity > 0.5) {
      // Warm secondary (orange to yellow)
      const t = (proximity - 0.5) * 2;
      const r = Math.round(249 + t * 6); // 249 to 255
      const g = Math.round(115 + t * 140); // 115 to 255
      const b = Math.round(22);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Cool secondary (purple to pink)
      const t = proximity * 2;
      const r = Math.round(147 + t * 108); // 147 to 255
      const g = Math.round(51 + t * 49); // 51 to 100
      const b = Math.round(234 - t * 29); // 234 to 205
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const { primaryColor, secondaryColor } = useMemo(() => {
    return {
      primaryColor: getColorFromDistance(cursorDistance),
      secondaryColor: getSecondaryColorFromDistance(cursorDistance),
    };
  }, [cursorDistance]);

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
      className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-zinc-50 dark:from-black dark:to-zinc-950"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-12 text-center">
          {/* Interactive Code Brackets with Eyes */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center">
              <div className="h-64 w-64 animate-pulse rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-400/20" />
            </div>

            {/* Code container */}
            <div className="relative flex items-center justify-center gap-8">
              {/* Left bracket */}
              <div className="text-8xl font-bold text-zinc-400 transition-all duration-300 hover:text-blue-500 dark:text-zinc-600 dark:hover:text-blue-400 sm:text-9xl">
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
                  <div className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-500" />
                </div>
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                  <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-purple-500" />
                </div>
              </div>

              {/* Right bracket */}
              <div className="text-8xl font-bold text-zinc-400 transition-all duration-300 hover:text-blue-500 dark:text-zinc-600 dark:hover:text-blue-400 sm:text-9xl">
                {'>'}
              </div>
            </div>

            {/* Forward slash */}
            <div className="mt-4 text-center text-6xl font-bold text-zinc-300 dark:text-zinc-700">
              /
            </div>
          </div>

          {/* Text content */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
              {t('greeting')}{' '}
              <HoverableText
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                defaultColor="rgb(37, 99, 235)"
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
                defaultColor="rgb(37, 99, 235)"
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
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
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
