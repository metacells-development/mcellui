/**
 * EmptyStateBlock
 *
 * Empty state placeholder with icon, title, description, and CTA button.
 * Perfect for empty lists, search results, or initial states.
 *
 * @example
 * ```tsx
 * <EmptyStateBlock
 *   icon={<InboxIcon />}
 *   title="No messages"
 *   description="You don't have any messages yet. Start a conversation!"
 *   actionText="New Message"
 *   onAction={() => navigation.navigate('Compose')}
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
import { useTheme, stateBlockTokens } from '@metacells/mcellui-core';

// Import your components
import { Button } from '../ui/button';

// ============================================================================
// Types
// ============================================================================

export interface EmptyStateBlockProps {
  /** Icon element to display */
  icon?: React.ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Primary action button text */
  actionText?: string;
  /** Called when primary action button is pressed */
  onAction?: () => void;
  /** Secondary action button text */
  secondaryActionText?: string;
  /** Called when secondary action button is pressed */
  onSecondaryAction?: () => void;
  /** Compact variant with less padding */
  compact?: boolean;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function EmptyStateBlock({
  icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  compact = false,
  style,
}: EmptyStateBlockProps) {
  const { colors, spacing } = useTheme();

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
      {icon && (
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: colors.backgroundMuted,
              width: compact ? stateBlockTokens.compact.iconContainerSize : stateBlockTokens.default.iconContainerSize,
              height: compact ? stateBlockTokens.compact.iconContainerSize : stateBlockTokens.default.iconContainerSize,
              borderRadius: compact ? stateBlockTokens.compact.iconContainerRadius : stateBlockTokens.default.iconContainerRadius,
              marginBottom: spacing[4],
            },
          ]}
        >
          {icon}
        </View>
      )}

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
              marginBottom: spacing[6],
              paddingHorizontal: spacing[4],
            },
          ]}
        >
          {description}
        </Text>
      )}

      {/* Actions */}
      {(actionText || secondaryActionText) && (
        <View style={[styles.actions, { gap: spacing[3] }]}>
          {actionText && onAction && (
            <Button onPress={onAction}>{actionText}</Button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <Button variant="ghost" onPress={onSecondaryAction}>
              {secondaryActionText}
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
  actions: {
    alignItems: 'center',
  },
});
