'use client';

import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, colors } from './preview-components';

interface ButtonPreviewProps {
  dark?: boolean;
}

export function ButtonPreview({ dark = false }: ButtonPreviewProps) {
  const theme = dark ? colors.dark : colors.light;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Variants */}
      <View style={styles.section}>
        <Button dark={dark}>Default</Button>
      </View>
      <View style={styles.section}>
        <Button variant="secondary" dark={dark}>Secondary</Button>
      </View>
      <View style={styles.section}>
        <Button variant="outline" dark={dark}>Outline</Button>
      </View>
      <View style={styles.section}>
        <Button variant="ghost" dark={dark}>Ghost</Button>
      </View>
      <View style={styles.section}>
        <Button variant="destructive" dark={dark}>Destructive</Button>
      </View>
      <View style={styles.section}>
        <Button disabled dark={dark}>Disabled</Button>
      </View>
      <View style={styles.section}>
        <Button fullWidth dark={dark}>Full Width</Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 44,
  },
  content: {
    padding: 24,
    gap: 12,
  },
  section: {
    alignItems: 'flex-start',
  },
});
