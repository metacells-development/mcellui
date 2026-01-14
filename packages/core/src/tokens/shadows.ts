/**
 * Design Tokens: Shadows
 *
 * Cross-platform shadow definitions
 */

import { Platform, ViewStyle } from 'react-native';

type ShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

const createShadow = (
  offsetY: number,
  blur: number,
  opacity: number,
  elevation: number
): ShadowStyle => ({
  shadowColor: '#000',
  shadowOffset: { width: 0, height: offsetY },
  shadowOpacity: opacity,
  shadowRadius: blur,
  ...(Platform.OS === 'android' && { elevation }),
});

export const shadows = {
  none: createShadow(0, 0, 0, 0),
  sm: createShadow(1, 2, 0.05, 1),
  DEFAULT: createShadow(2, 4, 0.1, 2),
  md: createShadow(4, 6, 0.1, 4),
  lg: createShadow(8, 10, 0.1, 8),
  xl: createShadow(12, 16, 0.15, 12),
  '2xl': createShadow(16, 24, 0.2, 16),
} as const;

export type Shadows = typeof shadows;
export type ShadowKey = keyof Shadows;
