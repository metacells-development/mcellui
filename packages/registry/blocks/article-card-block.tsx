/**
 * ArticleCard
 *
 * Blog/news article preview card with image, metadata, and author.
 * Perfect for news apps, blogs, and content feeds.
 *
 * @example
 * ```tsx
 * <ArticleCard
 *   article={{
 *     id: '1',
 *     title: '10 Tips for Better Mobile UX',
 *     excerpt: 'Learn how to create better mobile experiences...',
 *     image: { uri: '...' },
 *     author: { name: 'Jane Doe', avatar: { uri: '...' } },
 *     publishedAt: '2024-01-15',
 *     readTime: 5
 *   }}
 *   onPress={() => openArticle(article.id)}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import Svg, { Path, Rect, Circle as SvgCircle } from 'react-native-svg';
import { useTheme, cardBlockTokens } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// Import UI primitives
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

// ============================================================================
// Icons
// ============================================================================

function ClockIcon({ size = 12, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={2}>
      <SvgCircle cx="12" cy="12" r="10" />
      <Path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BookmarkIcon({ size = 20, color, filled = false }: { size?: number; color?: string; filled?: boolean }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? finalColor : 'none'} stroke={finalColor} strokeWidth={2}>
      <Path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ImagePlaceholderIcon({ size = 32, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={1.5}>
      <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <SvgCircle cx="8.5" cy="8.5" r="1.5" />
      <Path d="M21 15l-5-5L5 21" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export interface ArticleAuthor {
  id?: string;
  name: string;
  avatar?: ImageSourcePropType;
}

export interface Article {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageSourcePropType;
  author?: ArticleAuthor;
  publishedAt: string;
  readTime?: number;
  category?: string;
  tags?: string[];
  views?: number;
  bookmarked?: boolean;
}

export interface ArticleCardProps {
  /** Article data */
  article: Article;
  /** Visual variant */
  variant?: 'default' | 'horizontal' | 'featured';
  /** Called when article is pressed */
  onPress?: () => void;
  /** Called when bookmark is pressed */
  onBookmark?: () => void;
  /** Called when author is pressed */
  onAuthorPress?: () => void;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function ArticleCard({
  article,
  variant = 'default',
  onPress,
  onBookmark,
  onAuthorPress,
  style,
}: ArticleCardProps) {
  const { colors, spacing, radius, platformShadow } = useTheme();

  const handlePress = () => {
    haptic('light');
    onPress?.();
  };

  const handleBookmark = () => {
    haptic('medium');
    onBookmark?.();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Horizontal variant
  if (variant === 'horizontal') {
    return (
      <Pressable
        onPress={onPress ? handlePress : undefined}
        style={({ pressed }) => [
          styles.horizontalContainer,
          {
            backgroundColor: pressed && onPress ? colors.secondary : colors.background,
            borderRadius: radius.lg,
            paddingVertical: cardBlockTokens.content.paddingVertical,
            paddingHorizontal: cardBlockTokens.content.paddingHorizontal,
          },
          platformShadow(cardBlockTokens.shadow),
          style,
        ]}
      >
        {/* Image */}
        <View
          style={[
            styles.horizontalImage,
            {
              backgroundColor: colors.secondary,
              borderRadius: radius.md,
              marginRight: spacing[3],
            },
          ]}
        >
          {article.image ? (
            <Image source={article.image} style={styles.image} resizeMode="cover" />
          ) : (
            <ImagePlaceholderIcon size={24} color={colors.foregroundMuted} />
          )}
        </View>

        {/* Content */}
        <View style={styles.horizontalContent}>
          {article.category && (
            <Text style={[styles.category, { color: colors.primary, marginBottom: spacing[1] }]}>
              {article.category}
            </Text>
          )}
          <Text style={[styles.horizontalTitle, { color: colors.foreground }]} numberOfLines={2}>
            {article.title}
          </Text>
          <View style={[styles.metaRow, { marginTop: spacing[1] }]}>
            <Text style={[styles.metaText, { color: colors.foregroundMuted }]}>
              {formatDate(article.publishedAt)}
            </Text>
            {article.readTime && (
              <>
                <Text style={[styles.metaDot, { color: colors.foregroundMuted }]}>·</Text>
                <ClockIcon size={10} color={colors.foregroundMuted} />
                <Text style={[styles.metaText, { color: colors.foregroundMuted, marginLeft: 2 }]}>
                  {article.readTime} min
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Bookmark */}
        {onBookmark && (
          <Pressable onPress={handleBookmark} style={styles.bookmarkButton}>
            <BookmarkIcon size={18} color={article.bookmarked ? colors.primary : colors.foregroundMuted} filled={article.bookmarked} />
          </Pressable>
        )}
      </Pressable>
    );
  }

  // Featured variant
  if (variant === 'featured') {
    return (
      <Pressable
        onPress={onPress ? handlePress : undefined}
        style={[
          styles.featuredContainer,
          { borderRadius: radius.lg, overflow: 'hidden' },
          style,
        ]}
      >
        {/* Background image */}
        <View style={styles.featuredImageWrapper}>
          {article.image ? (
            <Image source={article.image} style={styles.featuredImage} resizeMode="cover" />
          ) : (
            <View style={[styles.featuredPlaceholder, { backgroundColor: colors.secondary }]}>
              <ImagePlaceholderIcon size={48} color={colors.foregroundMuted} />
            </View>
          )}
          <View style={[styles.featuredOverlay, { backgroundColor: colors.overlay }]} />
        </View>

        {/* Content overlay */}
        <View style={[styles.featuredContent, {
          paddingVertical: cardBlockTokens.content.paddingVertical,
          paddingHorizontal: cardBlockTokens.content.paddingHorizontal,
        }]}>
          {article.category && (
            <Badge variant="secondary" size="sm" style={{ alignSelf: 'flex-start', marginBottom: spacing[2] }}>
              {article.category}
            </Badge>
          )}
          <Text style={[styles.featuredTitle, { color: colors.primaryForeground }]} numberOfLines={3}>
            {article.title}
          </Text>
          {article.excerpt && (
            <Text style={[styles.featuredExcerpt, { color: colors.primaryForeground }]} numberOfLines={2}>
              {article.excerpt}
            </Text>
          )}

          {/* Author and meta */}
          <View style={[styles.featuredFooter, { marginTop: spacing[3] }]}>
            {article.author && (
              <View style={styles.authorRow}>
                <Avatar source={article.author.avatar} fallback={article.author.name.charAt(0)} size="xs" />
                <Text style={[styles.featuredAuthor, { color: colors.primaryForeground }]}>{article.author.name}</Text>
              </View>
            )}
            <Text style={[styles.featuredMeta, { color: colors.primaryForeground }]}>
              {formatDate(article.publishedAt)}
              {article.readTime && ` · ${article.readTime} min read`}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  // Default variant
  return (
    <Card
      onPress={onPress ? handlePress : undefined}
      style={style}
    >
      {/* Image */}
      {article.image ? (
        <Image source={article.image} style={styles.defaultImage} resizeMode="cover" />
      ) : (
        <View style={[styles.defaultImagePlaceholder, { backgroundColor: colors.secondary }]}>
          <ImagePlaceholderIcon size={40} color={colors.foregroundMuted} />
        </View>
      )}

      <View style={{
        paddingVertical: cardBlockTokens.content.paddingVertical,
        paddingHorizontal: cardBlockTokens.content.paddingHorizontal,
      }}>
        {/* Category */}
        {article.category && (
          <Text style={[styles.category, { color: colors.primary, marginBottom: spacing[2] }]}>
            {article.category}
          </Text>
        )}

        {/* Title */}
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
          {article.title}
        </Text>

        {/* Excerpt */}
        {article.excerpt && (
          <Text style={[styles.excerpt, { color: colors.foregroundMuted, marginTop: spacing[2] }]} numberOfLines={2}>
            {article.excerpt}
          </Text>
        )}

        {/* Footer */}
        <View style={[styles.footer, { marginTop: spacing[3] }]}>
          {/* Author */}
          {article.author && (
            <Pressable
              onPress={onAuthorPress}
              style={styles.authorRow}
              disabled={!onAuthorPress}
            >
              <Avatar source={article.author.avatar} fallback={article.author.name.charAt(0)} size="xs" />
              <Text style={[styles.authorName, { color: colors.foreground, marginLeft: spacing[2] }]}>
                {article.author.name}
              </Text>
            </Pressable>
          )}

          {/* Meta */}
          <View style={styles.metaRow}>
            <Text style={[styles.metaText, { color: colors.foregroundMuted }]}>
              {formatDate(article.publishedAt)}
            </Text>
            {article.readTime && (
              <>
                <Text style={[styles.metaDot, { color: colors.foregroundMuted }]}>·</Text>
                <ClockIcon size={10} color={colors.foregroundMuted} />
                <Text style={[styles.metaText, { color: colors.foregroundMuted, marginLeft: 2 }]}>
                  {article.readTime} min
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  // Default variant
  defaultImage: {
    width: '100%',
    height: 180,
  },
  defaultImagePlaceholder: {
    width: '100%',
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  category: {
    fontSize: cardBlockTokens.typography.metaFontSize,
    fontWeight: cardBlockTokens.typography.titleFontWeight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: cardBlockTokens.typography.priceFontSize,
    fontWeight: cardBlockTokens.typography.priceFontWeight,
    lineHeight: 24,
  },
  excerpt: {
    fontSize: cardBlockTokens.typography.subtitleFontSize,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: cardBlockTokens.typography.metaFontSize,
    fontWeight: cardBlockTokens.typography.titleFontWeight,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: cardBlockTokens.typography.metaFontSize,
  },
  metaDot: {
    marginHorizontal: 4,
  },
  // Horizontal variant
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalImage: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  horizontalContent: {
    flex: 1,
  },
  horizontalTitle: {
    fontSize: cardBlockTokens.typography.titleFontSize,
    fontWeight: cardBlockTokens.typography.titleFontWeight,
    lineHeight: 20,
  },
  bookmarkButton: {
    padding: 8,
    marginLeft: 8,
  },
  // Featured variant
  featuredContainer: {
    height: 280,
    position: 'relative',
  },
  featuredImageWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  featuredContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: cardBlockTokens.typography.priceFontWeight,
    lineHeight: 28,
  },
  featuredExcerpt: {
    fontSize: cardBlockTokens.typography.subtitleFontSize,
    marginTop: 8,
    lineHeight: 20,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredAuthor: {
    fontSize: cardBlockTokens.typography.metaFontSize,
    fontWeight: cardBlockTokens.typography.titleFontWeight,
    marginLeft: 8,
  },
  featuredMeta: {
    fontSize: cardBlockTokens.typography.metaFontSize,
  },
});
