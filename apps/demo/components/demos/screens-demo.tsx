import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Alert, ScrollView, Dimensions, TextInput, Keyboard } from 'react-native';
import Animated, { useAnimatedStyle, interpolate, Extrapolation, SharedValue, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@metacells/mcellui-core';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { List, ListItem } from '@/components/ui/list';
import { IconButton } from '@/components/ui/icon-button';
import { Carousel, CarouselRenderItemInfo, CarouselRef } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Chip } from '@/components/ui/chip';
import { SwipeableRow } from '@/components/ui/swipeable-row';
import { SearchInput } from '@/components/ui/search-input';

// Import blocks
import { NotificationItem } from '@/components/blocks/notification-item';
import { FeedPostCard } from '@/components/blocks/feed-post-card';

// ============================================================================
// Demo Component
// ============================================================================

export function ScreensDemo() {
  const { colors, spacing } = useTheme();
  const [activeScreen, setActiveScreen] = useState<string | null>(null);

  const screens = [
    { key: 'login', title: 'Login Screen', description: 'Email/password with social login' },
    { key: 'signup', title: 'Sign Up Screen', description: 'Registration with terms checkbox' },
    { key: 'onboarding', title: 'Onboarding Screen', description: 'Multi-slide welcome flow' },
    { key: 'profile', title: 'Profile Screen', description: 'User profile with stats and tabs' },
    { key: 'settings', title: 'Settings Screen', description: 'Grouped settings with toggles' },
    { key: 'search', title: 'Search Screen', description: 'Search with filters and results' },
    { key: 'chat', title: 'Chat Screen', description: 'Messaging with bubbles and input' },
    { key: 'notifications', title: 'Notifications Screen', description: 'Notification list with actions' },
    { key: 'feed', title: 'Feed/Timeline', description: 'Social media style feed' },
    { key: 'otp', title: 'OTP Verification', description: 'Code input with resend timer' },
    // Phase 5-7 Screens
    { key: 'product-detail', title: 'Product Detail', description: 'E-commerce product page' },
    { key: 'cart', title: 'Cart Screen', description: 'Shopping cart with items' },
    { key: 'followers', title: 'Followers Screen', description: 'Follower/following list with tabs' },
    { key: 'comments', title: 'Comments Screen', description: 'Post comments with replies' },
    { key: 'checkout', title: 'Checkout Screen', description: 'Multi-step checkout flow' },
    { key: 'order-history', title: 'Order History', description: 'Past orders with filters' },
    { key: 'home', title: 'Home Screen', description: 'Dashboard with hero and stats' },
    { key: 'account', title: 'Account Screen', description: 'User account management' },
    { key: 'help', title: 'Help & Support', description: 'FAQ and contact options' },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.intro, { color: colors.foregroundMuted, marginBottom: spacing[6] }]}>
        Full-page screen templates ready to customize. Tap a screen to preview it.
      </Text>

      <View style={{ gap: spacing[3] }}>
        {screens.map((screen) => (
          <Pressable
            key={screen.key}
            onPress={() => setActiveScreen(screen.key)}
            style={({ pressed }) => [
              styles.screenCard,
              {
                backgroundColor: colors.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                padding: spacing[4],
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text style={[styles.screenTitle, { color: colors.foreground }]}>
              {screen.title}
            </Text>
            <Text style={[styles.screenDescription, { color: colors.foregroundMuted, marginTop: spacing[1] }]}>
              {screen.description}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Screen Modals */}
      <Modal visible={activeScreen === 'login'} animationType="slide">
        <LoginScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>

      <Modal visible={activeScreen === 'signup'} animationType="slide">
        <SignUpScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>

      <Modal visible={activeScreen === 'onboarding'} animationType="slide">
        <OnboardingScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>

      <Modal visible={activeScreen === 'profile'} animationType="slide">
        <ProfileScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>

      <Modal visible={activeScreen === 'settings'} animationType="slide">
        <SettingsScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>

      <Modal visible={activeScreen === 'search'} animationType="slide">
        <SearchScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>

      <Modal visible={activeScreen === 'chat'} animationType="slide">
        <ChatScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>

      <Modal visible={activeScreen === 'notifications'} animationType="slide">
        <NotificationsScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>

      <Modal visible={activeScreen === 'feed'} animationType="slide">
        <FeedScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>

      <Modal visible={activeScreen === 'otp'} animationType="slide">
        <OTPVerificationScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>

      {/* Phase 5-7 Screens */}
      <Modal visible={activeScreen === 'product-detail'} animationType="slide">
        <ProductDetailScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>

      <Modal visible={activeScreen === 'cart'} animationType="slide">
        <CartScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>

      <Modal visible={activeScreen === 'followers'} animationType="slide">
        <FollowersScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>

      <Modal visible={activeScreen === 'comments'} animationType="slide">
        <CommentsScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>

      <Modal visible={activeScreen === 'checkout'} animationType="slide">
        <CheckoutScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>

      <Modal visible={activeScreen === 'order-history'} animationType="slide">
        <OrderHistoryScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>

      <Modal visible={activeScreen === 'home'} animationType="slide">
        <HomeScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>

      <Modal visible={activeScreen === 'account'} animationType="slide">
        <AccountScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>

      <Modal visible={activeScreen === 'help'} animationType="slide">
        <HelpScreenPreview onClose={() => setActiveScreen(null)} />
      </Modal>
    </View>
  );
}

// ============================================================================
// Login Screen Preview
// ============================================================================

function LoginScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: insets.top + spacing[4],
        paddingBottom: insets.bottom + spacing[6],
        paddingHorizontal: spacing[6],
      }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Close Button */}
      <Pressable onPress={onClose} style={styles.closeButton}>
        <Text style={{ color: colors.primary, fontSize: 16 }}>Close</Text>
      </Pressable>

      {/* Header */}
      <View style={[styles.header, { marginTop: spacing[8], marginBottom: spacing[8] }]}>
        <View style={[styles.logoPlaceholder, { backgroundColor: colors.primary, borderRadius: radius.xl }]}>
          <Text style={{ color: '#FFF', fontWeight: '600' }}>Logo</Text>
        </View>
        <Text style={[styles.title, { color: colors.foreground, marginTop: spacing[6] }]}>
          Welcome back
        </Text>
        <Text style={[styles.subtitle, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
          Sign in to continue
        </Text>
      </View>

      {/* Form */}
      <View style={{ gap: spacing[4] }}>
        <Input
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Pressable style={{ alignSelf: 'flex-end' }}>
          <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '500' }}>
            Forgot password?
          </Text>
        </Pressable>
        <Button onPress={() => Alert.alert('Login', `Email: ${email}`)} style={{ marginTop: spacing[2] }}>
          Sign In
        </Button>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { marginVertical: spacing[6] }]}>
        <Separator style={{ flex: 1 }} />
        <Text style={{ color: colors.foregroundMuted, marginHorizontal: spacing[4], fontSize: 13 }}>
          or continue with
        </Text>
        <Separator style={{ flex: 1 }} />
      </View>

      {/* Social Buttons */}
      <View style={{ flexDirection: 'row', gap: spacing[3] }}>
        <Button variant="outline" onPress={() => Alert.alert('Google')} style={{ flex: 1 }}>
          Google
        </Button>
        <Button variant="outline" onPress={() => Alert.alert('Apple')} style={{ flex: 1 }}>
          Apple
        </Button>
      </View>

      {/* Sign Up Link */}
      <View style={[styles.footer, { marginTop: spacing[8] }]}>
        <Text style={{ color: colors.foregroundMuted }}>Don't have an account? </Text>
        <Pressable onPress={() => Alert.alert('Navigate to Sign Up')}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Sign up</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

// ============================================================================
// Sign Up Screen Preview
// ============================================================================

function SignUpScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: insets.top + spacing[4],
        paddingBottom: insets.bottom + spacing[6],
        paddingHorizontal: spacing[6],
      }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Close Button */}
      <Pressable onPress={onClose} style={styles.closeButton}>
        <Text style={{ color: colors.primary, fontSize: 16 }}>Close</Text>
      </Pressable>

      {/* Header */}
      <View style={[styles.header, { marginTop: spacing[6], marginBottom: spacing[6] }]}>
        <View style={[styles.logoPlaceholder, { backgroundColor: colors.primary, borderRadius: radius.xl, width: 72, height: 72 }]}>
          <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 13 }}>Logo</Text>
        </View>
        <Text style={[styles.title, { color: colors.foreground, marginTop: spacing[5], fontSize: 26 }]}>
          Create account
        </Text>
        <Text style={[styles.subtitle, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
          Join us today
        </Text>
      </View>

      {/* Form */}
      <View style={{ gap: spacing[4] }}>
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <Input
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Password"
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Terms */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing[2] }}>
          <Checkbox checked={acceptedTerms} onCheckedChange={setAcceptedTerms} />
          <Text style={{ color: colors.foregroundMuted, marginLeft: spacing[3], flex: 1, fontSize: 14, lineHeight: 20 }}>
            I agree to the{' '}
            <Text style={{ color: colors.primary, fontWeight: '500' }}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={{ color: colors.primary, fontWeight: '500' }}>Privacy Policy</Text>
          </Text>
        </View>

        <Button
          onPress={() => Alert.alert('Sign Up', `Name: ${name}`)}
          disabled={!acceptedTerms}
          style={{ marginTop: spacing[2] }}
        >
          Create Account
        </Button>
      </View>

      {/* Login Link */}
      <View style={[styles.footer, { marginTop: spacing[8] }]}>
        <Text style={{ color: colors.foregroundMuted }}>Already have an account? </Text>
        <Pressable onPress={() => Alert.alert('Navigate to Login')}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Sign in</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

// ============================================================================
// Onboarding Screen Preview
// ============================================================================

interface OnboardingSlideData {
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Slide component that receives scrollX from Carousel for parallax effects
function OnboardingSlide({
  item,
  index,
  scrollX,
  width,
}: {
  item: OnboardingSlideData;
  index: number;
  scrollX: SharedValue<number>;
  width: number;
}) {
  const { colors, spacing, radius } = useTheme();

  // Parallax + scale + fade animation for illustration
  const illustrationStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [width * 0.3, 0, -width * 0.3],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.7, 1, 0.7],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }, { scale }],
      opacity,
    };
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing[6] }}>
      <Animated.View
        style={[
          {
            width: 200,
            height: 200,
            backgroundColor: colors.primary + '20',
            borderRadius: radius.xl,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing[8],
          },
          illustrationStyle,
        ]}
      >
        {item.icon}
      </Animated.View>

      <Text style={{ fontSize: 28, fontWeight: '700', color: colors.foreground, textAlign: 'center' }}>
        {item.title}
      </Text>
      <Text style={{ fontSize: 16, color: colors.foregroundMuted, textAlign: 'center', marginTop: spacing[3], lineHeight: 24 }}>
        {item.description}
      </Text>
    </View>
  );
}

function OnboardingScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<CarouselRef>(null);

  const slides: OnboardingSlideData[] = [
    {
      title: 'Welcome to MyApp',
      description: 'Discover amazing features that will change how you work and connect with others.',
      icon: (
        <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="8" r="4" fill={colors.primary} />
          <Path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill={colors.primary} />
        </Svg>
      ),
    },
    {
      title: 'Stay Organized',
      description: 'Keep all your important tasks, notes, and projects in one beautiful place.',
      icon: (
        <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="2" stroke={colors.primary} strokeWidth="2" />
          <Path d="M9 12l2 2 4-4" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      ),
    },
    {
      title: 'Connect & Share',
      description: 'Share your moments with friends and family instantly from anywhere.',
      icon: (
        <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
          <Circle cx="18" cy="5" r="3" stroke={colors.primary} strokeWidth="2" />
          <Circle cx="6" cy="12" r="3" stroke={colors.primary} strokeWidth="2" />
          <Circle cx="18" cy="19" r="3" stroke={colors.primary} strokeWidth="2" />
          <Path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke={colors.primary} strokeWidth="2" />
        </Svg>
      ),
    },
  ];

  const isLastSlide = currentIndex === slides.length - 1;

  const handleSlideChange = (index: number) => {
    setCurrentIndex(index);
  };

  const goToNext = () => {
    if (isLastSlide) {
      onClose();
    } else {
      carouselRef.current?.scrollToIndex(currentIndex + 1);
    }
  };

  const renderSlide = (info: CarouselRenderItemInfo<OnboardingSlideData>) => (
    <OnboardingSlide
      item={info.item}
      index={info.index}
      scrollX={info.scrollX}
      width={info.width}
    />
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Skip Button */}
      {!isLastSlide && (
        <Pressable
          onPress={onClose}
          style={{ position: 'absolute', top: insets.top + spacing[2], right: spacing[4], zIndex: 10 }}
        >
          <Text style={{ color: colors.foregroundMuted, fontSize: 16 }}>Skip</Text>
        </Pressable>
      )}

      {/* Carousel with slides and animated indicators */}
      <View style={{ flex: 1 }}>
        <Carousel
          ref={carouselRef}
          data={slides}
          renderItem={renderSlide}
          onSlideChange={handleSlideChange}
          showIndicators
          indicatorStyle="line"
          indicatorPosition="bottom"
          style={{ flex: 1 }}
        />
      </View>

      {/* Bottom Button */}
      <View style={{ paddingHorizontal: spacing[6], paddingBottom: insets.bottom + spacing[4] }}>
        <Button onPress={goToNext}>
          {isLastSlide ? 'Get Started' : 'Next'}
        </Button>
      </View>
    </View>
  );
}

// ============================================================================
// Profile Screen Preview
// ============================================================================

function ProfileBackIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SettingsIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </Svg>
  );
}

function ProfileScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('posts');

  const stats = [
    { label: 'Posts', value: '42' },
    { label: 'Followers', value: '1.2K' },
    { label: 'Following', value: '350' },
  ];

  const tabs = ['Posts', 'Media', 'About'];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header - Using IconButton for navigation */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: insets.top + spacing[2], paddingHorizontal: spacing[4], paddingBottom: spacing[2] }}>
        <IconButton
          icon={<ProfileBackIcon />}
          variant="ghost"
          size="sm"
          onPress={onClose}
          accessibilityLabel="Go back"
        />
        <View style={{ flex: 1 }} />
        <IconButton
          icon={<SettingsIcon />}
          variant="ghost"
          size="sm"
          onPress={() => Alert.alert('Settings')}
          accessibilityLabel="Settings"
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing[4] }}>
        {/* Profile Info */}
        <View style={{ alignItems: 'center', paddingHorizontal: spacing[6] }}>
          <Avatar size="xl" source={{ uri: 'https://i.pravatar.cc/200?img=5' }} fallback="JD" />
          <View style={{ alignItems: 'center', marginTop: spacing[4] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.foreground }}>Jane Doe</Text>
              <View style={{ marginLeft: spacing[1] }}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill={colors.primary}>
                  <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </Svg>
              </View>
            </View>
            <Text style={{ fontSize: 15, color: colors.foregroundMuted, marginTop: spacing[1] }}>@janedoe</Text>
          </View>
          <Text style={{ fontSize: 15, color: colors.foreground, textAlign: 'center', marginTop: spacing[3], lineHeight: 22 }}>
            Designer & Developer. Creating beautiful experiences.
          </Text>

          {/* Stats */}
          <View style={{ flexDirection: 'row', marginTop: spacing[4], gap: spacing[6] }}>
            {stats.map((stat) => (
              <View key={stat.label} style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.foreground }}>{stat.value}</Text>
                <Text style={{ fontSize: 13, color: colors.foregroundMuted, marginTop: 2 }}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={{ flexDirection: 'row', marginTop: spacing[5], gap: spacing[3], width: '100%' }}>
            <Button variant="outline" style={{ flex: 1 }}>Edit Profile</Button>
          </View>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, marginTop: spacing[6] }}>
          {tabs.map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab.toLowerCase())}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: spacing[3],
                borderBottomWidth: 2,
                borderBottomColor: activeTab === tab.toLowerCase() ? colors.primary : 'transparent',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: activeTab === tab.toLowerCase() ? colors.primary : colors.foregroundMuted }}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tab Content Placeholder */}
        <View style={{ padding: spacing[6], alignItems: 'center' }}>
          <Text style={{ color: colors.foregroundMuted }}>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content would go here
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================================================
// Settings Screen Preview
// ============================================================================

function BackIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SettingsScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header - Using IconButton for back button */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: insets.top + spacing[2],
        paddingHorizontal: spacing[4],
        paddingBottom: spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
        <IconButton
          icon={<BackIcon />}
          variant="ghost"
          size="sm"
          onPress={onClose}
          accessibilityLabel="Close settings"
        />
        <Text style={{ fontSize: 17, fontWeight: '600', color: colors.foreground }}>Settings</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing[4],
          paddingTop: spacing[4],
          paddingBottom: insets.bottom + spacing[6],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section - Using List + ListItem */}
        <View style={{ marginBottom: spacing[6] }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            letterSpacing: 0.5,
            color: colors.foregroundMuted,
            marginBottom: spacing[2],
            marginLeft: spacing[2],
          }}>
            ACCOUNT
          </Text>
          <List showDividers>
            <ListItem
              title="Profile"
              subtitle="Jane Doe"
              showChevron
              onPress={() => Alert.alert('Profile')}
            />
            <ListItem
              title="Email"
              subtitle="jane@example.com"
              showChevron
              onPress={() => Alert.alert('Email')}
            />
            <ListItem
              title="Password"
              showChevron
              onPress={() => Alert.alert('Password')}
            />
          </List>
        </View>

        {/* Preferences Section - Using List + ListItem with Switch */}
        <View style={{ marginBottom: spacing[6] }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            letterSpacing: 0.5,
            color: colors.foregroundMuted,
            marginBottom: spacing[2],
            marginLeft: spacing[2],
          }}>
            PREFERENCES
          </Text>
          <List showDividers>
            <ListItem
              title="Notifications"
              right={<Switch checked={notifications} onCheckedChange={setNotifications} />}
            />
            <ListItem
              title="Dark Mode"
              right={<Switch checked={darkMode} onCheckedChange={setDarkMode} />}
            />
            <ListItem
              title="Language"
              subtitle="English"
              showChevron
              onPress={() => Alert.alert('Language')}
            />
          </List>
        </View>

        {/* Support Section */}
        <View style={{ marginBottom: spacing[6] }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            letterSpacing: 0.5,
            color: colors.foregroundMuted,
            marginBottom: spacing[2],
            marginLeft: spacing[2],
          }}>
            SUPPORT
          </Text>
          <List showDividers>
            <ListItem title="Help Center" showChevron onPress={() => Alert.alert('Help')} />
            <ListItem title="Contact Us" showChevron onPress={() => Alert.alert('Contact')} />
            <ListItem title="Privacy Policy" showChevron onPress={() => Alert.alert('Privacy')} />
          </List>
        </View>

        {/* Destructive Action */}
        <View style={{ marginBottom: spacing[6] }}>
          <List>
            <ListItem
              title="Sign Out"
              titleStyle={{ color: colors.destructive }}
              onPress={() => Alert.alert('Sign Out')}
            />
          </List>
        </View>

        {/* Footer */}
        <View style={{ alignItems: 'center', marginTop: spacing[4] }}>
          <Text style={{ color: colors.foregroundMuted, fontSize: 13 }}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================================================
// Search Screen Preview
// ============================================================================

function SearchIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="11" cy="11" r="8" />
      <Path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </Svg>
  );
}

// Icons for Search Screen
function ClockIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 6v6l4 2" strokeLinecap="round" />
    </Svg>
  );
}

function TrendingIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M23 6l-9.5 9.5-5-5L1 18" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17 6h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ImageIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <Circle cx="8.5" cy="8.5" r="1.5" />
      <Path d="M21 15l-5-5L5 21" />
    </Svg>
  );
}

function VideoIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Rect x="2" y="4" width="20" height="16" rx="2" />
      <Path d="M10 9l5 3-5 3V9z" fill={color} stroke="none" />
    </Svg>
  );
}

function UserIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

function MapPinIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <Circle cx="12" cy="10" r="3" />
    </Svg>
  );
}

function CloseIcon({ size = 16, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </Svg>
  );
}

function SearchScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'Sunset photography',
    'Coffee shops near me',
    'Travel inspiration',
  ]);

  const filters = [
    { key: 'all', label: 'All', icon: null },
    { key: 'photos', label: 'Photos', icon: ImageIcon },
    { key: 'videos', label: 'Videos', icon: VideoIcon },
    { key: 'people', label: 'People', icon: UserIcon },
    { key: 'places', label: 'Places', icon: MapPinIcon },
  ];

  const trending = [
    { id: '1', tag: 'SummerVibes', posts: '12.4K' },
    { id: '2', tag: 'Photography', posts: '8.2K' },
    { id: '3', tag: 'FoodPorn', posts: '6.1K' },
    { id: '4', tag: 'Travel2024', posts: '4.8K' },
  ];

  const results = [
    { id: '1', title: 'Beautiful sunset at the beach', type: 'photo', user: 'Sarah Miller', avatar: 'SM' },
    { id: '2', title: 'City lights at night', type: 'photo', user: 'John Davis', avatar: 'JD' },
    { id: '3', title: 'Mountain hiking adventure', type: 'video', user: 'Mike Ross', avatar: 'MR' },
    { id: '4', title: 'Coffee shop moments', type: 'photo', user: 'Emma Wilson', avatar: 'EW' },
    { id: '5', title: 'Street photography NYC', type: 'photo', user: 'Alex Kim', avatar: 'AK' },
  ];

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length > 0) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 600);
    }
  };

  const removeRecentSearch = (search: string) => {
    setRecentSearches(prev => prev.filter(s => s !== search));
  };

  const handleRecentSearchPress = (search: string) => {
    setQuery(search);
    handleSearch(search);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + spacing[2], paddingHorizontal: spacing[4] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
          <View style={{ flex: 1 }}>
            <SearchInput
              placeholder="Search photos, videos, people..."
              value={query}
              onChangeText={handleSearch}
              loading={isLoading}
              autoFocus
            />
          </View>
          <Pressable onPress={onClose}>
            <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '500' }}>Cancel</Text>
          </Pressable>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: spacing[3] }}
          contentContainerStyle={{ gap: spacing[2] }}
        >
          {filters.map((filter) => (
            <Chip
              key={filter.key}
              selected={selectedFilter === filter.key}
              onPress={() => setSelectedFilter(filter.key)}
              variant="filled"
              icon={filter.icon ? <filter.icon size={16} color={selectedFilter === filter.key ? colors.primaryForeground : colors.foreground} /> : undefined}
            >
              {filter.label}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <Separator style={{ marginTop: spacing[3] }} />

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: spacing[6] }}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
          /* Loading State */
          <View style={{ padding: spacing[4], gap: spacing[4] }}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={{ flexDirection: 'row', gap: spacing[3], alignItems: 'center' }}>
                <Skeleton width={56} height={56} radius="full" />
                <View style={{ flex: 1, gap: spacing[2] }}>
                  <Skeleton width="75%" height={16} />
                  <Skeleton width="45%" height={14} />
                </View>
              </View>
            ))}
          </View>
        ) : query.length > 0 ? (
          /* Results */
          <View style={{ padding: spacing[4], gap: spacing[3] }}>
            <Text style={{ color: colors.foregroundMuted, fontSize: 13, marginBottom: spacing[1] }}>
              {results.length} results for "{query}"
            </Text>
            {results.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  gap: spacing[3],
                  padding: spacing[3],
                  backgroundColor: pressed ? colors.backgroundMuted : colors.card,
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: 'center',
                })}
              >
                <Avatar fallback={item.avatar} size="md" />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: '500' }} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginTop: 4 }}>
                    <Badge variant={item.type === 'video' ? 'default' : 'secondary'} size="sm">
                      {item.type === 'video' ? '▶ Video' : '📷 Photo'}
                    </Badge>
                    <Text style={{ color: colors.foregroundMuted, fontSize: 13 }}>
                      {item.user}
                    </Text>
                  </View>
                </View>
                <IconButton
                  icon={<SearchIcon size={18} color={colors.foregroundMuted} />}
                  variant="ghost"
                  size="sm"
                  accessibilityLabel="View"
                />
              </Pressable>
            ))}
          </View>
        ) : (
          /* Empty State - Recent & Trending */
          <View>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={{ padding: spacing[4], paddingBottom: 0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[3] }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                    <ClockIcon size={18} color={colors.foregroundMuted} />
                    <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: '600' }}>
                      Recent Searches
                    </Text>
                  </View>
                  <Pressable onPress={() => setRecentSearches([])}>
                    <Text style={{ color: colors.primary, fontSize: 14 }}>Clear all</Text>
                  </Pressable>
                </View>
                <View style={{ gap: spacing[1] }}>
                  {recentSearches.map((search) => (
                    <Pressable
                      key={search}
                      onPress={() => handleRecentSearchPress(search)}
                      style={({ pressed }) => ({
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: spacing[3],
                        paddingHorizontal: spacing[2],
                        borderRadius: radius.md,
                        backgroundColor: pressed ? colors.backgroundMuted : 'transparent',
                      })}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                        <SearchIcon size={18} color={colors.foregroundMuted} />
                        <Text style={{ color: colors.foreground, fontSize: 15 }}>{search}</Text>
                      </View>
                      <Pressable
                        onPress={() => removeRecentSearch(search)}
                        hitSlop={8}
                        style={{ padding: spacing[1] }}
                      >
                        <CloseIcon size={16} color={colors.foregroundMuted} />
                      </Pressable>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Trending */}
            <View style={{ padding: spacing[4] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
                <TrendingIcon size={18} color={colors.primary} />
                <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: '600' }}>
                  Trending Now
                </Text>
              </View>
              <View style={{ gap: spacing[2] }}>
                {trending.map((item, index) => (
                  <Pressable
                    key={item.id}
                    onPress={() => handleSearch(item.tag)}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: spacing[3],
                      borderRadius: radius.lg,
                      backgroundColor: pressed ? colors.backgroundMuted : colors.card,
                      borderWidth: 1,
                      borderColor: colors.border,
                    })}
                  >
                    <View style={{
                      width: 32,
                      height: 32,
                      borderRadius: radius.md,
                      backgroundColor: colors.primary + '15',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: spacing[3],
                    }}>
                      <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 14 }}>
                        {index + 1}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: '500' }}>
                        #{item.tag}
                      </Text>
                      <Text style={{ color: colors.foregroundMuted, fontSize: 13, marginTop: 2 }}>
                        {item.posts} posts
                      </Text>
                    </View>
                    <Badge variant="outline" size="sm">Trending</Badge>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Categories */}
            <View style={{ paddingHorizontal: spacing[4] }}>
              <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: '600', marginBottom: spacing[3] }}>
                Browse Categories
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
                {[
                  { label: 'Nature', icon: '🌿' },
                  { label: 'Food', icon: '🍕' },
                  { label: 'Travel', icon: '✈️' },
                  { label: 'Sports', icon: '⚽' },
                  { label: 'Music', icon: '🎵' },
                  { label: 'Art', icon: '🎨' },
                ].map((cat) => (
                  <Pressable
                    key={cat.label}
                    onPress={() => handleSearch(cat.label)}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing[2],
                      paddingHorizontal: spacing[4],
                      paddingVertical: spacing[3],
                      borderRadius: radius.full,
                      backgroundColor: pressed ? colors.primary + '20' : colors.secondary,
                    })}
                  >
                    <Text style={{ fontSize: 16 }}>{cat.icon}</Text>
                    <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: '500' }}>
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ============================================================================
// Chat Screen Preview
// ============================================================================

function SendIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </Svg>
  );
}

interface ChatMessage {
  id: string;
  text: string;
  isMe: boolean;
  time: string;
}

function ChatScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');

  const messages: ChatMessage[] = [
    { id: '1', text: 'Hey! How are you doing?', isMe: false, time: '10:30 AM' },
    { id: '2', text: "I'm good, thanks! Just working on a new project.", isMe: true, time: '10:32 AM' },
    { id: '3', text: 'Oh nice! What kind of project?', isMe: false, time: '10:33 AM' },
    { id: '4', text: "It's a mobile app using React Native. Really enjoying it so far!", isMe: true, time: '10:35 AM' },
    { id: '5', text: "That sounds awesome! I'd love to see it when it's done.", isMe: false, time: '10:36 AM' },
    { id: '6', text: "Sure! I'll share it with you soon.", isMe: true, time: '10:37 AM' },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + spacing[2],
          paddingBottom: spacing[3],
          paddingHorizontal: spacing[4],
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Pressable onPress={onClose} style={{ marginRight: spacing[3] }}>
          <ProfileBackIcon size={24} color={colors.foreground} />
        </Pressable>
        <Avatar fallback="SM" size="sm" />
        <View style={{ marginLeft: spacing[3], flex: 1 }}>
          <Text style={{ color: colors.foreground, fontWeight: '600', fontSize: 16 }}>
            Sarah Miller
          </Text>
          <Text style={{ color: colors.success, fontSize: 12 }}>Online</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing[4], gap: spacing[3] }}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={{
              alignSelf: msg.isMe ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
            }}
          >
            <View
              style={{
                backgroundColor: msg.isMe ? colors.primary : colors.card,
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[3],
                borderRadius: radius.xl,
                borderBottomRightRadius: msg.isMe ? radius.sm : radius.xl,
                borderBottomLeftRadius: msg.isMe ? radius.xl : radius.sm,
              }}
            >
              <Text
                style={{
                  color: msg.isMe ? colors.primaryForeground : colors.foreground,
                  fontSize: 15,
                  lineHeight: 20,
                }}
              >
                {msg.text}
              </Text>
            </View>
            <Text
              style={{
                color: colors.foregroundMuted,
                fontSize: 11,
                marginTop: spacing[1],
                alignSelf: msg.isMe ? 'flex-end' : 'flex-start',
              }}
            >
              {msg.time}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View
        style={{
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
          paddingBottom: insets.bottom + spacing[3],
          borderTopWidth: 1,
          borderTopColor: colors.border,
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: spacing[3],
        }}
      >
        <View style={{ flex: 1 }}>
          <Input
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
        </View>
        <IconButton
          icon={<SendIcon size={20} color={colors.primary} />}
          accessibilityLabel="Send message"
          variant="ghost"
          onPress={() => {
            if (message.trim()) {
              Alert.alert('Message sent!');
              setMessage('');
            }
          }}
        />
      </View>
    </View>
  );
}

// ============================================================================
// Notifications Screen Preview
// ============================================================================

function BellIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TrashIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function NotificationsScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const notifications = [
    { id: '1', title: 'Sarah', message: 'started following you', time: '2m ago', unread: true },
    { id: '2', title: 'John', message: 'commented: "Great photo!"', time: '15m ago', unread: true },
    { id: '3', title: 'Your order shipped', message: 'Order #12345 is on its way', time: '1h ago', unread: false, isSystem: true },
    { id: '4', title: 'Emma', message: 'sent you a message', time: '2h ago', unread: false },
    { id: '5', title: 'Weekly summary', message: 'Your activity report is ready', time: '1d ago', unread: false, isSystem: true },
  ];

  const handleDelete = (id: string) => {
    Alert.alert('Deleted', `Notification ${id} deleted`);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + spacing[2],
          paddingBottom: spacing[3],
          paddingHorizontal: spacing[4],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Pressable onPress={onClose}>
          <ProfileBackIcon size={24} color={colors.foreground} />
        </Pressable>
        <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '600' }}>
          Notifications
        </Text>
        <Pressable onPress={() => Alert.alert('Mark all as read')}>
          <Text style={{ color: colors.primary, fontSize: 14 }}>Mark all read</Text>
        </Pressable>
      </View>

      <Separator />

      {/* Notifications List - using NotificationItem block */}
      <ScrollView style={{ flex: 1 }}>
        {notifications.map((notif) => (
          <SwipeableRow
            key={notif.id}
            rightActions={[
              {
                label: 'Delete',
                color: colors.destructive,
                onPress: () => handleDelete(notif.id),
              },
            ]}
          >
            <NotificationItem
              title={notif.title}
              message={notif.message}
              time={notif.time}
              unread={notif.unread}
              icon={notif.isSystem ? <BellIcon size={20} color={colors.foregroundMuted} /> : undefined}
              onPress={() => Alert.alert('Notification', notif.title)}
            />
          </SwipeableRow>
        ))}
      </ScrollView>
    </View>
  );
}

