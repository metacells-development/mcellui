/**
 * ProfileBlock
 *
 * User profile header with avatar, name, stats, and action buttons.
 * Perfect for profile screens and user cards.
 *
 * @example
 * ```tsx
 * <ProfileBlock
 *   avatarUrl="https://example.com/avatar.jpg"
 *   name="John Doe"
 *   subtitle="@johndoe"
 *   stats={[
 *     { label: 'Posts', value: '128' },
 *     { label: 'Followers', value: '1.2K' },
 *     { label: 'Following', value: '456' },
 *   ]}
 *   onEditProfile={() => navigation.navigate('EditProfile')}
 *   onSettings={() => navigation.navigate('Settings')}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

// Import your components
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';

// ============================================================================
// Types
// ============================================================================

export interface ProfileStat {
  /** Stat label */
  label: string;
  /** Stat value */
  value: string | number;
  /** Called when stat is pressed */
  onPress?: () => void;
}

export interface ProfileBlockProps {
  /** Avatar image URL */
  avatarUrl?: string;
  /** User's name */
  name: string;
  /** Subtitle (username, email, or role) */
  subtitle?: string;
  /** Bio or description */
  bio?: string;
  /** Profile stats to display */
  stats?: ProfileStat[];
  /** Primary action button text */
  primaryButtonText?: string;
  /** Called when primary button is pressed */
  onPrimaryAction?: () => void;
  /** Secondary action button text */
  secondaryButtonText?: string;
  /** Called when secondary button is pressed */
  onSecondaryAction?: () => void;
  /** Show edit profile button */
  showEditProfile?: boolean;
  /** Called when edit profile is pressed */
  onEditProfile?: () => void;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function ProfileBlock({
  avatarUrl,
  name,
  subtitle,
  bio,
  stats,
  primaryButtonText = 'Edit Profile',
  onPrimaryAction,
  secondaryButtonText,
  onSecondaryAction,
  style,
}: ProfileBlockProps) {
  const { colors, spacing } = useTheme();

  // Get initials from name
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={[styles.container, { padding: spacing[6] }, style]}>
      {/* Avatar and Name */}
      <View style={[styles.header, { marginBottom: spacing[4] }]}>
        <Avatar
          size="xl"
          source={avatarUrl ? { uri: avatarUrl } : undefined}
          fallback={initials}
        />
        <Text
          style={[
            styles.name,
            { color: colors.foreground, marginTop: spacing[3] },
          ]}
        >
          {name}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              { color: colors.foregroundMuted, marginTop: spacing[1] },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Bio */}
      {bio && (
        <Text
          style={[
            styles.bio,
            {
              color: colors.foreground,
              marginBottom: spacing[4],
              paddingHorizontal: spacing[4],
            },
          ]}
        >
          {bio}
        </Text>
      )}

      {/* Stats */}
      {stats && stats.length > 0 && (
        <View
          style={[
            styles.stats,
            {
              marginBottom: spacing[6],
              paddingVertical: spacing[4],
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: colors.border,
            },
          ]}
        >
          {stats.map((stat, index) => (
            <View
              key={index}
              style={[
                styles.stat,
                index < stats.length - 1 && {
                  borderRightWidth: 1,
                  borderRightColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {stat.value}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: colors.foregroundMuted, marginTop: spacing[0.5] },
                ]}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={[styles.actions, { gap: spacing[3] }]}>
        {onPrimaryAction && (
          <Button
            onPress={onPrimaryAction}
            fullWidth
          >
            {primaryButtonText}
          </Button>
        )}
        {onSecondaryAction && secondaryButtonText && (
          <Button
            variant="outline"
            onPress={onSecondaryAction}
            fullWidth
          >
            {secondaryButtonText}
          </Button>
        )}
      </View>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
  },
  bio: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  stats: {
    flexDirection: 'row',
    width: '100%',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
  },
  actions: {
    width: '100%',
  },
});
