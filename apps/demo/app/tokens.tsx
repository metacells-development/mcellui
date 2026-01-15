/**
 * Token Viewer Screen
 *
 * Displays all design tokens visually for reference and debugging.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useTheme,
  palette,
  lightColors,
  darkColors,
  themeSpacing,
  themeRadius,
  themeFontSize,
  themeFontWeight,
  geistFontFamily,
  componentHeight,
  iconSize,
  buttonTokens,
  inputTokens,
  checkboxTokens,
  switchTokens,
  badgeTokens,
  avatarTokens,
  cardTokens,
} from '@nativeui/core';
import { ThemeSelector } from '../components/ui/theme-selector';
import { useThemeSettings } from '../context/ThemeSettingsContext';

// =============================================================================
// Section Component
// =============================================================================

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.section, { marginBottom: spacing[6] }]}>
      <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: spacing[3] }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

// =============================================================================
// Color Swatch
// =============================================================================

interface ColorSwatchProps {
  name: string;
  color: string;
  textColor?: string;
}

function ColorSwatch({ name, color, textColor }: ColorSwatchProps) {
  const { colors, spacing, radius } = useTheme();
  const isTransparent = color.includes('rgba') || color === 'transparent';

  return (
    <View style={[styles.colorSwatch, { marginBottom: spacing[2] }]}>
      <View
        style={[
          styles.colorBox,
          {
            backgroundColor: color,
            borderRadius: radius.md,
            borderWidth: isTransparent ? 1 : 0,
            borderColor: colors.border,
          },
        ]}
      >
        {textColor && (
          <Text style={[styles.colorText, { color: textColor }]}>Aa</Text>
        )}
      </View>
      <View style={styles.colorInfo}>
        <Text style={[styles.colorName, { color: colors.foreground }]}>{name}</Text>
        <Text style={[styles.colorValue, { color: colors.foregroundMuted }]}>{color}</Text>
      </View>
    </View>
  );
}

// =============================================================================
// Spacing Visualizer
// =============================================================================

function SpacingVisualizer() {
  const { colors, radius } = useTheme();
  const spacingKeys = Object.keys(themeSpacing).filter(k => parseFloat(k) <= 12);

  return (
    <View style={styles.spacingContainer}>
      {spacingKeys.map((key) => {
        const value = themeSpacing[key as unknown as keyof typeof themeSpacing];
        return (
          <View key={key} style={styles.spacingRow}>
            <Text style={[styles.spacingLabel, { color: colors.foregroundMuted, width: 40 }]}>
              {key}
            </Text>
            <View
              style={[
                styles.spacingBar,
                {
                  width: value,
                  backgroundColor: colors.primary,
                  borderRadius: radius.xs,
                },
              ]}
            />
            <Text style={[styles.spacingValue, { color: colors.foregroundMuted }]}>
              {value}px
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// =============================================================================
// Radius Visualizer
// =============================================================================

function RadiusVisualizer() {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.radiusContainer, { gap: spacing[3] }]}>
      {Object.entries(themeRadius).map(([key, value]) => (
        <View key={key} style={styles.radiusItem}>
          <View
            style={[
              styles.radiusBox,
              {
                borderRadius: value,
                borderWidth: 2,
                borderColor: colors.primary,
              },
            ]}
          />
          <Text style={[styles.radiusLabel, { color: colors.foreground }]}>{key}</Text>
          <Text style={[styles.radiusValue, { color: colors.foregroundMuted }]}>
            {value === 9999 ? 'full' : `${value}px`}
          </Text>
        </View>
      ))}
    </View>
  );
}

// =============================================================================
// Typography Visualizer
// =============================================================================

function TypographyVisualizer() {
  const { colors, spacing } = useTheme();

  return (
    <View style={{ gap: spacing[2] }}>
      {Object.entries(themeFontSize).map(([key, value]) => (
        <View key={key} style={styles.typographyRow}>
          <Text style={[styles.typographyLabel, { color: colors.foregroundMuted, width: 50 }]}>
            {key}
          </Text>
          <Text style={[{ fontSize: value, color: colors.foreground }]}>
            The quick brown fox ({value}px)
          </Text>
        </View>
      ))}
    </View>
  );
}

// =============================================================================
// Component Token Table
// =============================================================================

interface TokenTableProps {
  title: string;
  tokens: Record<string, Record<string, any>>;
}

function TokenTable({ title, tokens }: TokenTableProps) {
  const { colors, spacing, radius } = useTheme();
  const sizes = Object.keys(tokens);
  const properties = Object.keys(tokens[sizes[0]] || {});

  return (
    <View style={[styles.tokenTable, { marginBottom: spacing[4] }]}>
      <Text style={[styles.tokenTableTitle, { color: colors.foreground, marginBottom: spacing[2] }]}>
        {title}
      </Text>
      <View
        style={[
          styles.table,
          {
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
          },
        ]}
      >
        {/* Header */}
        <View style={[styles.tableRow, { backgroundColor: colors.backgroundMuted }]}>
          <Text style={[styles.tableCell, styles.tableHeader, { color: colors.foreground }]}>
            Property
          </Text>
          {sizes.map((size) => (
            <Text
              key={size}
              style={[styles.tableCell, styles.tableHeader, { color: colors.foreground }]}
            >
              {size}
            </Text>
          ))}
        </View>
        {/* Rows */}
        {properties.map((prop, index) => (
          <View
            key={prop}
            style={[
              styles.tableRow,
              {
                backgroundColor: index % 2 === 0 ? colors.background : colors.backgroundSubtle,
              },
            ]}
          >
            <Text style={[styles.tableCell, { color: colors.foregroundMuted }]}>{prop}</Text>
            {sizes.map((size) => (
              <Text key={size} style={[styles.tableCell, { color: colors.foreground }]}>
                {tokens[size][prop]}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

// =============================================================================
// Tab Navigation
// =============================================================================

type Tab = 'colors' | 'spacing' | 'typography' | 'components';

interface TabProps {
  tabs: { key: Tab; label: string }[];
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

function TabBar({ tabs, activeTab, onTabChange }: TabProps) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.backgroundMuted,
          borderRadius: radius.lg,
          padding: spacing[1],
          gap: spacing[1],
        },
      ]}
    >
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === tab.key ? colors.background : 'transparent',
              borderRadius: radius.md,
              paddingVertical: spacing[2],
              paddingHorizontal: spacing[3],
            },
          ]}
          onPress={() => onTabChange(tab.key)}
        >
          <Text
            style={[
              styles.tabLabel,
              {
                color: activeTab === tab.key ? colors.foreground : colors.foregroundMuted,
                fontWeight: activeTab === tab.key ? '600' : '400',
              },
            ]}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// =============================================================================
// Main Screen
// =============================================================================

export default function TokensScreen() {
  const { colors, spacing, isDark } = useTheme();
  const { themePreset, radiusPreset, setThemePreset, setRadiusPreset } = useThemeSettings();
  const [activeTab, setActiveTab] = useState<Tab>('colors');

  const currentColors = isDark ? darkColors : lightColors;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'colors', label: 'Colors' },
    { key: 'spacing', label: 'Spacing' },
    { key: 'typography', label: 'Type' },
    { key: 'components', label: 'Components' },
  ];

  // Group colors by category
  const colorGroups = {
    Background: ['background', 'backgroundSubtle', 'backgroundMuted', 'backgroundElevated'],
    Foreground: ['foreground', 'foregroundMuted', 'foregroundSubtle'],
    Border: ['border', 'borderMuted', 'borderFocused'],
    Primary: ['primary', 'primaryForeground', 'primaryMuted'],
    Secondary: ['secondary', 'secondaryForeground'],
    Destructive: ['destructive', 'destructiveForeground'],
    Status: ['success', 'warning', 'error'],
    Card: ['card', 'cardForeground'],
    Input: ['input', 'inputBorder', 'inputPlaceholder'],
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Theme Selector */}
      <View style={[styles.header, { padding: spacing[4], borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground, marginBottom: spacing[3] }]}>
          Theme
        </Text>
        <ThemeSelector
          currentTheme={themePreset}
          currentRadius={radiusPreset}
          onThemeChange={setThemePreset}
          onRadiusChange={setRadiusPreset}
        />
      </View>

      {/* Tab Bar */}
      <View style={{ padding: spacing[4], paddingBottom: 0 }}>
        <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ padding: spacing[4] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <>
            {Object.entries(colorGroups).map(([group, keys]) => (
              <Section key={group} title={group}>
                {keys.map((key) => {
                  const colorKey = key as keyof typeof currentColors;
                  const color = currentColors[colorKey];
                  const foregroundKey = `${key}Foreground` as keyof typeof currentColors;
                  const textColor = currentColors[foregroundKey];

                  return (
                    <ColorSwatch
                      key={key}
                      name={key}
                      color={color}
                      textColor={key.includes('Foreground') ? undefined : textColor}
                    />
                  );
                })}
              </Section>
            ))}

            {/* Palette */}
            <Section title="Palette - Neutral">
              <View style={[styles.paletteRow, { gap: spacing[1] }]}>
                {Object.entries(palette.neutral).map(([shade, color]) => (
                  <View
                    key={shade}
                    style={[styles.paletteBox, { backgroundColor: color }]}
                  >
                    <Text
                      style={[
                        styles.paletteLabel,
                        { color: parseInt(shade) > 400 ? '#fff' : '#000' },
                      ]}
                    >
                      {shade}
                    </Text>
                  </View>
                ))}
              </View>
            </Section>

            <Section title="Palette - Primary">
              <View style={[styles.paletteRow, { gap: spacing[1] }]}>
                {Object.entries(palette.primary).map(([shade, color]) => (
                  <View
                    key={shade}
                    style={[styles.paletteBox, { backgroundColor: color }]}
                  >
                    <Text
                      style={[
                        styles.paletteLabel,
                        { color: parseInt(shade) > 400 ? '#fff' : '#000' },
                      ]}
                    >
                      {shade}
                    </Text>
                  </View>
                ))}
              </View>
            </Section>
          </>
        )}

        {/* Spacing Tab */}
        {activeTab === 'spacing' && (
          <>
            <Section title="Spacing Scale">
              <SpacingVisualizer />
            </Section>

            <Section title="Border Radius">
              <RadiusVisualizer />
            </Section>

            <Section title="Component Heights">
              <View style={{ gap: spacing[2] }}>
                {Object.entries(componentHeight).map(([key, value]) => (
                  <View key={key} style={styles.heightRow}>
                    <Text style={[styles.heightLabel, { color: colors.foregroundMuted }]}>
                      {key}
                    </Text>
                    <View
                      style={[
                        styles.heightBar,
                        {
                          height: value,
                          backgroundColor: colors.primary,
                          borderRadius: themeRadius.md,
                        },
                      ]}
                    />
                    <Text style={[styles.heightValue, { color: colors.foregroundMuted }]}>
                      {value}px
                    </Text>
                  </View>
                ))}
              </View>
            </Section>

            <Section title="Icon Sizes">
              <View style={[styles.iconRow, { gap: spacing[3] }]}>
                {Object.entries(iconSize).map(([key, value]) => (
                  <View key={key} style={styles.iconItem}>
                    <View
                      style={[
                        styles.iconBox,
                        {
                          width: value,
                          height: value,
                          backgroundColor: colors.primary,
                          borderRadius: themeRadius.sm,
                        },
                      ]}
                    />
                    <Text style={[styles.iconLabel, { color: colors.foreground }]}>
                      {key}
                    </Text>
                    <Text style={[styles.iconValue, { color: colors.foregroundMuted }]}>
                      {value}px
                    </Text>
                  </View>
                ))}
              </View>
            </Section>
          </>
        )}

        {/* Typography Tab */}
        {activeTab === 'typography' && (
          <>
            <Section title="Geist Font Family">
              <View style={{ gap: spacing[3] }}>
                <View>
                  <Text style={[styles.fontLabel, { color: colors.foregroundMuted, marginBottom: spacing[1] }]}>
                    Geist Sans
                  </Text>
                  <Text style={[styles.fontSample, { fontFamily: 'Geist_400Regular', color: colors.foreground }]}>
                    The quick brown fox jumps over the lazy dog
                  </Text>
                  <Text style={[styles.fontSample, { fontFamily: 'Geist_500Medium', color: colors.foreground }]}>
                    Medium: ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
                  </Text>
                  <Text style={[styles.fontSample, { fontFamily: 'Geist_600SemiBold', color: colors.foreground }]}>
                    SemiBold: The quick brown fox jumps
                  </Text>
                  <Text style={[styles.fontSample, { fontFamily: 'Geist_700Bold', color: colors.foreground }]}>
                    Bold: The quick brown fox jumps
                  </Text>
                </View>
                <View>
                  <Text style={[styles.fontLabel, { color: colors.foregroundMuted, marginBottom: spacing[1] }]}>
                    Geist Mono
                  </Text>
                  <Text style={[styles.monoSample, { fontFamily: 'GeistMono_400Regular', color: colors.foreground }]}>
                    const hello = "world";
                  </Text>
                  <Text style={[styles.monoSample, { fontFamily: 'GeistMono_500Medium', color: colors.foreground }]}>
                    function sum(a, b) {'{'}
                  </Text>
                  <Text style={[styles.monoSample, { fontFamily: 'GeistMono_400Regular', color: colors.foreground }]}>
                    {'  '}return a + b;
                  </Text>
                  <Text style={[styles.monoSample, { fontFamily: 'GeistMono_500Medium', color: colors.foreground }]}>
                    {'}'}
                  </Text>
                </View>
              </View>
            </Section>

            <Section title="Font Sizes">
              <TypographyVisualizer />
            </Section>

            <Section title="Font Weights">
              <View style={{ gap: spacing[2] }}>
                {Object.entries(themeFontWeight).map(([key, value]) => (
                  <View key={key} style={styles.weightRow}>
                    <Text style={[styles.weightLabel, { color: colors.foregroundMuted }]}>
                      {key}
                    </Text>
                    <Text
                      style={[
                        styles.weightSample,
                        { fontFamily: 'Geist_400Regular', fontWeight: value as any, color: colors.foreground },
                      ]}
                    >
                      The quick brown fox ({value})
                    </Text>
                  </View>
                ))}
              </View>
            </Section>

            <Section title="Font Family Tokens">
              <View style={{ gap: spacing[1] }}>
                {Object.entries(geistFontFamily).slice(0, 9).map(([key, value]) => (
                  <View key={key} style={styles.fontTokenRow}>
                    <Text style={[styles.fontTokenKey, { color: colors.foregroundMuted }]}>
                      {key}
                    </Text>
                    <Text style={[styles.fontTokenValue, { fontFamily: value, color: colors.foreground }]}>
                      {value}
                    </Text>
                  </View>
                ))}
              </View>
            </Section>
          </>
        )}

        {/* Components Tab */}
        {activeTab === 'components' && (
          <>
            <TokenTable title="Button" tokens={buttonTokens} />
            <TokenTable title="Input" tokens={inputTokens} />
            <TokenTable title="Checkbox" tokens={checkboxTokens} />
            <TokenTable title="Switch" tokens={switchTokens} />
            <TokenTable title="Badge" tokens={badgeTokens} />
            <TokenTable title="Avatar" tokens={avatarTokens} />

            <Section title="Card Tokens">
              <View style={{ gap: spacing[1] }}>
                {Object.entries(cardTokens).map(([key, value]) => (
                  <View key={key} style={styles.cardTokenRow}>
                    <Text style={[styles.cardTokenKey, { color: colors.foregroundMuted }]}>
                      {key}
                    </Text>
                    <Text style={[styles.cardTokenValue, { color: colors.foreground }]}>
                      {value}
                    </Text>
                  </View>
                ))}
              </View>
            </Section>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {},
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  section: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 14,
  },

  // Colors
  colorSwatch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorBox: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorText: {
    fontSize: 14,
    fontWeight: '600',
  },
  colorInfo: {
    marginLeft: 12,
  },
  colorName: {
    fontSize: 14,
    fontWeight: '500',
  },
  colorValue: {
    fontSize: 12,
    fontFamily: 'monospace',
  },

  // Palette
  paletteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  paletteBox: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paletteLabel: {
    fontSize: 9,
    fontWeight: '600',
  },

  // Spacing
  spacingContainer: {},
  spacingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  spacingLabel: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  spacingBar: {
    height: 16,
    minWidth: 2,
  },
  spacingValue: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginLeft: 8,
  },

  // Radius
  radiusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radiusItem: {
    alignItems: 'center',
  },
  radiusBox: {
    width: 48,
    height: 48,
    backgroundColor: 'transparent',
  },
  radiusLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  radiusValue: {
    fontSize: 10,
    fontFamily: 'monospace',
  },

  // Typography
  typographyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typographyLabel: {
    fontSize: 11,
    fontFamily: 'monospace',
  },

  // Weights
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightLabel: {
    fontSize: 12,
    fontFamily: 'monospace',
    width: 80,
  },
  weightSample: {
    fontSize: 15,
    flex: 1,
  },

  // Heights
  heightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heightLabel: {
    fontSize: 12,
    fontFamily: 'monospace',
    width: 40,
  },
  heightBar: {
    width: 100,
  },
  heightValue: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginLeft: 8,
  },

  // Icons
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconItem: {
    alignItems: 'center',
  },
  iconBox: {},
  iconLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  iconValue: {
    fontSize: 10,
    fontFamily: 'monospace',
  },

  // Token Table
  tokenTable: {},
  tokenTableTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  table: {},
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 11,
    fontFamily: 'monospace',
  },
  tableHeader: {
    fontWeight: '600',
    fontFamily: 'System',
  },

  // Card Tokens
  cardTokenRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  cardTokenKey: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'GeistMono_400Regular',
  },
  cardTokenValue: {
    fontSize: 12,
    fontFamily: 'GeistMono_400Regular',
  },

  // Font Samples
  fontLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fontSample: {
    fontSize: 16,
    lineHeight: 24,
  },
  monoSample: {
    fontSize: 14,
    lineHeight: 22,
  },
  fontTokenRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  fontTokenKey: {
    width: 120,
    fontSize: 11,
    fontFamily: 'GeistMono_400Regular',
  },
  fontTokenValue: {
    flex: 1,
    fontSize: 13,
  },
});
