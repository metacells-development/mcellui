/**
 * NativeUI Constants
 *
 * Zentralisierte Magic Numbers und Konfigurationswerte.
 * Diese Werte werden von Components verwendet und können
 * über Props überschrieben werden.
 *
 * @example
 * ```tsx
 * import { SHEET_CONSTANTS } from '@metacells/mcellui-core';
 *
 * // In SheetContent:
 * if (translationY > height * SHEET_CONSTANTS.closeThreshold) {
 *   close();
 * }
 * ```
 */

// ============================================
// Sheet Constants
// ============================================

export const SHEET_CONSTANTS = {
  /** Threshold (0-1) für automatisches Schließen beim Ziehen */
  closeThreshold: 0.3,
  /** Geschwindigkeit (px/s) für Swipe-to-Close */
  velocityThreshold: 500,
  /** Backdrop Fade-In Dauer (ms) */
  backdropFadeInDuration: 200,
  /** Backdrop Fade-Out Dauer (ms) */
  backdropFadeOutDuration: 150,
  /** Maximale Backdrop Opacity */
  backdropMaxOpacity: 0.5,
  /** Handle Breite (px) */
  handleWidth: 36,
  /** Handle Höhe (px) */
  handleHeight: 4,
  /** Handle Container Padding Top (px) */
  handlePaddingTop: 12,
  /** Handle Container Padding Bottom (px) */
  handlePaddingBottom: 8,
  /** Content Horizontal Padding (px) */
  contentPaddingHorizontal: 16,
} as const;

// ============================================
// Dialog Constants
// ============================================

export const DIALOG_CONSTANTS = {
  /** Screen Margin für Dialog Breite (px) */
  screenMargin: 48,
  /** Close Animation Dauer (ms) */
  closeAnimationDuration: 150,
  /** Start Scale für Enter Animation */
  enterStartScale: 0.95,
  /** Dialog Content Padding (px) */
  contentPadding: 24,
  /** Backdrop Max Opacity */
  backdropMaxOpacity: 0.5,
} as const;

// ============================================
// Toast Constants
// ============================================

export const TOAST_CONSTANTS = {
  /** Standard Anzeigedauer (ms) */
  defaultDuration: 4000,
  /** Maximale gleichzeitig sichtbare Toasts */
  maxToasts: 3,
  /** Fade-Out Dauer (ms) */
  fadeOutDuration: 150,
  /** Container Top Offset vom SafeArea (px) */
  containerTopOffset: 8,
  /** Toast Width Margin (px) - wird von Screen Width abgezogen */
  widthMargin: 32,
  /** Fallback Farben wenn Theme sie nicht hat */
  fallbackColors: {
    success: '#22c55e',
    successForeground: '#ffffff',
    warning: '#f59e0b',
    warningForeground: '#000000',
  },
} as const;

// ============================================
// Button Constants
// ============================================

export const BUTTON_CONSTANTS = {
  /** Scale beim Drücken (0-1) */
  pressScale: 0.97,
  /** Opacity bei disabled */
  disabledOpacity: 0.5,
} as const;

// ============================================
// Accordion Constants
// ============================================

export const ACCORDION_CONSTANTS = {
  /** Animation Dauer (ms) */
  animationDuration: 250,
  /** Trigger Text Font Size */
  triggerFontSize: 15,
  /** Chevron Font Size */
  chevronFontSize: 10,
  /** Chevron Margin Left */
  chevronMarginLeft: 8,
} as const;

// ============================================
// Swipeable Row Constants
// ============================================

export const SWIPEABLE_CONSTANTS = {
  /** Standard Action Button Breite (px) */
  actionWidth: 80,
  /** Geschwindigkeit für Snap (px/s) */
  velocityThreshold: 500,
  /** Full Swipe Threshold (0-1 von Screen Width) */
  fullSwipeThreshold: 0.5,
  /** Full Swipe Animation Dauer (ms) */
  fullSwipeAnimationDuration: 200,
  /** Resistance Factor am Edge (0-1) */
  resistanceFactor: 0.2,
  /** Active Offset für Gesture Start (px) */
  activeOffset: 10,
  /** Action Icon Margin Bottom (px) */
  actionIconMarginBottom: 4,
  /** Action Button Horizontal Padding (px) */
  actionButtonPaddingHorizontal: 8,
  /** Action Label Font Size */
  actionLabelFontSize: 12,
} as const;

// ============================================
// Animation Constants (ergänzend zu theme/animations)
// ============================================

export const ANIMATION_CONSTANTS = {
  /** Standard Spring Damping */
  springDamping: 20,
  /** Standard Spring Stiffness */
  springStiffness: 200,
} as const;

// ============================================
// Slider Constants
// ============================================

export const SLIDER_CONSTANTS = {
  /** Track Höhe (px) */
  trackHeight: 6,
  /** Thumb Größe (px) */
  thumbSize: 24,
  /** Hit Slop für Touch (px) */
  hitSlop: 10,
} as const;

// ============================================
// Stepper Constants
// ============================================

export const STEPPER_CONSTANTS = {
  /** Button Größe (px) */
  buttonSize: 36,
  /** Long Press Delay (ms) */
  longPressDelay: 500,
  /** Repeat Interval (ms) */
  repeatInterval: 100,
  /** Min Input Width (px) */
  minInputWidth: 48,
} as const;

// ============================================
// Typography Constants (für Component Styles)
// ============================================

export const TYPOGRAPHY_CONSTANTS = {
  /** Title Font Size für Overlays (Sheet, Dialog) */
  overlayTitleSize: 18,
  /** Description Font Size für Overlays */
  overlayDescriptionSize: 14,
  /** Description Line Height für Dialogs */
  overlayDescriptionLineHeight: 20,
} as const;

// ============================================
// Export Types
// ============================================

export type SheetConstants = typeof SHEET_CONSTANTS;
export type DialogConstants = typeof DIALOG_CONSTANTS;
export type ToastConstants = typeof TOAST_CONSTANTS;
export type ButtonConstants = typeof BUTTON_CONSTANTS;
export type AccordionConstants = typeof ACCORDION_CONSTANTS;
export type SwipeableConstants = typeof SWIPEABLE_CONSTANTS;
export type AnimationConstants = typeof ANIMATION_CONSTANTS;
export type SliderConstants = typeof SLIDER_CONSTANTS;
export type StepperConstants = typeof STEPPER_CONSTANTS;
export type TypographyConstants = typeof TYPOGRAPHY_CONSTANTS;
