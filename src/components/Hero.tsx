'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import HoverableText from './HoverableText';
import { useColors } from '@/contexts/ColorContext';
import StarsBackground from './StarsBackground';

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
  const { primaryColor, secondaryColor } = useColors();
  const [cursorScreenPosition, setCursorScreenPosition] = useState({ x: 0, y: 0 });
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [typingIndex, setTypingIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollButtonRef = useRef<HTMLButtonElement>(null);
  const typingPhrases = t.raw('typing') as string[];

  // Mouse tracking for cursor aura on scroll button
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorScreenPosition({ x: e.clientX, y: e.clientY });

      // Check which element is being hovered (only for scroll button)
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
      <StarsBackground starCount={200} showComets={true} />
      
      {/* Fade transition to next section */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, rgba(5, 5, 16, 0.8), transparent)',
        }}
      />

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
      <div className="relative z-20 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 h-full flex flex-col">
        {/* Main text content - centered */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
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
          </div>
        </div>

        {/* Typing animation and button - positioned at bottom */}
        <div className="flex flex-col items-center gap-6 pb-8">
          {/* Typing animation */}
          <div className="flex min-h-[2rem] items-center justify-center">
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

          {/* View Projects Button */}
          <div className="flex flex-col items-center gap-4">
            <button
              ref={scrollButtonRef}
              onClick={handleScrollDown}
              className="group flex items-center gap-3 rounded-full px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              aria-label={t('scrollDown')}
              onMouseEnter={() => setHoveredElement('scroll')}
              onMouseLeave={() => setHoveredElement(null)}
              style={{
                backgroundColor: hoveredElement === 'scroll' ? primaryColor : 'rgba(98, 250, 215, 0.1)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: hoveredElement === 'scroll' ? primaryColor : 'rgba(98, 250, 215, 0.3)',
                color: hoveredElement === 'scroll' ? '#000000' : primaryColor,
              }}
            >
              <span className="transition-colors duration-300">
                {t('scrollDown')}
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
            
            {/* Scroll indicator */}
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <div
                className="h-1 w-1 rounded-full"
                style={{ backgroundColor: primaryColor, opacity: 0.6 }}
              />
              <div
                className="h-1 w-1 rounded-full"
                style={{ backgroundColor: primaryColor, opacity: 0.4 }}
              />
              <div
                className="h-1 w-1 rounded-full"
                style={{ backgroundColor: primaryColor, opacity: 0.2 }}
              />
            </div>
          </div>
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

      `}</style>
    </section>
  );
};

export default Hero;
