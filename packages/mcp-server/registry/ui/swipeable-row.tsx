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

import React, { useCallback, useRef, useMemo } from 'react';
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
import {
  useTheme,
  areAnimationsDisabled,
  swipeableRowTokens,
  SWIPEABLE_ROW_CONSTANTS,
} from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

const SCREEN_WIDTH = Dimensions.get('window').width;

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
  actionWidth = SWIPEABLE_ROW_CONSTANTS.actionWidth,
  fullSwipeEnabled = true,
  onSwipeOpen,
  onSwipeClose,
  style,
}: SwipeableRowProps) {
  const { colors } = useTheme();
  const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);

  const translateX = useSharedValue(0);
  const contextX = useSharedValue(0);
  const isOpen = useRef<'left' | 'right' | null>(null);

  const rightActionsWidth = rightActions.length * actionWidth;
  const leftActionsWidth = leftActions.length * actionWidth;
  const fullSwipeThreshold = SCREEN_WIDTH * SWIPEABLE_ROW_CONSTANTS.fullSwipeRatio;

  const close = useCallback(() => {
    if (animationsEnabled) {
      translateX.value = withSpring(0, SWIPEABLE_ROW_CONSTANTS.spring);
    } else {
      translateX.value = 0;
    }
    if (isOpen.current) {
      isOpen.current = null;
      onSwipeClose?.();
    }
  }, [onSwipeClose, animationsEnabled]);

  const openRight = useCallback(() => {
    if (animationsEnabled) {
      translateX.value = withSpring(-rightActionsWidth, SWIPEABLE_ROW_CONSTANTS.spring);
    } else {
      translateX.value = -rightActionsWidth;
    }
    if (isOpen.current !== 'right') {
      isOpen.current = 'right';
      onSwipeOpen?.('right');
    }
  }, [rightActionsWidth, onSwipeOpen, animationsEnabled]);

  const openLeft = useCallback(() => {
    if (animationsEnabled) {
      translateX.value = withSpring(leftActionsWidth, SWIPEABLE_ROW_CONSTANTS.spring);
    } else {
      translateX.value = leftActionsWidth;
    }
    if (isOpen.current !== 'left') {
      isOpen.current = 'left';
      onSwipeOpen?.('left');
    }
  }, [leftActionsWidth, onSwipeOpen, animationsEnabled]);

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

      // Determine max swipe distances
      const maxSwipeLeft = fullSwipeEnabled ? SCREEN_WIDTH * 0.75 : rightActionsWidth;
      const maxSwipeRight = fullSwipeEnabled ? SCREEN_WIDTH * 0.75 : leftActionsWidth;

      // Clamp the swipe to prevent seeing both sides at once
      // Add rubber band resistance when going past the action buttons
      if (newX < 0) {
        // Swiping left (revealing right actions)
        if (newX < -rightActionsWidth) {
          // Add resistance past the buttons
          const overshoot = -newX - rightActionsWidth;
          const resistance = Math.min(overshoot * SWIPEABLE_ROW_CONSTANTS.resistanceFactor, maxSwipeLeft - rightActionsWidth);
          newX = -rightActionsWidth - resistance;
        }
      } else if (newX > 0) {
        // Swiping right (revealing left actions)
        if (newX > leftActionsWidth) {
          // Add resistance past the buttons
          const overshoot = newX - leftActionsWidth;
          const resistance = Math.min(overshoot * SWIPEABLE_ROW_CONSTANTS.resistanceFactor, maxSwipeRight - leftActionsWidth);
          newX = leftActionsWidth + resistance;
        }
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
      if (x < -rightActionsWidth / 2 || velocity < -SWIPEABLE_ROW_CONSTANTS.velocityThreshold) {
        if (rightActions.length > 0) {
          runOnJS(openRight)();
          runOnJS(haptic)('selection');
        } else {
          runOnJS(close)();
        }
      } else if (x > leftActionsWidth / 2 || velocity > SWIPEABLE_ROW_CONSTANTS.velocityThreshold) {
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

  const rightActionsStyle = useAnimatedStyle(() => {
    // Only show when swiping left (negative translateX)
    const isSwipingLeft = translateX.value < 0;
    return {
      width: isSwipingLeft
        ? Math.min(-translateX.value, rightActionsWidth + 50) // Allow slight overshoot for full swipe
        : 0,
      opacity: isSwipingLeft ? 1 : 0,
    };
  });

  const leftActionsStyle = useAnimatedStyle(() => {
    // Only show when swiping right (positive translateX)
    const isSwipingRight = translateX.value > 0;
    return {
      width: isSwipingRight
        ? Math.min(translateX.value, leftActionsWidth + 50) // Allow slight overshoot for full swipe
        : 0,
      opacity: isSwipingRight ? 1 : 0,
    };
  });

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
  const { colors } = useTheme();
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
          { color: action.textColor ?? colors.primaryForeground },
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
    paddingHorizontal: swipeableRowTokens.action.paddingHorizontal,
  },
  actionIcon: {
    marginBottom: swipeableRowTokens.action.iconMargin,
  },
  actionLabel: {
    fontSize: swipeableRowTokens.action.labelFontSize,
    fontWeight: swipeableRowTokens.action.labelFontWeight,
  },
});
