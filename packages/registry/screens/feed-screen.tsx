/**
 * FeedScreen
 *
 * Complete social feed/timeline screen with pull-to-refresh, infinite scroll support,
 * and optimized list rendering. Ready to connect to your social backend.
 *
 * @example
 * ```tsx
 * <FeedScreen
 *   posts={posts}
 *   onLike={(postId) => toggleLike(postId)}
 *   onComment={(postId) => openComments(postId)}
 *   onShare={(postId) => sharePost(postId)}
 *   onNewPost={() => navigation.navigate('NewPost')}
 *   onRefresh={async () => await refreshFeed()}
 *   onBack={() => navigation.goBack()}
 * />
 * ```
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { useTheme, getLineHeight, lineHeight } from '@metacells/mcellui-core';

// Import blocks
import { FeedPostCard, FeedPostUser } from '../blocks/feed-post-card-block';

// ============================================================================
// Types
// ============================================================================

export interface FeedPost {
  /** Unique post ID */
  id: string;
  /** User who created the post */
  user: FeedPostUser;
  /** Post text content */
  content: string;
  /** Time string */
  time: string;
  /** Whether post has an image */
  hasImage?: boolean;
  /** Image URL */
  imageUrl?: string;
  /** Number of likes */
  likes: number;
  /** Number of comments */
  comments: number;
  /** Whether current user liked the post */
  liked: boolean;
}

export interface FeedScreenProps {
  /** List of feed posts */
  posts?: FeedPost[];
  /** Called when a post is liked/unliked */
  onLike?: (postId: string) => void;
  /** Called when comment button is pressed */
  onComment?: (postId: string) => void;
  /** Called when share button is pressed */
  onShare?: (postId: string) => void;
  /** Called when a post is pressed */
  onPostPress?: (post: FeedPost) => void;
  /** Called when new post button is pressed */
  onNewPost?: () => void;
  /** Called when back button is pressed */
  onBack?: () => void;
  /** Called on pull to refresh */
  onRefresh?: () => Promise<void>;
  /** Called when end of list is reached (for pagination) */
  onEndReached?: () => void;
  /** Show loading indicator at bottom */
  loadingMore?: boolean;
  /** Header title */
  title?: string;
  /** Use FlatList for better performance with large lists */
  optimized?: boolean;
  /** Empty state title */
  emptyTitle?: string;
  /** Empty state message */
  emptyMessage?: string;
}

// ============================================================================
// Icons
// ============================================================================

function BackIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PlusIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function FeedEmptyIcon({ size = 64, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
      <Rect x="3" y="3" width="18" height="18" rx="2" />
      <Path d="M3 9h18M9 21V9" />
    </Svg>
  );
}

// ============================================================================
// Default Data
// ============================================================================

const DEFAULT_POSTS: FeedPost[] = [
  {
    id: '1',
    user: { name: 'Sarah Miller', avatar: 'S' },
    content: 'Just finished my morning run! 5km in 25 minutes. Feeling great! 🏃‍♀️',
    likes: 42,
    comments: 8,
    time: '2h ago',
    liked: false,
  },
  {
    id: '2',
    user: { name: 'John Davis', avatar: 'J' },
    content: 'Check out this amazing sunset I captured yesterday. Nature is truly beautiful.',
    hasImage: true,
    likes: 156,
    comments: 23,
    time: '4h ago',
    liked: true,
  },
  {
    id: '3',
    user: { name: 'Emma Wilson', avatar: 'E' },
    content: "Just launched my new app! It's been months of hard work but it's finally here. Thanks to everyone who supported me along the way! 🚀",
    likes: 89,
    comments: 31,
    time: '6h ago',
    liked: false,
  },
  {
    id: '4',
    user: { name: 'Mike Johnson', avatar: 'M' },
    content: 'Anyone else excited for the weekend? Planning a hiking trip!',
    likes: 28,
    comments: 12,
    time: '8h ago',
    liked: false,
  },
];

// ============================================================================
// Sub-Components
// ============================================================================

