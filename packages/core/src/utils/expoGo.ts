/**
 * Expo Go Detection Utility
 *
 * Provides detection for Expo Go environment to gracefully disable
 * Reanimated animations when running in Expo Go client.
 *
 * @example
 * ```tsx
 * import { isExpoGo, areAnimationsDisabled } from '@metacells/mcellui-core';
 *
 * // Check environment
 * if (isExpoGo()) {
 *   console.log('Running in Expo Go');
 * }
 *
 * // Check if animations should be disabled
 * if (areAnimationsDisabled()) {
 *   // Skip animation, use static styles
 * }
 * ```
 */

let executionEnvironment: string | undefined;

// Try to load expo-constants at module load time
try {
  // Dynamic require to avoid bundler issues when expo-constants is not available
  const Constants = require('expo-constants').default;
  executionEnvironment = Constants?.executionEnvironment;
} catch {
  // expo-constants not available - not in Expo environment
  executionEnvironment = undefined;
}

/**
 * Check if the app is running in Expo Go client.
 *
 * Returns false in development builds, production builds, or non-Expo environments.
 *
 * @returns True if running in Expo Go client
 */
export function isExpoGo(): boolean {
  return executionEnvironment === 'storeClient';
}

// Internal state for animation override
let animationsDisabledOverride: boolean | null = null;

/**
 * Manually override the animation disabled state.
 *
 * Set to `true` to force disable animations, `false` to force enable,
 * or `null` to use automatic detection (Expo Go = disabled).
 *
 * @param disabled - Override value (true/false) or null for automatic detection
 */
export function setAnimationsDisabled(disabled: boolean | null): void {
  animationsDisabledOverride = disabled;
}

/**
 * Check if animations should be disabled.
 *
 * Returns true if:
 * - Manually overridden to true via setAnimationsDisabled(true)
 * - Running in Expo Go (automatic detection)
 *
 * Returns false if:
 * - Manually overridden to false via setAnimationsDisabled(false)
 * - Running in development/production build
 *
 * @returns True if animations should be disabled
 */
export function areAnimationsDisabled(): boolean {
  if (animationsDisabledOverride !== null) {
    return animationsDisabledOverride;
  }
  return isExpoGo();
}
