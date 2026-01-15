import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@nativeui/core';
import { PullToRefresh, RefreshIndicator } from '../ui/pull-to-refresh';

export function PullToRefreshDemo() {
  const { colors, spacing, radius } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
  ]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setItems((prev) => [`New Item ${Date.now()}`, ...prev.slice(0, 4)]);
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      {/* Main Demo */}
      <Text style={[styles.label, { color: colors.foreground }]}>
        Pull down to refresh
      </Text>
      <View style={[styles.listContainer, { borderColor: colors.border }]}>
        <PullToRefresh refreshing={refreshing} onRefresh={onRefresh}>
          <ScrollView style={styles.scrollView}>
            {items.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.listItem,
                  {
                    backgroundColor: colors.card,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <Text style={{ color: colors.foreground }}>{item}</Text>
              </View>
            ))}
          </ScrollView>
        </PullToRefresh>
      </View>

      {/* Standalone Indicator */}
      <Text style={[styles.label, { color: colors.foreground, marginTop: spacing[6] }]}>
        Standalone Indicator
      </Text>
      <View style={styles.indicatorRow}>
        <View style={styles.indicatorItem}>
          <RefreshIndicator animating={true} size={24} />
          <Text style={[styles.indicatorLabel, { color: colors.foregroundMuted }]}>
            24px
          </Text>
        </View>
        <View style={styles.indicatorItem}>
          <RefreshIndicator animating={true} size={32} />
          <Text style={[styles.indicatorLabel, { color: colors.foregroundMuted }]}>
            32px
          </Text>
        </View>
        <View style={styles.indicatorItem}>
          <RefreshIndicator animating={true} size={48} color={colors.primary} />
          <Text style={[styles.indicatorLabel, { color: colors.foregroundMuted }]}>
            48px
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  listContainer: {
    height: 250,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingVertical: 24,
  },
  indicatorItem: {
    alignItems: 'center',
    gap: 8,
  },
  indicatorLabel: {
    fontSize: 12,
    marginTop: 8,
  },
});
