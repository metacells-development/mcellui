import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '@/components/ui/avatar';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

export function AvatarDemo() {
  const { colors, fontSize, fontWeight, spacing, radius } = useTheme();

  return (
    <View style={styles.container}>
      <Section title="Sizes">
        <View style={styles.row}>
          <Avatar size="sm" fallback="SM" />
          <Avatar size="md" fallback="MD" />
          <Avatar size="lg" fallback="LG" />
        </View>
      </Section>

      <Section title="With Fallback Initials">
        <View style={styles.row}>
          <Avatar fallback="JD" />
          <Avatar fallback="AB" />
          <Avatar fallback="XY" />
          <Avatar fallback="?" />
        </View>
      </Section>

      <Section title="With Image">
        <View style={styles.row}>
          <Avatar
            source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
            fallback="U1"
          />
          <Avatar
            source={{ uri: 'https://i.pravatar.cc/150?img=2' }}
            fallback="U2"
          />
          <Avatar
            source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
            fallback="U3"
          />
        </View>
      </Section>

      <Section title="In Context">
        <View style={[styles.userRow, { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing[3] }]}>
          <Avatar fallback="JD" />
          <View style={styles.userInfo}>
            <Text style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.foreground }}>John Doe</Text>
            <Text style={{ fontSize: fontSize.sm, color: colors.foregroundMuted }}>john@example.com</Text>
          </View>
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  userInfo: { flex: 1 },
});
