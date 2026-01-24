import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
  const { colors, spacing } = useTheme();

  return (
    <View style={styles.container}>
      <Section title="Basic">
        <Image
          source={{ uri: SAMPLE_IMAGES.landscape }}
          style={{ width: '100%', height: 200 }}
          resizeMode="cover"
        />
      </Section>

      <Section title="Different Sizes">
        <View style={styles.row}>
          <Image
            source={{ uri: SAMPLE_IMAGES.square }}
            style={{ width: 80, height: 80, borderRadius: 8 }}
          />
          <Image
            source={{ uri: SAMPLE_IMAGES.square }}
            style={{ width: 100, height: 100, borderRadius: 12 }}
          />
          <Image
            source={{ uri: SAMPLE_IMAGES.square }}
            style={{ width: 120, height: 120, borderRadius: 16 }}
          />
        </View>
      </Section>

      <Section title="Aspect Ratio">
        <Image
          source={{ uri: SAMPLE_IMAGES.landscape }}
          style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: 12 }}
          resizeMode="cover"
        />
      </Section>

      <Section title="Circular">
        <View style={styles.row}>
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
      </Section>

      <Section title="Error Fallback">
        <View style={styles.row}>
          <Image
            source={{ uri: SAMPLE_IMAGES.invalid }}
            style={{ width: 120, height: 120, borderRadius: 12 }}
          />
          <Image
            source={{ uri: SAMPLE_IMAGES.invalid }}
            fallback={
              <View style={[styles.customFallback, { backgroundColor: colors.backgroundMuted }]}>
                <Text style={{ color: colors.foregroundMuted }}>No Image</Text>
              </View>
            }
            style={{ width: 120, height: 120, borderRadius: 12 }}
          />
        </View>
      </Section>

      <Section title="Loading State">
        <Text style={[styles.hint, { color: colors.foregroundMuted }]}>
          Images show a skeleton shimmer while loading
        </Text>
        <Image
          source={{ uri: `${SAMPLE_IMAGES.landscape}&t=${Date.now()}` }}
          style={{ width: '100%', height: 160, borderRadius: 12 }}
          resizeMode="cover"
        />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' },
  customFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: { fontSize: 14, marginBottom: 8 },
});
