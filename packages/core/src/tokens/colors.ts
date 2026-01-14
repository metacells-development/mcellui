/**
 * Design Tokens: Colors
 *
 * Inspired by:
 * - iOS 17+ Dynamic Colors
 * - Arc Browser palette
 * - Linear App design system
 */

export const colors = {
  // Neutral scale (gray)
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  // Primary (customizable accent)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // Semantic colors
  success: {
    light: '#4ade80',
    DEFAULT: '#22c55e',
    dark: '#16a34a',
  },

  warning: {
    light: '#fbbf24',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
  },

  error: {
    light: '#f87171',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },

  // Special
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type Colors = typeof colors;
export type ColorKey = keyof Colors;
