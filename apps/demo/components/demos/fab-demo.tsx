import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { FAB } from '@/components/ui/fab';
import { Section } from './section';
import { useTheme } from '@nativeui/core';

// Simple plus icon
function PlusIcon({ width = 24, height = 24, color = '#fff' }) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: width * 0.8, color, fontWeight: '300', lineHeight: height }}>+</Text>
    </View>
  );
}

// Simple edit icon (pencil-like)
function EditIcon({ width = 24, height = 24, color = '#fff' }) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: width * 0.7, color, lineHeight: height }}>✎</Text>
    </View>
  );
}

// Simple share icon
function ShareIcon({ width = 24, height = 24, color = '#fff' }) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: width * 0.7, color, lineHeight: height }}>↗</Text>
    </View>
  );
}

export function FABDemo() {
  const { colors, spacing, radius } = useTheme();
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    Alert.alert('FAB Pressed', 'You pressed the floating action button!');
  };

  const handleLoadingPress = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <View style={styles.container}>
      <Section title="Sizes">
        <View style={styles.row}>
          <FAB icon={<PlusIcon />} size="sm" onPress={handlePress} />
          <FAB icon={<PlusIcon />} size="md" onPress={handlePress} />
          <FAB icon={<PlusIcon />} size="lg" onPress={handlePress} />
        </View>
      </Section>

      <Section title="Variants">
        <View style={styles.row}>
          <FAB icon={<PlusIcon />} variant="primary" onPress={handlePress} />
          <FAB icon={<PlusIcon />} variant="secondary" onPress={handlePress} />
          <FAB icon={<PlusIcon />} variant="surface" onPress={handlePress} />
        </View>
      </Section>

      <Section title="Extended FAB">
        <View style={styles.column}>
          <FAB icon={<PlusIcon />} label="Create" onPress={handlePress} />
          <FAB icon={<EditIcon />} label="Compose" variant="secondary" onPress={handlePress} />
          <FAB icon={<ShareIcon />} label="Share" variant="surface" onPress={handlePress} />
        </View>
      </Section>

      <Section title="States">
        <View style={styles.row}>
          <FAB icon={<PlusIcon />} onPress={handlePress} />
          <FAB icon={<PlusIcon />} disabled onPress={handlePress} />
          <FAB icon={<PlusIcon />} loading={loading} onPress={handleLoadingPress} />
        </View>
        <Text style={[styles.hint, { color: colors.foregroundMuted }]}>
          Normal • Disabled • Tap for Loading
        </Text>
      </Section>

      <Section title="Typical Positioning">
        <View
          style={[
            styles.mockScreen,
            { backgroundColor: colors.backgroundMuted, borderRadius: radius.lg },
          ]}
        >
          <Text style={[styles.mockText, { color: colors.foregroundMuted }]}>
            Content Area
          </Text>
          <FAB
            icon={<PlusIcon />}
            onPress={handlePress}
            style={{ position: 'absolute', bottom: 16, right: 16 }}
          />
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 32 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  column: { gap: 12 },
  hint: { fontSize: 12, marginTop: 8 },
  mockScreen: {
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockText: { fontSize: 14 },
});
