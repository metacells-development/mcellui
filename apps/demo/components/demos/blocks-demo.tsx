import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useTheme } from '@nativeui/core';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import Svg, { Circle, Path } from 'react-native-svg';

// ============================================================================
// Demo Component
// ============================================================================

export function BlocksDemo() {
  const { colors, spacing } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.intro, { color: colors.foregroundMuted, marginBottom: spacing[6] }]}>
        Screen Blocks are complete, copy-paste templates for common app screens.
        Each block uses our existing components.
      </Text>

      <Section title="Profile Block">
        <ProfileBlockPreview />
      </Section>

      <Section title="Settings List Block">
        <SettingsListBlockPreview />
      </Section>

      <Section title="Empty State Block">
        <EmptyStateBlockPreview />
      </Section>

      <Section title="Error State Block">
        <ErrorStateBlockPreview />
      </Section>
    </View>
  );
}

// ============================================================================
// Profile Block Preview
// ============================================================================

function ProfileBlockPreview() {
  const { colors, spacing, radius } = useTheme();

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[6] }}>
        <View style={[styles.profileContainer, { padding: spacing[4] }]}>
          {/* Avatar and Name */}
          <View style={[styles.profileHeader, { marginBottom: spacing[4] }]}>
            <Avatar
              size="xl"
              fallback="JD"
            />
            <Text
              style={[
                styles.profileName,
                { color: colors.foreground, marginTop: spacing[3] },
              ]}
            >
              John Doe
            </Text>
            <Text
              style={[
                styles.profileSubtitle,
                { color: colors.foregroundMuted, marginTop: spacing[1] },
              ]}
            >
              @johndoe
            </Text>
          </View>

          {/* Stats */}
          <View
            style={[
              styles.profileStats,
              {
                marginBottom: spacing[4],
                paddingVertical: spacing[3],
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: colors.border,
              },
            ]}
          >
            {[
              { label: 'Posts', value: '128' },
              { label: 'Followers', value: '1.2K' },
              { label: 'Following', value: '456' },
            ].map((stat, index, arr) => (
              <View
                key={stat.label}
                style={[
                  styles.profileStat,
                  index < arr.length - 1 && {
                    borderRightWidth: 1,
                    borderRightColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.statValue, { color: colors.foreground }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statLabel, { color: colors.foregroundMuted }]}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={[styles.profileActions, { gap: spacing[3] }]}>
            <Button onPress={() => Alert.alert('Edit Profile')} fullWidth>
              Edit Profile
            </Button>
            <Button variant="outline" onPress={() => Alert.alert('Settings')} fullWidth>
              Settings
            </Button>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Settings List Block Preview
// ============================================================================

function SettingsListBlockPreview() {
  const { colors, spacing, radius } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [haptics, setHaptics] = useState(true);

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[4] }}>
        {/* Group 1: Preferences */}
        <View style={{ marginBottom: spacing[4] }}>
          <Text
            style={[
              styles.groupTitle,
              { color: colors.foregroundMuted, paddingHorizontal: spacing[2], marginBottom: spacing[2] },
            ]}
          >
            PREFERENCES
          </Text>
          <View
            style={[
              styles.settingsGroup,
              { backgroundColor: colors.backgroundMuted, borderRadius: radius.lg },
            ]}
          >
            <SettingsItem
              label="Push Notifications"
              value={notifications}
              onValueChange={setNotifications}
            />
            <Separator style={{ marginLeft: spacing[4] }} />
            <SettingsItem
              label="Dark Mode"
              value={darkMode}
              onValueChange={setDarkMode}
            />
            <Separator style={{ marginLeft: spacing[4] }} />
            <SettingsItem
              label="Haptic Feedback"
              value={haptics}
              onValueChange={setHaptics}
            />
          </View>
        </View>

        {/* Group 2: Account */}
        <View>
          <Text
            style={[
              styles.groupTitle,
              { color: colors.foregroundMuted, paddingHorizontal: spacing[2], marginBottom: spacing[2] },
            ]}
          >
            ACCOUNT
          </Text>
          <View
            style={[
              styles.settingsGroup,
              { backgroundColor: colors.backgroundMuted, borderRadius: radius.lg },
            ]}
          >
            <SettingsNavItem label="Email" value="john@example.com" />
            <Separator style={{ marginLeft: spacing[4] }} />
            <SettingsNavItem label="Change Password" />
            <Separator style={{ marginLeft: spacing[4] }} />
            <SettingsNavItem label="Log Out" destructive />
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

function SettingsItem({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.settingsItem, { padding: spacing[3.5] }]}>
      <Text style={[styles.settingsLabel, { color: colors.foreground }]}>{label}</Text>
      <Switch checked={value} onCheckedChange={onValueChange} />
    </View>
  );
}

function SettingsNavItem({
  label,
  value,
  destructive,
}: {
  label: string;
  value?: string;
  destructive?: boolean;
}) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.settingsItem, { padding: spacing[3.5] }]}>
      <Text
        style={[
          styles.settingsLabel,
          { color: destructive ? colors.destructive : colors.foreground },
        ]}
      >
        {label}
      </Text>
      <View style={styles.settingsNavRight}>
        {value && (
          <Text style={[styles.settingsValue, { color: colors.foregroundMuted }]}>
            {value}
          </Text>
        )}
        <Text style={[styles.chevron, { color: colors.foregroundMuted }]}>{'>'}</Text>
      </View>
    </View>
  );
}

