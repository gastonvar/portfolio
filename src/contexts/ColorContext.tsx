'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

interface ColorContextType {
  primaryColor: string;
  secondaryColor: string;
  setColors: (primary: string, secondary: string) => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const ColorProvider = ({ children }: { children: ReactNode }) => {
  const [primaryColor, setPrimaryColor] = useState('rgb(98, 250, 215)');
  const [secondaryColor, setSecondaryColor] = useState('rgb(0, 255, 200)');

  const setColors = useCallback((primary: string, secondary: string) => {
    setPrimaryColor(primary);
    setSecondaryColor(secondary);
  }, []);

  const value = useMemo(
    () => ({ primaryColor, secondaryColor, setColors }),
    [primaryColor, secondaryColor, setColors]
  );

  return (
    <ColorContext.Provider value={value}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColors = () => {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useColors must be used within a ColorProvider');
  }
  return context;
};
