import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge } from '@/components/ui/badge';

export function BadgeDemo() {
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
          <Text style={styles.contextText}>Messages</Text>
          <Badge variant="secondary">3</Badge>
        </View>
        <View style={styles.contextRow}>
          <Text style={styles.contextText}>Status</Text>
          <Badge>Active</Badge>
        </View>
        <View style={styles.contextRow}>
          <Text style={styles.contextText}>Priority</Text>
          <Badge variant="destructive">High</Badge>
        </View>
      </Section>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#737373', textTransform: 'uppercase' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  contextRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  contextText: { fontSize: 16, color: '#171717' },
});