// ============================================================================
// Empty State Block Preview
// ============================================================================

function EmptyStateBlockPreview() {
  const { colors, spacing } = useTheme();

  return (
    <Card>
      <CardContent>
        <View style={[styles.emptyState, { padding: spacing[6] }]}>
          <View
            style={[
              styles.emptyIcon,
              {
                backgroundColor: colors.backgroundMuted,
                width: 64,
                height: 64,
                borderRadius: 32,
                marginBottom: spacing[4],
              },
            ]}
          >
            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <Path
                d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
                stroke={colors.foregroundMuted}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground, marginBottom: spacing[2] }]}>
            No messages
          </Text>
          <Text
            style={[
              styles.emptyDescription,
              { color: colors.foregroundMuted, marginBottom: spacing[4] },
            ]}
          >
            You don't have any messages yet. Start a conversation!
          </Text>
          <Button onPress={() => Alert.alert('New Message')}>
            New Message
          </Button>
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Error State Block Preview
// ============================================================================

function ErrorStateBlockPreview() {
  const { colors, spacing } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleRetry = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    Alert.alert('Retried', 'Request completed');
  };

  return (
    <Card>
      <CardContent>
        <View style={[styles.errorState, { padding: spacing[6] }]}>
          <View
            style={[
              styles.errorIcon,
              {
                backgroundColor: colors.destructive + '15',
                width: 72,
                height: 72,
                borderRadius: 36,
                marginBottom: spacing[4],
              },
            ]}
          >
            <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
              <Circle
                cx="12"
                cy="12"
                r="10"
                stroke={colors.destructive}
                strokeWidth="2"
              />
              <Path
                d="M12 8v4"
                stroke={colors.destructive}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <Circle cx="12" cy="16" r="1" fill={colors.destructive} />
            </Svg>
          </View>
          <Text style={[styles.errorTitle, { color: colors.foreground, marginBottom: spacing[2] }]}>
            Something went wrong
          </Text>
          <Text
            style={[
              styles.errorDescription,
              { color: colors.foregroundMuted, marginBottom: spacing[2] },
            ]}
          >
            We couldn't load your data. Please try again.
          </Text>
          <Text
            style={[
              styles.errorCode,
              {
                color: colors.foregroundMuted,
                backgroundColor: colors.backgroundMuted,
                paddingHorizontal: spacing[2],
                paddingVertical: spacing[1],
                borderRadius: 4,
                marginBottom: spacing[4],
              },
            ]}
          >
            Error: NETWORK_ERROR
          </Text>
          <Button onPress={handleRetry} loading={loading}>
            Retry
          </Button>
        </View>
      </CardContent>
    </Card>
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
  intro: {
    fontSize: 14,
    lineHeight: 20,
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
  // Profile Block
  profileContainer: {
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
  },
  profileSubtitle: {
    fontSize: 14,
  },
  profileStats: {
    flexDirection: 'row',
    width: '100%',
  },
  profileStat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  profileActions: {
    width: '100%',
  },
  // Settings Block
  groupTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  settingsGroup: {
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsLabel: {
    fontSize: 15,
  },
  settingsNavRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsValue: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Error State
  errorState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorCode: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
});
