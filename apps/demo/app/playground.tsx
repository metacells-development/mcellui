/**
 * Theme Playground
 *
 * Visual explorer for all 40 theme/radius combinations.
 * Tap any cell to preview it in full-size.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ConfigProvider, ThemePreset, RadiusPreset, useTheme } from '@metacells/mcellui-core';
import { ThemeGrid } from '@/components/playground/ThemeGrid';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

type ThemeResult = ReturnType<typeof useTheme>;

function getDynamicStyles(theme: ThemeResult) {
  const { fontSize, fontWeight, spacing } = theme;
  return {
    header: { paddingHorizontal: spacing[4], paddingVertical: spacing[3] },
    title: { fontSize: fontSize.lg, fontWeight: fontWeight.bold },
    subtitle: { fontSize: fontSize.sm, marginTop: spacing[0.5] },
    previewHeader: { paddingHorizontal: spacing[4], paddingVertical: spacing[2.5] },
    previewTitle: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
    previewContent: { padding: spacing[4], gap: spacing[6] },
    section: { gap: spacing[3] },
    sectionTitle: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
    buttonRow: { gap: spacing[2] },
    badgeRow: { gap: spacing[2] },
  };
}

function FullPreview() {
  const theme = useTheme();
  const { colors } = theme;
  const dynamicStyles = getDynamicStyles(theme);

  return (
    <ScrollView
      style={[styles.previewScroll, { backgroundColor: colors.backgroundSubtle }]}
      contentContainerStyle={[styles.previewContent, dynamicStyles.previewContent]}
      showsVerticalScrollIndicator={false}
    >
      {/* Buttons */}
      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }, dynamicStyles.sectionTitle]}>Buttons</Text>
        <View style={[styles.buttonRow, dynamicStyles.buttonRow]}>
          <Button variant="default" size="sm">Primary</Button>
          <Button variant="secondary" size="sm">Secondary</Button>
          <Button variant="outline" size="sm">Outline</Button>
          <Button variant="ghost" size="sm">Ghost</Button>
        </View>
      </View>

      {/* Card */}
      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }, dynamicStyles.sectionTitle]}>Card</Text>
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description goes here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Text style={{ color: colors.foreground }}>
              This is the card content area.
            </Text>
          </CardContent>
        </Card>
      </View>

      {/* Input */}
      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }, dynamicStyles.sectionTitle]}>Input</Text>
        <Input placeholder="Enter something..." />
      </View>

      {/* Badges */}
      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }, dynamicStyles.sectionTitle]}>Badges</Text>
        <View style={[styles.badgeRow, dynamicStyles.badgeRow]}>
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </View>
      </View>

      {/* Switch */}
      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }, dynamicStyles.sectionTitle]}>Switch</Text>
        <Switch checked={true} label="Enabled setting" />
      </View>
    </ScrollView>
  );
}

export default function PlaygroundScreen() {
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset>('blue');
  const [selectedRadius, setSelectedRadius] = useState<RadiusPreset>('md');
  const [isDark, setIsDark] = useState(false);
  const theme = useTheme();
  const { colors } = theme;
  const dynamicStyles = getDynamicStyles(theme);
  const router = useRouter();

  const handleSelect = (theme: ThemePreset, radius: RadiusPreset) => {
    setSelectedTheme(theme);
    setSelectedRadius(radius);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }, dynamicStyles.header]}>
        <View>
          <Text style={[styles.title, { color: colors.foreground }, dynamicStyles.title]}>Theme Playground</Text>
          <Text style={[styles.subtitle, { color: colors.foregroundMuted }, dynamicStyles.subtitle]}>
            Explore all 40 theme combinations
          </Text>
        </View>
        <Pressable
          style={[styles.darkToggle, { backgroundColor: isDark ? colors.primary : colors.secondary }]}
          onPress={() => setIsDark(!isDark)}
        >
          <Text style={{ color: isDark ? colors.primaryForeground : colors.secondaryForeground }}>
            {isDark ? '🌙' : '☀️'}
          </Text>
        </Pressable>
      </View>

      {/* Grid */}
      <View style={styles.gridContainer}>
        <ThemeGrid
          selectedTheme={selectedTheme}
          selectedRadius={selectedRadius}
          onSelect={handleSelect}
          isDark={isDark}
        />
      </View>

      {/* Selected Preview */}
      <View style={[styles.previewContainer, { borderTopColor: colors.border }]}>
        <View style={[styles.previewHeader, { backgroundColor: colors.background }, dynamicStyles.previewHeader]}>
          <Text style={[styles.previewTitle, { color: colors.foreground }, dynamicStyles.previewTitle]}>
            Preview: {selectedTheme} / {selectedRadius}
          </Text>
        </View>
        <ConfigProvider
          theme={selectedTheme}
          radius={selectedRadius}
          colorScheme={isDark ? 'dark' : 'light'}
        >
          <FullPreview />
        </ConfigProvider>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  title: {},
  subtitle: {},
  darkToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    height: 280,
  },
  previewContainer: {
    flex: 1,
    borderTopWidth: 1,
  },
  previewHeader: {},
  previewTitle: {},
  previewScroll: {
    flex: 1,
  },
  previewContent: {},
  section: {},
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
