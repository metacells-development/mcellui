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
 *   actionText="Follow"
 *   onAction={() => followUser(user.id)}
 * />
 * ```
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useTheme, socialBlockTokens, fontSize } from '@metacells/mcellui-core';
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
  /** Action button text (e.g., "Follow", "Add") */
  actionText?: string;
  /** Action button variant */
  actionVariant?: 'default' | 'outline' | 'secondary';
  /** Whether action is in loading state */
  actionLoading?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
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
  actionText,
  actionVariant = 'outline',
  actionLoading,
  disabled,
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
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onPress={onPress && !disabled ? handlePress : undefined}
      disabled={disabled}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${user.name}${user.username ? `, ${user.username}` : ''}${user.subtitle ? `, ${user.subtitle}` : ''}`}
      accessibilityState={{ disabled: disabled || false, selected: selected || false }}
    >
      {/* Avatar with status */}
      <Avatar
        source={user.avatarUrl ? { uri: user.avatarUrl } : undefined}
        fallback={initials}
        size={socialBlockTokens.avatar.listSize}
        status={status}
      />

      {/* User info */}
      <View style={[styles.info, { marginLeft: spacing[3] }]}>
        <View style={styles.nameRow}>
          <Text
            style={{
              color: colors.foreground,
              fontSize: socialBlockTokens.typography.authorFontSize,
              fontWeight: String(socialBlockTokens.typography.authorFontWeight) as any,
              flexShrink: 1,
            }}
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
            style={{
              color: colors.foregroundMuted,
              fontSize: fontSize.sm,
              marginTop: 2,
            }}
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

        {rightElement || (actionText && (
          <Button
            variant={actionVariant}
            size="sm"
            loading={actionLoading}
            disabled={disabled || actionLoading}
            onPress={handleAction}
            accessibilityLabel={`${actionText} ${user.name}`}
          >
            {actionText}
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
  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
