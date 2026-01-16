import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AvatarStack } from '@/components/ui/avatar-stack';
import { Section } from './section';
import { useTheme } from '@nativeui/core';

const sampleUsers = [
  { name: 'Alice Johnson', source: { uri: 'https://i.pravatar.cc/150?img=1' } },
  { name: 'Bob Smith', source: { uri: 'https://i.pravatar.cc/150?img=2' } },
  { name: 'Carol White', source: { uri: 'https://i.pravatar.cc/150?img=3' } },
  { name: 'David Brown', source: { uri: 'https://i.pravatar.cc/150?img=4' } },
  { name: 'Eve Davis', source: { uri: 'https://i.pravatar.cc/150?img=5' } },
  { name: 'Frank Miller', source: { uri: 'https://i.pravatar.cc/150?img=6' } },
  { name: 'Grace Wilson', source: { uri: 'https://i.pravatar.cc/150?img=7' } },
];

const fallbackUsers = [
  { name: 'Alice Johnson' },
  { name: 'Bob Smith' },
  { name: 'Carol White' },
  { name: 'David Brown' },
  { name: 'Eve Davis' },
];

export function AvatarStackDemo() {
  const { colors, spacing, radius } = useTheme();

  return (
    <View style={styles.container}>
      <Section title="Sizes">
        <View style={styles.row}>
          <View style={styles.sizeItem}>
            <AvatarStack avatars={sampleUsers.slice(0, 3)} size="sm" />
            <Text style={[styles.label, { color: colors.foregroundMuted }]}>Small</Text>
          </View>
          <View style={styles.sizeItem}>
            <AvatarStack avatars={sampleUsers.slice(0, 3)} size="md" />
            <Text style={[styles.label, { color: colors.foregroundMuted }]}>Medium</Text>
          </View>
          <View style={styles.sizeItem}>
            <AvatarStack avatars={sampleUsers.slice(0, 3)} size="lg" />
            <Text style={[styles.label, { color: colors.foregroundMuted }]}>Large</Text>
          </View>
          <View style={styles.sizeItem}>
            <AvatarStack avatars={sampleUsers.slice(0, 3)} size="xl" />
            <Text style={[styles.label, { color: colors.foregroundMuted }]}>XL</Text>
          </View>
        </View>
      </Section>

      <Section title="With Overflow">
        <View style={styles.column}>
          <View style={styles.overflowRow}>
            <AvatarStack avatars={sampleUsers} max={3} />
            <Text style={[styles.overflowLabel, { color: colors.foreground }]}>
              max=3 ({sampleUsers.length} total)
            </Text>
          </View>
          <View style={styles.overflowRow}>
            <AvatarStack avatars={sampleUsers} max={4} />
            <Text style={[styles.overflowLabel, { color: colors.foreground }]}>
              max=4 ({sampleUsers.length} total)
            </Text>
          </View>
          <View style={styles.overflowRow}>
            <AvatarStack avatars={sampleUsers} max={5} />
            <Text style={[styles.overflowLabel, { color: colors.foreground }]}>
              max=5 ({sampleUsers.length} total)
            </Text>
          </View>
        </View>
      </Section>

      <Section title="Fallback Initials">
        <AvatarStack avatars={fallbackUsers} max={5} size="lg" />
        <Text style={[styles.hint, { color: colors.foregroundMuted }]}>
          When no image is provided, initials are shown
        </Text>
      </Section>

      <Section title="Different Overlaps">
        <View style={styles.column}>
          <View style={styles.overflowRow}>
            <AvatarStack avatars={sampleUsers.slice(0, 4)} overlap={0.2} />
            <Text style={[styles.overflowLabel, { color: colors.foreground }]}>
              overlap=0.2
            </Text>
          </View>
          <View style={styles.overflowRow}>
            <AvatarStack avatars={sampleUsers.slice(0, 4)} overlap={0.4} />
            <Text style={[styles.overflowLabel, { color: colors.foreground }]}>
              overlap=0.4
            </Text>
          </View>
          <View style={styles.overflowRow}>
            <AvatarStack avatars={sampleUsers.slice(0, 4)} overlap={0.5} />
            <Text style={[styles.overflowLabel, { color: colors.foreground }]}>
              overlap=0.5
            </Text>
          </View>
        </View>
      </Section>

      <Section title="In Context">
        <View
          style={[
            styles.contextCard,
            { backgroundColor: colors.card, borderRadius: radius.lg },
          ]}
        >
          <View style={styles.contextHeader}>
            <Text style={[styles.contextTitle, { color: colors.foreground }]}>
              Project Team
            </Text>
            <AvatarStack avatars={sampleUsers.slice(0, 5)} size="sm" max={4} />
          </View>
          <Text style={[styles.contextSubtitle, { color: colors.foregroundMuted }]}>
            5 members are working on this project
          </Text>
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 32 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' },
  column: { gap: 16 },
  sizeItem: { alignItems: 'center', gap: 8 },
  label: { fontSize: 12 },
  overflowRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  overflowLabel: { fontSize: 14 },
  hint: { fontSize: 12, marginTop: 4 },
  contextCard: { padding: 16 },
  contextHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  contextTitle: { fontSize: 16, fontWeight: '600' },
  contextSubtitle: { fontSize: 14 },
});
