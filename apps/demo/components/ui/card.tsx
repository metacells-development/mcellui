import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';
import { cn } from '@/lib/utils';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  return <View style={cn(styles.card, style)}>{children}</View>;
}

export function CardHeader({ children, style }: CardProps) {
  return <View style={cn(styles.header, style)}>{children}</View>;
}

export function CardTitle({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={cn(styles.title, style)}>{children}</Text>;
}

export function CardDescription({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={cn(styles.description, style)}>{children}</Text>;
}

export function CardContent({ children, style }: CardProps) {
  return <View style={cn(styles.content, style)}>{children}</View>;
}

export function CardFooter({ children, style }: CardProps) {
  return <View style={cn(styles.footer, style)}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  header: { padding: 16, paddingBottom: 8 },
  title: { fontSize: 18, fontWeight: '600', color: '#171717' },
  description: { fontSize: 14, color: '#737373', marginTop: 4 },
  content: { padding: 16, paddingTop: 0 },
  footer: { padding: 16, paddingTop: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
});
