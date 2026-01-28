import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Svg, { Circle, Path } from 'react-native-svg';

// Import blocks from registry
import { UserListItemBlock as UserListItem } from '@/components/blocks/user-list-item-block';
import { ChatBubbleBlock as ChatBubble } from '@/components/blocks/chat-bubble-block';
import { CommentItemBlock as CommentItem } from '@/components/blocks/comment-item-block';
import { ProductCardBlock as ProductCard } from '@/components/blocks/product-card-block';
import { CartItemBlock as CartItem } from '@/components/blocks/cart-item-block';
import { BannerBlock } from '@/components/blocks/banner-block';
import { OrderItemBlock as OrderItem } from '@/components/blocks/order-item-block';
import { ReviewCardBlock as ReviewCard } from '@/components/blocks/review-card-block';
import { TaskItemBlock as TaskItem } from '@/components/blocks/task-item-block';
import { EventCardBlock as EventCard } from '@/components/blocks/event-card-block';
import { ArticleCardBlock as ArticleCard } from '@/components/blocks/article-card-block';
import { PricingCardBlock as PricingCard } from '@/components/blocks/pricing-card-block';
import { LoginBlock } from '@/components/blocks/login-block';
import { SignupBlock } from '@/components/blocks/signup-block';
import { SettingsListBlock } from '@/components/blocks/settings-list-block';
import { EmptyStateBlock } from '@/components/blocks/empty-state-block';
import { ErrorStateBlock } from '@/components/blocks/error-state-block';
import { ProfileBlock } from '@/components/blocks/profile-block';
import { FeedPostCardBlock } from '@/components/blocks/feed-post-card-block';
// Phase 11 e-commerce and info blocks
import { HeroBlock } from '@/components/blocks/hero-block';
import { StatsCardBlock } from '@/components/blocks/stats-card-block';
import { FeatureCardBlock } from '@/components/blocks/feature-card-block';
import { ContentCardBlock } from '@/components/blocks/content-card-block';
import { OnboardingSlideBlock } from '@/components/blocks/onboarding-slide-block';
import { SocialProofBarBlock } from '@/components/blocks/social-proof-bar-block';
import { NotificationItemBlock } from '@/components/blocks/notification-item-block';
import { MediaItemBlock } from '@/components/blocks/media-item-block';
import { SearchHeaderBlock } from '@/components/blocks/search-header-block';

// ============================================================================
// Demo Component
// ============================================================================

