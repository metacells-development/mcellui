import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ConfigProvider, useTheme, useConfig, ThemePreset, RadiusPreset } from '@metacells/mcellui-core';
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, SafeAreaView, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ToastProvider } from '@/components/ui/toast';

// Import your config file - this is the "global CSS" for your app
import config from '../mcellui.config';

// Theme selector modal component
function ThemeSelector({
  visible,
  onClose,
  currentTheme,
  onThemeChange,
  currentRadius,
  onRadiusChange,
}: {
  visible: boolean;
  onClose: () => void;
  currentTheme: ThemePreset;
  onThemeChange: (theme: ThemePreset) => void;
  currentRadius: RadiusPreset;
  onRadiusChange: (radius: RadiusPreset) => void;
}) {
  const { colors, fontSize, fontWeight, spacing } = useTheme();
  const themes: ThemePreset[] = ['zinc', 'slate', 'stone', 'blue', 'green', 'rose', 'orange', 'violet'];
  const radiusOptions: RadiusPreset[] = ['none', 'sm', 'md', 'lg', 'full'];

  // Theme preview swatches - intentionally hardcoded brand colors
  const themeColors: Record<ThemePreset, string> = {
    zinc: '#71717a',
    slate: '#64748b',
    stone: '#78716c',
    blue: '#3b82f6',
    green: '#22c55e',
    rose: '#f43f5e',
    orange: '#f97316',
    violet: '#8b5cf6',
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[selectorStyles.container, { backgroundColor: colors.background }]}>
        <View style={[selectorStyles.header, { borderBottomColor: colors.border, paddingHorizontal: spacing[4], paddingVertical: spacing[3] }]}>
          <Text style={[selectorStyles.title, { color: colors.foreground, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }]}>Theme Settings</Text>
          <Pressable onPress={onClose} style={[selectorStyles.closeButton, { padding: spacing[2] }]}>
            <Text style={[selectorStyles.closeText, { color: colors.primary, fontSize: fontSize.base, fontWeight: fontWeight.semibold }]}>Done</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={[selectorStyles.content, { padding: spacing[4] }]}>
          <Text style={[selectorStyles.sectionTitle, { color: colors.foregroundMuted, fontSize: fontSize.sm, fontWeight: fontWeight.semibold, marginBottom: spacing[3] }]}>Color Theme</Text>
          <View style={[selectorStyles.grid, { gap: spacing[3] }]}>
            {themes.map((theme) => (
              <Pressable
                key={theme}
                style={[
                  selectorStyles.themeOption,
                  { backgroundColor: colors.secondary },
                  currentTheme === theme && [selectorStyles.themeOptionSelected, { borderColor: colors.primary, backgroundColor: colors.primaryMuted }],
                ]}
                onPress={() => onThemeChange(theme)}
              >
                <View
                  style={[
                    selectorStyles.themeColor,
                    { backgroundColor: themeColors[theme], marginBottom: spacing[2] },
                  ]}
                />
                <Text style={[
                  selectorStyles.themeLabel,
                  { color: colors.foregroundMuted, fontSize: fontSize.xs, fontWeight: fontWeight.medium },
                  currentTheme === theme && { color: colors.primary },
                ]}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[selectorStyles.sectionTitle, { marginTop: spacing[6], color: colors.foregroundMuted, fontSize: fontSize.sm, fontWeight: fontWeight.semibold, marginBottom: spacing[3] }]}>Border Radius</Text>
          <View style={[selectorStyles.radiusGrid, { gap: spacing[2] }]}>
            {radiusOptions.map((radius) => (
              <Pressable
                key={radius}
                style={[
                  selectorStyles.radiusOption,
                  { backgroundColor: colors.secondary, paddingVertical: spacing[3] },
                  currentRadius === radius && [selectorStyles.radiusOptionSelected, { borderColor: colors.primary, backgroundColor: colors.primaryMuted }],
                ]}
                onPress={() => onRadiusChange(radius)}
              >
                <Text style={[
                  selectorStyles.radiusLabel,
                  { color: colors.foregroundMuted, fontSize: fontSize.xs, fontWeight: fontWeight.medium },
                  currentRadius === radius && { color: colors.primary },
                ]}>
                  {radius.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// Header with theme toggle button
function ThemedHeader() {
  const { colors, fontSize, spacing, isDark, setColorScheme } = useTheme();

  return (
    <Pressable
      onPress={() => setColorScheme(isDark ? 'light' : 'dark')}
      style={{ padding: spacing[2] }}
    >
      <Text style={{ color: colors.foreground, fontSize: fontSize.xl }}>
        {isDark ? '☀️' : '🌙'}
      </Text>
    </Pressable>
  );
}

function RootLayoutContent({
  onOpenThemeSelector,
}: {
  onOpenThemeSelector: () => void;
}) {
  const { colors, fontSize, fontWeight, spacing, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.foreground,
          headerTitleStyle: {
            fontWeight: fontWeight.semibold,
          },
          contentStyle: {
            backgroundColor: colors.backgroundSubtle,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'mcellui',
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                <ThemedHeader />
                <Pressable onPress={onOpenThemeSelector} style={{ padding: spacing[2] }}>
                  <Text style={{ color: colors.foreground, fontSize: fontSize.xl }}>🎨</Text>
                </Pressable>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="components/[name]"
          options={{
            title: 'Component',
            headerRight: () => <ThemedHeader />,
          }}
        />
        <Stack.Screen
          name="playground"
          options={{
            title: 'Theme Playground',
            headerRight: () => <ThemedHeader />,
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [theme, setTheme] = useState<ThemePreset>('blue');
  const [radius, setRadius] = useState<RadiusPreset>('md');
  const [showSelector, setShowSelector] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConfigProvider config={config} theme={theme} radius={radius}>
        <ToastProvider>
          <RootLayoutContent onOpenThemeSelector={() => setShowSelector(true)} />
          <ThemeSelector
            visible={showSelector}
            onClose={() => setShowSelector(false)}
            currentTheme={theme}
            onThemeChange={setTheme}
            currentRadius={radius}
            onRadiusChange={setRadius}
          />
        </ToastProvider>
      </ConfigProvider>
    </GestureHandlerRootView>
  );
}

// Layout styles - typography, colors, and spacing applied inline via theme tokens
const selectorStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  title: {
    // Typography applied inline via theme tokens
  },
  closeButton: {
    // Spacing applied inline via theme tokens
  },
  closeText: {
    // Typography applied inline via theme tokens
  },
  content: {
    // Spacing applied inline via theme tokens
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    // Typography and spacing applied inline via theme tokens
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // Gap applied inline via theme tokens
  },
  themeOption: {
    width: '22%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeOptionSelected: {
    // Colors applied inline via theme tokens
  },
  themeColor: {
    width: 32,
    height: 32,
    borderRadius: 16,
    // Margin applied inline via theme tokens
  },
  themeLabel: {
    // Typography applied inline via theme tokens
  },
  radiusGrid: {
    flexDirection: 'row',
    // Gap applied inline via theme tokens
  },
  radiusOption: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    // Spacing applied inline via theme tokens
  },
  radiusOptionSelected: {
    // Colors applied inline via theme tokens
  },
  radiusLabel: {
    // Typography applied inline via theme tokens
  },
});
