/**
 * LoginBlock
 *
 * Complete login screen with email/password form and social login options.
 * Uses react-hook-form with Zod validation.
 *
 * @example
 * ```tsx
 * <LoginBlock
 *   onSubmit={(data) => handleLogin(data)}
 *   onForgotPassword={() => navigation.navigate('ForgotPassword')}
 *   onSignUp={() => navigation.navigate('SignUp')}
 *   onSocialLogin={(provider) => handleSocialLogin(provider)}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '@metacells/mcellui-core';

// Import your components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// ============================================================================
// Schema
// ============================================================================

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================================
// Types
// ============================================================================

export type SocialProvider = 'google' | 'apple' | 'facebook';

export interface LoginBlockProps {
  /** Called when form is submitted with valid data */
  onSubmit: (data: LoginFormData) => void | Promise<void>;
  /** Called when "Forgot Password" is pressed */
  onForgotPassword?: () => void;
  /** Called when "Sign Up" is pressed */
  onSignUp?: () => void;
  /** Called when a social login button is pressed */
  onSocialLogin?: (provider: SocialProvider) => void;
  /** Show loading state on submit button */
  loading?: boolean;
  /** Custom title */
  title?: string;
  /** Custom subtitle */
  subtitle?: string;
  /** Show social login buttons */
  showSocialLogin?: boolean;
  /** Social providers to show */
  socialProviders?: SocialProvider[];
}

// ============================================================================
// Component
// ============================================================================

export function LoginBlock({
  onSubmit,
  onForgotPassword,
  onSignUp,
  onSocialLogin,
  loading = false,
  title = 'Welcome back',
  subtitle = 'Sign in to your account',
  showSocialLogin = true,
  socialProviders = ['google', 'apple'],
}: LoginBlockProps) {
  const { colors, spacing, radius } = useTheme();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { padding: spacing[6] },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { marginBottom: spacing[8] }]}>
          <Text
            style={[
              styles.title,
              { color: colors.foreground, marginBottom: spacing[2] },
            ]}
          >
            {title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.foregroundMuted }]}>
            {subtitle}
          </Text>
        </View>

        {/* Form */}
        <Form form={form}>
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input
                  placeholder="email@example.com"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <View style={styles.labelRow}>
                  <FormLabel>Password</FormLabel>
                  {onForgotPassword && (
                    <Pressable onPress={onForgotPassword}>
                      <Text
                        style={[styles.forgotLink, { color: colors.primary }]}
                      >
                        Forgot password?
                      </Text>
                    </Pressable>
                  )}
                </View>
                <Input
                  placeholder="Enter your password"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  secureTextEntry
                  autoComplete="password"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            style={{ marginTop: spacing[2] }}
          >
            Sign in
          </Button>
        </Form>

        {/* Social Login */}
        {showSocialLogin && socialProviders.length > 0 && (
          <>
            <View style={[styles.divider, { marginVertical: spacing[6] }]}>
              <View
                style={[styles.dividerLine, { backgroundColor: colors.border }]}
              />
              <Text
                style={[
                  styles.dividerText,
                  {
                    color: colors.foregroundMuted,
                    paddingHorizontal: spacing[4],
                    backgroundColor: colors.background,
                  },
                ]}
              >
                or continue with
              </Text>
              <View
                style={[styles.dividerLine, { backgroundColor: colors.border }]}
              />
            </View>

            <View style={[styles.socialButtons, { gap: spacing[3] }]}>
              {socialProviders.map((provider) => (
                <Button
                  key={provider}
                  variant="outline"
                  onPress={() => onSocialLogin?.(provider)}
                  style={{ flex: 1 }}
                >
                  {getSocialProviderLabel(provider)}
                </Button>
              ))}
            </View>
          </>
        )}

        {/* Sign Up Link */}
        {onSignUp && (
          <View style={[styles.footer, { marginTop: spacing[8] }]}>
            <Text style={[styles.footerText, { color: colors.foregroundMuted }]}>
              Don't have an account?{' '}
            </Text>
            <Pressable onPress={onSignUp}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Sign up
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ============================================================================
// Helpers
// ============================================================================

function getSocialProviderLabel(provider: SocialProvider): string {
  switch (provider) {
    case 'google':
      return 'Google';
    case 'apple':
      return 'Apple';
    case 'facebook':
      return 'Facebook';
    default:
      return provider;
  }
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotLink: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
