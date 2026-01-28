/**
 * ThemeGrid
 *
 * A grid displaying all theme/radius combinations (8 themes x 5 radii = 40 cells).
 * Allows visual comparison of all theme configurations.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ThemePreset, RadiusPreset, useTheme } from '@metacells/mcellui-core';
import { ThemeCell } from './ThemeCell';

type ThemeResult = ReturnType<typeof useTheme>;

function getDynamicStyles(theme: ThemeResult) {
  const { fontSize, fontWeight, spacing, colors } = theme;
  return {
    content: { padding: spacing[4] },
    headerRow: { marginBottom: spacing[2] },
    headerText: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: colors.foregroundSubtle },
    row: { marginBottom: spacing[2] },
    rowHeaderText: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: colors.foregroundSubtle },
  };
}

const THEMES: ThemePreset[] = ['zinc', 'slate', 'stone', 'blue', 'green', 'rose', 'orange', 'violet'];
const RADII: RadiusPreset[] = ['none', 'sm', 'md', 'lg', 'full'];

interface ThemeGridProps {
  selectedTheme?: ThemePreset;
  selectedRadius?: RadiusPreset;
  onSelect?: (theme: ThemePreset, radius: RadiusPreset) => void;
  isDark?: boolean;
}

export function ThemeGrid({ selectedTheme, selectedRadius, onSelect, isDark }: ThemeGridProps) {
  const theme = useTheme();
  const dynamicStyles = getDynamicStyles(theme);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, dynamicStyles.content]}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <View>
        {/* Header row with radius labels */}
        <View style={[styles.headerRow, dynamicStyles.headerRow]}>
          <View style={styles.cornerCell} />
          {RADII.map((radius) => (
            <View key={radius} style={styles.headerCell}>
              <Text style={[styles.headerText, dynamicStyles.headerText]}>{radius.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        {/* Grid rows */}
        {THEMES.map((themePreset) => (
          <View key={themePreset} style={[styles.row, dynamicStyles.row]}>
            {/* Row header with theme label */}
            <View style={styles.rowHeader}>
              <Text style={[styles.rowHeaderText, dynamicStyles.rowHeaderText]}>{themePreset}</Text>
            </View>

            {/* Cells */}
            {RADII.map((radius) => (
              <View key={`${themePreset}-${radius}`} style={styles.cellWrapper}>
                <ThemeCell
                  theme={themePreset}
                  radius={radius}
                  isSelected={selectedTheme === themePreset && selectedRadius === radius}
                  onPress={() => onSelect?.(themePreset, radius)}
                  isDark={isDark}
                />
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {},
  headerRow: {
    flexDirection: 'row',
  },
  cornerCell: {
    width: 60,
  },
  headerCell: {
    width: 96,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  headerText: {
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
  },
  rowHeader: {
    width: 60,
    justifyContent: 'center',
    paddingRight: 8,
  },
  rowHeaderText: {
    textTransform: 'capitalize',
    textAlign: 'right',
  },
  cellWrapper: {
    marginHorizontal: 4,
  },
});
