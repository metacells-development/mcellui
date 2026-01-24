/**
 * FeedPostCard
 *
 * A social feed post card with avatar, content, optional image, and action buttons.
 * Perfect for social feeds, timelines, and activity streams.
 *
 * @example
 * ```tsx
 * <FeedPostCard
 *   user={{ name: 'John Doe', avatar: 'J' }}
 *   content="Just finished my morning run!"
 *   time="2h ago"
 *   likes={42}
 *   comments={8}
 *   liked={false}
 *   onLike={() => toggleLike()}
 *   onComment={() => openComments()}
 *   onShare={() => sharePost()}
 * />
 * ```
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';

// Import UI primitives
import { Avatar } from '../ui/avatar';
import { IconButton } from '../ui/icon-button';
import { Separator } from '../ui/separator';

// ============================================================================
// Icons
// ============================================================================

function HeartIcon({
  size = 24,
  color = '#000',
  filled = false,
  activeColor,
}: {
  size?: number;
  color?: string;
  filled?: boolean;
  /** Color to use when filled (overrides color from IconButton) */
  activeColor?: string;
}) {
  // When filled and activeColor is provided, use activeColor for both fill and stroke
  const effectiveColor = filled && activeColor ? activeColor : color;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? effectiveColor : 'none'}
      stroke={effectiveColor}
      strokeWidth={2}
    >
      <Path
        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CommentIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path
        d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ShareIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path
        d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ImagePlaceholderIcon({ size = 48, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
      <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <Circle cx="8.5" cy="8.5" r="1.5" />
      <Path d="M21 15l-5-5L5 21" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export interface FeedPostUser {
  /** User display name */
  name: string;
  /** Avatar URL or fallback initial */
  avatar?: string;
  /** Avatar image URL */
  avatarUrl?: string;
}

export interface FeedPostCardProps {
  /** User who created the post */
  user: FeedPostUser;
  /** Post text content */
  content: string;
  /** Time string (e.g., "2h ago") */
  time?: string;
  /** Whether post has an image */
  hasImage?: boolean;
  /** Image URL (if not provided, shows placeholder) */
  imageUrl?: string;
  /** Number of likes */
  likes?: number;
  /** Number of comments */
  comments?: number;
  /** Whether current user has liked the post */
  liked?: boolean;
  /** Called when like button is pressed */
  onLike?: () => void;
  /** Called when comment button is pressed */
  onComment?: () => void;
  /** Called when share button is pressed */
  onShare?: () => void;
  /** Called when post is pressed */
  onPress?: () => void;
  /** Show separator at bottom */
  showSeparator?: boolean;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function FeedPostCard({
  user,
  content,
  time,
  hasImage,
  likes = 0,
  comments = 0,
  liked = false,
  onLike,
  onComment,
  onShare,
  showSeparator = true,
  style,
}: FeedPostCardProps) {
  const { colors, spacing, radius } = useTheme();

  // Get initials from name
  const initials = user.avatar || user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={style}>
      <View style={[styles.container, { padding: spacing[4] }]}>
        {/* Post Header */}
        <View style={[styles.header, { gap: spacing[3] }]}>
          <Avatar
            source={user.avatarUrl ? { uri: user.avatarUrl } : undefined}
            fallback={initials}
            size="md"
          />
          <View style={styles.headerText}>
            <Text style={[styles.userName, { color: colors.foreground }]}>
              {user.name}
            </Text>
            {time && (
              <Text style={[styles.time, { color: colors.foregroundMuted }]}>
                {time}
              </Text>
            )}
          </View>
        </View>

        {/* Post Content */}
        <Text
          style={[
            styles.content,
            { color: colors.foreground, marginTop: spacing[3] },
          ]}
        >
          {content}
        </Text>

        {/* Post Image Placeholder */}
        {hasImage && (
          <View
            style={[
              styles.imagePlaceholder,
              {
                backgroundColor: colors.secondary,
                borderRadius: radius.lg,
                marginTop: spacing[3],
              },
            ]}
          >
            <ImagePlaceholderIcon size={48} color={colors.foregroundMuted} />
          </View>
        )}

        {/* Post Actions */}
        <View style={[styles.actions, { marginTop: spacing[3], gap: spacing[4] }]}>
          {/* Like Button */}
          <View style={[styles.actionItem, { gap: spacing[1] }]}>
            <IconButton
              icon={<HeartIcon filled={liked} activeColor={colors.destructive} />}
              variant="ghost"
              size="sm"
              onPress={onLike}
              accessibilityLabel={liked ? 'Unlike post' : 'Like post'}
            />
            {likes > 0 && (
              <Text style={[styles.actionCount, { color: colors.foregroundMuted }]}>
                {likes}
              </Text>
            )}
          </View>

          {/* Comment Button */}
          <View style={[styles.actionItem, { gap: spacing[1] }]}>
            <IconButton
              icon={<CommentIcon />}
              variant="ghost"
              size="sm"
              onPress={onComment}
              accessibilityLabel="Comment on post"
            />
            {comments > 0 && (
              <Text style={[styles.actionCount, { color: colors.foregroundMuted }]}>
                {comments}
              </Text>
            )}
          </View>

          {/* Share Button */}
          <IconButton
            icon={<ShareIcon />}
            variant="ghost"
            size="sm"
            onPress={onShare}
            accessibilityLabel="Share post"
          />
        </View>
      </View>

      {/* Separator */}
      {showSeparator && <Separator />}
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    fontSize: 15,
  },
  time: {
    fontSize: 13,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
  },
  imagePlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionCount: {
    fontSize: 14,
  },
});
