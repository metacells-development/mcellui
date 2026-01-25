/**
 * OTPVerificationScreen
 *
 * Code verification screen with auto-focusing OTP input,
 * resend timer, and haptic feedback.
 *
 * @example
 * ```tsx
 * <OTPVerificationScreen
 *   phoneOrEmail="+1 (555) 123-4567"
 *   onVerify={(code) => verifyOTP(code)}
 *   onResend={() => sendNewCode()}
 *   onBack={() => navigation.goBack()}
 * />
 * ```
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useTheme, haptic } from '@metacells/mcellui-core';

// Import UI primitives
import { Button } from '../ui/button';

// ============================================================================
// Types
// ============================================================================

export interface OTPVerificationScreenProps {
  /** Phone number or email being verified */
  phoneOrEmail: string;
  /** Number of OTP digits (default: 6) */
  codeLength?: number;
  /** Called when code is complete and submitted */
  onVerify?: (code: string) => void | Promise<void>;
  /** Called when resend is pressed */
  onResend?: () => void | Promise<void>;
  /** Called when back/close is pressed */
  onBack?: () => void;
  /** Resend cooldown in seconds (default: 60) */
  resendCooldown?: number;
  /** Title text (default: "Verification Code") */
  title?: string;
  /** Description text (default: auto-generated) */
  description?: string;
  /** Loading state */
  loading?: boolean;
  /** Error message to display */
  error?: string;
}

// ============================================================================
// Icons
// ============================================================================

function ArrowLeftIcon({ color = '#000', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M12 19l-7-7 7-7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ============================================================================
// OTP Input Component
// ============================================================================

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length: number;
  error?: boolean;
  disabled?: boolean;
}

function OTPInput({ value, onChange, length, error, disabled }: OTPInputProps) {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const shakeX = useSharedValue(0);

  // Shake animation for errors
  useEffect(() => {
    if (error) {
      haptic('error');
      shakeX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [error]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const handleChange = (text: string) => {
    // Only allow digits
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, length);
    onChange(cleaned);

    if (cleaned.length === 1 || cleaned.length === length) {
      haptic('light');
    }
  };

  const digits = value.split('');

  return (
    <Pressable onPress={handlePress} disabled={disabled}>
      <Animated.View style={[styles.otpContainer, animatedStyle]}>
        {Array.from({ length }).map((_, index) => {
          const isActive = index === value.length;
          const isFilled = index < value.length;

          return (
            <View
              key={index}
              style={[
                styles.otpBox,
                {
                  width: spacing[12],  // 48px
                  height: spacing[14],  // 56px
                  borderRadius: radius.lg,
                  borderColor: error
                    ? colors.destructive
                    : isActive
                    ? colors.primary
                    : isFilled
                    ? colors.border
                    : colors.border,
                  borderWidth: isActive ? 2 : 1,
                  backgroundColor: isFilled ? colors.secondary : colors.background,
                  marginHorizontal: spacing[1],
                },
              ]}
            >
              <Text
                style={[
                  styles.otpDigit,
                  {
                    color: colors.foreground,
                    fontSize: fontSize['2xl'],
                    fontWeight: fontWeight.semibold,
                  },
                ]}
              >
                {digits[index] || ''}
              </Text>
              {isActive && (
                <Animated.View
                  style={[
                    styles.cursor,
                    { backgroundColor: colors.primary },
                  ]}
                />
              )}
            </View>
          );
        })}
      </Animated.View>

      {/* Hidden input for keyboard */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        style={styles.hiddenInput}
        autoFocus
        editable={!disabled}
      />
    </Pressable>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function OTPVerificationScreen({
  phoneOrEmail,
  codeLength = 6,
  onVerify,
  onResend,
  onBack,
  resendCooldown = 60,
  title = 'Verification Code',
  description,
  loading = false,
  error,
}: OTPVerificationScreenProps) {
  const { colors, spacing, fontSize, fontWeight } = useTheme();
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(resendCooldown);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const defaultDescription = `We sent a ${codeLength}-digit code to ${phoneOrEmail}`;

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Auto-submit when code is complete
  useEffect(() => {
    if (code.length === codeLength && onVerify && !isVerifying) {
      handleVerify();
    }
  }, [code]);

  const handleVerify = async () => {
    if (code.length !== codeLength || isVerifying) return;

    setIsVerifying(true);
    haptic('medium');
    Keyboard.dismiss();

    try {
      await onVerify?.(code);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    haptic('light');
    setCanResend(false);
    setCountdown(resendCooldown);
    setCode('');

    await onResend?.();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Header */}
      {onBack && (
        <View style={[styles.header, { paddingHorizontal: spacing[4] }]}>
          <Pressable
            onPress={onBack}
            style={[styles.backButton, { padding: spacing[2] }]}
            hitSlop={8}
          >
            <ArrowLeftIcon color={colors.foreground} />
          </Pressable>
        </View>
      )}

      {/* Content */}
      <View style={[styles.content, { paddingHorizontal: spacing[6], paddingTop: spacing[6] }]}>
        <Text
          style={[
            styles.title,
            {
              color: colors.foreground,
              fontSize: fontSize['2xl'],
              fontWeight: fontWeight.bold,
              marginBottom: spacing[2],
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: colors.foregroundMuted,
              fontSize: fontSize.base,
              marginBottom: spacing[8],
            },
          ]}
        >
          {description || defaultDescription}
        </Text>

        {/* OTP Input */}
        <OTPInput
          value={code}
          onChange={setCode}
          length={codeLength}
          error={!!error}
          disabled={loading || isVerifying}
        />

        {/* Error Message */}
        {error && (
          <Text
            style={[
              styles.errorText,
              {
                color: colors.destructive,
                fontSize: fontSize.sm,
                marginTop: spacing[3],
              },
            ]}
          >
            {error}
          </Text>
        )}

        {/* Resend Section */}
        <View style={[styles.resendSection, { marginTop: spacing[6] }]}>
          <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.sm }}>
            Didn't receive the code?{' '}
          </Text>
          {canResend ? (
            <Pressable onPress={handleResend}>
              <Text
                style={{
                  color: colors.primary,
                  fontSize: fontSize.sm,
                  fontWeight: fontWeight.medium,
                }}
              >
                Resend
              </Text>
            </Pressable>
          ) : (
            <Text
              style={{
                color: colors.foregroundMuted,
                fontSize: fontSize.sm,
              }}
            >
              Resend in {formatTime(countdown)}
            </Text>
          )}
        </View>
      </View>

      {/* Bottom Button */}
      <View style={[styles.bottomSection, { paddingHorizontal: spacing[6], paddingBottom: spacing[4] }]}>
        <Button
          onPress={handleVerify}
          disabled={code.length !== codeLength}
          loading={loading || isVerifying}
          style={styles.verifyButton}
        >
          Verify
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
  backButton: {
    marginLeft: -8,
  },
  content: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  otpBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpDigit: {
    textAlign: 'center',
  },
  cursor: {
    position: 'absolute',
    width: 2,
    height: 24,
    borderRadius: 1,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  errorText: {
    textAlign: 'center',
  },
  resendSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {},
  verifyButton: {
    width: '100%',
  },
});
