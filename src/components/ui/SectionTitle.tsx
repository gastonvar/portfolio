'use client';

import HoverableText from './HoverableText';
import { SectionDivider } from './SectionDivider';

interface SectionTitleProps {
  title: string;
  primaryColor: string;
  secondaryColor: string;
  subtitle?: string;
  defaultColor?: string;
  className?: string;
  titleClassName?: string;
}

/**
 * Reusable section title with HoverableText and gradient divider
 */
export const SectionTitle = ({
  title,
  primaryColor,
  secondaryColor,
  subtitle,
  defaultColor = 'rgb(98, 250, 215)',
  className = 'mb-12 text-center',
  titleClassName = 'mb-4 text-4xl font-bold tracking-tight sm:text-5xl',
}: SectionTitleProps) => {
  return (
    <div className={className}>
      <HoverableText
        as="h2"
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        defaultColor={defaultColor}
        className={titleClassName}
      >
        {title}
      </HoverableText>
      <SectionDivider 
        primaryColor={primaryColor} 
        secondaryColor={secondaryColor}
      />
      {subtitle && (
        <p className="mt-6 text-lg text-zinc-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};
