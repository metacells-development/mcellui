import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Section } from './section';

export function RadioGroupDemo() {
  const [plan, setPlan] = useState('startup');
  const [priority, setPriority] = useState('medium');
  const [size, setSize] = useState('md');

  return (
    <View style={styles.container}>
      <Section title="Basic">
        <RadioGroup value={plan} onValueChange={setPlan}>
          <RadioGroupItem value="free" label="Free" />
          <RadioGroupItem value="startup" label="Startup" />
          <RadioGroupItem value="enterprise" label="Enterprise" />
        </RadioGroup>
      </Section>

      <Section title="With Descriptions">
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

      <Section title="Priority Selection">
        <RadioGroup value={priority} onValueChange={setPriority}>
          <RadioGroupItem value="low" label="Low priority" />
          <RadioGroupItem value="medium" label="Medium priority" />
          <RadioGroupItem value="high" label="High priority" />
          <RadioGroupItem value="urgent" label="Urgent" />
        </RadioGroup>
      </Section>

      <Section title="Sizes">
        <RadioGroup value={size} onValueChange={setSize} size="sm">
          <RadioGroupItem value="sm" label="Small" />
          <RadioGroupItem value="md" label="Medium" />
          <RadioGroupItem value="lg" label="Large" />
        </RadioGroup>

        <View style={styles.spacer} />

        <RadioGroup value={size} onValueChange={setSize} size="lg">
          <RadioGroupItem value="sm" label="Small" />
          <RadioGroupItem value="md" label="Medium" />
          <RadioGroupItem value="lg" label="Large" />
        </RadioGroup>
      </Section>

      <Section title="Disabled">
        <RadioGroup value="option1" onValueChange={() => {}} disabled>
          <RadioGroupItem value="option1" label="Option 1 (selected)" />
          <RadioGroupItem value="option2" label="Option 2" />
          <RadioGroupItem value="option3" label="Option 3" />
        </RadioGroup>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  spacer: { height: 16 },
});
