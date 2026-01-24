/**
 * Animation Presets
 *
 * Consistent animation configurations for micro-interactions.
 * Uses Reanimated's spring physics for natural motion.
 *
 * Inspired by iOS 17+ animations and Linear App micro-interactions.
 */

// Type definitions for Reanimated-compatible configs
export interface SpringConfig {
  damping?: number;
  mass?: number;
  stiffness?: number;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
  velocity?: number;
}

/**
 * Timing config for animations.
 *
 * Note: We intentionally omit `easing` from these configs because custom easing
 * functions must be Reanimated worklets to work with withTiming(). Instead,
 * consumers should use Reanimated's Easing module directly:
 *
 * @example
 * ```tsx
 * import { Easing } from 'react-native-reanimated';
 *
 * withTiming(value, {
 *   duration: timing.default.duration,
 *   easing: Easing.out(Easing.quad),
 * });
 * ```
 */
export interface TimingConfig {
  duration: number;
}

/**
 * Spring configurations for different animation contexts
 */
export const springs: SpringTokens = {
  /** Quick, snappy response - for buttons, toggles */
  snappy: {
    damping: 20,
    stiffness: 300,
    mass: 0.5,
  },

  /** Balanced spring - for general UI */
  default: {
    damping: 15,
    stiffness: 200,
    mass: 0.8,
  },

  /** Bouncy spring - for playful interactions */
  bouncy: {
    damping: 12,
    stiffness: 180,
    mass: 0.8,
  },

  /** Gentle spring - for larger movements */
  gentle: {
    damping: 18,
    stiffness: 120,
    mass: 1,
  },

  /** Stiff spring - minimal overshoot */
  stiff: {
    damping: 25,
    stiffness: 400,
    mass: 0.5,
  },

  /** Soft spring - for modal animations */
  soft: {
    damping: 20,
    stiffness: 100,
    mass: 1,
  },
};

/**
 * Timing configurations for animations.
 * Duration-only configs - use Reanimated's Easing module for custom easing.
 */
export const timing: TimingTokens = {
  /** Fast transition - 150ms */
  fast: { duration: 150 },

  /** Default transition - 200ms */
  default: { duration: 200 },

  /** Slow transition - 300ms */
  slow: { duration: 300 },

  /** Enter animation - 250ms */
  enter: { duration: 250 },

  /** Exit animation - 200ms */
  exit: { duration: 200 },
};

/**
 * Scale values for press animations
 */
export const pressScale: PressScaleTokens = {
  /** Subtle press - for text buttons */
  subtle: 0.98,
  /** Default press - for buttons */
  default: 0.96,
  /** Prominent press - for cards */
  prominent: 0.94,
};

/**
 * Press scale token structure (flexible for presets)
 */
export interface PressScaleTokens {
  subtle: number;
  default: number;
  prominent: number;
}

/**
 * Common animation durations in ms
 */
export const durations: DurationTokens = {
  instant: 0,
  fast: 150,
  default: 200,
  slow: 300,
  slower: 500,
};

/**
 * Duration token structure (flexible for presets)
 */
export interface DurationTokens {
  instant: number;
  fast: number;
  default: number;
  slow: number;
  slower: number;
}

/**
 * Spring tokens structure (flexible for presets)
 */
export interface SpringTokens {
  snappy: SpringConfig;
  default: SpringConfig;
  bouncy: SpringConfig;
  gentle: SpringConfig;
  stiff: SpringConfig;
  soft: SpringConfig;
}

/**
 * Timing tokens structure (flexible for presets)
 */
export interface TimingTokens {
  fast: TimingConfig;
  default: TimingConfig;
  slow: TimingConfig;
  enter: TimingConfig;
  exit: TimingConfig;
}

export type SpringPreset = keyof SpringTokens;
export type TimingPreset = keyof TimingTokens;
export type PressScalePreset = keyof PressScaleTokens;

// ─────────────────────────────────────────────────────────────────────────────
// Animation Presets (subtle vs playful)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Animation preset type.
 * Controls the overall feel of animations throughout the app.
 *
 * - `subtle`: Professional, smooth animations with minimal overshoot
 * - `playful`: Bouncy, energetic animations with more personality
 */
export type AnimationPreset = 'subtle' | 'playful';

/**
 * Animation tokens structure for presets
 */
export interface AnimationTokens {
  springs: SpringTokens;
  timing: TimingTokens;
  pressScale: PressScaleTokens;
  durations: DurationTokens;
}

/**
 * Subtle animation preset.
 * Professional, smooth animations suited for business/productivity apps.
 * Higher damping = less bounce, faster settling.
 */
export const subtleAnimations: AnimationTokens = {
  springs: {
    snappy: {
      damping: 28,
      stiffness: 350,
      mass: 0.4,
    },
    default: {
      damping: 22,
      stiffness: 250,
      mass: 0.6,
    },
    bouncy: {
      damping: 18,
      stiffness: 220,
      mass: 0.6,
    },
    gentle: {
      damping: 24,
      stiffness: 150,
      mass: 0.8,
    },
    stiff: {
      damping: 30,
      stiffness: 450,
      mass: 0.4,
    },
    soft: {
      damping: 26,
      stiffness: 130,
      mass: 0.8,
    },
  },
  timing: {
    fast: { duration: 120 },
    default: { duration: 180 },
    slow: { duration: 280 },
    enter: { duration: 220 },
    exit: { duration: 180 },
  },
  pressScale: {
    subtle: 0.99,
    default: 0.97,
    prominent: 0.95,
  },
  durations: {
    instant: 0,
    fast: 120,
    default: 180,
    slow: 280,
    slower: 450,
  },
};

/**
 * Playful animation preset.
 * Bouncy, energetic animations suited for consumer/social apps.
 * Lower damping = more bounce, more overshoot.
 */
export const playfulAnimations: AnimationTokens = {
  springs: {
    snappy: {
      damping: 14,
      stiffness: 280,
      mass: 0.5,
    },
    default: {
      damping: 12,
      stiffness: 180,
      mass: 0.8,
    },
    bouncy: {
      damping: 8,
      stiffness: 150,
      mass: 0.9,
    },
    gentle: {
      damping: 14,
      stiffness: 100,
      mass: 1.1,
    },
    stiff: {
      damping: 18,
      stiffness: 350,
      mass: 0.5,
    },
    soft: {
      damping: 16,
      stiffness: 80,
      mass: 1.1,
    },
  },
  timing: {
    fast: { duration: 180 },
    default: { duration: 240 },
    slow: { duration: 350 },
    enter: { duration: 300 },
    exit: { duration: 220 },
  },
  pressScale: {
    subtle: 0.97,
    default: 0.94,
    prominent: 0.90,
  },
  durations: {
    instant: 0,
    fast: 180,
    default: 240,
    slow: 350,
    slower: 550,
  },
};

/**
 * Get animation tokens for a specific preset.
 */
export function getAnimationPreset(preset: AnimationPreset): AnimationTokens {
  switch (preset) {
    case 'subtle':
      return subtleAnimations;
    case 'playful':
      return playfulAnimations;
    default:
      // Default behavior matches the original springs/timing
      return {
        springs,
        timing,
        pressScale,
        durations,
      };
  }
}

/**
 * Default animation preset.
 */
export const defaultAnimationPreset: AnimationPreset = 'subtle';
