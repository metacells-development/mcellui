/**
 * ProfileScreen
 *
 * User profile screen with avatar, stats, action buttons, and content tabs.
 * Perfect for social apps, creator profiles, and user dashboards.
 * Uses Avatar, Button, IconButton, and Badge primitives.
 *
 * @example
 * ```tsx
 * <ProfileScreen
 *   user={{
 *     name: 'Jane Doe',
 *     username: '@janedoe',
 *     avatarUrl: 'https://example.com/avatar.jpg',
 *     bio: 'Designer & Developer',
 *     stats: { posts: 42, followers: 1200, following: 350 },
 *   }}
 *   isOwnProfile
 *   onEditProfile={() => navigation.navigate('EditProfile')}
 *   onSettingsPress={() => navigation.navigate('Settings')}
 *   tabs={[
 *     { key: 'posts', title: 'Posts', content: <PostsGrid /> },
 *     { key: 'media', title: 'Media', content: <MediaGrid /> },
 *     { key: 'about', title: 'About', content: <AboutSection /> },
 *   ]}
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
  ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';

// Import UI primitives
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { IconButton } from '../ui/icon-button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

// ============================================================================
// Types
// ============================================================================

export interface UserStats {
  posts?: number;
  followers?: number;
  following?: number;
  [key: string]: number | undefined;
}

export interface ProfileUser {
  /** User's display name */
  name: string;
  /** Username with @ prefix */
  username?: string;
  /** Avatar image URL */
  avatarUrl?: string;
  /** Avatar image source (alternative to URL) */
  avatarSource?: ImageSourcePropType;
  /** User bio/description */
  bio?: string;
  /** User stats */
  stats?: UserStats;
  /** Verified badge */
  verified?: boolean;
}

export interface ProfileTab {
  /** Unique key for the tab */
  key: string;
  /** Tab title */
  title: string;
  /** Tab content */
  content: React.ReactNode;
  /** Badge count */
  badge?: number;
}

export interface ProfileScreenProps {
  /** User data */
  user: ProfileUser;
  /** Is this the current user's own profile */
  isOwnProfile?: boolean;
  /** Is current user following this profile (for other profiles) */
  isFollowing?: boolean;
  /** Tabs to display */
  tabs?: ProfileTab[];
  /** Called when edit profile button is pressed */
  onEditProfile?: () => void;
  /** Called when settings button is pressed */
  onSettingsPress?: () => void;
  /** Called when follow button is pressed */
  onFollowPress?: () => void;
  /** Called when message button is pressed */
  onMessagePress?: () => void;
  /** Called when a stat is pressed */
  onStatPress?: (stat: string) => void;
  /** Called when back button is pressed */
  onBackPress?: () => void;
  /** Custom header actions */
  headerActions?: React.ReactNode;
}

// ============================================================================
// Icons
// ============================================================================

function SettingsIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </Svg>
  );
}

function VerifiedIcon({ size = 18, color = '#3B82F6' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </Svg>
  );
}

function BackIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Component
// ============================================================================

export function ProfileScreen({
  user,
  isOwnProfile = false,
  isFollowing = false,
  tabs = [],
  onEditProfile,
  onSettingsPress,
  onFollowPress,
  onMessagePress,
  onStatPress,
  onBackPress,
  headerActions,
}: ProfileScreenProps) {
  const { colors, spacing, fontSize, fontWeight, lineHeight } = useTheme();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState(tabs[0]?.key || '');

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const statsArray = user.stats
    ? Object.entries(user.stats).filter(([_, value]) => value !== undefined)
    : [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header - Using IconButton for navigation */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + spacing[2],
            paddingHorizontal: spacing[4],
            paddingBottom: spacing[2],
          },
        ]}
      >
        {onBackPress && (
          <IconButton
            icon={<BackIcon />}
            variant="ghost"
            size="sm"
            onPress={onBackPress}
            accessibilityLabel="Go back"
          />
        )}
        <View style={{ flex: 1 }} />
        {headerActions || (
          isOwnProfile && onSettingsPress && (
            <IconButton
              icon={<SettingsIcon />}
              variant="ghost"
              size="sm"
              onPress={onSettingsPress}
              accessibilityLabel="Settings"
            />
          )
        )}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing[4], flexGrow: 1 }}
      >
        {/* Profile Info */}
        <View style={[styles.profileInfo, { paddingHorizontal: spacing[6] }]}>
          {/* Avatar */}
          <Avatar
            size="xl"
            source={user.avatarSource || (user.avatarUrl ? { uri: user.avatarUrl } : undefined)}
            fallback={user.name.substring(0, 2)}
          />

          {/* Name & Username */}
          <View style={[styles.nameContainer, { marginTop: spacing[4] }]}>
            <View style={styles.nameRow}>
              <Text style={{
                fontSize: fontSize['2xl'],
                fontWeight: fontWeight.bold,
                color: colors.foreground,
              }}>{user.name}</Text>
              {user.verified && (
                <View style={{ marginLeft: spacing[1] }}>
                  <VerifiedIcon color={colors.primary} />
                </View>
              )}
            </View>
            {user.username && (
              <Text style={{
                fontSize: fontSize.base,
                color: colors.foregroundMuted,
                marginTop: spacing[1],
              }}>
                {user.username}
              </Text>
            )}
          </View>

          {/* Bio */}
          {user.bio && (
            <Text style={{
              fontSize: fontSize.base,
              lineHeight: fontSize.base * 1.5,
              textAlign: 'center',
              color: colors.foreground,
              marginTop: spacing[3],
            }}>
              {user.bio}
            </Text>
          )}

          {/* Stats */}
          {statsArray.length > 0 && (
            <View style={[styles.stats, { marginTop: spacing[4], gap: spacing[6] }]}>
              {statsArray.map(([key, value]) => (
                <Pressable
                  key={key}
                  onPress={() => onStatPress?.(key)}
                  style={styles.statItem}
                >
                  <Text style={{
                    fontSize: fontSize.xl,
                    fontWeight: fontWeight.bold,
                    color: colors.foreground,
                  }}>
                    {formatNumber(value!)}
                  </Text>
                  <Text style={{
                    fontSize: fontSize.xs,
                    color: colors.foregroundMuted,
                    marginTop: 2,
                  }}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={[styles.actions, { marginTop: spacing[5], gap: spacing[3] }]}>
            {isOwnProfile ? (
              <Button variant="outline" onPress={onEditProfile} style={{ flex: 1 }}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant={isFollowing ? 'outline' : 'default'}
                  onPress={onFollowPress}
                  style={{ flex: 1 }}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                {onMessagePress && (
                  <Button variant="outline" onPress={onMessagePress} style={{ flex: 1 }}>
                    Message
                  </Button>
                )}
              </>
            )}
          </View>
        </View>

        {/* Tabs - Using Tabs primitive with underline variant */}
        {tabs.length > 0 && (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            style={{ marginTop: spacing[6] }}
          >
            <TabsList variant="underline">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.key} value={tab.key}>
                  <View style={styles.tabTriggerContent}>
                    <Text>{tab.title}</Text>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <Badge size="sm" style={{ marginLeft: spacing[2] }}>
                        {tab.badge}
                      </Badge>
                    )}
                  </View>
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent key={tab.key} value={tab.key}>
                <View style={{ paddingHorizontal: spacing[4] }}>
                  {tab.content}
                </View>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </ScrollView>
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
  },
  profileInfo: {
    alignItems: 'center',
  },
  nameContainer: {
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
  },
  tabTriggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
