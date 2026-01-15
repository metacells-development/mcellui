import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Spinner } from '@/components/ui/spinner';
import { Section } from './section';

export function SpinnerDemo() {
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
});
