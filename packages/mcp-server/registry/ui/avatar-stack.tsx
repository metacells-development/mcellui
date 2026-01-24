/**
 * AvatarStack
 *
 * Overlapping avatar group for displaying multiple users.
 * Shows a configurable number of avatars with an overflow indicator.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <AvatarStack
 *   avatars={[
 *     { source: { uri: 'https://...' }, name: 'John' },
 *     { source: { uri: 'https://...' }, name: 'Jane' },
 *     { source: { uri: 'https://...' }, name: 'Bob' },
 *   ]}
 * />
 *
 * // With max count
 * <AvatarStack
 *   avatars={users.map(u => ({ source: { uri: u.avatar }, name: u.name }))}
 *   max={3}
 *   size="lg"
 * />
 *
 * // Different sizes
 * <AvatarStack avatars={avatars} size="sm" />
 * <AvatarStack avatars={avatars} size="md" />
 * <AvatarStack avatars={avatars} size="lg" />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type AvatarStackSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarItem {
  /** Image source */
  source?: ImageSourcePropType;
  /** User name (used for fallback initials) */
  name?: string;
  /** Background color for fallback */
  fallbackColor?: string;
}

export interface AvatarStackProps {
  /** Array of avatar items */
  avatars: AvatarItem[];
  /** Maximum number of avatars to show */
  max?: number;
  /** Size preset */
  size?: AvatarStackSize;
  /** Overlap amount (0-1, default 0.3) */
  overlap?: number;
  /** Container style */
  style?: ViewStyle;
}

// ─────────────────────────────────────────────────────────────────────────────
// Size configs
// ─────────────────────────────────────────────────────────────────────────────

const SIZE_CONFIG = {
  sm: {
    size: 28,
    fontSize: 10,
    borderWidth: 2,
  },
  md: {
    size: 36,
    fontSize: 12,
    borderWidth: 2,
  },
  lg: {
    size: 44,
    fontSize: 14,
    borderWidth: 3,
  },
  xl: {
    size: 56,
    fontSize: 18,
    borderWidth: 3,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────────────────────────────────────

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0] ?? '';
  const last = parts[parts.length - 1] ?? '';
  if (parts.length === 1) {
    return first.charAt(0).toUpperCase();
  }
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 55%, 55%)`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function AvatarStack({
  avatars,
  max = 4,
  size = 'md',
  overlap = 0.3,
  style,
}: AvatarStackProps) {
  const { colors, fontWeight } = useTheme();
  const config = SIZE_CONFIG[size];

  const visibleAvatars = avatars.slice(0, max);
  const overflowCount = avatars.length - max;
  const hasOverflow = overflowCount > 0;

  // Calculate overlap offset
  const overlapOffset = config.size * overlap;

  return (
    <View
      style={[
        styles.container,
        style,
      ]}
      accessibilityRole="none"
      accessibilityLabel={`${avatars.length} users`}
    >
      {visibleAvatars.map((avatar, index) => {
        const initials = getInitials(avatar.name);
        const bgColor = avatar.fallbackColor || stringToColor(avatar.name || `user-${index}`);

        return (
          <View
            key={index}
            style={[
              styles.avatarWrapper,
              {
                width: config.size,
                height: config.size,
                borderRadius: config.size / 2,
                borderWidth: config.borderWidth,
                borderColor: colors.background,
                marginLeft: index === 0 ? 0 : -overlapOffset,
                zIndex: visibleAvatars.length - index,
              },
            ]}
          >
            {avatar.source ? (
              <Image
                source={avatar.source}
                style={[
                  styles.avatarImage,
                  {
                    width: config.size - config.borderWidth * 2,
                    height: config.size - config.borderWidth * 2,
                    borderRadius: (config.size - config.borderWidth * 2) / 2,
                  },
                ]}
              />
            ) : (
              <View
                style={[
                  styles.avatarFallback,
                  {
                    width: config.size - config.borderWidth * 2,
                    height: config.size - config.borderWidth * 2,
                    borderRadius: (config.size - config.borderWidth * 2) / 2,
                    backgroundColor: bgColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.initials,
                    {
                      fontSize: config.fontSize,
                      fontWeight: fontWeight.semibold,
                      color: '#ffffff',
                    },
                  ]}
                >
                  {initials}
                </Text>
              </View>
            )}
          </View>
        );
      })}

      {/* Overflow indicator */}
      {hasOverflow && (
        <View
          style={[
            styles.avatarWrapper,
            styles.overflowBadge,
            {
              width: config.size,
              height: config.size,
              borderRadius: config.size / 2,
              borderWidth: config.borderWidth,
              borderColor: colors.background,
              backgroundColor: colors.secondary,
              marginLeft: -overlapOffset,
              zIndex: 0,
            },
          ]}
        >
          <Text
            style={[
              styles.overflowText,
              {
                fontSize: config.fontSize,
                fontWeight: fontWeight.semibold,
                color: colors.secondaryForeground,
              },
            ]}
          >
            +{overflowCount > 99 ? '99' : overflowCount}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  avatarImage: {
    resizeMode: 'cover',
  },
  avatarFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    textAlign: 'center',
  },
  overflowBadge: {},
  overflowText: {
    textAlign: 'center',
  },
});
