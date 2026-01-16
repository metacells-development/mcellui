import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Image, TextInput, Pressable } from 'react-native';
import { useTheme } from '@nativeui/core';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

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

      <Section title="Notification Item">
        <NotificationItemPreview />
      </Section>

      <Section title="Content Card">
        <ContentCardPreview />
      </Section>

      <Section title="Feature Card">
        <FeatureCardPreview />
      </Section>

      <Section title="Stats Card">
        <StatsCardPreview />
      </Section>

      <Section title="Hero Block">
        <HeroBlockPreview />
      </Section>

      <Section title="Social Proof Bar">
        <SocialProofBarPreview />
      </Section>

      <Section title="Search Header">
        <SearchHeaderPreview />
      </Section>

      <Section title="Onboarding Slide">
        <OnboardingSlidePreview />
      </Section>

      <Section title="Media Item">
        <MediaItemPreview />
      </Section>

      <Section title="Feed Post Card">
        <FeedPostCardPreview />
      </Section>

      <Section title="Login Block">
        <LoginBlockPreview />
      </Section>

      <Section title="Signup Block">
        <SignupBlockPreview />
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
// Notification Item Preview
// ============================================================================

function NotificationItemPreview() {
  const { colors, spacing, radius } = useTheme();

  const notifications = [
    {
      avatar: 'https://i.pravatar.cc/100?img=1',
      title: 'Sarah liked your post',
      message: '"Great photo from the weekend!"',
      time: '2m ago',
      unread: true,
    },
    {
      avatar: 'https://i.pravatar.cc/100?img=2',
      title: 'New follower',
      message: 'Mike started following you',
      time: '1h ago',
      unread: true,
    },
    {
      avatar: 'https://i.pravatar.cc/100?img=3',
      title: 'Comment on your post',
      message: 'This looks amazing!',
      time: '3h ago',
      unread: false,
    },
  ];

  return (
    <Card style={{ overflow: 'hidden' }}>
      {/* No padding wrapper - backgrounds extend to card edges */}
      {notifications.map((item, index) => (
        <View key={index}>
          <Pressable
            style={[
              styles.notificationItem,
              { padding: spacing[4], backgroundColor: item.unread ? colors.primary + '10' : 'transparent' },
            ]}
              onPress={() => Alert.alert(item.title)}
            >
              <Avatar size="md" source={{ uri: item.avatar }} fallback={item.title[0]} />
              <View style={[styles.notificationContent, { marginLeft: spacing[3] }]}>
                <View style={styles.notificationHeader}>
                  <Text style={[styles.notificationTitle, { color: colors.foreground }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.notificationTime, { color: colors.foregroundMuted }]}>
                    {item.time}
                  </Text>
                </View>
                <Text style={[styles.notificationMessage, { color: colors.foregroundMuted }]} numberOfLines={1}>
                  {item.message}
                </Text>
              </View>
              {item.unread && (
                <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
              )}
            </Pressable>
            {index < notifications.length - 1 && <Separator style={{ marginLeft: 56 + spacing[4] }} />}
          </View>
        ))}
    </Card>
  );
}

// ============================================================================
// Content Card Preview
// ============================================================================

