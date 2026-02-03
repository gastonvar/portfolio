'use client';

interface ScrollIndicatorProps {
  primaryColor: string;
}

/**
 * Animated scroll indicator dots
 */
export const ScrollIndicator = ({ primaryColor }: ScrollIndicatorProps) => {
  return (
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
  );
};
