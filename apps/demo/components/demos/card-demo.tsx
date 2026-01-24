import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
  ImageCard,
  MediaCard,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';
const SAMPLE_IMAGE_2 = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80';
const SAMPLE_IMAGE_3 = 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=800&q=80';

export function CardDemo() {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { gap: spacing[6] }]}>
      {/* Section: Basic Card */}
      <View style={[styles.section, { gap: spacing[3] }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Basic Card</Text>
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>This is a description of the card content.</CardDescription>
          </CardHeader>
          <CardContent>
            <Text style={{ fontSize: 14, color: colors.foregroundMuted, lineHeight: 20 }}>
              Cards are used to group and display content in a clear, organized way.
              They support headers, content areas, and footers.
            </Text>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onPress={() => Alert.alert('Cancelled')}>
              Cancel
            </Button>
            <Button size="sm" onPress={() => Alert.alert('Saved!')}>
              Save
            </Button>
          </CardFooter>
        </Card>
      </View>

      {/* Section: Pressable Card */}
      <View style={[styles.section, { gap: spacing[3] }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Pressable Card</Text>
        <Card onPress={() => Alert.alert('Card pressed!')}>
          <CardHeader>
            <CardTitle>Tap Me</CardTitle>
            <CardDescription>This card has a press animation</CardDescription>
          </CardHeader>
          <CardContent>
            <Text style={{ fontSize: 14, color: colors.foregroundMuted }}>
              Interactive cards scale down on press with haptic feedback.
            </Text>
          </CardContent>
        </Card>
      </View>

      {/* Section: Card with Image */}
      <View style={[styles.section, { gap: spacing[3] }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Card with Image</Text>
        <Card>
          <CardImage source={{ uri: SAMPLE_IMAGE }} height={160} />
          <CardHeader>
            <CardTitle>Mountain View</CardTitle>
            <CardDescription>Scenic mountain landscape</CardDescription>
          </CardHeader>
          <CardContent>
            <Text style={{ fontSize: 14, color: colors.foregroundMuted }}>
              CardImage supports height, aspectRatio, and overlay props.
            </Text>
          </CardContent>
        </Card>
      </View>

      {/* Section: ImageCard */}
      <View style={[styles.section, { gap: spacing[3] }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>ImageCard</Text>
        <Text style={{ fontSize: 13, color: colors.foregroundMuted, marginBottom: spacing[2] }}>
          Full-bleed image with text overlay
        </Text>
        <ImageCard
          source={{ uri: SAMPLE_IMAGE_2 }}
          title="Explore Nature"
          subtitle="Discover beautiful landscapes"
          height={220}
          onPress={() => Alert.alert('ImageCard pressed!')}
        />
      </View>

      {/* Section: ImageCard Text Position */}
      <View style={[styles.section, { gap: spacing[3] }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>ImageCard - Text Top</Text>
        <ImageCard
          source={{ uri: SAMPLE_IMAGE_3 }}
          title="Featured Story"
          subtitle="Text positioned at top"
          height={200}
          textPosition="top"
        />
      </View>

      {/* Section: MediaCard */}
      <View style={[styles.section, { gap: spacing[3] }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>MediaCard</Text>
        <Text style={{ fontSize: 13, color: colors.foregroundMuted, marginBottom: spacing[2] }}>
          Image with text below (blog/news style)
        </Text>
        <MediaCard
          source={{ uri: SAMPLE_IMAGE }}
          title="Getting Started with NativeUI"
          description="Learn how to build beautiful React Native apps with our component library."
          category="Tutorial"
          height={160}
          onPress={() => Alert.alert('MediaCard pressed!')}
        />
      </View>

      {/* Section: MediaCard Grid */}
      <View style={[styles.section, { gap: spacing[3] }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>MediaCard Grid</Text>
        <View style={[styles.mediaGrid, { gap: spacing[3] }]}>
          <View style={styles.mediaGridItem}>
            <MediaCard
              source={{ uri: SAMPLE_IMAGE_2 }}
              title="Design Systems"
              category="Design"
              height={120}
              aspectRatio={1.5}
            />
          </View>
          <View style={styles.mediaGridItem}>
            <MediaCard
              source={{ uri: SAMPLE_IMAGE_3 }}
              title="Mobile Development"
              category="Dev"
              height={120}
              aspectRatio={1.5}
            />
          </View>
        </View>
      </View>

      {/* Section: Simple Card */}
      <View style={[styles.section, { gap: spacing[3] }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Simple Card</Text>
        <Card style={{ padding: spacing[4] }}>
          <Text style={{ fontSize: 14, color: colors.foreground }}>
            A simple card without header/footer components.
          </Text>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  section: {},
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  mediaGrid: {
    flexDirection: 'row',
  },
  mediaGridItem: {
    flex: 1,
  },
});
