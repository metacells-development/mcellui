/**
 * Swipeable Row
 *
 * A list row with swipe-to-reveal actions.
 * Supports left and right swipe actions with haptic feedback.
 *
 * @example
 * ```tsx
 * <SwipeableRow
 *   rightActions={[
 *     {
 *       label: 'Archive',
 *       color: '#3b82f6',
 *       onPress: () => handleArchive(),
 *     },
 *     {
 *       label: 'Delete',
 *       color: '#ef4444',
 *       onPress: () => handleDelete(),
 *     },
 *   ]}
 * >
 *   <ListItem title="Swipe me" />
 * </SwipeableRow>
 * ```
 */

import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { useTheme } from '@nativeui/core';
import { haptic } from '@nativeui/core';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ACTION_WIDTH = 80;
const SPRING_CONFIG = { damping: 20, stiffness: 200 };

export interface SwipeAction {
  /** Action label */
  label: string;
  /** Icon component (optional) */
  icon?: React.ReactNode;
  /** Background color */
  color: string;
  /** Text color */
  textColor?: string;
  /** Action callback */
  onPress: () => void;
}

export interface SwipeableRowProps {
  /** Content to display */
  children: React.ReactNode;
  /** Actions revealed on left swipe (right side) */
  rightActions?: SwipeAction[];
  /** Actions revealed on right swipe (left side) */
  leftActions?: SwipeAction[];
  /** Width of each action button */
  actionWidth?: number;
  /** Enable full swipe to trigger first action */
  fullSwipeEnabled?: boolean;
  /** Callback when row is swiped open */
  onSwipeOpen?: (direction: 'left' | 'right') => void;
  /** Callback when row is closed */
  onSwipeClose?: () => void;
  /** Container style */
  style?: ViewStyle;
}

