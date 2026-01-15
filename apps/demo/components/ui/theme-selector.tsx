/**
 * ThemeSelector
 *
 * Allows users to switch between theme presets and radius options.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useTheme, ThemePreset, RadiusPreset } from '@nativeui/core';

const themePresets: { key: ThemePreset; label: string; color: string }[] = [
  { key: 'zinc', label: 'Zinc', color: '#71717a' },
  { key: 'slate', label: 'Slate', color: '#64748b' },
  { key: 'stone', label: 'Stone', color: '#78716c' },
  { key: 'blue', label: 'Blue', color: '#3b82f6' },
  { key: 'green', label: 'Green', color: '#22c55e' },
  { key: 'rose', label: 'Rose', color: '#f43f5e' },
  { key: 'orange', label: 'Orange', color: '#f97316' },
  { key: 'violet', label: 'Violet', color: '#8b5cf6' },
];

const radiusPresets: { key: RadiusPreset; label: string }[] = [
  { key: 'none', label: 'None' },
  { key: 'sm', label: 'Small' },
  { key: 'md', label: 'Medium' },
  { key: 'lg', label: 'Large' },
  { key: 'full', label: 'Full' },
];

interface ThemeSelectorProps {
  currentTheme: ThemePreset;
  currentRadius: RadiusPreset;
  onThemeChange: (theme: ThemePreset) => void;
  onRadiusChange: (radius: RadiusPreset) => void;
}

export function ThemeSelector({
  currentTheme,
  currentRadius,
  onThemeChange,
  onRadiusChange,
}: ThemeSelectorProps) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View style={styles.container}>
      {/* Theme Presets */}
      <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: spacing[2] }]}>
        Theme
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.presetRow, { gap: spacing[2] }]}
      >
        {themePresets.map((preset) => (
          <Pressable
            key={preset.key}
            onPress={() => onThemeChange(preset.key)}
            style={[
              styles.themeButton,
              {
                backgroundColor: currentTheme === preset.key ? colors.primary : colors.card,
                borderColor: currentTheme === preset.key ? colors.primary : colors.border,
                borderRadius: radius.md,
                paddingVertical: spacing[2],
                paddingHorizontal: spacing[3],
              },
            ]}
          >
            <View
              style={[
                styles.colorDot,
                { backgroundColor: preset.color, marginRight: spacing[2] },
              ]}
            />
            <Text
              style={[
                styles.buttonText,
                {
                  color: currentTheme === preset.key ? colors.primaryForeground : colors.foreground,
                },
              ]}
            >
              {preset.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Radius Presets */}
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.foreground, marginTop: spacing[4], marginBottom: spacing[2] },
        ]}
      >
        Radius
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.presetRow, { gap: spacing[2] }]}
      >
        {radiusPresets.map((preset) => (
          <Pressable
            key={preset.key}
            onPress={() => onRadiusChange(preset.key)}
            style={[
              styles.radiusButton,
              {
                backgroundColor: currentRadius === preset.key ? colors.primary : colors.card,
                borderColor: currentRadius === preset.key ? colors.primary : colors.border,
                borderRadius: radius.md,
                paddingVertical: spacing[2],
                paddingHorizontal: spacing[3],
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: currentRadius === preset.key ? colors.primaryForeground : colors.foreground,
                },
              ]}
            >
              {preset.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presetRow: {
    flexDirection: 'row',
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  radiusButton: {
    borderWidth: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
