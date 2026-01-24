/**
 * LoginScreen
 *
 * Complete login screen with email/password form, social login options,
 * and forgot password link. Ready to connect to your auth provider.
 *
 * @example
 * ```tsx
 * <LoginScreen
 *   onLogin={(email, password) => signIn(email, password)}
 *   onSocialLogin={(provider) => socialSignIn(provider)}
 *   onForgotPassword={() => navigation.navigate('ForgotPassword')}
 *   onSignUp={() => navigation.navigate('SignUp')}
 * />
 * ```
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';

// Import UI primitives
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';

// ============================================================================
// Types
// ============================================================================

export type SocialProvider = 'google' | 'apple' | 'facebook';

export interface LoginScreenProps {
  /** Called when login form is submitted */
  onLogin?: (email: string, password: string) => void | Promise<void>;
  /** Called when social login button is pressed */
  onSocialLogin?: (provider: SocialProvider) => void | Promise<void>;
  /** Called when forgot password is pressed */
  onForgotPassword?: () => void;
  /** Called when sign up link is pressed */
  onSignUp?: () => void;
  /** Show loading state on login button */
  loading?: boolean;
  /** Error message to display */
  error?: string;
  /** App logo component */
  logo?: React.ReactNode;
  /** App name for header */
  appName?: string;
}

// ============================================================================
// Icons
// ============================================================================

function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </Svg>
  );
}

function AppleIcon({ size = 20, color = '#000000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </Svg>
  );
}

// ============================================================================
// Component
// ============================================================================

export function LoginScreen({
  onLogin,
  onSocialLogin,
  onForgotPassword,
  onSignUp,
  loading = false,
  error,
  logo,
  appName = 'Welcome back',
}: LoginScreenProps) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLogin?.(email, password);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + spacing[8],
            paddingBottom: insets.bottom + spacing[6],
            paddingHorizontal: spacing[6],
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { marginBottom: spacing[8] }]}>
          {logo ? (
            logo
          ) : (
            <View
              style={[
                styles.logoPlaceholder,
                { backgroundColor: colors.primary, borderRadius: radius.xl },
              ]}
            >
              <Text style={styles.logoText}>Logo</Text>
            </View>
          )}
          <Text style={[styles.title, { color: colors.foreground, marginTop: spacing[6] }]}>
            {appName}
          </Text>
          <Text style={[styles.subtitle, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
            Sign in to continue
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View
            style={[
              styles.errorContainer,
              {
                backgroundColor: colors.destructive + '15',
                borderRadius: radius.md,
                padding: spacing[3],
                marginBottom: spacing[4],
              },
            ]}
          >
            <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
          </View>
        )}

        {/* Form */}
        <View style={[styles.form, { gap: spacing[4] }]}>
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />

          {/* Forgot Password */}
          {onForgotPassword && (
            <Pressable onPress={onForgotPassword} style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                Forgot password?
              </Text>
            </Pressable>
          )}

          {/* Login Button */}
          <Button
            onPress={handleLogin}
            disabled={loading || !email || !password}
            style={{ marginTop: spacing[2] }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </View>

        {/* Divider */}
        {onSocialLogin && (
          <View style={[styles.dividerContainer, { marginVertical: spacing[6] }]}>
            <Separator style={{ flex: 1 }} />
            <Text style={[styles.dividerText, { color: colors.foregroundMuted, marginHorizontal: spacing[4] }]}>
              or continue with
            </Text>
            <Separator style={{ flex: 1 }} />
          </View>
        )}

        {/* Social Login */}
        {onSocialLogin && (
          <View style={[styles.socialButtons, { gap: spacing[3] }]}>
            <Button
              variant="outline"
              onPress={() => onSocialLogin('google')}
              style={{ flex: 1 }}
            >
              <View style={styles.socialButtonContent}>
                <GoogleIcon />
                <Text style={[styles.socialButtonText, { color: colors.foreground, marginLeft: spacing[2] }]}>
                  Google
                </Text>
              </View>
            </Button>
            <Button
              variant="outline"
              onPress={() => onSocialLogin('apple')}
              style={{ flex: 1 }}
            >
              <View style={styles.socialButtonContent}>
                <AppleIcon color={colors.foreground} />
                <Text style={[styles.socialButtonText, { color: colors.foreground, marginLeft: spacing[2] }]}>
                  Apple
                </Text>
              </View>
            </Button>
          </View>
        )}

        {/* Sign Up Link */}
        {onSignUp && (
          <View style={[styles.signUpContainer, { marginTop: spacing[8] }]}>
            <Text style={[styles.signUpText, { color: colors.foregroundMuted }]}>
              Don't have an account?{' '}
            </Text>
            <Pressable onPress={onSignUp}>
              <Text style={[styles.signUpLink, { color: colors.primary }]}>Sign up</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
  },
  errorContainer: {},
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  form: {},
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerText: {
    fontSize: 13,
  },
  socialButtons: {
    flexDirection: 'row',
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    fontSize: 15,
  },
  signUpLink: {
    fontSize: 15,
    fontWeight: '600',
  },
});
