/**
 * OnboardingScreen
 *
 * Multi-slide onboarding flow with swipeable pages, pagination dots,
 * and skip/next/get started buttons.
 *
 * @example
 * ```tsx
 * <OnboardingScreen
 *   slides={[
 *     { title: 'Welcome', description: 'Get started...', image: require('./1.png') },
 *     { title: 'Discover', description: 'Find amazing...', image: require('./2.png') },
 *     { title: 'Connect', description: 'Share with...', image: require('./3.png') },
 *   ]}
 *   onComplete={() => navigation.navigate('Home')}
 *   onSkip={() => navigation.navigate('Home')}
 * />
 * ```
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  ImageSourcePropType,
  ViewToken,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useTheme } from '@nativeui/core';

// Import UI primitives
import { Button } from '../ui/button';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================================================
// Types
// ============================================================================

export interface OnboardingSlide {
  /** Unique key for the slide */
  key?: string;
  /** Slide title */
  title: string;
  /** Slide description */
  description: string;
  /** Image source */
  image?: ImageSourcePropType;
  /** Custom illustration component */
  illustration?: React.ReactNode;
}

export interface OnboardingScreenProps {
  /** Array of slides to display */
  slides: OnboardingSlide[];
  /** Called when onboarding is completed */
  onComplete?: () => void;
  /** Called when skip button is pressed */
  onSkip?: () => void;
  /** Text for the final button (default: "Get Started") */
  completeText?: string;
  /** Text for skip button (default: "Skip") */
  skipText?: string;
  /** Hide skip button */
  hideSkip?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function OnboardingScreen({
  slides,
  onComplete,
  onSkip,
  completeText = 'Get Started',
  skipText = 'Skip',
  hideSkip = false,
}: OnboardingScreenProps) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const isLastSlide = currentIndex === slides.length - 1;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstItem = viewableItems[0];
      if (firstItem && firstItem.index !== null && firstItem.index !== undefined) {
        setCurrentIndex(firstItem.index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
  };

  const goToNext = () => {
    if (isLastSlide) {
      onComplete?.();
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => (
    <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        {item.illustration ? (
          item.illustration
        ) : item.image ? (
          <Image source={item.image} style={styles.image} resizeMode="contain" />
        ) : (
          <View
            style={[
              styles.placeholderImage,
              { backgroundColor: colors.secondary, borderRadius: radius.xl },
            ]}
          />
        )}
      </View>

      {/* Content */}
      <View style={[styles.content, { paddingHorizontal: spacing[6] }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>{item.title}</Text>
        <Text style={[styles.description, { color: colors.foregroundMuted, marginTop: spacing[3] }]}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Skip Button */}
      {!hideSkip && !isLastSlide && onSkip && (
        <View style={[styles.skipContainer, { top: insets.top + spacing[2], right: spacing[4] }]}>
          <Button variant="ghost" size="sm" onPress={onSkip}>
            {skipText}
          </Button>
        </View>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item, index) => item.key || `slide-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {/* Bottom Section */}
      <View
        style={[
          styles.bottomSection,
          {
            paddingHorizontal: spacing[6],
            paddingBottom: insets.bottom + spacing[4],
          },
        ]}
      >
        {/* Pagination Dots */}
        <View style={[styles.pagination, { marginBottom: spacing[6] }]}>
          {slides.map((_, index) => {
            const dotStyle = useAnimatedStyle(() => {
              const inputRange = [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
              ];
              const width = interpolate(
                scrollX.value,
                inputRange,
                [8, 24, 8],
                Extrapolation.CLAMP
              );
              const opacity = interpolate(
                scrollX.value,
                inputRange,
                [0.4, 1, 0.4],
                Extrapolation.CLAMP
              );
              return {
                width,
                opacity,
              };
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: radius.full,
                    marginHorizontal: spacing[1],
                  },
                  dotStyle,
                ]}
              />
            );
          })}
        </View>

        {/* Next/Complete Button */}
        <Button onPress={goToNext} style={styles.nextButton}>
          {isLastSlide ? completeText : 'Next'}
        </Button>
      </View>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  image: {
    width: SCREEN_WIDTH - 80,
    height: SCREEN_HEIGHT * 0.4,
  },
  placeholderImage: {
    width: SCREEN_WIDTH - 120,
    height: SCREEN_HEIGHT * 0.35,
  },
  content: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  bottomSection: {},
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
  },
  nextButton: {
    width: '100%',
  },
});