function ContentCardPreview() {
  const { colors, spacing, radius } = useTheme();

  return (
    <Card>
      <View style={[styles.contentCardImage, { backgroundColor: colors.secondary, height: 160 }]}>
        <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="2" stroke={colors.foregroundMuted} strokeWidth="2" />
          <Circle cx="8.5" cy="8.5" r="1.5" fill={colors.foregroundMuted} />
          <Path d="M21 15l-5-5L5 21" stroke={colors.foregroundMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>
      <CardContent style={{ paddingTop: spacing[4] }}>
        <Text style={[styles.contentCardTitle, { color: colors.foreground, marginBottom: spacing[1] }]}>
          Discover Amazing Places
        </Text>
        <Text style={[styles.contentCardSubtitle, { color: colors.foregroundMuted, marginBottom: spacing[3] }]}>
          Explore the world's most beautiful destinations with our curated travel guides.
        </Text>
        <Button onPress={() => Alert.alert('Explore')}>Explore Now</Button>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Feature Card Preview
// ============================================================================

function FeatureCardPreview() {
  const { colors, spacing, radius } = useTheme();

  const features = [
    { icon: '⚡', title: 'Lightning Fast', description: 'Optimized for speed and performance' },
    { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security built in' },
    { icon: '🎨', title: 'Beautiful', description: 'Stunning UI that users love' },
  ];

  return (
    <View style={{ gap: spacing[3] }}>
      {features.map((feature, index) => (
        <Card key={index}>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={[styles.featureCard, { gap: spacing[3] }]}>
              <View
                style={[
                  styles.featureIcon,
                  {
                    backgroundColor: colors.primary + '15',
                    width: 48,
                    height: 48,
                    borderRadius: radius.lg,
                  },
                ]}
              >
                <Text style={{ fontSize: 24 }}>{feature.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.featureTitle, { color: colors.foreground }]}>{feature.title}</Text>
                <Text style={[styles.featureDescription, { color: colors.foregroundMuted }]}>
                  {feature.description}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      ))}
    </View>
  );
}

// ============================================================================
// Stats Card Preview
// ============================================================================

function StatsCardPreview() {
  const { colors, spacing, radius } = useTheme();

  const stats = [
    { value: '$12,450', label: 'Revenue', trend: 12.5, trendLabel: 'vs last month' },
    { value: '1,234', label: 'Users', trend: -2.3, trendLabel: 'vs last week' },
  ];

  return (
    <View style={{ gap: spacing[3] }}>
      {stats.map((stat, index) => {
        const isPositive = stat.trend >= 0;
        const trendColor = isPositive ? colors.success : colors.destructive;

        return (
          <Card key={index}>
            <CardContent style={{ paddingTop: spacing[4] }}>
              <Text style={[styles.statsLabel, { color: colors.foregroundMuted }]}>{stat.label}</Text>
              <Text style={[styles.statsValue, { color: colors.foreground, marginTop: spacing[1] }]}>
                {stat.value}
              </Text>
              <View style={[styles.statsTrend, { marginTop: spacing[2] }]}>
                <Text style={[styles.statsTrendValue, { color: trendColor }]}>
                  {isPositive ? '+' : ''}{stat.trend.toFixed(1)}%
                </Text>
                <Text style={[styles.statsTrendLabel, { color: colors.foregroundMuted, marginLeft: spacing[1] }]}>
                  {stat.trendLabel}
                </Text>
              </View>
            </CardContent>
          </Card>
        );
      })}
    </View>
  );
}

// ============================================================================
// Hero Block Preview
// ============================================================================

function HeroBlockPreview() {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      style={[
        styles.heroBlock,
        {
          borderRadius: radius.lg,
          height: 200,
          overflow: 'hidden',
        },
      ]}
    >
      {/* Mesh gradient simulation with overlapping gradients */}
      <View style={StyleSheet.absoluteFill}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#667eea' }]} />
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'transparent',
              // Simulate gradient with opacity overlay
              opacity: 0.8,
            },
          ]}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: '#764ba2',
              opacity: 0.7,
              transform: [{ skewY: '-10deg' }, { scale: 1.5 }],
            }}
          />
        </View>
      </View>
      {/* Content */}
      <View style={{ flex: 1, justifyContent: 'flex-end', padding: spacing[6] }}>
        <Text style={[styles.heroTitle, { color: '#FFFFFF', marginBottom: spacing[2] }]}>
          Welcome Back!
        </Text>
        <Text style={[styles.heroSubtitle, { color: 'rgba(255,255,255,0.9)', marginBottom: spacing[4] }]}>
          Mesh gradient background option
        </Text>
        <Button
          variant="secondary"
          onPress={() => Alert.alert('Get Started')}
        >
          Get Started
        </Button>
      </View>
    </View>
  );
}

// ============================================================================
// Social Proof Bar Preview
// ============================================================================

