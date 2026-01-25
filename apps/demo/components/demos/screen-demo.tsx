import React, { useState } from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { Screen } from '@/components/ui/screen';
import { Button } from '@/components/ui/button';
import { useTheme } from '@metacells/mcellui-core';
import { Section } from './section';

export function ScreenDemo() {
  const { colors, spacing, fontSize, radius } = useTheme();
  const [showFullScreen, setShowFullScreen] = useState<string | null>(null);

  // Full screen preview
  if (showFullScreen) {
    const fullScreenContentStyle: ViewStyle = {
      flex: 1,
      gap: spacing[4],
      paddingTop: spacing[10],
    };

    const fullScreenTitleStyle: TextStyle = {
      fontSize: fontSize['2xl'],
      fontWeight: '700',
      color: colors.foreground,
    };

    const fullScreenSubtitleStyle: TextStyle = {
      fontSize: fontSize.md,
      color: colors.foregroundMuted,
    };

    const scrollContentStyle: ViewStyle = {
      gap: spacing[2],
      marginVertical: spacing[4],
    };

    const scrollItemStyle: ViewStyle = {
      padding: spacing[4],
      borderRadius: radius.md,
      borderWidth: 1,
      backgroundColor: colors.card,
      borderColor: colors.border,
    };

    return (
      <Screen
        variant={showFullScreen as any}
        scroll={showFullScreen === 'scroll'}
        padded
      >
        <View style={fullScreenContentStyle}>
          <Text style={fullScreenTitleStyle}>
            {showFullScreen === 'scroll' ? 'Scrollable Screen' : `${showFullScreen.charAt(0).toUpperCase() + showFullScreen.slice(1)} Variant`}
          </Text>
          <Text style={fullScreenSubtitleStyle}>
            This is a full-screen preview
          </Text>

          {showFullScreen === 'scroll' && (
            <View style={scrollContentStyle}>
              {Array.from({ length: 20 }).map((_, i) => (
                <View key={i} style={scrollItemStyle}>
                  <Text style={{ color: colors.foreground }}>Item {i + 1}</Text>
                </View>
              ))}
            </View>
          )}

          <Button onPress={() => setShowFullScreen(null)}>
            Back to Demo
          </Button>
        </View>
      </Screen>
    );
  }

  const containerStyle: ViewStyle = {
    gap: spacing[6],
  };

  const descriptionStyle: TextStyle = {
    fontSize: fontSize.sm,
    lineHeight: 20,
    color: colors.foregroundMuted,
  };

  const labelStyle: TextStyle = {
    fontSize: fontSize.xs,
    marginBottom: 4,
    color: colors.foregroundMuted,
  };

  const variantGridStyle: ViewStyle = {
    flexDirection: 'row',
    gap: spacing[3],
  };

  const buttonGridStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  };

  const codeBlockStyle: ViewStyle = {
    padding: spacing[3],
    borderRadius: radius.md,
    backgroundColor: colors.backgroundMuted,
  };

  const codeStyle: TextStyle = {
    fontSize: fontSize.xs,
    fontFamily: 'monospace',
    color: colors.foreground,
  };

  return (
    <View style={containerStyle}>
      <Section title="About Screen">
        <Text style={descriptionStyle}>
          Screen is a container component that handles safe area insets,
          background colors, and optional scrolling. Use it as the root
          component for your app screens.
        </Text>
      </Section>

      <Section title="Variants">
        <Text style={labelStyle}>
          Three background variants available
        </Text>
        <View style={variantGridStyle}>
          <VariantPreview variant="default" label="default" />
          <VariantPreview variant="surface" label="surface" />
          <VariantPreview variant="muted" label="muted" />
        </View>
      </Section>

      <Section title="Props Overview">
        <PropsTable />
      </Section>

      <Section title="Try Full Screen">
        <Text style={labelStyle}>
          Tap a button to see the Screen component in action
        </Text>
        <View style={buttonGridStyle}>
          <Button variant="outline" onPress={() => setShowFullScreen('default')}>
            Default
          </Button>
          <Button variant="outline" onPress={() => setShowFullScreen('surface')}>
            Surface
          </Button>
          <Button variant="outline" onPress={() => setShowFullScreen('muted')}>
            Muted
          </Button>
          <Button variant="outline" onPress={() => setShowFullScreen('scroll')}>
            Scrollable
          </Button>
        </View>
      </Section>

      <Section title="Usage Example">
        <View style={codeBlockStyle}>
          <Text style={codeStyle}>
{`<Screen
  scroll
  padded
  variant="surface"
>
  <Header />
  <Content />
  <Footer />
</Screen>`}
          </Text>
        </View>
      </Section>

      <Section title="Safe Area Edges">
        <Text style={labelStyle}>
          Control which edges respect safe area insets
        </Text>
        <View style={codeBlockStyle}>
          <Text style={codeStyle}>
{`// Only top and bottom safe area
<Screen edges={['top', 'bottom']}>

// No safe area (full bleed)
<Screen edges={[]}>

// All edges (default)
<Screen edges={['top', 'bottom', 'left', 'right']}>`}
          </Text>
        </View>
      </Section>
    </View>
  );
}

