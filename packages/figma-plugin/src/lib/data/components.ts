/**
 * nativeui Component Definitions für Figma
 *
 * PIXEL-PERFEKTE Werte direkt aus packages/core/src/theme/
 *
 * Spacing Scale (spacing[key] = value):
 *   0.5=2, 1=4, 1.5=6, 2=8, 2.5=10, 3=12, 3.5=14, 4=16, 5=20, 6=24
 *
 * Radius Scale (md preset, base=8):
 *   xs=2, sm=4, md=8, lg=12, xl=16, 2xl=24, full=9999
 *
 * Component Radius:
 *   button=8, buttonSm=4, buttonLg=12, checkbox=4, switch=9999, badge=9999
 */

// =============================================================================
// Types
// =============================================================================

export interface SizeTokens {
  height: number;
  width?: number;
  paddingHorizontal: number;
  paddingVertical: number;
  borderRadius: number;
  fontSize: number;
  fontWeight: number;
  gap: number;
  borderWidth?: number;
  iconSize?: number;
}

export interface VariantStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  textColor?: string;
  opacity?: number;
}

export interface ComponentDefinition {
  name: string;
  description: string;
  category: 'input' | 'display' | 'feedback' | 'layout';
  sizes: ('xs' | 'sm' | 'md' | 'lg' | 'xl')[];
  variants: string[];
  states: string[];
  sizeTokens: Record<string, SizeTokens>;
  variantStyles: Record<string, VariantStyle>;
  stateStyles?: Record<string, VariantStyle>;
  hasLabel?: boolean;
  hasIcon?: boolean;
  isSquare?: boolean;  // width = height
  isRound?: boolean;   // borderRadius = 9999
}

// =============================================================================
// Button - EXAKTE Werte aus buttonTokens
// =============================================================================

export const buttonComponent: ComponentDefinition = {
  name: 'Button',
  description: 'Pressable button with variants and sizes',
  category: 'input',
  sizes: ['sm', 'md', 'lg'],
  variants: ['default', 'secondary', 'outline', 'ghost', 'destructive'],
  states: ['default', 'disabled'],
  sizeTokens: {
    sm: {
      height: 32,              // componentHeight.sm
      paddingHorizontal: 12,   // spacing[3]
      paddingVertical: 6,      // spacing[1.5]
      borderRadius: 4,         // componentRadius.buttonSm = radius.sm
      fontSize: 14,            // fontSize.base
      fontWeight: 600,
      gap: 6,                  // spacing[1.5]
      iconSize: 16,
    },
    md: {
      height: 44,              // componentHeight.md
      paddingHorizontal: 16,   // spacing[4]
      paddingVertical: 10,     // spacing[2.5]
      borderRadius: 8,         // componentRadius.button = radius.md
      fontSize: 16,            // fontSize.md
      fontWeight: 600,
      gap: 8,                  // spacing[2]
      iconSize: 20,
    },
    lg: {
      height: 52,              // componentHeight.lg
      paddingHorizontal: 24,   // spacing[6]
      paddingVertical: 14,     // spacing[3.5]
      borderRadius: 12,        // componentRadius.buttonLg = radius.lg
      fontSize: 18,            // fontSize.lg
      fontWeight: 600,
      gap: 10,                 // spacing[2.5]
      iconSize: 24,
    },
  },
  variantStyles: {
    default: {
      fill: 'primary/primary',
      textColor: 'primary/primaryForeground',
    },
    secondary: {
      fill: 'secondary/secondary',
      textColor: 'secondary/secondaryForeground',
    },
    outline: {
      stroke: 'border/border',
      strokeWidth: 1,
      textColor: 'foreground/foreground',
    },
    ghost: {
      textColor: 'foreground/foreground',
    },
    destructive: {
      fill: 'destructive/destructive',
      textColor: 'destructive/destructiveForeground',
    },
  },
  stateStyles: {
    disabled: { opacity: 0.5 },
  },
};

// =============================================================================
// Checkbox - EXAKTE Werte aus checkboxTokens
// =============================================================================

