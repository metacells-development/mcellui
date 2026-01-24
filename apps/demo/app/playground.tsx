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

function FullPreview() {
  const { colors, radius, spacing } = useTheme();

  return (
    <ScrollView
      style={[styles.previewScroll, { backgroundColor: colors.backgroundSubtle }]}
      contentContainerStyle={styles.previewContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Buttons */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Buttons</Text>
        <View style={styles.buttonRow}>
          <Button variant="default" size="sm">Primary</Button>
          <Button variant="secondary" size="sm">Secondary</Button>
          <Button variant="outline" size="sm">Outline</Button>
          <Button variant="ghost" size="sm">Ghost</Button>
        </View>
      </View>

      {/* Card */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Card</Text>
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
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Input</Text>
        <Input placeholder="Enter something..." />
      </View>

      {/* Badges */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Badges</Text>
        <View style={styles.badgeRow}>
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </View>
      </View>

      {/* Switch */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Switch</Text>
        <Switch checked={true} label="Enabled setting" />
      </View>
    </ScrollView>
  );
}

export default function PlaygroundScreen() {
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset>('blue');
  const [selectedRadius, setSelectedRadius] = useState<RadiusPreset>('md');
  const [isDark, setIsDark] = useState(false);
  const { colors } = useTheme();
  const router = useRouter();

  const handleSelect = (theme: ThemePreset, radius: RadiusPreset) => {
    setSelectedTheme(theme);
    setSelectedRadius(radius);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>Theme Playground</Text>
          <Text style={[styles.subtitle, { color: colors.foregroundMuted }]}>
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
        <View style={[styles.previewHeader, { backgroundColor: colors.background }]}>
          <Text style={[styles.previewTitle, { color: colors.foreground }]}>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
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
  previewHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  previewScroll: {
    flex: 1,
  },
  previewContent: {
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
