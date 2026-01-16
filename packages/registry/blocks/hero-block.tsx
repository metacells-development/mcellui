/**
 * HeroBlock
 *
 * Full-width hero section with image/gradient/mesh, title, and CTA button.
 * Perfect for landing screens, promotions, and featured content.
 *
 * @example
 * ```tsx
 * // With image
 * <HeroBlock
 *   imageUrl="https://example.com/hero.jpg"
 *   title="Discover Amazing Places"
 *   subtitle="Explore the world's most beautiful destinations"
 *   ctaText="Get Started"
 *   onCtaPress={() => navigation.navigate('Onboarding')}
 * />
 *
 * // With mesh gradient
 * <HeroBlock
 *   background="mesh"
 *   meshPreset="sunset"
 *   title="Welcome Back!"
 *   subtitle="Discover what's new today"
 *   ctaText="Get Started"
 *   onCtaPress={() => {}}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@nativeui/core';

// Import your components
import { Button } from '../ui/button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================================================
// Types
// ============================================================================

/** Preset mesh gradient color schemes */
export type MeshGradientPreset = 'purple' | 'ocean' | 'sunset' | 'forest' | 'candy';

const meshGradients: Record<MeshGradientPreset, { colors: string[]; locations?: number[]; angle?: number }[]> = {
  purple: [
    { colors: ['#667eea', '#764ba2'], angle: 135 },
    { colors: ['rgba(102,126,234,0.7)', 'rgba(118,75,162,0.3)'], angle: 45 },
  ],
  ocean: [
    { colors: ['#0093E9', '#80D0C7'], angle: 160 },
    { colors: ['rgba(0,147,233,0.5)', 'rgba(128,208,199,0.3)'], angle: 60 },
  ],
  sunset: [
    { colors: ['#FA8BFF', '#2BD2FF', '#2BFF88'], locations: [0, 0.5, 1], angle: 135 },
  ],
  forest: [
    { colors: ['#134E5E', '#71B280'], angle: 135 },
    { colors: ['rgba(19,78,94,0.6)', 'rgba(113,178,128,0.3)'], angle: 60 },
  ],
  candy: [
    { colors: ['#ff6b6b', '#feca57', '#48dbfb'], locations: [0, 0.5, 1], angle: 120 },
  ],
};

export interface HeroBlockProps {
  /** Background image URL */
  imageUrl?: string;
  /** Background type - use 'mesh' for mesh gradient */
  background?: 'image' | 'gradient' | 'mesh';
  /** Mesh gradient preset (only used when background='mesh') */
  meshPreset?: MeshGradientPreset;
  /** Custom mesh gradient colors (overrides preset) */
  meshColors?: string[];
  /** Hero title */
  title: string;
  /** Hero subtitle or description */
  subtitle?: string;
  /** CTA button text */
  ctaText?: string;
  /** Called when CTA button is pressed */
  onCtaPress?: () => void;
  /** Secondary button text */
  secondaryText?: string;
  /** Called when secondary button is pressed */
  onSecondaryPress?: () => void;
  /** Height of hero section (default: 400) */
  height?: number;
  /** Use gradient overlay for text readability (only for image background) */
  overlay?: 'gradient' | 'solid' | 'none';
  /** Text alignment */
  textAlign?: 'left' | 'center';
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function HeroBlock({
  imageUrl,
  background,
  meshPreset = 'purple',
  meshColors,
  title,
  subtitle,
  ctaText,
  onCtaPress,
  secondaryText,
  onSecondaryPress,
  height = 400,
  overlay = 'gradient',
  textAlign = 'center',
  style,
}: HeroBlockProps) {
  const { colors, spacing } = useTheme();

  // Determine background type
  const backgroundType = background || (imageUrl ? 'image' : 'gradient');

  const renderOverlay = () => {
    if (overlay === 'gradient') {
      return (
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={StyleSheet.absoluteFill}
        />
      );
    }
    if (overlay === 'solid') {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0,0,0,0.5)' },
          ]}
        />
      );
    }
    return null;
  };

  const content = (
    <View
      style={[
        styles.content,
        {
          padding: spacing[6],
          paddingBottom: spacing[8],
          alignItems: textAlign === 'center' ? 'center' : 'flex-start',
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: '#FFFFFF',
            textAlign,
            marginBottom: spacing[2],
          },
        ]}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={[
            styles.subtitle,
            {
              color: 'rgba(255,255,255,0.9)',
              textAlign,
              marginBottom: spacing[6],
            },
          ]}
        >
          {subtitle}
        </Text>
      )}
      {(ctaText || secondaryText) && (
        <View
          style={[
            styles.buttons,
            textAlign === 'center' && styles.buttonsCenter,
            { gap: spacing[3] },
          ]}
        >
          {ctaText && onCtaPress && (
            <Button onPress={onCtaPress}>{ctaText}</Button>
          )}
          {secondaryText && onSecondaryPress && (
            <Button variant="outline" onPress={onSecondaryPress}>
              {secondaryText}
            </Button>
          )}
        </View>
      )}
    </View>
  );

  // Render mesh gradient background
  if (backgroundType === 'mesh') {
    const gradientLayers = meshColors
      ? [{ colors: meshColors }]
      : meshGradients[meshPreset] || meshGradients.purple;
    const firstColor = gradientLayers[0]?.colors[0] || colors.primary;

    return (
      <View style={[styles.container, { height, backgroundColor: firstColor }, style]}>
        {gradientLayers.map((layer, index) => (
          <LinearGradient
            key={index}
            colors={layer.colors as [string, string, ...string[]]}
            locations={layer.locations as [number, number, ...number[]] | undefined}
            start={index === 0 ? { x: 0, y: 0 } : { x: 1, y: 0 }}
            end={index === 0 ? { x: 1, y: 1 } : { x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ))}
        {content}
      </View>
    );
  }

  // Render image background
  if (backgroundType === 'image' && imageUrl) {
    return (
      <ImageBackground
        source={{ uri: imageUrl }}
        style={[styles.container, { height }, style]}
        resizeMode="cover"
      >
        {renderOverlay()}
        {content}
      </ImageBackground>
    );
  }

  // Fallback: simple gradient background
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryMuted]}
      style={[styles.container, { height }, style]}
    >
      {content}
    </LinearGradient>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    justifyContent: 'flex-end',
  },
  content: {},
  title: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonsCenter: {
    justifyContent: 'center',
  },
});
