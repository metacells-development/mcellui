import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

export function BadgeDemo() {
  const { colors, fontSize, fontWeight } = useTheme();

  return (
    <View style={styles.container}>
      <Section title="Variants">
        <View style={styles.row}>
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </View>
      </Section>

      <Section title="Use Cases">
        <View style={styles.row}>
          <Badge>New</Badge>
          <Badge variant="secondary">12</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="outline">Draft</Badge>
        </View>
      </Section>

      <Section title="In Context">
        <View style={styles.contextRow}>
          <Text style={{ fontSize: fontSize.md, color: colors.foreground }}>Messages</Text>
          <Badge variant="secondary">3</Badge>
        </View>
        <View style={styles.contextRow}>
          <Text style={{ fontSize: fontSize.md, color: colors.foreground }}>Status</Text>
          <Badge>Active</Badge>
        </View>
        <View style={styles.contextRow}>
          <Text style={{ fontSize: fontSize.md, color: colors.foreground }}>Priority</Text>
          <Badge variant="destructive">High</Badge>
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  contextRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
});
