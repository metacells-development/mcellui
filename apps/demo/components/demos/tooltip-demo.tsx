import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tooltip } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Section } from './section';
import { useTheme } from '@nativeui/core';

function InfoIcon({ color }: { color?: string }) {
  return (
    <View style={styles.infoIcon}>
      <View style={[styles.infoCircle, { borderColor: color || '#666' }]}>
        <Text style={[styles.infoText, { color: color || '#666' }]}>i</Text>
      </View>
    </View>
  );
}

export function TooltipDemo() {
  const { colors, spacing } = useTheme();

  return (
    <View style={styles.container}>
      <Section title="Basic Tooltip">
        <View style={styles.row}>
          <Tooltip content="This is a helpful tooltip!">
            <Button variant="outline">Long press me</Button>
          </Tooltip>
        </View>
        <Text style={[styles.hint, { color: colors.foregroundMuted }]}>
          Long press the button to see the tooltip
        </Text>
      </Section>

      <Section title="Position: Top (default)">
        <View style={styles.centered}>
          <Tooltip content="I appear above the element" position="top">
            <Button>Tooltip Above</Button>
          </Tooltip>
        </View>
      </Section>

      <Section title="Position: Bottom">
        <View style={styles.centered}>
          <Tooltip content="I appear below the element" position="bottom">
            <Button>Tooltip Below</Button>
          </Tooltip>
        </View>
      </Section>

      <Section title="On Text">
        <Text style={{ color: colors.foreground }}>
          Hover over the{' '}
          <Tooltip content="More information about this term">
            <Text style={{ color: colors.primary, textDecorationLine: 'underline' }}>
              highlighted text
            </Text>
          </Tooltip>
          {' '}to learn more.
        </Text>
      </Section>

      <Section title="On Icon">
        <View style={styles.row}>
          <Text style={{ color: colors.foreground }}>Password requirements</Text>
          <Tooltip content="Password must be at least 8 characters with one uppercase, one lowercase, and one number.">
            <InfoIcon color={colors.foregroundMuted} />
          </Tooltip>
        </View>
      </Section>

      <Section title="Long Content">
        <View style={styles.centered}>
          <Tooltip
            content="This is a longer tooltip message that provides more detailed information about the element. It will wrap to multiple lines if needed."
            maxWidth={280}
          >
            <Button variant="secondary">Detailed Info</Button>
          </Tooltip>
        </View>
      </Section>

      <Section title="Custom Delay">
        <View style={styles.row}>
          <Tooltip content="Instant!" delayMs={0}>
            <Button variant="outline" size="sm">No delay</Button>
          </Tooltip>
          <Tooltip content="Takes a bit longer" delayMs={800}>
            <Button variant="outline" size="sm">800ms delay</Button>
          </Tooltip>
        </View>
      </Section>

      <Section title="Disabled">
        <View style={styles.centered}>
          <Tooltip content="You won't see this" disabled>
            <Button variant="ghost">Tooltip Disabled</Button>
          </Tooltip>
        </View>
        <Text style={[styles.hint, { color: colors.foregroundMuted }]}>
          This tooltip is disabled and won't appear
        </Text>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 32 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  centered: {
    alignItems: 'center',
  },
  hint: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  infoIcon: {
    padding: 4,
  },
  infoCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});
