/**
 * SearchHeader
 *
 * Header with search input, filter button, and user avatar.
 * Perfect for search screens, product listings, and discovery pages.
 *
 * @example
 * ```tsx
 * <SearchHeader
 *   placeholder="Search products..."
 *   onSearch={(query) => setSearchQuery(query)}
 *   avatarUrl="https://example.com/avatar.jpg"
 *   onAvatarPress={() => navigation.navigate('Profile')}
 *   onFilterPress={() => setShowFilters(true)}
 *   filterCount={3}
 * />
 * ```
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';
import Svg, { Path } from 'react-native-svg';

// Import UI primitives
import { SearchInput } from '@/components/ui/search-input';
import { IconButton } from '@/components/ui/icon-button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// ============================================================================
// Icons
// ============================================================================

function FilterIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 6h16M6 12h12M8 18h8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export interface SearchHeaderProps {
  /** Placeholder text for search input */
  placeholder?: string;
  /** Initial search value */
  value?: string;
  /** Called when search value changes */
  onSearch?: (query: string) => void;
  /** Called when search is submitted */
  onSubmit?: (query: string) => void;
  /** User avatar URL */
  avatarUrl?: string;
  /** Avatar fallback initials */
  avatarFallback?: string;
  /** Called when avatar is pressed */
  onAvatarPress?: () => void;
  /** Called when filter button is pressed */
  onFilterPress?: () => void;
  /** Number of active filters (shows badge) */
  filterCount?: number;
  /** Show filter button */
  showFilter?: boolean;
  /** Show avatar */
  showAvatar?: boolean;
  /** Auto focus search input */
  autoFocus?: boolean;
  /** Show loading state */
  loading?: boolean;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function SearchHeader({
  placeholder = 'Search...',
  value: controlledValue,
  onSearch,
  onSubmit,
  avatarUrl,
  avatarFallback = 'U',
  onAvatarPress,
  onFilterPress,
  filterCount = 0,
  showFilter = true,
  showAvatar = true,
  autoFocus = false,
  loading = false,
  style,
}: SearchHeaderProps) {
  const { colors, spacing } = useTheme();
  const [internalValue, setInternalValue] = useState('');
  const value = controlledValue ?? internalValue;

  const handleChange = useCallback(
    (text: string) => {
      if (controlledValue === undefined) {
        setInternalValue(text);
      }
      onSearch?.(text);
    },
    [controlledValue, onSearch]
  );

  const handleSubmit = useCallback(() => {
    onSubmit?.(value);
  }, [onSubmit, value]);

  return (
    <View style={[styles.container, { gap: spacing[3] }, style]}>
      {/* Search Input */}
      <View style={{ flex: 1 }}>
        <SearchInput
          value={value}
          onChangeText={handleChange}
          onSubmitEditing={handleSubmit}
          placeholder={placeholder}
          autoFocus={autoFocus}
          loading={loading}
          returnKeyType="search"
        />
      </View>

      {/* Filter Button */}
      {showFilter && onFilterPress && (
        <View style={styles.filterWrapper}>
          <IconButton
            icon={<FilterIcon size={20} color={colors.foreground} />}
            variant="secondary"
            size="md"
            onPress={onFilterPress}
            accessibilityLabel="Filter"
          />
          {filterCount > 0 && (
            <View style={styles.badgeWrapper}>
              <Badge variant="default" size="sm">
                {String(filterCount)}
              </Badge>
            </View>
          )}
        </View>
      )}

      {/* Avatar */}
      {showAvatar && (
        <Avatar
          source={avatarUrl ? { uri: avatarUrl } : undefined}
          fallback={avatarFallback}
          size="md"
        />
      )}
    </View>
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
  filterWrapper: {
    position: 'relative',
  },
  badgeWrapper: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
});
