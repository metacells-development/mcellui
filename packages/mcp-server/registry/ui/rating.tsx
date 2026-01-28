/**
 * Rating
 *
 * Interactive star rating for reviews and feedback.
 * Supports half-star precision and readonly display mode.
 *
 * @example
 * ```tsx
 * // Interactive rating
 * const [rating, setRating] = useState(0);
 * <Rating value={rating} onChange={setRating} />
 *
 * // Readonly display
 * <Rating value={4.5} readonly />
 *
 * // With label
 * <Rating value={3} readonly size="sm" />
 * <Text>{rating} out of 5</Text>
 *
 * // Different sizes
 * <Rating value={4} size="sm" readonly />
 * <Rating value={4} size="md" readonly />
 * <Rating value={4} size="lg" readonly />
 * ```
 */

import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme, haptic } from '@metacells/mcellui-core';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type RatingSize = 'sm' | 'md' | 'lg';

export interface RatingProps {
  /** Current rating value (0-5) */
  value: number;
  /** Maximum rating value */
  max?: number;
  /** Size preset */
  size?: RatingSize;
  /** Whether rating is readonly (display only) */
  readonly?: boolean;
  /** Allow half-star precision */
  precision?: 'full' | 'half';
  /** Change handler */
  onChange?: (value: number) => void;
  /** Container style */
  style?: ViewStyle;
  /** Active star color (defaults to warning yellow) */
  activeColor?: string;
  /** Inactive star color */
  inactiveColor?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Star SVG Path (simplified 5-point star)
// ─────────────────────────────────────────────────────────────────────────────

function StarIcon({ size, color }: { size: number; color: string }) {
  // Simple star shape using View components
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: size * 0.9,
          height: size * 0.9,
          backgroundColor: color,
          // Create star using clip path workaround (simplified to rounded square for now)
          borderRadius: size * 0.15,
          transform: [{ rotate: '45deg' }],
        }}
      />
      {/* Star points overlay */}
      <View
        style={{
          position: 'absolute',
          width: size * 0.6,
          height: size * 0.6,
          backgroundColor: color,
          borderRadius: size * 0.1,
        }}
      />
    </View>
  );
}

// Unicode star character approach (more reliable)
function StarText({ size, color, filled }: { size: number; color: string; filled: boolean }) {
  return (
    <Animated.Text
      style={{
        fontSize: size,
        color,
        lineHeight: size * 1.1,
        textAlign: 'center',
      }}
    >
      {filled ? '★' : '☆'}
    </Animated.Text>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual Star Component
// ─────────────────────────────────────────────────────────────────────────────

interface StarProps {
  index: number;
  filled: 'full' | 'half' | 'empty';
  size: number;
  activeColor: string;
  inactiveColor: string;
  readonly: boolean;
  onPress: () => void;
}

function Star({
  index,
  filled,
  size,
  activeColor,
  inactiveColor,
  readonly,
  onPress,
}: StarProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (readonly) return;
    scale.value = withSpring(0.85, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    if (readonly) return;
    scale.value = withSequence(
      withSpring(1.15, { damping: 15, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 400 })
    );
  };

  const handlePress = () => {
    if (readonly) return;
    haptic('light');
    onPress();
  };

  const color = filled === 'empty' ? inactiveColor : activeColor;

  if (readonly) {
    return (
      <View style={[styles.star, { width: size, height: size }]}>
        {filled === 'half' ? (
          <View style={styles.halfStarContainer}>
            <View style={[styles.halfStar, { width: size / 2, overflow: 'hidden' }]}>
              <StarText size={size} color={activeColor} filled />
            </View>
            <View style={[styles.halfStar, { width: size / 2, overflow: 'hidden', marginLeft: -size / 2 }]}>
              <View style={{ marginLeft: -size / 2 }}>
                <StarText size={size} color={inactiveColor} filled={false} />
              </View>
            </View>
          </View>
        ) : (
          <StarText size={size} color={color} filled={filled === 'full'} />
        )}
      </View>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.star, { width: size, height: size }, animatedStyle]}
      accessibilityRole="button"
      accessibilityLabel={`Rate ${index + 1} star${index > 0 ? 's' : ''}`}
    >
      <StarText size={size} color={color} filled={filled === 'full'} />
    </AnimatedPressable>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Rating Component
// ─────────────────────────────────────────────────────────────────────────────

export function Rating({
  value,
  max = 5,
  size = 'md',
  readonly = false,
  precision = 'full',
  onChange,
  style,
  activeColor,
  inactiveColor,
}: RatingProps) {
  const { colors, components } = useTheme();
  const tokens = components.rating[size];

  const starActiveColor = activeColor || colors.warning; // Amber/warning yellow
  const starInactiveColor = inactiveColor || colors.border;

  const handleStarPress = (index: number) => {
    if (readonly || !onChange) return;
    const newValue = index + 1;
    onChange(newValue);
  };

  const getStarFill = (index: number): 'full' | 'half' | 'empty' => {
    if (value >= index + 1) {
      return 'full';
    }
    if (precision === 'half' && value >= index + 0.5) {
      return 'half';
    }
    return 'empty';
  };

  return (
    <View
      style={[
        styles.container,
        { gap: tokens.gap },
        style,
      ]}
      accessibilityRole="adjustable"
      accessibilityValue={{
        min: 0,
        max,
        now: value,
        text: `${value} out of ${max} stars`,
      }}
    >
      {Array.from({ length: max }, (_, index) => (
        <Star
          key={index}
          index={index}
          filled={getStarFill(index)}
          size={tokens.starSize}
          activeColor={starActiveColor}
          inactiveColor={starInactiveColor}
          readonly={readonly}
          onPress={() => handleStarPress(index)}
        />
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  halfStarContainer: {
    flexDirection: 'row',
  },
  halfStar: {
    overflow: 'hidden',
  },
});
