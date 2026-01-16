/**
 * SettingsScreen
 *
 * Complete settings screen with grouped items, switches, navigation rows,
 * and destructive actions. Uses List, ListItem, Switch, and IconButton primitives.
 *
 * @example
 * ```tsx
 * <SettingsScreen
 *   sections={[
 *     {
 *       title: 'Account',
 *       items: [
 *         { type: 'navigation', label: 'Profile', onPress: () => {} },
 *         { type: 'navigation', label: 'Privacy', value: 'Friends only', onPress: () => {} },
 *       ],
 *     },
 *     {
 *       title: 'Preferences',
 *       items: [
 *         { type: 'toggle', label: 'Notifications', value: true, onToggle: (v) => {} },
 *         { type: 'toggle', label: 'Dark Mode', value: false, onToggle: (v) => {} },
 *       ],
 *     },
 *     {
 *       items: [
 *         { type: 'destructive', label: 'Sign Out', onPress: () => {} },
 *       ],
 *     },
 *   ]}
 *   onBackPress={() => navigation.goBack()}
 *   footer={<Text>Version 1.0.0</Text>}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@nativeui/core';

// Import UI primitives
import { List, ListItem } from '../ui/list';
import { Switch } from '../ui/switch';
import { IconButton } from '../ui/icon-button';

// ============================================================================
// Types
// ============================================================================

export interface SettingsItemBase {
  /** Item label */
  label: string;
  /** Icon element */
  icon?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
}

export interface SettingsNavigationItem extends SettingsItemBase {
  type: 'navigation';
  /** Current value to display */
  value?: string;
  /** Called when item is pressed */
  onPress?: () => void;
}

export interface SettingsToggleItem extends SettingsItemBase {
  type: 'toggle';
  /** Toggle value */
  value: boolean;
  /** Called when toggle changes */
  onToggle?: (value: boolean) => void;
}

export interface SettingsDestructiveItem extends SettingsItemBase {
  type: 'destructive';
  /** Called when item is pressed */
  onPress?: () => void;
}

export interface SettingsCustomItem extends SettingsItemBase {
  type: 'custom';
  /** Custom right element */
  rightElement?: React.ReactNode;
  /** Called when item is pressed */
  onPress?: () => void;
}

export type SettingsItem =
  | SettingsNavigationItem
  | SettingsToggleItem
  | SettingsDestructiveItem
  | SettingsCustomItem;

export interface SettingsSection {
  /** Section title */
  title?: string;
  /** Section footer text */
  footer?: string;
  /** Items in this section */
  items: SettingsItem[];
}

export interface SettingsScreenProps {
  /** Screen title */
  title?: string;
  /** Settings sections */
  sections: SettingsSection[];
  /** Called when back button is pressed */
  onBackPress?: () => void;
  /** Footer content */
  footer?: React.ReactNode;
  /** Header right element */
  headerRight?: React.ReactNode;
}

// ============================================================================
// Icons
// ============================================================================

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

export function SettingsScreen({
  title = 'Settings',
  sections,
  onBackPress,
  footer,
  headerRight,
}: SettingsScreenProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const renderItem = (item: SettingsItem, index: number) => {
    const isDestructive = item.type === 'destructive';

    // Common props for ListItem
    const baseProps = {
      key: index,
      title: item.label,
      left: item.icon,
      disabled: item.disabled,
      titleStyle: isDestructive ? { color: colors.destructive } : undefined,
    };

    switch (item.type) {
      case 'navigation':
        return (
          <ListItem
            {...baseProps}
            subtitle={item.value}
            showChevron
            onPress={item.onPress}
          />
        );

      case 'toggle':
        return (
          <ListItem
            {...baseProps}
            right={
              <Switch
                checked={item.value}
                onCheckedChange={item.disabled ? undefined : item.onToggle}
                disabled={item.disabled}
              />
            }
          />
        );

      case 'destructive':
        return (
          <ListItem
            {...baseProps}
            onPress={item.onPress}
          />
        );

      case 'custom':
        return (
          <ListItem
            {...baseProps}
            right={item.rightElement}
            onPress={item.onPress}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + spacing[2],
            paddingHorizontal: spacing[4],
            paddingBottom: spacing[3],
            borderBottomColor: colors.border,
          },
        ]}
      >
        {onBackPress ? (
          <IconButton
            icon={<BackIcon />}
            variant="ghost"
            size="sm"
            onPress={onBackPress}
            accessibilityLabel="Go back"
          />
        ) : (
          <View style={{ width: 32 }} />
        )}
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{title}</Text>
        <View style={{ width: 32, alignItems: 'flex-end' }}>{headerRight}</View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingHorizontal: spacing[4],
          paddingTop: spacing[4],
          paddingBottom: insets.bottom + spacing[6],
        }}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={[styles.section, { marginBottom: spacing[6] }]}>
            {/* Section Title */}
            {section.title && (
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.foregroundMuted,
                    marginBottom: spacing[2],
                    marginLeft: spacing[2],
                  },
                ]}
              >
                {section.title.toUpperCase()}
              </Text>
            )}

            {/* Items using List primitive */}
            <List
              showDividers
              insetDividers={section.items.some((item) => item.icon)}
            >
              {section.items.map((item, index) => renderItem(item, index))}
            </List>

            {/* Section Footer */}
            {section.footer && (
              <Text
                style={[
                  styles.sectionFooter,
                  {
                    color: colors.foregroundMuted,
                    marginTop: spacing[2],
                    marginLeft: spacing[2],
                  },
                ]}
              >
                {section.footer}
              </Text>
            )}
          </View>
        ))}

        {/* Footer */}
        {footer && <View style={[styles.footer, { marginTop: spacing[4] }]}>{footer}</View>}
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
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {},
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  sectionFooter: {
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
  },
});
