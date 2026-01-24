import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@metacells/mcellui-core';
import { Section } from './section';

export function SeparatorDemo() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Section title="Horizontal (Default)">
        <View style={styles.card}>
          <Text style={[styles.text, { color: colors.foreground }]}>Section 1</Text>
          <Separator style={styles.horizontalSeparator} />
          <Text style={[styles.text, { color: colors.foreground }]}>Section 2</Text>
          <Separator style={styles.horizontalSeparator} />
          <Text style={[styles.text, { color: colors.foreground }]}>Section 3</Text>
        </View>
      </Section>

      <Section title="Vertical">
        <View style={styles.horizontalCard}>
          <Text style={[styles.text, { color: colors.foreground }]}>Left</Text>
          <Separator orientation="vertical" style={styles.verticalSeparator} />
          <Text style={[styles.text, { color: colors.foreground }]}>Center</Text>
          <Separator orientation="vertical" style={styles.verticalSeparator} />
          <Text style={[styles.text, { color: colors.foreground }]}>Right</Text>
        </View>
      </Section>

      <Section title="Menu Example">
        <View style={[styles.menu, { backgroundColor: colors.card }]}>
          <Text style={[styles.menuItem, { color: colors.foreground }]}>Profile</Text>
          <Text style={[styles.menuItem, { color: colors.foreground }]}>Settings</Text>
          <Separator style={styles.menuSeparator} />
          <Text style={[styles.menuItem, { color: colors.destructive }]}>Log out</Text>
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  card: {
    padding: 16,
    gap: 12,
  },
  horizontalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
    height: 60,
  },
  text: {
    fontSize: 14,
  },
  horizontalSeparator: {
    marginVertical: 4,
  },
  verticalSeparator: {
    height: '100%',
  },
  menu: {
    borderRadius: 12,
    padding: 8,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  menuSeparator: {
    marginVertical: 4,
  },
});
