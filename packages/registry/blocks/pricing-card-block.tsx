/**
 * PricingCard
 *
 * Subscription plan display with features, price, and CTA.
 * Perfect for pricing pages, subscription selection, and plan comparisons.
 *
 * @example
 * ```tsx
 * <PricingCard
 *   plan={{
 *     id: 'pro',
 *     name: 'Pro',
 *     price: 29,
 *     interval: 'month',
 *     features: [
 *       { text: 'Unlimited projects', included: true },
 *       { text: 'Priority support', included: true },
 *       { text: 'Custom domain', included: false }
 *     ]
 *   }}
 *   popular
 *   onSelect={() => selectPlan('pro')}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, ecommerceBlockTokens } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// Import UI primitives
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

// ============================================================================
// Icons
// ============================================================================

function CheckIcon({ size = 16, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={3}>
      <Path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function XIcon({ size = 16, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={2}>
      <Path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export type PricingInterval = 'month' | 'year' | 'once';

export interface PlanFeature {
  text: string;
  included: boolean;
  tooltip?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  interval?: PricingInterval;
  features: PlanFeature[];
  ctaLabel?: string;
  highlighted?: boolean;
}

export interface PricingCardProps {
  /** Plan data */
  plan: PricingPlan;
  /** Whether this is the popular/recommended plan */
  popular?: boolean;
  /** Custom badge text (overrides "Popular") */
  badgeText?: string;
  /** Whether plan is currently selected/active */
  selected?: boolean;
  /** Whether selection is disabled */
  disabled?: boolean;
  /** Called when plan is selected */
  onSelect?: () => void;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PricingCard({
  plan,
  popular = false,
  badgeText,
  selected = false,
  disabled = false,
  onSelect,
  style,
}: PricingCardProps) {
  const { colors, spacing, radius } = useTheme();
  const pricingTokens = ecommerceBlockTokens.pricing;

  const scale = useSharedValue(1);

  const handlePress = () => {
    haptic('medium');
    onSelect?.();
  };

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const formatPrice = (value: number) => {
    const currency = plan.currency ?? '$';
    if (value === 0) return 'Free';
    return `${currency}${value}`;
  };

  const formatInterval = (interval?: PricingInterval) => {
    switch (interval) {
      case 'month':
        return '/mo';
      case 'year':
        return '/yr';
      case 'once':
        return '';
      default:
        return '/mo';
    }
  };

  const isHighlighted = popular || plan.highlighted;

  return (
    <AnimatedPressable
      onPress={onSelect ? handlePress : undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || !onSelect}
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderWidth: isHighlighted ? 2 : 1,
          borderColor: isHighlighted ? colors.primary : colors.border,
          borderRadius: radius.xl,
          padding: spacing[5],
          opacity: disabled ? 0.6 : 1,
        },
        animatedStyle,
        style,
      ]}
    >
      {/* Popular badge */}
      {(popular || badgeText) && (
        <View style={[styles.badgeContainer, { top: pricingTokens.badgeTopOffset }]}>
          <Badge variant="default">
            {badgeText ?? 'Popular'}
          </Badge>
        </View>
      )}

      {/* Plan name */}
      <Text
        style={[
          styles.planName,
          {
            color: colors.foreground,
            fontSize: pricingTokens.planNameFontSize,
            fontWeight: pricingTokens.planNameFontWeight,
          },
        ]}
      >
        {plan.name}
      </Text>

      {/* Description */}
      {plan.description && (
        <Text
          style={[
            styles.description,
            {
              color: colors.foregroundMuted,
              marginTop: spacing[1],
              fontSize: pricingTokens.descriptionFontSize,
            },
          ]}
        >
          {plan.description}
        </Text>
      )}

      {/* Price */}
      <View style={[styles.priceContainer, { marginTop: spacing[4] }]}>
        {plan.originalPrice && plan.originalPrice > plan.price && (
          <Text
            style={[
              styles.originalPrice,
              {
                color: colors.foregroundMuted,
                fontSize: pricingTokens.originalPriceFontSize,
              },
            ]}
          >
            {formatPrice(plan.originalPrice)}
          </Text>
        )}
        <View style={styles.priceRow}>
          <Text
            style={[
              styles.price,
              {
                color: colors.foreground,
                fontSize: pricingTokens.priceFontSize,
                fontWeight: pricingTokens.priceFontWeight,
              },
            ]}
          >
            {formatPrice(plan.price)}
          </Text>
          {plan.price > 0 && (
            <Text
              style={[
                styles.interval,
                {
                  color: colors.foregroundMuted,
                  fontSize: pricingTokens.intervalFontSize,
                  fontWeight: pricingTokens.intervalFontWeight,
                },
              ]}
            >
              {formatInterval(plan.interval)}
            </Text>
          )}
        </View>
        {plan.originalPrice && plan.originalPrice > plan.price && (
          <Text
            style={[
              styles.savings,
              {
                color: colors.success,
                fontSize: pricingTokens.savingsFontSize,
                fontWeight: pricingTokens.savingsFontWeight,
              },
            ]}
          >
            Save {Math.round((1 - plan.price / plan.originalPrice) * 100)}%
          </Text>
        )}
      </View>

      {/* CTA Button */}
      <Button
        variant={isHighlighted ? 'default' : 'outline'}
        onPress={onSelect}
        disabled={disabled}
        fullWidth
        style={{ marginTop: spacing[4] }}
      >
        {selected ? 'Current Plan' : plan.ctaLabel ?? 'Get Started'}
      </Button>

      {/* Features */}
      <View style={[styles.features, { marginTop: spacing[4], gap: spacing[2.5] }]}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <View
              style={[
                styles.featureIcon,
                {
                  backgroundColor: feature.included
                    ? colors.success + '20'
                    : colors.foregroundMuted + '20',
                  borderRadius: radius.full,
                  width: pricingTokens.featureIconSize,
                  height: pricingTokens.featureIconSize,
                },
              ]}
            >
              {feature.included ? (
                <CheckIcon size={pricingTokens.featureIconInnerSize} color={colors.success} />
              ) : (
                <XIcon size={pricingTokens.featureIconInnerSize} color={colors.foregroundMuted} />
              )}
            </View>
            <Text
              style={[
                styles.featureText,
                {
                  color: feature.included ? colors.foreground : colors.foregroundMuted,
                  textDecorationLine: feature.included ? 'none' : 'line-through',
                  fontSize: pricingTokens.featureTextFontSize,
                },
              ]}
            >
              {feature.text}
            </Text>
          </View>
        ))}
      </View>
    </AnimatedPressable>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    alignSelf: 'center',
  },
  planName: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  priceContainer: {
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  price: {
    lineHeight: 48,
  },
  interval: {
    marginBottom: 6,
    marginLeft: 2,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  savings: {
    marginTop: 4,
  },
  features: {
    width: '100%',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    marginLeft: 10,
    flex: 1,
  },
});
