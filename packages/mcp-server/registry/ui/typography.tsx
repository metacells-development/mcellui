/**
 * Typography
 *
 * Standardized text component with preset styles for consistent typography.
 * Wraps React Native Text with theme-aware typography presets.
 *
 * @example
 * ```tsx
 * <Typography variant="h1">Main Heading</Typography>
 * <Typography variant="body">Body text content</Typography>
 * <Typography variant="caption" color="muted">Muted caption</Typography>
 * <Typography variant="code">const x = 1;</Typography>
 * ```
 */

import React from 'react';
import { Text, TextProps, TextStyle, StyleSheet } from 'react-native';
import { useTheme, ThemeColors, TypographyKey, fontWeight } from '@metacells/mcellui-core';

export type TypographyVariant = TypographyKey | 'subtitle1' | 'subtitle2' | 'body1' | 'body2';

export interface TypographyProps extends Omit<TextProps, 'style'> {
  /** Typography preset variant */
  variant?: TypographyVariant;
  /** Text color - can be a theme color key or custom color */
  color?: keyof ThemeColors | 'muted' | 'primary' | 'error' | string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'auto';
  /** Make text bold (overrides variant weight) */
  bold?: boolean;
  /** Make text italic */
  italic?: boolean;
  /** Underline the text */
  underline?: boolean;
  /** Strike through the text */
  strikethrough?: boolean;
  /** Additional text styles */
  style?: TextStyle;
  /** Text content */
  children: React.ReactNode;
}

export function Typography({
  variant = 'body',
  color,
  align,
  bold,
  italic,
  underline,
  strikethrough,
  style,
  children,
  ...props
}: TypographyProps) {
  const { colors, typography, fonts } = useTheme();

  // Map variant to typography preset
  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      // h5 and h6 now use typography tokens
      case 'h5':
        return typography.h5;
      case 'h6':
        return typography.h6;
      // Subtitle variants (maps to label styles)
      case 'subtitle1':
        return typography.label;
      case 'subtitle2':
        return typography.labelSm;
      // Body aliases
      case 'body1':
        return typography.body;
      case 'body2':
        return typography.bodySm;
      // Direct typography presets
      default:
        return typography[variant as TypographyKey] || typography.body;
    }
  };

  // Resolve color
  const getColor = (): string => {
    if (!color) {
      // Default colors based on variant
      if (variant === 'caption' || variant === 'overline') {
        return colors.foregroundMuted;
      }
      return colors.foreground;
    }

    // Semantic color shortcuts
    switch (color) {
      case 'muted':
        return colors.foregroundMuted;
      case 'primary':
        return colors.primary;
      case 'error':
        return colors.destructive;
      default:
        // Check if it's a theme color key
        if (color in colors) {
          return colors[color as keyof ThemeColors];
        }
        // Custom color string
        return color;
    }
  };

  const variantStyle = getVariantStyle();
  const textColor = getColor();

  return (
    <Text
      style={[
        variantStyle,
        { color: textColor },
        align && { textAlign: align },
        bold && styles.bold,
        italic && styles.italic,
        underline && styles.underline,
        strikethrough && styles.strikethrough,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

// Convenience components for common use cases
export function H1(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="h1" {...props} />;
}

export function H2(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="h2" {...props} />;
}

export function H3(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="h3" {...props} />;
}

export function H4(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="h4" {...props} />;
}

export function H5(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="h5" {...props} />;
}

export function H6(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="h6" {...props} />;
}

export function Body(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="body" {...props} />;
}

export function BodyLarge(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="bodyLg" {...props} />;
}

export function BodySmall(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="bodySm" {...props} />;
}

export function Caption(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="caption" {...props} />;
}

export function Overline(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="overline" {...props} />;
}

export function Code(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="code" {...props} />;
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: fontWeight.bold,
  },
  italic: {
    fontStyle: 'italic',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
});
