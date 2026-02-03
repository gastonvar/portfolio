import { useState, useEffect } from 'react';

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

  // Detect which section is currently in view and calculate scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      // Calculate scroll progress (0 = start, 1 = end)
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const maxScroll = documentHeight - windowHeight;
      const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
      setScrollProgress(progress);
      
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
            if (currentSection !== i) {
              setCurrentSection(i);
              onSectionChange?.(i);
            }
            break;
          }
        }
      }
    };

    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, currentSection, onSectionChange]);

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

  const goToNext = () => {
    if (currentSection < sections.length - 1) {
      const nextIndex = currentSection + 1;
      const element = document.getElementById(sections[nextIndex]);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const goToSection = (index: number) => {
    if (index >= 0 && index < sections.length) {
      if (index === 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(sections[index]);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  return {
    currentSection,
    scrollProgress,
    goToPrevious,
    goToNext,
    goToSection,
  };
};
