import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Select } from '@/components/ui/select';
import { Section } from './section';

const countries = [
  { label: 'United States', value: 'us' },
  { label: 'Germany', value: 'de' },
  { label: 'Japan', value: 'jp' },
  { label: 'France', value: 'fr' },
  { label: 'United Kingdom', value: 'uk' },
];

export function SelectDemo() {
  const [value, setValue] = useState('');
  const [errorValue, setErrorValue] = useState('');

  return (
    <View style={styles.container}>
      <Section title="Sizes">
        <Select
          size="sm"
          label="Small"
          placeholder="Select country"
          options={countries}
          value={value}
          onValueChange={setValue}
        />
        <Select
          size="md"
          label="Medium"
          placeholder="Select country"
          options={countries}
          value={value}
          onValueChange={setValue}
        />
        <Select
          size="lg"
          label="Large"
          placeholder="Select country"
          options={countries}
          value={value}
          onValueChange={setValue}
        />
      </Section>

      <Section title="Helper Text">
        <Select
          label="Country"
          placeholder="Select your country"
          options={countries}
          value={value}
          onValueChange={setValue}
          helperText="We use this for shipping calculations"
        />
      </Section>

      <Section title="States">
        <Select
          label="Default"
          placeholder="Select option"
          options={countries}
          value={value}
          onValueChange={setValue}
        />
        <Select
          label="With Error"
          placeholder="Select option"
          options={countries}
          value={errorValue}
          onValueChange={setErrorValue}
          error="Please select a country"
        />
        <Select
          label="Disabled"
          placeholder="Can't select"
          options={countries}
          disabled
        />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
});
