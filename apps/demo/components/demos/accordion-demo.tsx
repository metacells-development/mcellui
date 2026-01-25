import React, { useState } from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Section } from './section';

export function AccordionDemo() {
  const { colors, spacing, fontSize } = useTheme();
  const [controlled, setControlled] = useState<string>('item-1');
  const [multiple, setMultiple] = useState<string[]>(['item-1']);

  const contentTextStyle: TextStyle = {
    fontSize: fontSize.sm, // 14px
    lineHeight: 20,
    color: colors.foregroundMuted,
  };

  const descriptionStyle: TextStyle = {
    fontSize: fontSize.sm, // 14px
    color: colors.foregroundMuted,
    marginBottom: spacing[3], // 12px
  };

  return (
    <View style={styles.container}>
      <Section title="Single Mode (Collapsible)">
        <Accordion type="single" defaultValue="item-1" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              <Text style={contentTextStyle}>
                Yes. It adheres to the WAI-ARIA design pattern and includes proper accessibility attributes.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              <Text style={contentTextStyle}>
                Yes. It comes with default styles that match the other components in the library.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              <Text style={contentTextStyle}>
                Yes. It uses React Native Reanimated for smooth 60fps animations.
              </Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="Multiple Mode">
        <Text style={descriptionStyle}>
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
              <Text style={contentTextStyle}>
                This is the first section content. Multiple sections can be open at once.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Second Section</AccordionTrigger>
            <AccordionContent>
              <Text style={contentTextStyle}>
                This is the second section content. Try opening both sections.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Third Section</AccordionTrigger>
            <AccordionContent>
              <Text style={contentTextStyle}>
                This is the third section content. All three can be open simultaneously.
              </Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="Controlled (Non-Collapsible)">
        <Text style={descriptionStyle}>Current: {controlled || 'none'}</Text>
        <Accordion
          type="single"
          value={controlled}
          onValueChange={(val) => setControlled(val as string)}
          collapsible={false}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Account Settings</AccordionTrigger>
            <AccordionContent>
              <Text style={contentTextStyle}>
                Manage your account preferences, profile information, and connected services.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Notifications</AccordionTrigger>
            <AccordionContent>
              <Text style={contentTextStyle}>
                Configure email, push, and in-app notification preferences.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Privacy & Security</AccordionTrigger>
            <AccordionContent>
              <Text style={contentTextStyle}>
                Review security settings, manage sessions, and control data privacy.
              </Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="With Disabled Item">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Available Item</AccordionTrigger>
            <AccordionContent>
              <Text style={contentTextStyle}>
                This item is available and can be opened normally.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" disabled>
            <AccordionTrigger>Disabled Item</AccordionTrigger>
            <AccordionContent>
              <Text style={contentTextStyle}>
                This content won't be visible because the item is disabled.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Another Available Item</AccordionTrigger>
            <AccordionContent>
              <Text style={contentTextStyle}>
                This item is also available and interactive.
              </Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="FAQ Style">
        <Accordion type="single" collapsible>
          <AccordionItem value="faq-1">
            <AccordionTrigger>How do I get started?</AccordionTrigger>
            <AccordionContent>
              <Text style={contentTextStyle}>
                Simply run `npx mcellui init` in your Expo project, then add components with `npx mcellui add [component]`.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-2">
            <AccordionTrigger>Can I customize the components?</AccordionTrigger>
            <AccordionContent>
              <Text style={contentTextStyle}>
                Absolutely! All components are copied to your project, so you have full control over the code.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-3">
            <AccordionTrigger>Is it production ready?</AccordionTrigger>
            <AccordionContent>
              <Text style={contentTextStyle}>
                Yes! All components are tested on both iOS and Android, with proper accessibility support.
              </Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="Long Content">
        <Text style={descriptionStyle}>
          Handles scrollable content gracefully
        </Text>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Terms and Conditions</AccordionTrigger>
            <AccordionContent>
              <Text style={contentTextStyle}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{'\n\n'}
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.{'\n\n'}
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Privacy Policy</AccordionTrigger>
            <AccordionContent>
              <Text style={contentTextStyle}>
                We collect and process your personal data in accordance with applicable data protection laws. This includes information you provide when creating an account, using our services, or contacting support.{'\n\n'}
                Your data is stored securely and is only used for the purposes described in this policy. We do not sell or share your personal information with third parties without your consent.
              </Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24, // spacing[6]
  },
});
