import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Button } from '@/components/ui/button';
import { useTheme } from '@metacells/mcellui-core';

// Demo Icons
function PlusIcon({ color = '#000', width = 20, height = 20 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function ChevronRightIcon({ color = '#000', width = 20, height = 20 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ButtonDemo() {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Section title="Variants">
        <Button onPress={() => {}}>Default</Button>
        <Button variant="secondary" onPress={() => {}}>Secondary</Button>
        <Button variant="outline" onPress={() => {}}>Outline</Button>
        <Button variant="ghost" onPress={() => {}}>Ghost</Button>
        <Button variant="destructive" onPress={() => {}}>Destructive</Button>
        <Button variant="link" onPress={() => {}}>Link</Button>
        <Button variant="success" onPress={() => {}}>Success</Button>
      </Section>

      <Section title="Sizes">
        <Button size="sm" onPress={() => {}}>Small</Button>
        <Button size="md" onPress={() => {}}>Medium</Button>
        <Button size="lg" onPress={() => {}}>Large</Button>
      </Section>

      <Section title="With Icons">
        <Button icon={<PlusIcon />} onPress={() => {}}>Add Item</Button>
        <Button iconRight={<ChevronRightIcon />} onPress={() => {}}>Continue</Button>
        <Button icon={<PlusIcon />} iconRight={<ChevronRightIcon />} onPress={() => {}}>Both Icons</Button>
      </Section>

      <Section title="Full Width">
        <Button fullWidth onPress={() => {}}>Full Width Button</Button>
        <Button fullWidth variant="outline" onPress={() => {}}>Full Width Outline</Button>
      </Section>

      <Section title="States">
        <View style={styles.row}>
          <Button disabled onPress={() => {}}>Disabled</Button>
          <Button loading onPress={() => {}}>Loading</Button>
        </View>
        <View style={styles.row}>
          <Button variant="secondary" loading onPress={() => {}}>Secondary Loading</Button>
          <Button variant="destructive" loading onPress={() => {}}>Destructive Loading</Button>
        </View>
      </Section>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.foregroundMuted }]}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionContent: { gap: 8 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
});
