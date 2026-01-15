/**
 * Avatar
 *
 * User profile picture with fallback initials.
 * Uses design tokens for consistent styling.
 *
 * @example
 * ```tsx
 * <Avatar source={{ uri: 'https://example.com/avatar.jpg' }} fallback="JD" />
 * <Avatar fallback="AB" size="lg" />
 * <Avatar fallback="XY" size="xs" />
 * ```
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@nativeui/core';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  /** Image source */
  source?: ImageSourcePropType;
  /** Fallback text (usually initials) */
  fallback?: string;
  /** Size preset */
  size?: AvatarSize;
  /** Additional container styles */
  style?: ViewStyle;
}

export function Avatar({
  source,
  fallback = '?',
  size = 'md',
  style,
}: AvatarProps) {
  const { colors, components, platformShadow } = useTheme();
  const tokens = components.avatar[size];
  const [imageError, setImageError] = useState(false);
  const showFallback = !source || imageError;

  return (
    <View
      style={[
        styles.container,
        {
          width: tokens.size,
          height: tokens.size,
          borderRadius: tokens.borderRadius,
          backgroundColor: colors.backgroundMuted,
        },
        platformShadow('sm'),
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={fallback ? `Avatar: ${fallback}` : 'Avatar'}
    >
      {showFallback ? (
        <View
          style={[
            styles.fallback,
            {
              borderRadius: tokens.borderRadius,
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.fallbackText,
              {
                fontSize: tokens.fontSize,
                fontWeight: tokens.fontWeight,
                color: colors.primaryForeground,
              },
            ]}
          >
            {fallback.slice(0, 2).toUpperCase()}
          </Text>
        </View>
      ) : (
        <Image
          source={source}
          style={[styles.image, { borderRadius: tokens.borderRadius }]}
          onError={() => setImageError(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    // Dynamic styles applied inline
  },
});
