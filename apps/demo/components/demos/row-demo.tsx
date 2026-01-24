import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Row } from '@/components/ui/row';
import { useTheme } from '@metacells/mcellui-core';

function Box({ children }: { children?: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.box, { backgroundColor: colors.primary }]}>
      <Text style={[styles.boxText, { color: colors.primaryForeground }]}>{children}</Text>
    </View>
  );
}

export function RowDemo() {
  return (
    <View style={styles.container}>
      <Section title="Basic Row">
        <Row gap="md">
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </Row>
      </Section>

      <Section title="Gap Variants">
        <Text style={styles.label}>gap="xs" (8px)</Text>
        <Row gap="xs">
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Row>
        <Text style={styles.label}>gap="md" (16px)</Text>
        <Row gap="md">
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Row>
        <Text style={styles.label}>gap="xl" (32px)</Text>
        <Row gap="xl">
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Row>
        <Text style={styles.label}>gap={6} (spacing[6] = 24px)</Text>
        <Row gap={6}>
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Row>
      </Section>

      <Section title="Justify Content">
        <Text style={styles.label}>justify="start"</Text>
        <DemoContainer>
          <Row gap="sm" justify="start">
            <Box>A</Box>
            <Box>B</Box>
          </Row>
        </DemoContainer>
        <Text style={styles.label}>justify="center"</Text>
        <DemoContainer>
          <Row gap="sm" justify="center">
            <Box>A</Box>
            <Box>B</Box>
          </Row>
        </DemoContainer>
        <Text style={styles.label}>justify="end"</Text>
        <DemoContainer>
          <Row gap="sm" justify="end">
            <Box>A</Box>
            <Box>B</Box>
          </Row>
        </DemoContainer>
        <Text style={styles.label}>justify="between"</Text>
        <DemoContainer>
          <Row gap="sm" justify="between">
            <Box>A</Box>
            <Box>B</Box>
          </Row>
        </DemoContainer>
      </Section>

      <Section title="Align Items">
        <Text style={styles.label}>align="start"</Text>
        <DemoContainer style={{ height: 80 }}>
          <Row gap="sm" align="start" style={{ height: '100%' }}>
            <Box>A</Box>
            <View style={styles.tallBox}><Text style={styles.tallBoxText}>Tall</Text></View>
          </Row>
        </DemoContainer>
        <Text style={styles.label}>align="center"</Text>
        <DemoContainer style={{ height: 80 }}>
          <Row gap="sm" align="center" style={{ height: '100%' }}>
            <Box>A</Box>
            <View style={styles.tallBox}><Text style={styles.tallBoxText}>Tall</Text></View>
          </Row>
        </DemoContainer>
        <Text style={styles.label}>align="end"</Text>
        <DemoContainer style={{ height: 80 }}>
          <Row gap="sm" align="end" style={{ height: '100%' }}>
            <Box>A</Box>
            <View style={styles.tallBox}><Text style={styles.tallBoxText}>Tall</Text></View>
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
        <Text style={styles.label}>p="md" (padding all sides)</Text>
        <DemoContainer>
          <Row gap="sm" p="md" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <Box>A</Box>
            <Box>B</Box>
          </Row>
        </DemoContainer>
        <Text style={styles.label}>px="lg" (horizontal padding)</Text>
        <DemoContainer>
          <Row gap="sm" px="lg" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <Box>A</Box>
            <Box>B</Box>
          </Row>
        </DemoContainer>
      </Section>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

function DemoContainer({ children, style }: { children: React.ReactNode; style?: any }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.demoContainer, { borderColor: colors.border }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#737373', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionContent: { gap: 8 },
  label: { fontSize: 12, color: '#737373', marginTop: 4 },
  box: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tallBox: {
    width: 44,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tallBoxText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  demoContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'dashed',
    padding: 8,
  },
});
