/**
 * Stories
 *
 * Instagram-style circular avatar with gradient ring indicator.
 * Shows unseen story status with animated gradient border.
 *
 * @example
 * ```tsx
 * // Single story avatar
 * <StoryAvatar
 *   source={{ uri: 'https://...' }}
 *   name="John"
 *   hasUnseenStory
 *   onPress={() => openStory(user.id)}
 * />
 *
 * // Stories row
 * <StoriesRow>
 *   <StoryAvatar source={...} name="Add" isAddStory onPress={addStory} />
 *   {users.map(user => (
 *     <StoryAvatar
 *       key={user.id}
 *       source={{ uri: user.avatar }}
 *       name={user.name}
 *       hasUnseenStory={user.hasNewStory}
 *       onPress={() => openStory(user.id)}
 *     />
 *   ))}
 * </StoriesRow>
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, haptic, storiesTokens } from '@metacells/mcellui-core';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type StoryAvatarSize = 'sm' | 'md' | 'lg';

export interface StoryAvatarProps {
  /** Avatar image source */
  source?: ImageSourcePropType;
  /** User name (shown below avatar) */
  name?: string;
  /** Whether user has unseen stories */
  hasUnseenStory?: boolean;
  /** Whether this is the "Add Story" button */
  isAddStory?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Size preset */
  size?: StoryAvatarSize;
  /** Custom gradient colors for ring */
  gradientColors?: [string, string, ...string[]];
  /** Whether story has been seen (gray ring) */
  seen?: boolean;
  /** Container style */
  style?: ViewStyle;
}

export interface StoriesRowProps {
  /** Story avatars */
  children: React.ReactNode;
  /** Container style */
  style?: ViewStyle;
  /** Content container style */
  contentContainerStyle?: ViewStyle;
}


// Default Instagram-like gradient
const DEFAULT_GRADIENT: [string, string, ...string[]] = ['#F58529', '#DD2A7B', '#8134AF', '#515BD4'];
const SEEN_GRADIENT: [string, string, ...string[]] = ['#DBDBDB', '#DBDBDB'];

// ─────────────────────────────────────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────────────────────────────────────

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0] ?? '';
  return first.charAt(0).toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// StoryAvatar Component
// ─────────────────────────────────────────────────────────────────────────────

export function StoryAvatar({
  source,
  name,
  hasUnseenStory = false,
  isAddStory = false,
  onPress,
  size = 'md',
  gradientColors,
  seen = false,
  style,
}: StoryAvatarProps) {
  const { colors, fontWeight } = useTheme();
  const tokens = storiesTokens;
  const config = tokens[size];

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    haptic('light');
    onPress?.();
  };

  const showRing = hasUnseenStory || seen;
  const ringColors = seen
    ? SEEN_GRADIENT
    : gradientColors || DEFAULT_GRADIENT;

  const initials = getInitials(name);

  return (
    <View style={[styles.container, style]}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.avatarContainer, animatedStyle]}
        accessibilityRole="button"
        accessibilityLabel={isAddStory ? 'Add story' : `View ${name}'s story`}
      >
        {/* Gradient ring */}
        {showRing ? (
          <LinearGradient
            colors={ringColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.gradientRing,
              {
                width: config.outer,
                height: config.outer,
                borderRadius: config.outer / 2,
              },
            ]}
          >
            {/* White inner border */}
            <View
              style={[
                styles.innerBorder,
                {
                  width: config.inner,
                  height: config.inner,
                  borderRadius: config.inner / 2,
                  backgroundColor: colors.background,
                },
              ]}
            >
              {/* Avatar */}
              {source ? (
                <Image
                  source={source}
                  style={[
                    styles.avatar,
                    {
                      width: config.avatar,
                      height: config.avatar,
                      borderRadius: config.avatar / 2,
                    },
                  ]}
                />
              ) : (
                <View
                  style={[
                    styles.avatarFallback,
                    {
                      width: config.avatar,
                      height: config.avatar,
                      borderRadius: config.avatar / 2,
                      backgroundColor: colors.secondary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.initials,
                      {
                        fontSize: config.avatar * 0.4,
                        fontWeight: fontWeight.semibold,
                        color: colors.secondaryForeground,
                      },
                    ]}
                  >
                    {initials}
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>
        ) : (
          /* No ring - just avatar with border */
          <View
            style={[
              styles.noRingContainer,
              {
                width: config.outer,
                height: config.outer,
                borderRadius: config.outer / 2,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.background,
              },
            ]}
          >
            {source ? (
              <Image
                source={source}
                style={[
                  styles.avatar,
                  {
                    width: config.avatar,
                    height: config.avatar,
                    borderRadius: config.avatar / 2,
                  },
                ]}
              />
            ) : (
              <View
                style={[
                  styles.avatarFallback,
                  {
                    width: config.avatar,
                    height: config.avatar,
                    borderRadius: config.avatar / 2,
                    backgroundColor: colors.secondary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.initials,
                    {
                      fontSize: config.avatar * 0.4,
                      fontWeight: fontWeight.semibold,
                      color: colors.secondaryForeground,
                    },
                  ]}
                >
                  {initials}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Add story plus icon */}
        {isAddStory && (
          <View
            style={[
              styles.addBadge,
              {
                width: config.plusSize + 4,
                height: config.plusSize + 4,
                borderRadius: (config.plusSize + 4) / 2,
                backgroundColor: colors.background,
                bottom: 0,
                right: 0,
              },
            ]}
          >
            <View
              style={[
                styles.addBadgeInner,
                {
                  width: config.plusSize,
                  height: config.plusSize,
                  borderRadius: config.plusSize / 2,
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.plusIcon,
                  {
                    fontSize: config.plusSize * 0.7,
                    color: colors.primaryForeground,
                  },
                ]}
              >
                +
              </Text>
            </View>
          </View>
        )}
      </AnimatedPressable>

      {/* Name */}
      {name && (
        <Text
          style={[
            styles.name,
            {
              marginTop: config.nameMarginTop,
              fontSize: config.fontSize,
              color: colors.foreground,
              maxWidth: config.outer + 8,
            },
          ]}
          numberOfLines={1}
        >
          {isAddStory ? 'Your story' : name}
        </Text>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StoriesRow Component
// ─────────────────────────────────────────────────────────────────────────────

export function StoriesRow({
  children,
  style,
  contentContainerStyle,
}: StoriesRowProps) {
  const tokens = storiesTokens;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.row, style]}
      contentContainerStyle={[
        styles.rowContent,
        { paddingHorizontal: tokens.row.paddingHorizontal, gap: tokens.row.gap },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  gradientRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerBorder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noRingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    resizeMode: 'cover',
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    textAlign: 'center',
  },
  addBadge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBadgeInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    fontWeight: '600',
    marginTop: -1,
  },
  name: {
    textAlign: 'center',
  },
  row: {
    flexGrow: 0,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
