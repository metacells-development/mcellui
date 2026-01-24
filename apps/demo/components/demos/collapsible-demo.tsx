import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { useTheme } from '@metacells/mcellui-core';
import { Section } from './section';

export function CollapsibleDemo() {
  const { colors, spacing, radius } = useTheme();
  const [controlled, setControlled] = useState(false);

  return (
    <View style={styles.container}>
      <Section title="Basic Usage">
        <View style={[styles.demoBox, { borderColor: colors.border }]}>
          <Collapsible>
            <CollapsibleTrigger>
              <Text style={[styles.triggerText, { color: colors.foreground }]}>
                Click to expand
              </Text>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={[styles.content, { padding: spacing[4] }]}>
                <Text style={{ color: colors.foreground }}>
                  This is the collapsible content. It smoothly animates in and out
                  when you toggle the trigger.
                </Text>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </View>
      </Section>

      <Section title="Default Open">
        <View style={[styles.demoBox, { borderColor: colors.border }]}>
          <Collapsible defaultOpen>
            <CollapsibleTrigger>
              <Text style={[styles.triggerText, { color: colors.foreground }]}>
                This starts open
              </Text>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={[styles.content, { padding: spacing[4] }]}>
                <Text style={{ color: colors.foreground }}>
                  This collapsible starts in the open state. Click the trigger
                  to collapse it.
                </Text>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </View>
      </Section>

      <Section title="Controlled">
        <View style={styles.controlRow}>
          <Text style={{ color: colors.foreground }}>
            State: {controlled ? 'Open' : 'Closed'}
          </Text>
        </View>
        <View style={[styles.demoBox, { borderColor: colors.border }]}>
          <Collapsible open={controlled} onOpenChange={setControlled}>
            <CollapsibleTrigger>
              <Text style={[styles.triggerText, { color: colors.foreground }]}>
                Controlled Collapsible
              </Text>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={[styles.content, { padding: spacing[4] }]}>
                <Text style={{ color: colors.foreground }}>
                  This collapsible is controlled externally. The open state is
                  managed by the parent component.
                </Text>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </View>
      </Section>

      <Section title="Without Chevron">
        <View style={[styles.demoBox, { borderColor: colors.border }]}>
          <Collapsible>
            <CollapsibleTrigger showChevron={false}>
              <Text style={[styles.triggerText, { color: colors.foreground }]}>
                No chevron indicator
              </Text>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={[styles.content, { padding: spacing[4] }]}>
                <Text style={{ color: colors.foreground }}>
                  This trigger doesn't show the chevron icon. Useful when you
                  want a cleaner look or custom indicators.
                </Text>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </View>
      </Section>

      <Section title="Disabled">
        <View style={[styles.demoBox, { borderColor: colors.border }]}>
          <Collapsible disabled>
            <CollapsibleTrigger>
              <Text style={[styles.triggerText, { color: colors.foreground }]}>
                Disabled Collapsible
              </Text>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={[styles.content, { padding: spacing[4] }]}>
                <Text style={{ color: colors.foreground }}>
                  You won't see this content because the collapsible is disabled.
                </Text>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </View>
      </Section>

      <Section title="Rich Content">
        <View style={[styles.demoBox, { borderColor: colors.border }]}>
          <Collapsible>
            <CollapsibleTrigger>
              <View style={styles.richTrigger}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <Text style={{ color: colors.primaryForeground, fontWeight: '600' }}>
                    JD
                  </Text>
                </View>
                <View>
                  <Text style={[styles.triggerText, { color: colors.foreground }]}>
                    John Doe
                  </Text>
                  <Text style={{ color: colors.foregroundMuted, fontSize: 12 }}>
                    View profile details
                  </Text>
                </View>
              </View>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={[styles.profileContent, { padding: spacing[4], backgroundColor: colors.secondary }]}>
                <View style={styles.profileRow}>
                  <Text style={{ color: colors.foregroundMuted }}>Email:</Text>
                  <Text style={{ color: colors.foreground }}>john@example.com</Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={{ color: colors.foregroundMuted }}>Phone:</Text>
                  <Text style={{ color: colors.foreground }}>+1 (555) 123-4567</Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={{ color: colors.foregroundMuted }}>Location:</Text>
                  <Text style={{ color: colors.foreground }}>San Francisco, CA</Text>
                </View>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </View>
      </Section>

      <Section title="Multiple Collapsibles">
        <View style={[styles.demoBox, { borderColor: colors.border }]}>
          <Collapsible>
            <CollapsibleTrigger>
              <Text style={[styles.triggerText, { color: colors.foreground }]}>
                Section 1: Getting Started
              </Text>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={[styles.content, { padding: spacing[4] }]}>
                <Text style={{ color: colors.foreground }}>
                  Learn the basics of getting started with our platform.
                </Text>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </View>
        <View style={[styles.demoBox, { borderColor: colors.border }]}>
          <Collapsible>
            <CollapsibleTrigger>
              <Text style={[styles.triggerText, { color: colors.foreground }]}>
                Section 2: Advanced Features
              </Text>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={[styles.content, { padding: spacing[4] }]}>
                <Text style={{ color: colors.foreground }}>
                  Discover advanced features for power users.
                </Text>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </View>
        <View style={[styles.demoBox, { borderColor: colors.border }]}>
          <Collapsible>
            <CollapsibleTrigger>
              <Text style={[styles.triggerText, { color: colors.foreground }]}>
                Section 3: FAQ
              </Text>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={[styles.content, { padding: spacing[4] }]}>
                <Text style={{ color: colors.foreground }}>
                  Find answers to frequently asked questions.
                </Text>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  demoBox: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  triggerText: {
    fontSize: 15,
    fontWeight: '500',
  },
  content: {},
  controlRow: {
    marginBottom: 8,
  },
  richTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContent: {
    gap: 8,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
