/**
 * Card
 *
 * A container component with rounded corners, shadow, and dark mode support.
 * Uses design tokens for consistent styling.
 *
 * @example
 * ```tsx
 * // Basic Card
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *     <CardDescription>Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <Text>Content goes here</Text>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 *
 * // Card with Image
 * <Card>
 *   <CardImage source={{ uri: 'https://...' }} />
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *   </CardHeader>
 * </Card>
 * ```
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  PressableProps,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, haptic } from '@nativeui/core';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface CardProps {
  children: React.ReactNode;
  /** Make card pressable */
  onPress?: PressableProps['onPress'];
  /** Disable press interaction */
  disabled?: boolean;
  /** Additional container styles */
  style?: ViewStyle;
}

export function Card({ children, onPress, disabled, style }: CardProps) {
  const { colors, components, platformShadow, springs } = useTheme();
  const tokens = components.card;
  const scale = useSharedValue(1);
  const isInteractive = !!onPress && !disabled;

  const handlePressIn = useCallback(() => {
    if (isInteractive) {
      scale.value = withSpring(0.98, springs.snappy);
    }
  }, [isInteractive, springs.snappy]);

  const handlePressOut = useCallback(() => {
    if (isInteractive) {
      scale.value = withSpring(1, springs.snappy);
    }
  }, [isInteractive, springs.snappy]);

  const handlePress = useCallback(
    (e: any) => {
      if (isInteractive) {
        haptic('light');
        onPress?.(e);
      }
    },
    [isInteractive, onPress]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const cardStyle = [
    styles.card,
    {
      borderRadius: tokens.borderRadius,
      borderWidth: tokens.borderWidth,
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    platformShadow('sm'),
    style,
  ];

  if (isInteractive) {
    return (
      <AnimatedPressable
        style={[cardStyle, animatedStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
      >
        {children}
      </AnimatedPressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

// =============================================================================
// CardImage - Image header for cards
// =============================================================================

export interface CardImageProps {
  /** Image source */
  source: ImageSourcePropType;
  /** Image height (default: 200) */
  height?: number;
  /** Aspect ratio (overrides height) */
  aspectRatio?: number;
  /** Image resize mode */
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  /** Overlay gradient for text readability */
  overlay?: boolean;
  /** Additional image styles */
  style?: ImageStyle;
}

export function CardImage({
  source,
  height = 200,
  aspectRatio,
  resizeMode = 'cover',
  overlay = false,
  style,
}: CardImageProps) {
  const { colors, components } = useTheme();
  const tokens = components.card;
  // Calculate inner border radius (outer - border width)
  const innerRadius = tokens.borderRadius - tokens.borderWidth;

  return (
    <View style={[styles.imageContainer, { borderTopLeftRadius: innerRadius, borderTopRightRadius: innerRadius }]}>
      <Image
        source={source}
        style={[
          styles.image,
          aspectRatio ? { aspectRatio } : { height },
          style,
        ]}
        resizeMode={resizeMode}
      />
      {overlay && (
        <View
          style={[
            styles.imageOverlay,
            { backgroundColor: colors.scrim },
          ]}
        />
      )}
    </View>
  );
}

export interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardHeader({ children, style }: CardHeaderProps) {
  const { components, spacing } = useTheme();
  const tokens = components.card;

  return (
    <View
      style={[
        styles.header,
        {
          padding: tokens.headerPadding,
          paddingBottom: spacing[2],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export interface CardTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function CardTitle({ children, style }: CardTitleProps) {
  const { colors, components } = useTheme();
  const tokens = components.card;

  return (
    <Text
      style={[
        styles.title,
        {
          fontSize: tokens.titleFontSize,
          fontWeight: tokens.titleFontWeight,
          color: colors.cardForeground,
        },
        style,
      ]}
      accessibilityRole="header"
    >
      {children}
    </Text>
  );
}

export interface CardDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function CardDescription({ children, style }: CardDescriptionProps) {
  const { colors, components, spacing } = useTheme();
  const tokens = components.card;

  return (
    <Text
      style={[
        styles.description,
        {
          fontSize: tokens.descriptionFontSize,
          marginTop: spacing[1],
          color: colors.foregroundMuted,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardContent({ children, style }: CardContentProps) {
  const { components } = useTheme();
  const tokens = components.card;

  return (
    <View
      style={[
        styles.content,
        {
          padding: tokens.contentPadding,
          paddingTop: 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardFooter({ children, style }: CardFooterProps) {
  const { components, spacing } = useTheme();
  const tokens = components.card;

  return (
    <View
      style={[
        styles.footer,
        {
          padding: tokens.footerPadding,
          paddingTop: 0,
          gap: spacing[2],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// =============================================================================
// ImageCard - Full image card with overlay content
// =============================================================================

export interface ImageCardProps {
  /** Image source */
  source: ImageSourcePropType;
  /** Card title */
  title?: string;
  /** Card subtitle/description */
  subtitle?: string;
  /** Image height (default: 280) */
  height?: number;
  /** Aspect ratio (overrides height) */
  aspectRatio?: number;
  /** Make card pressable */
  onPress?: PressableProps['onPress'];
  /** Position of text overlay */
  textPosition?: 'top' | 'bottom';
  /** Additional container styles */
  style?: ViewStyle;
}

export function ImageCard({
  source,
  title,
  subtitle,
  height = 280,
  aspectRatio,
  onPress,
  textPosition = 'bottom',
  style,
}: ImageCardProps) {
  const { colors, components, platformShadow, springs, spacing } = useTheme();
  const tokens = components.card;
  const scale = useSharedValue(1);
  const isInteractive = !!onPress;

  const handlePressIn = useCallback(() => {
    if (isInteractive) {
      scale.value = withSpring(0.97, springs.snappy);
    }
  }, [isInteractive, springs.snappy]);

  const handlePressOut = useCallback(() => {
    if (isInteractive) {
      scale.value = withSpring(1, springs.snappy);
    }
  }, [isInteractive, springs.snappy]);

  const handlePress = useCallback(
    (e: any) => {
      if (isInteractive) {
        haptic('light');
        onPress?.(e);
      }
    },
    [isInteractive, onPress]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const content = (
    <>
      <Image
        source={source}
        style={[
          styles.imageCardImage,
          aspectRatio ? { aspectRatio } : { height },
        ]}
        resizeMode="cover"
      />
      {/* Gradient overlay */}
      <View
        style={[
          styles.imageCardGradient,
          textPosition === 'top' ? styles.gradientTop : styles.gradientBottom,
        ]}
      />
      {/* Text content */}
      {(title || subtitle) && (
        <View
          style={[
            styles.imageCardContent,
            { padding: spacing[4] },
            textPosition === 'top' ? styles.contentTop : styles.contentBottom,
          ]}
        >
          {title && (
            <Text style={[styles.imageCardTitle, { color: '#ffffff' }]}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={[styles.imageCardSubtitle, { color: 'rgba(255,255,255,0.8)', marginTop: spacing[1] }]}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </>
  );

  const cardStyle = [
    styles.imageCard,
    { borderRadius: tokens.borderRadius + 4 },
    platformShadow('md'),
    style,
  ];

  if (isInteractive) {
    return (
      <AnimatedPressable
        style={[cardStyle, animatedStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return <View style={cardStyle}>{content}</View>;
}

// =============================================================================
// MediaCard - Image with text below (outside card)
// =============================================================================

export interface MediaCardProps {
  /** Image source */
  source: ImageSourcePropType;
  /** Card title */
  title: string;
  /** Card description */
  description?: string;
  /** Category/tag label */
  category?: string;
  /** Image height (default: 180) */
  height?: number;
  /** Aspect ratio (overrides height) */
  aspectRatio?: number;
  /** Make card pressable */
  onPress?: PressableProps['onPress'];
  /** Additional container styles */
  style?: ViewStyle;
}

export function MediaCard({
  source,
  title,
  description,
  category,
  height = 180,
  aspectRatio,
  onPress,
  style,
}: MediaCardProps) {
  const { colors, components, platformShadow, springs, spacing } = useTheme();
  const tokens = components.card;
  const scale = useSharedValue(1);
  const isInteractive = !!onPress;

  const handlePressIn = useCallback(() => {
    if (isInteractive) {
      scale.value = withSpring(0.98, springs.snappy);
    }
  }, [isInteractive, springs.snappy]);

  const handlePressOut = useCallback(() => {
    if (isInteractive) {
      scale.value = withSpring(1, springs.snappy);
    }
  }, [isInteractive, springs.snappy]);

  const handlePress = useCallback(
    (e: any) => {
      if (isInteractive) {
        haptic('light');
        onPress?.(e);
      }
    },
    [isInteractive, onPress]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const content = (
    <>
      {/* Image container */}
      <View style={[styles.mediaCardImageContainer, { borderRadius: tokens.borderRadius }, platformShadow('sm')]}>
        <Image
          source={source}
          style={[
            styles.mediaCardImage,
            aspectRatio ? { aspectRatio } : { height },
          ]}
          resizeMode="cover"
        />
      </View>
      {/* Text content (outside card) */}
      <View style={[styles.mediaCardContent, { gap: spacing[1] }]}>
        {category && (
          <Text style={[styles.mediaCardCategory, { color: colors.primary }]}>
            {category.toUpperCase()}
          </Text>
        )}
        <Text
          style={[styles.mediaCardTitle, { color: colors.foreground }]}
          numberOfLines={2}
        >
          {title}
        </Text>
        {description && (
          <Text
            style={[styles.mediaCardDescription, { color: colors.foregroundMuted }]}
            numberOfLines={2}
          >
            {description}
          </Text>
        )}
      </View>
    </>
  );

  if (isInteractive) {
    return (
      <AnimatedPressable
        style={[styles.mediaCard, { gap: spacing[3] }, animatedStyle, style]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return <View style={[styles.mediaCard, { gap: spacing[3] }, style]}>{content}</View>;
}

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
  // Base Card
  card: {
    overflow: 'hidden',
  },
  header: {
    // Dynamic styles applied inline
  },
  title: {
    // Dynamic styles applied inline
  },
  description: {
    // Dynamic styles applied inline
  },
  content: {
    // Dynamic styles applied inline
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  // CardImage
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  // ImageCard
  imageCard: {
    overflow: 'hidden',
    position: 'relative',
  },
  imageCardImage: {
    width: '100%',
  },
  imageCardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '50%',
  },
  gradientTop: {
    top: 0,
    backgroundColor: 'transparent',
  },
  gradientBottom: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  imageCardContent: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  contentTop: {
    top: 0,
  },
  contentBottom: {
    bottom: 0,
  },
  imageCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  imageCardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // MediaCard
  mediaCard: {
    // Dynamic styles applied inline
  },
  mediaCardImageContainer: {
    overflow: 'hidden',
  },
  mediaCardImage: {
    width: '100%',
  },
  mediaCardContent: {
    // Dynamic styles applied inline
  },
  mediaCardCategory: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  mediaCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  mediaCardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
