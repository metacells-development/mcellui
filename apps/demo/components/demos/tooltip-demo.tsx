import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tooltip } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

function InfoIcon({ color }: { color?: string }) {
  return (
    <View style={styles.infoIcon}>
      <View style={[styles.infoCircle, { borderColor: color || '#666' }]}>
        <Text style={{ fontSize: 12, fontWeight: '600', fontStyle: 'italic', color: color || '#666' }}>i</Text>
      </View>
    </View>
  );
}

export function TooltipDemo() {
  const { colors, spacing, fontSize, fontWeight } = useTheme();
  const [controlledOpen, setControlledOpen] = React.useState(false);

  return (
    <View style={styles.container}>
      <Section title="Basic Tooltip">
        <View style={styles.row}>
          <Tooltip content="This is a helpful tooltip!">
            <Button variant="outline">Long press me</Button>
          </Tooltip>
        </View>
        <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs, marginTop: 8, textAlign: 'center' }}>
          Long press the button to see the tooltip
        </Text>
      </Section>

      <Section title="Positions">
        <View style={styles.row}>
          <Tooltip content="I appear above the element" position="top">
            <Button variant="outline" size="sm">Top</Button>
          </Tooltip>
          <Tooltip content="I appear below the element" position="bottom">
            <Button variant="outline" size="sm">Bottom</Button>
          </Tooltip>
        </View>
      </Section>

      <Section title="Delay Variations">
        <View style={styles.row}>
          <Tooltip content="Instant (0ms)" delayMs={0}>
            <Button variant="outline" size="sm">Instant</Button>
          </Tooltip>
          <Tooltip content="Default (500ms)" delayMs={500}>
            <Button variant="outline" size="sm">Default (500ms)</Button>
          </Tooltip>
          <Tooltip content="Slow (1000ms)" delayMs={1000}>
            <Button variant="outline" size="sm">Slow (1s)</Button>
          </Tooltip>
        </View>
        <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs, marginTop: 8, textAlign: 'center' }}>
          Try long-pressing each button to feel the delay difference
        </Text>
      </Section>

      <Section title="On Different Elements">
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={{ color: colors.foreground }}>On text: </Text>
            <Tooltip content="More information about this term">
              <Text style={{ color: colors.primary, textDecorationLine: 'underline' }}>
                highlighted text
              </Text>
            </Tooltip>
          </View>
          <View style={styles.row}>
            <Text style={{ color: colors.foreground }}>On icon: </Text>
            <Tooltip content="Password must be at least 8 characters with one uppercase, one lowercase, and one number.">
              <InfoIcon color={colors.foregroundMuted} />
            </Tooltip>
          </View>
          <View style={styles.row}>
            <Tooltip content="Helpful tooltip on button">
              <Button size="sm">On Button</Button>
            </Tooltip>
          </View>
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

      <Section title="Controlled Tooltip">
        <View style={styles.column}>
          <View style={styles.row}>
            <Button
              variant="outline"
              size="sm"
              onPress={() => setControlledOpen(!controlledOpen)}
            >
              Toggle Tooltip
            </Button>
            <Tooltip
              content="This tooltip is controlled by state"
              open={controlledOpen}
              onOpenChange={setControlledOpen}
            >
              <Button variant="ghost" size="sm">Target Element</Button>
            </Tooltip>
          </View>
          <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs, marginTop: 8, textAlign: 'center' }}>
            Tooltip is currently: {controlledOpen ? 'Open' : 'Closed'}
          </Text>
        </View>
      </Section>

      <Section title="Disabled State">
        <View style={styles.centered}>
          <Tooltip content="You won't see this" disabled>
            <Button variant="ghost">Tooltip Disabled</Button>
          </Tooltip>
        </View>
        <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs, marginTop: 8, textAlign: 'center' }}>
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
  column: {
    gap: 12,
  },
  centered: {
    alignItems: 'center',
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
});
