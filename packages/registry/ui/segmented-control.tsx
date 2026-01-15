/**
 * Segmented Control
 *
 * A native iOS-style segmented control component.
 * Perfect for switching between views or filtering content.
 *
 * @example
 * ```tsx
 * const [selected, setSelected] = useState('daily');
 *
 * <SegmentedControl
 *   value={selected}
 *   onValueChange={setSelected}
 *   segments={[
 *     { label: 'Daily', value: 'daily' },
 *     { label: 'Weekly', value: 'weekly' },
 *     { label: 'Monthly', value: 'monthly' },
 *   ]}
 * />
 * ```
 */

import React, { useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  LayoutChangeEvent,
  LayoutRectangle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@nativeui/core';
import { haptic } from '@nativeui/core';

export type SegmentedControlSize = 'sm' | 'md' | 'lg';

export interface Segment {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /** Array of segment options */
  segments: Segment[];
  /** Current selected value */
  value: string;
  /** Callback when value changes */
  onValueChange: (value: string) => void;
  /** Size preset */
  size?: SegmentedControlSize;
  /** Disabled state */
  disabled?: boolean;
  /** Container style */
  style?: ViewStyle;
  /** Segment text style */
  textStyle?: TextStyle;
}

const heights: Record<SegmentedControlSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
};

const fontSizes: Record<SegmentedControlSize, number> = {
  sm: 13,
  md: 14,
  lg: 15,
};

const SPRING_CONFIG = { damping: 20, stiffness: 200 };

export function SegmentedControl({
  segments,
  value,
  onValueChange,
  size = 'md',
  disabled = false,
  style,
  textStyle,
}: SegmentedControlProps) {
  const { colors, radius } = useTheme();
  const segmentLayouts = useRef(new Map<string, LayoutRectangle>()).current;

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const height = heights[size];
  const fontSize = fontSizes[size];
  const padding = 4;
  const segmentHeight = height - padding * 2;

  const handleLayout = (segmentValue: string, event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout;
    segmentLayouts.set(segmentValue, layout);

    // Update indicator if this is the active segment
    if (segmentValue === value) {
      indicatorX.value = withSpring(layout.x, SPRING_CONFIG);
      indicatorWidth.value = withSpring(layout.width, SPRING_CONFIG);
    }
  };

  // Update indicator when value changes
  useEffect(() => {
    const layout = segmentLayouts.get(value);
    if (layout) {
      indicatorX.value = withSpring(layout.x, SPRING_CONFIG);
      indicatorWidth.value = withSpring(layout.width, SPRING_CONFIG);
    }
  }, [value, segmentLayouts]);

  const handlePress = useCallback(
    (segmentValue: string, segmentDisabled?: boolean) => {
      if (disabled || segmentDisabled) return;
      haptic('selection');
      onValueChange(segmentValue);
    },
    [disabled, onValueChange]
  );

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
  }));

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: colors.backgroundMuted,
          borderRadius: radius.lg,
          padding,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {/* Indicator */}
      <Animated.View
        style={[
          styles.indicator,
          {
            height: segmentHeight,
            backgroundColor: colors.background,
            borderRadius: radius.md,
          },
          indicatorStyle,
        ]}
      />

      {/* Segments */}
      {segments.map((segment) => {
        const isActive = value === segment.value;
        const isSegmentDisabled = disabled || segment.disabled;

        return (
          <Pressable
            key={segment.value}
            style={[
              styles.segment,
              {
                height: segmentHeight,
                opacity: isSegmentDisabled ? 0.5 : 1,
              },
            ]}
            onLayout={(e) => handleLayout(segment.value, e)}
            onPress={() => handlePress(segment.value, segment.disabled)}
            disabled={isSegmentDisabled}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive, disabled: isSegmentDisabled }}
          >
            <Text
              style={[
                styles.segmentText,
                {
                  fontSize,
                  color: isActive ? colors.foreground : colors.foregroundMuted,
                  fontWeight: isActive ? '600' : '500',
                },
                textStyle,
              ]}
              numberOfLines={1}
            >
              {segment.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    left: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    paddingHorizontal: 8,
  },
  segmentText: {
    textAlign: 'center',
  },
});