export function BlocksDemo() {
  const { colors, spacing, fontSize, fontWeight } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={{ color: colors.foregroundMuted, marginBottom: spacing[6], fontSize: fontSize.sm, lineHeight: 20 }}>
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
        <ContentCardBlockPreview />
      </Section>

      <Section title="Feature Card">
        <FeatureCardBlockPreview />
      </Section>

      <Section title="Stats Card">
        <StatsCardBlockPreview />
      </Section>

      <Section title="Hero Block">
        <HeroBlockPreview />
      </Section>

      <Section title="Social Proof Bar">
        <SocialProofBarBlockPreview />
      </Section>

      <Section title="Search Header">
        <SearchHeaderBlockPreview />
      </Section>

      <Section title="Onboarding Slide">
        <OnboardingSlideBlockPreview />
      </Section>

      <Section title="Media Item">
        <MediaItemPreview />
      </Section>

      <Section title="Feed Post Card">
        <FeedPostCardBlockPreview />
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
  const { spacing } = useTheme();

  return (
    <Card>
      <CardContent style={{ paddingTop: spacing[6] }}>
        <ProfileBlock
          avatarUrl="https://i.pravatar.cc/150?img=68"
          name="John Doe"
          subtitle="@johndoe"
          bio="Software developer passionate about mobile apps and great UX."
          stats={[
            { label: 'Posts', value: '128' },
            { label: 'Followers', value: '1.2K' },
            { label: 'Following', value: '456' },
          ]}
          primaryButtonText="Edit Profile"
          onPrimaryAction={() => Alert.alert('Edit Profile')}
          secondaryButtonText="Settings"
          onSecondaryAction={() => Alert.alert('Settings')}
        />
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
  const { colors, spacing } = useTheme();

  return (
    <Card style={{ overflow: 'hidden' }}>
      <CardHeader>
        <CardTitle>Notification Types</CardTitle>
        <CardDescription>Unread states, with/without avatar, icon support</CardDescription>
      </CardHeader>
      <View>
        {/* Unread with avatar */}
        <NotificationItemBlock
          avatarUrl="https://i.pravatar.cc/100?img=1"
          title="Sarah Miller"
          message="liked your post"
          time="2m ago"
          unread
          onPress={() => Alert.alert('Notification', 'Navigate to post')}
        />
        <Separator style={{ marginLeft: 72 }} />

        {/* Unread with avatar - different action */}
        <NotificationItemBlock
          avatarUrl="https://i.pravatar.cc/100?img=2"
          title="Mike Johnson"
          message="started following you"
          time="1h ago"
          unread
          onPress={() => Alert.alert('Notification', 'Navigate to profile')}
        />
        <Separator style={{ marginLeft: 72 }} />

        {/* Read state */}
        <NotificationItemBlock
          avatarUrl="https://i.pravatar.cc/100?img=3"
          title="Emma Wilson"
          message="commented on your post"
          time="3h ago"
          unread={false}
          onPress={() => Alert.alert('Notification', 'Navigate to comments')}
        />
        <Separator style={{ marginLeft: 72 }} />

        {/* System notification without avatar - uses icon fallback */}
        <NotificationItemBlock
          title="System"
          message="Your order has been shipped!"
          time="5h ago"
          unread={false}
          icon={
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M5 8h14M5 8a2 2 0 01-2-2V4a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" stroke={colors.foregroundMuted} strokeWidth="2" strokeLinecap="round" />
            </Svg>
          }
          onPress={() => Alert.alert('Notification', 'Track order')}
        />
      </View>
    </Card>
  );
}

// ============================================================================
// Content Card Preview
// ============================================================================

function ContentCardPreview() {
  const { spacing } = useTheme();

  return (
    <View style={{ gap: spacing[4] }}>
      {/* Default with action button */}
      <ContentCardBlock
        imageUrl="https://picsum.photos/400/225?random=1"
        title="Discover Amazing Places"
        subtitle="Explore the world's most beautiful destinations with our curated travel guides."
        actionText="Explore Now"
        onAction={() => Alert.alert('Action', 'Explore pressed')}
      />

      {/* Tappable card without action button */}
      <ContentCardBlock
        imageUrl="https://picsum.photos/400/300?random=2"
        title="Quick Article"
        subtitle="A brief overview of the latest trends in mobile app development."
        aspectRatio={4 / 3}
        onPress={() => Alert.alert('Press', 'Card pressed')}
      />

      {/* Wide aspect ratio */}
      <ContentCardBlock
        imageUrl="https://picsum.photos/400/180?random=3"
        title="Panoramic View"
        subtitle="Showcasing the beautiful landscape."
        aspectRatio={21 / 9}
        onPress={() => Alert.alert('Press', 'Wide card pressed')}
      />
    </View>
  );
}

// ============================================================================
// Feature Card Preview
// ============================================================================

function FeatureCardPreview() {
  const { colors, spacing } = useTheme();

  // Icon components for feature cards
  const ShieldIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2}>
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );

  const ZapIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2}>
      <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </Svg>
  );

  const PaletteIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2}>
      <Circle cx="12" cy="12" r="10" />
      <Circle cx="12" cy="8" r="2" fill={colors.primary} />
      <Circle cx="8" cy="14" r="2" fill={colors.primary} />
      <Circle cx="16" cy="14" r="2" fill={colors.primary} />
    </Svg>
  );

  return (
    <View style={{ gap: spacing[4] }}>
      {/* Vertical layout (default) */}
      <Card>
        <CardHeader>
          <CardTitle>Vertical Layout</CardTitle>
          <CardDescription>Icon centered above text</CardDescription>
        </CardHeader>
        <CardContent>
          <View style={{ gap: spacing[3] }}>
            <FeatureCardBlock
              icon={<ShieldIcon />}
              title="Secure Payments"
              description="Your data is encrypted with bank-level security."
              onPress={() => Alert.alert('Feature', 'Secure Payments')}
            />
          </View>
        </CardContent>
      </Card>

      {/* Horizontal layout */}
      <Card>
        <CardHeader>
          <CardTitle>Horizontal Layout</CardTitle>
          <CardDescription>Icon on the left, text on the right</CardDescription>
        </CardHeader>
        <CardContent>
          <View style={{ gap: spacing[3] }}>
            <FeatureCardBlock
              icon={<ZapIcon />}
              title="Lightning Fast"
              description="Optimized for speed and performance."
              horizontal
              onPress={() => Alert.alert('Feature', 'Lightning Fast')}
            />
            <FeatureCardBlock
              icon={<PaletteIcon />}
              title="Beautiful Design"
              description="Stunning UI that users love."
              horizontal
              onPress={() => Alert.alert('Feature', 'Beautiful Design')}
            />
          </View>
        </CardContent>
      </Card>
    </View>
  );
}

