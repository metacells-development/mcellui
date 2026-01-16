import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '@nativeui/core';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';

// ============================================================================
// Schemas
// ============================================================================

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms' }),
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

// ============================================================================
// Demo Component
// ============================================================================

export function FormDemo() {
  const { colors, spacing } = useTheme();

  return (
    <View style={styles.container}>
      <Section title="Login Form">
        <LoginFormExample />
      </Section>

      <Section title="Signup Form">
        <SignupFormExample />
      </Section>

      <Section title="Form States">
        <FormStatesExample />
      </Section>
    </View>
  );
}

// ============================================================================
// Login Form Example
// ============================================================================

function LoginFormExample() {
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    Alert.alert('Success', `Logged in as ${data.email}`);
    form.reset();
  };

  return (
    <Form form={form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel required>Email</FormLabel>
            <Input
              placeholder="email@example.com"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              keyboardType="email-address"
              autoCapitalize="none"
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
            <FormLabel required>Password</FormLabel>
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
        onPress={form.handleSubmit(onSubmit)}
        loading={loading}
        fullWidth
      >
        Sign In
      </Button>
    </Form>
  );
}

// ============================================================================
// Signup Form Example
// ============================================================================

function SignupFormExample() {
  const { colors, spacing } = useTheme();
  const [loading, setLoading] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      acceptTerms: false as unknown as true,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    Alert.alert('Success', `Account created for ${data.name}`);
    form.reset();
  };

  return (
    <Form form={form}>
      <FormField
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel required>Full Name</FormLabel>
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
            <FormLabel required>Email</FormLabel>
            <Input
              placeholder="email@example.com"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              keyboardType="email-address"
              autoCapitalize="none"
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
            <FormLabel required>Password</FormLabel>
            <Input
              placeholder="Create a strong password"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              secureTextEntry
              autoComplete="password-new"
            />
            <FormDescription>
              Min 8 characters, 1 uppercase, 1 number
            </FormDescription>
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
                I agree to the Terms of Service and Privacy Policy
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

      <Button
        onPress={form.handleSubmit(onSubmit)}
        loading={loading}
        fullWidth
      >
        Create Account
      </Button>
    </Form>
  );
}

// ============================================================================
// Form States Example
// ============================================================================

function FormStatesExample() {
  const { colors, spacing } = useTheme();

  return (
    <View style={{ gap: spacing[4] }}>
      <View>
        <Text style={[styles.stateLabel, { color: colors.foregroundMuted }]}>
          Error State
        </Text>
        <Input
          label="Email"
          placeholder="email@example.com"
          error="This field is required"
        />
      </View>

      <View>
        <Text style={[styles.stateLabel, { color: colors.foregroundMuted }]}>
          Disabled State
        </Text>
        <Input
          label="Email"
          placeholder="email@example.com"
          value="disabled@example.com"
          editable={false}
        />
      </View>

      <View>
        <Text style={[styles.stateLabel, { color: colors.foregroundMuted }]}>
          With Helper Text
        </Text>
        <Input
          label="Username"
          placeholder="Choose a username"
          helperText="Username must be unique"
        />
      </View>
    </View>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#737373',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    gap: 8,
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
  errorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  stateLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
});
