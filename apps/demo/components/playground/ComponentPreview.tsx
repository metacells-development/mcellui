/**
 * ComponentPreview
 *
 * A mini preview of components for the theme playground grid.
 * Shows Button, Input, Badge, and Card in a compact layout.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

export function ComponentPreview() {
  const { colors, radius, spacing, componentRadius } = useTheme();

  return (
    <View style={styles.container}>
      {/* Mini Button */}
      <View
        style={[
          styles.miniButton,
          {
            backgroundColor: colors.primary,
            borderRadius: componentRadius.buttonSm,
          },
        ]}
      >
        <Text style={[styles.miniButtonText, { color: colors.primaryForeground }]}>
          Button
        </Text>
      </View>

      {/* Mini Input */}
      <View
        style={[
          styles.miniInput,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderRadius: componentRadius.input,
          },
        ]}
      >
        <Text style={[styles.miniInputText, { color: colors.foregroundMuted }]}>
          Input...
        </Text>
      </View>

      {/* Mini Badge */}
      <View
        style={[
          styles.miniBadge,
          {
            backgroundColor: colors.secondary,
            borderRadius: radius.full,
          },
        ]}
      >
        <Text style={[styles.miniBadgeText, { color: colors.secondaryForeground }]}>
          Tag
        </Text>
      </View>
    </View>
  );
}

// Mini preview uses intentionally tiny design sizes (6-8px) for compact display
// These are not UI chrome and should not use typography tokens
const styles = StyleSheet.create({
  container: {
    gap: 6,
    padding: 4,
  },
  miniButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  miniButtonText: {
    fontSize: 8,
    fontWeight: '600',
  },
  miniInput: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
  },
  miniInputText: {
    fontSize: 7,
  },
  miniBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  miniBadgeText: {
    fontSize: 6,
    fontWeight: '600',
  },
});