// ============================================================================
// Stats Card Preview
// ============================================================================

function StatsCardPreview() {
  const { colors, spacing } = useTheme();

  // Icon component for stats
  const DollarIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.success} strokeWidth={2}>
      <Path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </Svg>
  );

  const UsersIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2}>
      <Path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </Svg>
  );

  return (
    <View style={{ gap: spacing[4] }}>
      {/* Grid layout with two cards */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Stats</CardTitle>
          <CardDescription>Cards with trend indicators and icons</CardDescription>
        </CardHeader>
        <CardContent>
          <View style={{ flexDirection: 'row', gap: spacing[3] }}>
            <View style={{ flex: 1 }}>
              <StatsCardBlock
                value="$12,450"
                label="Revenue"
                trend={12.5}
                trendLabel="vs last month"
                icon={<DollarIcon />}
              />
            </View>
            <View style={{ flex: 1 }}>
              <StatsCardBlock
                value="1,234"
                label="Users"
                trend={-3.2}
                trendLabel="vs last week"
                icon={<UsersIcon />}
              />
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Single full-width card with interaction */}
      <StatsCardBlock
        value="89%"
        label="Satisfaction Rate"
        trend={5.0}
        trendLabel="vs previous quarter"
        onPress={() => Alert.alert('Stats', 'View satisfaction details')}
      />

      {/* No trend (static stat) */}
      <StatsCardBlock
        value="24/7"
        label="Support Available"
        onPress={() => Alert.alert('Stats', 'Contact support')}
      />
    </View>
  );
}

// ============================================================================
// Hero Block Preview
// ============================================================================

function HeroBlockPreview() {
  const { spacing } = useTheme();

  return (
    <View style={{ gap: spacing[4], marginHorizontal: -16 }}>
      {/* Purple mesh gradient */}
      <HeroBlock
        background="mesh"
        meshPreset="purple"
        title="Welcome to the App"
        subtitle="Discover amazing features and connect with others"
        ctaText="Get Started"
        onCtaPress={() => Alert.alert('CTA', 'Get Started pressed')}
        height={280}
      />

      {/* Sunset mesh with secondary button */}
      <HeroBlock
        background="mesh"
        meshPreset="sunset"
        title="Summer Collection"
        subtitle="Explore our latest arrivals with exclusive offers"
        ctaText="Shop Now"
        secondaryText="Learn More"
        onCtaPress={() => Alert.alert('CTA', 'Shop Now pressed')}
        onSecondaryPress={() => Alert.alert('Secondary', 'Learn More pressed')}
        height={280}
      />

      {/* Left-aligned with gradient background */}
      <HeroBlock
        background="gradient"
        title="Premium Features"
        subtitle="Unlock the full potential with our premium subscription"
        ctaText="Upgrade Now"
        onCtaPress={() => Alert.alert('CTA', 'Upgrade pressed')}
        textAlign="left"
        height={240}
      />

      {/* Ocean mesh preset */}
      <HeroBlock
        background="mesh"
        meshPreset="ocean"
        title="Dive Into Adventure"
        subtitle="Explore new horizons and discover possibilities"
        ctaText="Start Exploring"
        onCtaPress={() => Alert.alert('CTA', 'Explore pressed')}
        height={260}
      />
    </View>
  );
}

// ============================================================================
// Social Proof Bar Preview
// ============================================================================

