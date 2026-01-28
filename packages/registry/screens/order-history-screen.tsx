/**
 * OrderHistoryScreen
 *
 * Past orders list with filtering, order details, and actions.
 * Perfect for e-commerce order management.
 *
 * @example
 * ```tsx
 * <OrderHistoryScreen
 *   orders={userOrders}
 *   onOrderPress={(orderId) => navigateToOrderDetails(orderId)}
 *   onReorder={(orderId) => reorderItems(orderId)}
 * />
 * ```
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';

// Import UI primitives
import { IconButton } from '../ui/icon-button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Spinner } from '../ui/spinner';

// Import blocks
import { OrderItem, Order, OrderStatus } from '../blocks/order-item-block';
import { EmptyStateBlock } from '../blocks/empty-state-block';

// ============================================================================
// Icons
// ============================================================================

function ChevronLeftIcon({ size = 24, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={2}>
      <Path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PackageIcon({ size = 48, color }: { size?: number; color?: string }) {
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

export type OrderFilter = 'all' | 'active' | 'completed';

export interface OrderHistoryScreenProps {
  /** List of orders */
  orders: Order[];
  /** Whether orders are loading */
  loading?: boolean;
  /** Initial filter */
  initialFilter?: OrderFilter;
  /** Called when back is pressed */
  onBack?: () => void;
  /** Called when order is pressed */
  onOrderPress?: (orderId: string) => void;
  /** Called when track is pressed */
  onTrackOrder?: (orderId: string) => void;
  /** Called when reorder is pressed */
  onReorder?: (orderId: string) => void;
  /** Called when review is pressed */
  onReviewOrder?: (orderId: string) => void;
}

// ============================================================================
// Component
// ============================================================================

export function OrderHistoryScreen({
  orders,
  loading = false,
  initialFilter = 'all',
  onBack,
  onOrderPress,
  onTrackOrder,
  onReorder,
  onReviewOrder,
}: OrderHistoryScreenProps) {
  const { colors, spacing, fontSize, fontWeight } = useTheme();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<OrderFilter>(initialFilter);

  // Filter orders based on status
  const filterOrders = (orderList: Order[], filterType: OrderFilter): Order[] => {
    if (filterType === 'all') return orderList;

    const activeStatuses: OrderStatus[] = ['pending', 'processing', 'shipped'];
    const completedStatuses: OrderStatus[] = ['delivered', 'cancelled', 'refunded'];

    if (filterType === 'active') {
      return orderList.filter((o) => activeStatuses.includes(o.status));
    }
    return orderList.filter((o) => completedStatuses.includes(o.status));
  };

  const filteredOrders = filterOrders(orders, filter);

  const renderOrder: ListRenderItem<Order> = ({ item }) => (
    <View style={{ paddingHorizontal: spacing[4], marginBottom: spacing[3] }}>
      <OrderItem
        order={item}
        onPress={onOrderPress ? () => onOrderPress(item.id) : undefined}
        onTrack={onTrackOrder ? () => onTrackOrder(item.id) : undefined}
        onReorder={onReorder ? () => onReorder(item.id) : undefined}
        onReview={onReviewOrder ? () => onReviewOrder(item.id) : undefined}
      />
    </View>
  );

  const renderEmpty = (filterType: OrderFilter) => {
    let title = 'No orders yet';
    let description = 'When you place an order, it will appear here.';

    if (filterType === 'active') {
      title = 'No active orders';
      description = 'You don\'t have any orders in progress.';
    } else if (filterType === 'completed') {
      title = 'No completed orders';
      description = 'Orders that are delivered or cancelled will appear here.';
    }

    return (
      <View style={styles.emptyContainer}>
        <EmptyStateBlock
          icon={<PackageIcon size={64} color={colors.foregroundMuted} />}
          title={title}
          description={description}
        />
      </View>
    );
  };

  const orderCounts = {
    all: orders.length,
    active: filterOrders(orders, 'active').length,
    completed: filterOrders(orders, 'completed').length,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: colors.border }]}>
        <View style={[styles.headerContent, { paddingHorizontal: spacing[4], paddingVertical: spacing[3] }]}>
          {onBack && <IconButton icon={<ChevronLeftIcon />} variant="ghost" onPress={onBack} />}
          <Text style={{ color: colors.foreground, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }}>My Orders</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      {/* Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as OrderFilter)}>
        <TabsList style={{ marginHorizontal: spacing[4], marginTop: spacing[2] }}>
          <TabsTrigger value="all">
            All ({orderCounts.all})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({orderCounts.active})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({orderCounts.completed})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" style={styles.tabContent}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Spinner size="lg" />
            </View>
          ) : filteredOrders.length === 0 ? (
            renderEmpty('all')
          ) : (
            <FlatList
              data={filteredOrders}
              renderItem={renderOrder}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: spacing[3], paddingBottom: insets.bottom + spacing[4] }}
            />
          )}
        </TabsContent>

        <TabsContent value="active" style={styles.tabContent}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Spinner size="lg" />
            </View>
          ) : filterOrders(orders, 'active').length === 0 ? (
            renderEmpty('active')
          ) : (
            <FlatList
              data={filterOrders(orders, 'active')}
              renderItem={renderOrder}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: spacing[3], paddingBottom: insets.bottom + spacing[4] }}
            />
          )}
        </TabsContent>

        <TabsContent value="completed" style={styles.tabContent}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Spinner size="lg" />
            </View>
          ) : filterOrders(orders, 'completed').length === 0 ? (
            renderEmpty('completed')
          ) : (
            <FlatList
              data={filterOrders(orders, 'completed')}
              renderItem={renderOrder}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: spacing[3], paddingBottom: insets.bottom + spacing[4] }}
            />
          )}
        </TabsContent>
      </Tabs>
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
  tabContent: {
    flex: 1,
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
});