function SocialProofBarPreview() {
  const { colors, spacing } = useTheme();

  const avatars = [
    'https://i.pravatar.cc/100?img=10',
    'https://i.pravatar.cc/100?img=11',
    'https://i.pravatar.cc/100?img=12',
  ];

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[4] }}>
        <Pressable
          style={[styles.socialProofBar, { gap: spacing[3] }]}
          onPress={() => Alert.alert('View all')}
        >
          {/* Avatar Stack */}
          <View style={styles.avatarStack}>
            {avatars.map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={[
                  styles.stackedAvatar,
                  {
                    left: index * 20,
                    zIndex: avatars.length - index,
                    borderColor: colors.background,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={[styles.socialProofText, { color: colors.foregroundMuted, marginLeft: 40 }]}>
            Sarah, Mike, and 42 others liked this
          </Text>
        </Pressable>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Search Header Preview
// ============================================================================

function SearchHeaderPreview() {
  const { colors, spacing, radius } = useTheme();
  const [searchValue, setSearchValue] = useState('');

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[4] }}>
        <View style={[styles.searchHeader, { gap: spacing[3] }]}>
          {/* Search Input */}
          <View
            style={[
              styles.searchInput,
              {
                flex: 1,
                backgroundColor: colors.secondary,
                borderRadius: radius.lg,
                paddingHorizontal: spacing[3],
                height: 44,
              },
            ]}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Circle cx="11" cy="11" r="7" stroke={colors.foregroundMuted} strokeWidth="2" />
              <Path d="M20 20L16.5 16.5" stroke={colors.foregroundMuted} strokeWidth="2" strokeLinecap="round" />
            </Svg>
            <TextInput
              style={[styles.searchTextInput, { color: colors.foreground, marginLeft: spacing[2] }]}
              placeholder="Search..."
              placeholderTextColor={colors.foregroundMuted}
              value={searchValue}
              onChangeText={setSearchValue}
            />
          </View>

          {/* Filter Button */}
          <Pressable
            style={[
              styles.filterButton,
              {
                backgroundColor: colors.secondary,
                borderRadius: radius.lg,
                width: 44,
                height: 44,
              },
            ]}
            onPress={() => Alert.alert('Filters')}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M4 6h16M6 12h12M8 18h8" stroke={colors.foreground} strokeWidth="2" strokeLinecap="round" />
            </Svg>
          </Pressable>

          {/* Avatar */}
          <Avatar size="md" fallback="U" />
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Onboarding Slide Preview
// ============================================================================

function OnboardingSlidePreview() {
  const { colors, spacing, radius } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 3;

  const slides = [
    {
      title: 'Welcome to MyApp',
      description: 'Discover amazing features that will change how you work and connect.',
    },
    {
      title: 'Stay Organized',
      description: 'Keep all your important tasks and notes in one beautiful place.',
    },
    {
      title: 'Connect & Share',
      description: 'Share your moments with friends and family instantly.',
    },
  ];

  const current = slides[currentStep];

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[4] }}>
        {/* Mini Onboarding Preview */}
        <View style={[styles.onboardingPreview, { backgroundColor: colors.secondary, borderRadius: radius.lg }]}>
          {/* Illustration placeholder */}
          <View
            style={[
              styles.onboardingIllustration,
              { backgroundColor: colors.primary + '20', borderRadius: radius.md },
            ]}
          >
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="8" r="4" fill={colors.primary} />
              <Path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill={colors.primary} />
            </Svg>
          </View>

          {/* Content */}
          <Text style={[styles.onboardingTitle, { color: colors.foreground }]}>
            {current.title}
          </Text>
          <Text style={[styles.onboardingDescription, { color: colors.foregroundMuted }]}>
            {current.description}
          </Text>

          {/* Pagination */}
          <View style={[styles.onboardingPagination, { marginTop: spacing[4], marginBottom: spacing[3] }]}>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.onboardingDot,
                  {
                    backgroundColor: index === currentStep ? colors.primary : colors.border,
                    width: index === currentStep ? 20 : 8,
                    borderRadius: radius.full,
                    marginHorizontal: spacing[1],
                  },
                ]}
              />
            ))}
          </View>

          {/* Button */}
          <Button
            size="sm"
            onPress={() => setCurrentStep((currentStep + 1) % totalSteps)}
          >
            {currentStep === totalSteps - 1 ? 'Get Started' : 'Next'}
          </Button>
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Media Item Preview
// ============================================================================

