/**
 * FeatureCard
 *
 * A card with icon, title, and description for showcasing features.
 * Perfect for feature lists, benefits sections, and onboarding.
 *
 * @example
 * ```tsx
 * <FeatureCard
 *   icon={<ShieldIcon />}
 *   title="Secure Payments"
 *   description="Your data is encrypted and protected with bank-level security."
 *   onPress={() => navigation.navigate('Security')}
 * />
 * ```
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme, infoBlockTokens } from '@metacells/mcellui-core';

// Import UI primitives
import { Card, CardContent } from '../ui/card';

// ============================================================================
// Types
// ============================================================================

export interface FeatureCardProps {
  /** Icon element to display */
  icon: React.ReactNode;
  /** Feature title */
  title: string;
  /** Feature description */
  description?: string;
  /** Called when card is pressed */
  onPress?: () => void;
  /** Horizontal layout (icon left, text right) */
  horizontal?: boolean;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function FeatureCard({
  icon,
  title,
  description,
  onPress,
  horizontal = false,
  style,
}: FeatureCardProps) {
  const { colors, spacing, radius } = useTheme();
  const tokens = infoBlockTokens.feature;

  return (
    <Card onPress={onPress} style={style}>
      <CardContent
        style={horizontal
          ? { flexDirection: 'row', alignItems: 'flex-start', paddingTop: spacing[4] }
          : { ...styles.content, paddingTop: spacing[4] }
        }
      >
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: colors.primaryMuted,
              borderRadius: radius.md,
              width: horizontal ? 48 : tokens.iconContainerSize,
              height: horizontal ? 48 : tokens.iconContainerSize,
              marginBottom: horizontal ? 0 : spacing[3],
              marginRight: horizontal ? spacing[4] : 0,
            },
          ]}
        >
          {icon}
        </View>

        {/* Text Content */}
        <View style={horizontal ? styles.textHorizontal : undefined}>
          <Text
            style={[
              styles.title,
              horizontal && styles.titleHorizontal,
              {
                color: colors.foreground,
                fontSize: tokens.titleFontSize,
                fontWeight: tokens.titleFontWeight,
              },
            ]}
            numberOfLines={horizontal ? 1 : 2}
          >
            {title}
          </Text>
          {description && (
            <Text
              style={[
                styles.description,
                horizontal && styles.descriptionHorizontal,
                {
                  color: colors.foregroundMuted,
                  marginTop: spacing[1],
                  fontSize: tokens.descriptionFontSize,
                  lineHeight: tokens.descriptionLineHeight,
                },
              ]}
              numberOfLines={horizontal ? 2 : 3}
            >
              {description}
            </Text>
          )}
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
  contentHorizontal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textHorizontal: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
  },
  titleHorizontal: {
    textAlign: 'left',
  },
  description: {
    textAlign: 'center',
  },
  descriptionHorizontal: {
    textAlign: 'left',
  },
});
