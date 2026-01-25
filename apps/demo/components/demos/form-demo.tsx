import React, { useState } from 'react';
import { View, Text, ViewStyle, TextStyle, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '@metacells/mcellui-core';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Section } from './section';

// ============================================================================
// Schemas
// ============================================================================

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  newsletter: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;
type ContactFormData = z.infer<typeof contactSchema>;

// ============================================================================
// Demo Component
// ============================================================================

export function FormDemo() {
  const { colors, spacing, fontSize } = useTheme();

  const containerStyle: ViewStyle = {
    gap: spacing[6], // 24px
  };

  return (
    <View style={containerStyle}>
      <Section title="Basic Form">
        <BasicFormExample />
      </Section>

      <Section title="Form States">
        <FormStatesExample />
      </Section>

      <Section title="Field Types">
        <FieldTypesExample />
      </Section>

      <Section title="Validation">
        <ValidationExample />
      </Section>

      <Section title="Use Cases">
        <ContactFormExample />
      </Section>
    </View>
  );
}

// ============================================================================
// Basic Form Example
// ============================================================================

function BasicFormExample() {
  const { spacing } = useTheme();
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
// Form States Example
// ============================================================================

function FormStatesExample() {
  const { colors, spacing, fontSize } = useTheme();

  const containerStyle: ViewStyle = {
    gap: spacing[4], // 16px
  };

  const labelStyle: TextStyle = {
    fontSize: fontSize.xs, // 12px
    fontWeight: '500',
    color: colors.foregroundMuted,
    marginBottom: spacing[2], // 8px
  };

  return (
    <View style={containerStyle}>
      <View>
        <Text style={labelStyle}>Pristine (no interaction)</Text>
        <Input
          label="Email"
          placeholder="email@example.com"
        />
      </View>

      <View>
        <Text style={labelStyle}>Touched (focused then blurred)</Text>
        <Input
          label="Email"
          placeholder="email@example.com"
          value=""
        />
      </View>

      <View>
        <Text style={labelStyle}>Error State</Text>
        <Input
          label="Email"
          placeholder="email@example.com"
          error="This field is required"
        />
      </View>

      <View>
        <Text style={labelStyle}>Submitting</Text>
        <Button loading fullWidth>
          Submitting...
        </Button>
      </View>
    </View>
  );
}

// ============================================================================
// Field Types Example
// ============================================================================

function FieldTypesExample() {
  const { spacing } = useTheme();
  const [selectValue, setSelectValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);

  const containerStyle: ViewStyle = {
    gap: spacing[4], // 16px
  };

  const checkboxRowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2], // 8px
  };

  return (
    <View style={containerStyle}>
      <Input
        label="Text Input"
        placeholder="Enter text"
      />

      <Textarea
        label="Textarea"
        placeholder="Enter longer text"
        numberOfLines={4}
      />

      <Select
        label="Select"
        value={selectValue}
        onValueChange={setSelectValue}
        options={[
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
          { label: 'Option 3', value: '3' },
        ]}
        placeholder="Choose an option"
      />

      <View style={checkboxRowStyle}>
        <Checkbox
          checked={checkboxValue}
          onCheckedChange={setCheckboxValue}
        />
        <Text>Checkbox option</Text>
      </View>
    </View>
  );
}

// ============================================================================
// Validation Example
// ============================================================================

function ValidationExample() {
  const { spacing } = useTheme();

  const schema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    age: z.string().regex(/^\d+$/, 'Must be a number').refine((val) => parseInt(val) >= 18, 'Must be 18 or older'),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      age: '',
    },
  });

  return (
    <Form form={form}>
      <FormField
        control={form.control}
        name="username"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel required>Username</FormLabel>
            <Input
              placeholder="Enter username"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
            <FormDescription>
              Choose a unique username (min 3 characters)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="age"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel required>Age</FormLabel>
            <Input
              placeholder="Enter age"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              keyboardType="number-pad"
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <Button
        onPress={form.handleSubmit((data) => {
          Alert.alert('Valid', JSON.stringify(data, null, 2));
        })}
        fullWidth
      >
        Validate
      </Button>
    </Form>
  );
}

// ============================================================================
// Contact Form Example (Use Case)
// ============================================================================

function ContactFormExample() {
  const { colors, spacing, fontSize } = useTheme();
  const [loading, setLoading] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      newsletter: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    Alert.alert('Message Sent', 'We will get back to you soon!');
    form.reset();
  };

  const checkboxRowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2], // 8px
  };

  const checkboxTextStyle: TextStyle = {
    fontSize: fontSize.sm, // 14px
    color: colors.foregroundMuted,
    flex: 1,
    lineHeight: 20,
  };

  const titleStyle: TextStyle = {
    fontSize: fontSize.sm, // 14px
    color: colors.foregroundMuted,
    textAlign: 'center',
    marginBottom: spacing[2], // 8px
  };

  return (
    <View>
      <Text style={titleStyle}>Contact Form</Text>
      <Form form={form}>
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel required>Name</FormLabel>
              <Input
                placeholder="Your name"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                autoCapitalize="words"
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
                placeholder="your@email.com"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <FormDescription>
                We'll never share your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel required>Subject</FormLabel>
              <Input
                placeholder="How can we help?"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel required>Message</FormLabel>
              <Textarea
                placeholder="Tell us more..."
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                numberOfLines={4}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newsletter"
          render={({ field }) => (
            <FormItem style={{ marginBottom: spacing[2] }}>
              <View style={checkboxRowStyle}>
                <Checkbox
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
                <Text style={checkboxTextStyle}>
                  Subscribe to our newsletter
                </Text>
              </View>
            </FormItem>
          )}
        />

        <Button
          onPress={form.handleSubmit(onSubmit)}
          loading={loading}
          fullWidth
        >
          Send Message
        </Button>
      </Form>
    </View>
  );
}
