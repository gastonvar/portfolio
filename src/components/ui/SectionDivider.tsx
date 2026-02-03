'use client';

interface SectionDividerProps {
  primaryColor: string;
  secondaryColor: string;
  className?: string;
}

/**
 * Gradient divider line used in section headers
 */
export const SectionDivider = ({ 
  primaryColor, 
  secondaryColor,
  className = 'mx-auto h-1 w-24 rounded-full'
}: SectionDividerProps) => {
  return (
    <div 
      className={`transition-all duration-300 ${className}`}
      style={{ 
        background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
      }}
    />
  );
};
