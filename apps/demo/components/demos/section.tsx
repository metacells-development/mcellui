import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  const { colors, spacing, fontSize, fontWeight } = useTheme();

  const sectionStyle: ViewStyle = {
    gap: spacing[3], // 12px
  };

  const titleStyle: TextStyle = {
    fontSize: fontSize.sm, // 14px equivalent
    fontWeight: fontWeight.semibold,
    color: colors.foregroundMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  };

  const contentStyle: ViewStyle = {
    gap: spacing[2], // 8px
  };

  return (
    <View style={sectionStyle}>
      <Text style={titleStyle}>{title}</Text>
      <View style={contentStyle}>{children}</View>
    </View>
  );
}
