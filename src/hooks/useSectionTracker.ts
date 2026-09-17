import { useState, useEffect, useRef } from 'react';
import { scrollToSection } from '@/lib/scroll';

export interface UseSectionTrackerOptions {
  sections: string[];
  onSectionChange?: (sectionIndex: number) => void;
}

export interface UseSectionTrackerReturn {
  currentSection: number;
  scrollProgress: number;
  goToPrevious: () => void;
  goToNext: () => void;
  goToSection: (index: number) => void;
}

export const useSectionTracker = ({
  sections,
  onSectionChange,
}: UseSectionTrackerOptions): UseSectionTrackerReturn => {
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const currentSectionRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const maxScroll = documentHeight - windowHeight;
      const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
      setScrollProgress(progress);

      const headerOffset = 80;
      const probeY = scrollTop + headerOffset + 1;
      let nextSection = 0;

      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const element = document.getElementById(sections[i]);
        if (!element) {
          continue;
        }

        const elementTop = element.getBoundingClientRect().top + window.scrollY;
        if (probeY >= elementTop) {
          nextSection = i;
          break;
        }
      }

      if (currentSectionRef.current !== nextSection) {
        currentSectionRef.current = nextSection;
        setCurrentSection(nextSection);
        onSectionChange?.(nextSection);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, onSectionChange]);

  const goToPrevious = () => {
    if (currentSectionRef.current <= 0) {
      return;
    }

    const prevIndex = currentSectionRef.current - 1;
    scrollToSection(sections[prevIndex]);
  };

  const goToNext = () => {
    if (currentSectionRef.current >= sections.length - 1) {
      return;
    }

    const nextIndex = currentSectionRef.current + 1;
    scrollToSection(sections[nextIndex]);
  };

  const goToSection = (index: number) => {
    if (index < 0 || index >= sections.length) {
      return;
    }

    scrollToSection(sections[index]);
  };

  return {
    currentSection,
    scrollProgress,
    goToPrevious,
    goToNext,
    goToSection,
  };
};
