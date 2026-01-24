/**
 * ThemeSettingsContext
 *
 * Provides theme and radius state that can be changed at runtime.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemePreset, RadiusPreset } from '@metacells/mcellui-core';

interface ThemeSettingsContextType {
  themePreset: ThemePreset;
  radiusPreset: RadiusPreset;
  setThemePreset: (theme: ThemePreset) => void;
  setRadiusPreset: (radius: RadiusPreset) => void;
}

const ThemeSettingsContext = createContext<ThemeSettingsContextType | null>(null);

interface ThemeSettingsProviderProps {
  children: ReactNode;
  defaultTheme?: ThemePreset;
  defaultRadius?: RadiusPreset;
}

export function ThemeSettingsProvider({
  children,
  defaultTheme = 'zinc',
  defaultRadius = 'md',
}: ThemeSettingsProviderProps) {
  const [themePreset, setThemePreset] = useState<ThemePreset>(defaultTheme);
  const [radiusPreset, setRadiusPreset] = useState<RadiusPreset>(defaultRadius);

  return (
    <ThemeSettingsContext.Provider
      value={{
        themePreset,
        radiusPreset,
        setThemePreset,
        setRadiusPreset,
      }}
    >
      {children}
    </ThemeSettingsContext.Provider>
  );
}

export function useThemeSettings() {
  const context = useContext(ThemeSettingsContext);
  if (!context) {
    throw new Error('useThemeSettings must be used within ThemeSettingsProvider');
  }
  return context;
}
