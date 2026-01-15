import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Switch } from '@/components/ui/switch';
import { Section } from './section';

export function SwitchDemo() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <View style={styles.container}>
      <Section title="With Labels">
        <Switch
          checked={notifications}
          onCheckedChange={setNotifications}
          label="Push notifications"
          description="Receive alerts when someone mentions you"
        />
        <Switch
          checked={darkMode}
          onCheckedChange={setDarkMode}
          label="Dark mode"
          description="Switch between light and dark themes"
        />
        <Switch
          checked={autoSave}
          onCheckedChange={setAutoSave}
          label="Auto-save drafts"
        />
      </Section>

      <Section title="States">
        <Switch checked={false} label="Off" />
        <Switch checked={true} label="On" />
        <Switch disabled label="Disabled off" />
        <Switch disabled checked label="Disabled on" />
      </Section>

      <Section title="Sizes">
        <Switch size="sm" checked={true} label="Small" />
        <Switch size="md" checked={true} label="Medium" />
        <Switch size="lg" checked={true} label="Large" />
      </Section>

      <Section title="Without Label">
        <View style={styles.row}>
          <Switch checked={false} accessibilityLabel="Toggle 1" />
          <Switch checked={true} accessibilityLabel="Toggle 2" />
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  row: { flexDirection: 'row', gap: 16 },
});
