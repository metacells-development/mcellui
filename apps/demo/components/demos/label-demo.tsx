import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Label } from '@/components/ui/label';
import { Section } from './section';

export function LabelDemo() {
  return (
    <View style={styles.container}>
      <Section title="Sizes">
        <Label size="sm">Small Label</Label>
        <Label size="md">Medium Label</Label>
        <Label size="lg">Large Label</Label>
      </Section>

      <Section title="States">
        <Label>Default</Label>
        <Label required>Required Field</Label>
        <Label disabled>Disabled</Label>
        <Label error>Error State</Label>
      </Section>

      <Section title="Combined">
        <Label size="lg" required>
          Email Address
        </Label>
        <Label size="sm" disabled>
          Optional Field
        </Label>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
});