export const checkboxComponent: ComponentDefinition = {
  name: 'Checkbox',
  description: 'Animated checkbox with checkmark',
  category: 'input',
  sizes: ['sm', 'md', 'lg'],
  variants: ['default'],
  states: ['unchecked', 'checked', 'indeterminate', 'disabled'],
  isSquare: true,
  sizeTokens: {
    sm: {
      height: 18,              // checkboxTokens.sm.size
      width: 18,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 4,         // componentRadius.checkbox = radius.sm = 4
      borderWidth: 2,          // checkboxTokens.borderWidth
      fontSize: 14,            // labelFontSize
      fontWeight: 500,
      gap: 8,                  // spacing[2]
      iconSize: 12,            // checkboxTokens.sm.iconSize
    },
    md: {
      height: 22,              // checkboxTokens.md.size
      width: 22,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 4,         // componentRadius.checkbox = radius.sm = 4
      borderWidth: 2,
      fontSize: 16,
      fontWeight: 500,
      gap: 10,                 // spacing[2.5]
      iconSize: 14,            // checkboxTokens.md.iconSize
    },
    lg: {
      height: 26,              // checkboxTokens.lg.size
      width: 26,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 4,         // componentRadius.checkbox = radius.sm = 4
      borderWidth: 2,
      fontSize: 18,
      fontWeight: 500,
      gap: 12,                 // spacing[3]
      iconSize: 18,            // checkboxTokens.lg.iconSize
    },
  },
  variantStyles: {
    default: {},
  },
  stateStyles: {
    unchecked: {
      stroke: 'border/border',
      strokeWidth: 2,
    },
    checked: {
      fill: 'primary/primary',
    },
    indeterminate: {
      fill: 'primary/primary',
    },
    disabled: {
      opacity: 0.5,
    },
  },
  hasLabel: true,
};

// =============================================================================
// Switch - EXAKTE Werte aus switchTokens
// =============================================================================

export const switchComponent: ComponentDefinition = {
  name: 'Switch',
  description: 'iOS-style toggle switch',
  category: 'input',
  sizes: ['sm', 'md', 'lg'],
  variants: ['default'],
  states: ['off', 'on', 'disabled'],
  isRound: true,
  sizeTokens: {
    sm: {
      height: 24,              // trackHeight
      width: 40,               // trackWidth
      paddingHorizontal: 2,    // thumbOffset
      paddingVertical: 2,
      borderRadius: 9999,      // componentRadius.switch = radius.full
      fontSize: 14,
      fontWeight: 500,
      gap: 12,                 // spacing[3]
      iconSize: 20,            // thumbSize
    },
    md: {
      height: 30,              // trackHeight
      width: 50,               // trackWidth
      paddingHorizontal: 2,
      paddingVertical: 2,
      borderRadius: 9999,
      fontSize: 16,
      fontWeight: 500,
      gap: 12,
      iconSize: 26,            // thumbSize
    },
    lg: {
      height: 36,              // trackHeight
      width: 60,               // trackWidth
      paddingHorizontal: 2,
      paddingVertical: 2,
      borderRadius: 9999,
      fontSize: 18,
      fontWeight: 500,
      gap: 16,                 // spacing[4]
      iconSize: 32,            // thumbSize
    },
  },
  variantStyles: {
    default: {},
  },
  stateStyles: {
    off: {
      fill: 'background/backgroundMuted',
    },
    on: {
      fill: 'primary/primary',
    },
    disabled: {
      opacity: 0.5,
    },
  },
  hasLabel: true,
};

// =============================================================================
// Badge - EXAKTE Werte aus badgeTokens
// =============================================================================

export const badgeComponent: ComponentDefinition = {
  name: 'Badge',
  description: 'Status indicator badge',
  category: 'display',
  sizes: ['sm', 'md', 'lg'],
  variants: ['default', 'secondary', 'destructive', 'outline'],
  states: ['default'],
  isRound: true,
  sizeTokens: {
    sm: {
      height: 18,
      paddingHorizontal: 6,    // spacing[1.5]
      paddingVertical: 2,      // spacing[0.5]
      borderRadius: 9999,
      fontSize: 11,            // fontSize.xs
      fontWeight: 500,
      gap: 4,
    },
    md: {
      height: 22,
      paddingHorizontal: 10,   // spacing[2.5]
      paddingVertical: 2,
      borderRadius: 9999,
      fontSize: 12,            // fontSize.sm
      fontWeight: 500,
      gap: 4,
    },
    lg: {
      height: 26,
      paddingHorizontal: 12,   // spacing[3]
      paddingVertical: 4,      // spacing[1]
      borderRadius: 9999,
      fontSize: 14,            // fontSize.base
      fontWeight: 500,
      gap: 4,
    },
  },
  variantStyles: {
    default: {
      fill: 'primary/primary',
      textColor: 'primary/primaryForeground',
    },
    secondary: {
      fill: 'secondary/secondary',
      textColor: 'secondary/secondaryForeground',
    },
    destructive: {
      fill: 'destructive/destructive',
      textColor: 'destructive/destructiveForeground',
    },
    outline: {
      stroke: 'border/border',
      strokeWidth: 1,
      textColor: 'foreground/foreground',
    },
  },
};

