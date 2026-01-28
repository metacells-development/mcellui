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
 * <Avatar fallback="XY" size="sm" />
 * <Avatar fallback="JD" status="online" />
 * <Avatar fallback="JD" status="busy" />
 * <Avatar fallback="JD" badge={<Badge count={3} size="sm" />} />
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
import { useTheme } from '@metacells/mcellui-core';

export type AvatarSize = 'sm' | 'md' | 'lg';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps {
  /** Image source */
  source?: ImageSourcePropType;
  /** Fallback text (usually initials) */
  fallback?: string;
  /** Size preset */
  size?: AvatarSize;
  /** Status indicator (online, offline, busy, away) */
  status?: AvatarStatus;
  /** Custom badge element to overlay (e.g., notification badge) */
  badge?: React.ReactNode;
  /** Badge position */
  badgePosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  /** Additional container styles */
  style?: ViewStyle;
}

// Status dot sizes based on avatar size
const statusSizes: Record<AvatarSize, number> = {
  sm: 8,
  md: 10,
  lg: 12,
};

// Status colors
const getStatusColor = (status: AvatarStatus, colors: ReturnType<typeof useTheme>['colors']) => {
  switch (status) {
    case 'online':
      return colors.success;
    case 'offline':
      return colors.foregroundMuted;
    case 'busy':
      return colors.destructive;
    case 'away':
      return colors.warning;
    default:
      return colors.foregroundMuted;
  }
};

export function Avatar({
  source,
  fallback = '?',
  size = 'md',
  status,
  badge,
  badgePosition = 'top-right',
  style,
}: AvatarProps) {
  const { colors, components, componentRadius, platformShadow } = useTheme();
  const tokens = components.avatar[size];
  const [imageError, setImageError] = useState(false);
  const showFallback = !source || imageError;

  // Calculate status dot size and position
  const statusDotSize = statusSizes[size];
  const statusDotOffset = size === 'sm' ? 0 : 1;

  // Calculate badge/status positions
  const getPositionStyle = (position: string): ViewStyle => {
    switch (position) {
      case 'top-right':
        return { top: statusDotOffset, right: statusDotOffset };
      case 'bottom-right':
        return { bottom: statusDotOffset, right: statusDotOffset };
      case 'top-left':
        return { top: statusDotOffset, left: statusDotOffset };
      case 'bottom-left':
        return { bottom: statusDotOffset, left: statusDotOffset };
      default:
        return { top: statusDotOffset, right: statusDotOffset };
    }
  };

  return (
    <View
      style={[
        styles.wrapper,
        style,
      ]}
    >
      <View
        style={[
          styles.container,
          {
            width: tokens.size,
            height: tokens.size,
            borderRadius: componentRadius.avatar,
            backgroundColor: colors.backgroundMuted,
          },
          platformShadow('sm'),
        ]}
        accessibilityRole="image"
        accessibilityLabel={fallback ? `Avatar: ${fallback}` : 'Avatar'}
      >
        {showFallback ? (
          <View
            style={[
              styles.fallback,
              {
                borderRadius: componentRadius.avatar,
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
            style={[styles.image, { borderRadius: componentRadius.avatar }]}
            onError={() => setImageError(true)}
          />
        )}
      </View>

      {/* Status indicator */}
      {status && !badge && (
        <View
          style={[
            styles.statusDot,
            {
              width: statusDotSize,
              height: statusDotSize,
              borderRadius: statusDotSize / 2,
              backgroundColor: getStatusColor(status, colors),
              borderColor: colors.background,
              borderWidth: 2,
            },
            getPositionStyle('bottom-right'),
          ]}
          accessibilityLabel={`Status: ${status}`}
        />
      )}

      {/* Custom badge */}
      {badge && (
        <View
          style={[
            styles.badge,
            getPositionStyle(badgePosition),
          ]}
        >
          {badge}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // No alignSelf - let parent control alignment
  },
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
  statusDot: {
    position: 'absolute',
  },
  badge: {
    position: 'absolute',
  },
});
