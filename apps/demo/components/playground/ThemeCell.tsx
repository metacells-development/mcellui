/**
 * ThemeCell
 *
 * Individual cell in the theme playground grid.
 * Renders an isolated ConfigProvider with specific theme/radius settings.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ConfigProvider, ThemePreset, RadiusPreset, useTheme } from '@metacells/mcellui-core';
import { ComponentPreview } from './ComponentPreview';

interface ThemeCellProps {
  theme: ThemePreset;
  radius: RadiusPreset;
  isSelected?: boolean;
  onPress?: () => void;
  isDark?: boolean;
}

function CellContent({ theme, radius }: { theme: ThemePreset; radius: RadiusPreset }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.cellContent, { backgroundColor: colors.background }]}>
      <ComponentPreview />
      <View style={styles.labelContainer}>
        <Text style={[styles.themeLabel, { color: colors.foregroundMuted }]}>
          {theme}
        </Text>
        <Text style={[styles.radiusLabel, { color: colors.foregroundMuted }]}>
          {radius}
        </Text>
      </View>
    </View>
  );
}

export function ThemeCell({ theme, radius, isSelected, onPress, isDark }: ThemeCellProps) {
  return (
    <Pressable
      style={[
        styles.cell,
        isSelected && styles.cellSelected,
      ]}
      onPress={onPress}
    >
      <ConfigProvider
        theme={theme}
        radius={radius}
        colorScheme={isDark ? 'dark' : 'light'}
      >
        <CellContent theme={theme} radius={radius} />
      </ConfigProvider>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cellSelected: {
    borderColor: '#3b82f6',
  },
  cellContent: {
    padding: 8,
    minWidth: 90,
    minHeight: 100,
  },
  labelContainer: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeLabel: {
    fontSize: 7,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  radiusLabel: {
    fontSize: 6,
    fontWeight: '500',
  },
});
