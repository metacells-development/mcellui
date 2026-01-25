import React from 'react';
import { View, Text } from 'react-native';
import {
  Typography,
  H1, H2, H3, H4, H5, H6,
  Body, BodyLarge, BodySmall,
  Caption, Overline, Code,
} from '@/components/ui/typography';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

export function TypographyDemo() {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={{ gap: spacing[8] }}>
      {/* Headings Section */}
      <Section title="Headings">
        <View style={{ gap: spacing[3] }}>
          <View style={{ gap: spacing[1] }}>
            <H1>Heading 1</H1>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>30px - Page titles</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <H2>Heading 2</H2>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>24px - Section titles</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <H3>Heading 3</H3>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>20px - Subsections</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <H4>Heading 4</H4>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>18px - Card titles</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <H5>Heading 5</H5>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>16px - List headers</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <H6>Heading 6</H6>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>14px - Small headings</Text>
          </View>
        </View>
      </Section>

      {/* Body Text Section */}
      <Section title="Body Text">
        <View style={{ gap: spacing[3] }}>
          <View style={{ gap: spacing[1] }}>
            <BodyLarge>Body Large - For emphasized body text</BodyLarge>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>18px - Intro paragraphs</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Body>Body - Default body text for content</Body>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>16px - Standard content</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <BodySmall>Body Small - Secondary text and descriptions</BodySmall>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>14px - Supporting text</Text>
          </View>
        </View>
      </Section>

      {/* UI Text Section */}
      <Section title="UI Text">
        <View style={{ gap: spacing[3] }}>
          <View style={{ gap: spacing[1] }}>
            <Typography variant="label">Label - Form labels and UI elements</Typography>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>For form labels</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Typography variant="labelSm">Label Small - Smaller labels</Typography>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>For compact UI</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Typography variant="button">Button - Button text style</Typography>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>For button labels</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Caption>Caption - Image captions and fine print</Caption>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>11px - Small annotations</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Overline>OVERLINE - SECTION LABELS</Overline>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>Uppercase category labels</Text>
          </View>
        </View>
      </Section>

      {/* Code Section */}
      <Section title="Code">
        <View style={{ gap: spacing[2] }}>
          <Code>const greeting = "Hello, World!";</Code>
          <Code>function add(a, b) {'{'} return a + b; {'}'}</Code>
        </View>
      </Section>

      {/* Decorations Section */}
      <Section title="Decorations">
        <View style={{ gap: spacing[2] }}>
          <Typography bold>Bold text</Typography>
          <Typography italic>Italic text</Typography>
          <Typography underline>Underlined text</Typography>
          <Typography strikethrough>Strikethrough text</Typography>
          <Typography bold italic>Bold and italic combined</Typography>
          <Typography bold underline>Bold and underlined</Typography>
        </View>
      </Section>

      {/* Colors Section */}
      <Section title="Colors">
        <View style={{ gap: spacing[3] }}>
          <View style={{ gap: spacing[1] }}>
            <Typography>Default - Uses foreground color</Typography>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>color={'{colors.foreground}'}</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Typography color="muted">Muted - Secondary text color</Typography>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>color="muted"</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Typography color="primary">Primary - Accent color</Typography>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>color="primary"</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Typography color="error">Error - Destructive/error color</Typography>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>color="error"</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Typography color="#9333ea">Custom - Any hex color</Typography>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>color="#9333ea"</Text>
          </View>
        </View>
      </Section>

      {/* Alignment Section */}
      <Section title="Alignment">
        <View style={{ gap: spacing[3] }}>
          <View
            style={{
              backgroundColor: colors.backgroundMuted,
              padding: spacing[2],
              borderRadius: 4,
            }}
          >
            <Typography align="left">Left aligned text (default)</Typography>
          </View>
          <View
            style={{
              backgroundColor: colors.backgroundMuted,
              padding: spacing[2],
              borderRadius: 4,
            }}
          >
            <Typography align="center">Center aligned text</Typography>
          </View>
          <View
            style={{
              backgroundColor: colors.backgroundMuted,
              padding: spacing[2],
              borderRadius: 4,
            }}
          >
            <Typography align="right">Right aligned text</Typography>
          </View>
        </View>
      </Section>

      {/* Truncation Section */}
      <Section title="Text Truncation">
        <View style={{ gap: spacing[3] }}>
          <View style={{ gap: spacing[1] }}>
            <Typography numberOfLines={1}>
              This is a very long text that will be truncated after one line. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Typography>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>numberOfLines={'{1}'}</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Typography numberOfLines={2}>
              This is a very long text that will be truncated after two lines. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>numberOfLines={'{2}'}</Text>
          </View>
        </View>
      </Section>

      {/* Heading Comparison Section */}
      <Section title="Heading Scale Comparison">
        <View
          style={{
            backgroundColor: colors.card,
            padding: spacing[4],
            borderRadius: 8,
            gap: spacing[2],
          }}
        >
          <H1>H1 - 30px Bold</H1>
          <H2>H2 - 24px Semibold</H2>
          <H3>H3 - 20px Semibold</H3>
          <H4>H4 - 18px Semibold</H4>
          <H5>H5 - 16px Semibold</H5>
          <H6>H6 - 14px Semibold</H6>
        </View>
      </Section>
    </View>
  );
}
