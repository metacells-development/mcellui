/**
 * Shadow Presets
 *
 * Consistent shadow tokens for depth and elevation.
 * Platform-aware: iOS uses shadow properties, Android uses elevation.
 *
 * Inspired by iOS 17+ depth language and Linear App shadows.
 */

import { Platform, ViewStyle } from 'react-native';

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

// Shadow presets for light mode
const lightShadows = {
  /** Subtle shadow for cards and surfaces */
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  /** Default shadow for buttons and interactive elements */
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  /** Elevated shadow for modals and popovers */
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },

  /** Prominent shadow for floating elements */
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },

  /** Maximum shadow for overlays */
  '2xl': {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
  },

  /** No shadow */
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
} as const;

// Shadow presets for dark mode (more subtle)
const darkShadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },

  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },

  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },

  '2xl': {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 16,
  },

  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
} as const;

/** Available shadow size presets */
export type ShadowSize = keyof typeof lightShadows;

/**
 * Get shadow styles for a given size and color scheme.
 *
 * Returns platform-specific shadow properties (iOS: shadow*, Android: elevation).
 * Prefer `platformShadow()` or `theme.platformShadow()` for cleaner API.
 *
 * @param size - Shadow size preset ('sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none')
 * @param isDark - Whether dark mode is active (defaults to false)
 * @returns Complete shadow style object with all platform properties
 *
 * @example
 * ```tsx
 * const shadow = getShadow('md', isDark);
 * <View style={shadow} />
 * ```
 */
export function getShadow(size: ShadowSize, isDark: boolean = false): ShadowStyle {
  const shadows = isDark ? darkShadows : lightShadows;
  return shadows[size];
}

/**
 * Get platform-optimized shadow style.
 *
 * Returns only the relevant properties for the current platform:
 * - iOS: shadowColor, shadowOffset, shadowOpacity, shadowRadius
 * - Android: elevation
 * - Web: complete shadow object
 *
 * @param size - Shadow size preset ('sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none')
 * @param isDark - Whether dark mode is active (defaults to false)
 * @returns Platform-specific shadow style object
 *
 * @example
 * ```tsx
 * const { platformShadow } = useTheme();
 * <View style={platformShadow('md')} />
 * ```
 */
export function getPlatformShadow(size: ShadowSize, isDark: boolean = false): ViewStyle {
  const shadow = getShadow(size, isDark);

  if (Platform.OS === 'ios') {
    return {
      shadowColor: shadow.shadowColor,
      shadowOffset: shadow.shadowOffset,
      shadowOpacity: shadow.shadowOpacity,
      shadowRadius: shadow.shadowRadius,
    };
  }

  if (Platform.OS === 'android') {
    return {
      elevation: shadow.elevation,
    };
  }

  return shadow;
}

/**
 * Complete shadow preset collections for light and dark modes.
 *
 * Prefer using `getShadow()` or `platformShadow()` instead of accessing directly.
 */
export const shadows = {
  light: lightShadows,
  dark: darkShadows,
};
