import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '@nativeui/core';

const components = [
  { name: 'button', title: 'Button', description: 'Pressable button with variants and sizes' },
  { name: 'card', title: 'Card', description: 'Container with shadow, ImageCard, MediaCard variants' },
  { name: 'input', title: 'Input', description: 'Text input with validation and focus states' },
  { name: 'textarea', title: 'Textarea', description: 'Multiline input with auto-grow' },
  { name: 'select', title: 'Select', description: 'Bottom sheet picker for selections' },
  { name: 'slider', title: 'Slider', description: 'Value slider with gestures' },
  { name: 'stepper', title: 'Stepper', description: 'Quantity input with +/- buttons' },
  { name: 'badge', title: 'Badge', description: 'Status indicator with color variants' },
  { name: 'avatar', title: 'Avatar', description: 'Profile picture with fallback' },
  { name: 'checkbox', title: 'Checkbox', description: 'Animated checkbox with indeterminate state' },
  { name: 'switch', title: 'Switch', description: 'iOS-style toggle with smooth animations' },
  { name: 'radio-group', title: 'Radio Group', description: 'Single selection from multiple options' },
  { name: 'label', title: 'Label', description: 'Form label with required indicator' },
  { name: 'separator', title: 'Separator', description: 'Visual divider for content' },
  { name: 'spinner', title: 'Spinner', description: 'Loading indicator with size variants' },
  { name: 'skeleton', title: 'Skeleton', description: 'Shimmer placeholder for loading states' },
  { name: 'progress', title: 'Progress', description: 'Animated progress bar' },
  { name: 'sheet', title: 'Sheet', description: 'Bottom sheet with gestures' },
  { name: 'dialog', title: 'Dialog', description: 'Centered modal dialog' },
  { name: 'alert-dialog', title: 'Alert Dialog', description: 'Confirmation modal' },
  { name: 'toast', title: 'Toast', description: 'Notification messages' },
  { name: 'tabs', title: 'Tabs', description: 'Tabbed navigation with animated indicator' },
  { name: 'accordion', title: 'Accordion', description: 'Expandable content panels' },
  { name: 'segmented-control', title: 'Segmented Control', description: 'iOS-style segment picker' },
  { name: 'pull-to-refresh', title: 'Pull to Refresh', description: 'Refresh indicator for lists' },
  { name: 'swipeable-row', title: 'Swipeable Row', description: 'Swipe-to-reveal actions' },
];

export default function Home() {
  const { colors, spacing, radius, platformShadow } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.backgroundSubtle }]}
      contentContainerStyle={[styles.content, { padding: spacing[4] }]}
    >
      <View style={[styles.header, { marginBottom: spacing[6] }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Components</Text>
        <Text style={[styles.subtitle, { color: colors.foregroundMuted, marginTop: spacing[1] }]}>
          Tap a component to see examples and variants
        </Text>
      </View>

      <View style={[styles.grid, { gap: spacing[3] }]}>
        {components.map((component) => (
          <Link
            key={component.name}
            href={`/components/${component.name}`}
            asChild
          >
            <Pressable
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderRadius: radius.lg,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: spacing[4],
                  opacity: pressed ? 0.7 : 1,
                },
                platformShadow('sm'),
              ]}
            >
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                {component.title}
              </Text>
              <Text style={[styles.cardDescription, { color: colors.foregroundMuted, marginTop: spacing[1] }]}>
                {component.description}
              </Text>
            </Pressable>
          </Link>
        ))}
      </View>

      <View style={[styles.footer, { marginTop: spacing[8], paddingVertical: spacing[4] }]}>
        <Text style={[styles.footerText, { color: colors.foregroundMuted }]}>
          Built with @nativeui/core
        </Text>
        <Text style={[styles.footerHint, { color: colors.foregroundSubtle, marginTop: spacing[1] }]}>
          Tap 🎨 to change theme • 🌙 to toggle dark mode
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {},
  header: {},
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
  },
  grid: {},
  card: {},
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footerHint: {
    fontSize: 12,
  },
});