function EmptyState({
  title,
  message,
  colors,
  fontSize,
  fontWeight,
  lineHeight,
}: {
  title: string;
  message: string;
  colors: any;
  fontSize: any;
  fontWeight: any;
  lineHeight: any;
}) {
  return (
    <View style={styles.emptyContainer}>
      <FeedEmptyIcon size={64} color={colors.foregroundMuted} />
      <Text
        style={{
          color: colors.foreground,
          fontSize: fontSize.xl,
          fontWeight: fontWeight.semibold,
          marginTop: 16,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: colors.foregroundMuted,
          fontSize: fontSize.base,
          lineHeight: getLineHeight(fontSize.base, lineHeight.relaxed),
          marginTop: 8,
          textAlign: 'center',
        }}
      >
        {message}
      </Text>
    </View>
  );
}

function LoadingFooter({ colors, fontSize }: { colors: any; fontSize: any }) {
  return (
    <View style={styles.loadingFooter}>
      <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.sm }}>
        Loading more posts...
      </Text>
    </View>
  );
}

// ============================================================================
// Component
// ============================================================================

export function FeedScreen({
  posts = DEFAULT_POSTS,
  onLike,
  onComment,
  onShare,
  onPostPress,
  onNewPost,
  onBack,
  onRefresh,
  onEndReached,
  loadingMore = false,
  title = 'Feed',
  optimized = false,
  emptyTitle = 'No posts yet',
  emptyMessage = 'Follow people or create your first post to see content here.',
}: FeedScreenProps) {
  const { colors, spacing, radius, fontSize, fontWeight, lineHeight } = useTheme();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
  };

  const renderPost = useCallback(
    ({ item, index }: { item: FeedPost; index: number }) => (
      <FeedPostCard
        user={item.user}
        content={item.content}
        time={item.time}
        hasImage={item.hasImage}
        likes={item.likes}
        comments={item.comments}
        liked={item.liked}
        onLike={onLike ? () => onLike(item.id) : undefined}
        onComment={onComment ? () => onComment(item.id) : undefined}
        onShare={onShare ? () => onShare(item.id) : undefined}
        onPress={onPostPress ? () => onPostPress(item) : undefined}
        showSeparator={index < posts.length - 1}
      />
    ),
    [onLike, onComment, onShare, onPostPress, posts.length]
  );

  const keyExtractor = useCallback((item: FeedPost) => item.id, []);

  const refreshControl = onRefresh ? (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor={colors.primary}
    />
  ) : undefined;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + spacing[2],
            paddingBottom: spacing[3],
            paddingHorizontal: spacing[4],
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
        ]}
      >
        {onBack && (
          <Pressable onPress={onBack} hitSlop={8}>
            <BackIcon size={24} color={colors.foreground} />
          </Pressable>
        )}

        <Text
          style={{
            color: colors.foreground,
            fontSize: fontSize.lg,
            fontWeight: fontWeight.bold,
          }}
        >
          {title}
        </Text>

        {onNewPost ? (
          <Pressable onPress={onNewPost} hitSlop={8}>
            <PlusIcon size={24} color={colors.primary} />
          </Pressable>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      {/* Posts */}
      {posts.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          message={emptyMessage}
          colors={colors}
          fontSize={fontSize}
          fontWeight={fontWeight}
          lineHeight={lineHeight}
        />
      ) : optimized ? (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={keyExtractor}
          refreshControl={refreshControl}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? <LoadingFooter colors={colors} fontSize={fontSize} /> : null
          }
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ScrollView
          style={styles.list}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
        >
          {posts.map((post, index) => (
            <FeedPostCard
              key={post.id}
              user={post.user}
              content={post.content}
              time={post.time}
              hasImage={post.hasImage}
              likes={post.likes}
              comments={post.comments}
              liked={post.liked}
              onLike={onLike ? () => onLike(post.id) : undefined}
              onComment={onComment ? () => onComment(post.id) : undefined}
              onShare={onShare ? () => onShare(post.id) : undefined}
              onPress={onPostPress ? () => onPostPress(post) : undefined}
              showSeparator={index < posts.length - 1}
            />
          ))}

          {loadingMore && <LoadingFooter colors={colors} fontSize={fontSize} />}

          {/* Bottom padding */}
          <View style={{ height: insets.bottom + spacing[4] }} />
        </ScrollView>
      )}
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loadingFooter: {
    padding: 16,
    alignItems: 'center',
  },
});
