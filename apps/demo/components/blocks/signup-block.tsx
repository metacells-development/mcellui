/**
 * SignupBlock
 *
 * Complete signup screen with name, email, password form and terms checkbox.
 * Uses react-hook-form with Zod validation.
 *
 * @example
 * ```tsx
 * <SignupBlock
 *   onSubmit={(data) => handleSignup(data)}
 *   onLogin={() => navigation.navigate('Login')}
 *   onTermsPress={() => openTerms()}
 *   onPrivacyPress={() => openPrivacy()}
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
import { Checkbox } from '@/components/ui/checkbox';
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

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
});

type SignupFormData = z.infer<typeof signupSchema>;

// ============================================================================
// Types
// ============================================================================

export interface SignupBlockProps {
  /** Called when form is submitted with valid data */
  onSubmit: (data: SignupFormData) => void | Promise<void>;
  /** Called when "Login" is pressed */
  onLogin?: () => void;
  /** Called when "Terms" link is pressed */
  onTermsPress?: () => void;
  /** Called when "Privacy Policy" link is pressed */
  onPrivacyPress?: () => void;
  /** Show loading state on submit button */
  loading?: boolean;
  /** Custom title */
  title?: string;
  /** Custom subtitle */
  subtitle?: string;
}

// ============================================================================
// Component
// ============================================================================

export function SignupBlock({
  onSubmit,
  onLogin,
  onTermsPress,
  onPrivacyPress,
  loading = false,
  title = 'Create account',
  subtitle = 'Sign up to get started',
}: SignupBlockProps) {
  const { colors, spacing } = useTheme();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      acceptTerms: false as unknown as true,
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
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <Input
                  placeholder="John Doe"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  autoCapitalize="words"
                  autoComplete="name"
                />
                <FormMessage />
              </FormItem>
            )}
          />

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
                <FormLabel>Password</FormLabel>
                <Input
                  placeholder="Create a strong password"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  secureTextEntry
                  autoComplete="password-new"
                />
                <Text
                  style={[
                    styles.passwordHint,
                    { color: colors.foregroundMuted, marginTop: spacing[1] },
                  ]}
                >
                  Min 8 characters, 1 uppercase, 1 number
                </Text>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field, fieldState }) => (
              <FormItem style={{ marginBottom: spacing[6] }}>
                <View style={styles.checkboxRow}>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Text
                    style={[
                      styles.termsText,
                      { color: colors.foregroundMuted, marginLeft: spacing[2] },
                    ]}
                  >
                    I agree to the{' '}
                    <Text
                      style={[styles.termsLink, { color: colors.primary }]}
                      onPress={onTermsPress}
                    >
                      Terms of Service
                    </Text>
                    {' and '}
                    <Text
                      style={[styles.termsLink, { color: colors.primary }]}
                      onPress={onPrivacyPress}
                    >
                      Privacy Policy
                    </Text>
                  </Text>
                </View>
                {fieldState.error && (
                  <Text
                    style={[
                      styles.errorText,
                      { color: colors.destructive, marginTop: spacing[1] },
                    ]}
                  >
                    {fieldState.error.message}
                  </Text>
                )}
              </FormItem>
            )}
          />

          <Button onPress={handleSubmit} loading={loading} fullWidth>
            Create account
          </Button>
        </Form>

        {/* Login Link */}
        {onLogin && (
          <View style={[styles.footer, { marginTop: spacing[8] }]}>
            <Text style={[styles.footerText, { color: colors.foregroundMuted }]}>
              Already have an account?{' '}
            </Text>
            <Pressable onPress={onLogin}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Sign in
              </Text>
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
  passwordHint: {
    fontSize: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  termsText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
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