function MediaItemPreview() {
  const { colors, spacing, radius } = useTheme();
  const [selectedIds, setSelectedIds] = useState<number[]>([1]);

  const mediaItems = [
    { id: 0, type: 'image' as const, uri: 'https://picsum.photos/200/200?random=1' },
    { id: 1, type: 'image' as const, uri: 'https://picsum.photos/200/200?random=2' },
    { id: 2, type: 'video' as const, uri: 'https://picsum.photos/200/200?random=3', duration: 45 },
    { id: 3, type: 'image' as const, uri: 'https://picsum.photos/200/200?random=4' },
    { id: 4, type: 'video' as const, uri: 'https://picsum.photos/200/200?random=5', duration: 125 },
    { id: 5, type: 'image' as const, uri: 'https://picsum.photos/200/200?random=6' },
  ];

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[4] }}>
        <Text style={[styles.mediaLabel, { color: colors.foregroundMuted, marginBottom: spacing[3] }]}>
          Tap to select • {selectedIds.length} selected
        </Text>
        <View style={styles.mediaGrid}>
          {mediaItems.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => toggleSelect(item.id)}
              style={[
                styles.mediaItem,
                {
                  borderRadius: radius.md,
                  borderWidth: selectedIds.includes(item.id) ? 3 : 0,
                  borderColor: colors.primary,
                },
              ]}
            >
              <Image
                source={{ uri: item.uri }}
                style={[styles.mediaThumbnail, { borderRadius: radius.md - 2 }]}
              />
              {/* Video duration badge */}
              {item.type === 'video' && item.duration && (
                <View style={[styles.durationBadge, { backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: radius.sm }]}>
                  <Text style={styles.durationText}>{formatDuration(item.duration)}</Text>
                </View>
              )}
              {/* Selection checkbox */}
              <View
                style={[
                  styles.mediaCheckbox,
                  {
                    backgroundColor: selectedIds.includes(item.id) ? colors.primary : 'rgba(255,255,255,0.8)',
                    borderRadius: radius.full,
                    borderColor: selectedIds.includes(item.id) ? colors.primary : colors.border,
                  },
                ]}
              >
                {selectedIds.includes(item.id) && (
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Path d="M20 6L9 17l-5-5" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Feed Post Card Preview
// ============================================================================

function FeedPostCardPreview() {
  const { colors, spacing, radius } = useTheme();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(42);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[4] }}>
        {/* Author Header */}
        <View style={[styles.feedHeader, { marginBottom: spacing[3] }]}>
          <Avatar size="md" fallback="JD" />
          <View style={{ marginLeft: spacing[3], flex: 1 }}>
            <Text style={[styles.feedAuthor, { color: colors.foreground }]}>John Doe</Text>
            <Text style={[styles.feedTime, { color: colors.foregroundMuted }]}>2 hours ago</Text>
          </View>
          <Pressable onPress={() => Alert.alert('More options')}>
            <Text style={{ color: colors.foregroundMuted, fontSize: 20 }}>•••</Text>
          </Pressable>
        </View>

        {/* Content */}
        <Text style={[styles.feedContent, { color: colors.foreground, marginBottom: spacing[3] }]}>
          Just shipped a new feature! 🚀 Really excited about how this turned out. Let me know what you think!
        </Text>

        {/* Image placeholder */}
        <View
          style={[
            styles.feedImage,
            {
              backgroundColor: colors.secondary,
              borderRadius: radius.lg,
              height: 180,
              marginBottom: spacing[3],
            },
          ]}
        >
          <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="3" width="18" height="18" rx="2" stroke={colors.foregroundMuted} strokeWidth="2" />
            <Circle cx="8.5" cy="8.5" r="1.5" fill={colors.foregroundMuted} />
            <Path d="M21 15l-5-5L5 21" stroke={colors.foregroundMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>

        {/* Actions */}
        <View style={[styles.feedActions, { gap: spacing[4] }]}>
          <Pressable style={styles.feedAction} onPress={handleLike}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill={liked ? colors.destructive : 'none'}>
              <Path
                d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                stroke={liked ? colors.destructive : colors.foregroundMuted}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={[styles.feedActionText, { color: liked ? colors.destructive : colors.foregroundMuted }]}>
              {likeCount}
            </Text>
          </Pressable>
          <Pressable style={styles.feedAction} onPress={() => Alert.alert('Comments')}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
                stroke={colors.foregroundMuted}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={[styles.feedActionText, { color: colors.foregroundMuted }]}>12</Text>
          </Pressable>
          <Pressable style={styles.feedAction} onPress={() => Alert.alert('Share')}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                stroke={colors.foregroundMuted}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Login Block Preview
// ============================================================================

function LoginBlockPreview() {
  const { colors, spacing, radius } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[4] }}>
        <View style={styles.loginContainer}>
          {/* Header */}
          <View style={[styles.loginHeader, { marginBottom: spacing[6] }]}>
            <Text style={[styles.loginTitle, { color: colors.foreground }]}>Welcome back</Text>
            <Text style={[styles.loginSubtitle, { color: colors.foregroundMuted }]}>
              Sign in to your account
            </Text>
          </View>

          {/* Form */}
          <View style={{ gap: spacing[4] }}>
            <View>
              <Text style={[styles.inputLabel, { color: colors.foreground, marginBottom: spacing[2] }]}>
                Email
              </Text>
              <TextInput
                style={[
                  styles.loginInput,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderRadius: radius.md,
                    color: colors.foreground,
                    padding: spacing[3],
                  },
                ]}
                placeholder="you@example.com"
                placeholderTextColor={colors.foregroundMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View>
              <View style={styles.passwordHeader}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>Password</Text>
                <Pressable onPress={() => Alert.alert('Forgot Password')}>
                  <Text style={[styles.forgotPassword, { color: colors.primary }]}>Forgot?</Text>
                </Pressable>
              </View>
              <TextInput
                style={[
                  styles.loginInput,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderRadius: radius.md,
                    color: colors.foreground,
                    padding: spacing[3],
                    marginTop: spacing[2],
                  },
                ]}
                placeholder="••••••••"
                placeholderTextColor={colors.foregroundMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Button */}
          <Button
            onPress={() => Alert.alert('Login', `Email: ${email}`)}
            style={{ marginTop: spacing[6] }}
            fullWidth
          >
            Sign In
          </Button>

          {/* Divider */}
          <View style={[styles.loginDivider, { marginVertical: spacing[6] }]}>
            <Separator style={{ flex: 1 }} />
            <Text style={[styles.dividerText, { color: colors.foregroundMuted, marginHorizontal: spacing[3] }]}>
              or
            </Text>
            <Separator style={{ flex: 1 }} />
          </View>

          {/* Social Login */}
          <Button variant="outline" onPress={() => Alert.alert('Continue with Google')} fullWidth>
            Continue with Google
          </Button>

          {/* Footer */}
          <View style={[styles.loginFooter, { marginTop: spacing[6] }]}>
            <Text style={{ color: colors.foregroundMuted }}>Don't have an account? </Text>
            <Pressable onPress={() => Alert.alert('Sign Up')}>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Sign up</Text>
            </Pressable>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Signup Block Preview
