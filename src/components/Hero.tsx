'use client';

import { useRef, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import HoverableText from './ui/HoverableText';
import { useColors } from '@/contexts/ColorContext';
import StarsBackground from './ui/StarsBackground';
import { scrollToSection } from '@/lib/scroll';
import { SECTION_GRADIENT_BLACK_TO_NAVY } from '@/constants/sectionLayout';

const Hero = () => {
  const t = useTranslations('hero');
  const { primaryColor, secondaryColor } = useColors();
  const heroRef = useRef<HTMLDivElement>(null);

  const handleScrollToWork = () => {
    scrollToSection('projects');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleScrollToWork();
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex min-h-[100svh] scroll-mt-20 items-center overflow-hidden py-24 pt-32"
      style={{
        background: SECTION_GRADIENT_BLACK_TO_NAVY,
      }}
    >
      <StarsBackground starCount={70} showComets={false} />

      <div className="relative z-20 mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10">
        <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl">
          <HoverableText
            as="span"
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            defaultColor="rgb(248, 246, 242)"
          >
            Gastón Varela
          </HoverableText>
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
          {t('intro')}
        </p>

        <button
          type="button"
          onClick={handleScrollToWork}
          onKeyDown={handleKeyDown}
          aria-label={t('scrollDown')}
          className="mt-12 inline-flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-zinc-50"
        >
          <span>{t('scrollDown')}</span>
          <span aria-hidden="true" style={{ color: primaryColor }}>
            ↓
          </span>
        </button>
      </div>
    </section>
  );
};

export default Hero;
