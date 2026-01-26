/**
 * CommentsScreen
 *
 * Full comments view with nested replies, input, and interactions.
 * Perfect for posts, articles, and any content with comments.
 *
 * @example
 * ```tsx
 * <CommentsScreen
 *   comments={postComments}
 *   currentUserId="user-1"
 *   onSubmitComment={(text) => addComment(text)}
 *   onLikeComment={(id) => likeComment(id)}
 *   onReplyComment={(id, text) => replyToComment(id, text)}
 * />
 * ```
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// Import UI primitives
import { IconButton } from '../ui/icon-button';
import { Avatar } from '../ui/avatar';
import { Spinner } from '../ui/spinner';

// Import blocks
import { CommentItem, CommentItemProps } from '../blocks/comment-item';
import { EmptyStateBlock } from '../blocks/empty-state-block';

// ============================================================================
// Icons
// ============================================================================

function ChevronLeftIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SendIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MessageCircleIcon({ size = 48, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
      <Path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export interface CommentAuthor {
  id: string;
  name: string;
  avatar?: { uri: string };
  verified?: boolean;
}

export interface Comment {
  id: string;
  author: CommentAuthor;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface CommentsScreenProps {
  /** List of comments */
  comments: Comment[];
  /** Current user info (for input avatar) */
  currentUser?: {
    id: string;
    name: string;
    avatar?: { uri: string };
  };
  /** Title text */
  title?: string;
  /** Placeholder text for input */
  placeholder?: string;
  /** Whether comments are loading */
  loading?: boolean;
  /** Whether submitting is in progress */
  submitting?: boolean;
  /** Whether replies are allowed */
  allowReplies?: boolean;
  /** Called when back is pressed */
  onBack?: () => void;
  /** Called when a new comment is submitted */
  onSubmitComment?: (text: string, replyToId?: string) => void;
  /** Called when like is toggled */
  onLikeComment?: (commentId: string) => void;
  /** Called when comment author is pressed */
  onAuthorPress?: (authorId: string) => void;
  /** Called when delete is pressed (for own comments) */
  onDeleteComment?: (commentId: string) => void;
  /** Called when report is pressed */
  onReportComment?: (commentId: string) => void;
}

// ============================================================================
// Component
// ============================================================================

export function CommentsScreen({
  comments,
  currentUser,
  title = 'Comments',
  placeholder = 'Add a comment...',
  loading = false,
  submitting = false,
  allowReplies = true,
  onBack,
  onSubmitComment,
  onLikeComment,
  onAuthorPress,
  onDeleteComment,
  onReportComment,
}: CommentsScreenProps) {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);

  const handleSubmit = () => {
    const text = inputText.trim();
    if (!text || submitting) return;

    haptic('medium');
    onSubmitComment?.(text, replyingTo?.id);
    setInputText('');
    setReplyingTo(null);
  };

  const handleReply = (commentId: string, authorName: string) => {
    setReplyingTo({ id: commentId, name: authorName });
    inputRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  // Flatten comments with replies for FlatList
  const flattenedComments = React.useMemo(() => {
    const result: Array<{ comment: Comment; isReply: boolean; parentId?: string }> = [];

    comments.forEach((comment) => {
      result.push({ comment, isReply: false });

      if (comment.replies) {
        comment.replies.forEach((reply) => {
          result.push({ comment: reply, isReply: true, parentId: comment.id });
        });
      }
    });

    return result;
  }, [comments]);

  const renderComment: ListRenderItem<{ comment: Comment; isReply: boolean; parentId?: string }> = ({ item }) => {
    const { comment, isReply } = item;
    const isOwnComment = currentUser?.id === comment.author.id;

    return (
      <View style={isReply ? { paddingLeft: spacing[10] } : undefined}>
        <CommentItem
          user={{
            name: comment.author.name,
            avatarUrl: comment.author.avatar?.uri,
            verified: comment.author.verified,
          }}
          content={comment.content}
          time={comment.timestamp}
          likes={comment.likes}
          liked={comment.isLiked}
          onLike={() => onLikeComment?.(comment.id)}
          onReply={allowReplies && !isReply ? () => handleReply(comment.id, comment.author.name) : undefined}
          onUserPress={() => onAuthorPress?.(comment.author.id)}
          onMore={isOwnComment && onDeleteComment ? () => onDeleteComment(comment.id) : (!isOwnComment && onReportComment ? () => onReportComment(comment.id) : undefined)}
        />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <EmptyStateBlock
        icon={<MessageCircleIcon size={64} color={colors.foregroundMuted} />}
        title="No comments yet"
        description="Be the first to share your thoughts!"
      />
    </View>
  );

  const commentsCount = comments.reduce(
    (count, c) => count + 1 + (c.replies?.length ?? 0),
    0
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: colors.border }]}>
        <View style={[styles.headerContent, { paddingHorizontal: spacing[4], paddingVertical: spacing[3] }]}>
          {onBack && <IconButton icon={<ChevronLeftIcon />} variant="ghost" onPress={onBack} />}
          <Text
            style={{
              color: colors.foreground,
              fontSize: fontSize.lg,
              fontWeight: fontWeight.semibold,
            }}
          >
            {title} {commentsCount > 0 && `(${commentsCount})`}
          </Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      {/* Comments List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Spinner size="lg" />
        </View>
      ) : (
        <FlatList
          data={flattenedComments}
          renderItem={renderComment}
          keyExtractor={(item) => item.comment.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={[
            flattenedComments.length === 0 && styles.emptyList,
            { paddingVertical: spacing[2], paddingHorizontal: spacing[4] },
          ]}
        />
      )}

      {/* Input Area */}
      <View
        style={[
          styles.inputContainer,
          {
            paddingBottom: insets.bottom || spacing[4],
            paddingHorizontal: spacing[4],
            paddingTop: spacing[3],
            borderTopColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        {/* Reply indicator */}
        {replyingTo && (
          <View style={[styles.replyIndicator, { marginBottom: spacing[2] }]}>
            <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.sm }}>
              Replying to <Text style={{ fontWeight: fontWeight.semibold }}>@{replyingTo.name}</Text>
            </Text>
            <Pressable onPress={cancelReply}>
              <Text
                style={{
                  color: colors.primary,
                  fontSize: fontSize.sm,
                  fontWeight: fontWeight.semibold,
                }}
              >
                Cancel
              </Text>
            </Pressable>
          </View>
        )}

        <View style={styles.inputRow}>
          {currentUser?.avatar && (
            <Avatar
              source={currentUser.avatar}
              fallback={currentUser.name.charAt(0)}
              size="sm"
              style={{ marginRight: spacing[3] }}
            />
          )}

          <View
            style={[
              styles.textInputContainer,
              {
                backgroundColor: colors.secondary,
                borderRadius: radius.full,
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[2],
              },
            ]}
          >
            <TextInput
              ref={inputRef}
              style={{
                color: colors.foreground,
                fontSize: fontSize.base,
                maxHeight: 80,
              }}
              placeholder={placeholder}
              placeholderTextColor={colors.foregroundMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              editable={!submitting}
            />
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={!inputText.trim() || submitting}
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim() ? colors.primary : colors.secondary,
                marginLeft: spacing[2],
              },
            ]}
          >
            {submitting ? (
              <Spinner size="sm" color={inputText.trim() ? colors.primaryForeground : colors.foregroundMuted} />
            ) : (
              <SendIcon
                size={20}
                color={inputText.trim() ? colors.primaryForeground : colors.foregroundMuted}
              />
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyList: {
    flex: 1,
  },
  inputContainer: {
    borderTopWidth: 1,
  },
  replyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInputContainer: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    justifyContent: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
