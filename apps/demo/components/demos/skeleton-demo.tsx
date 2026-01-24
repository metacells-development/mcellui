import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { useTheme } from '@metacells/mcellui-core';
import { Section } from './section';

export function SkeletonDemo() {
  const { colors, radius } = useTheme();

  return (
    <View style={styles.container}>
      <Section title="Basic Shapes">
        <View style={styles.shapes}>
          <Skeleton width={100} height={20} />
          <Skeleton width={150} height={20} />
          <Skeleton width="100%" height={20} />
        </View>
      </Section>

      <Section title="Radius Variants">
        <View style={styles.shapes}>
          <Skeleton width={80} height={32} radius="none" />
          <Skeleton width={80} height={32} radius="sm" />
          <Skeleton width={80} height={32} radius="md" />
          <Skeleton width={80} height={32} radius="lg" />
          <Skeleton width={80} height={32} radius="full" />
        </View>
      </Section>

      <Section title="Circles">
        <View style={styles.row}>
          <Skeleton circle size={32} />
          <Skeleton circle size={48} />
          <Skeleton circle size={64} />
        </View>
      </Section>

      <Section title="Text Lines">
        <SkeletonText lines={3} />
      </Section>

      <Section title="Card Example">
        <View style={[styles.card, { backgroundColor: colors.card, borderRadius: radius.lg }]}>
          <View style={styles.cardHeader}>
            <Skeleton circle size={48} />
            <View style={styles.cardHeaderText}>
              <Skeleton width={120} height={16} />
              <Skeleton width={80} height={12} style={{ marginTop: 8 }} />
            </View>
          </View>
          <Skeleton width="100%" height={160} radius="md" style={{ marginTop: 16 }} />
          <SkeletonText lines={2} style={{ marginTop: 16 }} />
        </View>
      </Section>

      <Section title="List Example">
        <View style={styles.list}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.listItem}>
              <Skeleton circle size={40} />
              <View style={styles.listContent}>
                <Skeleton width="70%" height={14} />
                <Skeleton width="50%" height={12} style={{ marginTop: 6 }} />
              </View>
            </View>
          ))}
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  shapes: { gap: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  card: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  list: {
    gap: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContent: {
    flex: 1,
    marginLeft: 12,
  },
});
