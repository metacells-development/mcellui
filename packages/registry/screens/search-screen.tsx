/**
 * SearchScreen
 *
 * A complete search screen with filters, recent searches, trending topics,
 * categories, and search results. Perfect for content discovery.
 *
 * @example
 * ```tsx
 * <SearchScreen
 *   placeholder="Search photos, videos..."
 *   filters={[
 *     { key: 'all', label: 'All' },
 *     { key: 'photos', label: 'Photos' },
 *     { key: 'videos', label: 'Videos' },
 *   ]}
 *   trending={[
 *     { id: '1', tag: 'Summer', count: '12K' },
 *   ]}
 *   categories={[
 *     { label: 'Nature', icon: '🌿' },
 *   ]}
 *   onSearch={(query) => fetchResults(query)}
 *   onResultPress={(result) => navigation.navigate('Detail', { id: result.id })}
 * />
 * ```
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';

import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Chip } from '../ui/chip';
import { IconButton } from '../ui/icon-button';
import { SearchInput } from '../ui/search-input';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';

// ============================================================================
// Types
// ============================================================================

export interface SearchFilter {
  key: string;
  label: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
}

export interface TrendingItem {
  id: string;
  tag: string;
  count: string;
}

export interface CategoryItem {
  label: string;
  icon: string;
}

export interface SearchResult {
  id: string;
  title: string;
  type: string;
  user: string;
  avatar?: string;
}

export interface SearchScreenProps {
  /** Search input placeholder */
  placeholder?: string;
  /** Filter options */
  filters?: SearchFilter[];
  /** Initial recent searches */
  initialRecentSearches?: string[];
  /** Trending items */
  trending?: TrendingItem[];
  /** Category items */
  categories?: CategoryItem[];
  /** Called when search query changes */
  onSearch?: (query: string) => void;
  /** Called when search is submitted */
  onSubmit?: (query: string) => void;
  /** Search results to display */
  results?: SearchResult[];
  /** Called when a result is pressed */
  onResultPress?: (result: SearchResult) => void;
  /** Called when filter changes */
  onFilterChange?: (filter: string) => void;
  /** Called when cancel is pressed */
  onCancel?: () => void;
  /** Called when a category is pressed */
  onCategoryPress?: (category: string) => void;
  /** Called when a trending item is pressed */
  onTrendingPress?: (tag: string) => void;
  /** Show loading state */
  loading?: boolean;
  /** Auto focus search input */
  autoFocus?: boolean;
  /** Show cancel button */
  showCancel?: boolean;
}

// ============================================================================
// Icons
// ============================================================================

function SearchIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="11" cy="11" r="8" />
      <Path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </Svg>
  );
}

function ClockIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 6v6l4 2" strokeLinecap="round" />
    </Svg>
  );
}

function TrendingIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M23 6l-9.5 9.5-5-5L1 18" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17 6h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CloseIcon({ size = 16, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </Svg>
  );
}

function ImageIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <Circle cx="8.5" cy="8.5" r="1.5" />
      <Path d="M21 15l-5-5L5 21" />
    </Svg>
  );
}

function VideoIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Rect x="2" y="4" width="20" height="16" rx="2" />
      <Path d="M10 9l5 3-5 3V9z" fill={color} stroke="none" />
    </Svg>
  );
}

function UserIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

function MapPinIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <Circle cx="12" cy="10" r="3" />
    </Svg>
  );
}

// ============================================================================
// Default Data
// ============================================================================

const DEFAULT_FILTERS: SearchFilter[] = [
  { key: 'all', label: 'All' },
  { key: 'photos', label: 'Photos', icon: ImageIcon },
  { key: 'videos', label: 'Videos', icon: VideoIcon },
  { key: 'people', label: 'People', icon: UserIcon },
  { key: 'places', label: 'Places', icon: MapPinIcon },
];

const DEFAULT_TRENDING: TrendingItem[] = [
  { id: '1', tag: 'SummerVibes', count: '12.4K' },
  { id: '2', tag: 'Photography', count: '8.2K' },
  { id: '3', tag: 'FoodPorn', count: '6.1K' },
  { id: '4', tag: 'Travel2024', count: '4.8K' },
];

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { label: 'Nature', icon: '🌿' },
  { label: 'Food', icon: '🍕' },
  { label: 'Travel', icon: '✈️' },
  { label: 'Sports', icon: '⚽' },
  { label: 'Music', icon: '🎵' },
  { label: 'Art', icon: '🎨' },
];

// ============================================================================
// Component
// ============================================================================

