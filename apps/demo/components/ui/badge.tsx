import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({ children, variant = 'default', style, textStyle }: BadgeProps) {
  return (
    <View style={cn(styles.base, styles[variant], style)}>
      <Text style={cn(styles.text, styles[`${variant}Text`], textStyle)}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999 },
  default: { backgroundColor: '#3b82f6' },
  secondary: { backgroundColor: '#f5f5f5' },
  destructive: { backgroundColor: '#ef4444' },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#e5e5e5' },
  text: { fontSize: 12, fontWeight: '500' },
  defaultText: { color: '#ffffff' },
  secondaryText: { color: '#171717' },
  destructiveText: { color: '#ffffff' },
  outlineText: { color: '#171717' },
});
