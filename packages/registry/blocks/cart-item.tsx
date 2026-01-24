/**
 * CartItem
 *
 * Shopping cart line item with product details, quantity controls, and actions.
 * Perfect for cart screens and order summaries.
 *
 * @example
 * ```tsx
 * <CartItem
 *   product={{
 *     name: 'Premium Wireless Headphones',
 *     price: 149.99,
 *     image: { uri: '...' },
 *     variant: 'Black',
 *   }}
 *   quantity={2}
 *   onQuantityChange={(qty) => updateQuantity(id, qty)}
 *   onRemove={() => removeFromCart(id)}
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
import { Stepper } from '../ui/stepper';
import { SwipeableRow, SwipeAction } from '../ui/swipeable-row';

// ============================================================================
// Icons
// ============================================================================

function TrashIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path
        d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HeartIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path
        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ImagePlaceholderIcon({ size = 32, color = '#000' }: { size?: number; color?: string }) {
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

export interface CartProduct {
  /** Product name/title */
  name: string;
  /** Unit price */
  price: number;
  /** Original price (if on sale) */
  originalPrice?: number;
  /** Product image */
  image?: ImageSourcePropType;
  /** Variant info (e.g., "Size: M, Color: Blue") */
  variant?: string;
  /** SKU or product ID */
  sku?: string;
}

export interface CartItemProps {
  /** Product details */
  product: CartProduct;
  /** Quantity in cart */
  quantity: number;
  /** Maximum quantity allowed */
  maxQuantity?: number;
  /** Minimum quantity allowed */
  minQuantity?: number;
  /** Currency symbol */
  currency?: string;
  /** Whether to show save for later option */
  showSaveForLater?: boolean;
  /** Whether item is out of stock */
  outOfStock?: boolean;
  /** Whether swipe actions are enabled */
  swipeable?: boolean;
  /** Called when quantity changes */
  onQuantityChange?: (quantity: number) => void;
  /** Called when remove is pressed */
  onRemove?: () => void;
  /** Called when save for later is pressed */
  onSaveForLater?: () => void;
  /** Called when item is pressed */
  onPress?: () => void;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function CartItem({
  product,
  quantity,
  maxQuantity = 99,
  minQuantity = 1,
  currency = '$',
  showSaveForLater = false,
  outOfStock = false,
  swipeable = true,
  onQuantityChange,
  onRemove,
  onSaveForLater,
  onPress,
  style,
}: CartItemProps) {
  const { colors, spacing, radius } = useTheme();

  const handlePress = () => {
    haptic('light');
    onPress?.();
  };

  const handleRemove = () => {
    haptic('medium');
    onRemove?.();
  };

  const handleSaveForLater = () => {
    haptic('light');
    onSaveForLater?.();
  };

  // Format price
  const formatPrice = (value: number) => {
    return `${currency}${value.toFixed(2)}`;
  };

  // Calculate line total
  const lineTotal = product.price * quantity;

  // Right swipe actions
  const rightActions: SwipeAction[] = [];

  if (showSaveForLater && onSaveForLater) {
    rightActions.push({
      label: 'Save',
      color: colors.primary,
      icon: <HeartIcon />,
      onPress: handleSaveForLater,
    });
  }

  if (onRemove) {
    rightActions.push({
      label: 'Remove',
      color: colors.destructive,
      icon: <TrashIcon />,
      onPress: handleRemove,
    });
  }

  const content = (
    <Pressable
      onPress={onPress ? handlePress : undefined}
      style={({ pressed }) => [
        styles.container,
        {
          padding: spacing[4],
          backgroundColor: pressed && onPress ? colors.secondary : colors.background,
          opacity: outOfStock ? 0.6 : 1,
        },
        style,
      ]}
    >
      {/* Product Image */}
      <View
        style={[
          styles.imageContainer,
          {
            backgroundColor: colors.secondary,
            borderRadius: radius.md,
          },
        ]}
      >
        {product.image ? (
          <Image source={product.image} style={styles.image} resizeMode="cover" />
        ) : (
          <ImagePlaceholderIcon size={32} color={colors.foregroundMuted} />
        )}
      </View>

      {/* Product Info */}
      <View style={[styles.info, { marginLeft: spacing[3] }]}>
        {/* Name */}
        <Text
          style={[styles.name, { color: colors.foreground }]}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        {/* Variant */}
        {product.variant && (
          <Text
            style={[styles.variant, { color: colors.foregroundMuted, marginTop: spacing[0.5] }]}
            numberOfLines={1}
          >
            {product.variant}
          </Text>
        )}

        {/* Price row */}
        <View style={[styles.priceRow, { marginTop: spacing[1] }]}>
          <Text style={[styles.price, { color: colors.foreground }]}>
            {formatPrice(product.price)}
          </Text>
          {product.originalPrice && (
            <Text style={[styles.originalPrice, { color: colors.foregroundMuted }]}>
              {formatPrice(product.originalPrice)}
            </Text>
          )}
        </View>

        {/* Out of stock message */}
        {outOfStock && (
          <Text style={[styles.outOfStock, { color: colors.destructive, marginTop: spacing[1] }]}>
            Out of Stock
          </Text>
        )}

        {/* Quantity and actions */}
        <View style={[styles.bottomRow, { marginTop: spacing[2] }]}>
          {/* Quantity stepper */}
          {!outOfStock && onQuantityChange && (
            <Stepper
              value={quantity}
              min={minQuantity}
              max={maxQuantity}
              onValueChange={onQuantityChange}
              size="sm"
            />
          )}

          {/* Line total */}
          <Text style={[styles.lineTotal, { color: colors.foreground }]}>
            {formatPrice(lineTotal)}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  // Wrap with SwipeableRow if enabled
  if (swipeable && rightActions.length > 0) {
    return (
      <SwipeableRow rightActions={rightActions}>
        {content}
      </SwipeableRow>
    );
  }

  return content;
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageContainer: {
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
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  variant: {
    fontSize: 13,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
  },
  originalPrice: {
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  outOfStock: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lineTotal: {
    fontSize: 16,
    fontWeight: '700',
  },
});
