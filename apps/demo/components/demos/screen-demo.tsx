import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '@/components/ui/screen';
import { Button } from '@/components/ui/button';
import { useTheme } from '@metacells/mcellui-core';

export function ScreenDemo() {
  const { colors } = useTheme();
  const [showFullScreen, setShowFullScreen] = useState<string | null>(null);

  // Full screen preview
  if (showFullScreen) {
    return (
      <Screen
        variant={showFullScreen as any}
        scroll={showFullScreen === 'scroll'}
        padded
      >
        <View style={styles.fullScreenContent}>
          <Text style={[styles.fullScreenTitle, { color: colors.foreground }]}>
            {showFullScreen === 'scroll' ? 'Scrollable Screen' : `${showFullScreen.charAt(0).toUpperCase() + showFullScreen.slice(1)} Variant`}
          </Text>
          <Text style={[styles.fullScreenSubtitle, { color: colors.foregroundMuted }]}>
            This is a full-screen preview
          </Text>

          {showFullScreen === 'scroll' && (
            <View style={styles.scrollContent}>
              {Array.from({ length: 20 }).map((_, i) => (
                <View key={i} style={[styles.scrollItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
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

  return (
    <View style={styles.container}>
      <Section title="About Screen">
        <Text style={[styles.description, { color: colors.foregroundMuted }]}>
          Screen is a container component that handles safe area insets,
          background colors, and optional scrolling. Use it as the root
          component for your app screens.
        </Text>
      </Section>

      <Section title="Variants">
        <Text style={[styles.label, { color: colors.foregroundMuted }]}>
          Three background variants available
        </Text>
        <View style={styles.variantGrid}>
          <VariantPreview variant="default" label="default" />
          <VariantPreview variant="surface" label="surface" />
          <VariantPreview variant="muted" label="muted" />
        </View>
      </Section>

      <Section title="Props Overview">
        <View style={[styles.propsTable, { borderColor: colors.border }]}>
          <PropRow name="scroll" type="boolean" description="Enable scrolling" />
          <PropRow name="padded" type="boolean" description="Add horizontal padding (16px)" />
          <PropRow name="variant" type="'default' | 'surface' | 'muted'" description="Background color" />
          <PropRow name="edges" type="Edge[]" description="Safe area edges to respect" />
        </View>
      </Section>

      <Section title="Try Full Screen">
        <Text style={[styles.label, { color: colors.foregroundMuted }]}>
          Tap a button to see the Screen component in action
        </Text>
        <View style={styles.buttonGrid}>
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
        <View style={[styles.codeBlock, { backgroundColor: colors.backgroundMuted }]}>
          <Text style={[styles.code, { color: colors.foreground }]}>
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
        <Text style={[styles.label, { color: colors.foregroundMuted }]}>
          Control which edges respect safe area insets
        </Text>
        <View style={[styles.codeBlock, { backgroundColor: colors.backgroundMuted }]}>
          <Text style={[styles.code, { color: colors.foreground }]}>
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
  const { colors } = useTheme();

  const backgroundColor =
    variant === 'default' ? colors.background :
    variant === 'surface' ? colors.backgroundSubtle :
    colors.backgroundMuted;

  return (
    <View style={styles.variantItem}>
      <View style={[styles.variantBox, { backgroundColor, borderColor: colors.border }]}>
        <View style={[styles.variantContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.variantContentText, { color: colors.foreground }]}>Content</Text>
        </View>
      </View>
      <Text style={[styles.variantLabel, { color: colors.foreground }]}>{label}</Text>
    </View>
  );
}

function PropRow({ name, type, description }: { name: string; type: string; description: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.propRow, { borderColor: colors.border }]}>
      <Text style={[styles.propName, { color: colors.primary }]}>{name}</Text>
      <Text style={[styles.propType, { color: colors.foregroundMuted }]}>{type}</Text>
      <Text style={[styles.propDesc, { color: colors.foreground }]}>{description}</Text>
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

const styles = StyleSheet.create({
  container: { gap: 24 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#737373', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionContent: { gap: 8 },
  description: { fontSize: 14, lineHeight: 20 },
  label: { fontSize: 12, marginBottom: 4 },
  variantGrid: { flexDirection: 'row', gap: 12 },
  variantItem: { flex: 1, gap: 4 },
  variantBox: {
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    justifyContent: 'center',
  },
  variantContent: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  variantContentText: { fontSize: 11 },
  variantLabel: { fontSize: 12, textAlign: 'center', fontWeight: '500' },
  propsTable: { borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
  propRow: { padding: 10, borderBottomWidth: 1, gap: 2 },
  propName: { fontSize: 13, fontWeight: '600' },
  propType: { fontSize: 11, fontFamily: 'monospace' },
  propDesc: { fontSize: 12 },
  buttonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  codeBlock: { padding: 12, borderRadius: 8 },
  code: { fontSize: 12, fontFamily: 'monospace' },
  fullScreenContent: { flex: 1, gap: 16, paddingTop: 40 },
  fullScreenTitle: { fontSize: 24, fontWeight: '700' },
  fullScreenSubtitle: { fontSize: 16 },
  scrollContent: { gap: 8, marginVertical: 16 },
  scrollItem: { padding: 16, borderRadius: 8, borderWidth: 1 },
});
