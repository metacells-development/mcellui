/**
 * ProductCard
 *
 * E-commerce product display card with image, details, and actions.
 * Perfect for product grids, search results, and featured products.
 *
 * @example
 * ```tsx
 * <ProductCard
 *   title="Premium Wireless Headphones"
 *   price={149.99}
 *   originalPrice={199.99}
 *   rating={4.5}
 *   reviewCount={128}
 *   image={{ uri: 'https://...' }}
 *   badge="Sale"
 *   onPress={() => navigateToProduct(id)}
 *   onAddToCart={() => addToCart(id)}
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
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// Import UI primitives
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Rating } from '../ui/rating';

// ============================================================================
// Icons
// ============================================================================

function HeartIcon({ size = 20, color = '#000', filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : 'none'}
      stroke={color}
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

function CartIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path
        d="M9 22a1 1 0 100-2 1 1 0 000 2zM20 22a1 1 0 100-2 1 1 0 000 2zM1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"
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

export interface ProductCardProps {
  /** Product title/name */
  title: string;
  /** Current price */
  price: number;
  /** Original price (for sale items) */
  originalPrice?: number;
  /** Currency symbol */
  currency?: string;
  /** Rating value (0-5) */
  rating?: number;
  /** Number of reviews */
  reviewCount?: number;
  /** Product image */
  image?: ImageSourcePropType;
  /** Badge text (e.g., "Sale", "New", "Best Seller") */
  badge?: string;
  /** Badge variant */
  badgeVariant?: 'default' | 'destructive' | 'success' | 'warning' | 'secondary';
  /** Whether product is in wishlist */
  wishlisted?: boolean;
  /** Whether product is out of stock */
  outOfStock?: boolean;
  /** Card layout variant */
  variant?: 'vertical' | 'horizontal';
  /** Called when card is pressed */
  onPress?: () => void;
  /** Called when wishlist button is pressed */
  onWishlist?: () => void;
  /** Called when add to cart is pressed */
  onAddToCart?: () => void;
  /** Show add to cart button */
  showAddToCart?: boolean;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function ProductCard({
  title,
  price,
  originalPrice,
  currency = '$',
  rating,
  reviewCount,
  image,
  badge,
  badgeVariant = 'destructive',
  wishlisted = false,
  outOfStock = false,
  variant = 'vertical',
  onPress,
  onWishlist,
  onAddToCart,
  showAddToCart = true,
  style,
}: ProductCardProps) {
  const { colors, spacing, radius, platformShadow } = useTheme();

  const handlePress = () => {
    haptic('light');
    onPress?.();
  };

  const handleWishlist = () => {
    haptic('selection');
    onWishlist?.();
  };

  const handleAddToCart = () => {
    haptic('medium');
    onAddToCart?.();
  };

  // Calculate discount percentage
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Format price
  const formatPrice = (value: number) => {
    return `${currency}${value.toFixed(2)}`;
  };

  if (variant === 'horizontal') {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.horizontalContainer,
          {
            backgroundColor: colors.background,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.border,
            opacity: pressed ? 0.9 : 1,
          },
          platformShadow('sm'),
          style,
        ]}
      >
        {/* Image */}
        <View
          style={[
            styles.horizontalImage,
            {
              backgroundColor: colors.secondary,
              borderTopLeftRadius: radius.lg - 1,
              borderBottomLeftRadius: radius.lg - 1,
            },
          ]}
        >
          {image ? (
            <Image source={image} style={styles.image} resizeMode="cover" />
          ) : (
            <ImagePlaceholderIcon size={40} color={colors.foregroundMuted} />
          )}
          {badge && (
            <View style={[styles.badge, { top: spacing[2], left: spacing[2] }]}>
              <Badge variant={badgeVariant} size="sm">{badge}</Badge>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={[styles.horizontalContent, { padding: spacing[3] }]}>
          <Text
            style={[styles.title, { color: colors.foreground }]}
            numberOfLines={2}
          >
            {title}
          </Text>

          {rating !== undefined && (
            <View style={[styles.ratingRow, { marginTop: spacing[1] }]}>
              <Rating value={rating} size="sm" readOnly />
              {reviewCount !== undefined && (
                <Text style={[styles.reviewCount, { color: colors.foregroundMuted }]}>
                  ({reviewCount})
                </Text>
              )}
            </View>
          )}

          <View style={[styles.priceRow, { marginTop: spacing[2] }]}>
            <Text style={[styles.price, { color: colors.foreground }]}>
              {formatPrice(price)}
            </Text>
            {originalPrice && (
              <Text style={[styles.originalPrice, { color: colors.foregroundMuted }]}>
                {formatPrice(originalPrice)}
              </Text>
            )}
          </View>

          {outOfStock && (
            <Text style={[styles.outOfStock, { color: colors.destructive, marginTop: spacing[1] }]}>
              Out of Stock
            </Text>
          )}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.background,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          opacity: pressed ? 0.9 : 1,
        },
        platformShadow('sm'),
        style,
      ]}
    >
      {/* Image section */}
      <View
        style={[
          styles.imageContainer,
          {
            backgroundColor: colors.secondary,
            borderTopLeftRadius: radius.lg - 1,
            borderTopRightRadius: radius.lg - 1,
          },
        ]}
      >
        {image ? (
          <Image source={image} style={styles.image} resizeMode="cover" />
        ) : (
          <ImagePlaceholderIcon size={48} color={colors.foregroundMuted} />
        )}

        {/* Badge */}
        {badge && (
          <View style={[styles.badge, { top: spacing[2], left: spacing[2] }]}>
            <Badge variant={badgeVariant} size="sm">{badge}</Badge>
          </View>
        )}

        {/* Wishlist button */}
        {onWishlist && (
          <Pressable
            onPress={handleWishlist}
            style={[
              styles.wishlistButton,
              {
                top: spacing[2],
                right: spacing[2],
                backgroundColor: colors.background,
                borderRadius: radius.full,
              },
              platformShadow('sm'),
            ]}
          >
            <HeartIcon
              size={18}
              color={wishlisted ? colors.destructive : colors.foregroundMuted}
              filled={wishlisted}
            />
          </Pressable>
        )}

        {/* Out of stock overlay */}
        {outOfStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>

      {/* Content section */}
      <View style={[styles.content, { padding: spacing[3] }]}>
        {/* Title */}
        <Text
          style={[styles.title, { color: colors.foreground }]}
          numberOfLines={2}
        >
          {title}
        </Text>

        {/* Rating */}
        {rating !== undefined && (
          <View style={[styles.ratingRow, { marginTop: spacing[1] }]}>
            <Rating value={rating} size="sm" readOnly />
            {reviewCount !== undefined && (
              <Text style={[styles.reviewCount, { color: colors.foregroundMuted }]}>
                ({reviewCount})
              </Text>
            )}
          </View>
        )}

        {/* Price */}
        <View style={[styles.priceRow, { marginTop: spacing[2] }]}>
          <Text style={[styles.price, { color: colors.foreground }]}>
            {formatPrice(price)}
          </Text>
          {originalPrice && (
            <>
              <Text style={[styles.originalPrice, { color: colors.foregroundMuted }]}>
                {formatPrice(originalPrice)}
              </Text>
              <Badge variant="success" size="sm">
                -{discountPercent}%
              </Badge>
            </>
          )}
        </View>

        {/* Add to cart button */}
        {showAddToCart && onAddToCart && !outOfStock && (
          <Button
            variant="default"
            size="sm"
            icon={<CartIcon size={16} />}
            onPress={handleAddToCart}
            fullWidth
            style={{ marginTop: spacing[3] }}
          >
            Add to Cart
          </Button>
        )}
      </View>
    </Pressable>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  horizontalContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  imageContainer: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  horizontalImage: {
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
  },
  wishlistButton: {
    position: 'absolute',
    padding: 8,
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {},
  horizontalContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewCount: {
    fontSize: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  outOfStock: {
    fontSize: 12,
    fontWeight: '600',
  },
});
