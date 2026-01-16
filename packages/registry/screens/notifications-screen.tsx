/**
 * NotificationsScreen
 *
 * Complete notifications screen with swipe-to-delete, read/unread states,
 * and grouped notifications. Ready to connect to your notification backend.
 *
 * @example
 * ```tsx
 * <NotificationsScreen
 *   notifications={notifications}
 *   onNotificationPress={(notif) => handlePress(notif)}
 *   onDelete={(id) => deleteNotification(id)}
 *   onMarkAllRead={() => markAllAsRead()}
 *   onBack={() => navigation.goBack()}
 * />
 * ```
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@nativeui/core';

// Import UI primitives
import { Separator } from '../ui/separator';
import { SwipeableRow } from '../ui/swipeable-row';

// Import blocks
import { NotificationItem } from '../blocks/notification-item';

// ============================================================================
// Types
// ============================================================================

export type NotificationType = 'social' | 'system' | 'message' | 'alert';

export interface Notification {
  /** Unique notification ID */
  id: string;
  /** Notification type */
  type?: NotificationType;
  /** Title (usually user name or system title) */
  title: string;
  /** Notification message */
  message: string;
  /** Time string */
  time: string;
  /** Whether notification is unread */
  unread?: boolean;
  /** Avatar URL for social notifications */
  avatarUrl?: string;
  /** Custom icon for system notifications */
  icon?: React.ReactNode;
}

export interface NotificationsScreenProps {
  /** List of notifications */
  notifications?: Notification[];
  /** Called when a notification is pressed */
  onNotificationPress?: (notification: Notification) => void;
  /** Called when a notification is deleted */
  onDelete?: (id: string) => void;
  /** Called when "Mark all read" is pressed */
  onMarkAllRead?: () => void;
  /** Called when back button is pressed */
  onBack?: () => void;
  /** Show loading state */
  loading?: boolean;
  /** Called on pull to refresh */
  onRefresh?: () => void;
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

function BellIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TrashIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShippingIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="5.5" cy="18.5" r="2.5" />
      <Circle cx="18.5" cy="18.5" r="2.5" />
    </Svg>
  );
}

function ChartIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BellOffIcon({ size = 64, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
      <Path d="M13.73 21a2 2 0 01-3.46 0M18.63 13A17.89 17.89 0 0118 8M6.26 6.26A5.86 5.86 0 006 8c0 7-3 9-3 9h14M18 8a6 6 0 00-9.33-5M1 1l22 22" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Default Data
// ============================================================================

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'social',
    title: 'Sarah',
    message: 'started following you',
    time: '2m ago',
    unread: true,
  },
  {
    id: '2',
    type: 'social',
    title: 'John',
    message: 'commented: "Great photo!"',
    time: '15m ago',
    unread: true,
  },
  {
    id: '3',
    type: 'system',
    title: 'Your order shipped',
    message: 'Order #12345 is on its way',
    time: '1h ago',
    unread: false,
  },
  {
    id: '4',
    type: 'message',
    title: 'Emma',
    message: 'sent you a message',
    time: '2h ago',
    unread: false,
  },
  {
    id: '5',
    type: 'system',
    title: 'Weekly summary',
    message: 'Your activity report is ready',
    time: '1d ago',
    unread: false,
  },
];

// ============================================================================
// Sub-Components
// ============================================================================

function EmptyState({
  title,
  message,
  colors,
}: {
  title: string;
  message: string;
  colors: any;
}) {
  return (
    <View style={styles.emptyContainer}>
      <BellOffIcon size={64} color={colors.foregroundMuted} />
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.emptyMessage, { color: colors.foregroundMuted }]}>{message}</Text>
    </View>
  );
}

// ============================================================================
// Component
// ============================================================================

export function NotificationsScreen({
  notifications = DEFAULT_NOTIFICATIONS,
  onNotificationPress,
  onDelete,
  onMarkAllRead,
  onBack,
  loading = false,
  onRefresh,
  emptyTitle = 'No notifications',
  emptyMessage = 'You\'re all caught up! Check back later for new updates.',
}: NotificationsScreenProps) {
  const { colors, spacing, fontWeight } = useTheme();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getNotificationIcon = (notification: Notification) => {
    if (notification.icon) return notification.icon;

    switch (notification.type) {
      case 'system':
        if (notification.title.toLowerCase().includes('order') || notification.title.toLowerCase().includes('shipped')) {
          return <ShippingIcon size={20} color={colors.foregroundMuted} />;
        }
        if (notification.title.toLowerCase().includes('summary') || notification.title.toLowerCase().includes('report')) {
          return <ChartIcon size={20} color={colors.foregroundMuted} />;
        }
        return <BellIcon size={20} color={colors.foregroundMuted} />;
      default:
        return undefined;
    }
  };

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
          },
        ]}
      >
        {onBack && (
          <Pressable onPress={onBack} hitSlop={8}>
            <BackIcon size={24} color={colors.foreground} />
          </Pressable>
        )}

        <View style={styles.headerCenter}>
          <Text
            style={[
              styles.headerTitle,
              { color: colors.foreground, fontWeight: fontWeight.semibold },
            ]}
          >
            Notifications
          </Text>
          {unreadCount > 0 && (
            <View
              style={[
                styles.badge,
                { backgroundColor: colors.primary, marginLeft: spacing[2] },
              ]}
            >
              <Text style={[styles.badgeText, { color: colors.primaryForeground }]}>
                {unreadCount}
              </Text>
            </View>
          )}
        </View>

        {onMarkAllRead && unreadCount > 0 && (
          <Pressable onPress={onMarkAllRead} hitSlop={8}>
            <Text style={[styles.markAllRead, { color: colors.primary }]}>
              Mark all read
            </Text>
          </Pressable>
        )}

        {(!onMarkAllRead || unreadCount === 0) && <View style={{ width: 80 }} />}
      </View>

      <Separator />

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <EmptyState title={emptyTitle} message={emptyMessage} colors={colors} />
      ) : (
        <ScrollView
          style={styles.list}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
              />
            ) : undefined
          }
        >
          {notifications.map((notification) => (
            <SwipeableRow
              key={notification.id}
              rightActions={
                onDelete
                  ? [
                      {
                        label: 'Delete',
                        color: colors.destructive,
                        icon: <TrashIcon size={20} color="#fff" />,
                        onPress: () => onDelete(notification.id),
                      },
                    ]
                  : []
              }
            >
              <NotificationItem
                title={notification.title}
                message={notification.message}
                time={notification.time}
                unread={notification.unread}
                avatarUrl={notification.avatarUrl}
                icon={getNotificationIcon(notification)}
                onPress={
                  onNotificationPress
                    ? () => onNotificationPress(notification)
                    : undefined
                }
              />
            </SwipeableRow>
          ))}

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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  markAllRead: {
    fontSize: 14,
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
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
});
