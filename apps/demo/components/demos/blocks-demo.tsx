import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Image, TextInput, Pressable } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Rating } from '@/components/ui/rating';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

// Import blocks from registry
import { UserListItem } from '@/components/blocks/user-list-item';
import { ChatBubble } from '@/components/blocks/chat-bubble';
import { CommentItem } from '@/components/blocks/comment-item';
import { ProductCard } from '@/components/blocks/product-card';
import { CartItem } from '@/components/blocks/cart-item';
import { BannerBlock } from '@/components/blocks/banner-block';
import { OrderItem } from '@/components/blocks/order-item';
import { ReviewCard } from '@/components/blocks/review-card';
import { TaskItem } from '@/components/blocks/task-item';
import { EventCard } from '@/components/blocks/event-card';
import { ArticleCard } from '@/components/blocks/article-card';
import { PricingCard } from '@/components/blocks/pricing-card';
import { LoginBlock } from '@/components/blocks/login-block';
import { SignupBlock } from '@/components/blocks/signup-block';
import { SettingsListBlock } from '@/components/blocks/settings-list-block';
import { EmptyStateBlock } from '@/components/blocks/empty-state-block';
import { ErrorStateBlock } from '@/components/blocks/error-state-block';

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

      <Section title="User List Item">
        <UserListItemPreview />
      </Section>

      <Section title="Chat Bubble">
        <ChatBubblePreview />
      </Section>

      <Section title="Comment Item">
        <CommentItemPreview />
      </Section>

      <Section title="Product Card">
        <ProductCardPreview />
      </Section>

      <Section title="Cart Item">
        <CartItemPreview />
      </Section>

      <Section title="Banner Block">
        <BannerBlockPreview />
      </Section>

      <Section title="Order Item">
        <OrderItemPreview />
      </Section>

      <Section title="Review Card">
        <ReviewCardPreview />
      </Section>

      <Section title="Task Item">
        <TaskItemPreview />
      </Section>

      <Section title="Event Card">
        <EventCardPreview />
      </Section>

      <Section title="Article Card">
        <ArticleCardPreview />
      </Section>

      <Section title="Pricing Card">
        <PricingCardPreview />
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
  const { colors, spacing } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings List</CardTitle>
        <CardDescription>All item types: switch, navigation, destructive</CardDescription>
      </CardHeader>
      <CardContent style={{ paddingTop: spacing[4] }}>
        <SettingsListBlock
          groups={[
            {
              title: 'PREFERENCES',
              items: [
                {
                  type: 'switch',
                  label: 'Push Notifications',
                  description: 'Receive alerts about activity',
                  value: notifications,
                  onValueChange: setNotifications,
                },
                {
                  type: 'switch',
                  label: 'Dark Mode',
                  value: darkMode,
                  onValueChange: setDarkMode,
                },
              ],
            },
            {
              title: 'ACCOUNT',
              description: 'Manage your account settings',
              items: [
                {
                  type: 'navigation',
                  label: 'Email',
                  displayValue: 'john@example.com',
                  onPress: () => Alert.alert('Edit Email'),
                },
                {
                  type: 'navigation',
                  label: 'Change Password',
                  onPress: () => Alert.alert('Change Password'),
                },
                {
                  type: 'button',
                  label: 'Log Out',
                  variant: 'destructive',
                  onPress: () => Alert.alert('Logout'),
                },
              ],
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Empty State Block Preview
// ============================================================================

function EmptyStateBlockPreview() {
  const { colors, spacing } = useTheme();

  return (
    <View style={{ gap: spacing[4] }}>
      {/* Default variant */}
      <Card>
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>Full-size with icon and action</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyStateBlock
            icon={
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
                  stroke={colors.foregroundMuted}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            }
            title="No messages"
            description="You don't have any messages yet. Start a conversation!"
            actionText="New Message"
            onAction={() => Alert.alert('New Message')}
          />
        </CardContent>
      </Card>

      {/* Compact variant */}
      <Card>
        <CardHeader>
          <CardTitle>Compact</CardTitle>
          <CardDescription>Smaller size for inline states</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyStateBlock
            title="No results"
            description="Try adjusting your search"
            compact
          />
        </CardContent>
      </Card>
    </View>
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
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    Alert.alert('Retry Complete');
  };

  return (
    <View style={{ gap: spacing[4] }}>
      {/* With retry loading */}
      <Card>
        <CardHeader>
          <CardTitle>With Retry Loading</CardTitle>
          <CardDescription>Shows loading state during retry</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorStateBlock
            title="Something went wrong"
            description="We couldn't load your data. Please try again."
            errorCode="ERROR_NETWORK_TIMEOUT"
            onRetry={handleRetry}
            retryLoading={loading}
            onCancel={() => Alert.alert('Cancel')}
            cancelText="Go Back"
          />
        </CardContent>
      </Card>

      {/* Compact variant */}
      <Card>
        <CardHeader>
          <CardTitle>Compact</CardTitle>
          <CardDescription>Smaller size for inline errors</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorStateBlock
            title="Failed to load"
            description="Check your connection"
            compact
            onRetry={() => Alert.alert('Retry')}
          />
        </CardContent>
      </Card>
    </View>
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
  const { colors, spacing } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    Alert.alert('Login Success', `Email: ${data.email}`);
  };

  return (
    <View style={{ gap: spacing[4] }}>
      {/* Loading state demo */}
      <Card>
        <CardHeader>
          <CardTitle>Loading State</CardTitle>
          <CardDescription>Shows spinner during form submission</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginBlock
            onSubmit={handleSubmit}
            loading={loading}
            onForgotPassword={() => Alert.alert('Forgot Password')}
            onSignUp={() => Alert.alert('Sign Up')}
            showSocialLogin={true}
            socialProviders={['google', 'apple']}
          />
        </CardContent>
      </Card>
    </View>
  );
}

// ============================================================================
// Signup Block Preview
// ============================================================================

function SignupBlockPreview() {
  const { colors, spacing } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    Alert.alert('Signup Success', `Welcome ${data.name}!`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup Form</CardTitle>
        <CardDescription>Complete registration with validation</CardDescription>
      </CardHeader>
      <CardContent style={{ paddingTop: spacing[4] }}>
        <SignupBlock
          onSubmit={handleSubmit}
          loading={loading}
          onLogin={() => Alert.alert('Login')}
          onTermsPress={() => Alert.alert('Terms')}
          onPrivacyPress={() => Alert.alert('Privacy')}
        />
      </CardContent>
    </Card>
  );
}

// ============================================================================
// User List Item Preview
// ============================================================================

function UserListItemPreview() {
  const { colors, spacing } = useTheme();
  const [following, setFollowing] = useState(false);

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[4] }}>
        <View style={{ gap: spacing[3] }}>
          <UserListItem
            user={{
              name: 'Sarah Miller',
              username: '@sarahm',
              avatarUrl: 'https://i.pravatar.cc/100?img=5',
            }}
            verified
            actionLabel={following ? 'Following' : 'Follow'}
            actionVariant={following ? 'secondary' : 'default'}
            onAction={() => setFollowing(!following)}
            onPress={() => Alert.alert('Profile', 'Navigate to profile')}
          />
          <UserListItem
            user={{
              name: 'John Davis',
              username: '@johnd',
              avatarUrl: 'https://i.pravatar.cc/100?img=8',
              subtitle: 'Follows you',
            }}
            onPress={() => Alert.alert('Profile')}
          />
          <UserListItem
            user={{
              name: 'Emma Wilson',
              username: '@emmaw',
            }}
            status="online"
            onPress={() => Alert.alert('Profile')}
          />
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Chat Bubble Preview
// ============================================================================

function ChatBubblePreview() {
  const { colors, spacing } = useTheme();

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[4] }}>
        <View style={{ gap: spacing[2] }}>
          <ChatBubble
            message="Hey! How are you doing today?"
            time="10:30 AM"
            isOwn={false}
            user={{ name: 'Sarah', avatarUrl: 'https://i.pravatar.cc/100?img=5' }}
          />
          <ChatBubble
            message="I'm good, thanks! Just working on a new project."
            time="10:32 AM"
            isOwn={true}
            status="read"
          />
          <ChatBubble
            message="That sounds awesome! What kind of project is it?"
            time="10:33 AM"
            isOwn={false}
            user={{ name: 'Sarah', avatarUrl: 'https://i.pravatar.cc/100?img=5' }}
            isFirst={false}
            isLast={false}
          />
          <ChatBubble
            message="It's a mobile app using React Native. Really enjoying it so far! 🚀"
            time="10:35 AM"
            isOwn={true}
            status="delivered"
          />
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Comment Item Preview
// ============================================================================

function CommentItemPreview() {
  const { colors, spacing } = useTheme();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(12);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[4] }}>
        <View style={{ gap: spacing[4] }}>
          <CommentItem
            user={{
              name: 'Sarah Miller',
              avatarUrl: 'https://i.pravatar.cc/100?img=5',
            }}
            content="This is absolutely amazing! I love how clean the design is. Great work! 👏"
            time="2h ago"
            likes={likeCount}
            liked={liked}
            onLike={handleLike}
            onReply={() => Alert.alert('Reply')}
          />
          <CommentItem
            user={{
              name: 'John Davis',
              avatarUrl: 'https://i.pravatar.cc/100?img=8',
            }}
            content="Agreed! The attention to detail is impressive."
            time="1h ago"
            likes={5}
            isReply
            onLike={() => {}}
          />
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Product Card Preview
// ============================================================================

