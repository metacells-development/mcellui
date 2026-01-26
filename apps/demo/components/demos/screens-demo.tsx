import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

// Import all registry screen components
import { LoginScreen } from '@/components/screens/login-screen';
import { SignUpScreen } from '@/components/screens/signup-screen';
import { OnboardingScreen } from '@/components/screens/onboarding-screen';
import { ProfileScreen } from '@/components/screens/profile-screen';
import { SettingsScreen } from '@/components/screens/settings-screen';
import { SearchScreen } from '@/components/screens/search-screen';
import { ChatScreen } from '@/components/screens/chat-screen';
import { NotificationsScreen } from '@/components/screens/notifications-screen';
import { FeedScreen } from '@/components/screens/feed-screen';
import { OTPVerificationScreen } from '@/components/screens/otp-verification-screen';
import { ProductDetailScreen } from '@/components/screens/product-detail-screen';
import { CartScreen } from '@/components/screens/cart-screen';
import { FollowersScreen } from '@/components/screens/followers-screen';
import { CommentsScreen } from '@/components/screens/comments-screen';
import { CheckoutScreen } from '@/components/screens/checkout-screen';
import { OrderHistoryScreen } from '@/components/screens/order-history-screen';
import { HomeScreen } from '@/components/screens/home-screen';
import { AccountScreen } from '@/components/screens/account-screen';
import { HelpScreen } from '@/components/screens/help-screen';

// ============================================================================
// Mock Data Types
// ============================================================================

interface MockCartItem {
  id: string;
  product: {
    name: string;
    price: number;
    image?: string;
    size?: string;
    color?: string;
  };
  quantity: number;
}

interface MockFeedPost {
  id: string;
  user: {
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  content: string;
  time: string;
  hasImage?: boolean;
  imageUrl?: string;
  likes: number;
  comments: number;
  liked: boolean;
}

interface MockNotification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: {
    name: string;
    avatar?: string;
  };
  message: string;
  time: string;
  read: boolean;
}

// MockMessage removed - using ChatMessage interface from ChatScreen

interface MockUser {
  id: string;
  name: string;
  username?: string;
  bio?: string;
  avatar?: string;
  verified?: boolean;
  following?: boolean;
}

interface MockComment {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  time: string;
  likes: number;
  liked: boolean;
  replies?: MockComment[];
}

interface MockProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  rating: number;
  reviews: number;
  sizes?: string[];
  colors?: string[];
}

interface MockOrder {
  id: string;
  date: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  items: number;
  total: number;
  trackingNumber?: string;
}

// ============================================================================
// Mock Data Constants
// ============================================================================

const MOCK_ONBOARDING_SLIDES = [
  {
    key: '1',
    title: 'Welcome to the App',
    description: 'Discover amazing features that will make your life easier and more productive.',
  },
  {
    key: '2',
    title: 'Stay Connected',
    description: 'Keep in touch with friends and family, share moments, and build meaningful connections.',
  },
  {
    key: '3',
    title: 'Get Started',
    description: 'Create your account and start exploring all the features we have to offer.',
  },
];

const MOCK_CART_ITEMS: MockCartItem[] = [
  {
    id: '1',
    product: {
      name: 'Wireless Headphones',
      price: 129.99,
      size: 'One Size',
      color: 'Black',
    },
    quantity: 1,
  },
  {
    id: '2',
    product: {
      name: 'Smart Watch Series 7',
      price: 399.99,
      size: '42mm',
      color: 'Space Gray',
    },
    quantity: 1,
  },
  {
    id: '3',
    product: {
      name: 'USB-C Cable (2m)',
      price: 19.99,
    },
    quantity: 2,
  },
];

const MOCK_FEED_POSTS: MockFeedPost[] = [
  {
    id: '1',
    user: { name: 'Sarah Chen', verified: true },
    content: 'Just launched our new design system! Check it out and let me know what you think. 🚀',
    time: '2h',
    hasImage: true,
    likes: 234,
    comments: 18,
    liked: false,
  },
  {
    id: '2',
    user: { name: 'Alex Rivera' },
    content: 'Morning coffee hits different when you\'re working on something you love ☕️',
    time: '5h',
    likes: 89,
    comments: 7,
    liked: true,
  },
  {
    id: '3',
    user: { name: 'Maya Patel', verified: true },
    content: 'Hot take: Dark mode is not just about aesthetics, it\'s about accessibility and user comfort. Here\'s why...',
    time: '8h',
    hasImage: true,
    likes: 456,
    comments: 43,
    liked: false,
  },
];

