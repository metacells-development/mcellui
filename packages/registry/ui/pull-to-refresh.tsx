/**
 * Pull to Refresh
 *
 * A pull-to-refresh wrapper component with custom animated indicator.
 * Works with ScrollView and FlatList.
 *
 * @example
 * ```tsx
 * const [refreshing, setRefreshing] = useState(false);
 *
 * const onRefresh = async () => {
 *   setRefreshing(true);
 *   await fetchData();
 *   setRefreshing(false);
 * };
 *
 * <PullToRefresh refreshing={refreshing} onRefresh={onRefresh}>
 *   <ScrollView>
 *     {content}
 *   </ScrollView>
 * </PullToRefresh>
 * ```
 */

import React, { useCallback } from 'react';
import {
  View,
  RefreshControl,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useTheme } from '@nativeui/core';

export interface PullToRefreshProps {
  /** Whether currently refreshing */
  refreshing: boolean;
  /** Callback when refresh is triggered */
  onRefresh: () => void;
  /** Children (ScrollView, FlatList, etc.) */
  children: React.ReactElement;
  /** Custom refresh indicator color */
  indicatorColor?: string;
  /** Custom background color for iOS */
  backgroundColor?: string;
  /** Progress view offset for Android */
  progressViewOffset?: number;
  /** Container style */
  style?: ViewStyle;
}

export function PullToRefresh({
  refreshing,
  onRefresh,
  children,
  indicatorColor,
  backgroundColor,
  progressViewOffset = 0,
  style,
}: PullToRefreshProps) {
  const { colors } = useTheme();

  const tintColor = indicatorColor ?? colors.primary;
  const bgColor = backgroundColor ?? colors.backgroundSubtle;

  // Clone child with RefreshControl
  const childWithRefreshControl = React.cloneElement(
    children as React.ReactElement<{ refreshControl?: React.ReactElement }>,
    {
      refreshControl: (
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={tintColor}
          colors={[tintColor]} // Android
          progressBackgroundColor={bgColor} // Android
          progressViewOffset={progressViewOffset}
          style={Platform.OS === 'ios' ? { backgroundColor: bgColor } : undefined}
        />
      ),
    }
  );

  return (
    <View style={[styles.container, style]}>
      {childWithRefreshControl}
    </View>
  );
}

/**
 * Custom Refresh Indicator
 *
 * A custom animated spinner for use with pull-to-refresh.
 * Can be used standalone or with custom refresh implementations.
 */
export interface RefreshIndicatorProps {
  /** Whether animating */
  animating?: boolean;
  /** Size of the indicator */
  size?: number;
  /** Color of the indicator */
  color?: string;
  /** Container style */
  style?: ViewStyle;
}

export function RefreshIndicator({
  animating = true,
  size = 24,
  color,
  style,
}: RefreshIndicatorProps) {
  const { colors } = useTheme();
  const rotation = useSharedValue(0);

  const indicatorColor = color ?? colors.primary;

  React.useEffect(() => {
    if (animating) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
    }
  }, [animating]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.indicatorContainer, { width: size, height: size }, style]}>
      <Animated.View style={[styles.indicator, animatedStyle]}>
        <View
          style={[
            styles.indicatorArc,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: size / 8,
              borderColor: indicatorColor,
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

/**
 * RefreshContainer
 *
 * A container component that shows a custom refresh indicator
 * at the top when pulling down. For more control than PullToRefresh.
 */
export interface RefreshContainerProps {
  /** Whether currently refreshing */
  refreshing: boolean;
  /** Callback when refresh is triggered */
  onRefresh: () => void;
  /** Pull threshold to trigger refresh */
  threshold?: number;
  /** Children */
  children: React.ReactNode;
  /** Container style */
  style?: ViewStyle;
}

export function RefreshContainer({
  refreshing,
  onRefresh,
  threshold = 80,
  children,
  style,
}: RefreshContainerProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.refreshContainer, style]}>
      {refreshing && (
        <View
          style={[
            styles.refreshHeader,
            {
              backgroundColor: colors.backgroundSubtle,
              paddingVertical: spacing[4],
            },
          ]}
        >
          <RefreshIndicator animating={refreshing} />
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  indicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {},
  indicatorArc: {},
  refreshContainer: {
    flex: 1,
  },
  refreshHeader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