export function SearchScreen({
  placeholder = 'Search...',
  filters = DEFAULT_FILTERS,
  initialRecentSearches = [],
  trending = DEFAULT_TRENDING,
  categories = DEFAULT_CATEGORIES,
  onSearch,
  onSubmit,
  results,
  onResultPress,
  onFilterChange,
  onCancel,
  onCategoryPress,
  onTrendingPress,
  loading = false,
  autoFocus = true,
  showCancel = true,
}: SearchScreenProps) {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(filters[0]?.key || 'all');
  const [recentSearches, setRecentSearches] = useState(initialRecentSearches);

  const handleSearch = useCallback(
    (text: string) => {
      setQuery(text);
      onSearch?.(text);
    },
    [onSearch]
  );

  const handleFilterChange = useCallback(
    (filter: string) => {
      setSelectedFilter(filter);
      onFilterChange?.(filter);
    },
    [onFilterChange]
  );

  const handleRecentSearchPress = useCallback(
    (search: string) => {
      setQuery(search);
      onSearch?.(search);
      onSubmit?.(search);
    },
    [onSearch, onSubmit]
  );

  const removeRecentSearch = useCallback((search: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== search));
  }, []);

  const clearAllRecent = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const handleTrendingPress = useCallback(
    (tag: string) => {
      setQuery(tag);
      onSearch?.(tag);
      onTrendingPress?.(tag);
    },
    [onSearch, onTrendingPress]
  );

  const handleCategoryPress = useCallback(
    (category: string) => {
      setQuery(category);
      onSearch?.(category);
      onCategoryPress?.(category);
    },
    [onSearch, onCategoryPress]
  );

  const hasResults = results && results.length > 0;
  const showEmptyState = !loading && query.length === 0;
  const showResults = !loading && query.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + spacing[2], paddingHorizontal: spacing[4] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
          <View style={{ flex: 1 }}>
            <SearchInput
              placeholder={placeholder}
              value={query}
              onChangeText={handleSearch}
              onSubmit={() => onSubmit?.(query)}
              loading={loading}
              autoFocus={autoFocus}
            />
          </View>
          {showCancel && onCancel && (
            <Pressable onPress={onCancel}>
              <Text style={{ color: colors.primary, fontSize: fontSize.base, fontWeight: fontWeight.medium }}>
                Cancel
              </Text>
            </Pressable>
          )}
        </View>

        {/* Filters */}
        {filters.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: spacing[3] }}
            contentContainerStyle={{ gap: spacing[2] }}
          >
            {filters.map((filter) => (
              <Chip
                key={filter.key}
                selected={selectedFilter === filter.key}
                onPress={() => handleFilterChange(filter.key)}
                variant="filled"
                icon={
                  filter.icon ? (
                    <filter.icon
                      size={16}
                      color={
                        selectedFilter === filter.key
                          ? colors.primaryForeground
                          : colors.foreground
                      }
                    />
                  ) : undefined
                }
              >
                {filter.label}
              </Chip>
            ))}
          </ScrollView>
        )}
      </View>

      <Separator style={{ marginTop: spacing[3] }} />

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: spacing[6] }}
        keyboardShouldPersistTaps="handled"
      >
        {loading ? (
          /* Loading State */
          <View style={{ padding: spacing[4], gap: spacing[4] }}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={{ flexDirection: 'row', gap: spacing[3], alignItems: 'center' }}>
                <Skeleton width={56} height={56} radius="full" />
                <View style={{ flex: 1, gap: spacing[2] }}>
                  <Skeleton width="75%" height={16} />
                  <Skeleton width="45%" height={14} />
                </View>
              </View>
            ))}
          </View>
        ) : showResults && hasResults ? (
          /* Results */
          <View style={{ padding: spacing[4], gap: spacing[3] }}>
            <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs, marginBottom: spacing[1] }}>
              {results.length} results for "{query}"
            </Text>
            {results.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => onResultPress?.(item)}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  gap: spacing[3],
                  padding: spacing[3],
                  backgroundColor: pressed ? colors.backgroundMuted : colors.card,
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: 'center',
                })}
              >
                <Avatar fallback={item.avatar || item.user.substring(0, 2).toUpperCase()} size="md" />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ color: colors.foreground, fontSize: fontSize.base, fontWeight: fontWeight.medium }}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing[2],
                      marginTop: 4,
                    }}
                  >
                    <Badge
                      variant={item.type === 'video' ? 'default' : 'secondary'}
                      size="sm"
                    >
                      {item.type}
                    </Badge>
                    <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.sm }}>
                      {item.user}
                    </Text>
                  </View>
                </View>
                <IconButton
                  icon={<SearchIcon size={18} color={colors.foregroundMuted} />}
                  variant="ghost"
                  size="sm"
                  accessibilityLabel="View"
                />
              </Pressable>
            ))}
          </View>
        ) : showResults && !hasResults ? (
          /* No Results */
          <View style={{ alignItems: 'center', paddingTop: spacing[8] }}>
            <SearchIcon size={48} color={colors.foregroundMuted} />
            <Text
              style={{
                color: colors.foregroundMuted,
                marginTop: spacing[3],
                fontSize: fontSize.base,
              }}
            >
              No results for "{query}"
            </Text>
          </View>
        ) : (
          /* Empty State - Recent & Trending */
          <View>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={{ padding: spacing[4], paddingBottom: 0 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: spacing[3],
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                    <ClockIcon size={18} color={colors.foregroundMuted} />
                    <Text style={{ color: colors.foreground, fontSize: fontSize.md, fontWeight: fontWeight.semibold }}>
                      Recent Searches
                    </Text>
                  </View>
                  <Pressable onPress={clearAllRecent}>
                    <Text style={{ color: colors.primary, fontSize: fontSize.sm }}>Clear all</Text>
                  </Pressable>
                </View>
                <View style={{ gap: spacing[1] }}>
                  {recentSearches.map((search) => (
                    <Pressable
                      key={search}
                      onPress={() => handleRecentSearchPress(search)}
                      style={({ pressed }) => ({
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: spacing[3],
                        paddingHorizontal: spacing[2],
                        borderRadius: radius.md,
                        backgroundColor: pressed ? colors.backgroundMuted : 'transparent',
                      })}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                        <SearchIcon size={18} color={colors.foregroundMuted} />
                        <Text style={{ color: colors.foreground, fontSize: fontSize.base }}>{search}</Text>
                      </View>
                      <Pressable
                        onPress={() => removeRecentSearch(search)}
                        hitSlop={8}
                        style={{ padding: spacing[1] }}
                      >
                        <CloseIcon size={16} color={colors.foregroundMuted} />
                      </Pressable>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Trending */}
            {trending.length > 0 && (
              <View style={{ padding: spacing[4] }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing[2],
                    marginBottom: spacing[3],
                  }}
                >
                  <TrendingIcon size={18} color={colors.primary} />
                  <Text style={{ color: colors.foreground, fontSize: fontSize.md, fontWeight: fontWeight.semibold }}>
                    Trending Now
                  </Text>
                </View>
                <View style={{ gap: spacing[2] }}>
                  {trending.map((item, index) => (
                    <Pressable
                      key={item.id}
                      onPress={() => handleTrendingPress(item.tag)}
                      style={({ pressed }) => ({
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: spacing[3],
                        borderRadius: radius.lg,
                        backgroundColor: pressed ? colors.backgroundMuted : colors.card,
                        borderWidth: 1,
                        borderColor: colors.border,
                      })}
                    >
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: radius.md,
                          backgroundColor: colors.primary + '15',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: spacing[3],
                        }}
                      >
                        <Text style={{ color: colors.primary, fontWeight: fontWeight.bold, fontSize: fontSize.sm }}>
                          {index + 1}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.foreground, fontSize: fontSize.base, fontWeight: fontWeight.medium }}>
                          #{item.tag}
                        </Text>
                        <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs, marginTop: 2 }}>
                          {item.count} posts
                        </Text>
                      </View>
                      <Badge variant="outline" size="sm">
                        Trending
                      </Badge>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <View style={{ paddingHorizontal: spacing[4] }}>
                <Text
                  style={{
                    color: colors.foreground,
                    fontSize: fontSize.md,
                    fontWeight: fontWeight.semibold,
                    marginBottom: spacing[3],
                  }}
                >
                  Browse Categories
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
                  {categories.map((cat) => (
                    <Pressable
                      key={cat.label}
                      onPress={() => handleCategoryPress(cat.label)}
                      style={({ pressed }) => ({
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: spacing[2],
                        paddingHorizontal: spacing[4],
                        paddingVertical: spacing[3],
                        borderRadius: radius.full,
                        backgroundColor: pressed ? colors.primary + '20' : colors.secondary,
                      })}
                    >
                      <Text style={{ fontSize: fontSize.md }}>{cat.icon}</Text>
                      <Text style={{ color: colors.foreground, fontSize: fontSize.sm, fontWeight: fontWeight.medium }}>
                        {cat.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
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
});
