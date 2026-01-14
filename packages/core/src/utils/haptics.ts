/**
 * Haptics Utilities
 *
 * Unified haptic feedback interface.
 * Falls back gracefully when expo-haptics is not available.
 */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

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
