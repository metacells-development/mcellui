import React, { useState } from 'react';
import { View, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { useTheme } from '@metacells/mcellui-core';
import { Section } from './section';

export function CollapsibleDemo() {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();
  const [controlled, setControlled] = useState(false);

  const demoBoxStyle: ViewStyle = {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg, // 12px
    overflow: 'hidden',
  };

  const triggerTextStyle: TextStyle = {
    fontSize: fontSize.md, // 15px
    fontWeight: fontWeight.medium,
    color: colors.foreground,
  };

  const contentStyle: ViewStyle = {
    padding: spacing[4], // 16px
  };

  const contentTextStyle: TextStyle = {
    fontSize: fontSize.sm, // 14px
    color: colors.foreground,
  };

  const descriptionStyle: TextStyle = {
    fontSize: fontSize.sm, // 14px
    color: colors.foreground,
    marginBottom: spacing[2], // 8px
  };

  const labelStyle: TextStyle = {
    fontSize: fontSize.xs, // 12px
    color: colors.foregroundMuted,
  };

  return (
    <View style={styles.container}>
      <Section title="Basic Collapsible">
        <View style={demoBoxStyle}>
          <Collapsible>
            <CollapsibleTrigger>
              <Text style={triggerTextStyle}>Click to expand</Text>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={contentStyle}>
                <Text style={contentTextStyle}>
                  This is the collapsible content. It smoothly animates in and out
                  when you toggle the trigger.
                </Text>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </View>
      </Section>

      <Section title="Default Open">
        <View style={demoBoxStyle}>
          <Collapsible defaultOpen>
            <CollapsibleTrigger>
              <Text style={triggerTextStyle}>This starts open</Text>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={contentStyle}>
                <Text style={contentTextStyle}>
                  This collapsible starts in the open state. Click the trigger
                  to collapse it.
                </Text>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </View>
      </Section>

      <Section title="Controlled State">
        <Text style={descriptionStyle}>
          State: {controlled ? 'Open' : 'Closed'}
        </Text>
        <View style={demoBoxStyle}>
          <Collapsible open={controlled} onOpenChange={setControlled}>
            <CollapsibleTrigger>
              <Text style={triggerTextStyle}>Controlled Collapsible</Text>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={contentStyle}>
                <Text style={contentTextStyle}>
                  This collapsible is controlled externally. The open state is
                  managed by the parent component.
                </Text>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </View>
      </Section>

      <Section title="Without Chevron">
        <View style={demoBoxStyle}>
          <Collapsible>
            <CollapsibleTrigger showChevron={false}>
              <Text style={triggerTextStyle}>No chevron indicator</Text>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={contentStyle}>
                <Text style={contentTextStyle}>
                  This trigger doesn't show the chevron icon. Useful when you
                  want a cleaner look or custom indicators.
                </Text>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </View>
      </Section>

      <Section title="Disabled State">
        <View style={demoBoxStyle}>
          <Collapsible disabled>
            <CollapsibleTrigger>
              <Text style={triggerTextStyle}>Disabled Collapsible</Text>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={contentStyle}>
                <Text style={contentTextStyle}>
                  You won't see this content because the collapsible is disabled.
                </Text>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </View>
      </Section>

      <Section title="Custom Trigger">
        <View style={demoBoxStyle}>
          <Collapsible>
            <CollapsibleTrigger>
              <View style={styles.richTrigger}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <Text
                    style={{
                      color: colors.primaryForeground,
                      fontWeight: fontWeight.semibold,
                      fontSize: fontSize.sm, // 14px
                    }}
                  >
                    JD
                  </Text>
                </View>
                <View>
                  <Text style={triggerTextStyle}>John Doe</Text>
                  <Text style={labelStyle}>View profile details</Text>
                </View>
              </View>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View
                style={{
                  padding: spacing[4],
                  backgroundColor: colors.secondary,
                  gap: spacing[2], // 8px
                }}
              >
                <View style={styles.profileRow}>
                  <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.sm }}>
                    Email:
                  </Text>
                  <Text style={{ color: colors.foreground, fontSize: fontSize.sm }}>
                    john@example.com
                  </Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.sm }}>
                    Phone:
                  </Text>
                  <Text style={{ color: colors.foreground, fontSize: fontSize.sm }}>
                    +1 (555) 123-4567
                  </Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.sm }}>
                    Location:
                  </Text>
                  <Text style={{ color: colors.foreground, fontSize: fontSize.sm }}>
                    San Francisco, CA
                  </Text>
                </View>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </View>
      </Section>

      <Section title="Multiple Collapsibles">
        <View style={demoBoxStyle}>
          <Collapsible>
            <CollapsibleTrigger>
              <Text style={triggerTextStyle}>Section 1: Getting Started</Text>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={contentStyle}>
                <Text style={contentTextStyle}>
                  Learn the basics of getting started with our platform.
                </Text>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </View>
        <View style={demoBoxStyle}>
          <Collapsible>
            <CollapsibleTrigger>
              <Text style={triggerTextStyle}>Section 2: Advanced Features</Text>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={contentStyle}>
                <Text style={contentTextStyle}>
                  Discover advanced features for power users.
                </Text>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </View>
        <View style={demoBoxStyle}>
          <Collapsible>
            <CollapsibleTrigger>
              <Text style={triggerTextStyle}>Section 3: FAQ</Text>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={contentStyle}>
                <Text style={contentTextStyle}>
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
  container: { gap: 24 }, // spacing[6]
  richTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // spacing[3]
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
