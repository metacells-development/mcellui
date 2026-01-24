import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';
import { TagInput } from '@/components/ui/tag-input';
import { Section } from './section';

export function TagInputDemo() {
  const { colors, spacing } = useTheme();
  const [basicTags, setBasicTags] = useState<string[]>(['React', 'TypeScript']);
  const [maxTags, setMaxTags] = useState<string[]>(['One', 'Two', 'Three']);
  const [validatedTags, setValidatedTags] = useState<string[]>(['valid@email.com']);
  const [suggestionTags, setSuggestionTags] = useState<string[]>(['JavaScript']);

  const suggestions = [
    'JavaScript',
    'TypeScript',
    'React',
    'React Native',
    'Node.js',
    'Python',
    'Swift',
    'Kotlin',
    'Go',
    'Rust',
  ];

  const emailValidator = (tag: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(tag);
  };

  return (
    <View style={styles.container}>
      <Section title="Sizes">
        <View>
          <Text style={[styles.sizeLabel, { color: colors.foregroundMuted, marginBottom: spacing[2] }]}>
            Small
          </Text>
          <TagInput
            value={['Small', 'Tags']}
            onChange={() => {}}
            size="sm"
            placeholder="Small tags..."
          />
        </View>
        <View>
          <Text style={[styles.sizeLabel, { color: colors.foregroundMuted, marginBottom: spacing[2] }]}>
            Medium (default)
          </Text>
          <TagInput
            value={['Medium', 'Tags']}
            onChange={() => {}}
            size="md"
            placeholder="Medium tags..."
          />
        </View>
        <View>
          <Text style={[styles.sizeLabel, { color: colors.foregroundMuted, marginBottom: spacing[2] }]}>
            Large
          </Text>
          <TagInput
            value={['Large', 'Tags']}
            onChange={() => {}}
            size="lg"
            placeholder="Large tags..."
          />
        </View>
      </Section>

      <Section title="Features">
        <TagInput
          value={basicTags}
          onChange={setBasicTags}
          label="Skills"
          placeholder="Add your skills..."
          helperText="Type and press Enter or comma to add"
        />
        <TagInput
          value={suggestionTags}
          onChange={setSuggestionTags}
          label="Technologies"
          placeholder="Type to search..."
          suggestions={suggestions}
          helperText="Type to see suggestions"
        />
        <TagInput
          value={maxTags}
          onChange={setMaxTags}
          label="Max Tags Limit"
          maxTags={5}
          placeholder="Max 5 tags..."
          helperText={`${maxTags.length}/5 tags`}
        />
        <TagInput
          value={validatedTags}
          onChange={setValidatedTags}
          label="Email Validation"
          placeholder="Enter email addresses..."
          validate={emailValidator}
          helperText="Only valid emails are accepted"
        />
      </Section>

      <Section title="States">
        <TagInput
          value={basicTags}
          onChange={setBasicTags}
          label="Default"
          placeholder="Add tags..."
        />
        <TagInput
          value={[]}
          onChange={() => {}}
          label="With Error"
          placeholder="Required field"
          error="At least one tag is required"
        />
        <TagInput
          value={['Fixed', 'Tags']}
          onChange={() => {}}
          label="Disabled"
          disabled
          placeholder="Cannot edit..."
        />
      </Section>

      <Section title="Use Cases">
        <TagInput
          value={['john@example.com', 'jane@example.com']}
          onChange={() => {}}
          label="Recipients"
          placeholder="Add recipients..."
          validate={emailValidator}
        />
        <TagInput
          value={['coding', 'reactnative', 'mobile']}
          onChange={() => {}}
          label="Hashtags"
          placeholder="Add hashtags..."
        />
        <TagInput
          value={['Photography', 'Travel', 'Music']}
          onChange={() => {}}
          label="Interests"
          suggestions={['Photography', 'Travel', 'Music', 'Sports', 'Art', 'Food', 'Tech']}
          placeholder="Select interests..."
        />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  sizeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