function VariantPreview({ variant, label }: { variant: 'default' | 'surface' | 'muted'; label: string }) {
  const { colors, spacing, radius, fontSize } = useTheme();

  const backgroundColor =
    variant === 'default' ? colors.background :
    variant === 'surface' ? colors.backgroundSubtle :
    colors.backgroundMuted;

  const variantItemStyle: ViewStyle = {
    flex: 1,
    gap: spacing[1],
  };

  const variantBoxStyle: ViewStyle = {
    height: 100,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing[3],
    justifyContent: 'center',
    backgroundColor,
    borderColor: colors.border,
  };

  const variantContentStyle: ViewStyle = {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
  };

  const variantContentTextStyle: TextStyle = {
    fontSize: fontSize.xs,
    color: colors.foreground,
  };

  const variantLabelStyle: TextStyle = {
    fontSize: fontSize.xs,
    textAlign: 'center',
    fontWeight: '500',
    color: colors.foreground,
  };

  return (
    <View style={variantItemStyle}>
      <View style={variantBoxStyle}>
        <View style={variantContentStyle}>
          <Text style={variantContentTextStyle}>Content</Text>
        </View>
      </View>
      <Text style={variantLabelStyle}>{label}</Text>
    </View>
  );
}

function PropsTable() {
  const { colors, radius } = useTheme();

  const propsTableStyle: ViewStyle = {
    borderWidth: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderColor: colors.border,
  };

  return (
    <View style={propsTableStyle}>
      <PropRow name="scroll" type="boolean" description="Enable scrolling" />
      <PropRow name="padded" type="boolean" description="Add horizontal padding (16px)" />
      <PropRow name="variant" type="'default' | 'surface' | 'muted'" description="Background color" />
      <PropRow name="edges" type="Edge[]" description="Safe area edges to respect" />
    </View>
  );
}

function PropRow({ name, type, description }: { name: string; type: string; description: string }) {
  const { colors, spacing, fontSize } = useTheme();

  const propRowStyle: ViewStyle = {
    padding: spacing[2.5],
    borderBottomWidth: 1,
    gap: spacing[0.5],
    borderColor: colors.border,
  };

  const propNameStyle: TextStyle = {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  };

  const propTypeStyle: TextStyle = {
    fontSize: fontSize.xs,
    fontFamily: 'monospace',
    color: colors.foregroundMuted,
  };

  const propDescStyle: TextStyle = {
    fontSize: fontSize.xs,
    color: colors.foreground,
  };

  return (
    <View style={propRowStyle}>
      <Text style={propNameStyle}>{name}</Text>
      <Text style={propTypeStyle}>{type}</Text>
      <Text style={propDescStyle}>{description}</Text>
    </View>
  );
}
