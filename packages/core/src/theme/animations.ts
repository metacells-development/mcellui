/**
 * Animation Presets
 *
 * Consistent animation configurations for micro-interactions.
 * Uses Reanimated's spring physics for natural motion.
 *
 * Inspired by iOS 17+ animations and Linear App micro-interactions.
 */

// Type definitions for Reanimated-compatible configs
// Defined inline to avoid hard dependency on react-native-reanimated
export interface SpringConfig {
  damping?: number;
  mass?: number;
  stiffness?: number;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
  velocity?: number;
}

export interface TimingConfig {
  duration?: number;
  easing?: (t: number) => number;
}

// Common easing functions (compatible with Reanimated)
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInQuad = (t: number) => t * t;

/**
 * Spring configurations for different animation contexts
 */
export const springs = {
  /** Quick, snappy response - for buttons, toggles */
  snappy: {
    damping: 20,
    stiffness: 300,
    mass: 0.5,
  } satisfies SpringConfig,

  /** Balanced spring - for general UI */
  default: {
    damping: 15,
    stiffness: 200,
    mass: 0.8,
  } satisfies SpringConfig,

  /** Bouncy spring - for playful interactions */
  bouncy: {
    damping: 12,
    stiffness: 180,
    mass: 0.8,
  } satisfies SpringConfig,

  /** Gentle spring - for larger movements */
  gentle: {
    damping: 18,
    stiffness: 120,
    mass: 1,
  } satisfies SpringConfig,

  /** Stiff spring - minimal overshoot */
  stiff: {
    damping: 25,
    stiffness: 400,
    mass: 0.5,
  } satisfies SpringConfig,

  /** Soft spring - for modal animations */
  soft: {
    damping: 20,
    stiffness: 100,
    mass: 1,
  } satisfies SpringConfig,
} as const;

/**
 * Timing configurations for linear/eased animations
 */
export const timing = {
  /** Fast transition - 150ms */
  fast: {
    duration: 150,
    easing: easeOutQuad,
  } satisfies TimingConfig,

  /** Default transition - 200ms */
  default: {
    duration: 200,
    easing: easeOutQuad,
  } satisfies TimingConfig,

  /** Slow transition - 300ms */
  slow: {
    duration: 300,
    easing: easeOutQuad,
  } satisfies TimingConfig,

  /** Enter animation - 250ms ease out */
  enter: {
    duration: 250,
    easing: easeOutCubic,
  } satisfies TimingConfig,

  /** Exit animation - 200ms ease in */
  exit: {
    duration: 200,
    easing: easeInQuad,
  } satisfies TimingConfig,
} as const;

/**
 * Scale values for press animations
 */
export const pressScale = {
  /** Subtle press - for text buttons */
  subtle: 0.98,
  /** Default press - for buttons */
  default: 0.96,
  /** Prominent press - for cards */
  prominent: 0.94,
} as const;

/**
 * Common animation durations in ms
 */
export const durations = {
  instant: 0,
  fast: 150,
  default: 200,
  slow: 300,
  slower: 500,
} as const;

export type SpringPreset = keyof typeof springs;
export type TimingPreset = keyof typeof timing;
export type PressScalePreset = keyof typeof pressScale;
