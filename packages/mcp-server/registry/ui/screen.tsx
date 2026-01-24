/**
 * Screen
 *
 * Screen container with safe area, scroll support, and background variants.
 * Uses design tokens for consistent styling.
 *
 * @example
 * ```tsx
 * // Basic screen with safe area
 * <Screen>
 *   <Text>Content</Text>
 * </Screen>
 *
 * // Scrollable screen with padding
 * <Screen scroll padded>
 *   <Text>Scrollable content</Text>
 * </Screen>
 *
 * // Surface variant with custom edges
 * <Screen variant="surface" edges={['top', 'bottom']}>
 *   <Text>Surface background</Text>
 * </Screen>
 * ```
 */

import React, { forwardRef } from 'react';
import {
  View,
  ScrollView,
  ScrollViewProps,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets, Edge } from 'react-native-safe-area-context';
import { useTheme } from '@metacells/mcellui-core';

export type ScreenVariant = 'default' | 'surface' | 'muted';

export interface ScreenProps {
  /** Enable scrolling */
  scroll?: boolean;
  /** Additional ScrollView props when scroll is enabled */
  scrollProps?: Omit<ScrollViewProps, 'style' | 'contentContainerStyle'>;
  /** Add horizontal padding (spacing[4] = 16px) */
  padded?: boolean;
  /** Background variant */
  variant?: ScreenVariant;
  /** Safe area edges to respect (default: all) */
  edges?: Edge[];
  /** Additional styles for the container */
  style?: ViewStyle;
  /** Additional styles for the content container (only when scroll is true) */
  contentContainerStyle?: ViewStyle;
  /** Children */
  children?: React.ReactNode;
}

export const Screen = forwardRef<View | ScrollView, ScreenProps>(function Screen(
  {
    scroll = false,
    scrollProps,
    padded = false,
    variant = 'default',
    edges = ['top', 'bottom', 'left', 'right'],
    style,
    contentContainerStyle,
    children,
  },
  ref
) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  // Get background color based on variant
  const backgroundColor = getBackgroundColor(variant, colors);

  // Calculate safe area padding based on edges
  const safeAreaStyle: ViewStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  // Content padding when padded is true
  const paddedStyle: ViewStyle = padded
    ? { paddingHorizontal: spacing[4] }
    : {};

  if (scroll) {
    return (
      <ScrollView
        ref={ref as React.ForwardedRef<ScrollView>}
        style={[
          styles.container,
          { backgroundColor },
          safeAreaStyle,
          style,
        ]}
        contentContainerStyle={[
          styles.scrollContent,
          paddedStyle,
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        {...scrollProps}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View
      ref={ref as React.ForwardedRef<View>}
      style={[
        styles.container,
        { backgroundColor },
        safeAreaStyle,
        paddedStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
});

function getBackgroundColor(
  variant: ScreenVariant,
  colors: ReturnType<typeof useTheme>['colors']
): string {
  switch (variant) {
    case 'default':
      return colors.background;
    case 'surface':
      return colors.backgroundSubtle;
    case 'muted':
      return colors.backgroundMuted;
    default:
      return colors.background;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
