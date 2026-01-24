/**
 * ThemeGrid
 *
 * A grid displaying all theme/radius combinations (8 themes x 5 radii = 40 cells).
 * Allows visual comparison of all theme configurations.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ThemePreset, RadiusPreset } from '@metacells/mcellui-core';
import { ThemeCell } from './ThemeCell';

const THEMES: ThemePreset[] = ['zinc', 'slate', 'stone', 'blue', 'green', 'rose', 'orange', 'violet'];
const RADII: RadiusPreset[] = ['none', 'sm', 'md', 'lg', 'full'];

interface ThemeGridProps {
  selectedTheme?: ThemePreset;
  selectedRadius?: RadiusPreset;
  onSelect?: (theme: ThemePreset, radius: RadiusPreset) => void;
  isDark?: boolean;
}

export function ThemeGrid({ selectedTheme, selectedRadius, onSelect, isDark }: ThemeGridProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <View>
        {/* Header row with radius labels */}
        <View style={styles.headerRow}>
          <View style={styles.cornerCell} />
          {RADII.map((radius) => (
            <View key={radius} style={styles.headerCell}>
              <Text style={styles.headerText}>{radius.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        {/* Grid rows */}
        {THEMES.map((theme) => (
          <View key={theme} style={styles.row}>
            {/* Row header with theme label */}
            <View style={styles.rowHeader}>
              <Text style={styles.rowHeaderText}>{theme}</Text>
            </View>

            {/* Cells */}
            {RADII.map((radius) => (
              <View key={`${theme}-${radius}`} style={styles.cellWrapper}>
                <ThemeCell
                  theme={theme}
                  radius={radius}
                  isSelected={selectedTheme === theme && selectedRadius === radius}
                  onPress={() => onSelect?.(theme, radius)}
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
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 8,
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
    fontSize: 10,
    fontWeight: '600',
    color: '#71717a',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  rowHeader: {
    width: 60,
    justifyContent: 'center',
    paddingRight: 8,
  },
  rowHeaderText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#71717a',
    textTransform: 'capitalize',
    textAlign: 'right',
  },
  cellWrapper: {
    marginHorizontal: 4,
  },
});
