'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import HoverableText from './HoverableText';
import { useColors } from '@/contexts/ColorContext';

// Planet data based on our solar system
const planets = [
  { name: 'Mercury', color: '#8C7853', size: 8, distance: 80, duration: 88, moons: 0 },
  { name: 'Venus', color: '#FFC649', size: 12, distance: 120, duration: 225, moons: 0 },
  { name: 'Earth', color: '#4A90E2', size: 13, distance: 160, duration: 365, moons: 1 },
  { name: 'Mars', color: '#E27B58', size: 10, distance: 200, duration: 687, moons: 2 },
  { name: 'Jupiter', color: '#C88B3A', size: 28, distance: 280, duration: 4333, moons: 79 },
  { name: 'Saturn', color: '#FAD5A5', size: 24, distance: 360, duration: 10759, moons: 82, hasRings: true },
  { name: 'Uranus', color: '#4FD0E7', size: 18, distance: 420, duration: 30687, moons: 27 },
  { name: 'Neptune', color: '#4166F5', size: 17, distance: 480, duration: 60190, moons: 14 },
];

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
  const [isMounted, setIsMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const scrollButtonRef = useRef<HTMLButtonElement>(null);
  const typingPhrases = t.raw('typing') as string[];

  // Generate random stars for the galaxy background (only on client to avoid hydration mismatch)
  const stars = useMemo(() => {
    if (!isMounted) return [];
    return Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      twinkleDelay: Math.random() * 5,
    }));
  }, [isMounted]);

  // Set mounted state after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      className="relative block flex h-screen items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #000000, #0a0a1a, #050510)',
      }}
    >
      {/* Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.twinkleDelay}s`,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity})`,
            }}
          />
        ))}
      </div>

      {/* Solar System Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Sun */}
        <div
          className="absolute z-10 rounded-full"
          style={{
            width: '60px',
            height: '60px',
            background: 'radial-gradient(circle, #FDB813 0%, #FF6B00 50%, #C1440E 100%)',
            boxShadow: '0 0 60px #FDB813, 0 0 100px #FF6B00, 0 0 140px rgba(253, 184, 19, 0.5)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />

        {/* Planets with Orbits */}
        {planets.map((planet, index) => (
          <div key={planet.name}>
            {/* Orbit path */}
            <div
              className="absolute rounded-full border border-opacity-20"
              style={{
                width: `${planet.distance * 2}px`,
                height: `${planet.distance * 2}px`,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />

            {/* Planet */}
            <div
              className="absolute"
              style={{
                width: `${planet.distance * 2}px`,
                height: `${planet.distance * 2}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                animation: `orbit ${planet.duration / 30}s linear infinite`,
              }}
            >
              <div
                className="absolute rounded-full"
                style={{
                  width: `${planet.size}px`,
                  height: `${planet.size}px`,
                  background: planet.color,
                  boxShadow: `0 0 ${planet.size}px ${planet.color}80, inset -${planet.size / 4}px -${planet.size / 4}px ${planet.size / 2}px rgba(0,0,0,0.3)`,
                  left: '50%',
                  top: '0',
                  transform: 'translateX(-50%)',
                }}
              >
                {/* Saturn's Rings */}
                {planet.hasRings && (
                  <div
                    className="absolute"
                    style={{
                      width: `${planet.size * 2}px`,
                      height: `${planet.size * 0.3}px`,
                      border: `2px solid ${planet.color}`,
                      borderRadius: '50%',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%) rotateX(75deg)',
                      opacity: 0.6,
                    }}
                  />
                )}

                {/* Earth's Moon */}
                {planet.name === 'Earth' && (
                  <div
                    className="absolute rounded-full bg-gray-300"
                    style={{
                      width: '4px',
                      height: '4px',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      animation: 'moonOrbit 2s linear infinite',
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Milky Way Galaxy Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
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
                className="text-8xl font-bold text-zinc-400 transition-all duration-300 sm:text-9xl drop-shadow-lg"
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
                <div className="absolute inset-0 rounded-full border-4 border-zinc-500 transition-colors duration-300 shadow-lg" style={{ borderColor: `${primaryColor}40` }} />
                
                {/* Inner circle with dynamic color */}
                <div 
                  className="absolute inset-8 rounded-full shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    transition: 'background 0.2s ease-out',
                    boxShadow: `0 0 30px ${primaryColor}, 0 0 60px ${secondaryColor}`,
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
                className="text-8xl font-bold text-zinc-400 transition-all duration-300 sm:text-9xl drop-shadow-lg"
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
            <div className="mt-4 text-center text-6xl font-bold text-zinc-300">
                
            </div>
            <div 
              className="text-center text-6xl font-bold text-zinc-400 transition-all duration-300 drop-shadow-lg"
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
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-lg">
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
            <p className="text-xl text-zinc-300 sm:text-2xl drop-shadow-md">
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

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes orbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes moonOrbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateX(20px) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg) translateX(20px) rotate(-360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
