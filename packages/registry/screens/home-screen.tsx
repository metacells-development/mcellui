/**
 * HomeScreen
 *
 * Dashboard/landing screen with hero, stats, and featured content.
 * Perfect for app home pages and dashboards.
 *
 * @example
 * ```tsx
 * <HomeScreen
 *   user={{ name: 'John', avatar: { uri: '...' } }}
 *   stats={[{ label: 'Orders', value: '12' }]}
 *   featuredItems={products}
 *   onSearch={() => navigateToSearch()}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// Import UI primitives
import { Avatar } from '../ui/avatar';
import { IconButton } from '../ui/icon-button';
import { SearchInput } from '../ui/search-input';
import { HorizontalList } from '../ui/horizontal-list';
import { SectionHeader } from '../ui/section-header';

// Import blocks
import { StatsCard } from '../blocks/stats-card-block';
import { HeroBlock } from '../blocks/hero-block';
import { ContentCard } from '../blocks/content-card-block';

// ============================================================================
// Icons
// ============================================================================

function BellIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SettingsIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <SvgCircle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export interface HomeUser {
  id?: string;
  name: string;
  avatar?: ImageSourcePropType;
}

export interface HomeStat {
  label: string;
  value: string;
  trend?: number;
  icon?: React.ReactNode;
}

export interface FeaturedItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: ImageSourcePropType;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}

export interface HomeScreenProps {
  /** Current user */
  user?: HomeUser;
  /** Greeting text (default: "Welcome back") */
  greeting?: string;
  /** Statistics cards */
  stats?: HomeStat[];
  /** Hero/banner content */
  hero?: {
    title: string;
    subtitle?: string;
    image?: ImageSourcePropType;
    actionLabel?: string;
    onAction?: () => void;
  };
  /** Featured items list */
  featuredItems?: FeaturedItem[];
  /** Quick action buttons */
  quickActions?: QuickAction[];
  /** Whether search is enabled */
  showSearch?: boolean;
  /** Notification count */
  notificationCount?: number;
  /** Called when search is pressed */
  onSearch?: () => void;
  /** Called when notifications is pressed */
  onNotifications?: () => void;
  /** Called when settings is pressed */
  onSettings?: () => void;
  /** Called when featured item is pressed */
  onFeaturedItemPress?: (itemId: string) => void;
  /** Called when "See all" is pressed */
  onSeeAllFeatured?: () => void;
  /** Called when stat is pressed */
  onStatPress?: (index: number) => void;
}

// ============================================================================
// Component
// ============================================================================

