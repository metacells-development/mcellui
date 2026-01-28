import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '@metacells/mcellui-core';

type ThemeResult = ReturnType<typeof useTheme>;

function getStyles(theme: ThemeResult) {
  const { fontSize, fontWeight, spacing } = theme;
  return {
    title: { fontSize: fontSize['2xl'], fontWeight: fontWeight.bold },
    subtitle: { fontSize: fontSize.base },
    cardTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold },
    cardDescription: { fontSize: fontSize.sm },
    playgroundTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold },
    playgroundDescription: { fontSize: fontSize.sm, marginTop: spacing[0.5] },
    playgroundIcon: { fontSize: fontSize.xl, fontWeight: fontWeight.semibold },
    footerText: { fontSize: fontSize.sm, fontWeight: fontWeight.medium },
    footerHint: { fontSize: fontSize.xs },
  };
}

const components = [
  { name: 'button', title: 'Button', description: 'Pressable button with variants and sizes' },
  { name: 'card', title: 'Card', description: 'Container with shadow, ImageCard, MediaCard variants' },
  { name: 'input', title: 'Input', description: 'Text input with validation and focus states' },
  { name: 'textarea', title: 'Textarea', description: 'Multiline input with auto-grow' },
  { name: 'search-input', title: 'Search Input', description: 'Search with icon, clear button, loading' },
  { name: 'select', title: 'Select', description: 'Bottom sheet picker for selections' },
  { name: 'slider', title: 'Slider', description: 'Value slider with gestures' },
  { name: 'stepper', title: 'Stepper', description: 'Quantity input with +/- buttons' },
  { name: 'icon-button', title: 'Icon Button', description: 'Icon-only button with variants' },
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
  { name: 'image', title: 'Image', description: 'Enhanced image with skeleton and fallback' },
  { name: 'list', title: 'List', description: 'List with items, slots, and dividers' },
  { name: 'horizontal-list', title: 'Horizontal List', description: 'Snap-scroll horizontal container' },
  { name: 'section-header', title: 'Section Header', description: 'Title with See All action' },
  { name: 'sheet', title: 'Sheet', description: 'Bottom sheet with gestures' },
  { name: 'dialog', title: 'Dialog', description: 'Centered modal dialog' },
  { name: 'alert-dialog', title: 'Alert Dialog', description: 'Confirmation modal' },
  { name: 'toast', title: 'Toast', description: 'Notification messages' },
  { name: 'tabs', title: 'Tabs', description: 'Tabbed navigation with animated indicator' },
  { name: 'accordion', title: 'Accordion', description: 'Expandable content panels' },
  { name: 'segmented-control', title: 'Segmented Control', description: 'iOS-style segment picker' },
  { name: 'pull-to-refresh', title: 'Pull to Refresh', description: 'Refresh indicator for lists' },
  { name: 'swipeable-row', title: 'Swipeable Row', description: 'Swipe-to-reveal actions' },
  { name: 'form', title: 'Form', description: 'Form system with react-hook-form + Zod' },
  { name: 'chip', title: 'Chip', description: 'Selectable filter pills' },
  { name: 'fab', title: 'FAB', description: 'Floating action button' },
  { name: 'action-sheet', title: 'Action Sheet', description: 'iOS-style bottom action menu' },
  { name: 'avatar-stack', title: 'Avatar Stack', description: 'Overlapping avatar group' },
  { name: 'rating', title: 'Rating', description: 'Interactive star rating' },
  { name: 'carousel', title: 'Carousel', description: 'Auto-playing slideshow with indicators' },
  { name: 'stories', title: 'Stories', description: 'Instagram-style story avatars' },
  { name: 'datetime-picker', title: 'DateTime Picker', description: 'Native date and time selection' },
  { name: 'tooltip', title: 'Tooltip', description: 'Long-press contextual popup' },
  { name: 'image-gallery', title: 'Image Gallery', description: 'Grid gallery with fullscreen viewer' },
  { name: 'blocks', title: 'Blocks', description: 'Reusable sections (Hero, Stats, Feature cards, etc.)' },
  { name: 'screens', title: 'Screens', description: 'Full-page templates (Login, Profile, Settings, etc.)' },
];

export default function Home() {
  const theme = useTheme();
  const { colors, spacing, radius, platformShadow } = theme;
  const dynamicStyles = getStyles(theme);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.backgroundSubtle }]}
      contentContainerStyle={[styles.content, { padding: spacing[4] }]}
    >
      <View style={[styles.header, { marginBottom: spacing[6] }]}>
        <Text style={[styles.title, { color: colors.foreground }, dynamicStyles.title]}>Components</Text>
        <Text style={[styles.subtitle, { color: colors.foregroundMuted, marginTop: spacing[1] }, dynamicStyles.subtitle]}>
          Tap a component to see examples and variants
        </Text>
      </View>

      {/* Theme Playground Link */}
      <Link href="/playground" asChild>
        <Pressable
          style={({ pressed }) => [
            styles.playgroundCard,
            {
              backgroundColor: colors.primary,
              borderRadius: radius.lg,
              padding: spacing[4],
              marginBottom: spacing[4],
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <View style={styles.playgroundContent}>
            <View>
              <Text style={[styles.playgroundTitle, { color: colors.primaryForeground }, dynamicStyles.playgroundTitle]}>
                Theme Playground
              </Text>
              <Text style={[styles.playgroundDescription, { color: colors.primaryForeground, opacity: 0.8 }, dynamicStyles.playgroundDescription]}>
                Explore all 40 theme/radius combinations
              </Text>
            </View>
            <Text style={[styles.playgroundIcon, { color: colors.primaryForeground }, dynamicStyles.playgroundIcon]}>
              →
            </Text>
          </View>
        </Pressable>
      </Link>

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
              <Text style={[styles.cardTitle, { color: colors.foreground }, dynamicStyles.cardTitle]}>
                {component.title}
              </Text>
              <Text style={[styles.cardDescription, { color: colors.foregroundMuted, marginTop: spacing[1] }, dynamicStyles.cardDescription]}>
                {component.description}
              </Text>
            </Pressable>
          </Link>
        ))}
      </View>

      <View style={[styles.footer, { marginTop: spacing[8], paddingVertical: spacing[4] }]}>
        <Text style={[styles.footerText, { color: colors.foregroundMuted }, dynamicStyles.footerText]}>
          Built with @metacells/mcellui-core
        </Text>
        <Text style={[styles.footerHint, { color: colors.foregroundSubtle, marginTop: spacing[1] }, dynamicStyles.footerHint]}>
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
  title: {},
  subtitle: {},
  grid: {},
  card: {},
  cardTitle: {},
  cardDescription: {},
  playgroundCard: {},
  playgroundContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playgroundTitle: {},
  playgroundDescription: {},
  playgroundIcon: {},
  footer: {
    alignItems: 'center',
  },
  footerText: {},
  footerHint: {},
});
