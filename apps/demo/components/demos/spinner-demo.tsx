import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spinner } from '@/components/ui/spinner';
import { useTheme } from '@metacells/mcellui-core';
import { Section } from './section';

export function SpinnerDemo() {
  const { colors, radius, fontSize } = useTheme();

  return (
    <View style={styles.container}>
      <Section title="Sizes">
        <View style={styles.row}>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </View>
      </Section>

      <Section title="Colors">
        <View style={styles.row}>
          <Spinner color="default" />
          <Spinner color="primary" />
          <Spinner color="secondary" />
          <Spinner color="muted" />
        </View>
      </Section>

      <Section title="Large with Colors">
        <View style={styles.row}>
          <Spinner size="lg" color="default" />
          <Spinner size="lg" color="primary" />
          <Spinner size="lg" color="muted" />
        </View>
      </Section>

      <Section title="Use Cases">
        <View style={styles.useCases}>
          {/* Button loading state */}
          <View style={styles.useCase}>
            <View style={[styles.loadingButton, { backgroundColor: colors.primary, borderRadius: radius.md }]}>
              <Spinner size="sm" color="default" style={{ marginRight: 8 }} />
              <Text style={{ color: colors.primaryForeground, fontWeight: '500' }}>Loading...</Text>
            </View>
            <Text style={{ fontSize: fontSize.xs, color: colors.foregroundMuted }}>Button loading</Text>
          </View>

          {/* Inline loading */}
          <View style={styles.useCase}>
            <View style={styles.inlineRow}>
              <Text style={{ color: colors.foreground }}>Saving changes</Text>
              <Spinner size="sm" color="primary" />
            </View>
            <Text style={{ fontSize: fontSize.xs, color: colors.foregroundMuted }}>Inline indicator</Text>
          </View>

          {/* Full screen loading placeholder */}
          <View style={styles.useCase}>
            <View style={[styles.loadingCard, { backgroundColor: colors.card, borderRadius: radius.lg }]}>
              <Spinner size="lg" color="muted" />
              <Text style={{ fontSize: fontSize.xs, color: colors.foregroundMuted }}>Loading content...</Text>
            </View>
            <Text style={{ fontSize: fontSize.xs, color: colors.foregroundMuted }}>Card loading</Text>
          </View>
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  useCases: {
    gap: 20,
  },
  useCase: {
    alignItems: 'center',
    gap: 8,
  },
  loadingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingCard: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
    width: 160,
  },
});
