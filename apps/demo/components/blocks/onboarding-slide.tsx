/**
 * OnboardingSlide
 *
 * Full-screen onboarding slide with illustration, title, and description.
 * Perfect for app onboarding flows and feature tours.
 *
 * @example
 * ```tsx
 * <OnboardingSlide
 *   image={require('./assets/onboarding-1.png')}
 *   title="Welcome to MyApp"
 *   description="Discover amazing features that will change how you work"
 *   currentStep={0}
 *   totalSteps={3}
 *   onNext={() => setStep(1)}
 *   onSkip={() => navigation.navigate('Home')}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@metacells/mcellui-core';

// Import UI primitives
import { Button } from '@/components/ui/button';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================================================
// Types
// ============================================================================

export interface OnboardingSlideProps {
  /** Image source (require or uri) */
  image?: ImageSourcePropType;
  /** Custom illustration component (alternative to image) */
  illustration?: React.ReactNode;
  /** Slide title */
  title: string;
  /** Slide description */
  description: string;
  /** Current step index (0-based) */
  currentStep?: number;
  /** Total number of steps */
  totalSteps?: number;
  /** Primary button text (default: "Next" or "Get Started" on last slide) */
  primaryText?: string;
  /** Called when primary button is pressed */
  onPrimary?: () => void;
  /** Secondary/skip button text (default: "Skip") */
  secondaryText?: string;
  /** Called when skip button is pressed */
  onSecondary?: () => void;
  /** Hide pagination dots */
  hidePagination?: boolean;
  /** Hide secondary button */
  hideSecondary?: boolean;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function OnboardingSlide({
  image,
  illustration,
  title,
  description,
  currentStep = 0,
  totalSteps = 1,
  primaryText,
  onPrimary,
  secondaryText = 'Skip',
  onSecondary,
  hidePagination = false,
  hideSecondary = false,
  style,
}: OnboardingSlideProps) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();

  const isLastStep = currentStep === totalSteps - 1;
  const buttonText = primaryText || (isLastStep ? 'Get Started' : 'Next');

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + spacing[4],
        },
        style,
      ]}
    >
      {/* Illustration Area */}
      <View style={styles.illustrationContainer}>
        {illustration ? (
          illustration
        ) : image ? (
          <Image source={image} style={styles.image} resizeMode="contain" />
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
        <Text
          style={[
            styles.title,
            { color: colors.foreground, marginBottom: spacing[3] },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.description,
            { color: colors.foregroundMuted },
          ]}
        >
          {description}
        </Text>
      </View>

      {/* Pagination Dots */}
      {!hidePagination && totalSteps > 1 && (
        <View style={[styles.pagination, { marginBottom: spacing[6] }]}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentStep ? colors.primary : colors.border,
                  width: index === currentStep ? 24 : 8,
                  borderRadius: radius.full,
                  marginHorizontal: spacing[1],
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* Buttons */}
      <View style={[styles.buttons, { paddingHorizontal: spacing[6], gap: spacing[3] }]}>
        {onPrimary && (
          <Button onPress={onPrimary} style={styles.primaryButton}>
            {buttonText}
          </Button>
        )}
        {!hideSecondary && onSecondary && !isLastStep && (
          <Button variant="ghost" onPress={onSecondary}>
            {secondaryText}
          </Button>
        )}
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
    width: SCREEN_WIDTH,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  dot: {
    height: 8,
  },
  buttons: {
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
  },
});
