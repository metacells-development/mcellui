import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Row } from '@/components/ui/row';
import { useTheme } from '@metacells/mcellui-core';
import { Section } from './section';

function Box({ children }: { children?: React.ReactNode }) {
  const { colors, radius } = useTheme();
  return (
    <View style={[styles.box, { backgroundColor: colors.primary, borderRadius: radius.md }]}>
      <Text style={[styles.boxText, { color: colors.primaryForeground }]}>{children}</Text>
    </View>
  );
}

function TallBox({ children }: { children?: React.ReactNode }) {
  const { colors, radius, fontSize, fontWeight } = useTheme();

  const tallBoxStyle: ViewStyle = {
    width: 44,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const tallBoxTextStyle: TextStyle = {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.secondaryForeground,
  };

  return (
    <View style={tallBoxStyle}>
      <Text style={tallBoxTextStyle}>{children}</Text>
    </View>
  );
}

export function RowDemo() {
  const { colors, spacing, fontSize } = useTheme();

  const containerStyle: ViewStyle = {
    gap: spacing[6], // 24px
  };

  const labelStyle: TextStyle = {
    fontSize: fontSize.xs,
    color: colors.foregroundMuted,
    marginTop: 4,
  };

  return (
    <View style={containerStyle}>
      <Section title="Basic Row">
        <Row gap="md">
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </Row>
      </Section>

      <Section title="Gap Variants">
        <Text style={labelStyle}>gap="xs" (8px)</Text>
        <Row gap="xs">
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Row>
        <Text style={labelStyle}>gap="md" (16px)</Text>
        <Row gap="md">
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Row>
        <Text style={labelStyle}>gap="xl" (32px)</Text>
        <Row gap="xl">
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Row>
        <Text style={labelStyle}>gap={6} (spacing[6] = 24px)</Text>
        <Row gap={6}>
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Row>
      </Section>

      <Section title="Justify Content">
        <Text style={labelStyle}>justify="start"</Text>
        <DemoContainer>
          <Row gap="sm" justify="start">
            <Box>A</Box>
            <Box>B</Box>
          </Row>
        </DemoContainer>
        <Text style={labelStyle}>justify="center"</Text>
        <DemoContainer>
          <Row gap="sm" justify="center">
            <Box>A</Box>
            <Box>B</Box>
          </Row>
        </DemoContainer>
        <Text style={labelStyle}>justify="end"</Text>
        <DemoContainer>
          <Row gap="sm" justify="end">
            <Box>A</Box>
            <Box>B</Box>
          </Row>
        </DemoContainer>
        <Text style={labelStyle}>justify="between"</Text>
        <DemoContainer>
          <Row gap="sm" justify="between">
            <Box>A</Box>
            <Box>B</Box>
          </Row>
        </DemoContainer>
      </Section>

      <Section title="Align Items">
        <Text style={labelStyle}>align="start"</Text>
        <DemoContainer style={{ height: 80 }}>
          <Row gap="sm" align="start" style={{ height: '100%' }}>
            <Box>A</Box>
            <TallBox>Tall</TallBox>
          </Row>
        </DemoContainer>
        <Text style={labelStyle}>align="center"</Text>
        <DemoContainer style={{ height: 80 }}>
          <Row gap="sm" align="center" style={{ height: '100%' }}>
            <Box>A</Box>
            <TallBox>Tall</TallBox>
          </Row>
        </DemoContainer>
        <Text style={labelStyle}>align="end"</Text>
        <DemoContainer style={{ height: 80 }}>
          <Row gap="sm" align="end" style={{ height: '100%' }}>
            <Box>A</Box>
            <TallBox>Tall</TallBox>
          </Row>
        </DemoContainer>
      </Section>

      <Section title="Wrap">
        <DemoContainer>
          <Row gap="sm" wrap>
            <Box>1</Box>
            <Box>2</Box>
            <Box>3</Box>
            <Box>4</Box>
            <Box>5</Box>
            <Box>6</Box>
            <Box>7</Box>
            <Box>8</Box>
          </Row>
        </DemoContainer>
      </Section>

      <Section title="Padding">
        <Text style={labelStyle}>p="md" (padding all sides)</Text>
        <DemoContainer>
          <Row gap="sm" p="md" style={{ backgroundColor: colors.backgroundMuted }}>
            <Box>A</Box>
            <Box>B</Box>
          </Row>
        </DemoContainer>
        <Text style={labelStyle}>px="lg" (horizontal padding)</Text>
        <DemoContainer>
          <Row gap="sm" px="lg" style={{ backgroundColor: colors.backgroundMuted }}>
            <Box>A</Box>
            <Box>B</Box>
          </Row>
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
  boxText: {
    fontWeight: '600',
  },
});