// =============================================================================
// Avatar - EXAKTE Werte aus avatarTokens
// =============================================================================

export const avatarComponent: ComponentDefinition = {
  name: 'Avatar',
  description: 'User avatar with initials',
  category: 'display',
  sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
  variants: ['default'],
  states: ['default'],
  isSquare: true,
  isRound: true,
  sizeTokens: {
    xs: {
      height: 24,
      width: 24,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 9999,
      fontSize: 10,            // fontSize['2xs']
      fontWeight: 600,
      gap: 0,
    },
    sm: {
      height: 32,
      width: 32,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 9999,
      fontSize: 11,            // fontSize.xs
      fontWeight: 600,
      gap: 0,
    },
    md: {
      height: 40,
      width: 40,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 9999,
      fontSize: 14,            // fontSize.base
      fontWeight: 600,
      gap: 0,
    },
    lg: {
      height: 56,
      width: 56,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 9999,
      fontSize: 20,            // fontSize.xl
      fontWeight: 600,
      gap: 0,
    },
    xl: {
      height: 80,
      width: 80,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 9999,
      fontSize: 24,            // fontSize['2xl']
      fontWeight: 600,
      gap: 0,
    },
  },
  variantStyles: {
    default: {
      fill: 'secondary/secondary',
      textColor: 'secondary/secondaryForeground',
    },
  },
};

// =============================================================================
// Input - EXAKTE Werte aus inputTokens
// =============================================================================

export const inputComponent: ComponentDefinition = {
  name: 'Input',
  description: 'Text input field',
  category: 'input',
  sizes: ['sm', 'md', 'lg'],
  variants: ['default'],
  states: ['default', 'focused', 'error', 'disabled'],
  sizeTokens: {
    sm: {
      height: 32,
      paddingHorizontal: 12,   // spacing[3]
      paddingVertical: 6,
      borderRadius: 8,         // radius.md
      borderWidth: 1,
      fontSize: 14,
      fontWeight: 400,
      gap: 8,
      iconSize: 16,
    },
    md: {
      height: 44,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      fontSize: 16,
      fontWeight: 400,
      gap: 8,
      iconSize: 20,
    },
    lg: {
      height: 52,
      paddingHorizontal: 16,   // spacing[4]
      paddingVertical: 12,
      borderRadius: 12,        // radius.lg
      borderWidth: 1,
      fontSize: 18,
      fontWeight: 400,
      gap: 8,
      iconSize: 24,
    },
  },
  variantStyles: {
    default: {
      fill: 'input/input',
      stroke: 'input/inputBorder',
      strokeWidth: 1,
      textColor: 'foreground/foreground',
    },
  },
  stateStyles: {
    focused: {
      stroke: 'border/borderFocused',
      strokeWidth: 2,
    },
    error: {
      stroke: 'error/error',
      strokeWidth: 1,
    },
    disabled: {
      fill: 'background/backgroundMuted',
      opacity: 0.5,
    },
  },
};

// =============================================================================
// Card - EXAKTE Werte aus cardTokens
// =============================================================================

export const cardComponent: ComponentDefinition = {
  name: 'Card',
  description: 'Container card with shadow',
  category: 'layout',
  sizes: ['md'],
  variants: ['default'],
  states: ['default'],
  sizeTokens: {
    md: {
      height: 120,             // Auto
      width: 320,
      paddingHorizontal: 16,   // cardTokens.padding = spacing[4]
      paddingVertical: 16,
      borderRadius: 12,        // cardTokens.borderRadius = radius.lg
      borderWidth: 1,
      fontSize: 18,            // titleFontSize
      fontWeight: 600,
      gap: 4,                  // spacing[1]
    },
  },
  variantStyles: {
    default: {
      fill: 'card/card',
      stroke: 'border/border',
      strokeWidth: 1,
      textColor: 'card/cardForeground',
    },
  },
};

