/**
 * CartScreen
 *
 * Shopping cart screen with items, summary, and checkout action.
 * Perfect for e-commerce cart and checkout flows.
 *
 * @example
 * ```tsx
 * <CartScreen
 *   items={cartItems}
 *   onQuantityChange={(id, qty) => updateQuantity(id, qty)}
 *   onRemoveItem={(id) => removeFromCart(id)}
 *   onCheckout={() => navigateToCheckout()}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';

// Import UI primitives
import { Button } from '../ui/button';
import { IconButton } from '../ui/icon-button';
import { Separator } from '../ui/separator';

// Import blocks
import { CartItem, CartProduct } from '../blocks/cart-item';
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

function ShoppingBagIcon({ size = 48, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
      <Path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export interface CartItemData {
  id: string;
  product: CartProduct;
  quantity: number;
}

export interface CartScreenProps {
  /** Cart items */
  items: CartItemData[];
  /** Currency symbol */
  currency?: string;
  /** Shipping cost (undefined means free) */
  shippingCost?: number;
  /** Tax amount */
  tax?: number;
  /** Discount amount */
  discount?: number;
  /** Promo code applied */
  promoCode?: string;
  /** Called when back is pressed */
  onBack?: () => void;
  /** Called when quantity changes */
  onQuantityChange?: (itemId: string, quantity: number) => void;
  /** Called when item is removed */
  onRemoveItem?: (itemId: string) => void;
  /** Called when item is pressed */
  onItemPress?: (itemId: string) => void;
  /** Called when checkout is pressed */
  onCheckout?: () => void;
  /** Called when continue shopping is pressed */
  onContinueShopping?: () => void;
  /** Called when promo code is applied */
  onApplyPromo?: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function CartScreen({
  items,
  currency = '$',
  shippingCost,
  tax,
  discount,
  promoCode,
  onBack,
  onQuantityChange,
  onRemoveItem,
  onItemPress,
  onCheckout,
  onContinueShopping,
  onApplyPromo,
}: CartScreenProps) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();

  const formatPrice = (value: number) => `${currency}${value.toFixed(2)}`;

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = shippingCost ?? 0;
  const taxAmount = tax ?? 0;
  const discountAmount = discount ?? 0;
  const total = subtotal + shipping + taxAmount - discountAmount;

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Empty cart
  if (items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: colors.border }]}>
          <View style={[styles.headerContent, { paddingHorizontal: spacing[4], paddingVertical: spacing[3] }]}>
            {onBack && <IconButton icon={<ChevronLeftIcon />} variant="ghost" onPress={onBack} />}
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>Cart</Text>
            <View style={{ width: 44 }} />
          </View>
        </View>

        <View style={styles.emptyContainer}>
          <EmptyStateBlock
            icon={<ShoppingBagIcon size={64} color={colors.foregroundMuted} />}
            title="Your cart is empty"
            description="Looks like you haven't added anything to your cart yet."
            actionLabel="Start Shopping"
            onAction={onContinueShopping}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: colors.border }]}>
        <View style={[styles.headerContent, { paddingHorizontal: spacing[4], paddingVertical: spacing[3] }]}>
          {onBack && <IconButton icon={<ChevronLeftIcon />} variant="ghost" onPress={onBack} />}
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Cart ({itemCount})
          </Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={[styles.itemsSection, { paddingVertical: spacing[2] }]}>
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              <CartItem
                product={item.product}
                quantity={item.quantity}
                currency={currency}
                onQuantityChange={(qty) => onQuantityChange?.(item.id, qty)}
                onRemove={() => onRemoveItem?.(item.id)}
                onPress={() => onItemPress?.(item.id)}
              />
              {index < items.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </View>

        {/* Promo Code */}
        {onApplyPromo && (
          <View style={[styles.promoSection, { padding: spacing[4] }]}>
            <Button variant="outline" onPress={onApplyPromo} fullWidth>
              {promoCode ? `Promo: ${promoCode}` : 'Apply Promo Code'}
            </Button>
          </View>
        )}

        <Separator />

        {/* Order Summary */}
        <View style={[styles.summarySection, { padding: spacing[4] }]}>
          <Text style={[styles.summaryTitle, { color: colors.foreground, marginBottom: spacing[3] }]}>
            Order Summary
          </Text>

          <View style={[styles.summaryRow, { marginBottom: spacing[2] }]}>
            <Text style={[styles.summaryLabel, { color: colors.foregroundMuted }]}>
              Subtotal ({itemCount} items)
            </Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>
              {formatPrice(subtotal)}
            </Text>
          </View>

          <View style={[styles.summaryRow, { marginBottom: spacing[2] }]}>
            <Text style={[styles.summaryLabel, { color: colors.foregroundMuted }]}>Shipping</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>
              {shippingCost === undefined || shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
            </Text>
          </View>

          {taxAmount > 0 && (
            <View style={[styles.summaryRow, { marginBottom: spacing[2] }]}>
              <Text style={[styles.summaryLabel, { color: colors.foregroundMuted }]}>Tax</Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                {formatPrice(taxAmount)}
              </Text>
            </View>
          )}

          {discountAmount > 0 && (
            <View style={[styles.summaryRow, { marginBottom: spacing[2] }]}>
              <Text style={[styles.summaryLabel, { color: colors.success }]}>Discount</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                -{formatPrice(discountAmount)}
              </Text>
            </View>
          )}

          <Separator style={{ marginVertical: spacing[3] }} />

          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.foreground }]}>
              {formatPrice(total)}
            </Text>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Checkout Button */}
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
        <View style={styles.checkoutTotal}>
          <Text style={[styles.checkoutLabel, { color: colors.foregroundMuted }]}>Total</Text>
          <Text style={[styles.checkoutPrice, { color: colors.foreground }]}>{formatPrice(total)}</Text>
        </View>
        <Button variant="default" onPress={onCheckout} style={{ flex: 1 }}>
          Checkout
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
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  itemsSection: {},
  promoSection: {},
  summarySection: {},
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  checkoutTotal: {
    alignItems: 'flex-start',
  },
  checkoutLabel: {
    fontSize: 12,
  },
  checkoutPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
});
