/**
 * OnboardingScreen
 *
 * Multi-slide onboarding flow with swipeable pages, pagination dots,
 * and skip/next/get started buttons. Uses the Carousel primitive for
 * smooth animations and parallax effects.
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

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { useTheme } from '@metacells/mcellui-core';

// Import UI primitives
import { Button } from '../ui/button';
import { Carousel, CarouselRenderItemInfo, CarouselRef } from '../ui/carousel';

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
// Slide Component with Parallax Animation
// ============================================================================

interface OnboardingSlideComponentProps {
  item: OnboardingSlide;
  index: number;
  scrollX: SharedValue<number>;
  width: number;
}

function OnboardingSlideComponent({
  item,
  index,
  scrollX,
  width,
}: OnboardingSlideComponentProps) {
  const { colors, spacing, radius, fontSize, fontWeight, lineHeight } = useTheme();

  // Parallax effect for illustration - moves slower than content
  const illustrationStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    // Parallax: image moves at 0.3x speed of scroll
    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [width * 0.3, 0, -width * 0.3],
      Extrapolation.CLAMP
    );

    // Scale: slightly smaller when not centered
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );

    // Fade: less visible when not centered
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }, { scale }],
      opacity,
    };
  });

  return (
    <View style={styles.slide}>
      {/* Illustration with parallax + scale animation */}
      <View style={styles.illustrationContainer}>
        <Animated.View style={illustrationStyle}>
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
        </Animated.View>
      </View>

      {/* Content */}
      <View style={[styles.content, { paddingHorizontal: spacing[6] }]}>
        <Text style={[styles.title, { color: colors.foreground, fontSize: fontSize['2xl'], fontWeight: fontWeight.bold }]}>{item.title}</Text>
        <Text style={[styles.description, { color: colors.foregroundMuted, marginTop: spacing[3], fontSize: fontSize.base, lineHeight: lineHeight.relaxed }]}>
          {item.description}
        </Text>
      </View>
    </View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function OnboardingScreen({
  slides,
  onComplete,
  onSkip,
  completeText = 'Get Started',
  skipText = 'Skip',
  hideSkip = false,
}: OnboardingScreenProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<CarouselRef>(null);

  const isLastSlide = currentIndex === slides.length - 1;

  const handleSlideChange = (index: number) => {
    setCurrentIndex(index);
  };

  const goToNext = () => {
    if (isLastSlide) {
      onComplete?.();
    } else {
      carouselRef.current?.scrollToIndex(currentIndex + 1);
    }
  };

  const renderSlide = (info: CarouselRenderItemInfo<OnboardingSlide>) => (
    <OnboardingSlideComponent
      item={info.item}
      index={info.index}
      scrollX={info.scrollX}
      width={info.width}
    />
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

      {/* Carousel with slides and indicators */}
      <View style={styles.carouselContainer}>
        <Carousel
          ref={carouselRef}
          data={slides}
          renderItem={renderSlide}
          onSlideChange={handleSlideChange}
          showIndicators
          indicatorStyle="line"
          indicatorPosition="bottom"
          style={styles.carousel}
        />
      </View>

      {/* Bottom Section with Button */}
      <View
        style={[
          styles.bottomSection,
          {
            paddingHorizontal: spacing[6],
            paddingBottom: insets.bottom + spacing[4],
          },
        ]}
      >
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
  carouselContainer: {
    flex: 1,
  },
  carousel: {
    flex: 1,
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
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  bottomSection: {},
  nextButton: {
    width: '100%',
  },
});
