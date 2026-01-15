import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ConfigProvider, useTheme, useConfig, ThemePreset, RadiusPreset } from '@nativeui/core';
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, SafeAreaView, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ToastProvider } from '@/components/ui/toast';

// Import your config file - this is the "global CSS" for your app
import config from '../nativeui.config';

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
  const themes: ThemePreset[] = ['zinc', 'slate', 'stone', 'blue', 'green', 'rose', 'orange', 'violet'];
  const radiusOptions: RadiusPreset[] = ['none', 'sm', 'md', 'lg', 'full'];

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
      <SafeAreaView style={selectorStyles.container}>
        <View style={selectorStyles.header}>
          <Text style={selectorStyles.title}>Theme Settings</Text>
          <Pressable onPress={onClose} style={selectorStyles.closeButton}>
            <Text style={selectorStyles.closeText}>Done</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={selectorStyles.content}>
          <Text style={selectorStyles.sectionTitle}>Color Theme</Text>
          <View style={selectorStyles.grid}>
            {themes.map((theme) => (
              <Pressable
                key={theme}
                style={[
                  selectorStyles.themeOption,
                  currentTheme === theme && selectorStyles.themeOptionSelected,
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
                  currentTheme === theme && selectorStyles.themeLabelSelected,
                ]}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[selectorStyles.sectionTitle, { marginTop: 24 }]}>Border Radius</Text>
          <View style={selectorStyles.radiusGrid}>
            {radiusOptions.map((radius) => (
              <Pressable
                key={radius}
                style={[
                  selectorStyles.radiusOption,
                  currentRadius === radius && selectorStyles.radiusOptionSelected,
                ]}
                onPress={() => onRadiusChange(radius)}
              >
                <Text style={[
                  selectorStyles.radiusLabel,
                  currentRadius === radius && selectorStyles.radiusLabelSelected,
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
            title: 'nativeui',
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
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#171717',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#737373',
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
    backgroundColor: '#f5f5f5',
  },
  themeOptionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
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
    color: '#525252',
  },
  themeLabelSelected: {
    color: '#3b82f6',
    fontWeight: '600',
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
    backgroundColor: '#f5f5f5',
  },
  radiusOptionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  radiusLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#525252',
  },
  radiusLabelSelected: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});
