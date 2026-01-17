'use client';

import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { ReactNode, useState } from 'react';

// Theme colors
const colors = {
  light: {
    background: '#ffffff',
    foreground: '#09090b',
    muted: '#f4f4f5',
    mutedForeground: '#71717a',
    primary: '#8b5cf6',
    primaryForeground: '#ffffff',
    secondary: '#f4f4f5',
    secondaryForeground: '#18181b',
    border: '#e4e4e7',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    card: '#ffffff',
    cardForeground: '#09090b',
  },
  dark: {
    background: '#09090b',
    foreground: '#fafafa',
    muted: '#27272a',
    mutedForeground: '#a1a1aa',
    primary: '#a78bfa',
    primaryForeground: '#09090b',
    secondary: '#27272a',
    secondaryForeground: '#fafafa',
    border: '#27272a',
    destructive: '#dc2626',
    destructiveForeground: '#fafafa',
    card: '#09090b',
    cardForeground: '#fafafa',
  },
};

// ============================================================================
// Button
// ============================================================================

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
  dark?: boolean;
}

export function Button({
  children,
  variant = 'default',
  disabled = false,
  fullWidth = false,
  onPress,
  dark = false,
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);
  const theme = dark ? colors.dark : colors.light;

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          bg: theme.secondary,
          text: theme.secondaryForeground,
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: theme.foreground,
          border: theme.border,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          text: theme.foreground,
        };
      case 'destructive':
        return {
          bg: theme.destructive,
          text: theme.destructiveForeground,
        };
      default:
        return {
          bg: theme.primary,
          text: theme.primaryForeground,
        };
    }
  };

  const variantStyle = getVariantStyles();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      style={[
        buttonStyles.base,
        {
          backgroundColor: variantStyle.bg,
          borderColor: variantStyle.border,
          borderWidth: variantStyle.border ? 1 : 0,
          opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        fullWidth && buttonStyles.fullWidth,
      ]}
    >
      <Text
        style={[
          buttonStyles.text,
          { color: variantStyle.text },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const buttonStyles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minHeight: 44,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});

// ============================================================================
// Input
// ============================================================================

interface InputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  dark?: boolean;
  label?: string;
  error?: string;
}

export function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  dark = false,
  label,
  error,
}: InputProps) {
  const theme = dark ? colors.dark : colors.light;
  const [focused, setFocused] = useState(false);

  return (
    <View style={inputStyles.container}>
      {label && (
        <Text style={[inputStyles.label, { color: theme.foreground }]}>
          {label}
        </Text>
      )}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={theme.mutedForeground}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          inputStyles.input,
          {
            backgroundColor: theme.background,
            borderColor: error ? theme.destructive : focused ? theme.primary : theme.border,
            color: theme.foreground,
          },
        ]}
      />
      {error && (
        <Text style={[inputStyles.error, { color: theme.destructive }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const inputStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});

// ============================================================================
// Card
// ============================================================================

interface CardProps {
  children: ReactNode;
  dark?: boolean;
  style?: any;
}

export function Card({ children, dark = false, style }: CardProps) {
  const theme = dark ? colors.dark : colors.light;

  return (
    <View
      style={[
        cardStyles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function CardHeader({ children, dark = false }: CardProps) {
  return <View style={cardStyles.header}>{children}</View>;
}

export function CardTitle({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  const theme = dark ? colors.dark : colors.light;
  return (
    <Text style={[cardStyles.title, { color: theme.foreground }]}>
      {children}
    </Text>
  );
}

export function CardDescription({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  const theme = dark ? colors.dark : colors.light;
  return (
    <Text style={[cardStyles.description, { color: theme.mutedForeground }]}>
      {children}
    </Text>
  );
}

export function CardContent({ children }: { children: ReactNode }) {
  return <View style={cardStyles.content}>{children}</View>;
}

const cardStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
});

// ============================================================================
// Divider
// ============================================================================

interface DividerProps {
  text?: string;
  dark?: boolean;
}

export function Divider({ text, dark = false }: DividerProps) {
  const theme = dark ? colors.dark : colors.light;

  return (
    <View style={dividerStyles.container}>
      <View style={[dividerStyles.line, { backgroundColor: theme.border }]} />
      {text && (
        <Text
          style={[
            dividerStyles.text,
            { color: theme.mutedForeground, backgroundColor: theme.background },
          ]}
        >
          {text}
        </Text>
      )}
      <View style={[dividerStyles.line, { backgroundColor: theme.border }]} />
    </View>
  );
}

const dividerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    fontSize: 12,
    paddingHorizontal: 12,
  },
});

// ============================================================================
// Avatar
// ============================================================================

interface AvatarProps {
  src?: string;
  fallback: string;
  size?: number;
  dark?: boolean;
}

export function Avatar({ src, fallback, size = 40, dark = false }: AvatarProps) {
  const theme = dark ? colors.dark : colors.light;

  return (
    <View
      style={[
        avatarStyles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.muted,
        },
      ]}
    >
      <Text
        style={[
          avatarStyles.fallback,
          {
            color: theme.mutedForeground,
            fontSize: size * 0.4,
          },
        ]}
      >
        {fallback}
      </Text>
    </View>
  );
}

const avatarStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    fontWeight: '500',
  },
});

export { colors };
