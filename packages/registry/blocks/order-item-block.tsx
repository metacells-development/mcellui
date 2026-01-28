/**
 * OrderItem
 *
 * Order history line item with product details, status, and actions.
 * Perfect for order history lists and order management.
 *
 * @example
 * ```tsx
 * <OrderItem
 *   order={{
 *     id: 'ORD-12345',
 *     date: '2024-01-15',
 *     total: 149.99,
 *     status: 'delivered',
 *     items: [{ name: 'Product', image: { uri: '...' } }]
 *   }}
 *   onPress={() => navigateToOrderDetails(order.id)}
 *   onTrack={() => trackOrder(order.id)}
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
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme, infoBlockTokens } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// Import UI primitives
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

// ============================================================================
// Icons
// ============================================================================

function ChevronRightIcon({ size = 20, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={2}>
      <Path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PackageIcon({ size = 24, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={1.5}>
      <Path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderProduct {
  id?: string;
  name: string;
  image?: ImageSourcePropType;
  quantity?: number;
}

export interface Order {
  id: string;
  orderNumber?: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: OrderProduct[];
  currency?: string;
  trackingNumber?: string;
}

export interface OrderItemProps {
  /** Order data */
  order: Order;
  /** Called when order is pressed */
  onPress?: () => void;
  /** Called when track button is pressed */
  onTrack?: () => void;
  /** Called when reorder button is pressed */
  onReorder?: () => void;
  /** Called when review button is pressed */
  onReview?: () => void;
  /** Maximum products to show */
  maxProducts?: number;
  /** Whether to show actions */
  showActions?: boolean;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Status Config
// ============================================================================

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
  pending: { label: 'Pending', variant: 'warning' },
  processing: { label: 'Processing', variant: 'secondary' },
  shipped: { label: 'Shipped', variant: 'default' },
  delivered: { label: 'Delivered', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  refunded: { label: 'Refunded', variant: 'outline' },
};

// ============================================================================
// Component
// ============================================================================

export function OrderItem({
  order,
  onPress,
  onTrack,
  onReorder,
  onReview,
  maxProducts = 3,
  showActions = true,
  style,
}: OrderItemProps) {
  const { colors, spacing, radius } = useTheme();
  const tokens = infoBlockTokens.order;

  const handlePress = () => {
    haptic('light');
    onPress?.();
  };

  const formatPrice = (value: number) => {
    return `${order.currency ?? '$'}${value.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const statusConfig = STATUS_CONFIG[order.status];
  const displayItems = order.items.slice(0, maxProducts);
  const remainingCount = order.items.length - maxProducts;
  const totalQuantity = order.items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  // Determine available actions based on status
  const canTrack = order.status === 'shipped' && onTrack;
  const canReview = order.status === 'delivered' && onReview;
  const canReorder = (order.status === 'delivered' || order.status === 'cancelled') && onReorder;

  return (
    <Pressable
      onPress={onPress ? handlePress : undefined}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed && onPress ? colors.secondary : colors.background,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding: spacing[4],
        },
        style,
      ]}
    >
      {/* Header */}
      <View style={[styles.header, { marginBottom: spacing[3] }]}>
        <View style={styles.headerLeft}>
          <Text
            style={[
              styles.orderId,
              {
                color: colors.foreground,
                fontSize: tokens.orderIdFontSize,
                fontWeight: tokens.orderIdFontWeight as any,
              },
            ]}
          >
            Order #{order.orderNumber ?? order.id}
          </Text>
          <Text
            style={[
              styles.date,
              {
                color: colors.foregroundMuted,
                fontSize: tokens.dateFontSize,
              },
            ]}
          >
            {formatDate(order.date)}
          </Text>
        </View>
        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
      </View>

      {/* Products */}
      <View style={[styles.products, { marginBottom: spacing[3] }]}>
        {displayItems.map((item, index) => (
          <View
            key={item.id ?? index}
            style={[
              styles.productImage,
              {
                backgroundColor: colors.secondary,
                borderRadius: radius.md,
                marginRight: index < displayItems.length - 1 ? spacing[2] : 0,
                width: tokens.productImageSize,
                height: tokens.productImageSize,
              },
            ]}
          >
            {item.image ? (
              <Image source={item.image} style={styles.image} resizeMode="cover" />
            ) : (
              <PackageIcon size={20} color={colors.foregroundMuted} />
            )}
          </View>
        ))}

        {remainingCount > 0 && (
          <View
            style={[
              styles.moreProducts,
              {
                backgroundColor: colors.secondary,
                borderRadius: radius.md,
                width: tokens.productImageSize,
                height: tokens.productImageSize,
              },
            ]}
          >
            <Text
              style={[
                styles.moreText,
                {
                  color: colors.foregroundMuted,
                  fontSize: tokens.moreTextFontSize,
                  fontWeight: tokens.moreTextFontWeight as any,
                },
              ]}
            >
              +{remainingCount}
            </Text>
          </View>
        )}
      </View>

      {/* Summary */}
      <View style={[styles.summary, { marginBottom: showActions ? spacing[3] : 0 }]}>
        <Text
          style={[
            styles.itemCount,
            {
              color: colors.foregroundMuted,
              fontSize: tokens.itemCountFontSize,
            },
          ]}
        >
          {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
        </Text>
        <Text
          style={[
            styles.total,
            {
              color: colors.foreground,
              fontSize: tokens.totalFontSize,
              fontWeight: tokens.totalFontWeight as any,
            },
          ]}
        >
          {formatPrice(order.total)}
        </Text>
      </View>

      {/* Actions */}
      {showActions && (canTrack || canReview || canReorder) && (
        <View style={[styles.actions, { gap: spacing[2] }]}>
          {canTrack && (
            <Button
              variant="outline"
              size="sm"
              onPress={onTrack}
              style={{ flex: 1 }}
            >
              Track Order
            </Button>
          )}
          {canReview && (
            <Button
              variant="outline"
              size="sm"
              onPress={onReview}
              style={{ flex: 1 }}
            >
              Write Review
            </Button>
          )}
          {canReorder && (
            <Button
              variant="default"
              size="sm"
              onPress={onReorder}
              style={{ flex: 1 }}
            >
              Reorder
            </Button>
          )}
        </View>
      )}

      {/* Chevron for navigation */}
      {onPress && (
        <View style={styles.chevron}>
          <ChevronRightIcon size={20} color={colors.foregroundMuted} />
        </View>
      )}
    </Pressable>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {},
  orderId: {},
  date: {
    marginTop: 2,
  },
  products: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  moreProducts: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {},
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCount: {},
  total: {},
  actions: {
    flexDirection: 'row',
  },
  chevron: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
});
