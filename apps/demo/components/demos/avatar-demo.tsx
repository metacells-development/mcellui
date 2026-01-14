import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '@/components/ui/avatar';

export function AvatarDemo() {
  return (
    <View style={styles.container}>
      <Section title="Sizes">
        <View style={styles.row}>
          <Avatar size="sm" fallback="SM" />
          <Avatar size="md" fallback="MD" />
          <Avatar size="lg" fallback="LG" />
          <Avatar size="xl" fallback="XL" />
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
        <View style={styles.userRow}>
          <Avatar fallback="JD" />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john@example.com</Text>
          </View>
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#fff', borderRadius: 12 },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '600', color: '#171717' },
  userEmail: { fontSize: 14, color: '#737373' },
});
