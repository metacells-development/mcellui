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
  const { colors } = useTheme();
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
        <View style={[selectorStyles.header, { borderBottomColor: colors.border }]}>
          <Text style={[selectorStyles.title, { color: colors.foreground }]}>Theme Settings</Text>
          <Pressable onPress={onClose} style={selectorStyles.closeButton}>
            <Text style={[selectorStyles.closeText, { color: colors.primary }]}>Done</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={selectorStyles.content}>
          <Text style={[selectorStyles.sectionTitle, { color: colors.foregroundMuted }]}>Color Theme</Text>
          <View style={selectorStyles.grid}>
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
                    { backgroundColor: themeColors[theme] },
                  ]}
                />
                <Text style={[
                  selectorStyles.themeLabel,
                  { color: colors.foregroundMuted },
                  currentTheme === theme && { color: colors.primary },
                ]}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[selectorStyles.sectionTitle, { marginTop: 24, color: colors.foregroundMuted }]}>Border Radius</Text>
          <View style={selectorStyles.radiusGrid}>
            {radiusOptions.map((radius) => (
              <Pressable
                key={radius}
                style={[
                  selectorStyles.radiusOption,
                  { backgroundColor: colors.secondary },
                  currentRadius === radius && [selectorStyles.radiusOptionSelected, { borderColor: colors.primary, backgroundColor: colors.primaryMuted }],
                ]}
                onPress={() => onRadiusChange(radius)}
              >
                <Text style={[
                  selectorStyles.radiusLabel,
                  { color: colors.foregroundMuted },
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
  const { colors, isDark, setColorScheme } = useTheme();

  return (
    <Pressable
      onPress={() => setColorScheme(isDark ? 'light' : 'dark')}
      style={headerStyles.button}
    >
      <Text style={[headerStyles.icon, { color: colors.foreground }]}>
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
  const { colors, isDark } = useTheme();

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
            fontWeight: '600',
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
              <View style={headerStyles.headerRight}>
                <ThemedHeader />
                <Pressable onPress={onOpenThemeSelector} style={headerStyles.button}>
                  <Text style={[headerStyles.icon, { color: colors.foreground }]}>🎨</Text>
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

const headerStyles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    padding: 8,
  },
  icon: {
    fontSize: 20,
  },
});

const selectorStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
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
    marginBottom: 8,
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  radiusGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  radiusOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  radiusOptionSelected: {
    // Colors applied inline via theme tokens
  },
  radiusLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
