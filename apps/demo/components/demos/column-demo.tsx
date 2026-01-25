import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Column } from '@/components/ui/column';
import { useTheme } from '@metacells/mcellui-core';
import { Section } from './section';

function Box({ children, wide }: { children?: React.ReactNode; wide?: boolean }) {
  const { colors, radius } = useTheme();
  return (
    <View style={[styles.box, wide && styles.wideBox, { backgroundColor: colors.primary, borderRadius: radius.md }]}>
      <Text style={[styles.boxText, { color: colors.primaryForeground }]}>{children}</Text>
    </View>
  );
}

export function ColumnDemo() {
  const { colors, spacing, fontSize, radius } = useTheme();

  const containerStyle: ViewStyle = {
    gap: spacing[6], // 24px
  };

  const labelStyle: TextStyle = {
    fontSize: fontSize.xs,
    color: colors.foregroundMuted,
    marginTop: 4,
  };

  const gapGridStyle: ViewStyle = {
    flexDirection: 'row',
    gap: spacing[4], // 16px
  };

  const gapItemStyle: ViewStyle = {
    gap: spacing[1], // 4px
  };

  const justifyGridStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2], // 8px
  };

  const justifyItemStyle: ViewStyle = {
    flex: 1,
    minWidth: 70,
    gap: spacing[1], // 4px
  };

  return (
    <View style={containerStyle}>
      <Section title="Basic Column">
        <Column gap="md">
          <Box wide>A</Box>
          <Box wide>B</Box>
          <Box wide>C</Box>
        </Column>
      </Section>

      <Section title="Gap Variants">
        <View style={gapGridStyle}>
          <View style={gapItemStyle}>
            <Text style={labelStyle}>xs (8px)</Text>
            <DemoContainer style={{ width: 80 }}>
              <Column gap="xs">
                <Box>1</Box>
                <Box>2</Box>
                <Box>3</Box>
              </Column>
            </DemoContainer>
          </View>
          <View style={gapItemStyle}>
            <Text style={labelStyle}>md (16px)</Text>
            <DemoContainer style={{ width: 80 }}>
              <Column gap="md">
                <Box>1</Box>
                <Box>2</Box>
                <Box>3</Box>
              </Column>
            </DemoContainer>
          </View>
          <View style={gapItemStyle}>
            <Text style={labelStyle}>xl (32px)</Text>
            <DemoContainer style={{ width: 80 }}>
              <Column gap="xl">
                <Box>1</Box>
                <Box>2</Box>
                <Box>3</Box>
              </Column>
            </DemoContainer>
          </View>
        </View>
      </Section>

      <Section title="Align Items">
        <Text style={labelStyle}>align="start"</Text>
        <DemoContainer>
          <Column gap="sm" align="start">
            <Box>Short</Box>
            <Box wide>Wider Box</Box>
          </Column>
        </DemoContainer>
        <Text style={labelStyle}>align="center"</Text>
        <DemoContainer>
          <Column gap="sm" align="center">
            <Box>Short</Box>
            <Box wide>Wider Box</Box>
          </Column>
        </DemoContainer>
        <Text style={labelStyle}>align="end"</Text>
        <DemoContainer>
          <Column gap="sm" align="end">
            <Box>Short</Box>
            <Box wide>Wider Box</Box>
          </Column>
        </DemoContainer>
        <Text style={labelStyle}>align="stretch"</Text>
        <DemoContainer>
          <Column gap="sm" align="stretch">
            <Box>Stretched</Box>
            <Box>Stretched</Box>
          </Column>
        </DemoContainer>
      </Section>

      <Section title="Justify Content">
        <View style={justifyGridStyle}>
          <View style={justifyItemStyle}>
            <Text style={labelStyle}>start</Text>
            <DemoContainer style={{ height: 150 }}>
              <Column gap="sm" justify="start" style={{ height: '100%' }}>
                <Box>A</Box>
                <Box>B</Box>
              </Column>
            </DemoContainer>
          </View>
          <View style={justifyItemStyle}>
            <Text style={labelStyle}>center</Text>
            <DemoContainer style={{ height: 150 }}>
              <Column gap="sm" justify="center" style={{ height: '100%' }}>
                <Box>A</Box>
                <Box>B</Box>
              </Column>
            </DemoContainer>
          </View>
          <View style={justifyItemStyle}>
            <Text style={labelStyle}>end</Text>
            <DemoContainer style={{ height: 150 }}>
              <Column gap="sm" justify="end" style={{ height: '100%' }}>
                <Box>A</Box>
                <Box>B</Box>
              </Column>
            </DemoContainer>
          </View>
          <View style={justifyItemStyle}>
            <Text style={labelStyle}>between</Text>
            <DemoContainer style={{ height: 150 }}>
              <Column gap="sm" justify="between" style={{ height: '100%' }}>
                <Box>A</Box>
                <Box>B</Box>
              </Column>
            </DemoContainer>
          </View>
        </View>
      </Section>

      <Section title="Flex">
        <Text style={labelStyle}>Two columns with flex={1}</Text>
        <DemoContainer>
          <View style={{ flexDirection: 'row', gap: spacing[2] }}>
            <Column flex={1} gap="xs" style={{ backgroundColor: colors.backgroundMuted, borderRadius: radius.md, padding: spacing[2] }}>
              <Box>1</Box>
              <Box>2</Box>
            </Column>
            <Column flex={1} gap="xs" style={{ backgroundColor: colors.backgroundMuted, borderRadius: radius.md, padding: spacing[2] }}>
              <Box>A</Box>
              <Box>B</Box>
            </Column>
          </View>
        </DemoContainer>
      </Section>

      <Section title="Padding">
        <Text style={labelStyle}>p="md" (padding all sides)</Text>
        <DemoContainer>
          <Column gap="sm" p="md" style={{ backgroundColor: colors.backgroundMuted }}>
            <Box wide>A</Box>
            <Box wide>B</Box>
          </Column>
        </DemoContainer>
        <Text style={labelStyle}>py="lg" (vertical padding)</Text>
        <DemoContainer>
          <Column gap="sm" py="lg" style={{ backgroundColor: colors.backgroundMuted }}>
            <Box wide>A</Box>
            <Box wide>B</Box>
          </Column>
        </DemoContainer>
      </Section>
    </View>
  );
}

function DemoContainer({ children, style }: { children: React.ReactNode; style?: any }) {
  const { colors, spacing, radius } = useTheme();

  const demoContainerStyle: ViewStyle = {
    borderWidth: 1,
    borderRadius: radius.md,
    borderStyle: 'dashed',
    padding: spacing[2],
    borderColor: colors.border,
  };

  return (
    <View style={[demoContainerStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wideBox: {
    width: '100%',
  },
  boxText: {
    fontWeight: '600',
  },
});
