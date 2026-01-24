import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '@/components/ui/input';
import { Section } from './section';

export function InputDemo() {
  const [value, setValue] = useState('');

  return (
    <View style={styles.container}>
      <Section title="Sizes">
        <Input size="sm" label="Small" placeholder="Small input" />
        <Input size="md" label="Medium" placeholder="Medium input (default)" />
        <Input size="lg" label="Large" placeholder="Large input" />
      </Section>

      <Section title="Features">
        <Input
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Password"
          placeholder="Enter password"
          secureTextEntry
          showPasswordToggle
        />
        <Input
          label="Clearable"
          placeholder="Type to clear"
          value={value}
          onChangeText={setValue}
          clearable
        />
        <Input
          label="With Helper"
          placeholder="Username"
          helperText="This will be your public display name"
        />
        <Input
          label="Character Count"
          placeholder="Bio"
          showCount
          maxLength={100}
        />
      </Section>

      <Section title="States">
        <Input
          label="Default"
          placeholder="Default state"
        />
        <Input
          label="With Error"
          placeholder="Email"
          value="invalid"
          error="Please enter a valid email"
        />
        <Input
          label="Disabled"
          placeholder="Can't edit"
          value="Read only"
          editable={false}
        />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
});
