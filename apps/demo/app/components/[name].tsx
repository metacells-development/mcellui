import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTheme } from '@nativeui/core';

// Component demos
import { ButtonDemo } from '@/components/demos/button-demo';
import { CardDemo } from '@/components/demos/card-demo';
import { InputDemo } from '@/components/demos/input-demo';
import { BadgeDemo } from '@/components/demos/badge-demo';
import { AvatarDemo } from '@/components/demos/avatar-demo';
import { CheckboxDemo } from '@/components/demos/checkbox-demo';
import { SwitchDemo } from '@/components/demos/switch-demo';
import { RadioGroupDemo } from '@/components/demos/radio-group-demo';
import { LabelDemo } from '@/components/demos/label-demo';
import { SeparatorDemo } from '@/components/demos/separator-demo';
import { SpinnerDemo } from '@/components/demos/spinner-demo';
import { SkeletonDemo } from '@/components/demos/skeleton-demo';
import { ProgressDemo } from '@/components/demos/progress-demo';
import { SheetDemo } from '@/components/demos/sheet-demo';
import { DialogDemo } from '@/components/demos/dialog-demo';
import { AlertDialogDemo } from '@/components/demos/alert-dialog-demo';
import { ToastDemo } from '@/components/demos/toast-demo';
import { TextareaDemo } from '@/components/demos/textarea-demo';
import { SelectDemo } from '@/components/demos/select-demo';
import { SliderDemo } from '@/components/demos/slider-demo';
import { StepperDemo } from '@/components/demos/stepper-demo';
import { TabsDemo } from '@/components/demos/tabs-demo';
import { AccordionDemo } from '@/components/demos/accordion-demo';
import { SegmentedControlDemo } from '@/components/demos/segmented-control-demo';
import { PullToRefreshDemo } from '@/components/demos/pull-to-refresh-demo';
import { SwipeableRowDemo } from '@/components/demos/swipeable-row-demo';
import { FormDemo } from '@/components/demos/form-demo';
import { BlocksDemo } from '@/components/demos/blocks-demo';
// Phase 5 - Batch 1
import { SearchInputDemo } from '@/components/demos/search-input-demo';
import { IconButtonDemo } from '@/components/demos/icon-button-demo';
import { ListDemo } from '@/components/demos/list-demo';
import { ImageDemo } from '@/components/demos/image-demo';
import { HorizontalListDemo } from '@/components/demos/horizontal-list-demo';
import { SectionHeaderDemo } from '@/components/demos/section-header-demo';
// Phase 5 - Batch 2
import { ChipDemo } from '@/components/demos/chip-demo';
import { FABDemo } from '@/components/demos/fab-demo';
import { ActionSheetDemo } from '@/components/demos/action-sheet-demo';
import { AvatarStackDemo } from '@/components/demos/avatar-stack-demo';
import { RatingDemo } from '@/components/demos/rating-demo';
import { CarouselDemo } from '@/components/demos/carousel-demo';
// Phase 5 - Batch 3
import { StoriesDemo } from '@/components/demos/stories-demo';
import { DateTimePickerDemo } from '@/components/demos/datetime-picker-demo';
import { TooltipDemo } from '@/components/demos/tooltip-demo';
import { ImageGalleryDemo } from '@/components/demos/image-gallery-demo';
// Phase 5 - Screens
import { ScreensDemo } from '@/components/demos/screens-demo';

const demos: Record<string, React.ComponentType> = {
  button: ButtonDemo,
  card: CardDemo,
  input: InputDemo,
  textarea: TextareaDemo,
  select: SelectDemo,
  slider: SliderDemo,
  stepper: StepperDemo,
  badge: BadgeDemo,
  avatar: AvatarDemo,
  checkbox: CheckboxDemo,
  switch: SwitchDemo,
  'radio-group': RadioGroupDemo,
  label: LabelDemo,
  separator: SeparatorDemo,
  spinner: SpinnerDemo,
  skeleton: SkeletonDemo,
  progress: ProgressDemo,
  sheet: SheetDemo,
  dialog: DialogDemo,
  'alert-dialog': AlertDialogDemo,
  toast: ToastDemo,
  tabs: TabsDemo,
  accordion: AccordionDemo,
  'segmented-control': SegmentedControlDemo,
  'pull-to-refresh': PullToRefreshDemo,
  'swipeable-row': SwipeableRowDemo,
  form: FormDemo,
  blocks: BlocksDemo,
  // Phase 5 - Batch 1
  'search-input': SearchInputDemo,
  'icon-button': IconButtonDemo,
  list: ListDemo,
  image: ImageDemo,
  'horizontal-list': HorizontalListDemo,
  'section-header': SectionHeaderDemo,
  // Phase 5 - Batch 2
  chip: ChipDemo,
  fab: FABDemo,
  'action-sheet': ActionSheetDemo,
  'avatar-stack': AvatarStackDemo,
  rating: RatingDemo,
  carousel: CarouselDemo,
  // Phase 5 - Batch 3
  stories: StoriesDemo,
  'datetime-picker': DateTimePickerDemo,
  tooltip: TooltipDemo,
  'image-gallery': ImageGalleryDemo,
  // Phase 5 - Screens
  screens: ScreensDemo,
};

const titles: Record<string, string> = {
  button: 'Button',
  card: 'Card',
  input: 'Input',
  textarea: 'Textarea',
  select: 'Select',
  slider: 'Slider',
  stepper: 'Stepper',
  badge: 'Badge',
  avatar: 'Avatar',
  checkbox: 'Checkbox',
  switch: 'Switch',
  'radio-group': 'Radio Group',
  label: 'Label',
  separator: 'Separator',
  spinner: 'Spinner',
  skeleton: 'Skeleton',
  progress: 'Progress',
  sheet: 'Sheet',
  dialog: 'Dialog',
  'alert-dialog': 'Alert Dialog',
  toast: 'Toast',
  tabs: 'Tabs',
  accordion: 'Accordion',
  'segmented-control': 'Segmented Control',
  'pull-to-refresh': 'Pull to Refresh',
  'swipeable-row': 'Swipeable Row',
  form: 'Form',
  blocks: 'Blocks',
  // Phase 5 - Batch 1
  'search-input': 'Search Input',
  'icon-button': 'Icon Button',
  list: 'List',
  image: 'Image',
  'horizontal-list': 'Horizontal List',
  'section-header': 'Section Header',
  // Phase 5 - Batch 2
  chip: 'Chip',
  fab: 'FAB',
  'action-sheet': 'Action Sheet',
  'avatar-stack': 'Avatar Stack',
  rating: 'Rating',
  carousel: 'Carousel',
  // Phase 5 - Batch 3
  stories: 'Stories',
  'datetime-picker': 'DateTime Picker',
  tooltip: 'Tooltip',
  'image-gallery': 'Image Gallery',
  // Phase 5 - Screens
  screens: 'Screens',
};

export default function ComponentPage() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const { colors, spacing } = useTheme();
  const DemoComponent = demos[name ?? ''];
  const title = titles[name ?? ''] ?? 'Component';

  return (
    <>
      <Stack.Screen options={{ title }} />
      <ScrollView
        style={[styles.container, { backgroundColor: colors.backgroundSubtle }]}
        contentContainerStyle={[styles.content, { padding: spacing[4] }]}
      >
        {DemoComponent ? (
          <DemoComponent />
        ) : (
          <View style={styles.notFound}>
            <Text style={[styles.notFoundText, { color: colors.foregroundMuted }]}>
              Component "{name}" not found
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {},
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  notFoundText: {
    fontSize: 16,
  },
});
