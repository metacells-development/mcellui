import React from 'react';
import { View, Text, TextStyle, ViewStyle } from 'react-native';
import { ImageGallery } from '@/components/ui/image-gallery';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

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
  const { colors, spacing, radius, fontSize } = useTheme();

  const handleImagePress = (index: number) => {
    console.log('Image pressed:', index);
  };

  const containerStyle: ViewStyle = {
    gap: spacing[6], // 24px
  };

  const hintStyle: TextStyle = {
    fontSize: fontSize.xs, // 12px
    color: colors.foregroundMuted,
    marginTop: spacing[2], // 8px
    textAlign: 'center',
  };

  const labelStyle: TextStyle = {
    fontSize: fontSize.sm, // 14px
    color: colors.foregroundMuted,
    marginBottom: spacing[2], // 8px
    textAlign: 'center',
  };

  return (
    <View style={containerStyle}>
      <Section title="Grid Layouts">
        <View style={{ gap: spacing[4] }}>
          <View>
            <Text style={labelStyle}>2 Columns</Text>
            <View style={{ marginHorizontal: -spacing[4] }}>
              <ImageGallery
                images={FEW_IMAGES}
                columns={2}
                spacing={4}
              />
            </View>
          </View>
          <View>
            <Text style={labelStyle}>3 Columns (Default)</Text>
            <View style={{ marginHorizontal: -spacing[4] }}>
              <ImageGallery
                images={SAMPLE_IMAGES.slice(0, 6)}
                columns={3}
                onImagePress={handleImagePress}
              />
            </View>
          </View>
          <View>
            <Text style={labelStyle}>4 Columns</Text>
            <View style={{ marginHorizontal: -spacing[4] }}>
              <ImageGallery
                images={SAMPLE_IMAGES}
                columns={4}
                spacing={2}
              />
            </View>
          </View>
        </View>
      </Section>

      <Section title="Aspect Ratios">
        <View style={{ gap: spacing[4] }}>
          <View>
            <Text style={labelStyle}>Square (1:1)</Text>
            <View style={{ marginHorizontal: -spacing[4] }}>
              <ImageGallery
                images={FEW_IMAGES}
                columns={2}
                spacing={4}
                aspectRatio={1}
                borderRadius={radius.md}
              />
            </View>
          </View>
          <View>
            <Text style={labelStyle}>Portrait (3:4)</Text>
            <View style={{ marginHorizontal: -spacing[4] }}>
              <ImageGallery
                images={FEW_IMAGES.slice(0, 3)}
                columns={3}
                spacing={4}
                aspectRatio={0.75}
                borderRadius={radius.md}
              />
            </View>
          </View>
          <View>
            <Text style={labelStyle}>Landscape (16:9)</Text>
            <View style={{ marginHorizontal: -spacing[4] }}>
              <ImageGallery
                images={FEW_IMAGES.slice(0, 2)}
                columns={2}
                spacing={8}
                aspectRatio={16 / 9}
                borderRadius={radius.lg}
              />
            </View>
          </View>
        </View>
      </Section>

      <Section title="Spacing">
        <View style={{ gap: spacing[4] }}>
          <View>
            <Text style={labelStyle}>Tight (2px)</Text>
            <View style={{ marginHorizontal: -spacing[4] }}>
              <ImageGallery
                images={FEW_IMAGES}
                columns={2}
                spacing={2}
              />
            </View>
          </View>
          <View>
            <Text style={labelStyle}>Normal (4px)</Text>
            <View style={{ marginHorizontal: -spacing[4] }}>
              <ImageGallery
                images={FEW_IMAGES}
                columns={2}
                spacing={4}
              />
            </View>
          </View>
          <View>
            <Text style={labelStyle}>Loose (8px)</Text>
            <View style={{ marginHorizontal: -spacing[4] }}>
              <ImageGallery
                images={FEW_IMAGES}
                columns={2}
                spacing={8}
              />
            </View>
          </View>
        </View>
      </Section>

      <Section title="Features">
        <View style={{ gap: spacing[4] }}>
          <View>
            <Text style={labelStyle}>Custom Border Radius</Text>
            <View style={{ marginHorizontal: -spacing[4] }}>
              <ImageGallery
                images={FEW_IMAGES}
                columns={2}
                spacing={8}
                borderRadius={radius.lg}
              />
            </View>
          </View>
          <View>
            <Text style={labelStyle}>Viewer Disabled</Text>
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
            <Text style={hintStyle}>
              Fullscreen viewer disabled - use for custom actions
            </Text>
          </View>
        </View>
      </Section>

      <Section title="Use Cases">
        <View style={{ gap: spacing[4] }}>
          <View>
            <Text style={labelStyle}>Photo Album</Text>
            <View style={{ marginHorizontal: -spacing[4] }}>
              <ImageGallery
                images={SAMPLE_IMAGES}
                columns={3}
                spacing={4}
                borderRadius={radius.sm}
                onImagePress={handleImagePress}
              />
            </View>
            <Text style={hintStyle}>
              Tap any image to view fullscreen. Pinch to zoom, swipe to navigate.
            </Text>
          </View>
          <View>
            <Text style={labelStyle}>Product Images</Text>
            <View style={{ marginHorizontal: -spacing[4] }}>
              <ImageGallery
                images={FEW_IMAGES}
                columns={2}
                spacing={8}
                aspectRatio={1}
                borderRadius={radius.lg}
              />
            </View>
            <Text style={hintStyle}>
              Square aspect ratio with larger spacing for e-commerce
            </Text>
          </View>
        </View>
      </Section>
    </View>
  );
}