function SocialProofBarPreview() {
  const { spacing } = useTheme();

  return (
    <View style={{ gap: spacing[4] }}>
      {/* Default size with press action */}
      <Card>
        <CardHeader>
          <CardTitle>Default Size</CardTitle>
          <CardDescription>Small avatars with engagement text</CardDescription>
        </CardHeader>
        <CardContent>
          <SocialProofBarBlock
            avatars={[
              'https://i.pravatar.cc/100?img=10',
              'https://i.pravatar.cc/100?img=11',
              'https://i.pravatar.cc/100?img=12',
            ]}
            text="Sarah, Mike, and 42 others liked this"
            onPress={() => Alert.alert('Social Proof', 'View all likes')}
          />
        </CardContent>
      </Card>

      {/* Medium avatar size */}
      <Card>
        <CardHeader>
          <CardTitle>Medium Avatars</CardTitle>
          <CardDescription>Larger avatar stack for prominent display</CardDescription>
        </CardHeader>
        <CardContent>
          <SocialProofBarBlock
            avatars={[
              'https://i.pravatar.cc/100?img=4',
              'https://i.pravatar.cc/100?img=5',
              'https://i.pravatar.cc/100?img=6',
              'https://i.pravatar.cc/100?img=7',
            ]}
            text="Join 1,000+ happy customers"
            avatarSize="md"
            maxAvatars={4}
            onPress={() => Alert.alert('Social Proof', 'View testimonials')}
          />
        </CardContent>
      </Card>

      {/* Extra small for compact areas */}
      <Card>
        <CardHeader>
          <CardTitle>Compact (XS Avatars)</CardTitle>
          <CardDescription>Smaller avatars for tight spaces</CardDescription>
        </CardHeader>
        <CardContent>
          <SocialProofBarBlock
            avatars={[
              'https://i.pravatar.cc/100?img=15',
              'https://i.pravatar.cc/100?img=16',
            ]}
            text="Alex and Emma are using this"
            avatarSize="xs"
          />
        </CardContent>
      </Card>
    </View>
  );
}

// ============================================================================
// Search Header Preview
// ============================================================================

