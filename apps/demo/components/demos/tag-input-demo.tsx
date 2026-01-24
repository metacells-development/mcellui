import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

import { TagInput } from '@/components/ui/tag-input';
import { Card, CardContent } from '@/components/ui/card';
import { Section } from '@/components/demos/section';

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
      <Section title="Basic">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <TagInput
              value={basicTags}
              onChange={setBasicTags}
              placeholder="Add tags..."
            />
            <Text style={[styles.hint, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
              Type and press Enter or comma to add
            </Text>
          </CardContent>
        </Card>
      </Section>

      <Section title="With Label">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <TagInput
              value={basicTags}
              onChange={setBasicTags}
              label="Skills"
              placeholder="Add your skills..."
            />
          </CardContent>
        </Card>
      </Section>

      <Section title="Max Tags Limit">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <TagInput
              value={maxTags}
              onChange={setMaxTags}
              maxTags={5}
              placeholder="Max 5 tags..."
            />
            <Text style={[styles.hint, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
              {maxTags.length}/5 tags
            </Text>
          </CardContent>
        </Card>
      </Section>

      <Section title="With Validation">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <TagInput
              value={validatedTags}
              onChange={setValidatedTags}
              placeholder="Enter email addresses..."
              validate={emailValidator}
              error={validatedTags.length === 0 ? undefined : undefined}
            />
            <Text style={[styles.hint, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
              Only valid emails are accepted
            </Text>
          </CardContent>
        </Card>
      </Section>

      <Section title="With Suggestions">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <TagInput
              value={suggestionTags}
              onChange={setSuggestionTags}
              placeholder="Type to search..."
              suggestions={suggestions}
            />
            <Text style={[styles.hint, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
              Type to see suggestions
            </Text>
          </CardContent>
        </Card>
      </Section>

      <Section title="Disabled">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <TagInput
              value={['Fixed', 'Tags']}
              onChange={() => {}}
              disabled
              placeholder="Cannot edit..."
            />
          </CardContent>
        </Card>
      </Section>

      <Section title="With Helper Text">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <TagInput
              value={basicTags}
              onChange={setBasicTags}
              label="Categories"
              helperText="Add up to 10 categories for your post"
              placeholder="Add categories..."
              maxTags={10}
            />
          </CardContent>
        </Card>
      </Section>

      <Section title="Sizes">
        <Card>
          <CardContent style={{ paddingTop: spacing[4], gap: spacing[4] }}>
            <View>
              <Text style={[styles.sizeLabel, { color: colors.foregroundMuted, marginBottom: spacing[2] }]}>
                Small
              </Text>
              <TagInput
                value={['Small', 'Tags']}
                onChange={() => {}}
                size="sm"
                placeholder="Small..."
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
                placeholder="Medium..."
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
                placeholder="Large..."
              />
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Use Cases">
        <Card>
          <CardContent style={{ paddingTop: spacing[4], gap: spacing[4] }}>
            <View>
              <Text style={[styles.useCaseTitle, { color: colors.foreground, marginBottom: spacing[2] }]}>
                Recipients
              </Text>
              <TagInput
                value={['john@example.com', 'jane@example.com']}
                onChange={() => {}}
                placeholder="Add recipients..."
                validate={emailValidator}
              />
            </View>
            <View>
              <Text style={[styles.useCaseTitle, { color: colors.foreground, marginBottom: spacing[2] }]}>
                Hashtags
              </Text>
              <TagInput
                value={['coding', 'reactnative', 'mobile']}
                onChange={() => {}}
                placeholder="Add hashtags..."
              />
            </View>
            <View>
              <Text style={[styles.useCaseTitle, { color: colors.foreground, marginBottom: spacing[2] }]}>
                Interests
              </Text>
              <TagInput
                value={['Photography', 'Travel', 'Music']}
                onChange={() => {}}
                suggestions={['Photography', 'Travel', 'Music', 'Sports', 'Art', 'Food', 'Tech']}
                placeholder="Select interests..."
              />
            </View>
          </CardContent>
        </Card>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  hint: {
    fontSize: 12,
  },
  sizeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  useCaseTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
});