export function SwipeableRow({
  children,
  rightActions = [],
  leftActions = [],
  actionWidth = ACTION_WIDTH,
  fullSwipeEnabled = true,
  onSwipeOpen,
  onSwipeClose,
  style,
}: SwipeableRowProps) {
  const { colors } = useTheme();

  const translateX = useSharedValue(0);
  const contextX = useSharedValue(0);
  const isOpen = useRef<'left' | 'right' | null>(null);

  const rightActionsWidth = rightActions.length * actionWidth;
  const leftActionsWidth = leftActions.length * actionWidth;
  const fullSwipeThreshold = SCREEN_WIDTH * 0.5;

  const close = useCallback(() => {
    translateX.value = withSpring(0, SPRING_CONFIG);
    if (isOpen.current) {
      isOpen.current = null;
      onSwipeClose?.();
    }
  }, [onSwipeClose]);

  const openRight = useCallback(() => {
    translateX.value = withSpring(-rightActionsWidth, SPRING_CONFIG);
    if (isOpen.current !== 'right') {
      isOpen.current = 'right';
      onSwipeOpen?.('right');
    }
  }, [rightActionsWidth, onSwipeOpen]);

  const openLeft = useCallback(() => {
    translateX.value = withSpring(leftActionsWidth, SPRING_CONFIG);
    if (isOpen.current !== 'left') {
      isOpen.current = 'left';
      onSwipeOpen?.('left');
    }
  }, [leftActionsWidth, onSwipeOpen]);

  const triggerFullSwipe = useCallback(
    (direction: 'left' | 'right') => {
      haptic('medium');
      const action = direction === 'right' ? rightActions[0] : leftActions[0];
      if (action) {
        // Animate off screen then reset
        const target = direction === 'right' ? -SCREEN_WIDTH : SCREEN_WIDTH;
        translateX.value = withTiming(target, { duration: 200 }, () => {
          runOnJS(action.onPress)();
          translateX.value = 0;
        });
      }
    },
    [rightActions, leftActions]
  );

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onStart(() => {
      contextX.value = translateX.value;
    })
    .onUpdate((event) => {
      let newX = contextX.value + event.translationX;

      // Limit swipe based on available actions
      if (rightActions.length === 0 && newX < 0) newX = 0;
      if (leftActions.length === 0 && newX > 0) newX = 0;

      // Add resistance at edges
      const maxRight = fullSwipeEnabled ? SCREEN_WIDTH : rightActionsWidth;
      const maxLeft = fullSwipeEnabled ? SCREEN_WIDTH : leftActionsWidth;

      if (newX < -maxRight) {
        newX = -maxRight - (newX + maxRight) * 0.2;
      }
      if (newX > maxLeft) {
        newX = maxLeft + (newX - maxLeft) * 0.2;
      }

      translateX.value = newX;
    })
    .onEnd((event) => {
      'worklet';
      const velocity = event.velocityX;
      const x = translateX.value;

      // Full swipe detection
      if (fullSwipeEnabled) {
        if (x < -fullSwipeThreshold && rightActions.length > 0) {
          runOnJS(triggerFullSwipe)('right');
          return;
        }
        if (x > fullSwipeThreshold && leftActions.length > 0) {
          runOnJS(triggerFullSwipe)('left');
          return;
        }
      }

      // Determine final position based on position and velocity
      if (x < -rightActionsWidth / 2 || velocity < -500) {
        if (rightActions.length > 0) {
          runOnJS(openRight)();
          runOnJS(haptic)('selection');
        } else {
          runOnJS(close)();
        }
      } else if (x > leftActionsWidth / 2 || velocity > 500) {
        if (leftActions.length > 0) {
          runOnJS(openLeft)();
          runOnJS(haptic)('selection');
        } else {
          runOnJS(close)();
        }
      } else {
        runOnJS(close)();
      }
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const rightActionsStyle = useAnimatedStyle(() => ({
    width: interpolate(
      -translateX.value,
      [0, rightActionsWidth],
      [0, rightActionsWidth],
      Extrapolation.EXTEND
    ),
  }));

  const leftActionsStyle = useAnimatedStyle(() => ({
    width: interpolate(
      translateX.value,
      [0, leftActionsWidth],
      [0, leftActionsWidth],
      Extrapolation.EXTEND
    ),
  }));

  return (
    <View style={[styles.container, style]}>
      {/* Left Actions (revealed on right swipe) */}
      {leftActions.length > 0 && (
        <Animated.View style={[styles.actionsContainer, styles.leftActions, leftActionsStyle]}>
          {leftActions.map((action, index) => (
            <ActionButton
              key={index}
              action={action}
              width={actionWidth}
              onPress={() => {
                haptic('light');
                action.onPress();
                close();
              }}
            />
          ))}
        </Animated.View>
      )}

      {/* Right Actions (revealed on left swipe) */}
      {rightActions.length > 0 && (
        <Animated.View style={[styles.actionsContainer, styles.rightActions, rightActionsStyle]}>
          {rightActions.map((action, index) => (
            <ActionButton
              key={index}
              action={action}
              width={actionWidth}
              onPress={() => {
                haptic('light');
                action.onPress();
                close();
              }}
            />
          ))}
        </Animated.View>
      )}

      {/* Main Content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.row, { backgroundColor: colors.background }, rowStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

interface ActionButtonProps {
  action: SwipeAction;
  width: number;
  onPress: () => void;
}

function ActionButton({ action, width, onPress }: ActionButtonProps) {
  return (
    <Pressable
      style={[
        styles.actionButton,
        { width, backgroundColor: action.color },
      ]}
      onPress={onPress}
    >
      {action.icon && <View style={styles.actionIcon}>{action.icon}</View>}
      <Text
        style={[
          styles.actionLabel,
          { color: action.textColor ?? '#fff' },
        ]}
        numberOfLines={1}
      >
        {action.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  row: {
    zIndex: 1,
  },
  actionsContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  leftActions: {
    left: 0,
    justifyContent: 'flex-start',
  },
  rightActions: {
    right: 0,
    justifyContent: 'flex-end',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  actionIcon: {
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
