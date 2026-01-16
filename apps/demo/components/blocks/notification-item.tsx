/**
 * NotificationItem
 *
 * A notification list item with avatar, message, time, and unread indicator.
 * Perfect for notification lists, activity feeds, and message previews.
 *
 * @example
 * ```tsx
 * <NotificationItem
 *   avatarUrl="https://example.com/avatar.jpg"
 *   title="John Doe"
 *   message="liked your post"
 *   time="2 min ago"
 *   unread
 *   onPress={() => navigation.navigate('Post')}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@nativeui/core';

// Import your components
import { Avatar } from '@/components/ui/avatar';

// ============================================================================
// Types
// ============================================================================

export interface NotificationItemProps {
  /** Avatar image URL */
  avatarUrl?: string;
  /** Notification title (usually user name) */
  title: string;
  /** Notification message/description */
  message: string;
  /** Time string (e.g., "2 min ago") */
  time?: string;
  /** Whether the notification is unread */
  unread?: boolean;
  /** Icon element to show instead of avatar */
  icon?: React.ReactNode;
  /** Called when item is pressed */
  onPress?: () => void;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function NotificationItem({
  avatarUrl,
  title,
  message,
  time,
  unread = false,
  icon,
  onPress,
  style,
}: NotificationItemProps) {
  const { colors, spacing, radius } = useTheme();

  // Get initials from title
  const initials = title
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const content = (
    <View
      style={[
        styles.container,
        {
          padding: spacing[4],
          backgroundColor: unread ? colors.primaryMuted : 'transparent',
        },
        style,
      ]}
    >
      {/* Unread indicator */}
      {unread && (
        <View
          style={[
            styles.unreadDot,
            {
              backgroundColor: colors.primary,
              left: spacing[1],
            },
          ]}
        />
      )}

      {/* Avatar or Icon */}
      <View style={[styles.avatarContainer, { marginRight: spacing[3] }]}>
        {icon ? (
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.secondary,
                borderRadius: radius.full,
                width: 44,
                height: 44,
              },
            ]}
          >
            {icon}
          </View>
        ) : (
          <Avatar
            size="md"
            source={avatarUrl ? { uri: avatarUrl } : undefined}
            fallback={initials}
          />
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[styles.text, { color: colors.foreground }]}
          numberOfLines={2}
        >
          <Text style={styles.title}>{title}</Text>
          {' '}
          <Text style={styles.message}>{message}</Text>
        </Text>
        {time && (
          <Text
            style={[
              styles.time,
              { color: colors.foregroundMuted, marginTop: spacing[1] },
            ]}
          >
            {time}
          </Text>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          pressed && { opacity: 0.7 },
        ]}
      >
        {content}
      </Pressable>
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
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: '50%',
    marginTop: -4,
  },
  avatarContainer: {
    flexShrink: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  title: {
    fontWeight: '600',
  },
  message: {
    fontWeight: '400',
  },
  time: {
    fontSize: 13,
  },
});
