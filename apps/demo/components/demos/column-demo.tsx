import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Column } from '@/components/ui/column';
import { useTheme } from '@metacells/mcellui-core';

function Box({ children, wide }: { children?: React.ReactNode; wide?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.box, wide && styles.wideBox, { backgroundColor: colors.primary }]}>
      <Text style={[styles.boxText, { color: colors.primaryForeground }]}>{children}</Text>
    </View>
  );
}

export function ColumnDemo() {
  return (
    <View style={styles.container}>
      <Section title="Basic Column">
        <Column gap="md">
          <Box wide>A</Box>
          <Box wide>B</Box>
          <Box wide>C</Box>
        </Column>
      </Section>

      <Section title="Gap Variants">
        <View style={styles.gapGrid}>
          <View style={styles.gapItem}>
            <Text style={styles.label}>xs (8px)</Text>
            <DemoContainer style={{ width: 80 }}>
              <Column gap="xs">
                <Box>1</Box>
                <Box>2</Box>
                <Box>3</Box>
              </Column>
            </DemoContainer>
          </View>
          <View style={styles.gapItem}>
            <Text style={styles.label}>md (16px)</Text>
            <DemoContainer style={{ width: 80 }}>
              <Column gap="md">
                <Box>1</Box>
                <Box>2</Box>
                <Box>3</Box>
              </Column>
            </DemoContainer>
          </View>
          <View style={styles.gapItem}>
            <Text style={styles.label}>xl (32px)</Text>
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
        <Text style={styles.label}>align="start"</Text>
        <DemoContainer>
          <Column gap="sm" align="start">
            <Box>Short</Box>
            <Box wide>Wider Box</Box>
          </Column>
        </DemoContainer>
        <Text style={styles.label}>align="center"</Text>
        <DemoContainer>
          <Column gap="sm" align="center">
            <Box>Short</Box>
            <Box wide>Wider Box</Box>
          </Column>
        </DemoContainer>
        <Text style={styles.label}>align="end"</Text>
        <DemoContainer>
          <Column gap="sm" align="end">
            <Box>Short</Box>
            <Box wide>Wider Box</Box>
          </Column>
        </DemoContainer>
        <Text style={styles.label}>align="stretch"</Text>
        <DemoContainer>
          <Column gap="sm" align="stretch">
            <Box>Stretched</Box>
            <Box>Stretched</Box>
          </Column>
        </DemoContainer>
      </Section>

      <Section title="Justify Content">
        <View style={styles.justifyGrid}>
          <View style={styles.justifyItem}>
            <Text style={styles.label}>start</Text>
            <DemoContainer style={{ height: 150 }}>
              <Column gap="sm" justify="start" style={{ height: '100%' }}>
                <Box>A</Box>
                <Box>B</Box>
              </Column>
            </DemoContainer>
          </View>
          <View style={styles.justifyItem}>
            <Text style={styles.label}>center</Text>
            <DemoContainer style={{ height: 150 }}>
              <Column gap="sm" justify="center" style={{ height: '100%' }}>
                <Box>A</Box>
                <Box>B</Box>
              </Column>
            </DemoContainer>
          </View>
          <View style={styles.justifyItem}>
            <Text style={styles.label}>end</Text>
            <DemoContainer style={{ height: 150 }}>
              <Column gap="sm" justify="end" style={{ height: '100%' }}>
                <Box>A</Box>
                <Box>B</Box>
              </Column>
            </DemoContainer>
          </View>
          <View style={styles.justifyItem}>
            <Text style={styles.label}>between</Text>
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
        <Text style={styles.label}>Two columns with flex={1}</Text>
        <DemoContainer>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Column flex={1} gap="xs" style={{ backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 8, padding: 8 }}>
              <Box>1</Box>
              <Box>2</Box>
            </Column>
            <Column flex={1} gap="xs" style={{ backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 8, padding: 8 }}>
              <Box>A</Box>
              <Box>B</Box>
            </Column>
          </View>
        </DemoContainer>
      </Section>

      <Section title="Padding">
        <Text style={styles.label}>p="md" (padding all sides)</Text>
        <DemoContainer>
          <Column gap="sm" p="md" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <Box wide>A</Box>
            <Box wide>B</Box>
          </Column>
        </DemoContainer>
        <Text style={styles.label}>py="lg" (vertical padding)</Text>
        <DemoContainer>
          <Column gap="sm" py="lg" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <Box wide>A</Box>
            <Box wide>B</Box>
          </Column>
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
  wideBox: {
    width: '100%',
  },
  boxText: {
    fontSize: 16,
    fontWeight: '600',
  },
  demoContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'dashed',
    padding: 8,
  },
  gapGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  gapItem: {
    gap: 4,
  },
  justifyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  justifyItem: {
    flex: 1,
    minWidth: 70,
    gap: 4,
  },
});
