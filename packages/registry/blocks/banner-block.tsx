/**
 * BannerBlock
 *
 * Promotional or announcement banner with optional action.
 * Perfect for sales, announcements, and feature promotions.
 *
 * @example
 * ```tsx
 * <BannerBlock
 *   title="Summer Sale"
 *   subtitle="Up to 50% off on selected items"
 *   actionLabel="Shop Now"
 *   onAction={() => navigateToSale()}
 *   variant="gradient"
 *   gradientColors={['#FF6B6B', '#FF8E53']}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme, ecommerceBlockTokens } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// Import UI primitives
import { Button } from '../ui/button';
import { IconButton } from '../ui/icon-button';

// ============================================================================
// Icons
// ============================================================================

function CloseIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronRightIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export type BannerVariant = 'solid' | 'outline' | 'gradient' | 'image';
export type BannerSize = 'sm' | 'md' | 'lg';

export interface BannerBlockProps {
  /** Main title text */
  title: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Action button label */
  actionLabel?: string;
  /** Visual variant */
  variant?: BannerVariant;
  /** Size variant */
  size?: BannerSize;
  /** Background color (for solid variant) */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Gradient colors [start, end] (for gradient variant) */
  gradientColors?: [string, string];
  /** Background image (for image variant) */
  backgroundImage?: ImageSourcePropType;
  /** Icon element (left side) */
  icon?: React.ReactNode;
  /** Whether banner is dismissible */
  dismissible?: boolean;
  /** Called when action button is pressed */
  onAction?: () => void;
  /** Called when dismiss button is pressed */
  onDismiss?: () => void;
  /** Called when entire banner is pressed (if no action button) */
  onPress?: () => void;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function BannerBlock({
  title,
  subtitle,
  actionLabel,
  variant = 'solid',
  size = 'md',
  backgroundColor,
  textColor,
  gradientColors,
  backgroundImage,
  icon,
  dismissible = false,
  onAction,
  onDismiss,
  onPress,
  style,
}: BannerBlockProps) {
  const { colors, spacing, radius } = useTheme();
  const tokens = ecommerceBlockTokens.banner[size];
  const sharedTokens = ecommerceBlockTokens.banner;

  const handlePress = () => {
    haptic('light');
    onPress?.();
  };

  const handleAction = () => {
    haptic('medium');
    onAction?.();
  };

  const handleDismiss = () => {
    haptic('light');
    onDismiss?.();
  };

  // Determine colors based on variant
  const getBgColor = () => {
    if (backgroundColor) return backgroundColor;
    switch (variant) {
      case 'solid':
        return colors.primary;
      case 'outline':
        return 'transparent';
      case 'gradient':
        return gradientColors?.[0] || colors.primary;
      case 'image':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (textColor) return textColor;
    switch (variant) {
      case 'outline':
        return colors.foreground;
      default:
        return '#ffffff';
    }
  };

  const bgColor = getBgColor();
  const txtColor = getTextColor();

  const Container = onPress && !actionLabel ? Pressable : View;

  const content = (
    <Container
      onPress={onPress && !actionLabel ? handlePress : undefined}
      style={({ pressed }: { pressed?: boolean }) => [
        styles.container,
        {
          minHeight: tokens.minHeight,
          padding: tokens.padding,
          backgroundColor: bgColor,
          borderRadius: radius.lg,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: colors.border,
          opacity: pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      {/* Background image */}
      {variant === 'image' && backgroundImage && (
        <Image
          source={backgroundImage}
          style={[StyleSheet.absoluteFillObject, { borderRadius: radius.lg }]}
          resizeMode="cover"
        />
      )}

      {/* Dark overlay for image variant */}
      {variant === 'image' && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            styles.imageOverlay,
            { borderRadius: radius.lg },
          ]}
        />
      )}

      {/* Gradient effect (simulated with opacity) */}
      {variant === 'gradient' && gradientColors && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: radius.lg,
              backgroundColor: gradientColors[1],
              opacity: 0.7,
            },
          ]}
        />
      )}

      {/* Content */}
      <View style={styles.contentRow}>
        {/* Icon */}
        {icon && (
          <View style={{ marginRight: spacing[3] }}>
            {React.isValidElement(icon)
              ? React.cloneElement(icon as React.ReactElement<any>, {
                  width: tokens.iconSize,
                  height: tokens.iconSize,
                  color: txtColor,
                })
              : icon}
          </View>
        )}

        {/* Text content */}
        <View style={styles.textContent}>
          <Text
            style={[
              styles.title,
              {
                fontSize: tokens.titleFontSize,
                fontWeight: sharedTokens.titleFontWeight,
                color: txtColor,
              },
            ]}
            numberOfLines={2}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: tokens.subtitleFontSize,
                  color: txtColor,
                  opacity: 0.9,
                  marginTop: spacing[0.5],
                  lineHeight: sharedTokens.subtitleLineHeight,
                },
              ]}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {/* Action button or chevron */}
        {actionLabel && onAction ? (
          <Button
            variant={variant === 'outline' ? 'default' : 'secondary'}
            size="sm"
            onPress={handleAction}
            style={{ marginLeft: spacing[3] }}
          >
            {actionLabel}
          </Button>
        ) : onPress ? (
          <View style={{ marginLeft: spacing[2] }}>
            <ChevronRightIcon size={20} color={txtColor} />
          </View>
        ) : null}
      </View>

      {/* Dismiss button */}
      {dismissible && onDismiss && (
        <Pressable
          onPress={handleDismiss}
          style={[
            styles.dismissButton,
            { top: spacing[2], right: spacing[2] },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Dismiss banner"
        >
          <CloseIcon size={16} color={txtColor} />
        </Pressable>
      )}
    </Container>
  );

  return content;
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  imageOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
  },
  title: {},
  subtitle: {},
  dismissButton: {
    position: 'absolute',
    padding: 4,
  },
});
