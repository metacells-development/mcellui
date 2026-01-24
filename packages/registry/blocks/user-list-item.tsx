/**
 * UserListItem
 *
 * User row for follower lists, search results, and user selection.
 * Displays avatar, name, subtitle, and optional action button.
 *
 * @example
 * ```tsx
 * <UserListItem
 *   user={{ name: 'John Doe', username: '@johndoe', avatarUrl: '...' }}
 *   status="online"
 *   onPress={() => navigateToProfile(user.id)}
 * />
 *
 * <UserListItem
 *   user={{ name: 'Jane Smith', subtitle: 'Product Designer' }}
 *   actionLabel="Follow"
 *   onAction={() => followUser(user.id)}
 * />
 * ```
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// Import UI primitives
import { Avatar, AvatarStatus } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

// ============================================================================
// Types
// ============================================================================

export interface UserListItemUser {
  /** User display name */
  name: string;
  /** Username handle (e.g., @username) */
  username?: string;
  /** Secondary text (e.g., job title, bio) */
  subtitle?: string;
  /** Avatar fallback initials */
  avatar?: string;
  /** Avatar image URL */
  avatarUrl?: string;
}

export interface UserListItemProps {
  /** User data */
  user: UserListItemUser;
  /** Online/offline status indicator */
  status?: AvatarStatus;
  /** Whether this user is verified */
  verified?: boolean;
  /** Action button label (e.g., "Follow", "Add") */
  actionLabel?: string;
  /** Action button variant */
  actionVariant?: 'default' | 'outline' | 'secondary';
  /** Whether action is in loading state */
  actionLoading?: boolean;
  /** Whether the item is selected */
  selected?: boolean;
  /** Badge content (e.g., notification count) */
  badge?: number | string;
  /** Called when action button is pressed */
  onAction?: () => void;
  /** Called when the entire row is pressed */
  onPress?: () => void;
  /** Custom right element (overrides action button) */
  rightElement?: React.ReactNode;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function UserListItem({
  user,
  status,
  verified,
  actionLabel,
  actionVariant = 'outline',
  actionLoading,
  selected,
  badge,
  onAction,
  onPress,
  rightElement,
  style,
}: UserListItemProps) {
  const { colors, spacing, radius } = useTheme();

  // Get initials from name
  const initials = user.avatar || user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handlePress = () => {
    haptic('selection');
    onPress?.();
  };

  const handleAction = () => {
    haptic('light');
    onAction?.();
  };

  const Container = onPress ? Pressable : View;

  return (
    <Container
      style={({ pressed }: { pressed?: boolean }) => [
        styles.container,
        {
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[4],
          backgroundColor: pressed ? colors.secondary : selected ? colors.secondary : 'transparent',
        },
        style,
      ]}
      onPress={onPress ? handlePress : undefined}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      {/* Avatar with status */}
      <Avatar
        source={user.avatarUrl ? { uri: user.avatarUrl } : undefined}
        fallback={initials}
        size="md"
        status={status}
      />

      {/* User info */}
      <View style={[styles.info, { marginLeft: spacing[3] }]}>
        <View style={styles.nameRow}>
          <Text
            style={[styles.name, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {user.name}
          </Text>
          {verified && (
            <View style={[styles.verifiedBadge, { backgroundColor: colors.primary, marginLeft: spacing[1] }]}>
              <Text style={{ color: colors.primaryForeground, fontSize: 10 }}>✓</Text>
            </View>
          )}
        </View>

        {(user.username || user.subtitle) && (
          <Text
            style={[styles.subtitle, { color: colors.foregroundMuted, marginTop: 2 }]}
            numberOfLines={1}
          >
            {user.username || user.subtitle}
          </Text>
        )}
      </View>

      {/* Right side: badge, action, or custom element */}
      <View style={[styles.right, { marginLeft: spacing[3] }]}>
        {badge !== undefined && (
          <Badge count={typeof badge === 'number' ? badge : undefined} size="sm" variant="destructive">
            {typeof badge === 'string' ? badge : undefined}
          </Badge>
        )}

        {rightElement || (actionLabel && (
          <Button
            variant={actionVariant}
            size="sm"
            loading={actionLoading}
            onPress={handleAction}
          >
            {actionLabel}
          </Button>
        ))}
      </View>
    </Container>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontWeight: '600',
    fontSize: 15,
    flexShrink: 1,
  },
  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 13,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
