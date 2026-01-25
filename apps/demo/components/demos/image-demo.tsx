import React from 'react';
import { View, Text } from 'react-native';
import { Image } from '@/components/ui/image';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

// Sample image URLs
const SAMPLE_IMAGES = {
  landscape: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  portrait: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
  square: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  invalid: 'https://invalid-url-that-will-fail.com/image.jpg',
};

export function ImageDemo() {
  const { colors, spacing, radius, typography } = useTheme();

  return (
    <View style={{ gap: spacing[8] }}>
      {/* Basic Section */}
      <Section title="Basic">
        <Image
          source={{ uri: SAMPLE_IMAGES.landscape }}
          style={{ width: '100%', height: 200, borderRadius: radius.md }}
          resizeMode="cover"
        />
      </Section>

      {/* Loading Skeleton Section */}
      <Section title="Loading Skeleton">
        <View style={{ gap: spacing[2] }}>
          <Text style={[typography.caption, { color: colors.foregroundMuted }]}>
            Images show a skeleton shimmer while loading
          </Text>
          <Image
            source={{ uri: `${SAMPLE_IMAGES.landscape}&t=${Date.now()}` }}
            style={{ width: '100%', height: 160, borderRadius: radius.lg }}
            resizeMode="cover"
          />
        </View>
      </Section>

      {/* Error Fallback Section */}
      <Section title="Error Fallback">
        <View style={{ gap: spacing[3] }}>
          <Text style={[typography.caption, { color: colors.foregroundMuted }]}>
            Default fallback vs custom fallback when image fails to load
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3], alignItems: 'center' }}>
            <View style={{ gap: spacing[1], alignItems: 'center' }}>
              <Image
                source={{ uri: SAMPLE_IMAGES.invalid }}
                style={{ width: 120, height: 120, borderRadius: radius.md }}
              />
              <Text style={[typography.caption, { color: colors.foregroundMuted }]}>Default</Text>
            </View>
            <View style={{ gap: spacing[1], alignItems: 'center' }}>
              <Image
                source={{ uri: SAMPLE_IMAGES.invalid }}
                fallback={
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: colors.secondary,
                    }}
                  >
                    <Text style={[typography.bodySm, { color: colors.secondaryForeground }]}>No Image</Text>
                  </View>
                }
                style={{ width: 120, height: 120, borderRadius: radius.md }}
              />
              <Text style={[typography.caption, { color: colors.foregroundMuted }]}>Custom</Text>
            </View>
          </View>
        </View>
      </Section>

      {/* Border Radius Section */}
      <Section title="Border Radius">
        <View style={{ gap: spacing[3] }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3], alignItems: 'flex-end' }}>
            <View style={{ gap: spacing[1], alignItems: 'center' }}>
              <Image
                source={{ uri: SAMPLE_IMAGES.square }}
                style={{ width: 80, height: 80, borderRadius: radius.none }}
              />
              <Text style={[typography.caption, { color: colors.foregroundMuted }]}>none</Text>
            </View>
            <View style={{ gap: spacing[1], alignItems: 'center' }}>
              <Image
                source={{ uri: SAMPLE_IMAGES.square }}
                style={{ width: 80, height: 80, borderRadius: radius.sm }}
              />
              <Text style={[typography.caption, { color: colors.foregroundMuted }]}>sm</Text>
            </View>
            <View style={{ gap: spacing[1], alignItems: 'center' }}>
              <Image
                source={{ uri: SAMPLE_IMAGES.square }}
                style={{ width: 80, height: 80, borderRadius: radius.md }}
              />
              <Text style={[typography.caption, { color: colors.foregroundMuted }]}>md</Text>
            </View>
            <View style={{ gap: spacing[1], alignItems: 'center' }}>
              <Image
                source={{ uri: SAMPLE_IMAGES.square }}
                style={{ width: 80, height: 80, borderRadius: radius.lg }}
              />
              <Text style={[typography.caption, { color: colors.foregroundMuted }]}>lg</Text>
            </View>
            <View style={{ gap: spacing[1], alignItems: 'center' }}>
              <Image
                source={{ uri: SAMPLE_IMAGES.square }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <Text style={[typography.caption, { color: colors.foregroundMuted }]}>full</Text>
            </View>
          </View>
        </View>
      </Section>

      {/* Aspect Ratios Section */}
      <Section title="Aspect Ratios">
        <View style={{ gap: spacing[4] }}>
          <View style={{ gap: spacing[1] }}>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>16:9 (widescreen)</Text>
            <Image
              source={{ uri: SAMPLE_IMAGES.landscape }}
              style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: radius.md }}
              resizeMode="cover"
            />
          </View>
          <View style={{ gap: spacing[1] }}>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>4:3 (standard)</Text>
            <Image
              source={{ uri: SAMPLE_IMAGES.landscape }}
              style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: radius.md }}
              resizeMode="cover"
            />
          </View>
          <View style={{ gap: spacing[1] }}>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>1:1 (square)</Text>
            <Image
              source={{ uri: SAMPLE_IMAGES.square }}
              style={{ width: 150, aspectRatio: 1, borderRadius: radius.md }}
              resizeMode="cover"
            />
          </View>
        </View>
      </Section>

      {/* Circular Images Section */}
      <Section title="Circular Images">
        <View style={{ gap: spacing[3] }}>
          <Text style={[typography.caption, { color: colors.foregroundMuted }]}>
            Use borderRadius equal to half the width for circular images
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4], alignItems: 'center' }}>
            <Image
              source={{ uri: SAMPLE_IMAGES.portrait }}
              style={{ width: 48, height: 48, borderRadius: 24 }}
            />
            <Image
              source={{ uri: SAMPLE_IMAGES.portrait }}
              style={{ width: 64, height: 64, borderRadius: 32 }}
            />
            <Image
              source={{ uri: SAMPLE_IMAGES.portrait }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
            <Image
              source={{ uri: SAMPLE_IMAGES.portrait }}
              style={{ width: 96, height: 96, borderRadius: 48 }}
            />
          </View>
        </View>
      </Section>

      {/* Resize Modes Section */}
      <Section title="Resize Modes">
        <View style={{ gap: spacing[3] }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
            <View style={{ gap: spacing[1], alignItems: 'center' }}>
              <Image
                source={{ uri: SAMPLE_IMAGES.landscape }}
                style={{ width: 100, height: 100, borderRadius: radius.sm }}
                resizeMode="cover"
              />
              <Text style={[typography.caption, { color: colors.foregroundMuted }]}>cover</Text>
            </View>
            <View style={{ gap: spacing[1], alignItems: 'center' }}>
              <Image
                source={{ uri: SAMPLE_IMAGES.landscape }}
                style={{ width: 100, height: 100, borderRadius: radius.sm, backgroundColor: colors.backgroundMuted }}
                resizeMode="contain"
              />
              <Text style={[typography.caption, { color: colors.foregroundMuted }]}>contain</Text>
            </View>
            <View style={{ gap: spacing[1], alignItems: 'center' }}>
              <Image
                source={{ uri: SAMPLE_IMAGES.landscape }}
                style={{ width: 100, height: 100, borderRadius: radius.sm }}
                resizeMode="center"
              />
              <Text style={[typography.caption, { color: colors.foregroundMuted }]}>center</Text>
            </View>
          </View>
        </View>
      </Section>
    </View>
  );
}
