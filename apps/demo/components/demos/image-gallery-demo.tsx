import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ImageGallery } from '@/components/ui/image-gallery';
import { Section } from './section';
import { useTheme } from '@nativeui/core';

// Sample images from Unsplash
const SAMPLE_IMAGES = [
  { uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', alt: 'Mountains' },
  { uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', alt: 'Nature' },
  { uri: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400', alt: 'Forest' },
  { uri: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400', alt: 'Waterfall' },
  { uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400', alt: 'Lake' },
  { uri: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400', alt: 'Fog' },
  { uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', alt: 'Sunlight' },
  { uri: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400', alt: 'Valley' },
  { uri: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400', alt: 'Flowers' },
];

const FEW_IMAGES = SAMPLE_IMAGES.slice(0, 4);

export function ImageGalleryDemo() {
  const { colors, spacing, radius } = useTheme();

  const handleImagePress = (index: number) => {
    console.log('Image pressed:', index);
  };

  return (
    <View style={styles.container}>
      <Section title="Basic Gallery (3 columns)">
        <View style={{ marginHorizontal: -spacing[4] }}>
          <ImageGallery
            images={SAMPLE_IMAGES}
            onImagePress={handleImagePress}
          />
        </View>
        <Text style={[styles.hint, { color: colors.foregroundMuted }]}>
          Tap any image to view fullscreen. Pinch to zoom, swipe to navigate.
        </Text>
      </Section>

      <Section title="2 Columns">
        <View style={{ marginHorizontal: -spacing[4] }}>
          <ImageGallery
            images={FEW_IMAGES}
            columns={2}
            spacing={4}
          />
        </View>
      </Section>

      <Section title="4 Columns (Small Grid)">
        <View style={{ marginHorizontal: -spacing[4] }}>
          <ImageGallery
            images={SAMPLE_IMAGES}
            columns={4}
            spacing={2}
          />
        </View>
      </Section>

      <Section title="With Border Radius">
        <View style={{ marginHorizontal: -spacing[4] }}>
          <ImageGallery
            images={FEW_IMAGES}
            columns={2}
            spacing={8}
            borderRadius={radius.lg}
          />
        </View>
      </Section>

      <Section title="Portrait Aspect Ratio">
        <View style={{ marginHorizontal: -spacing[4] }}>
          <ImageGallery
            images={FEW_IMAGES.slice(0, 3)}
            columns={3}
            spacing={4}
            aspectRatio={0.75}
            borderRadius={radius.md}
          />
        </View>
      </Section>

      <Section title="Landscape Aspect Ratio">
        <View style={{ marginHorizontal: -spacing[4] }}>
          <ImageGallery
            images={FEW_IMAGES.slice(0, 2)}
            columns={2}
            spacing={8}
            aspectRatio={1.5}
            borderRadius={radius.lg}
          />
        </View>
      </Section>

      <Section title="Viewer Disabled">
        <View style={{ marginHorizontal: -spacing[4] }}>
          <ImageGallery
            images={FEW_IMAGES.slice(0, 3)}
            columns={3}
            disableViewer
            onImagePress={(index) => {
              console.log('Custom action for image:', index);
            }}
          />
        </View>
        <Text style={[styles.hint, { color: colors.foregroundMuted }]}>
          Fullscreen viewer is disabled. Use onImagePress for custom actions.
        </Text>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 32 },
  hint: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});
