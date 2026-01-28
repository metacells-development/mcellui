/**
 * FollowersScreen
 *
 * Follower/following list screen with search, tabs, and user management.
 * Perfect for social apps showing user connections.
 *
 * @example
 * ```tsx
 * <FollowersScreen
 *   users={followersList}
 *   activeTab="followers"
 *   onTabChange={(tab) => setActiveTab(tab)}
 *   onFollow={(userId) => handleFollow(userId)}
 *   onUserPress={(userId) => navigateToProfile(userId)}
 * />
 * ```
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';

// Import UI primitives
import { IconButton } from '../ui/icon-button';
import { SearchInput } from '../ui/search-input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Spinner } from '../ui/spinner';

// Import blocks
import { UserListItem, UserListItemUser } from '../blocks/user-list-item-block';
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

function UsersIcon({ size = 48, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={1.5}>
      <Path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export type FollowerTab = 'followers' | 'following';

export interface FollowersScreenUser extends UserListItemUser {
  /** Whether the current user follows this user */
  isFollowing?: boolean;
  /** Whether this user follows the current user */
  followsYou?: boolean;
}

export interface FollowersScreenProps {
  /** Profile owner name (for title) */
  username?: string;
  /** List of followers */
  followers: FollowersScreenUser[];
  /** List of following */
  following: FollowersScreenUser[];
  /** Active tab */
  activeTab?: FollowerTab;
  /** Whether data is loading */
  loading?: boolean;
  /** Whether the current user can manage follows */
  canManage?: boolean;
  /** Called when back is pressed */
  onBack?: () => void;
  /** Called when tab changes */
  onTabChange?: (tab: FollowerTab) => void;
  /** Called when search query changes */
  onSearch?: (query: string) => void;
  /** Called when follow/unfollow is pressed */
  onFollowToggle?: (userId: string, isFollowing: boolean) => void;
  /** Called when user is pressed */
  onUserPress?: (userId: string) => void;
  /** Called when remove follower is pressed */
  onRemoveFollower?: (userId: string) => void;
}

// ============================================================================
// Component
// ============================================================================

export function FollowersScreen({
  username,
  followers,
  following,
  activeTab = 'followers',
  loading = false,
  canManage = true,
  onBack,
  onTabChange,
  onSearch,
  onFollowToggle,
  onUserPress,
  onRemoveFollower,
}: FollowersScreenProps) {
  const { colors, spacing, fontSize, fontWeight } = useTheme();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users based on search
  const filteredFollowers = useMemo(() => {
    if (!searchQuery.trim()) return followers;
    const query = searchQuery.toLowerCase();
    return followers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.username?.toLowerCase().includes(query)
    );
  }, [followers, searchQuery]);

  const filteredFollowing = useMemo(() => {
    if (!searchQuery.trim()) return following;
    const query = searchQuery.toLowerCase();
    return following.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.username?.toLowerCase().includes(query)
    );
  }, [following, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleTabChange = (tab: string) => {
    onTabChange?.(tab as FollowerTab);
  };

  const renderUserItem: ListRenderItem<FollowersScreenUser> = ({ item }) => {
    const isFollowersTab = activeTab === 'followers';

    // Determine action based on tab and relationship
    let actionLabel: string | undefined;
    let actionVariant: 'default' | 'outline' | 'secondary' = 'default';

    if (canManage) {
      if (isFollowersTab) {
        // In followers tab, show Follow/Following button
        if (item.isFollowing) {
          actionLabel = 'Following';
          actionVariant = 'outline';
        } else {
          actionLabel = 'Follow';
          actionVariant = 'default';
        }
      } else {
        // In following tab, show Following button
        actionLabel = 'Following';
        actionVariant = 'outline';
      }
    }

    return (
      <UserListItem
        user={item}
        subtitle={item.followsYou && !isFollowersTab ? 'Follows you' : item.subtitle}
        actionLabel={actionLabel}
        actionVariant={actionVariant}
        onPress={() => onUserPress?.(item.id)}
        onActionPress={() => onFollowToggle?.(item.id, item.isFollowing ?? false)}
        showMenu={canManage && isFollowersTab}
        menuItems={
          isFollowersTab && onRemoveFollower
            ? [
                {
                  label: 'Remove follower',
                  destructive: true,
                  onPress: () => onRemoveFollower(item.id),
                },
              ]
            : undefined
        }
      />
    );
  };

  const renderEmptyState = (type: 'followers' | 'following') => {
    const isSearching = searchQuery.trim().length > 0;

    if (isSearching) {
      return (
        <EmptyStateBlock
          icon={<UsersIcon size={64} color={colors.foregroundMuted} />}
          title="No results found"
          description={`No ${type} match "${searchQuery}"`}
        />
      );
    }

    return (
      <EmptyStateBlock
        icon={<UsersIcon size={64} color={colors.foregroundMuted} />}
        title={type === 'followers' ? 'No followers yet' : 'Not following anyone'}
        description={
          type === 'followers'
            ? 'When people follow this account, they\'ll appear here.'
            : 'When this account follows people, they\'ll appear here.'
        }
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: colors.border }]}>
        <View style={[styles.headerContent, { paddingHorizontal: spacing[4], paddingVertical: spacing[3] }]}>
          {onBack && <IconButton icon={<ChevronLeftIcon />} variant="ghost" onPress={onBack} />}
          <Text style={[styles.headerTitle, { color: colors.foreground, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }]}>
            {username || 'Connections'}
          </Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
        <SearchInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList style={{ marginHorizontal: spacing[4] }}>
          <TabsTrigger value="followers">
            Followers ({followers.length})
          </TabsTrigger>
          <TabsTrigger value="following">
            Following ({following.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="followers" style={styles.tabContent}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Spinner size="lg" />
            </View>
          ) : filteredFollowers.length === 0 ? (
            <View style={styles.emptyContainer}>
              {renderEmptyState('followers')}
            </View>
          ) : (
            <FlatList
              data={filteredFollowers}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: insets.bottom }}
            />
          )}
        </TabsContent>

        <TabsContent value="following" style={styles.tabContent}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Spinner size="lg" />
            </View>
          ) : filteredFollowing.length === 0 ? (
            <View style={styles.emptyContainer}>
              {renderEmptyState('following')}
            </View>
          ) : (
            <FlatList
              data={filteredFollowing}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: insets.bottom }}
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
  headerTitle: {},
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
