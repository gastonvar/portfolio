'use client';

import { useState, useEffect, useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
}

interface Comet {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  opacity: number;
  delay: number;
}

interface StarsBackgroundProps {
  starCount?: number;
  showComets?: boolean;
}

const StarsBackground = ({ starCount = 200, showComets = true }: StarsBackgroundProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [comets, setComets] = useState<Comet[]>([]);

  // Generate random stars (only on client to avoid hydration mismatch)
  const stars = useMemo(() => {
    if (!isMounted) return [];
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      twinkleDelay: Math.random() * 5,
    }));
  }, [isMounted, starCount]);

  // Set mounted state after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate comets periodically
  useEffect(() => {
    if (!showComets || !isMounted) return;

    const generateComet = (): Comet => {
      // Start from random edge
      const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      let x = 0;
      let y = 0;
      let angle = 0;

      switch (edge) {
        case 0: // Top
          x = Math.random() * 100;
          y = -5;
          angle = Math.random() * 60 + 60; // 60-120 degrees
          break;
        case 1: // Right
          x = 105;
          y = Math.random() * 100;
          angle = Math.random() * 60 + 150; // 150-210 degrees
          break;
        case 2: // Bottom
          x = Math.random() * 100;
          y = 105;
          angle = Math.random() * 60 + 240; // 240-300 degrees
          break;
        case 3: // Left
          x = -5;
          y = Math.random() * 100;
          angle = Math.random() * 60 + 330; // 330-30 degrees (wrapped)
          break;
      }

      return {
        id: Date.now() + Math.random(),
        x,
        y,
        angle: (angle * Math.PI) / 180,
        speed: Math.random() * 0.3 + 0.2,
        opacity: Math.random() * 0.5 + 0.5,
        delay: Math.random() * 2,
      };
    };

    // Generate initial comets
    const initialComets: Comet[] = [];
    for (let i = 0; i < 2; i++) {
      initialComets.push(generateComet());
    }
    setComets(initialComets);

    // Add new comets periodically (every 8-15 seconds)
    const interval = setInterval(() => {
      setComets((prev) => {
        // Remove comets that are off screen (keep max 3)
        const filtered = prev.filter((comet) => {
          const timeSinceStart = Date.now() - (comet.id as number);
          const maxTime = 10000; // 10 seconds max travel time
          return timeSinceStart < maxTime;
        });

        // Add new comet if we have less than 3
        if (filtered.length < 3) {
          return [...filtered, generateComet()];
        }
        return filtered;
      });
    }, Math.random() * 7000 + 8000); // 8-15 seconds

    return () => clearInterval(interval);
  }, [showComets, isMounted]);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Stars */}
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

      {/* Comets */}
      {showComets &&
        comets.map((comet) => {
          const angleDeg = (comet.angle * 180) / Math.PI;
          const dx = Math.cos(comet.angle) * 200;
          const dy = Math.sin(comet.angle) * 200;
          const cometId = `comet-${String(comet.id).replace(/\./g, '-')}`;
          return (
            <div key={comet.id}>
              <style dangerouslySetInnerHTML={{
                __html: `
                  @keyframes cometMove-${cometId} {
                    0% {
                      transform: translate(0, 0) rotate(${angleDeg}deg);
                      opacity: 0;
                    }
                    10% {
                      opacity: ${comet.opacity};
                    }
                    90% {
                      opacity: ${comet.opacity};
                    }
                    100% {
                      transform: translate(${dx}vw, ${dy}vh) rotate(${angleDeg}deg);
                      opacity: 0;
                    }
                  }
                  .comet-trail-${cometId} {
                    animation: cometMove-${cometId} 8s linear forwards;
                    animation-delay: ${comet.delay}s;
                  }
                `
              }} />
              <div
                className={`absolute comet-trail-${cometId}`}
                style={{
                  left: `${comet.x}%`,
                  top: `${comet.y}%`,
                  width: '3px',
                  height: '40px',
                  transform: `rotate(${angleDeg}deg)`,
                  background: 'linear-gradient(to bottom, rgba(98, 250, 215, 0.8), rgba(98, 250, 215, 0.4), transparent)',
                  boxShadow: '0 0 10px rgba(98, 250, 215, 0.6), 0 0 20px rgba(98, 250, 215, 0.4)',
                }}
              />
            </div>
          );
        })}
    </div>
  );
};

export default StarsBackground;
