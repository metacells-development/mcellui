/**
 * Platform Utilities
 *
 * Helpers for platform-specific behavior
 */

import { Platform, Dimensions, PixelRatio } from 'react-native';

/** True if running on iOS */
export const isIOS = Platform.OS === 'ios';

/** True if running on Android */
export const isAndroid = Platform.OS === 'android';

/** True if running on web */
export const isWeb = Platform.OS === 'web';

/** iOS version number (returns 0 on non-iOS platforms) */
export const iosVersion = isIOS
  ? parseInt(String(Platform.Version), 10)
  : 0;

/** Android API level (returns 0 on non-Android platforms) */
export const androidApiLevel = isAndroid
  ? (Platform.Version as number)
  : 0;

/**
 * Check if device is a tablet.
 *
 * Uses screen dimensions heuristic (600dp minimum, aspect ratio < 1.6).
 *
 * @returns True if device is likely a tablet
 */
export function isTablet(): boolean {
  const { width, height } = Dimensions.get('window');
  const aspectRatio = Math.max(width, height) / Math.min(width, height);
  const isLargeScreen = Math.min(width, height) >= 600;

  return isLargeScreen && aspectRatio < 1.6;
}

/** Device pixel ratio for crisp rendering */
export const pixelRatio = PixelRatio.get();

/**
 * Round to nearest pixel for crisp lines and borders.
 *
 * @param value - Value in logical pixels
 * @returns Value rounded to nearest physical pixel
 */
export function roundToNearestPixel(value: number): number {
  return PixelRatio.roundToNearestPixel(value);
}

/**
 * Get safe font scale (clamped for accessibility).
 *
 * Prevents excessively large text from breaking layouts when users enable
 * large text accessibility settings.
 *
 * @param maxScale - Maximum scale to allow (defaults to 1.3)
 * @returns Clamped font scale factor
 */
export function getFontScale(maxScale = 1.3): number {
  return Math.min(PixelRatio.getFontScale(), maxScale);
}