function SearchHeaderPreview() {
  const { spacing } = useTheme();
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (query: string) => {
    setSearchValue(query);
  };

  const handleSubmit = async (query: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    Alert.alert('Search', `Searched for: ${query}`);
  };

  return (
    <View style={{ gap: spacing[4] }}>
      {/* Full featured */}
      <Card>
        <CardHeader>
          <CardTitle>Full Featured</CardTitle>
          <CardDescription>Search input, filter button with badge, avatar</CardDescription>
        </CardHeader>
        <CardContent>
          <SearchHeaderBlock
            placeholder="Search products..."
            value={searchValue}
            onSearch={handleSearch}
            onSubmit={handleSubmit}
            loading={loading}
            onFilterPress={() => Alert.alert('Filters', 'Open filter panel')}
            filterCount={3}
            avatarUrl="https://i.pravatar.cc/100?img=20"
            onAvatarPress={() => Alert.alert('Profile', 'Open profile')}
          />
        </CardContent>
      </Card>

      {/* Without avatar */}
      <Card>
        <CardHeader>
          <CardTitle>Without Avatar</CardTitle>
          <CardDescription>Just search and filter</CardDescription>
        </CardHeader>
        <CardContent>
          <SearchHeaderBlock
            placeholder="Search articles..."
            onSearch={(q) => console.log('Search:', q)}
            onSubmit={(q) => Alert.alert('Search', q)}
            onFilterPress={() => Alert.alert('Filters')}
            showAvatar={false}
          />
        </CardContent>
      </Card>

      {/* Search only */}
      <Card>
        <CardHeader>
          <CardTitle>Search Only</CardTitle>
          <CardDescription>Minimal variant without filter and avatar</CardDescription>
        </CardHeader>
        <CardContent>
          <SearchHeaderBlock
            placeholder="Search..."
            onSearch={(q) => console.log('Search:', q)}
            onSubmit={(q) => Alert.alert('Search', q)}
            showFilter={false}
            showAvatar={false}
          />
        </CardContent>
      </Card>
    </View>
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
      description: 'Discover amazing features that will change how you work and connect with others.',
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

  // Custom illustration component
  const CustomIllustration = () => (
    <View
      style={{
        width: 160,
        height: 160,
        backgroundColor: colors.primaryMuted,
        borderRadius: radius.xl,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="8" r="4" fill={colors.primary} />
        <Path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill={colors.primary} />
      </Svg>
    </View>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactive Onboarding</CardTitle>
        <CardDescription>Try navigating through the slides</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Constrained height preview of the actual OnboardingSlide */}
        <View style={{ height: 480, marginHorizontal: -16, marginBottom: -16 }}>
          <OnboardingSlideBlock
            illustration={<CustomIllustration />}
            title={current.title}
            description={current.description}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrimary={() => {
              if (currentStep === totalSteps - 1) {
                Alert.alert('Complete', 'Onboarding finished!');
                setCurrentStep(0);
              } else {
                setCurrentStep(currentStep + 1);
              }
            }}
            onSecondary={() => {
              Alert.alert('Skip', 'Skipped onboarding');
              setCurrentStep(0);
            }}
          />
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Media Item Preview
// ============================================================================

function MediaItemPreview() {
  const { colors, spacing } = useTheme();
  const [selectedIds, setSelectedIds] = useState<number[]>([1]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <View style={{ gap: spacing[4] }}>
      {/* Selectable media grid */}
      <Card>
        <CardHeader>
          <CardTitle>Selectable Media Grid</CardTitle>
          <CardDescription>Tap to select - {selectedIds.length} selected</CardDescription>
        </CardHeader>
        <CardContent>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
            <MediaItemBlock
              type="image"
              source={{ uri: 'https://picsum.photos/200/200?random=1' }}
              selectable
              selected={selectedIds.includes(0)}
              onSelect={() => toggleSelect(0)}
            />
            <MediaItemBlock
              type="image"
              source={{ uri: 'https://picsum.photos/200/200?random=2' }}
              selectable
              selected={selectedIds.includes(1)}
              onSelect={() => toggleSelect(1)}
            />
            <MediaItemBlock
              type="video"
              source={{ uri: 'https://picsum.photos/200/200?random=3' }}
              duration={45}
              selectable
              selected={selectedIds.includes(2)}
              onSelect={() => toggleSelect(2)}
            />
            <MediaItemBlock
              type="image"
              source={{ uri: 'https://picsum.photos/200/200?random=4' }}
              selectable
              selected={selectedIds.includes(3)}
              onSelect={() => toggleSelect(3)}
            />
          </View>
        </CardContent>
      </Card>

      {/* Media types: image, video, file */}
      <Card>
        <CardHeader>
          <CardTitle>Media Types</CardTitle>
          <CardDescription>Image, video with duration, file with type badge</CardDescription>
        </CardHeader>
        <CardContent>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
            {/* Image - tap to view */}
            <MediaItemBlock
              type="image"
              source={{ uri: 'https://picsum.photos/200/200?random=10' }}
              onPress={() => Alert.alert('Image', 'Open image viewer')}
            />

            {/* Video with duration badge and play icon */}
            <MediaItemBlock
              type="video"
              source={{ uri: 'https://picsum.photos/200/200?random=11' }}
              duration={125}
              onPress={() => Alert.alert('Video', 'Play video')}
            />

            {/* File with type badge */}
            <MediaItemBlock
              type="file"
              source={{ uri: '' }}
              fileType="pdf"
              onPress={() => Alert.alert('File', 'Open PDF document')}
            />

            {/* Another file type */}
            <MediaItemBlock
              type="file"
              source={{ uri: '' }}
              fileType="doc"
              onPress={() => Alert.alert('File', 'Open Word document')}
            />
          </View>
        </CardContent>
      </Card>

      {/* Different sizes */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Sizes</CardTitle>
          <CardDescription>Adjustable dimensions for different layouts</CardDescription>
        </CardHeader>
        <CardContent>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing[2] }}>
            <MediaItemBlock
              type="image"
              source={{ uri: 'https://picsum.photos/80/80?random=20' }}
              size={60}
              onPress={() => Alert.alert('Small', '60px')}
            />
            <MediaItemBlock
              type="image"
              source={{ uri: 'https://picsum.photos/100/100?random=21' }}
              size={80}
              onPress={() => Alert.alert('Medium', '80px')}
            />
            <MediaItemBlock
              type="image"
              source={{ uri: 'https://picsum.photos/120/120?random=22' }}
              size={100}
              onPress={() => Alert.alert('Default', '100px')}
            />
            <MediaItemBlock
              type="video"
              source={{ uri: 'https://picsum.photos/150/150?random=23' }}
              size={120}
              duration={67}
              onPress={() => Alert.alert('Large', '120px')}
            />
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
// ============================================================================
// Feed Post Card Preview
// ============================================================================

function FeedPostCardPreview() {
  const { colors, spacing } = useTheme();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(42);
  const [commentCount, setCommentCount] = useState(12);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  const handleLike = async () => {
    setLikeLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    setLikeLoading(false);
  };

  const handleComment = async () => {
    setCommentLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setCommentLoading(false);
    Alert.alert('Comments', 'Opening comments...');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loading States</CardTitle>
        <CardDescription>Try interacting to see loading indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <FeedPostCardBlock
          user={{
            name: 'John Doe',
            avatarUrl: 'https://i.pravatar.cc/100?img=12',
          }}
          content="Just shipped a new feature! 🚀 Really excited about how this turned out. Let me know what you think!"
          time="2 hours ago"
          hasImage={true}
          likes={likeCount}
          comments={commentCount}
          liked={liked}
          likeLoading={likeLoading}
          commentLoading={commentLoading}
          onLike={handleLike}
          onComment={handleComment}
          onShare={() => Alert.alert('Share')}
          showSeparator={false}
        />
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
  const [actionLoading, setActionLoading] = useState(false);

  const handleFollow = async () => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setFollowing(!following);
    setActionLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Action Loading State</CardTitle>
        <CardDescription>Try following the first user to see loading indicator</CardDescription>
      </CardHeader>
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
            actionLoading={actionLoading}
            onAction={handleFollow}
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
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async () => {
    setLikeLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    setLikeLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loading & Disabled States</CardTitle>
        <CardDescription>Try liking the first comment to see loading indicator</CardDescription>
      </CardHeader>
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
            likeLoading={likeLoading}
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
            disabled
            onLike={() => {}}
            onReply={() => {}}
          />
        </View>
      </CardContent>
    </Card>
  );
}
function ProductCardPreview() {
  const { colors, spacing } = useTheme();
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const handleAddToCart = async (productId: string) => {
    setAddingToCart(productId);
    await new Promise((r) => setTimeout(r, 1000));
    setAddingToCart(null);
    Alert.alert('Added to Cart');
  };

  return (
    <View style={{ gap: spacing[4] }}>
      <Card>
        <CardHeader>
          <CardTitle>Loading State</CardTitle>
          <CardDescription>Shows loading during "Add to Cart"</CardDescription>
        </CardHeader>
        <CardContent style={{ paddingTop: spacing[4] }}>
          <ProductCard
            title="Wireless Headphones"
            price={149.99}
            image={{ uri: 'https://picsum.photos/200/200?random=10' }}
            rating={4.5}
            reviewCount={128}
            wishlisted={wishlisted}
            onPress={() => Alert.alert('Product Details')}
            onAddToCart={() => handleAddToCart('1')}
            onWishlist={() => setWishlisted(!wishlisted)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sale & Disabled States</CardTitle>
          <CardDescription>Shows discount badge and out of stock</CardDescription>
        </CardHeader>
        <CardContent style={{ paddingTop: spacing[4] }}>
          <View style={{ gap: spacing[3] }}>
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
            <ProductCard
              title="Gaming Keyboard"
              price={129.99}
              image={{ uri: 'https://picsum.photos/200/200?random=12' }}
              rating={4.3}
              reviewCount={89}
              badge="Sold Out"
              badgeVariant="secondary"
              outOfStock
              onPress={() => Alert.alert('Product Details')}
              onAddToCart={() => Alert.alert('Notify Me')}
            />
          </View>
        </CardContent>
      </Card>
    </View>
  );
}

// ============================================================================
// Cart Item Preview
// ============================================================================

function CartItemPreview() {
  const { colors, spacing } = useTheme();
  const [quantity, setQuantity] = useState(2);
  const [quantityLoading, setQuantityLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    setQuantityLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setQuantity(newQuantity);
    setQuantityLoading(false);
  };

  const handleRemove = async () => {
    setRemoveLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setRemoveLoading(false);
    Alert.alert('Remove', 'Remove item from cart?');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Swipe & Loading States</CardTitle>
        <CardDescription>Swipe left to see actions. Try changing quantity.</CardDescription>
      </CardHeader>
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
            quantityLoading={quantityLoading}
            removeLoading={removeLoading}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
            showSaveForLater
            onSaveForLater={() => Alert.alert('Saved for later')}
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
    <View style={{ gap: spacing[4] }}>
      <Card>
        <CardHeader>
          <CardTitle>With Images & Helpful Button</CardTitle>
          <CardDescription>Full review with photos and interaction</CardDescription>
        </CardHeader>
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
              { uri: 'https://picsum.photos/100/100?random=22' },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Simple Review</CardTitle>
          <CardDescription>Rating and text without images</CardDescription>
        </CardHeader>
        <CardContent style={{ paddingTop: spacing[4] }}>
          <ReviewCard
            author={{
              name: 'John Davis',
              avatar: { uri: 'https://i.pravatar.cc/100?img=8' },
              verified: false,
            }}
            rating={4}
            title="Great value for money"
            content="Does exactly what it promises. Setup was easy and it's been working well for the past month."
            date={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}
            variant="White / Medium"
            helpfulCount={12}
            onHelpful={() => Alert.alert('Marked as helpful')}
          />
        </CardContent>
      </Card>
    </View>
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
    <View style={{ gap: spacing[4] }}>
      <Card>
        <CardHeader>
          <CardTitle>Basic Event</CardTitle>
          <CardDescription>Simple event with time and location</CardDescription>
        </CardHeader>
        <CardContent style={{ paddingTop: spacing[4] }}>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>With Attendees</CardTitle>
          <CardDescription>Shows color indicator and avatar stack</CardDescription>
        </CardHeader>
        <CardContent style={{ paddingTop: spacing[4] }}>
          <EventCard
            event={{
              id: '2',
              title: 'Product Launch Party',
              description: 'Celebrate our new product release with the team',
              startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              endTime: new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString(),
              location: 'Main Office',
              color: colors.success,
              attendees: [
                { name: 'John', avatar: { uri: 'https://i.pravatar.cc/100?img=8' } },
                { name: 'Sarah', avatar: { uri: 'https://i.pravatar.cc/100?img=5' } },
                { name: 'Mike', avatar: { uri: 'https://i.pravatar.cc/100?img=12' } },
                { name: 'Emma', avatar: { uri: 'https://i.pravatar.cc/100?img=15' } },
                { name: 'Alex', avatar: { uri: 'https://i.pravatar.cc/100?img=20' } },
              ],
            }}
            onPress={() => Alert.alert('Event Details')}
          />
        </CardContent>
      </Card>
    </View>
  );
}

// ============================================================================
// Article Card Preview
// ============================================================================

function ArticleCardPreview() {
  const { colors, spacing, fontSize, fontWeight } = useTheme();

  const articleData = {
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
  };

  return (
    <View style={{ gap: spacing[4] }}>
      {/* Default variant */}
      <View>
        <Text style={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.foregroundMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing[3] }}>DEFAULT</Text>
        <ArticleCard
          article={articleData}
          onPress={() => Alert.alert('Read Article')}
        />
      </View>

      {/* Horizontal variant */}
      <View>
        <Text style={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.foregroundMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing[3] }}>HORIZONTAL</Text>
        <ArticleCard
          article={{
            ...articleData,
            id: '2',
            title: 'Design Systems for Mobile Apps',
            category: 'Design',
          }}
          variant="horizontal"
          onPress={() => Alert.alert('Read Article')}
        />
      </View>

      {/* Featured variant */}
      <View>
        <Text style={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.foregroundMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing[3] }}>FEATURED</Text>
        <ArticleCard
          article={{
            ...articleData,
            id: '3',
            title: 'Building Scalable Mobile Architecture',
            excerpt: 'Best practices for creating maintainable and scalable mobile app architectures.',
            category: 'Architecture',
          }}
          variant="featured"
          onPress={() => Alert.alert('Read Article')}
        />
      </View>
    </View>
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
  const { colors, fontSize, fontWeight } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.foregroundMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{title}</Text>
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
  section: {
    gap: 16,
  },
  sectionContent: {
    gap: 8,
  },
});