// =============================================================================
// Progress - Tokens
// =============================================================================

export const progressComponent: ComponentDefinition = {
  name: 'Progress',
  description: 'Progress bar',
  category: 'feedback',
  sizes: ['sm', 'md', 'lg'],
  variants: ['default'],
  states: ['default'],
  sizeTokens: {
    sm: {
      height: 4,
      width: 200,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 2,
      fontSize: 0,
      fontWeight: 400,
      gap: 0,
    },
    md: {
      height: 8,
      width: 200,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 4,
      fontSize: 0,
      fontWeight: 400,
      gap: 0,
    },
    lg: {
      height: 12,
      width: 200,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 6,
      fontSize: 0,
      fontWeight: 400,
      gap: 0,
    },
  },
  variantStyles: {
    default: {
      fill: 'background/backgroundMuted',
    },
  },
};

// =============================================================================
// Spinner - Tokens
// =============================================================================

export const spinnerComponent: ComponentDefinition = {
  name: 'Spinner',
  description: 'Loading spinner',
  category: 'feedback',
  sizes: ['sm', 'md', 'lg'],
  variants: ['default'],
  states: ['default'],
  isSquare: true,
  sizeTokens: {
    sm: {
      height: 16,
      width: 16,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 9999,
      fontSize: 0,
      fontWeight: 400,
      gap: 0,
    },
    md: {
      height: 24,
      width: 24,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 9999,
      fontSize: 0,
      fontWeight: 400,
      gap: 0,
    },
    lg: {
      height: 32,
      width: 32,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 9999,
      fontSize: 0,
      fontWeight: 400,
      gap: 0,
    },
  },
  variantStyles: {
    default: {
      fill: 'foreground/foreground',
    },
  },
};

// =============================================================================
// Separator
// =============================================================================

export const separatorComponent: ComponentDefinition = {
  name: 'Separator',
  description: 'Visual divider',
  category: 'layout',
  sizes: ['md'],
  variants: ['horizontal', 'vertical'],
  states: ['default'],
  sizeTokens: {
    md: {
      height: 1,
      width: 200,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 0,
      fontSize: 0,
      fontWeight: 400,
      gap: 0,
    },
  },
  variantStyles: {
    horizontal: {
      fill: 'border/border',
    },
    vertical: {
      fill: 'border/border',
    },
  },
};

// =============================================================================
// Label
// =============================================================================

export const labelComponent: ComponentDefinition = {
  name: 'Label',
  description: 'Form label',
  category: 'display',
  sizes: ['sm', 'md', 'lg'],
  variants: ['default'],
  states: ['default', 'disabled', 'error'],
  sizeTokens: {
    sm: {
      height: 16,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 0,
      fontSize: 12,
      fontWeight: 500,
      gap: 4,
    },
    md: {
      height: 20,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 0,
      fontSize: 14,
      fontWeight: 500,
      gap: 4,
    },
    lg: {
      height: 24,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 0,
      fontSize: 16,
      fontWeight: 500,
      gap: 4,
    },
  },
  variantStyles: {
    default: {
      textColor: 'foreground/foreground',
    },
  },
  stateStyles: {
    disabled: {
      textColor: 'foreground/foregroundMuted',
    },
    error: {
      textColor: 'destructive/destructive',
    },
  },
};

// =============================================================================
// Export All
// =============================================================================

export const allComponents: ComponentDefinition[] = [
  buttonComponent,
  checkboxComponent,
  switchComponent,
  badgeComponent,
  avatarComponent,
  inputComponent,
  cardComponent,
  progressComponent,
  spinnerComponent,
  separatorComponent,
  labelComponent,
];

export const componentsByName: Record<string, ComponentDefinition> = {
  Button: buttonComponent,
  Checkbox: checkboxComponent,
  Switch: switchComponent,
  Badge: badgeComponent,
  Avatar: avatarComponent,
  Input: inputComponent,
  Card: cardComponent,
  Progress: progressComponent,
  Spinner: spinnerComponent,
  Separator: separatorComponent,
  Label: labelComponent,
};
