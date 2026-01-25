import React from 'react';
import { View, Text } from 'react-native';
import { AvatarStack } from '@/components/ui/avatar-stack';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

const sampleUsers = [
  { name: 'Alice Johnson', source: { uri: 'https://i.pravatar.cc/150?img=1' } },
  { name: 'Bob Smith', source: { uri: 'https://i.pravatar.cc/150?img=2' } },
  { name: 'Carol White', source: { uri: 'https://i.pravatar.cc/150?img=3' } },
  { name: 'David Brown', source: { uri: 'https://i.pravatar.cc/150?img=4' } },
  { name: 'Eve Davis', source: { uri: 'https://i.pravatar.cc/150?img=5' } },
  { name: 'Frank Miller', source: { uri: 'https://i.pravatar.cc/150?img=6' } },
  { name: 'Grace Wilson', source: { uri: 'https://i.pravatar.cc/150?img=7' } },
];

const fallbackUsers = [
  { name: 'Alice Johnson' },
  { name: 'Bob Smith' },
  { name: 'Carol White' },
  { name: 'David Brown' },
  { name: 'Eve Davis' },
];

const mixedUsers = [
  { name: 'Alice Johnson', source: { uri: 'https://i.pravatar.cc/150?img=1' } },
  { name: 'Bob Smith' }, // fallback initials
  { name: 'Carol White', source: { uri: 'https://i.pravatar.cc/150?img=3' } },
  { name: 'David Brown' }, // fallback initials
  { name: 'Eve Davis', source: { uri: 'https://i.pravatar.cc/150?img=5' } },
];

export function AvatarStackDemo() {
  const { colors, spacing, radius, typography } = useTheme();

  return (
    <View style={{ gap: spacing[8] }}>
      {/* Sizes Section */}
      <Section title="Sizes">
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[6], flexWrap: 'wrap' }}>
          <View style={{ alignItems: 'center', gap: spacing[2] }}>
            <AvatarStack avatars={sampleUsers.slice(0, 3)} size="sm" />
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>Small</Text>
          </View>
          <View style={{ alignItems: 'center', gap: spacing[2] }}>
            <AvatarStack avatars={sampleUsers.slice(0, 3)} size="md" />
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>Medium</Text>
          </View>
          <View style={{ alignItems: 'center', gap: spacing[2] }}>
            <AvatarStack avatars={sampleUsers.slice(0, 3)} size="lg" />
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>Large</Text>
          </View>
          <View style={{ alignItems: 'center', gap: spacing[2] }}>
            <AvatarStack avatars={sampleUsers.slice(0, 3)} size="xl" />
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>XL</Text>
          </View>
        </View>
      </Section>

      {/* Max Count Section */}
      <Section title="Max Count">
        <View style={{ gap: spacing[4] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
            <AvatarStack avatars={sampleUsers} max={2} />
            <Text style={[typography.bodySm, { color: colors.foreground }]}>
              max=2 ({sampleUsers.length} total)
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
            <AvatarStack avatars={sampleUsers} max={3} />
            <Text style={[typography.bodySm, { color: colors.foreground }]}>
              max=3 ({sampleUsers.length} total)
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
            <AvatarStack avatars={sampleUsers} max={4} />
            <Text style={[typography.bodySm, { color: colors.foreground }]}>
              max=4 ({sampleUsers.length} total)
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
            <AvatarStack avatars={sampleUsers} max={5} />
            <Text style={[typography.bodySm, { color: colors.foreground }]}>
              max=5 ({sampleUsers.length} total)
            </Text>
          </View>
        </View>
      </Section>

      {/* Overflow Indicator Section */}
      <Section title="Overflow Indicator">
        <View style={{ gap: spacing[3] }}>
          <AvatarStack avatars={sampleUsers} max={3} size="lg" />
          <Text style={[typography.caption, { color: colors.foregroundMuted }]}>
            Shows +{sampleUsers.length - 3} indicator when more avatars than max
          </Text>
        </View>
      </Section>

      {/* Fallback Initials Section */}
      <Section title="Fallback Initials">
        <View style={{ gap: spacing[3] }}>
          <AvatarStack avatars={fallbackUsers} max={5} size="lg" />
          <Text style={[typography.caption, { color: colors.foregroundMuted }]}>
            When no image is provided, initials are shown from name
          </Text>
        </View>
      </Section>

      {/* Mixed Avatars Section */}
      <Section title="Mixed (Images + Initials)">
        <View style={{ gap: spacing[3] }}>
          <AvatarStack avatars={mixedUsers} max={5} size="md" />
          <Text style={[typography.caption, { color: colors.foregroundMuted }]}>
            Some avatars with images, some with fallback initials
          </Text>
        </View>
      </Section>

      {/* Overlap Variations Section */}
      <Section title="Overlap Variations">
        <View style={{ gap: spacing[4] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
            <AvatarStack avatars={sampleUsers.slice(0, 4)} overlap={0.2} />
            <Text style={[typography.bodySm, { color: colors.foreground }]}>
              overlap=0.2 (less overlap)
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
            <AvatarStack avatars={sampleUsers.slice(0, 4)} overlap={0.3} />
            <Text style={[typography.bodySm, { color: colors.foreground }]}>
              overlap=0.3 (default)
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
            <AvatarStack avatars={sampleUsers.slice(0, 4)} overlap={0.4} />
            <Text style={[typography.bodySm, { color: colors.foreground }]}>
              overlap=0.4 (more overlap)
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
            <AvatarStack avatars={sampleUsers.slice(0, 4)} overlap={0.5} />
            <Text style={[typography.bodySm, { color: colors.foreground }]}>
              overlap=0.5 (maximum)
            </Text>
          </View>
        </View>
      </Section>

      {/* In Context Section */}
      <Section title="In Context">
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            padding: spacing[4],
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing[2],
            }}
          >
            <Text style={[typography.label, { color: colors.foreground }]}>
              Project Team
            </Text>
            <AvatarStack avatars={sampleUsers.slice(0, 5)} size="sm" max={4} />
          </View>
          <Text style={[typography.bodySm, { color: colors.foregroundMuted }]}>
            5 members are working on this project
          </Text>
        </View>
      </Section>
    </View>
  );
}
