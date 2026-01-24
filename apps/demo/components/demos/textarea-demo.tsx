import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Textarea } from '@/components/ui/textarea';
import { Section } from './section';

export function TextareaDemo() {
  const [value, setValue] = useState('');

  return (
    <View style={styles.container}>
      <Section title="Sizes">
        <Textarea size="sm" label="Small" placeholder="Small textarea" rows={3} />
        <Textarea size="md" label="Medium" placeholder="Medium textarea (default)" rows={4} />
        <Textarea size="lg" label="Large" placeholder="Large textarea" rows={4} />
      </Section>

      <Section title="Auto Grow">
        <Textarea
          label="Auto-growing"
          placeholder="Start typing..."
          autoGrow
          minRows={2}
          maxRows={6}
          value={value}
          onChangeText={setValue}
        />
      </Section>

      <Section title="Character Count">
        <Textarea
          label="Bio"
          placeholder="Tell us about yourself"
          showCount
          maxLength={200}
        />
      </Section>

      <Section title="States">
        <Textarea
          label="Default"
          placeholder="Default state"
          rows={3}
        />
        <Textarea
          label="With Error"
          placeholder="Description"
          error="Description is required"
          rows={3}
        />
        <Textarea
          label="Disabled"
          placeholder="Can't edit"
          value="Read only content"
          editable={false}
          rows={3}
        />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
});
