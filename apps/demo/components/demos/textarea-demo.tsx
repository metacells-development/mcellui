import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@nativeui/core';
import { Textarea } from '../ui/textarea';

export function TextareaDemo() {
  const { spacing, colors } = useTheme();
  const [bio, setBio] = useState('');
  const [feedback, setFeedback] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>Basic</Text>
      <Textarea
        label="Bio"
        placeholder="Tell us about yourself..."
        value={bio}
        onChangeText={setBio}
      />

      <View style={{ height: spacing[6] }} />

      <Text style={[styles.title, { color: colors.foreground }]}>With Character Count</Text>
      <Textarea
        label="Feedback"
        placeholder="Share your thoughts..."
        value={feedback}
        onChangeText={setFeedback}
        maxLength={200}
        showCount
        rows={3}
        helperText="Your feedback helps us improve"
      />

      <View style={{ height: spacing[6] }} />

      <Text style={[styles.title, { color: colors.foreground }]}>Auto-Grow</Text>
      <Textarea
        label="Notes"
        placeholder="Start typing..."
        value={notes}
        onChangeText={setNotes}
        autoGrow
        minRows={2}
        maxRows={6}
      />

      <View style={{ height: spacing[6] }} />

      <Text style={[styles.title, { color: colors.foreground }]}>Error State</Text>
      <Textarea
        label="Description"
        placeholder="Enter description..."
        error="Description is required"
      />

      <View style={{ height: spacing[6] }} />

      <Text style={[styles.title, { color: colors.foreground }]}>Disabled</Text>
      <Textarea
        label="Read Only"
        value="This textarea is disabled and cannot be edited."
        editable={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
});