const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: '1',
    type: 'like',
    user: { name: 'Emma Wilson' },
    message: 'liked your post',
    time: '5m',
    read: false,
  },
  {
    id: '2',
    type: 'comment',
    user: { name: 'James Lee' },
    message: 'commented on your photo: "This looks amazing!"',
    time: '1h',
    read: false,
  },
  {
    id: '3',
    type: 'follow',
    user: { name: 'Sophia Kim' },
    message: 'started following you',
    time: '3h',
    read: true,
  },
];

const MOCK_MESSAGES = [
  { id: '1', text: 'Hey! How are you?', isMe: false, time: '10:30 AM' },
  { id: '2', text: 'I\'m good! Just working on the new project', isMe: true, time: '10:32 AM' },
  { id: '3', text: 'Nice! How\'s it going?', isMe: false, time: '10:33 AM' },
  { id: '4', text: 'Pretty well, should be done by Friday', isMe: true, time: '10:35 AM' },
];

const MOCK_USERS: MockUser[] = [
  { id: '1', name: 'Emma Wilson', username: '@emmawilson', verified: true, following: false },
  { id: '2', name: 'James Lee', username: '@jameslee', following: true },
  { id: '3', name: 'Sophia Kim', username: '@sophiakim', verified: true, following: false },
  { id: '4', name: 'Michael Chen', username: '@mchen', following: true },
];

const MOCK_COMMENTS: MockComment[] = [
  {
    id: '1',
    user: { name: 'Emma Wilson' },
    content: 'This is absolutely amazing! Great work on the design.',
    time: '2h',
    likes: 12,
    liked: false,
    replies: [
      {
        id: '1-1',
        user: { name: 'Original Poster' },
        content: 'Thank you so much! Glad you liked it.',
        time: '1h',
        likes: 3,
        liked: false,
      },
    ],
  },
  {
    id: '2',
    user: { name: 'James Lee' },
    content: 'Would love to see more details about the implementation!',
    time: '4h',
    likes: 8,
    liked: true,
  },
];

const MOCK_PRODUCT: MockProduct = {
  id: '1',
  name: 'Premium Wireless Headphones',
  price: 299.99,
  description: 'High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality.',
  images: [],
  rating: 4.5,
  reviews: 128,
  sizes: ['One Size'],
  colors: ['Black', 'White', 'Blue'],
};

const MOCK_ORDERS: MockOrder[] = [
  {
    id: 'ORD-001',
    date: 'Jan 20, 2026',
    status: 'delivered',
    items: 3,
    total: 249.99,
    trackingNumber: 'TRK123456789',
  },
  {
    id: 'ORD-002',
    date: 'Jan 15, 2026',
    status: 'shipped',
    items: 1,
    total: 89.99,
    trackingNumber: 'TRK987654321',
  },
  {
    id: 'ORD-003',
    date: 'Jan 10, 2026',
    status: 'processing',
    items: 2,
    total: 149.99,
  },
];

const MOCK_CATEGORIES = [
  { id: '1', name: 'Electronics', icon: '📱' },
  { id: '2', name: 'Fashion', icon: '👕' },
  { id: '3', name: 'Home', icon: '🏠' },
  { id: '4', name: 'Sports', icon: '⚽' },
];

const MOCK_FAQ_ITEMS = [
  {
    id: '1',
    question: 'How do I reset my password?',
    answer: 'You can reset your password by clicking on "Forgot Password" on the login screen.',
  },
  {
    id: '2',
    question: 'How do I track my order?',
    answer: 'Go to Order History and click on the order you want to track.',
  },
  {
    id: '3',
    question: 'What payment methods do you accept?',
    answer: 'We accept credit cards, debit cards, and PayPal.',
  },
];

// ============================================================================
// Demo Component
// ============================================================================

