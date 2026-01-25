/**
 * ProductDetailScreen
 *
 * Full product page with image gallery, details, variants, and reviews.
 * Perfect for e-commerce product detail pages.
 *
 * @example
 * ```tsx
 * <ProductDetailScreen
 *   product={{
 *     name: 'Premium Wireless Headphones',
 *     price: 149.99,
 *     originalPrice: 199.99,
 *     description: 'High-quality wireless headphones...',
 *     images: [{ uri: '...' }, { uri: '...' }],
 *     rating: 4.5,
 *     reviewCount: 128,
 *     variants: [
 *       { type: 'Color', options: ['Black', 'White', 'Blue'] },
 *       { type: 'Size', options: ['S', 'M', 'L'] },
 *     ],
 *   }}
 *   onAddToCart={(variant) => addToCart(product.id, variant)}
 *   onBuyNow={(variant) => buyNow(product.id, variant)}
 *   onWishlist={() => toggleWishlist(product.id)}
 * />
 * ```
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// Import UI primitives
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Rating } from '../ui/rating';
import { Chip, ChipGroup } from '../ui/chip';
import { IconButton } from '../ui/icon-button';
import { Separator } from '../ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

// ============================================================================
// Icons
// ============================================================================

function HeartIcon({ size = 24, color = '#000', filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={2}>
      <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShareIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronLeftIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CartIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M9 22a1 1 0 100-2 1 1 0 000 2zM20 22a1 1 0 100-2 1 1 0 000 2zM1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" strokeLinecap="round" strokeLinejoin="round" />
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

export interface ProductVariant {
  type: string;
  options: string[];
}

export interface ProductReview {
  id: string;
  user: { name: string; avatarUrl?: string };
  rating: number;
  comment: string;
  date: string;
  helpful?: number;
}

export interface Product {
  name: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  description?: string;
  images?: ImageSourcePropType[];
  rating?: number;
  reviewCount?: number;
  variants?: ProductVariant[];
  inStock?: boolean;
  badge?: string;
  features?: string[];
  specifications?: Record<string, string>;
}

export interface ProductDetailScreenProps {
  product: Product;
  reviews?: ProductReview[];
  wishlisted?: boolean;
  cartCount?: number;
  onBack?: () => void;
  onAddToCart?: (selectedVariants: Record<string, string>) => void;
  onBuyNow?: (selectedVariants: Record<string, string>) => void;
  onWishlist?: () => void;
  onShare?: () => void;
  onCartPress?: () => void;
  onReviewPress?: (review: ProductReview) => void;
  onWriteReview?: () => void;
}

// ============================================================================
// Component
// ============================================================================

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function ProductDetailScreen({
  product,
  reviews = [],
  wishlisted = false,
  cartCount,
  onBack,
  onAddToCart,
  onBuyNow,
  onWishlist,
  onShare,
  onCartPress,
  onReviewPress,
  onWriteReview,
}: ProductDetailScreenProps) {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();
  const insets = useSafeAreaInsets();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const currency = product.currency || '$';
  const formatPrice = (value: number) => `${currency}${value.toFixed(2)}`;
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleVariantSelect = (type: string, option: string) => {
    haptic('selection');
    setSelectedVariants(prev => ({ ...prev, [type]: option }));
  };

  const handleAddToCart = () => {
    haptic('medium');
    onAddToCart?.(selectedVariants);
  };

  const handleBuyNow = () => {
    haptic('medium');
    onBuyNow?.(selectedVariants);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <View style={[styles.headerContent, { paddingHorizontal: spacing[4], paddingVertical: spacing[2] }]}>
          {onBack && (
            <IconButton icon={<ChevronLeftIcon />} variant="ghost" onPress={onBack} />
          )}
          <View style={styles.headerRight}>
            {onShare && (
              <IconButton icon={<ShareIcon />} variant="ghost" onPress={onShare} />
            )}
            {onWishlist && (
              <IconButton
                icon={<HeartIcon filled={wishlisted} color={wishlisted ? colors.destructive : undefined} />}
                variant="ghost"
                onPress={onWishlist}
              />
            )}
            {onCartPress && (
              <View>
                <IconButton icon={<CartIcon />} variant="ghost" onPress={onCartPress} />
                {cartCount !== undefined && cartCount > 0 && (
                  <View style={[styles.cartBadge, { backgroundColor: colors.destructive }]}>
                    <Text style={{ color: '#fff', fontSize: fontSize.xs - 2, fontWeight: fontWeight.bold }}>{cartCount > 9 ? '9+' : cartCount}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={[styles.imageGallery, { backgroundColor: colors.secondary }]}>
          {product.images && product.images.length > 0 ? (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                  setCurrentImageIndex(index);
                }}
                scrollEventThrottle={16}
              >
                {product.images.map((image, index) => (
                  <Image key={index} source={image} style={styles.productImage} resizeMode="cover" />
                ))}
              </ScrollView>
              {product.images.length > 1 && (
                <View style={[styles.pagination, { bottom: spacing[3] }]}>
                  {product.images.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.paginationDot,
                        {
                          backgroundColor: index === currentImageIndex ? colors.foreground : colors.border,
                        },
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={styles.imagePlaceholder}>
              <ImagePlaceholderIcon size={64} color={colors.foregroundMuted} />
            </View>
          )}
          {product.badge && (
            <View style={[styles.productBadge, { top: spacing[3], left: spacing[3] }]}>
              <Badge variant="destructive">{product.badge}</Badge>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={[styles.productInfo, { padding: spacing[4] }]}>
          <Text style={{ color: colors.foreground, fontSize: fontSize.xl, fontWeight: fontWeight.bold, lineHeight: 28 }}>{product.name}</Text>

          {/* Rating */}
          {product.rating !== undefined && (
            <Pressable style={[styles.ratingRow, { marginTop: spacing[2] }]} onPress={onWriteReview}>
              <Rating value={product.rating} size="sm" readOnly />
              <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.sm }}>
                ({product.reviewCount || 0} reviews)
              </Text>
            </Pressable>
          )}

          {/* Price */}
          <View style={[styles.priceRow, { marginTop: spacing[3] }]}>
            <Text style={{ color: colors.foreground, fontSize: fontSize['2xl'], fontWeight: fontWeight.bold }}>{formatPrice(product.price)}</Text>
            {product.originalPrice && (
              <>
                <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.md, textDecorationLine: 'line-through' }}>
                  {formatPrice(product.originalPrice)}
                </Text>
                <Badge variant="success" size="sm">-{discountPercent}%</Badge>
              </>
            )}
          </View>

          {/* Stock status */}
          {product.inStock === false && (
            <Text style={{ color: colors.destructive, fontSize: fontSize.sm, fontWeight: fontWeight.semibold, marginTop: spacing[2] }}>
              Out of Stock
            </Text>
          )}
        </View>

        <Separator />

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <View style={[styles.section, { padding: spacing[4] }]}>
            {product.variants.map((variant) => (
              <View key={variant.type} style={{ marginBottom: spacing[4] }}>
                <Text style={{ color: colors.foreground, fontSize: fontSize.base, fontWeight: fontWeight.semibold, marginBottom: spacing[2] }}>
                  {variant.type}: {selectedVariants[variant.type] || 'Select'}
                </Text>
                <ChipGroup>
                  {variant.options.map((option) => (
                    <Chip
                      key={option}
                      selected={selectedVariants[variant.type] === option}
                      onPress={() => handleVariantSelect(variant.type, option)}
                    >
                      {option}
                    </Chip>
                  ))}
                </ChipGroup>
              </View>
            ))}
          </View>
        )}

        {/* Tabs: Description, Features, Reviews */}
        <Tabs defaultValue="description">
          <TabsList style={{ marginHorizontal: spacing[4] }}>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <View style={{ padding: spacing[4] }}>
              <Text style={{ color: colors.foreground, fontSize: fontSize.base, lineHeight: 22 }}>
                {product.description || 'No description available.'}
              </Text>
            </View>
          </TabsContent>

          <TabsContent value="features">
            <View style={{ padding: spacing[4] }}>
              {product.features?.map((feature, index) => (
                <View key={index} style={[styles.featureItem, { marginBottom: spacing[2] }]}>
                  <View style={[styles.featureBullet, { backgroundColor: colors.primary }]} />
                  <Text style={{ color: colors.foreground, fontSize: fontSize.base, lineHeight: 22, flex: 1 }}>{feature}</Text>
                </View>
              ))}
            </View>
          </TabsContent>

          <TabsContent value="reviews">
            <View style={{ padding: spacing[4] }}>
              {reviews.length === 0 ? (
                <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.base, textAlign: 'center' }}>
                  No reviews yet. Be the first to review!
                </Text>
              ) : (
                reviews.slice(0, 3).map((review) => (
                  <Pressable
                    key={review.id}
                    style={[styles.reviewItem, { marginBottom: spacing[4] }]}
                    onPress={() => onReviewPress?.(review)}
                  >
                    <View style={styles.reviewHeader}>
                      <Text style={{ color: colors.foreground, fontSize: fontSize.sm, fontWeight: fontWeight.semibold }}>{review.user.name}</Text>
                      <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs }}>{review.date}</Text>
                    </View>
                    <Rating value={review.rating} size="sm" readOnly style={{ marginTop: spacing[1] }} />
                    <Text style={{ color: colors.foreground, fontSize: fontSize.sm, lineHeight: 20, marginTop: spacing[2] }} numberOfLines={3}>
                      {review.comment}
                    </Text>
                  </Pressable>
                ))
              )}
              {onWriteReview && (
                <Button variant="outline" onPress={onWriteReview} fullWidth>
                  Write a Review
                </Button>
              )}
            </View>
          </TabsContent>
        </Tabs>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: insets.bottom || spacing[4],
            paddingHorizontal: spacing[4],
            paddingTop: spacing[3],
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          },
        ]}
      >
        <Button
          variant="outline"
          onPress={handleAddToCart}
          disabled={product.inStock === false}
          style={{ flex: 1 }}
          icon={<CartIcon size={20} />}
        >
          Add to Cart
        </Button>
        <View style={{ width: spacing[3] }} />
        <Button
          variant="default"
          onPress={handleBuyNow}
          disabled={product.inStock === false}
          style={{ flex: 1 }}
        >
          Buy Now
        </Button>
      </View>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  imageGallery: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    position: 'relative',
  },
  productImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagination: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  productBadge: {
    position: 'absolute',
  },
  productInfo: {},
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  section: {},
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: 10,
  },
  reviewItem: {},
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBar: {
    flexDirection: 'row',
  },
});
