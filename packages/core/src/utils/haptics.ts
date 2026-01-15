/**
 * Haptics Utilities
 *
 * Unified haptic feedback interface.
 * Falls back gracefully when expo-haptics is not available.
 *
 * Design Philosophy:
 * - Every interactive element should provide tactile feedback
 * - Haptics should be subtle and purposeful
 * - Respect user's haptic preferences
 */

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

/**
 * Haptic presets for common interactions
 */
export const hapticPresets = {
  /** For button presses, checkbox toggles */
  buttonPress: 'light' as HapticStyle,
  /** For switch toggles */
  toggle: 'medium' as HapticStyle,
  /** For successful actions */
  success: 'success' as HapticStyle,
  /** For errors */
  error: 'error' as HapticStyle,
  /** For selection changes (radio, picker) */
  selection: 'selection' as HapticStyle,
  /** For destructive actions */
  destructive: 'warning' as HapticStyle,
} as const;

let Haptics: typeof import('expo-haptics') | null = null;

// Try to load expo-haptics (optional dependency)
try {
  Haptics = require('expo-haptics');
} catch {
  // expo-haptics not available, haptics will be no-ops
}

/**
 * Trigger haptic feedback
 *
 * @example
 * ```tsx
 * onPress={() => {
 *   haptic('light');
 *   // ... rest of handler
 * }}
 * ```
 */
export async function haptic(style: HapticStyle = 'light'): Promise<void> {
  if (!Haptics) return;

  try {
    switch (style) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'selection':
        await Haptics.selectionAsync();
        break;
    }
  } catch {
    // Silently fail if haptics not supported
  }
}

/**
 * Check if haptics are available
 */
export function hapticsAvailable(): boolean {
  return Haptics !== null;
}
