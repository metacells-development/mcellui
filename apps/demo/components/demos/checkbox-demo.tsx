import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox } from '@/components/ui/checkbox';
import { Section } from './section';

export function CheckboxDemo() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [checked3, setChecked3] = useState(false);

  return (
    <View style={styles.container}>
      <Section title="Sizes">
        <Checkbox
          size="sm"
          checked={checked3}
          onCheckedChange={setChecked3}
          label="Small checkbox"
        />
        <Checkbox
          size="md"
          checked={checked3}
          onCheckedChange={setChecked3}
          label="Medium checkbox"
        />
        <Checkbox
          size="lg"
          checked={checked3}
          onCheckedChange={setChecked3}
          label="Large checkbox"
        />
      </Section>

      <Section title="Features">
        <Checkbox
          checked={checked1}
          onCheckedChange={setChecked1}
          label="Accept terms and conditions"
        />
        <Checkbox
          checked={checked2}
          onCheckedChange={setChecked2}
          label="Subscribe to newsletter"
          description="Get weekly updates about new features"
        />
        <Checkbox
          indeterminate
          label="Select all items"
          description="Some items are selected"
        />
      </Section>

      <Section title="States">
        <Checkbox
          checked={false}
          label="Unchecked"
        />
        <Checkbox
          checked={true}
          label="Checked"
        />
        <Checkbox
          indeterminate
          label="Indeterminate"
        />
        <Checkbox
          disabled
          label="Disabled unchecked"
        />
        <Checkbox
          disabled
          checked
          label="Disabled checked"
        />
      </Section>

      <Section title="Without Label">
        <View style={styles.row}>
          <Checkbox checked={false} accessibilityLabel="Option 1" />
          <Checkbox checked={true} accessibilityLabel="Option 2" />
          <Checkbox indeterminate accessibilityLabel="Option 3" />
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  row: { flexDirection: 'row', gap: 16 },
});