// ============================================================================
// Feed/Timeline Screen Preview
// ============================================================================

interface FeedPost {
  id: string;
  user: { name: string; avatar: string };
  content: string;
  image?: boolean;
  likes: number;
  comments: number;
  time: string;
  liked: boolean;
}

function FeedScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<FeedPost[]>([
    {
      id: '1',
      user: { name: 'Sarah Miller', avatar: 'S' },
      content: 'Just finished my morning run! 5km in 25 minutes. Feeling great! 🏃‍♀️',
      likes: 42,
      comments: 8,
      time: '2h ago',
      liked: false,
    },
    {
      id: '2',
      user: { name: 'John Davis', avatar: 'J' },
      content: 'Check out this amazing sunset I captured yesterday. Nature is truly beautiful.',
      image: true,
      likes: 156,
      comments: 23,
      time: '4h ago',
      liked: true,
    },
    {
      id: '3',
      user: { name: 'Emma Wilson', avatar: 'E' },
      content: "Just launched my new app! It's been months of hard work but it's finally here. Thanks to everyone who supported me along the way! 🚀",
      likes: 89,
      comments: 31,
      time: '6h ago',
      liked: false,
    },
    {
      id: '4',
      user: { name: 'Mike Johnson', avatar: 'M' },
      content: 'Anyone else excited for the weekend? Planning a hiking trip!',
      likes: 28,
      comments: 12,
      time: '8h ago',
      liked: false,
    },
  ]);

  const toggleLike = (id: string) => {
    setPosts(posts.map(post =>
      post.id === id
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + spacing[2],
          paddingBottom: spacing[3],
          paddingHorizontal: spacing[4],
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Pressable onPress={onClose}>
          <ProfileBackIcon size={24} color={colors.foreground} />
        </Pressable>
        <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '700' }}>Feed</Text>
        <Pressable onPress={() => Alert.alert('New Post')}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2}>
            <Path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </Svg>
        </Pressable>
      </View>

      {/* Feed */}
      <ScrollView style={{ flex: 1 }}>
        {posts.map((post, index) => (
          <FeedPostCard
            key={post.id}
            user={{ name: post.user.name, avatar: post.user.avatar }}
            content={post.content}
            time={post.time}
            hasImage={post.image}
            likes={post.likes}
            comments={post.comments}
            liked={post.liked}
            onLike={() => toggleLike(post.id)}
            onComment={() => Alert.alert('Comments')}
            onShare={() => Alert.alert('Share')}
            showSeparator={index < posts.length - 1}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// ============================================================================
// OTP Verification Screen Preview
// ============================================================================

interface OTPInputPreviewProps {
  value: string;
  onChange: (value: string) => void;
  length: number;
  error?: boolean;
  disabled?: boolean;
}

function OTPInputPreview({ value, onChange, length, error, disabled }: OTPInputPreviewProps) {
  const { colors, spacing, radius } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const shakeX = useSharedValue(0);

  // Shake animation for errors
  useEffect(() => {
    if (error) {
      shakeX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [error]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const handleChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, length);
    onChange(cleaned);
  };

  const digits = value.split('');

  return (
    <Pressable onPress={handlePress} disabled={disabled}>
      <Animated.View style={[{ flexDirection: 'row', justifyContent: 'center' }, animatedStyle]}>
        {Array.from({ length }).map((_, index) => {
          const isActive = index === value.length;
          const isFilled = index < value.length;

          return (
            <View
              key={index}
              style={{
                width: 48,
                height: 56,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: radius.lg,
                borderColor: error
                  ? colors.destructive
                  : isActive
                  ? colors.primary
                  : colors.border,
                borderWidth: isActive ? 2 : 1,
                backgroundColor: isFilled ? colors.secondary : colors.background,
                marginHorizontal: spacing[1],
              }}
            >
              <Text
                style={{
                  color: colors.foreground,
                  fontSize: 24,
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                {digits[index] || ''}
              </Text>
              {isActive && (
                <View
                  style={{
                    position: 'absolute',
                    width: 2,
                    height: 24,
                    borderRadius: 1,
                    backgroundColor: colors.primary,
                  }}
                />
              )}
            </View>
          );
        })}
      </Animated.View>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}
        autoFocus
        editable={!disabled}
      />
    </Pressable>
  );
}

function OTPVerificationScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const shakeX = useSharedValue(0);

  const phoneOrEmail = '+1 (555) 123-4567';
  const codeLength = 6;

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Auto-verify when code is complete
  useEffect(() => {
    if (code.length === codeLength && !isVerifying) {
      handleVerify();
    }
  }, [code]);

  const handleVerify = async () => {
    if (code.length !== codeLength || isVerifying) return;

    setIsVerifying(true);
    setError(null);
    Keyboard.dismiss();

    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (code === '123456') {
      Alert.alert('Success!', 'Code verified successfully');
      onClose();
    } else {
      setError('Invalid verification code. Please try again.');
      setCode('');
    }
    setIsVerifying(false);
  };

  const handleResend = () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(60);
    setCode('');
    setError(null);
    Alert.alert('Code Sent', 'A new verification code has been sent.');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: insets.top + spacing[2], paddingHorizontal: spacing[4], height: 56 + insets.top }}>
        <Pressable onPress={onClose} style={{ marginLeft: -8, padding: spacing[2] }} hitSlop={8}>
          <ProfileBackIcon size={24} color={colors.foreground} />
        </Pressable>
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: spacing[6], paddingTop: spacing[6] }}>
        <Text style={{ color: colors.foreground, fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: spacing[2] }}>
          Verification Code
        </Text>

        <Text style={{ color: colors.foregroundMuted, fontSize: 15, textAlign: 'center', marginBottom: spacing[8], lineHeight: 22 }}>
          We sent a 6-digit code to {phoneOrEmail}
        </Text>

        {/* OTP Input */}
        <OTPInputPreview
          value={code}
          onChange={setCode}
          length={codeLength}
          error={!!error}
          disabled={isVerifying}
        />

        {/* Error Message */}
        {error && (
          <Text style={{ color: colors.destructive, fontSize: 14, textAlign: 'center', marginTop: spacing[3] }}>
            {error}
          </Text>
        )}

        {/* Hint for demo */}
        <Text style={{ color: colors.foregroundMuted, fontSize: 12, textAlign: 'center', marginTop: spacing[4], fontStyle: 'italic' }}>
          Hint: Enter "123456" to verify
        </Text>

        {/* Resend Section */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing[6] }}>
          <Text style={{ color: colors.foregroundMuted, fontSize: 14 }}>
            Didn't receive the code?{' '}
          </Text>
          {canResend ? (
            <Pressable onPress={handleResend}>
              <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '500' }}>
                Resend
              </Text>
            </Pressable>
          ) : (
            <Text style={{ color: colors.foregroundMuted, fontSize: 14 }}>
              Resend in {formatTime(countdown)}
            </Text>
          )}
        </View>
      </View>

      {/* Bottom Button */}
      <View style={{ paddingHorizontal: spacing[6], paddingBottom: insets.bottom + spacing[4] }}>
        <Button
          onPress={handleVerify}
          disabled={code.length !== codeLength}
          loading={isVerifying}
        >
          Verify
        </Button>
      </View>
    </View>
  );
}

// ============================================================================
// Product Detail Screen Preview
// ============================================================================

function ProductDetailScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  const product = {
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.8,
    reviewCount: 256,
    description: 'Experience premium sound quality with our wireless headphones. Features active noise cancellation, 30-hour battery life, and premium comfort.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [colors.foreground, colors.primary, '#8B4513'],
    images: [
      'https://picsum.photos/400/400?random=50',
      'https://picsum.photos/400/400?random=51',
      'https://picsum.photos/400/400?random=52',
    ],
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        {/* Header */}
        <View style={{ position: 'absolute', top: insets.top + spacing[2], left: spacing[4], right: spacing[4], zIndex: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
          <IconButton icon={<ProfileBackIcon />} variant="secondary" onPress={onClose} accessibilityLabel="Back" />
          <IconButton icon={<BellIcon />} variant="secondary" onPress={() => Alert.alert('Share')} accessibilityLabel="Share" />
        </View>

        {/* Image */}
        <View style={{ height: 350, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.foregroundMuted, fontSize: 48 }}>🎧</Text>
        </View>

        {/* Content */}
        <View style={{ padding: spacing[4] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground, fontSize: 24, fontWeight: '700' }}>{product.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing[2] }}>
                <Text style={{ color: colors.foreground, fontSize: 11 }}>★★★★★</Text>
                <Text style={{ color: colors.foregroundMuted, fontSize: 14, marginLeft: spacing[2] }}>
                  {product.rating} ({product.reviewCount} reviews)
                </Text>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: spacing[3] }}>
            <Text style={{ color: colors.foreground, fontSize: 28, fontWeight: '700' }}>${product.price}</Text>
            {product.originalPrice && (
              <Text style={{ color: colors.foregroundMuted, fontSize: 18, marginLeft: spacing[2], textDecorationLine: 'line-through' }}>
                ${product.originalPrice}
              </Text>
            )}
          </View>

          <Text style={{ color: colors.foreground, fontSize: 15, lineHeight: 22, marginTop: spacing[4] }}>
            {product.description}
          </Text>

          {/* Size Selection */}
          <View style={{ marginTop: spacing[4] }}>
            <Text style={{ color: colors.foreground, fontWeight: '600', marginBottom: spacing[2] }}>Size</Text>
            <View style={{ flexDirection: 'row', gap: spacing[2] }}>
              {product.sizes.map((size) => (
                <Pressable
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: radius.md,
                    borderWidth: 2,
                    borderColor: selectedSize === size ? colors.primary : colors.border,
                    backgroundColor: selectedSize === size ? colors.primary + '15' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: selectedSize === size ? colors.primary : colors.foreground, fontWeight: '600' }}>
                    {size}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        padding: spacing[4],
        paddingBottom: insets.bottom + spacing[4],
        flexDirection: 'row',
        gap: spacing[3],
      }}>
        <Button variant="outline" style={{ flex: 1 }} onPress={() => Alert.alert('Added to cart')}>
          Add to Cart
        </Button>
        <Button style={{ flex: 1 }} onPress={() => Alert.alert('Buy Now')}>
          Buy Now
        </Button>
      </View>
    </View>
  );
}

// ============================================================================
// Cart Screen Preview
// ============================================================================

function CartScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState([
    { id: '1', name: 'Wireless Headphones', price: 299.99, quantity: 1, image: '🎧' },
    { id: '2', name: 'Smart Watch', price: 199.99, quantity: 2, image: '⌚' },
  ]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 9.99;
  const total = subtotal + shipping;

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + spacing[2], paddingHorizontal: spacing[4], paddingBottom: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton icon={<ProfileBackIcon />} variant="ghost" onPress={onClose} accessibilityLabel="Back" />
        <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '600' }}>Cart ({items.length})</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing[4] }}>
        {items.map((item) => (
          <View key={item.id} style={{
            flexDirection: 'row',
            padding: spacing[3],
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            marginBottom: spacing[3],
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <View style={{ width: 80, height: 80, backgroundColor: colors.secondary, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 32 }}>{item.image}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: spacing[3] }}>
              <Text style={{ color: colors.foreground, fontWeight: '600' }}>{item.name}</Text>
              <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '700', marginTop: spacing[1] }}>${item.price}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing[2] }}>
                <Pressable onPress={() => updateQuantity(item.id, -1)} style={{ width: 32, height: 32, backgroundColor: colors.secondary, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: colors.foreground, fontSize: 18 }}>−</Text>
                </Pressable>
                <Text style={{ color: colors.foreground, marginHorizontal: spacing[3], fontWeight: '600' }}>{item.quantity}</Text>
                <Pressable onPress={() => updateQuantity(item.id, 1)} style={{ width: 32, height: 32, backgroundColor: colors.secondary, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: colors.foreground, fontSize: 18 }}>+</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Summary */}
      <View style={{ backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border, padding: spacing[4], paddingBottom: insets.bottom + spacing[4] }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[2] }}>
          <Text style={{ color: colors.foregroundMuted }}>Subtotal</Text>
          <Text style={{ color: colors.foreground }}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[3] }}>
          <Text style={{ color: colors.foregroundMuted }}>Shipping</Text>
          <Text style={{ color: colors.foreground }}>${shipping.toFixed(2)}</Text>
        </View>
        <Separator style={{ marginBottom: spacing[3] }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[4] }}>
          <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '700' }}>Total</Text>
          <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '700' }}>${total.toFixed(2)}</Text>
        </View>
        <Button onPress={() => Alert.alert('Checkout')}>Checkout</Button>
      </View>
    </View>
  );
}

// ============================================================================
// Followers Screen Preview
// ============================================================================

function FollowersScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('followers');
  const [following, setFollowing] = useState<Record<string, boolean>>({ '2': true });

  const users = [
    { id: '1', name: 'Sarah Miller', username: '@sarahm', avatar: '👩', verified: true },
    { id: '2', name: 'John Davis', username: '@johnd', avatar: '👨' },
    { id: '3', name: 'Emma Wilson', username: '@emmaw', avatar: '👩‍🦰' },
    { id: '4', name: 'Mike Ross', username: '@miker', avatar: '🧑' },
  ];

  const toggleFollow = (id: string) => {
    setFollowing(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + spacing[2], paddingHorizontal: spacing[4], paddingBottom: spacing[2], flexDirection: 'row', alignItems: 'center' }}>
        <IconButton icon={<ProfileBackIcon />} variant="ghost" onPress={onClose} accessibilityLabel="Back" />
        <View style={{ flex: 1, marginLeft: spacing[2] }}>
          <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '600' }}>Jane Doe</Text>
          <Text style={{ color: colors.foregroundMuted, fontSize: 13 }}>@janedoe</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border }}>
        {['followers', 'following'].map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={{ flex: 1, alignItems: 'center', paddingVertical: spacing[3], borderBottomWidth: 2, borderBottomColor: activeTab === tab ? colors.primary : 'transparent' }}
          >
            <Text style={{ color: activeTab === tab ? colors.primary : colors.foregroundMuted, fontWeight: '600' }}>
              {tab === 'followers' ? 'Followers' : 'Following'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Users List */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing[4] }}>
        {users.map((user) => (
          <View key={user.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing[4] }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 24 }}>{user.avatar}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: spacing[3] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: colors.foreground, fontWeight: '600' }}>{user.name}</Text>
                {user.verified && <Text style={{ color: colors.primary, marginLeft: spacing[1] }}>✓</Text>}
              </View>
              <Text style={{ color: colors.foregroundMuted, fontSize: 13 }}>{user.username}</Text>
            </View>
            <Button
              variant={following[user.id] ? 'outline' : 'default'}
              size="sm"
              onPress={() => toggleFollow(user.id)}
            >
              {following[user.id] ? 'Following' : 'Follow'}
            </Button>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ============================================================================
// Comments Screen Preview
// ============================================================================

function CommentsScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [comment, setComment] = useState('');

  const comments = [
    { id: '1', author: 'Sarah', avatar: '👩', text: 'This is amazing! Love the design 🔥', time: '2h', likes: 12 },
    { id: '2', author: 'John', avatar: '👨', text: 'Great work! Keep it up!', time: '1h', likes: 5, replies: [
      { id: '2a', author: 'Emma', avatar: '👩‍🦰', text: 'Totally agree!', time: '45m', likes: 2 },
    ] },
    { id: '3', author: 'Mike', avatar: '🧑', text: 'How did you achieve this effect?', time: '30m', likes: 3 },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + spacing[2], paddingHorizontal: spacing[4], paddingBottom: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton icon={<ProfileBackIcon />} variant="ghost" onPress={onClose} accessibilityLabel="Back" />
        <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '600' }}>Comments</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing[4] }}>
        {comments.map((c) => (
          <View key={c.id} style={{ marginBottom: spacing[4] }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20 }}>{c.avatar}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: spacing[3] }}>
                <View style={{ backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing[3] }}>
                  <Text style={{ color: colors.foreground, fontWeight: '600' }}>{c.author}</Text>
                  <Text style={{ color: colors.foreground, marginTop: spacing[1] }}>{c.text}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing[2], gap: spacing[3] }}>
                  <Text style={{ color: colors.foregroundMuted, fontSize: 12 }}>{c.time}</Text>
                  <Pressable><Text style={{ color: colors.foregroundMuted, fontSize: 12 }}>❤️ {c.likes}</Text></Pressable>
                  <Pressable><Text style={{ color: colors.primary, fontSize: 12 }}>Reply</Text></Pressable>
                </View>
              </View>
            </View>
            {c.replies?.map((r) => (
              <View key={r.id} style={{ flexDirection: 'row', marginTop: spacing[3], marginLeft: 52 }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 16 }}>{r.avatar}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: spacing[2] }}>
                  <View style={{ backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing[2] }}>
                    <Text style={{ color: colors.foreground, fontWeight: '600', fontSize: 13 }}>{r.author}</Text>
                    <Text style={{ color: colors.foreground, fontSize: 13 }}>{r.text}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[3], paddingBottom: insets.bottom + spacing[3], borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        <Input value={comment} onChangeText={setComment} placeholder="Add a comment..." style={{ flex: 1 }} />
        <Button size="sm" onPress={() => { Alert.alert('Comment posted'); setComment(''); }}>Post</Button>
      </View>
    </View>
  );
}

// ============================================================================
// Checkout Screen Preview
// ============================================================================

function CheckoutScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);

  const steps = ['Shipping', 'Payment', 'Review'];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + spacing[2], paddingHorizontal: spacing[4], paddingBottom: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton icon={<ProfileBackIcon />} variant="ghost" onPress={step > 1 ? () => setStep(step - 1) : onClose} accessibilityLabel="Back" />
        <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '600' }}>Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Progress */}
      <View style={{ flexDirection: 'row', paddingHorizontal: spacing[4], paddingVertical: spacing[3] }}>
        {steps.map((s, i) => (
          <View key={s} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 28, height: 28, borderRadius: 14,
              backgroundColor: i + 1 <= step ? colors.primary : colors.secondary,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ color: i + 1 <= step ? colors.primaryForeground : colors.foregroundMuted, fontWeight: '600', fontSize: 13 }}>
                {i + 1}
              </Text>
            </View>
            <Text style={{ color: i + 1 <= step ? colors.foreground : colors.foregroundMuted, marginLeft: spacing[2], fontWeight: i + 1 === step ? '600' : '400', fontSize: 13 }}>
              {s}
            </Text>
            {i < steps.length - 1 && <View style={{ flex: 1, height: 2, backgroundColor: i + 1 < step ? colors.primary : colors.border, marginHorizontal: spacing[2] }} />}
          </View>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing[4] }}>
        {step === 1 && (
          <View style={{ gap: spacing[4] }}>
            <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '600' }}>Shipping Address</Text>
            <Input label="Full Name" placeholder="John Doe" />
            <Input label="Address" placeholder="123 Main St" />
            <View style={{ flexDirection: 'row', gap: spacing[3] }}>
              <Input label="City" placeholder="New York" style={{ flex: 1 }} />
              <Input label="ZIP" placeholder="10001" style={{ flex: 1 }} />
            </View>
          </View>
        )}
        {step === 2 && (
          <View style={{ gap: spacing[4] }}>
            <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '600' }}>Payment Method</Text>
            <View style={{ backgroundColor: colors.card, padding: spacing[4], borderRadius: radius.lg, borderWidth: 2, borderColor: colors.primary }}>
              <Text style={{ color: colors.foreground, fontWeight: '600' }}>💳 Credit Card</Text>
            </View>
            <Input label="Card Number" placeholder="**** **** **** ****" />
            <View style={{ flexDirection: 'row', gap: spacing[3] }}>
              <Input label="Expiry" placeholder="MM/YY" style={{ flex: 1 }} />
              <Input label="CVV" placeholder="***" style={{ flex: 1 }} />
            </View>
          </View>
        )}
        {step === 3 && (
          <View style={{ gap: spacing[4] }}>
            <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '600' }}>Order Summary</Text>
            <View style={{ backgroundColor: colors.card, padding: spacing[4], borderRadius: radius.lg, gap: spacing[3] }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.foregroundMuted }}>Subtotal</Text>
                <Text style={{ color: colors.foreground }}>$499.98</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.foregroundMuted }}>Shipping</Text>
                <Text style={{ color: colors.foreground }}>$9.99</Text>
              </View>
              <Separator />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.foreground, fontWeight: '700' }}>Total</Text>
                <Text style={{ color: colors.foreground, fontWeight: '700' }}>$509.97</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={{ padding: spacing[4], paddingBottom: insets.bottom + spacing[4] }}>
        <Button onPress={() => step < 3 ? setStep(step + 1) : Alert.alert('Order Placed!')}>
          {step < 3 ? 'Continue' : 'Place Order'}
        </Button>
      </View>
    </View>
  );
}

// ============================================================================
// Order History Screen Preview
// ============================================================================

function OrderHistoryScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('all');

  const orders = [
    { id: 'ORD-12345', date: 'Jan 15, 2024', total: 299.99, status: 'Delivered', items: ['🎧', '📱'] },
    { id: 'ORD-12344', date: 'Jan 10, 2024', total: 149.99, status: 'Shipped', items: ['⌚'] },
    { id: 'ORD-12343', date: 'Jan 5, 2024', total: 79.99, status: 'Processing', items: ['🎮'] },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + spacing[2], paddingHorizontal: spacing[4], paddingBottom: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton icon={<ProfileBackIcon />} variant="ghost" onPress={onClose} accessibilityLabel="Back" />
        <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '600' }}>My Orders</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 50 }} contentContainerStyle={{ padding: spacing[4], gap: spacing[2] }}>
        {['all', 'processing', 'shipped', 'delivered'].map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={{
              paddingHorizontal: spacing[4], paddingVertical: spacing[2],
              backgroundColor: activeTab === tab ? colors.primary : colors.secondary,
              borderRadius: radius.full,
            }}
          >
            <Text style={{ color: activeTab === tab ? colors.primaryForeground : colors.foreground, fontWeight: '500' }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing[4] }}>
        {orders.map((order) => (
          <Pressable
            key={order.id}
            onPress={() => Alert.alert('Order Details', order.id)}
            style={{ backgroundColor: colors.card, padding: spacing[4], borderRadius: radius.lg, marginBottom: spacing[3], borderWidth: 1, borderColor: colors.border }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[2] }}>
              <Text style={{ color: colors.foreground, fontWeight: '600' }}>{order.id}</Text>
              <Badge variant={order.status === 'Delivered' ? 'success' : order.status === 'Shipped' ? 'default' : 'secondary'}>
                {order.status}
              </Badge>
            </View>
            <Text style={{ color: colors.foregroundMuted, fontSize: 13 }}>{order.date}</Text>
            <View style={{ flexDirection: 'row', marginTop: spacing[3], gap: spacing[2] }}>
              {order.items.map((item, i) => (
                <View key={i} style={{ width: 40, height: 40, backgroundColor: colors.secondary, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' }}>
                  <Text>{item}</Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing[3] }}>
              <Text style={{ color: colors.foregroundMuted }}>{order.items.length} items</Text>
              <Text style={{ color: colors.foreground, fontWeight: '700' }}>${order.total}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

// ============================================================================
// Home Screen Preview
// ============================================================================

function HomeScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();

  const stats = [
    { label: 'Orders', value: '12' },
    { label: 'Wishlist', value: '24' },
    { label: 'Points', value: '1.2K' },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing[4] }}>
        {/* Header */}
        <View style={{ paddingTop: insets.top + spacing[2], paddingHorizontal: spacing[4], paddingBottom: spacing[4], flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Avatar fallback="JD" size="md" />
            <View style={{ marginLeft: spacing[3] }}>
              <Text style={{ color: colors.foregroundMuted, fontSize: 13 }}>Welcome back</Text>
              <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '700' }}>John Doe</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: spacing[2] }}>
            <IconButton icon={<SearchIcon />} variant="ghost" onPress={() => Alert.alert('Search')} accessibilityLabel="Search" />
            <IconButton icon={<BellIcon />} variant="ghost" onPress={onClose} accessibilityLabel="Notifications" />
          </View>
        </View>

        {/* Hero */}
        <View style={{ marginHorizontal: spacing[4], height: 160, backgroundColor: colors.primary, borderRadius: radius.xl, padding: spacing[5], justifyContent: 'flex-end' }}>
          <Text style={{ color: colors.primaryForeground, fontSize: 22, fontWeight: '700' }}>Summer Sale!</Text>
          <Text style={{ color: colors.primaryForeground, opacity: 0.9, marginTop: spacing[1] }}>Up to 50% off selected items</Text>
          <Button variant="secondary" size="sm" style={{ marginTop: spacing[3], alignSelf: 'flex-start' }} onPress={() => Alert.alert('Shop Now')}>
            Shop Now
          </Button>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', marginHorizontal: spacing[4], marginTop: spacing[4], gap: spacing[3] }}>
          {stats.map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: colors.card, padding: spacing[4], borderRadius: radius.lg, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: colors.foreground, fontSize: 24, fontWeight: '700' }}>{stat.value}</Text>
              <Text style={{ color: colors.foregroundMuted, fontSize: 13, marginTop: spacing[1] }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Categories */}
        <View style={{ marginTop: spacing[6], paddingHorizontal: spacing[4] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[3] }}>
            <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '600' }}>Categories</Text>
            <Pressable><Text style={{ color: colors.primary }}>See All</Text></Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['👕 Fashion', '💻 Tech', '🏠 Home', '🎮 Gaming', '📚 Books'].map((cat) => (
              <Pressable key={cat} style={{ backgroundColor: colors.card, paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderRadius: radius.full, marginRight: spacing[2], borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ color: colors.foreground }}>{cat}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================================================
// Account Screen Preview
// ============================================================================

function AccountScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();

  const menuItems = [
    { icon: '📦', label: 'My Orders', subtitle: '12 orders' },
    { icon: '❤️', label: 'Wishlist', subtitle: '24 items' },
    { icon: '📍', label: 'Addresses', subtitle: '2 saved' },
    { icon: '💳', label: 'Payment Methods', subtitle: '3 cards' },
    { icon: '🔔', label: 'Notifications' },
    { icon: '🔒', label: 'Privacy & Security' },
    { icon: '❓', label: 'Help & Support' },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + spacing[2], paddingHorizontal: spacing[4], paddingBottom: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton icon={<ProfileBackIcon />} variant="ghost" onPress={onClose} accessibilityLabel="Back" />
        <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '600' }}>Account</Text>
        <IconButton icon={<SettingsIcon />} variant="ghost" onPress={() => Alert.alert('Settings')} accessibilityLabel="Settings" />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + spacing[4] }}>
        {/* Profile Card */}
        <View style={{ margin: spacing[4], backgroundColor: colors.card, padding: spacing[4], borderRadius: radius.xl, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
          <Avatar fallback="JD" size="xl" />
          <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: '700', marginTop: spacing[3] }}>John Doe</Text>
          <Text style={{ color: colors.foregroundMuted, marginTop: spacing[1] }}>john@example.com</Text>
          <Button variant="outline" size="sm" style={{ marginTop: spacing[3] }} onPress={() => Alert.alert('Edit Profile')}>
            Edit Profile
          </Button>
        </View>

        {/* Menu Items */}
        <View style={{ marginHorizontal: spacing[4] }}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.label}
              onPress={() => Alert.alert(item.label)}
              style={{
                flexDirection: 'row', alignItems: 'center', padding: spacing[4],
                backgroundColor: colors.card, borderTopLeftRadius: index === 0 ? radius.lg : 0, borderTopRightRadius: index === 0 ? radius.lg : 0,
                borderBottomLeftRadius: index === menuItems.length - 1 ? radius.lg : 0, borderBottomRightRadius: index === menuItems.length - 1 ? radius.lg : 0,
                borderBottomWidth: index < menuItems.length - 1 ? 1 : 0, borderBottomColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              <View style={{ flex: 1, marginLeft: spacing[3] }}>
                <Text style={{ color: colors.foreground, fontWeight: '500' }}>{item.label}</Text>
                {item.subtitle && <Text style={{ color: colors.foregroundMuted, fontSize: 13 }}>{item.subtitle}</Text>}
              </View>
              <Text style={{ color: colors.foregroundMuted }}>›</Text>
            </Pressable>
          ))}
        </View>

        {/* Sign Out */}
        <View style={{ margin: spacing[4] }}>
          <Button variant="outline" onPress={() => Alert.alert('Sign Out')}>
            <Text style={{ color: colors.destructive }}>Sign Out</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================================================
// Help Screen Preview
// ============================================================================

function HelpScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState<string | null>(null);

  const faqs = [
    { id: '1', q: 'How do I track my order?', a: 'You can track your order by going to My Orders and selecting the order you want to track. Click on "Track Order" to see real-time updates.' },
    { id: '2', q: 'What is your return policy?', a: 'We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Some exclusions apply.' },
    { id: '3', q: 'How do I contact customer support?', a: 'You can reach us via email at support@example.com, through live chat, or by calling 1-800-EXAMPLE.' },
  ];

  const contactOptions = [
    { icon: '💬', label: 'Live Chat', desc: 'Chat with us now' },
    { icon: '📧', label: 'Email', desc: 'support@example.com' },
    { icon: '📞', label: 'Call Us', desc: '1-800-EXAMPLE' },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + spacing[2], paddingHorizontal: spacing[4], paddingBottom: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton icon={<ProfileBackIcon />} variant="ghost" onPress={onClose} accessibilityLabel="Back" />
        <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '600' }}>Help & Support</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing[4], paddingBottom: insets.bottom + spacing[4] }}>
        {/* Search */}
        <SearchInput placeholder="Search for help..." style={{ marginBottom: spacing[4] }} />

        {/* FAQs */}
        <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '600', marginBottom: spacing[3] }}>
          Frequently Asked Questions
        </Text>
        <View style={{ gap: spacing[2], marginBottom: spacing[6] }}>
          {faqs.map((faq) => (
            <Pressable
              key={faq.id}
              onPress={() => setExpanded(expanded === faq.id ? null : faq.id)}
              style={{ backgroundColor: colors.card, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4] }}>
                <Text style={{ color: colors.foreground, fontWeight: '500', flex: 1 }}>{faq.q}</Text>
                <Text style={{ color: colors.foregroundMuted }}>{expanded === faq.id ? '−' : '+'}</Text>
              </View>
              {expanded === faq.id && (
                <View style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[4] }}>
                  <Text style={{ color: colors.foregroundMuted, lineHeight: 20 }}>{faq.a}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Contact */}
        <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '600', marginBottom: spacing[3] }}>
          Contact Us
        </Text>
        <View style={{ gap: spacing[3] }}>
          {contactOptions.map((opt) => (
            <Pressable
              key={opt.label}
              onPress={() => Alert.alert(opt.label)}
              style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: spacing[4], borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border }}
            >
              <Text style={{ fontSize: 24 }}>{opt.icon}</Text>
              <View style={{ marginLeft: spacing[3] }}>
                <Text style={{ color: colors.foreground, fontWeight: '600' }}>{opt.label}</Text>
                <Text style={{ color: colors.foregroundMuted, fontSize: 13 }}>{opt.desc}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  intro: {
    fontSize: 14,
    lineHeight: 20,
  },
  screenCard: {},
  screenTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  screenDescription: {
    fontSize: 14,
  },
  screen: {
    flex: 1,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  header: {
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
