import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Section } from './section';

export function RadioGroupDemo() {
  const [plan, setPlan] = useState('startup');
  const [priority, setPriority] = useState('medium');
  const [sizeValue, setSizeValue] = useState('md');

  return (
    <View style={styles.container}>
      <Section title="Sizes">
        <RadioGroup value={sizeValue} onValueChange={setSizeValue} size="sm">
          <RadioGroupItem value="sm" label="Small radio" />
          <RadioGroupItem value="md" label="Medium radio" />
          <RadioGroupItem value="lg" label="Large radio" />
        </RadioGroup>

        <View style={styles.spacer} />

        <RadioGroup value={sizeValue} onValueChange={setSizeValue} size="md">
          <RadioGroupItem value="sm" label="Small radio" />
          <RadioGroupItem value="md" label="Medium radio" />
          <RadioGroupItem value="lg" label="Large radio" />
        </RadioGroup>

        <View style={styles.spacer} />

        <RadioGroup value={sizeValue} onValueChange={setSizeValue} size="lg">
          <RadioGroupItem value="sm" label="Small radio" />
          <RadioGroupItem value="md" label="Medium radio" />
          <RadioGroupItem value="lg" label="Large radio" />
        </RadioGroup>
      </Section>

      <Section title="Features">
        <RadioGroup value={plan} onValueChange={setPlan}>
          <RadioGroupItem value="free" label="Free" />
          <RadioGroupItem value="startup" label="Startup" />
          <RadioGroupItem value="enterprise" label="Enterprise" />
        </RadioGroup>

        <View style={styles.spacer} />

        <RadioGroup value={plan} onValueChange={setPlan}>
          <RadioGroupItem
            value="free"
            label="Free"
            description="For personal projects and learning"
          />
          <RadioGroupItem
            value="startup"
            label="Startup"
            description="For growing teams up to 10 members"
          />
          <RadioGroupItem
            value="enterprise"
            label="Enterprise"
            description="For large organizations with custom needs"
          />
        </RadioGroup>
      </Section>

      <Section title="States">
        <RadioGroup value={priority} onValueChange={setPriority}>
          <RadioGroupItem value="low" label="Low priority (unselected)" />
          <RadioGroupItem value="medium" label="Medium priority (selected)" />
          <RadioGroupItem value="high" label="High priority (unselected)" />
        </RadioGroup>

        <View style={styles.spacer} />

        <RadioGroup value="option1" onValueChange={() => {}} disabled>
          <RadioGroupItem value="option1" label="Option 1 (selected, disabled)" />
          <RadioGroupItem value="option2" label="Option 2 (disabled)" />
          <RadioGroupItem value="option3" label="Option 3 (disabled)" />
        </RadioGroup>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  spacer: { height: 12 },
});
