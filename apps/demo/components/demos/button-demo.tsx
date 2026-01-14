import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/button';

export function ButtonDemo() {
  return (
    <View style={styles.container}>
      <Section title="Variants">
        <Button onPress={() => {}}>Default</Button>
        <Button variant="secondary" onPress={() => {}}>Secondary</Button>
        <Button variant="outline" onPress={() => {}}>Outline</Button>
        <Button variant="ghost" onPress={() => {}}>Ghost</Button>
        <Button variant="destructive" onPress={() => {}}>Destructive</Button>
      </Section>

      <Section title="Sizes">
        <Button size="sm" onPress={() => {}}>Small</Button>
        <Button size="md" onPress={() => {}}>Medium</Button>
        <Button size="lg" onPress={() => {}}>Large</Button>
      </Section>

      <Section title="States">
        <Button disabled onPress={() => {}}>Disabled</Button>
        <Button loading onPress={() => {}}>Loading</Button>
      </Section>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#737373', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionContent: { gap: 8 },
});
