import React from 'react';
import { View, Text } from 'react-native';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

export function LabelDemo() {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={{ gap: spacing[8] }}>
      {/* Sizes Section */}
      <Section title="Sizes">
        <View style={{ gap: spacing[3] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
            <Label size="sm">Small</Label>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>size="sm"</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
            <Label size="md">Medium</Label>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>size="md" (default)</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
            <Label size="lg">Large</Label>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>size="lg"</Text>
          </View>
        </View>
      </Section>

      {/* States Section */}
      <Section title="States">
        <View style={{ gap: spacing[3] }}>
          <View style={{ gap: spacing[1] }}>
            <Label>Default Label</Label>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>Standard label</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Label required>Required Field</Label>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>Shows asterisk indicator</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Label disabled>Disabled Label</Label>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>Muted color for disabled inputs</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Label error>Error State</Label>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>Red color for validation errors</Text>
          </View>
        </View>
      </Section>

      {/* State Combinations Section */}
      <Section title="State Combinations">
        <View style={{ gap: spacing[3] }}>
          <View style={{ gap: spacing[1] }}>
            <Label required disabled>Required + Disabled</Label>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>Required but currently disabled</Text>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Label required error>Required + Error</Label>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>Required field with validation error</Text>
          </View>
        </View>
      </Section>

      {/* With Form Inputs Section */}
      <Section title="With Form Inputs">
        <View style={{ gap: spacing[4] }}>
          <View style={{ gap: spacing[1] }}>
            <Label size="md" required>Email Address</Label>
            <Input placeholder="Enter your email" keyboardType="email-address" />
          </View>
          <View style={{ gap: spacing[1] }}>
            <Label size="md">Username</Label>
            <Input placeholder="Enter username" />
          </View>
          <View style={{ gap: spacing[1] }}>
            <Label size="md" disabled>Account ID</Label>
            <Input placeholder="Auto-generated" editable={false} />
          </View>
          <View style={{ gap: spacing[1] }}>
            <Label size="md" error>Password</Label>
            <Input placeholder="Enter password" secureTextEntry />
            <Text style={[typography.caption, { color: colors.destructive }]}>
              Password must be at least 8 characters
            </Text>
          </View>
        </View>
      </Section>

      {/* Size x State Matrix */}
      <Section title="Size x State Matrix">
        <View style={{ gap: spacing[4] }}>
          <View style={{ gap: spacing[1] }}>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>Small Labels</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
              <Label size="sm">Default</Label>
              <Label size="sm" required>Required</Label>
              <Label size="sm" disabled>Disabled</Label>
              <Label size="sm" error>Error</Label>
            </View>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>Medium Labels</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
              <Label size="md">Default</Label>
              <Label size="md" required>Required</Label>
              <Label size="md" disabled>Disabled</Label>
              <Label size="md" error>Error</Label>
            </View>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>Large Labels</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
              <Label size="lg">Default</Label>
              <Label size="lg" required>Required</Label>
              <Label size="lg" disabled>Disabled</Label>
              <Label size="lg" error>Error</Label>
            </View>
          </View>
        </View>
      </Section>
    </View>
  );
}
