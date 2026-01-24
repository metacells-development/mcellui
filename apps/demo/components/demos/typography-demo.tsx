import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Typography,
  H1, H2, H3, H4, H5, H6,
  Body, BodyLarge, BodySmall,
  Caption, Overline, Code,
} from '@/components/ui/typography';
import { Section } from './section';

export function TypographyDemo() {
  return (
    <View style={styles.container}>
      <Section title="Headings">
        <H1>Heading 1 (30px)</H1>
        <H2>Heading 2 (24px)</H2>
        <H3>Heading 3 (20px)</H3>
        <H4>Heading 4 (18px)</H4>
        <H5>Heading 5 (16px)</H5>
        <H6>Heading 6 (14px)</H6>
      </Section>

      <Section title="Body Text">
        <BodyLarge>Body Large - For emphasized body text (18px)</BodyLarge>
        <Body>Body - Default body text for content (16px)</Body>
        <BodySmall>Body Small - Secondary text and descriptions (14px)</BodySmall>
      </Section>

      <Section title="UI Text">
        <Typography variant="label">Label - Form labels and UI elements</Typography>
        <Typography variant="labelSm">Label Small - Smaller labels</Typography>
        <Typography variant="button">Button - Button text style</Typography>
        <Caption>Caption - Image captions and fine print (11px)</Caption>
        <Overline>OVERLINE - SECTION LABELS</Overline>
      </Section>

      <Section title="Code">
        <Code>const greeting = "Hello, World!";</Code>
      </Section>

      <Section title="Colors">
        <Typography color="primary">Primary colored text</Typography>
        <Typography color="muted">Muted/secondary text</Typography>
        <Typography color="error">Error/destructive text</Typography>
        <Typography color="#9333ea">Custom purple color</Typography>
      </Section>

      <Section title="Styling Options">
        <Typography bold>Bold text</Typography>
        <Typography italic>Italic text</Typography>
        <Typography underline>Underlined text</Typography>
        <Typography strikethrough>Strikethrough text</Typography>
        <Typography bold italic>Bold and italic combined</Typography>
      </Section>

      <Section title="Alignment">
        <Typography align="left">Left aligned text</Typography>
        <Typography align="center">Center aligned text</Typography>
        <Typography align="right">Right aligned text</Typography>
      </Section>

      <Section title="Number of Lines">
        <Typography numberOfLines={1}>
          This is a very long text that will be truncated after one line. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Typography>
        <Typography numberOfLines={2}>
          This is a very long text that will be truncated after two lines. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Typography>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
});