export function HomeScreen({
  user,
  greeting = 'Welcome back',
  stats,
  hero,
  featuredItems,
  quickActions,
  showSearch = true,
  notificationCount,
  onSearch,
  onNotifications,
  onSettings,
  onFeaturedItemPress,
  onSeeAllFeatured,
  onStatPress,
}: HomeScreenProps) {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();
  const insets = useSafeAreaInsets();

  const handleNotifications = () => {
    haptic('light');
    onNotifications?.();
  };

  const handleSettings = () => {
    haptic('light');
    onSettings?.();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing[4] }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + spacing[2], paddingHorizontal: spacing[4] }]}>
          <View style={styles.headerLeft}>
            {user && (
              <Avatar
                source={user.avatar}
                fallback={user.name.charAt(0)}
                size="md"
              />
            )}
            <View style={{ marginLeft: spacing[3] }}>
              <Text style={[styles.greeting, { color: colors.foregroundMuted, fontSize: fontSize.xs }]}>
                {greeting}
              </Text>
              <Text style={[styles.userName, { color: colors.foreground, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }]}>
                {user?.name ?? 'Guest'}
              </Text>
            </View>
          </View>

          <View style={[styles.headerRight, { gap: spacing[1] }]}>
            {onNotifications && (
              <View>
                <IconButton
                  icon={<BellIcon />}
                  variant="ghost"
                  onPress={handleNotifications}
                />
                {notificationCount && notificationCount > 0 && (
                  <View
                    style={[
                      styles.notificationBadge,
                      { backgroundColor: colors.destructive },
                    ]}
                  >
                    <Text style={[styles.notificationCount, { fontSize: fontSize.xs, fontWeight: fontWeight.bold }]}>
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </Text>
                  </View>
                )}
              </View>
            )}
            {onSettings && (
              <IconButton
                icon={<SettingsIcon />}
                variant="ghost"
                onPress={handleSettings}
              />
            )}
          </View>
        </View>

        {/* Search */}
        {showSearch && (
          <View style={{ paddingHorizontal: spacing[4], marginTop: spacing[4] }}>
            <Pressable onPress={onSearch}>
              <SearchInput
                placeholder="Search..."
                editable={false}
                pointerEvents="none"
              />
            </Pressable>
          </View>
        )}

        {/* Hero */}
        {hero && (
          <View style={{ paddingHorizontal: spacing[4], marginTop: spacing[4] }}>
            <HeroBlock
              title={hero.title}
              subtitle={hero.subtitle}
              imageUrl={hero.image ? undefined : undefined}
              background="gradient"
              meshPreset="ocean"
              ctaText={hero.actionLabel}
              onCtaPress={hero.onAction}
              height={180}
              style={{ borderRadius: radius.xl, overflow: 'hidden' }}
            />
          </View>
        )}

        {/* Stats */}
        {stats && stats.length > 0 && (
          <View style={{ marginTop: spacing[4] }}>
            <HorizontalList contentInset={spacing[4]}>
              {stats.map((stat, index) => (
                <Pressable
                  key={index}
                  onPress={onStatPress ? () => onStatPress(index) : undefined}
                  style={{ width: 150 }}
                >
                  <StatsCard
                    label={stat.label}
                    value={stat.value}
                    trend={stat.trend}
                    icon={stat.icon}
                  />
                </Pressable>
              ))}
            </HorizontalList>
          </View>
        )}

        {/* Quick Actions */}
        {quickActions && quickActions.length > 0 && (
          <View style={{ marginTop: spacing[4] }}>
            <SectionHeader title="Quick Actions" style={{ paddingHorizontal: spacing[4] }} />
            <View
              style={[
                styles.quickActionsGrid,
                { paddingHorizontal: spacing[4], marginTop: spacing[2], gap: spacing[3] },
              ]}
            >
              {quickActions.map((action) => (
                <Pressable
                  key={action.id}
                  onPress={() => {
                    haptic('light');
                    action.onPress();
                  }}
                  style={[
                    styles.quickAction,
                    {
                      backgroundColor: colors.secondary,
                      borderRadius: radius.lg,
                      padding: spacing[4],
                    },
                  ]}
                >
                  <View style={{ marginBottom: spacing[2] }}>
                    {action.icon}
                  </View>
                  <Text style={[styles.quickActionLabel, { color: colors.foreground, fontSize: fontSize.xs, fontWeight: fontWeight.medium }]}>
                    {action.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Featured Items */}
        {featuredItems && featuredItems.length > 0 && (
          <View style={{ marginTop: spacing[4] }}>
            <SectionHeader
              title="Featured"
              action={onSeeAllFeatured ? 'See All' : undefined}
              onAction={onSeeAllFeatured}
              style={{ paddingHorizontal: spacing[4] }}
            />
            <View style={{ marginTop: spacing[2] }}>
              <HorizontalList contentInset={spacing[4]}>
                {featuredItems.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={onFeaturedItemPress ? () => onFeaturedItemPress(item.id) : undefined}
                  >
                    <View
                      style={{
                        width: 140,
                        backgroundColor: colors.card,
                        borderRadius: radius.lg,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    >
                      <View
                        style={{
                          width: '100%',
                          height: 90,
                          backgroundColor: colors.secondary,
                          borderTopLeftRadius: radius.lg,
                          borderTopRightRadius: radius.lg,
                        }}
                      />
                      <View style={{ padding: spacing[3] }}>
                        <Text
                          style={{
                            color: colors.foreground,
                            fontSize: fontSize.xs,
                            fontWeight: fontWeight.semibold,
                          }}
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>
                        {item.subtitle && (
                          <Text
                            style={{
                              color: colors.foregroundMuted,
                              fontSize: fontSize['2xs'],
                              marginTop: 2,
                            }}
                            numberOfLines={1}
                          >
                            {item.subtitle}
                          </Text>
                        )}
                      </View>
                    </View>
                  </Pressable>
                ))}
              </HorizontalList>
            </View>
          </View>
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
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {},
  userName: {},
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationCount: {
    color: '#fff',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quickAction: {
    width: '47%',
    alignItems: 'center',
  },
  quickActionLabel: {
    textAlign: 'center',
  },
});
