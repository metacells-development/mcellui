/**
 * Design Tokens: Border Radius
 */

export const radius = {
  none: 0,
  sm: 4,
  DEFAULT: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  full: 9999,
} as const;

export type Radius = typeof radius;
export type RadiusKey = keyof Radius;
