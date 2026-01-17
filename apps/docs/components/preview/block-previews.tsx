'use client';

import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Button, Input, Divider, Avatar, colors } from './preview-components';

// ============================================================================
// LoginBlockPreview
// ============================================================================

interface LoginBlockPreviewProps {
  dark?: boolean;
}

export function LoginBlockPreview({ dark = false }: LoginBlockPreviewProps) {
  const theme = dark ? colors.dark : colors.light;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.foreground }]}>
          Welcome back
        </Text>
        <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>
          Sign in to your account
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Input
          label="Email"
          placeholder="email@example.com"
          dark={dark}
        />
        <View style={styles.passwordRow}>
          <Text style={[styles.label, { color: theme.foreground }]}>Password</Text>
          <Pressable>
            <Text style={[styles.forgotLink, { color: theme.primary }]}>
              Forgot password?
            </Text>
          </Pressable>
        </View>
        <Input
          placeholder="Enter your password"
          secureTextEntry
          dark={dark}
        />
        <Button fullWidth dark={dark}>
          Sign in
        </Button>
      </View>

      {/* Divider */}
      <Divider text="or continue with" dark={dark} />

      {/* Social buttons */}
      <View style={styles.socialButtons}>
        <Button variant="outline" dark={dark}>
          Google
        </Button>
        <View style={{ width: 12 }} />
        <Button variant="outline" dark={dark}>
          Apple
        </Button>
      </View>

      {/* Sign up link */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.mutedForeground }]}>
          Don't have an account?{' '}
        </Text>
        <Text style={[styles.footerLink, { color: theme.primary }]}>
          Sign up
        </Text>
      </View>
    </ScrollView>
  );
}

// ============================================================================
// ProfileBlockPreview
// ============================================================================

interface ProfileBlockPreviewProps {
  dark?: boolean;
}

export function ProfileBlockPreview({ dark = false }: ProfileBlockPreviewProps) {
  const theme = dark ? colors.dark : colors.light;

  const stats = [
    { label: 'Posts', value: '124' },
    { label: 'Followers', value: '4.2K' },
    { label: 'Following', value: '892' },
  ];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.profileContent}
    >
      {/* Avatar & Name */}
      <View style={styles.profileHeader}>
        <Avatar fallback="JD" size={80} dark={dark} />
        <Text style={[styles.profileName, { color: theme.foreground }]}>
          John Doe
        </Text>
        <Text style={[styles.profileBio, { color: theme.mutedForeground }]}>
          Product Designer at Acme Inc. Creating beautiful experiences.
        </Text>
      </View>

      {/* Stats */}
      <View style={[styles.statsRow, { borderColor: theme.border }]}>
        {stats.map((stat, index) => (
          <View key={stat.label} style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.foreground }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statLabel, { color: theme.mutedForeground }]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.profileActions}>
        <Button dark={dark}>Follow</Button>
        <View style={{ width: 12 }} />
        <Button variant="outline" dark={dark}>Message</Button>
      </View>
    </ScrollView>
  );
}

// ============================================================================
// EmptyStateBlockPreview
// ============================================================================

interface EmptyStateBlockPreviewProps {
  dark?: boolean;
}

export function EmptyStateBlockPreview({ dark = false }: EmptyStateBlockPreviewProps) {
  const theme = dark ? colors.dark : colors.light;

  return (
    <View style={[styles.screen, styles.emptyContainer, { backgroundColor: theme.background }]}>
      {/* Icon placeholder */}
      <View
        style={[
          styles.emptyIcon,
          { backgroundColor: theme.muted },
        ]}
      >
        <Text style={{ fontSize: 32 }}>📭</Text>
      </View>

      {/* Text */}
      <Text style={[styles.emptyTitle, { color: theme.foreground }]}>
        No messages yet
      </Text>
      <Text style={[styles.emptyDescription, { color: theme.mutedForeground }]}>
        When you receive messages, they will appear here. Start a conversation!
      </Text>

      {/* Action */}
      <Button dark={dark}>New Message</Button>
      <View style={{ height: 12 }} />
      <Button variant="ghost" dark={dark}>Browse Contacts</Button>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 44,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    marginBottom: 8,
  },
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  forgotLink: {
    fontSize: 14,
    fontWeight: '500',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Profile styles
  profileContent: {
    padding: 24,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 4,
  },
  profileBio: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 16,
    marginBottom: 24,
    width: '100%',
  },
  statItem: {
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
    flexDirection: 'row',
    justifyContent: 'center',
  },

  // Empty state styles
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
});
