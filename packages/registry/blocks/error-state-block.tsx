/**
 * ErrorStateBlock
 *
 * Error state display with icon, message, and retry button.
 * Perfect for network errors, failed loads, or error boundaries.
 *
 * @example
 * ```tsx
 * <ErrorStateBlock
 *   title="Something went wrong"
 *   description="We couldn't load your data. Please try again."
 *   onRetry={() => refetch()}
 * />
 *
 * // Custom error
 * <ErrorStateBlock
 *   icon={<WifiOffIcon />}
 *   title="No internet connection"
 *   description="Please check your connection and try again."
 *   retryText="Try again"
 *   onRetry={() => retry()}
 *   onCancel={() => navigation.goBack()}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme, stateBlockTokens } from '@metacells/mcellui-core';

// Import your components
import { Button } from '../ui/button';

// ============================================================================
// Types
// ============================================================================

export interface ErrorStateBlockProps {
  /** Custom icon element (defaults to error icon) */
  icon?: React.ReactNode;
  /** Error title */
  title?: string;
  /** Error description or message */
  description?: string;
  /** Retry button text */
  retryText?: string;
  /** Called when retry button is pressed */
  onRetry?: () => void;
  /** Cancel button text */
  cancelText?: string;
  /** Called when cancel button is pressed */
  onCancel?: () => void;
  /** Show loading state on retry button */
  retryLoading?: boolean;
  /** Error code or technical details (shown in muted text) */
  errorCode?: string;
  /** Compact variant with less padding */
  compact?: boolean;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Default Error Icon
// ============================================================================

function DefaultErrorIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="2"
      />
      <Path
        d="M12 8v4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="12" cy="16" r="1" fill={color} />
    </Svg>
  );
}

// ============================================================================
// Component
// ============================================================================

export function ErrorStateBlock({
  icon,
  title = 'Something went wrong',
  description = 'An error occurred. Please try again.',
  retryText = 'Retry',
  onRetry,
  cancelText,
  onCancel,
  retryLoading = false,
  errorCode,
  compact = false,
  style,
}: ErrorStateBlockProps) {
  const { colors, spacing } = useTheme();

  const tokens = compact ? stateBlockTokens.compact : stateBlockTokens.default;
  const errorTokens = stateBlockTokens.error;
  const iconSize = compact ? 40 : 48; // Keep as is - this is the SVG icon size, not container

  return (
    <View
      style={[
        styles.container,
        {
          padding: compact ? spacing[6] : spacing[10],
        },
        style,
      ]}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.destructive + '15',
            width: compact ? errorTokens.iconContainerSizeCompact : errorTokens.iconContainerSize,
            height: compact ? errorTokens.iconContainerSizeCompact : errorTokens.iconContainerSize,
            borderRadius: compact ? errorTokens.iconContainerRadiusCompact : errorTokens.iconContainerRadius,
            marginBottom: spacing[4],
          },
        ]}
      >
        {icon || <DefaultErrorIcon color={colors.destructive} size={iconSize} />}
      </View>

      {/* Title */}
      <Text
        style={[
          styles.title,
          {
            color: colors.foreground,
            fontSize: compact ? stateBlockTokens.compact.titleFontSize : stateBlockTokens.default.titleFontSize,
            fontWeight: stateBlockTokens.typography.titleFontWeight,
            marginBottom: spacing[2],
          },
        ]}
      >
        {title}
      </Text>

      {/* Description */}
      {description && (
        <Text
          style={[
            styles.description,
            {
              color: colors.foregroundMuted,
              fontSize: compact ? stateBlockTokens.compact.descriptionFontSize : stateBlockTokens.default.descriptionFontSize,
              marginBottom: spacing[2],
              paddingHorizontal: spacing[4],
            },
          ]}
        >
          {description}
        </Text>
      )}

      {/* Error Code */}
      {errorCode && (
        <Text
          style={[
            styles.errorCode,
            {
              color: colors.foregroundMuted,
              backgroundColor: colors.backgroundMuted,
              fontSize: errorTokens.codeFontSize,
              paddingHorizontal: spacing[2],
              paddingVertical: spacing[1],
              borderRadius: 4,
              marginBottom: spacing[4],
            },
          ]}
        >
          {errorCode}
        </Text>
      )}

      {/* Actions */}
      {(onRetry || onCancel) && (
        <View
          style={[
            styles.actions,
            { gap: spacing[3], marginTop: spacing[4] },
          ]}
        >
          {onRetry && (
            <Button
              onPress={onRetry}
              loading={retryLoading}
            >
              {retryText}
            </Button>
          )}
          {onCancel && cancelText && (
            <Button variant="ghost" onPress={onCancel}>
              {cancelText}
            </Button>
          )}
        </View>
      )}
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
  },
  errorCode: {
    fontFamily: 'monospace',
  },
  actions: {
    alignItems: 'center',
  },
});
