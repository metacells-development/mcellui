/**
 * SettingsScreen
 *
 * Complete settings screen with grouped items, switches, navigation rows,
 * and destructive actions. Supports custom sections and footer.
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
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@nativeui/core';

// Import UI primitives
import { Switch } from '../ui/switch';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';

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

function ChevronRightIcon({ size = 20, color = '#999' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
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
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();

  const renderItem = (item: SettingsItem, index: number, total: number) => {
    const isFirst = index === 0;
    const isLast = index === total - 1;

    const itemStyle = [
      styles.item,
      {
        paddingVertical: spacing[4],
        paddingHorizontal: spacing[4],
        backgroundColor: colors.card,
      },
      isFirst && { borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
      isLast && { borderBottomLeftRadius: radius.lg, borderBottomRightRadius: radius.lg },
    ];

    const labelColor =
      item.type === 'destructive' ? colors.destructive : colors.foreground;

    const content = (
      <>
        {/* Icon */}
        {item.icon && <View style={[styles.itemIcon, { marginRight: spacing[3] }]}>{item.icon}</View>}

        {/* Label */}
        <Text
          style={[
            styles.itemLabel,
            { color: labelColor, opacity: item.disabled ? 0.5 : 1 },
          ]}
        >
          {item.label}
        </Text>

        {/* Right Side */}
        <View style={styles.itemRight}>
          {item.type === 'navigation' && (
            <>
              {item.value && (
                <Text style={[styles.itemValue, { color: colors.foregroundMuted, marginRight: spacing[2] }]}>
                  {item.value}
                </Text>
              )}
              <ChevronRightIcon color={colors.foregroundMuted} />
            </>
          )}
          {item.type === 'toggle' && (
            <Switch
              checked={item.value}
              onCheckedChange={item.disabled ? undefined : item.onToggle}
              disabled={item.disabled}
            />
          )}
          {item.type === 'custom' && item.rightElement}
        </View>
      </>
    );

    if (item.type === 'toggle') {
      return (
        <View key={index}>
          <View style={itemStyle}>{content}</View>
          {!isLast && <Separator style={{ marginLeft: item.icon ? 52 : spacing[4] }} />}
        </View>
      );
    }

    return (
      <View key={index}>
        <Pressable
          style={({ pressed }) => [itemStyle, pressed && { opacity: 0.7 }]}
          onPress={item.disabled ? undefined : item.onPress}
          disabled={item.disabled}
        >
          {content}
        </Pressable>
        {!isLast && <Separator style={{ marginLeft: item.icon ? 52 : spacing[4] }} />}
      </View>
    );
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
          <Pressable onPress={onBackPress} style={styles.backButton}>
            <BackIcon color={colors.foreground} />
          </Pressable>
        ) : (
          <View style={{ width: 40 }} />
        )}
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{title}</Text>
        <View style={{ width: 40 }}>{headerRight}</View>
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

            {/* Items */}
            <View style={[styles.sectionItems, { borderRadius: radius.lg, overflow: 'hidden' }]}>
              {section.items.map((item, index) =>
                renderItem(item, index, section.items.length)
              )}
            </View>

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
  backButton: {
    padding: 8,
    marginLeft: -8,
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
  sectionItems: {},
  sectionFooter: {
    fontSize: 13,
    lineHeight: 18,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {},
  itemLabel: {
    flex: 1,
    fontSize: 16,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    fontSize: 15,
  },
  footer: {
    alignItems: 'center',
  },
});