export function ScreensDemo() {
  const { colors, spacing } = useTheme();
  const [activeScreen, setActiveScreen] = useState<string | null>(null);

  // Demo state for interactive screens
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>();
  const [signupLoading, setSignupLoading] = useState(false);
  const [feedPosts, setFeedPosts] = useState(MOCK_FEED_POSTS);
  const [feedEmpty, setFeedEmpty] = useState(false);
  const [feedRefreshing, setFeedRefreshing] = useState(false);
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);
  const [cartLoading, setCartLoading] = useState<string>();
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [profileFollowing, setProfileFollowing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

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

  // Handler for login screen
  const handleLogin = async (email: string, password: string) => {
    setLoginLoading(true);
    setLoginError(undefined);

    // Simulate API call
    setTimeout(() => {
      if (email === 'error@test.com') {
        setLoginError('Invalid email or password');
      }
      setLoginLoading(false);
    }, 1500);
  };

  // Handler for signup screen
  const handleSignup = async (name: string, email: string, password: string) => {
    setSignupLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSignupLoading(false);
      setActiveScreen(null);
    }, 2000);
  };

  // Handler for feed refresh
  const handleFeedRefresh = async () => {
    // Simulate refresh - toggle between empty and populated
    setFeedRefreshing(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (feedEmpty) {
          setFeedPosts(MOCK_FEED_POSTS);
          setFeedEmpty(false);
        }
        setFeedRefreshing(false);
        resolve();
      }, 1000);
    });
  };

  // Handler for cart quantity change
  const handleCartQuantityChange = (itemId: string, quantity: number) => {
    setCartLoading(itemId);
    setTimeout(() => {
      setCartItems((items) =>
        items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
      setCartLoading(undefined);
    }, 300);
  };

  // Handler for cart item removal
  const handleCartRemove = (itemId: string) => {
    setCartLoading(itemId);
    setTimeout(() => {
      setCartItems((items) => items.filter((item) => item.id !== itemId));
      setCartLoading(undefined);
    }, 500);
  };

  // Handler for profile follow toggle
  const handleProfileFollow = () => {
    setProfileLoading(true);
    setTimeout(() => {
      setProfileFollowing(!profileFollowing);
      setProfileLoading(false);
    }, 800);
  };

  // Handler for checkout step navigation
  const handleCheckoutNext = () => {
    setCheckoutStep((prev) => Math.min(prev + 1, 3));
  };

  const handleCheckoutPrevious = () => {
    setCheckoutStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: colors.foregroundMuted, marginBottom: spacing[6], fontSize: 14, lineHeight: 20 }}>
        Full-page screen templates ready to customize. Tap a screen to preview it.
      </Text>

      <View style={{ gap: spacing[3] }}>
        {screens.map((screen) => (
          <Pressable
            key={screen.key}
            onPress={() => setActiveScreen(screen.key)}
            style={({ pressed }) => [
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
            <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: '600' }}>
              {screen.title}
            </Text>
            <Text style={{ color: colors.foregroundMuted, marginTop: spacing[1], fontSize: 14 }}>
              {screen.description}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Screen Modals - Using actual registry components */}

      <Modal visible={activeScreen === 'login'} animationType="slide">
        <LoginScreen
          onLogin={handleLogin}
          onSocialLogin={(provider) => console.log('Social login:', provider)}
          onForgotPassword={() => console.log('Forgot password')}
          onSignUp={() => setActiveScreen('signup')}
          loading={loginLoading}
          error={loginError}
          appName="McellUI Demo"
        />
        {/* Add close button overlay */}
        <Pressable
          onPress={() => {
            setActiveScreen(null);
            setLoginError(undefined);
          }}
          style={{ position: 'absolute', top: 50, right: 20, zIndex: 10 }}
        >
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>Close</Text>
        </Pressable>
      </Modal>

      <Modal visible={activeScreen === 'signup'} animationType="slide">
        <SignUpScreen
          onSignUp={handleSignup}
          onSocialSignUp={(provider) => console.log('Social signup:', provider)}
          onLogin={() => setActiveScreen('login')}
          loading={signupLoading}
          appName="McellUI Demo"
        />
        <Pressable
          onPress={() => setActiveScreen(null)}
          style={{ position: 'absolute', top: 50, right: 20, zIndex: 10 }}
        >
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>Close</Text>
        </Pressable>
      </Modal>

      <Modal visible={activeScreen === 'onboarding'} animationType="slide">
        <OnboardingScreen
          slides={MOCK_ONBOARDING_SLIDES}
          onComplete={() => setActiveScreen(null)}
          onSkip={() => setActiveScreen(null)}
        />
      </Modal>

      <Modal visible={activeScreen === 'profile'} animationType="slide">
        <ProfileScreen
          user={{
            name: 'Sarah Chen',
            username: '@sarahchen',
            bio: 'Product Designer • UI/UX Enthusiast • Coffee Lover ☕️',
            verified: true,
            stats: {
              posts: 234,
              followers: profileFollowing ? 12501 : 12500,
              following: 432,
            },
          }}
          tabs={[
            {
              key: 'posts',
              title: 'Posts',
              badge: 234,
              content: (
                <View style={{ paddingVertical: 32, alignItems: 'center' }}>
                  <Text style={{ color: '#888' }}>User posts would appear here</Text>
                </View>
              ),
            },
            {
              key: 'likes',
              title: 'Likes',
              content: (
                <View style={{ paddingVertical: 32, alignItems: 'center' }}>
                  <Text style={{ color: '#888' }}>Liked posts would appear here</Text>
                </View>
              ),
            },
            {
              key: 'media',
              title: 'Media',
              content: (
                <View style={{ paddingVertical: 32, alignItems: 'center' }}>
                  <Text style={{ color: '#888' }}>Media gallery would appear here</Text>
                </View>
              ),
            },
          ]}
          isOwnProfile={false}
          isFollowing={profileFollowing}
          onBackPress={() => setActiveScreen(null)}
          onFollowPress={handleProfileFollow}
          onMessagePress={() => console.log('Message')}
        />
      </Modal>

      <Modal visible={activeScreen === 'settings'} animationType="slide">
        <SettingsScreen
          onBackPress={() => setActiveScreen(null)}
          sections={[
            {
              title: 'Account',
              items: [
                { type: 'navigation', label: 'Profile', value: 'Sarah Chen', onPress: () => console.log('Profile') },
                { type: 'navigation', label: 'Email', value: 'sarah@example.com', onPress: () => console.log('Email') },
              ],
            },
            {
              title: 'Preferences',
              items: [
                { type: 'toggle', label: 'Dark Mode', value: false, onValueChange: (v) => console.log('Dark mode:', v) },
                { type: 'toggle', label: 'Notifications', value: true, onValueChange: (v) => console.log('Notifications:', v) },
              ],
            },
            {
              title: 'About',
              items: [
                { type: 'navigation', label: 'Version', value: '1.0.0' },
                { type: 'button', label: 'Log Out', variant: 'destructive', onPress: () => console.log('Logout') },
              ],
            },
          ]}
        />
      </Modal>

      <Modal visible={activeScreen === 'search'} animationType="slide">
        <SearchScreen
          onSearch={(query) => console.log('Search:', query)}
          onResultPress={(result) => console.log('Result pressed:', result)}
        />
      </Modal>

      <Modal visible={activeScreen === 'chat'} animationType="slide">
        <ChatScreen
          recipient={{ name: 'Alex Rivera', status: 'online' }}
          messages={MOCK_MESSAGES}
          onBack={() => setActiveScreen(null)}
          onSendMessage={(text) => console.log('Send:', text)}
        />
      </Modal>

      <Modal visible={activeScreen === 'notifications'} animationType="slide">
        <NotificationsScreen
          notifications={MOCK_NOTIFICATIONS}
          onBack={() => setActiveScreen(null)}
          onNotificationPress={(id) => console.log('Notification:', id)}
          onMarkAllRead={() => console.log('Mark all read')}
        />
      </Modal>

      <Modal visible={activeScreen === 'feed'} animationType="slide">
        <FeedScreen
          posts={feedEmpty ? [] : feedPosts}
          onLike={(postId) => console.log('Like:', postId)}
          onComment={(postId) => console.log('Comment:', postId)}
          onShare={(postId) => console.log('Share:', postId)}
          onNewPost={() => console.log('New post')}
          onBack={() => setActiveScreen(null)}
          onRefresh={handleFeedRefresh}
          emptyTitle="No posts yet"
          emptyMessage="Pull to refresh to load posts"
          title="Feed"
        />
      </Modal>

      <Modal visible={activeScreen === 'otp'} animationType="slide">
        <OTPVerificationScreen
          phoneNumber="+1 (555) 123-4567"
          onVerify={(code) => {
            console.log('OTP:', code);
            setActiveScreen(null);
          }}
          onResend={() => console.log('Resend')}
          onBack={() => setActiveScreen(null)}
        />
      </Modal>

      <Modal visible={activeScreen === 'product-detail'} animationType="slide">
        <ProductDetailScreen
          product={MOCK_PRODUCT}
          onBack={() => setActiveScreen(null)}
          onAddToCart={() => console.log('Add to cart')}
          onBuyNow={() => console.log('Buy now')}
          onSharePress={() => console.log('Share')}
          onFavoritePress={() => console.log('Favorite')}
        />
      </Modal>

      <Modal visible={activeScreen === 'cart'} animationType="slide">
        <CartScreen
          items={cartItems}
          currency="$"
          shippingCost={9.99}
          tax={45.99}
          onBack={() => setActiveScreen(null)}
          onQuantityChange={handleCartQuantityChange}
          onRemoveItem={handleCartRemove}
          onCheckout={() => {
            setActiveScreen('checkout');
            setCheckoutStep(1);
          }}
          onContinueShopping={() => setActiveScreen(null)}
        />
      </Modal>

      <Modal visible={activeScreen === 'followers'} animationType="slide">
        <FollowersScreen
          users={MOCK_USERS}
          onBack={() => setActiveScreen(null)}
          onUserPress={(userId) => console.log('User:', userId)}
          onFollowToggle={(userId) => console.log('Toggle follow:', userId)}
        />
      </Modal>

      <Modal visible={activeScreen === 'comments'} animationType="slide">
        <CommentsScreen
          comments={MOCK_COMMENTS}
          onBack={() => setActiveScreen(null)}
          onLike={(commentId) => console.log('Like comment:', commentId)}
          onReply={(commentId) => console.log('Reply to:', commentId)}
          onSend={(text) => console.log('Send comment:', text)}
        />
      </Modal>

      <Modal visible={activeScreen === 'checkout'} animationType="slide">
        <CheckoutScreen
          cartTotal={569.96}
          onBack={() => setActiveScreen(null)}
          onPlaceOrder={(data) => {
            console.log('Order placed:', data);
            setActiveScreen(null);
          }}
        />
      </Modal>

      <Modal visible={activeScreen === 'order-history'} animationType="slide">
        <OrderHistoryScreen
          orders={MOCK_ORDERS}
          onBack={() => setActiveScreen(null)}
          onOrderPress={(orderId) => console.log('Order:', orderId)}
          onTrackPress={(orderId) => console.log('Track:', orderId)}
        />
      </Modal>

      <Modal visible={activeScreen === 'home'} animationType="slide">
        <HomeScreen
          userName="Sarah"
          onMenuPress={() => console.log('Menu')}
          onNotificationPress={() => setActiveScreen('notifications')}
          onSearchPress={() => setActiveScreen('search')}
          onCategoryPress={(category) => console.log('Category:', category)}
          onProductPress={(productId) => console.log('Product:', productId)}
        />
      </Modal>

      <Modal visible={activeScreen === 'account'} animationType="slide">
        <AccountScreen
          user={{
            name: 'Sarah Chen',
            email: 'sarah.chen@example.com',
            phone: '+1 (555) 123-4567',
            joinDate: 'January 2024',
          }}
          onBack={() => setActiveScreen(null)}
          onEditProfile={() => console.log('Edit profile')}
          onChangePassword={() => console.log('Change password')}
          onDeleteAccount={() => console.log('Delete account')}
        />
      </Modal>

      <Modal visible={activeScreen === 'help'} animationType="slide">
        <HelpScreen
          onBack={() => setActiveScreen(null)}
          onFAQPress={(faq) => console.log('FAQ:', faq)}
          onContactPress={(method) => console.log('Contact:', method)}
        />
      </Modal>
    </View>
  );
}
