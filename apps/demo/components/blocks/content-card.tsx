/**
 * ContentCard
 *
 * A card with large image, title, subtitle, and action button.
 * Perfect for featured content, articles, and product cards.
 *
 * @example
 * ```tsx
 * <ContentCard
 *   imageUrl="https://example.com/image.jpg"
 *   title="Amazing Places to Visit"
 *   subtitle="Discover the world's hidden gems"
 *   actionText="Read More"
 *   onAction={() => navigation.navigate('Article')}
 * />
 * ```
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@nativeui/core';

// Import UI primitives
import { Card, CardContent, CardImage } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ============================================================================
// Types
// ============================================================================

export interface ContentCardProps {
  /** Image URL for the card */
  imageUrl: string;
  /** Card title */
  title: string;
  /** Card subtitle or description */
  subtitle?: string;
  /** Action button text */
  actionText?: string;
  /** Called when action button is pressed */
  onAction?: () => void;
  /** Called when card is pressed (makes entire card tappable) */
  onPress?: () => void;
  /** Image aspect ratio (default: 16/9) */
  aspectRatio?: number;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function ContentCard({
  imageUrl,
  title,
  subtitle,
  actionText,
  onAction,
  onPress,
  aspectRatio = 16 / 9,
  style,
}: ContentCardProps) {
  const { colors, spacing } = useTheme();

  return (
    <Card onPress={onPress} style={style}>
      {/* Image */}
      <CardImage
        source={{ uri: imageUrl }}
        aspectRatio={aspectRatio}
      />

      {/* Content */}
      <CardContent style={{ paddingTop: spacing[4] }}>
        <Text
          style={[styles.title, { color: colors.foreground }]}
          numberOfLines={2}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              { color: colors.foregroundMuted, marginTop: spacing[1] },
            ]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        )}
        {actionText && onAction && (
          <View style={{ marginTop: spacing[4] }}>
            <Button onPress={onAction} size="sm">
              {actionText}
            </Button>
          </View>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});
