/**
 * Alert
 *
 * Inline alert/banner for persistent messages.
 * Supports multiple variants for different message types.
 *
 * @example
 * ```tsx
 * <Alert>Default informational message</Alert>
 * <Alert variant="success" title="Success!">Operation completed</Alert>
 * <Alert variant="warning" onClose={() => {}}>This is dismissible</Alert>
 * <Alert variant="destructive" icon={<CustomIcon />}>Error occurred</Alert>
 * ```
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme, ThemeColors } from '@metacells/mcellui-core';

export type AlertVariant = 'default' | 'info' | 'success' | 'warning' | 'destructive';
export type AlertSize = 'sm' | 'md' | 'lg';

export interface AlertProps {
  /** Alert content */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: AlertVariant;
  /** Size variant */
  size?: AlertSize;
  /** Optional title displayed above the message */
  title?: string;
  /** Custom icon element (overrides default variant icon) */
  icon?: React.ReactNode;
  /** Hide the default icon */
  hideIcon?: boolean;
  /** Callback when close button is pressed (shows close button if provided) */
  onClose?: () => void;
  /** Additional container styles */
  style?: ViewStyle;
  /** Additional title styles */
  titleStyle?: TextStyle;
  /** Additional text styles */
  textStyle?: TextStyle;
  /** Accessibility label for the alert */
  accessibilityLabel?: string;
}

// Icons for each variant
function InfoIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <Path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SuccessIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function WarningIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 9v4M12 17h.01" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ErrorIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <Path d="M15 9l-6 6M9 9l6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CloseIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const sizeTokens = {
  sm: {
    padding: 12,
    iconSize: 16,
    titleSize: 13,
    textSize: 12,
    gap: 8,
  },
  md: {
    padding: 16,
    iconSize: 20,
    titleSize: 15,
    textSize: 14,
    gap: 12,
  },
  lg: {
    padding: 20,
    iconSize: 24,
    titleSize: 17,
    textSize: 16,
    gap: 16,
  },
};

export function Alert({
  children,
  variant = 'default',
  size = 'md',
  title,
  icon,
  hideIcon = false,
  onClose,
  style,
  titleStyle,
  textStyle,
  accessibilityLabel,
}: AlertProps) {
  const { colors, radius, platformShadow } = useTheme();
  const tokens = sizeTokens[size];
  const variantStyles = getVariantStyles(variant, colors);

  // Get the appropriate icon for the variant
  const renderIcon = () => {
    if (hideIcon) return null;
    if (icon) return icon;

    const iconColor = variantStyles.iconColor;
    const iconSize = tokens.iconSize;

    switch (variant) {
      case 'info':
      case 'default':
        return <InfoIcon color={iconColor} size={iconSize} />;
      case 'success':
        return <SuccessIcon color={iconColor} size={iconSize} />;
      case 'warning':
        return <WarningIcon color={iconColor} size={iconSize} />;
      case 'destructive':
        return <ErrorIcon color={iconColor} size={iconSize} />;
      default:
        return <InfoIcon color={iconColor} size={iconSize} />;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          padding: tokens.padding,
          borderRadius: radius.lg,
          gap: tokens.gap,
        },
        variantStyles.container,
        platformShadow('sm'),
        style,
      ]}
      accessibilityRole="alert"
      accessibilityLabel={accessibilityLabel || title || (typeof children === 'string' ? children : undefined)}
    >
      {/* Icon */}
      {!hideIcon && (
        <View style={styles.iconContainer}>
          {renderIcon()}
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {title && (
          <Text
            style={[
              styles.title,
              {
                fontSize: tokens.titleSize,
                color: variantStyles.titleColor,
              },
              titleStyle,
            ]}
          >
            {title}
          </Text>
        )}
        <Text
          style={[
            styles.text,
            {
              fontSize: tokens.textSize,
              color: variantStyles.textColor,
            },
            textStyle,
          ]}
        >
          {children}
        </Text>
      </View>

      {/* Close button */}
      {onClose && (
        <Pressable
          onPress={onClose}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.closeButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Close alert"
        >
          <CloseIcon color={variantStyles.iconColor} size={tokens.iconSize - 4} />
        </Pressable>
      )}
    </View>
  );
}

function getVariantStyles(variant: AlertVariant, colors: ThemeColors) {
  switch (variant) {
    case 'default':
    case 'info':
      return {
        container: {
          backgroundColor: colors.secondary,
          borderWidth: 1,
          borderColor: colors.border,
        } as ViewStyle,
        iconColor: colors.primary,
        titleColor: colors.foreground,
        textColor: colors.foregroundMuted,
      };
    case 'success':
      return {
        container: {
          backgroundColor: `${colors.success}15`,
          borderWidth: 1,
          borderColor: `${colors.success}30`,
        } as ViewStyle,
        iconColor: colors.success,
        titleColor: colors.success,
        textColor: colors.foreground,
      };
    case 'warning':
      return {
        container: {
          backgroundColor: `${colors.warning}15`,
          borderWidth: 1,
          borderColor: `${colors.warning}30`,
        } as ViewStyle,
        iconColor: colors.warning,
        titleColor: colors.warning,
        textColor: colors.foreground,
      };
    case 'destructive':
      return {
        container: {
          backgroundColor: `${colors.destructive}15`,
          borderWidth: 1,
          borderColor: `${colors.destructive}30`,
        } as ViewStyle,
        iconColor: colors.destructive,
        titleColor: colors.destructive,
        textColor: colors.foreground,
      };
    default:
      return {
        container: {
          backgroundColor: colors.secondary,
          borderWidth: 1,
          borderColor: colors.border,
        } as ViewStyle,
        iconColor: colors.primary,
        titleColor: colors.foreground,
        textColor: colors.foregroundMuted,
      };
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    flexShrink: 0,
    marginTop: 2,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontWeight: '600',
  },
  text: {
    lineHeight: 20,
  },
  closeButton: {
    flexShrink: 0,
    padding: 4,
    marginTop: -4,
    marginRight: -4,
    borderRadius: 4,
  },
  closeButtonPressed: {
    opacity: 0.7,
  },
});
