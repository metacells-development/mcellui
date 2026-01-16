import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Alert, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@nativeui/core';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

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

function OnboardingScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);

  const slides = [
    { title: 'Welcome to MyApp', description: 'Discover amazing features that will change how you work and connect with others.' },
    { title: 'Stay Organized', description: 'Keep all your important tasks, notes, and projects in one beautiful place.' },
    { title: 'Connect & Share', description: 'Share your moments with friends and family instantly from anywhere.' },
  ];

  const isLastStep = currentStep === slides.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Skip Button */}
      {!isLastStep && (
        <Pressable
          onPress={onClose}
          style={{ position: 'absolute', top: insets.top + spacing[2], right: spacing[4], zIndex: 10 }}
        >
          <Text style={{ color: colors.foregroundMuted, fontSize: 16 }}>Skip</Text>
        </Pressable>
      )}

      {/* Content */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing[6] }}>
        {/* Illustration Placeholder */}
        <View
          style={{
            width: 200,
            height: 200,
            backgroundColor: colors.primary + '20',
            borderRadius: radius.xl,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing[8],
          }}
        >
          <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="8" r="4" fill={colors.primary} />
            <Path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill={colors.primary} />
          </Svg>
        </View>

        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.foreground, textAlign: 'center' }}>
          {slides[currentStep].title}
        </Text>
        <Text style={{ fontSize: 16, color: colors.foregroundMuted, textAlign: 'center', marginTop: spacing[3], lineHeight: 24 }}>
          {slides[currentStep].description}
        </Text>
      </View>

      {/* Bottom */}
      <View style={{ paddingHorizontal: spacing[6], paddingBottom: insets.bottom + spacing[4] }}>
        {/* Pagination */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: spacing[6] }}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={{
                width: index === currentStep ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: index === currentStep ? colors.primary : colors.border,
                marginHorizontal: spacing[1],
              }}
            />
          ))}
        </View>

        <Button onPress={handleNext}>
          {isLastStep ? 'Get Started' : 'Next'}
        </Button>
      </View>
    </View>
  );
}

// ============================================================================
// Profile Screen Preview
// ============================================================================

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
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: insets.top + spacing[2], paddingHorizontal: spacing[4], paddingBottom: spacing[2] }}>
        <Pressable onPress={onClose} style={{ padding: 8 }}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={colors.foreground} strokeWidth={2}>
            <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable style={{ padding: 8 }}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={colors.foreground} strokeWidth={2}>
            <Circle cx="12" cy="12" r="3" />
            <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </Svg>
        </Pressable>
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

function SettingsScreenPreview({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const sections = [
    {
      title: 'Account',
      items: [
        { label: 'Profile', value: 'Jane Doe', type: 'navigation' as const },
        { label: 'Email', value: 'jane@example.com', type: 'navigation' as const },
        { label: 'Password', type: 'navigation' as const },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { label: 'Notifications', type: 'toggle' as const, value: notifications, onToggle: setNotifications },
        { label: 'Dark Mode', type: 'toggle' as const, value: darkMode, onToggle: setDarkMode },
        { label: 'Language', value: 'English', type: 'navigation' as const },
      ],
    },
    {
      title: 'Support',
      items: [
        { label: 'Help Center', type: 'navigation' as const },
        { label: 'Contact Us', type: 'navigation' as const },
        { label: 'Privacy Policy', type: 'navigation' as const },
      ],
    },
    {
      items: [
        { label: 'Sign Out', type: 'destructive' as const },
      ],
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
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
        <Pressable onPress={onClose} style={{ padding: 8, marginLeft: -8 }}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={colors.foreground} strokeWidth={2}>
            <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>
        <Text style={{ fontSize: 17, fontWeight: '600', color: colors.foreground }}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing[4],
          paddingTop: spacing[4],
          paddingBottom: insets.bottom + spacing[6],
        }}
      >
        {sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={{ marginBottom: spacing[6] }}>
            {section.title && (
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                letterSpacing: 0.5,
                color: colors.foregroundMuted,
                marginBottom: spacing[2],
                marginLeft: spacing[2],
              }}>
                {section.title.toUpperCase()}
              </Text>
            )}
            <View style={{ backgroundColor: colors.card, borderRadius: radius.lg, overflow: 'hidden' }}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  <Pressable
                    onPress={() => item.type !== 'toggle' && Alert.alert(item.label)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: spacing[4],
                      paddingHorizontal: spacing[4],
                    }}
                  >
                    <Text style={{
                      flex: 1,
                      fontSize: 16,
                      color: item.type === 'destructive' ? colors.destructive : colors.foreground,
                    }}>
                      {item.label}
                    </Text>
                    {item.type === 'navigation' && (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {item.value && (
                          <Text style={{ color: colors.foregroundMuted, fontSize: 15, marginRight: spacing[2] }}>
                            {item.value}
                          </Text>
                        )}
                        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.foregroundMuted} strokeWidth={2}>
                          <Path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                      </View>
                    )}
                    {item.type === 'toggle' && (
                      <Switch checked={item.value} onCheckedChange={item.onToggle} />
                    )}
                  </Pressable>
                  {itemIndex < section.items.length - 1 && (
                    <Separator style={{ marginLeft: spacing[4] }} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Footer */}
        <View style={{ alignItems: 'center', marginTop: spacing[4] }}>
          <Text style={{ color: colors.foregroundMuted, fontSize: 13 }}>Version 1.0.0</Text>
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