function ProductCardPreview() {
  const { colors, spacing } = useTheme();
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[4] }}>
        <View style={{ gap: spacing[3] }}>
          <ProductCard
            title="Wireless Headphones"
            price={149.99}
            image={{ uri: 'https://picsum.photos/200/200?random=10' }}
            rating={4.5}
            reviewCount={128}
            wishlisted={wishlisted}
            onPress={() => Alert.alert('Product Details')}
            onAddToCart={() => Alert.alert('Added to Cart')}
            onWishlist={() => setWishlisted(!wishlisted)}
          />
          <ProductCard
            title="Smart Watch Pro"
            price={299.99}
            originalPrice={349.99}
            image={{ uri: 'https://picsum.photos/200/200?random=11' }}
            rating={4.8}
            reviewCount={256}
            badge="Sale"
            onPress={() => Alert.alert('Product Details')}
            onAddToCart={() => Alert.alert('Added to Cart')}
          />
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Cart Item Preview
// ============================================================================

function CartItemPreview() {
  const { colors, spacing } = useTheme();
  const [quantity, setQuantity] = useState(2);

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[4] }}>
        <View style={{ gap: spacing[3] }}>
          <CartItem
            product={{
              name: 'Wireless Headphones',
              price: 149.99,
              image: { uri: 'https://picsum.photos/100/100?random=10' },
              variant: 'Black',
            }}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onRemove={() => Alert.alert('Remove', 'Remove item from cart?')}
          />
          <CartItem
            product={{
              name: 'Phone Case Premium',
              price: 29.99,
              image: { uri: 'https://picsum.photos/100/100?random=12' },
              variant: 'Clear',
            }}
            quantity={1}
            onQuantityChange={() => {}}
            onRemove={() => Alert.alert('Remove')}
          />
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Banner Block Preview
// ============================================================================

