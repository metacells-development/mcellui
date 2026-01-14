/**
 * Platform Utilities
 *
 * Helpers for platform-specific behavior
 */

import { Platform, Dimensions, PixelRatio } from 'react-native';

/**
 * Check if running on iOS
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Check if running on Android
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Check if running on web
 */
export const isWeb = Platform.OS === 'web';

/**
 * Get iOS version (returns 0 on non-iOS)
 */
export const iosVersion = isIOS
  ? parseInt(String(Platform.Version), 10)
  : 0;

/**
 * Get Android API level (returns 0 on non-Android)
 */
export const androidApiLevel = isAndroid
  ? (Platform.Version as number)
  : 0;

/**
 * Check if device is a tablet (rough heuristic)
 */
export function isTablet(): boolean {
  const { width, height } = Dimensions.get('window');
  const aspectRatio = Math.max(width, height) / Math.min(width, height);
  const isLargeScreen = Math.min(width, height) >= 600;

  return isLargeScreen && aspectRatio < 1.6;
}

/**
 * Get pixel ratio for crisp rendering
 */
export const pixelRatio = PixelRatio.get();

/**
 * Round to nearest pixel for crisp lines
 */
export function roundToNearestPixel(value: number): number {
  return PixelRatio.roundToNearestPixel(value);
}

/**
 * Get safe font scale (clamped for accessibility)
 */
export function getFontScale(maxScale = 1.3): number {
  return Math.min(PixelRatio.getFontScale(), maxScale);
}
