/**
 * SocialProofBarBlock
 *
 * Avatar stack with engagement text for social proof.
 * Perfect for showing activity, reviews, or user participation.
 *
 * @example
 * ```tsx
 * <SocialProofBarBlock
 *   avatars={[
 *     'https://example.com/avatar1.jpg',
 *     'https://example.com/avatar2.jpg',
 *     'https://example.com/avatar3.jpg',
 *   ]}
 *   text="Sarah, Mike, and 42 others liked this"
 *   onPress={() => navigation.navigate('Likes')}
 * />
 * ```
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

// Import UI primitives
import { Avatar } from '@/components/ui/avatar';

// ============================================================================
// Types
// ============================================================================

export interface SocialProofBarBlockProps {
  /** Array of avatar URLs to display */
  avatars: string[];
  /** Engagement text */
  text: string;
  /** Maximum avatars to show (default: 3) */
  maxAvatars?: number;
  /** Avatar size (default: 'sm') */
  avatarSize?: 'xs' | 'sm' | 'md';
  /** Called when bar is pressed */
  onPress?: () => void;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function SocialProofBarBlock({
  avatars,
  text,
  maxAvatars = 3,
  avatarSize = 'sm',
  onPress,
  style,
}: SocialProofBarBlockProps) {
  const { colors, spacing } = useTheme();

  const displayAvatars = avatars.slice(0, maxAvatars);

  // Get pixel size for overlap calculation
  const sizeMap = { xs: 24, sm: 32, md: 40 };
  const pixelSize = sizeMap[avatarSize];
  const overlap = pixelSize * 0.3;

  const content = (
    <View style={[styles.container, { gap: spacing[3] }, style]}>
      {/* Avatar Stack */}
      {displayAvatars.length > 0 && (
        <View
          style={[
            styles.avatarStack,
            {
              width: pixelSize + (displayAvatars.length - 1) * (pixelSize - overlap),
              height: pixelSize,
            },
          ]}
        >
          {displayAvatars.map((url, index) => (
            <View
              key={index}
              style={[
                styles.avatarWrapper,
                {
                  left: index * (pixelSize - overlap),
                  zIndex: displayAvatars.length - index,
                  borderWidth: 2,
                  borderColor: colors.background,
                  borderRadius: pixelSize / 2,
                },
              ]}
            >
              <Avatar
                source={{ uri: url }}
                size={avatarSize}
                fallback={String(index + 1)}
              />
            </View>
          ))}
        </View>
      )}

      {/* Text */}
      <Text
        style={[styles.text, { color: colors.foregroundMuted }]}
        numberOfLines={2}
      >
        {text}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed && { opacity: 0.7 }]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStack: {
    position: 'relative',
  },
  avatarWrapper: {
    position: 'absolute',
    top: 0,
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
  },
});