function BannerBlockPreview() {
  const { colors, spacing } = useTheme();
  const [showBanner, setShowBanner] = useState(true);

  return (
    <View style={{ gap: spacing[3] }}>
      {showBanner && (
        <BannerBlock
          title="Limited Time Offer!"
          subtitle="Get 20% off your first order with code WELCOME20"
          variant="solid"
          onAction={() => Alert.alert('Apply Code')}
          actionLabel="Apply Now"
          dismissible
          onDismiss={() => setShowBanner(false)}
        />
      )}
      <BannerBlock
        title="New Feature Available"
        subtitle="Check out our latest update with improved performance"
        variant="gradient"
        gradientColors={['#10b981', '#059669']}
        onAction={() => Alert.alert('Learn More')}
        actionLabel="Learn More"
      />
      <BannerBlock
        title="Maintenance Scheduled"
        subtitle="System will be down for maintenance on Sunday 2-4 AM"
        variant="outline"
      />
      {!showBanner && (
        <Button variant="outline" onPress={() => setShowBanner(true)}>
          Show Banner Again
        </Button>
      )}
    </View>
  );
}

// ============================================================================
// Order Item Preview
// ============================================================================

function OrderItemPreview() {
  const { colors, spacing } = useTheme();

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[4] }}>
        <View style={{ gap: spacing[3] }}>
          <OrderItem
            order={{
              id: 'ORD-12345',
              date: new Date().toISOString(),
              total: 299.99,
              status: 'shipped',
              items: [
                { name: 'Wireless Headphones', image: { uri: 'https://picsum.photos/100/100?random=10' } },
                { name: 'Phone Case', image: { uri: 'https://picsum.photos/100/100?random=12' } },
              ],
            }}
            onPress={() => Alert.alert('Order Details')}
            onTrack={() => Alert.alert('Track Order')}
          />
          <OrderItem
            order={{
              id: 'ORD-12344',
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              total: 149.99,
              status: 'delivered',
              items: [
                { name: 'Smart Watch', image: { uri: 'https://picsum.photos/100/100?random=11' } },
              ],
            }}
            onPress={() => Alert.alert('Order Details')}
            onReorder={() => Alert.alert('Reorder')}
            onReview={() => Alert.alert('Write Review')}
          />
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Review Card Preview
// ============================================================================

