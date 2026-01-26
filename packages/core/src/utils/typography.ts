/**
 * Typography Utilities
 *
 * Helper functions for working with typography tokens in React Native.
 * React Native requires absolute lineHeight values (in pixels), not CSS
 * multipliers like web.
 *
 * @example
 * ```tsx
 * import { getLineHeight, lineHeight, fontSize } from '@metacells/mcellui-core';
 *
 * // Instead of inline calculations:
 * // lineHeight: fontSize.base * 1.5
 *
 * // Use the helper:
 * lineHeight: getLineHeight(fontSize.base, lineHeight.normal)
 * // or with shorthand:
 * lineHeight: getLineHeight(14, 'normal')
 * ```
 */

import { fontSize, lineHeight as lineHeightTokens, type LineHeightKey } from '../theme/typography';

/**
 * Calculates absolute lineHeight for React Native.
 *
 * React Native requires lineHeight as absolute pixel values, not CSS multipliers.
 * This helper converts fontSize + multiplier into the correct absolute value.
 *
 * @param size - Font size in pixels (e.g., fontSize.base = 14)
 * @param multiplier - Either a numeric multiplier (1.5) or a lineHeight key ('normal')
 * @returns Absolute lineHeight in pixels
 *
 * @example
 * ```tsx
 * // Using numeric multiplier
 * getLineHeight(14, 1.5) // => 21
 *
 * // Using lineHeight token key
 * getLineHeight(fontSize.base, 'normal') // => 21
 *
 * // Using lineHeight token value directly
 * getLineHeight(fontSize.base, lineHeight.normal) // => 21
 * ```
 */
export function getLineHeight(
  size: number,
  multiplier: number | LineHeightKey
): number {
  const mult = typeof multiplier === 'string'
    ? lineHeightTokens[multiplier]
    : multiplier;

  return Math.round(size * mult);
}

/**
 * Pre-computed lineHeight values for common fontSize + lineHeight combinations.
 *
 * Use these when you want consistent, pre-calculated values without calling
 * getLineHeight() each time.
 *
 * @example
 * ```tsx
 * import { computedLineHeight } from '@metacells/mcellui-core';
 *
 * <Text style={{ fontSize: 14, lineHeight: computedLineHeight.base.normal }}>
 *   Body text with normal line height
 * </Text>
 * ```
 */
export const computedLineHeight = {
  /** fontSize['2xs'] = 10 */
  '2xs': {
    none: getLineHeight(fontSize['2xs'], 'none'),
    tight: getLineHeight(fontSize['2xs'], 'tight'),
    snug: getLineHeight(fontSize['2xs'], 'snug'),
    normal: getLineHeight(fontSize['2xs'], 'normal'),
    relaxed: getLineHeight(fontSize['2xs'], 'relaxed'),
    loose: getLineHeight(fontSize['2xs'], 'loose'),
  },
  /** fontSize.xs = 11 */
  xs: {
    none: getLineHeight(fontSize.xs, 'none'),
    tight: getLineHeight(fontSize.xs, 'tight'),
    snug: getLineHeight(fontSize.xs, 'snug'),
    normal: getLineHeight(fontSize.xs, 'normal'),
    relaxed: getLineHeight(fontSize.xs, 'relaxed'),
    loose: getLineHeight(fontSize.xs, 'loose'),
  },
  /** fontSize.sm = 12 */
  sm: {
    none: getLineHeight(fontSize.sm, 'none'),
    tight: getLineHeight(fontSize.sm, 'tight'),
    snug: getLineHeight(fontSize.sm, 'snug'),
    normal: getLineHeight(fontSize.sm, 'normal'),
    relaxed: getLineHeight(fontSize.sm, 'relaxed'),
    loose: getLineHeight(fontSize.sm, 'loose'),
  },
  /** fontSize.base = 14 */
  base: {
    none: getLineHeight(fontSize.base, 'none'),
    tight: getLineHeight(fontSize.base, 'tight'),
    snug: getLineHeight(fontSize.base, 'snug'),
    normal: getLineHeight(fontSize.base, 'normal'),
    relaxed: getLineHeight(fontSize.base, 'relaxed'),
    loose: getLineHeight(fontSize.base, 'loose'),
  },
  /** fontSize.md = 16 */
  md: {
    none: getLineHeight(fontSize.md, 'none'),
    tight: getLineHeight(fontSize.md, 'tight'),
    snug: getLineHeight(fontSize.md, 'snug'),
    normal: getLineHeight(fontSize.md, 'normal'),
    relaxed: getLineHeight(fontSize.md, 'relaxed'),
    loose: getLineHeight(fontSize.md, 'loose'),
  },
  /** fontSize.lg = 18 */
  lg: {
    none: getLineHeight(fontSize.lg, 'none'),
    tight: getLineHeight(fontSize.lg, 'tight'),
    snug: getLineHeight(fontSize.lg, 'snug'),
    normal: getLineHeight(fontSize.lg, 'normal'),
    relaxed: getLineHeight(fontSize.lg, 'relaxed'),
    loose: getLineHeight(fontSize.lg, 'loose'),
  },
  /** fontSize.xl = 20 */
  xl: {
    none: getLineHeight(fontSize.xl, 'none'),
    tight: getLineHeight(fontSize.xl, 'tight'),
    snug: getLineHeight(fontSize.xl, 'snug'),
    normal: getLineHeight(fontSize.xl, 'normal'),
    relaxed: getLineHeight(fontSize.xl, 'relaxed'),
    loose: getLineHeight(fontSize.xl, 'loose'),
  },
  /** fontSize['2xl'] = 24 */
  '2xl': {
    none: getLineHeight(fontSize['2xl'], 'none'),
    tight: getLineHeight(fontSize['2xl'], 'tight'),
    snug: getLineHeight(fontSize['2xl'], 'snug'),
    normal: getLineHeight(fontSize['2xl'], 'normal'),
    relaxed: getLineHeight(fontSize['2xl'], 'relaxed'),
    loose: getLineHeight(fontSize['2xl'], 'loose'),
  },
  /** fontSize['3xl'] = 30 */
  '3xl': {
    none: getLineHeight(fontSize['3xl'], 'none'),
    tight: getLineHeight(fontSize['3xl'], 'tight'),
    snug: getLineHeight(fontSize['3xl'], 'snug'),
    normal: getLineHeight(fontSize['3xl'], 'normal'),
    relaxed: getLineHeight(fontSize['3xl'], 'relaxed'),
    loose: getLineHeight(fontSize['3xl'], 'loose'),
  },
  /** fontSize['4xl'] = 36 */
  '4xl': {
    none: getLineHeight(fontSize['4xl'], 'none'),
    tight: getLineHeight(fontSize['4xl'], 'tight'),
    snug: getLineHeight(fontSize['4xl'], 'snug'),
    normal: getLineHeight(fontSize['4xl'], 'normal'),
    relaxed: getLineHeight(fontSize['4xl'], 'relaxed'),
    loose: getLineHeight(fontSize['4xl'], 'loose'),
  },
  /** fontSize['5xl'] = 48 */
  '5xl': {
    none: getLineHeight(fontSize['5xl'], 'none'),
    tight: getLineHeight(fontSize['5xl'], 'tight'),
    snug: getLineHeight(fontSize['5xl'], 'snug'),
    normal: getLineHeight(fontSize['5xl'], 'normal'),
    relaxed: getLineHeight(fontSize['5xl'], 'relaxed'),
    loose: getLineHeight(fontSize['5xl'], 'loose'),
  },
} as const;

export type ComputedLineHeightKey = keyof typeof computedLineHeight;
