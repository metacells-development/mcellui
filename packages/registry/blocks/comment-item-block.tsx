/**
 * CommentItem
 *
 * Comment display for posts, products, or discussions.
 * Supports likes, replies, and nested threading.
 *
 * @example
 * ```tsx
 * <CommentItem
 *   user={{ name: 'John Doe', avatarUrl: '...' }}
 *   content="This is a great product!"
 *   time="2h ago"
 *   likes={5}
 *   liked={false}
 *   onLike={() => toggleLike(comment.id)}
 *   onReply={() => openReply(comment.id)}
 * />
 * ```
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme, socialBlockTokens } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// Import UI primitives
import { Avatar } from '../ui/avatar';

// ============================================================================
// Icons
// ============================================================================

function HeartIcon({ size = 16, color, filled = false }: { size?: number; color?: string; filled?: boolean }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? finalColor : 'none'}
      stroke={finalColor}
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

function ReplyIcon({ size = 16, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={2}>
      <Path
        d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MoreIcon({ size = 16, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={finalColor}>
      <Path d="M12 13a1 1 0 100-2 1 1 0 000 2zM19 13a1 1 0 100-2 1 1 0 000 2zM5 13a1 1 0 100-2 1 1 0 000 2z" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export interface CommentUser {
  /** User display name */
  name: string;
  /** Avatar fallback initials */
  avatar?: string;
  /** Avatar image URL */
  avatarUrl?: string;
  /** Whether user is verified */
  verified?: boolean;
}