// ============================================================================

function SignupBlockPreview() {
  const { colors, spacing, radius } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[4] }}>
        <View style={styles.loginContainer}>
          {/* Header */}
          <View style={[styles.loginHeader, { marginBottom: spacing[6] }]}>
            <Text style={[styles.loginTitle, { color: colors.foreground }]}>Create account</Text>
            <Text style={[styles.loginSubtitle, { color: colors.foregroundMuted }]}>
              Get started with your free account
            </Text>
          </View>

          {/* Form */}
          <View style={{ gap: spacing[4] }}>
            <View>
              <Text style={[styles.inputLabel, { color: colors.foreground, marginBottom: spacing[2] }]}>
                Full Name
              </Text>
              <TextInput
                style={[
                  styles.loginInput,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderRadius: radius.md,
                    color: colors.foreground,
                    padding: spacing[3],
                  },
                ]}
                placeholder="John Doe"
                placeholderTextColor={colors.foregroundMuted}
                value={name}
                onChangeText={setName}
              />
            </View>
            <View>
              <Text style={[styles.inputLabel, { color: colors.foreground, marginBottom: spacing[2] }]}>
                Email
              </Text>
              <TextInput
                style={[
                  styles.loginInput,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderRadius: radius.md,
                    color: colors.foreground,
                    padding: spacing[3],
                  },
                ]}
                placeholder="you@example.com"
                placeholderTextColor={colors.foregroundMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View>
              <Text style={[styles.inputLabel, { color: colors.foreground, marginBottom: spacing[2] }]}>
                Password
              </Text>
              <TextInput
                style={[
                  styles.loginInput,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderRadius: radius.md,
                    color: colors.foreground,
                    padding: spacing[3],
                  },
                ]}
                placeholder="••••••••"
                placeholderTextColor={colors.foregroundMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Text style={[styles.passwordHint, { color: colors.foregroundMuted, marginTop: spacing[1] }]}>
                Must be at least 8 characters
              </Text>
            </View>

            {/* Terms Checkbox */}
            <View style={[styles.termsRow, { gap: spacing[2] }]}>
              <Pressable
                onPress={() => setAgreed(!agreed)}
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: agreed ? colors.primary : 'transparent',
                    borderColor: agreed ? colors.primary : colors.border,
                    borderRadius: radius.sm,
                  },
                ]}
              >
                {agreed && (
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Path d="M20 6L9 17l-5-5" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                )}
              </Pressable>
              <Text style={[styles.termsText, { color: colors.foregroundMuted, flex: 1 }]}>
                I agree to the{' '}
                <Text style={{ color: colors.primary }}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={{ color: colors.primary }}>Privacy Policy</Text>
              </Text>
            </View>
          </View>

          {/* Button */}
          <Button
            onPress={() => Alert.alert('Sign Up', `Name: ${name}, Email: ${email}`)}
            style={{ marginTop: spacing[6] }}
            disabled={!agreed}
            fullWidth
          >
            Create Account
          </Button>

          {/* Footer */}
          <View style={[styles.loginFooter, { marginTop: spacing[6] }]}>
            <Text style={{ color: colors.foregroundMuted }}>Already have an account? </Text>
            <Pressable onPress={() => Alert.alert('Sign In')}>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Sign in</Text>
            </Pressable>
          </View>
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
  // Notification Item
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  // Content Card
  contentCardImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCardTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  contentCardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Feature Card
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  // Stats Card
  statsLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  statsTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsTrendValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsTrendLabel: {
    fontSize: 13,
  },
  // Hero Block
  heroBlock: {
    justifyContent: 'flex-end',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    fontSize: 16,
  },
  // Social Proof Bar
  socialProofBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStack: {
    width: 68,
    height: 28,
    position: 'relative',
  },
  stackedAvatar: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
  },
  socialProofText: {
    flex: 1,
    fontSize: 14,
  },
  // Search Header
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchTextInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  filterButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Onboarding Slide
  onboardingPreview: {
    padding: 24,
    alignItems: 'center',
  },
  onboardingIllustration: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  onboardingTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  onboardingDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  onboardingPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingDot: {
    height: 8,
  },
  // Media Item
  mediaLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mediaItem: {
    width: 100,
    height: 100,
    overflow: 'hidden',
  },
  mediaThumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  mediaCheckbox: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Feed Post Card
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedAuthor: {
    fontSize: 15,
    fontWeight: '600',
  },
  feedTime: {
    fontSize: 13,
  },
  feedContent: {
    fontSize: 15,
    lineHeight: 22,
  },
  feedImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  feedActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Login/Signup Block
  loginContainer: {
    width: '100%',
  },
  loginHeader: {
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  loginSubtitle: {
    fontSize: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginInput: {
    borderWidth: 1,
    fontSize: 16,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginDivider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  loginFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordHint: {
    fontSize: 12,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  termsText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
