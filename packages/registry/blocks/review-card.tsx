/**
 * ReviewCard
 *
 * User review display with rating, images, and helpful votes.
 * Perfect for product reviews and ratings sections.
 *
 * @example
 * ```tsx
 * <ReviewCard
 *   author={{
 *     name: 'John Doe',
 *     avatar: { uri: '...' },
 *     verified: true
 *   }}
 *   rating={4}
 *   title="Great product!"
 *   content="Really happy with my purchase..."
 *   date="2024-01-15"
 *   helpfulCount={24}
 *   onHelpful={() => markHelpful(reviewId)}
 * />
 * ```
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme, cardBlockTokens } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// Import UI primitives
import { Avatar } from '../ui/avatar';
import { Rating } from '../ui/rating';
import { Badge } from '../ui/badge';

// ============================================================================
// Icons
// ============================================================================

function ThumbsUpIcon({ size = 16, color = '#000', filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={2}>
      <Path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CheckIcon({ size = 14, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MoreHorizontalIcon({ size = 16, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M12 12h.01M19 12h.01M5 12h.01" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export interface ReviewAuthor {
  id?: string;
  name: string;
  avatar?: ImageSourcePropType;
  verified?: boolean;
}

export interface ReviewCardProps {
  /** Review author */
  author: ReviewAuthor;
  /** Star rating (1-5) */
  rating: number;
  /** Review title */
  title?: string;
  /** Review content */
  content: string;
  /** Review date */
  date: string;
  /** Number of helpful votes */
  helpfulCount?: number;
  /** Whether current user marked as helpful */
  isHelpful?: boolean;
  /** Product variant purchased */
  variant?: string;
  /** Review images */
  images?: ImageSourcePropType[];
  /** Called when helpful is pressed */
  onHelpful?: () => void;
  /** Called when image is pressed */
  onImagePress?: (index: number) => void;
  /** Called when author is pressed */
  onAuthorPress?: () => void;
  /** Called when more menu is pressed */
  onMore?: () => void;
  /** Maximum content lines before truncation */
  maxLines?: number;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function ReviewCard({
  author,
  rating,
  title,
  content,
  date,
  helpfulCount = 0,
  isHelpful = false,
  variant,
  images,
  onHelpful,
  onImagePress,
  onAuthorPress,
  onMore,
  maxLines = 4,
  style,
}: ReviewCardProps) {
  const { colors, spacing, radius, platformShadow } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleHelpful = () => {
    haptic('light');
    onHelpful?.();
  };

  const handleReadMore = () => {
    setExpanded(!expanded);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingVertical: cardBlockTokens.content.paddingVertical,
          paddingHorizontal: cardBlockTokens.content.paddingHorizontal,
          borderRadius: radius.lg,
          borderWidth: cardBlockTokens.borderWidth,
          borderColor: colors.border,
        },
        platformShadow(cardBlockTokens.shadow),
        style,
      ]}
    >
      {/* Header */}
      <View style={[styles.header, { marginBottom: spacing[2] }]}>
        <Pressable
          onPress={onAuthorPress}
          style={styles.authorRow}
          disabled={!onAuthorPress}
        >
          <Avatar
            source={author.avatar}
            fallback={author.name.charAt(0)}
            size="sm"
          />
          <View style={{ marginLeft: spacing[2] }}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: colors.foreground }]}>
                {author.name}
              </Text>
              {author.verified && (
                <View style={[styles.verifiedBadge, { backgroundColor: colors.success, marginLeft: spacing[1] }]}>
                  <CheckIcon size={10} color="#fff" />
                </View>
              )}
            </View>
            <Text style={[styles.date, { color: colors.foregroundMuted }]}>
              {formatDate(date)}
            </Text>
          </View>
        </Pressable>

        {onMore && (
          <Pressable onPress={onMore} style={styles.moreButton}>
            <MoreHorizontalIcon size={20} color={colors.foregroundMuted} />
          </Pressable>
        )}
      </View>

      {/* Rating */}
      <View style={[styles.ratingRow, { marginBottom: spacing[2] }]}>
        <Rating value={rating} size="sm" readonly />
        {variant && (
          <Text style={[styles.variant, { color: colors.foregroundMuted }]}>
            · {variant}
          </Text>
        )}
      </View>

      {/* Title */}
      {title && (
        <Text style={[styles.title, { color: colors.foreground, marginBottom: spacing[1] }]}>
          {title}
        </Text>
      )}

      {/* Content */}
      <View>
        <Text
          style={[styles.content, { color: colors.foreground }]}
          numberOfLines={expanded ? undefined : maxLines}
        >
          {content}
        </Text>
        {content.length > 150 && (
          <Pressable onPress={handleReadMore}>
            <Text style={[styles.readMore, { color: colors.primary }]}>
              {expanded ? 'Show less' : 'Read more'}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Images */}
      {images && images.length > 0 && (
        <View style={[styles.images, { marginTop: spacing[3], gap: spacing[2] }]}>
          {images.slice(0, 4).map((image, index) => (
            <Pressable
              key={index}
              onPress={() => {
                haptic('light');
                onImagePress?.(index);
              }}
              style={[
                styles.imageContainer,
                { borderRadius: radius.md, backgroundColor: colors.secondary },
              ]}
            >
              <Image source={image} style={styles.image} resizeMode="cover" />
              {index === 3 && images.length > 4 && (
                <View style={[styles.moreImages, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                  <Text style={styles.moreImagesText}>+{images.length - 4}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      )}

      {/* Footer */}
      <View style={[styles.footer, { marginTop: spacing[3] }]}>
        <Pressable
          onPress={handleHelpful}
          disabled={!onHelpful}
          style={[
            styles.helpfulButton,
            {
              backgroundColor: isHelpful ? colors.primary + '15' : 'transparent',
              borderRadius: radius.full,
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[1.5],
            },
          ]}
        >
          <ThumbsUpIcon size={16} color={isHelpful ? colors.primary : colors.foregroundMuted} filled={isHelpful} />
          <Text
            style={[
              styles.helpfulText,
              {
                color: isHelpful ? colors.primary : colors.foregroundMuted,
                marginLeft: spacing[1],
              },
            ]}
          >
            Helpful{helpfulCount > 0 ? ` (${helpfulCount})` : ''}
          </Text>
        </Pressable>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: cardBlockTokens.typography.subtitleFontSize,
    fontWeight: cardBlockTokens.typography.titleFontWeight,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    fontSize: cardBlockTokens.typography.metaFontSize,
    marginTop: 1,
  },
  moreButton: {
    padding: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  variant: {
    fontSize: cardBlockTokens.typography.metaFontSize,
    marginLeft: 4,
  },
  title: {
    fontSize: cardBlockTokens.typography.titleFontSize,
    fontWeight: cardBlockTokens.typography.titleFontWeight,
  },
  content: {
    fontSize: cardBlockTokens.typography.subtitleFontSize,
    lineHeight: 20,
  },
  readMore: {
    fontSize: cardBlockTokens.typography.subtitleFontSize,
    fontWeight: cardBlockTokens.typography.titleFontWeight,
    marginTop: 4,
  },
  images: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    width: 72,
    height: 72,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  moreImages: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreImagesText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {},
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  helpfulText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
