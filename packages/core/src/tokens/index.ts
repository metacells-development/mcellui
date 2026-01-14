export { colors, type Colors, type ColorKey } from './colors';
export { spacing, type Spacing, type SpacingKey } from './spacing';
export {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  type FontFamily,
  type FontSize,
  type FontWeight,
  type LineHeight,
  type LetterSpacing,
} from './typography';
export { radius, type Radius, type RadiusKey } from './radius';
export { shadows, type Shadows, type ShadowKey } from './shadows';

// Theme type combining all tokens
export interface Theme {
  colors: typeof import('./colors').colors;
  spacing: typeof import('./spacing').spacing;
  fontFamily: typeof import('./typography').fontFamily;
  fontSize: typeof import('./typography').fontSize;
  fontWeight: typeof import('./typography').fontWeight;
  lineHeight: typeof import('./typography').lineHeight;
  letterSpacing: typeof import('./typography').letterSpacing;
  radius: typeof import('./radius').radius;
  shadows: typeof import('./shadows').shadows;
}
