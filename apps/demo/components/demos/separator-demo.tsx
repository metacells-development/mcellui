import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@metacells/mcellui-core';
import { Section } from './section';

export function SeparatorDemo() {
  const { colors, spacing, fontSize, radius } = useTheme();

  const containerStyle: ViewStyle = {
    gap: spacing[6], // 24px
  };

  const cardStyle: ViewStyle = {
    padding: spacing[4], // 16px
    gap: spacing[3], // 12px
  };

  const horizontalCardStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4], // 16px
    gap: spacing[4], // 16px
    height: 60, // Semantic height
  };

  const textStyle: TextStyle = {
    fontSize: fontSize.sm, // 14px
  };

  const horizontalSeparatorStyle: ViewStyle = {
    marginVertical: spacing[1], // 4px
  };

  const verticalSeparatorStyle: ViewStyle = {
    height: '100%',
  };

  const menuStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: radius.xl, // 12px
    padding: spacing[2], // 8px
  };

  const menuItemStyle: TextStyle = {
    paddingVertical: spacing[2.5], // 10px
    paddingHorizontal: spacing[3], // 12px
    fontSize: fontSize.base, // 15px
  };

  const menuSeparatorStyle: ViewStyle = {
    marginVertical: spacing[1], // 4px
  };

  return (
    <View style={containerStyle}>
      <Section title="Horizontal (Default)">
        <View style={cardStyle}>
          <Text style={[textStyle, { color: colors.foreground }]}>Section 1</Text>
          <Separator style={horizontalSeparatorStyle} />
          <Text style={[textStyle, { color: colors.foreground }]}>Section 2</Text>
          <Separator style={horizontalSeparatorStyle} />
          <Text style={[textStyle, { color: colors.foreground }]}>Section 3</Text>
        </View>
      </Section>

      <Section title="Vertical">
        <View style={horizontalCardStyle}>
          <Text style={[textStyle, { color: colors.foreground }]}>Left</Text>
          <Separator orientation="vertical" style={verticalSeparatorStyle} />
          <Text style={[textStyle, { color: colors.foreground }]}>Center</Text>
          <Separator orientation="vertical" style={verticalSeparatorStyle} />
          <Text style={[textStyle, { color: colors.foreground }]}>Right</Text>
        </View>
      </Section>

      <Section title="Menu Example">
        <View style={menuStyle}>
          <Text style={[menuItemStyle, { color: colors.foreground }]}>Profile</Text>
          <Text style={[menuItemStyle, { color: colors.foreground }]}>Settings</Text>
          <Separator style={menuSeparatorStyle} />
          <Text style={[menuItemStyle, { color: colors.destructive }]}>Log out</Text>
        </View>
      </Section>
    </View>
  );
}