function ReviewCardPreview() {
  const { colors, spacing } = useTheme();
  const [helpful, setHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(24);

  const handleHelpful = () => {
    setHelpful(!helpful);
    setHelpfulCount(helpful ? helpfulCount - 1 : helpfulCount + 1);
  };

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[4] }}>
        <ReviewCard
          author={{
            name: 'Sarah Miller',
            avatar: { uri: 'https://i.pravatar.cc/100?img=5' },
            verified: true,
          }}
          rating={5}
          title="Absolutely love it!"
          content="This product exceeded my expectations. The quality is fantastic and it works perfectly. Highly recommend to anyone looking for a reliable option. Customer service was also excellent when I had questions."
          date={new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()}
          variant="Black / Large"
          helpfulCount={helpfulCount}
          isHelpful={helpful}
          onHelpful={handleHelpful}
          images={[
            { uri: 'https://picsum.photos/100/100?random=20' },
            { uri: 'https://picsum.photos/100/100?random=21' },
          ]}
        />
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Task Item Preview
// ============================================================================

function TaskItemPreview() {
  const { colors, spacing } = useTheme();
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Review pull request', completed: false, priority: 'high' as const },
    { id: '2', title: 'Update documentation', completed: true, priority: 'medium' as const },
    { id: '3', title: 'Schedule team meeting', completed: false, priority: 'low' as const },
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[4] }}>
        <View style={{ gap: spacing[2] }}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onPress={() => Alert.alert('Task Details', task.title)}
            />
          ))}
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Event Card Preview
// ============================================================================

function EventCardPreview() {
  const { colors, spacing } = useTheme();

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[4] }}>
        <View style={{ gap: spacing[3] }}>
          <EventCard
            event={{
              id: '1',
              title: 'Team Standup',
              startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
              endTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(),
              location: 'Zoom Meeting',
              color: colors.primary,
            }}
            onPress={() => Alert.alert('Event Details')}
          />
          <EventCard
            event={{
              id: '2',
              title: 'Product Launch Party',
              startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              endTime: new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString(),
              location: 'Main Office',
              color: colors.success,
              attendees: [
                { name: 'John', avatar: { uri: 'https://i.pravatar.cc/100?img=8' } },
                { name: 'Sarah', avatar: { uri: 'https://i.pravatar.cc/100?img=5' } },
                { name: 'Mike', avatar: { uri: 'https://i.pravatar.cc/100?img=12' } },
              ],
            }}
            onPress={() => Alert.alert('Event Details')}
          />
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Article Card Preview
// ============================================================================

function ArticleCardPreview() {
  const { colors, spacing } = useTheme();

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[4] }}>
        <View style={{ gap: spacing[3] }}>
          <ArticleCard
            article={{
              id: '1',
              title: 'Getting Started with React Native',
              excerpt: 'Learn the basics of building mobile apps with React Native, from setup to deployment.',
              image: { uri: 'https://picsum.photos/400/200?random=30' },
              author: {
                name: 'Sarah Miller',
                avatar: { uri: 'https://i.pravatar.cc/100?img=5' },
              },
              publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              readTime: 8,
              category: 'Tutorial',
            }}
            onPress={() => Alert.alert('Read Article')}
          />
          <ArticleCard
            article={{
              id: '2',
              title: 'Design Systems for Mobile Apps',
              excerpt: 'How to create and maintain a consistent design system across your mobile applications.',
              author: {
                name: 'John Davis',
                avatar: { uri: 'https://i.pravatar.cc/100?img=8' },
              },
              publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              readTime: 12,
              category: 'Design',
            }}
            onPress={() => Alert.alert('Read Article')}
            variant="horizontal"
          />
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Pricing Card Preview
// ============================================================================

function PricingCardPreview() {
  const { colors, spacing } = useTheme();

  return (
    <View style={{ gap: spacing[3] }}>
      <PricingCard
        plan={{
          id: 'free',
          name: 'Free',
          price: 0,
          interval: 'month',
          description: 'Perfect for getting started',
          features: [
            { text: 'Up to 3 projects', included: true },
            { text: 'Basic analytics', included: true },
            { text: 'Community support', included: true },
            { text: 'Custom domain', included: false },
            { text: 'Priority support', included: false },
          ],
        }}
        onSelect={() => Alert.alert('Selected Free Plan')}
      />
      <PricingCard
        plan={{
          id: 'pro',
          name: 'Pro',
          price: 19,
          interval: 'month',
          description: 'Best for professionals',
          features: [
            { text: 'Unlimited projects', included: true },
            { text: 'Advanced analytics', included: true },
            { text: 'Priority support', included: true },
            { text: 'Custom domain', included: true },
            { text: 'Team collaboration', included: true },
          ],
        }}
        popular
        onSelect={() => Alert.alert('Selected Pro Plan')}
      />
    </View>
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
});