export interface CommentItemProps {
  /** User who wrote the comment */
  user: CommentUser;
  /** Comment text content */
  content: string;
  /** Time string (e.g., "2h ago") */
  time?: string;
  /** Number of likes */
  likes?: number;
  /** Whether current user has liked this comment */
  liked?: boolean;
  /** Whether like action is loading */
  likeLoading?: boolean;
  /** Whether all actions are disabled */
  disabled?: boolean;
  /** Number of replies (for showing "View X replies") */
  replyCount?: number;
  /** Whether this is a reply (nested comment) */
  isReply?: boolean;
  /** Whether replies are expanded */
  repliesExpanded?: boolean;
  /** Called when like button is pressed */
  onLike?: () => void;
  /** Called when reply button is pressed */
  onReply?: () => void;
  /** Called when "View replies" is pressed */
  onExpandReplies?: () => void;
  /** Called when more options is pressed */
  onMore?: () => void;
  /** Called when username is pressed */
  onUserPress?: () => void;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function CommentItem({
  user,
  content,
  time,
  likes = 0,
  liked = false,
  likeLoading = false,
  disabled = false,
  replyCount = 0,
  isReply = false,
  repliesExpanded = false,
  onLike,
  onReply,
  onExpandReplies,
  onMore,
  onUserPress,
  style,
}: CommentItemProps) {
  const { colors, spacing, radius } = useTheme();

  // Get initials from name
  const initials = user.avatar || user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLike = () => {
    haptic('light');
    onLike?.();
  };

  const handleReply = () => {
    haptic('selection');
    onReply?.();
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingLeft: isReply ? socialBlockTokens.comment.indentPerLevel : 0,
        },
        style,
      ]}
    >
      {/* Avatar */}
      <Pressable onPress={onUserPress}>
        <Avatar
          source={user.avatarUrl ? { uri: user.avatarUrl } : undefined}
          fallback={initials}
          size={isReply ? socialBlockTokens.avatar.commentSize : socialBlockTokens.avatar.postSize}
        />
      </Pressable>

      {/* Content */}
      <View style={[styles.content, { marginLeft: spacing[3] }]}>
        {/* Header: name, verified badge, time */}
        <View style={styles.header}>
          <Pressable onPress={onUserPress} style={styles.userInfo}>
            <Text
              style={[
                {
                  fontSize: socialBlockTokens.typography.authorFontSize,
                  fontWeight: socialBlockTokens.typography.authorFontWeight,
                  color: colors.foreground,
                },
              ]}
            >
              {user.name}
            </Text>
            {user.verified && (
              <View
                style={[
                  styles.verifiedBadge,
                  { backgroundColor: colors.primary, marginLeft: spacing[1] },
                ]}
              >
                <Text style={{ color: colors.primaryForeground, fontSize: 8 }}>✓</Text>
              </View>
            )}
          </Pressable>
          {time && (
            <Text
              style={[
                {
                  fontSize: socialBlockTokens.typography.timeFontSize,
                  color: colors.foregroundMuted,
                  marginLeft: spacing[2],
                },
              ]}
            >
              {time}
            </Text>
          )}
        </View>

        {/* Comment text */}
        <Text
          style={[
            {
              fontSize: socialBlockTokens.typography.contentFontSize,
              lineHeight: 20,
              color: colors.foreground,
              marginTop: spacing[1],
            },
          ]}
        >
          {content}
        </Text>

        {/* Actions: like, reply, more */}
        <View style={[styles.actions, { marginTop: spacing[2], gap: spacing[4] }]}>
          {/* Like */}
          <View style={{ opacity: disabled || likeLoading ? 0.5 : 1 }}>
            {likeLoading ? (
              <View style={[styles.action, { gap: spacing[1] }]}>
                <ActivityIndicator size="small" color={colors.foregroundMuted} />
                {likes > 0 && (
                  <Text
                    style={[
                      {
                        fontSize: socialBlockTokens.typography.actionFontSize,
                        color: colors.foregroundMuted,
                      },
                    ]}
                  >
                    {likes}
                  </Text>
                )}
              </View>
            ) : (
              <Pressable
                onPress={handleLike}
                style={[styles.action, { gap: spacing[1] }]}
                disabled={disabled || likeLoading}
                accessibilityRole="button"
                accessibilityLabel={liked ? 'Unlike comment' : 'Like comment'}
                accessibilityState={{ disabled: disabled || likeLoading }}
              >
                <HeartIcon
                  size={socialBlockTokens.action.iconSize}
                  color={liked ? colors.destructive : colors.foregroundMuted}
                  filled={liked}
                />
                {likes > 0 && (
                  <Text
                    style={[
                      {
                        fontSize: socialBlockTokens.typography.actionFontSize,
                        color: colors.foregroundMuted,
                      },
                    ]}
                  >
                    {likes}
                  </Text>
                )}
              </Pressable>
            )}
          </View>

          {/* Reply */}
          <Pressable
            onPress={handleReply}
            style={[styles.action, { gap: spacing[1], opacity: disabled ? 0.5 : 1 }]}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel="Reply to comment"
            accessibilityState={{ disabled }}
          >
            <ReplyIcon size={socialBlockTokens.action.iconSize} color={colors.foregroundMuted} />
            <Text
              style={[
                {
                  fontSize: socialBlockTokens.typography.actionFontSize,
                  color: colors.foregroundMuted,
                },
              ]}
            >
              Reply
            </Text>
          </Pressable>

          {/* More options */}
          {onMore && (
            <Pressable
              onPress={onMore}
              style={[styles.action, { opacity: disabled ? 0.5 : 1 }]}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityLabel="More options"
              accessibilityState={{ disabled }}
            >
              <MoreIcon size={socialBlockTokens.action.iconSize} color={colors.foregroundMuted} />
            </Pressable>
          )}
        </View>

        {/* View replies link */}
        {replyCount > 0 && !isReply && (
          <Pressable
            onPress={onExpandReplies}
            style={[styles.viewReplies, { marginTop: spacing[2] }]}
          >
            <View style={[styles.replyLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.viewRepliesText, { color: colors.foregroundMuted }]}>
              {repliesExpanded ? 'Hide replies' : `View ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}`}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewReplies: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyLine: {
    width: 24,
    height: 1,
    marginRight: 8,
  },
  viewRepliesText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
