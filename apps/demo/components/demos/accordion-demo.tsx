import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export function AccordionDemo() {
  const { colors, spacing } = useTheme();
  const [controlled, setControlled] = useState<string>('item-1');
  const [multiple, setMultiple] = useState<string[]>(['item-1']);

  return (
    <View style={styles.container}>
      {/* Basic Accordion */}
      <View style={[styles.section, { marginBottom: spacing[6] }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: spacing[3] }]}>
          Single Mode (Collapsible)
        </Text>
        <Accordion type="single" defaultValue="item-1" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Yes. It adheres to the WAI-ARIA design pattern and includes proper accessibility attributes.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Yes. It comes with default styles that match the other components in the library.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Yes. It uses React Native Reanimated for smooth 60fps animations.
              </Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </View>

      {/* Multiple Mode */}
      <View style={[styles.section, { marginBottom: spacing[6] }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: spacing[3] }]}>
          Multiple Mode
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.foregroundMuted, marginBottom: spacing[3] }]}>
          Open: {multiple.length > 0 ? multiple.join(', ') : 'none'}
        </Text>
        <Accordion
          type="multiple"
          value={multiple}
          onValueChange={(val) => setMultiple(val as string[])}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>First Section</AccordionTrigger>
            <AccordionContent>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                This is the first section content. Multiple sections can be open at once.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Second Section</AccordionTrigger>
            <AccordionContent>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                This is the second section content. Try opening both sections.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Third Section</AccordionTrigger>
            <AccordionContent>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                This is the third section content. All three can be open simultaneously.
              </Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </View>

      {/* Controlled Single */}
      <View style={[styles.section, { marginBottom: spacing[6] }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: spacing[3] }]}>
          Controlled (Non-Collapsible)
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.foregroundMuted, marginBottom: spacing[3] }]}>
          Current: {controlled || 'none'}
        </Text>
        <Accordion
          type="single"
          value={controlled}
          onValueChange={(val) => setControlled(val as string)}
          collapsible={false}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Account Settings</AccordionTrigger>
            <AccordionContent>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Manage your account preferences, profile information, and connected services.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Notifications</AccordionTrigger>
            <AccordionContent>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Configure email, push, and in-app notification preferences.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Privacy & Security</AccordionTrigger>
            <AccordionContent>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Review security settings, manage sessions, and control data privacy.
              </Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </View>

      {/* FAQ Style */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: spacing[3] }]}>
          FAQ Style
        </Text>
        <Accordion type="single" collapsible>
          <AccordionItem value="faq-1">
            <AccordionTrigger>How do I get started?</AccordionTrigger>
            <AccordionContent>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Simply run `npx mcellui init` in your Expo project, then add components with `npx mcellui add [component]`.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-2">
            <AccordionTrigger>Can I customize the components?</AccordionTrigger>
            <AccordionContent>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Absolutely! All components are copied to your project, so you have full control over the code.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-3">
            <AccordionTrigger>Is it production ready?</AccordionTrigger>
            <AccordionContent>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Yes! All components are tested on both iOS and Android, with proper accessibility support.
              </Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {},
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
