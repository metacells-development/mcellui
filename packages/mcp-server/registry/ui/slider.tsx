/**
 * Slider
 *
 * A value slider component with gesture support.
 * Supports range selection and step values.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState(50);
 *
 * <Slider value={value} onValueChange={setValue} />
 * <Slider value={value} onValueChange={setValue} min={0} max={100} step={10} />
 * <Slider value={value} onValueChange={setValue} showValue />
 * ```
 */

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { useTheme, areAnimationsDisabled } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

export type SliderSize = 'sm' | 'md' | 'lg';

export interface SliderProps {
  /** Current value */
  value: number;
  /** Callback when value changes */
  onValueChange?: (value: number) => void;
  /** Callback when sliding starts */
  onSlidingStart?: () => void;
  /** Callback when sliding ends */
  onSlidingComplete?: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Size preset */
  size?: SliderSize;
  /** Show current value label */
  showValue?: boolean;
  /** Format value for display */
  formatValue?: (value: number) => string;
  /** Label text */
  label?: string;
  /** Container style */
  style?: ViewStyle;
  /** Label style */
  labelStyle?: TextStyle;
}

export function Slider({
  value,
  onValueChange,
  onSlidingStart,
  onSlidingComplete,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  size = 'md',
  showValue = false,
  formatValue,
  label,
  style,
  labelStyle,
}: SliderProps) {
  const { colors, components, spacing, platformShadow } = useTheme();
  const tokens = components.slider[size];
  const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);

  const trackWidth = useSharedValue(0);
  const thumbScale = useSharedValue(1);

  const trackHeight = tokens.trackHeight;
  const thumbSize = tokens.thumbSize;

  // Calculate value from position (JS thread version)
  const calculateValue = useCallback(
    (posX: number, width: number): number => {
      if (width === 0) return min;
      const percentage = Math.max(0, Math.min(1, posX / width));
      let newValue = min + percentage * (max - min);

      // Apply step
      if (step > 0) {
        newValue = Math.round(newValue / step) * step;
      }

      return Math.max(min, Math.min(max, newValue));
    },
    [min, max, step]
  );

  const handleUpdate = useCallback(
    (posX: number, width: number) => {
      const newValue = calculateValue(posX, width);
      onValueChange?.(newValue);
    },
    [calculateValue, onValueChange]
  );

  const handleSlidingStart = useCallback(() => {
    haptic('selection');
    onSlidingStart?.();
  }, [onSlidingStart]);

  const handleSlidingComplete = useCallback(
    (posX: number, width: number) => {
      const finalValue = calculateValue(posX, width);
      haptic('light');
      onSlidingComplete?.(finalValue);
    },
    [calculateValue, onSlidingComplete]
  );

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onStart(() => {
      'worklet';
      if (animationsEnabled) {
        thumbScale.value = withSpring(1.2, { damping: 20, stiffness: 300 });
      }
      runOnJS(handleSlidingStart)();
    })
    .onUpdate((event) => {
      'worklet';
      runOnJS(handleUpdate)(event.x, trackWidth.value);
    })
    .onEnd((event) => {
      'worklet';
      if (animationsEnabled) {
        thumbScale.value = withSpring(1, { damping: 20, stiffness: 300 });
      }
      runOnJS(handleSlidingComplete)(event.x, trackWidth.value);
    });

  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onEnd((event) => {
      'worklet';
      runOnJS(handleUpdate)(event.x, trackWidth.value);
      runOnJS(handleSlidingComplete)(event.x, trackWidth.value);
    });

  const gesture = Gesture.Race(panGesture, tapGesture);

  const handleLayout = (event: LayoutChangeEvent) => {
    trackWidth.value = event.nativeEvent.layout.width;
  };

  const percentage = ((value - min) / (max - min)) * 100;

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animationsEnabled ? thumbScale.value : 1 }],
  }));

  const displayValue = formatValue ? formatValue(value) : value.toString();

  return (
    <View style={[styles.container, style]}>
      {(label || showValue) && (
        <View style={[styles.header, { marginBottom: spacing[2] }]}>
          {label && (
            <Text
              style={[
                styles.label,
                {
                  fontSize: tokens.labelFontSize,
                  color: disabled ? colors.foregroundMuted : colors.foreground,
                },
                labelStyle,
              ]}
            >
              {label}
            </Text>
          )}
          {showValue && (
            <Text
              style={[
                styles.value,
                {
                  fontSize: tokens.valueFontSize,
                  color: disabled ? colors.foregroundMuted : colors.primary,
                },
              ]}
            >
              {displayValue}
            </Text>
          )}
        </View>
      )}

      <GestureDetector gesture={gesture}>
        <View
          style={[
            styles.trackContainer,
            { height: thumbSize, opacity: disabled ? 0.5 : 1 },
          ]}
          onLayout={handleLayout}
        >
          {/* Track background */}
          <View
            style={[
              styles.track,
              {
                height: trackHeight,
                borderRadius: trackHeight / 2,
                backgroundColor: colors.backgroundMuted,
              },
            ]}
          />

          {/* Track fill */}
          <View
            style={[
              styles.trackFill,
              {
                height: trackHeight,
                borderRadius: trackHeight / 2,
                backgroundColor: colors.primary,
                width: `${percentage}%`,
              },
            ]}
          />

          {/* Thumb */}
          <Animated.View
            style={[
              styles.thumb,
              {
                width: thumbSize,
                height: thumbSize,
                borderRadius: thumbSize / 2,
                backgroundColor: colors.background,
                borderWidth: 2,
                borderColor: colors.primary,
                left: `${percentage}%`,
                marginLeft: -thumbSize / 2,
              },
              platformShadow('sm'),
              thumbAnimatedStyle,
            ]}
          />
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: '500',
  },
  value: {
    fontWeight: '600',
  },
  trackContainer: {
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  trackFill: {
    position: 'absolute',
    left: 0,
  },
  thumb: {
    position: 'absolute',
  },
});
