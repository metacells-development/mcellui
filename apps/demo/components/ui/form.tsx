/**
 * Form
 *
 * Form components with react-hook-form integration.
 * Provides type-safe form handling with Zod validation.
 *
 * @example
 * ```tsx
 * import { useForm } from 'react-hook-form';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { z } from 'zod';
 *
 * const schema = z.object({
 *   email: z.string().email('Invalid email'),
 *   password: z.string().min(8, 'Min 8 characters'),
 * });
 *
 * type FormData = z.infer<typeof schema>;
 *
 * function LoginForm() {
 *   const form = useForm<FormData>({
 *     resolver: zodResolver(schema),
 *   });
 *
 *   const onSubmit = (data: FormData) => {
 *     console.log(data);
 *   };
 *
 *   return (
 *     <Form form={form} onSubmit={onSubmit}>
 *       <FormField
 *         control={form.control}
 *         name="email"
 *         render={({ field, fieldState }) => (
 *           <FormItem>
 *             <FormLabel>Email</FormLabel>
 *             <Input
 *               placeholder="email@example.com"
 *               value={field.value}
 *               onChangeText={field.onChange}
 *               onBlur={field.onBlur}
 *               error={fieldState.error?.message}
 *             />
 *             <FormMessage />
 *           </FormItem>
 *         )}
 *       />
 *       <Button onPress={form.handleSubmit(onSubmit)}>Submit</Button>
 *     </Form>
 *   );
 * }
 * ```
 */

import React, { createContext, useContext, useId } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  UseFormReturn,
  useFormContext,
  ControllerRenderProps,
  ControllerFieldState,
  UseFormStateReturn,
} from 'react-hook-form';
import { useTheme } from '@nativeui/core';

// ============================================================================
// Form Context
// ============================================================================

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue | null>(null);

// ============================================================================
// useFormField Hook
// ============================================================================

export function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error('useFormField must be used within <FormField>');
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  return {
    id: itemContext?.id ?? '',
    name: fieldContext.name,
    formItemId: `${itemContext?.id}-form-item`,
    formDescriptionId: `${itemContext?.id}-form-description`,
    formMessageId: `${itemContext?.id}-form-message`,
    ...fieldState,
  };
}

// ============================================================================
// Form Component
// ============================================================================

export interface FormProps<TFieldValues extends FieldValues> {
  /** react-hook-form form instance */
  form: UseFormReturn<TFieldValues>;
  /** Form children */
  children: React.ReactNode;
  /** Submit handler */
  onSubmit?: (data: TFieldValues) => void | Promise<void>;
  /** Container style */
  style?: ViewStyle;
}

export function Form<TFieldValues extends FieldValues>({
  form,
  children,
  style,
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <View style={[styles.form, style]}>{children}</View>
    </FormProvider>
  );
}

// ============================================================================
// FormField Component
// ============================================================================

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'> {
  render: (props: {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
  }) => React.ReactElement;
}

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ name, ...props }: FormFieldProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller name={name} {...props} />
    </FormFieldContext.Provider>
  );
}

// ============================================================================
// FormItem Component
// ============================================================================

export interface FormItemProps {
  /** Children elements */
  children: React.ReactNode;
  /** Container style */
  style?: ViewStyle;
}

export function FormItem({ children, style }: FormItemProps) {
  const id = useId();
  const { spacing } = useTheme();

  return (
    <FormItemContext.Provider value={{ id }}>
      <View style={[styles.formItem, { marginBottom: spacing[4] }, style]}>
        {children}
      </View>
    </FormItemContext.Provider>
  );
}

// ============================================================================
// FormLabel Component
// ============================================================================

export interface FormLabelProps {
  /** Label text */
  children: React.ReactNode;
  /** Show required asterisk */
  required?: boolean;
  /** Additional text styles */
  style?: TextStyle;
}

export function FormLabel({ children, required, style }: FormLabelProps) {
  const { colors, spacing } = useTheme();
  const { error } = useFormField();

  return (
    <Text
      style={[
        styles.formLabel,
        {
          color: error ? colors.destructive : colors.foreground,
          marginBottom: spacing[1.5],
        },
        style,
      ]}
    >
      {children}
      {required && (
        <Text style={{ color: colors.destructive }}> *</Text>
      )}
    </Text>
  );
}

// ============================================================================
// FormDescription Component
// ============================================================================

export interface FormDescriptionProps {
  /** Description text */
  children: React.ReactNode;
  /** Additional text styles */
  style?: TextStyle;
}

export function FormDescription({ children, style }: FormDescriptionProps) {
  const { colors, spacing } = useTheme();

  return (
    <Text
      style={[
        styles.formDescription,
        {
          color: colors.foregroundMuted,
          marginTop: spacing[1],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

// ============================================================================
// FormMessage Component
// ============================================================================

export interface FormMessageProps {
  /** Override error message */
  children?: React.ReactNode;
  /** Additional text styles */
  style?: TextStyle;
}

export function FormMessage({ children, style }: FormMessageProps) {
  const { colors, spacing } = useTheme();
  const { error } = useFormField();
  const message = error?.message;

  // Don't render if no message
  if (!message && !children) {
    return null;
  }

  return (
    <Text
      style={[
        styles.formMessage,
        {
          color: colors.destructive,
          marginTop: spacing[1],
        },
        style,
      ]}
    >
      {children ?? message}
    </Text>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
  formItem: {
    width: '100%',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  formDescription: {
    fontSize: 12,
  },
  formMessage: {
    fontSize: 12,
    fontWeight: '500',
  },
});
