/**
 * SettingsListBlock
 *
 * Grouped settings list with switches and navigation items.
 * Perfect for app settings screens.
 *
 * @example
 * ```tsx
 * <SettingsListBlock
 *   groups={[
 *     {
 *       title: 'Notifications',
 *       items: [
 *         {
 *           type: 'switch',
 *           label: 'Push Notifications',
 *           value: pushEnabled,
 *           onValueChange: setPushEnabled,
 *         },
 *         {
 *           type: 'navigation',
 *           label: 'Email Preferences',
 *           onPress: () => navigation.navigate('EmailPrefs'),
 *         },
 *       ],
 *     },
 *   ]}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@nativeui/core';

// Import your components
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';

// ============================================================================
// Types
// ============================================================================

interface SettingsItemBase {
  /** Item label */
  label: string;
  /** Optional description */
  description?: string;
  /** Disabled state */
  disabled?: boolean;
}

interface SettingsSwitchItem extends SettingsItemBase {
  type: 'switch';
  /** Current value */
  value: boolean;
  /** Called when value changes */
  onValueChange: (value: boolean) => void;
}

interface SettingsNavigationItem extends SettingsItemBase {
  type: 'navigation';
  /** Value to display (e.g., current selection) */
  displayValue?: string;
  /** Called when item is pressed */
  onPress: () => void;
}

interface SettingsButtonItem extends SettingsItemBase {
  type: 'button';
  /** Button variant */
  variant?: 'default' | 'destructive';
  /** Called when item is pressed */
  onPress: () => void;
}

export type SettingsItem =
  | SettingsSwitchItem
  | SettingsNavigationItem
  | SettingsButtonItem;

export interface SettingsGroup {
  /** Group title */
  title?: string;
  /** Group description */
  description?: string;
  /** Items in this group */
  items: SettingsItem[];
}

export interface SettingsListBlockProps {
  /** Settings groups */
  groups: SettingsGroup[];
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function SettingsListBlock({ groups, style }: SettingsListBlockProps) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {groups.map((group, groupIndex) => (
        <View
          key={groupIndex}
          style={[styles.group, { marginBottom: spacing[6] }]}
        >
          {/* Group Header */}
          {(group.title || group.description) && (
            <View style={[styles.groupHeader, { paddingHorizontal: spacing[4] }]}>
              {group.title && (
                <Text
                  style={[
                    styles.groupTitle,
                    { color: colors.foregroundMuted, marginBottom: spacing[1] },
                  ]}
                >
                  {group.title.toUpperCase()}
                </Text>
              )}
              {group.description && (
                <Text
                  style={[
                    styles.groupDescription,
                    { color: colors.foregroundMuted },
                  ]}
                >
                  {group.description}
                </Text>
              )}
            </View>
          )}

          {/* Group Items */}
          <View
            style={[
              styles.groupContent,
              {
                backgroundColor: colors.card,
                borderRadius: radius.lg,
                marginTop: group.title || group.description ? spacing[2] : 0,
              },
            ]}
          >
            {group.items.map((item, itemIndex) => (
              <React.Fragment key={itemIndex}>
                <SettingsItemComponent item={item} />
                {itemIndex < group.items.length - 1 && (
                  <Separator style={{ marginLeft: spacing[4] }} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

// ============================================================================
// Settings Item Component
// ============================================================================

function SettingsItemComponent({ item }: { item: SettingsItem }) {
  const { colors, spacing } = useTheme();

  const isDestructive =
    item.type === 'button' && item.variant === 'destructive';

  const content = (
    <View
      style={[
        styles.item,
        {
          paddingVertical: spacing[3.5],
          paddingHorizontal: spacing[4],
          opacity: item.disabled ? 0.5 : 1,
        },
      ]}
    >
      <View style={styles.itemContent}>
        <Text
          style={[
            styles.itemLabel,
            {
              color: isDestructive ? colors.destructive : colors.foreground,
            },
          ]}
        >
          {item.label}
        </Text>
        {item.description && (
          <Text
            style={[
              styles.itemDescription,
              { color: colors.foregroundMuted, marginTop: spacing[0.5] },
            ]}
          >
            {item.description}
          </Text>
        )}
      </View>

      {/* Right side content */}
      {item.type === 'switch' && (
        <Switch
          checked={item.value}
          onCheckedChange={item.onValueChange}
          disabled={item.disabled}
        />
      )}

      {item.type === 'navigation' && (
        <View style={styles.navigationRight}>
          {item.displayValue && (
            <Text
              style={[
                styles.displayValue,
                { color: colors.foregroundMuted, marginRight: spacing[2] },
              ]}
            >
              {item.displayValue}
            </Text>
          )}
          <Text style={[styles.chevron, { color: colors.foregroundMuted }]}>
            {'>'}
          </Text>
        </View>
      )}
    </View>
  );

  if (item.type === 'switch') {
    return content;
  }

  return (
    <Pressable
      onPress={(item as SettingsNavigationItem | SettingsButtonItem).onPress}
      disabled={item.disabled}
      style={({ pressed }) => [
        pressed && { backgroundColor: colors.backgroundMuted },
      ]}
    >
      {content}
    </Pressable>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  group: {},
  groupHeader: {},
  groupTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  groupDescription: {
    fontSize: 13,
  },
  groupContent: {
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
  },
  itemDescription: {
    fontSize: 13,
  },
  navigationRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayValue: {
    fontSize: 15,
  },
  chevron: {
    fontSize: 16,
    fontWeight: '600',
  },
});
