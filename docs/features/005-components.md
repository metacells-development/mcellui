# Feature: Components

55+ UI-Komponenten, organisiert in 4 Ebenen.

## Architektur: Die 4 Ebenen

```
┌─────────────────────────────────────────────────────────────────┐
│  EBENE 4: SCREENS                                               │
│  Komplette App-Screens, ready to use                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  EBENE 3: BLOCKS                                        │   │
│  │  Wiederverwendbare Screen-Sections                      │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  EBENE 2: COMPONENTS                            │   │   │
│  │  │  Styled, animierte UI-Elemente                  │   │   │
│  │  │  ┌─────────────────────────────────────────┐   │   │   │
│  │  │  │  EBENE 1: PRIMITIVES                    │   │   │   │
│  │  │  │  Unstyled Building Blocks               │   │   │   │
│  │  │  └─────────────────────────────────────────┘   │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Ebene 1: Primitives

Minimale, unstyled Building Blocks. Keine Styles, nur Logik.

```
primitives/
├── Pressable/          # Enhanced TouchableOpacity
├── Portal/             # Für Overlays
├── FocusTrap/          # Keyboard Navigation
├── Slot/               # Radix-like Composition
└── VisuallyHidden/     # Screen Reader only
```

**Wann nutzen:** Wenn du komplett custom Components bauen willst.

### Ebene 2: Components

Styled, animierte Komponenten. Das Herzstück.

#### Inputs & Forms
```
├── button/
├── button-group/
├── input/
├── textarea/
├── checkbox/
├── switch/
├── radio-group/
├── slider/
├── select/              # Bottom Sheet Select
├── native-select/       # iOS Picker / Android Spinner
├── input-otp/
├── search-input/
└── field/               # Label + Input + Error
```

#### Data Display
```
├── avatar/
├── badge/
├── card/
├── empty/               # Empty States
├── list-item/
├── separator/
├── skeleton/
├── spinner/
├── table/
├── progress/
└── kbd/
```

#### Overlays & Feedback
```
├── action-sheet/        # iOS Action Sheet
├── alert-dialog/
├── bottom-sheet/        # Drawer equivalent
├── dialog/              # Modal
├── popover/
├── tooltip/
├── toast/
├── hover-card/          # Long-press Card
└── context-menu/        # Long-press Menu
```

#### Navigation
```
├── tabs/
├── segmented-control/   # iOS Style
├── navigation-bar/
├── tab-bar/
├── breadcrumb/
├── pagination/
└── sidebar/             # Tablets
```

#### Layout
```
├── accordion/
├── collapsible/
├── scroll-area/
├── carousel/
└── resizable/           # Split Views
```

### Ebene 3: Blocks

Wiederverwendbare Sections die aus mehreren Components bestehen.

**Wann nutzen:** Für wiederkehrende UI-Patterns in deiner App.

```
blocks/
├── auth/
│   ├── login-01/        # Email + Password
│   ├── login-02/        # Social Only
│   ├── login-03/        # Phone Number
│   ├── signup-01/
│   ├── otp-01/
│   └── forgot-password/
├── onboarding/
│   ├── onboarding-carousel/
│   ├── onboarding-steps/
│   └── permissions-request/
├── settings/
│   ├── settings-list/
│   ├── profile-edit/
│   └── account-settings/
├── lists/
│   ├── contact-list/
│   ├── chat-list/
│   ├── feed/
│   └── search-results/
├── details/
│   ├── profile-detail/
│   ├── product-detail/
│   └── article-detail/
├── empty-states/
│   ├── no-results/
│   ├── no-connection/
│   └── error-state/
├── forms/                   # Form Patterns
│   ├── form-login/          # react-hook-form + zod
│   ├── form-signup/
│   ├── form-contact/
│   ├── form-payment/
│   ├── form-profile/
│   └── form-search/         # Filters + Sort
├── charts/                  # Daten-Visualisierung
│   ├── chart-bar/
│   ├── chart-line/
│   ├── chart-pie/
│   ├── chart-area/
│   ├── chart-radar/
│   └── chart-radial/
├── dashboard/
│   ├── dashboard-01/        # Stats + Charts + List
│   └── dashboard-02/        # Cards + Activity
└── tablet/                  # iPad/Tablet Layouts
    ├── split-view/          # Master-Detail
    ├── sidebar-layout/      # Persistent Sidebar
    └── multi-column/        # 2-3 Column Grid
```

### Ebene 4: Screens

**Komplette, fertige App-Screens.** Copy, paste, anpassen, fertig.

```
screens/
├── auth/
│   ├── screen-welcome/          # Hero + CTA + Social Login
│   ├── screen-login/            # Email/Password + Forgot + Social
│   ├── screen-signup/           # Multi-step Registration
│   ├── screen-forgot-password/  # Email + Success State
│   ├── screen-verify-otp/       # 6-digit Code + Resend
│   └── screen-create-profile/   # Avatar + Name + Bio
│
├── onboarding/
│   ├── screen-onboarding-carousel/  # 3-5 Slides + Skip + Dots
│   ├── screen-onboarding-video/     # Fullscreen Video + CTA
│   ├── screen-permissions/          # Notifications + Location + Camera
│   └── screen-personalization/      # Interests/Preferences Selection
│
├── main/
│   ├── screen-home-feed/        # Stories + Feed + FAB
│   ├── screen-home-dashboard/   # Stats + Charts + Quick Actions
│   ├── screen-home-cards/       # Card Grid + Categories
│   ├── screen-explore/          # Search + Trending + Categories
│   ├── screen-notifications/    # Grouped + Actions + Empty State
│   └── screen-activity/         # Timeline + Filters
│
├── content/
│   ├── screen-detail-product/   # Images + Info + Actions + Reviews
│   ├── screen-detail-article/   # Hero + Rich Text + Author
│   ├── screen-detail-profile/   # Header + Stats + Tabs + Content
│   ├── screen-detail-event/     # Date + Location + Attendees + RSVP
│   ├── screen-gallery/          # Grid + Lightbox + Zoom
│   └── screen-video-player/     # Fullscreen + Controls + Related
│
├── lists/
│   ├── screen-list-contacts/    # Alphabet Index + Search + Avatar
│   ├── screen-list-messages/    # Unread Badge + Last Message + Time
│   ├── screen-list-orders/      # Status + Items + Price
│   ├── screen-list-transactions/# Amount + Category + Date
│   └── screen-list-search-results/ # Filters + Sort + Results Count
│
├── forms/
│   ├── screen-form-checkout/    # Steps: Address → Payment → Confirm
│   ├── screen-form-booking/     # Date + Time + Details + Confirm
│   ├── screen-form-review/      # Stars + Text + Photos + Submit
│   └── screen-form-support/     # Category + Message + Attachments
│
├── settings/
│   ├── screen-settings-main/    # Grouped List + Account + Logout
│   ├── screen-settings-profile/ # Edit All Fields + Avatar Upload
│   ├── screen-settings-notifications/ # Toggles by Category
│   ├── screen-settings-privacy/ # Permissions + Data + Delete Account
│   └── screen-settings-appearance/    # Theme + Font Size + Language
│
├── empty-states/
│   ├── screen-empty-inbox/      # Illustration + Message + CTA
│   ├── screen-empty-search/     # No Results + Suggestions
│   ├── screen-empty-cart/       # Empty Bag + Shop Now
│   └── screen-error-generic/    # Oops + Retry + Support
│
├── success/
│   ├── screen-success-payment/  # Checkmark + Details + Actions
│   ├── screen-success-order/    # Order Number + Track + Continue
│   ├── screen-success-signup/   # Welcome + Next Steps
│   └── screen-success-booking/  # Confirmation + Calendar Add
│
└── special/
    ├── screen-chat/             # Messages + Input + Attachments
    ├── screen-map/              # Map + Search + Markers + Sheet
    ├── screen-camera/           # Viewfinder + Capture + Gallery
    ├── screen-qr-scanner/       # Scanner + Torch + Manual Input
    └── screen-ar-preview/       # AR View + Controls + Info
```

#### Screen Beispiel: Welcome Screen

```
┌─────────────────────────────────┐
│                                 │
│         ┌───────────┐          │
│         │   LOGO    │          │
│         └───────────┘          │
│                                 │
│      Welcome to AppName        │
│                                 │
│   Your journey starts here.    │
│   Discover amazing features.   │
│                                 │
│   ┌─────────────────────────┐  │
│   │     Get Started         │  │
│   └─────────────────────────┘  │
│                                 │
│   ┌─────────────────────────┐  │
│   │  ○ Continue with Apple  │  │
│   └─────────────────────────┘  │
│                                 │
│   ┌─────────────────────────┐  │
│   │  G Continue with Google │  │
│   └─────────────────────────┘  │
│                                 │
│      Already have an account?  │
│            Sign In             │
│                                 │
└─────────────────────────────────┘
```

#### Screen Beispiel: Home Dashboard

```
┌─────────────────────────────────┐
│ Good morning, Max        [ava] │
├─────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐        │
│ │  $2,450 │ │    12   │        │
│ │ Balance │ │ Orders  │        │
│ └─────────┘ └─────────┘        │
│                                 │
│ ┌─────────────────────────────┐│
│ │ ~~~~~~~~ Chart ~~~~~~~~    ││
│ │ ~~~~~~~~        ~~~~~~~~   ││
│ └─────────────────────────────┘│
│                                 │
│ Quick Actions                   │
│ ┌──────┐┌──────┐┌──────┐┌────┐│
│ │ Send ││ Req. ││ Scan ││More││
│ └──────┘└──────┘└──────┘└────┘│
│                                 │
│ Recent Activity                 │
│ ├─ Payment to Store    -$24.99 │
│ ├─ Received from John  +$50.00 │
│ └─ Subscription        -$9.99  │
│                                 │
│ ══════════════════════════════ │
│    🏠      🔍      💳      👤   │
└─────────────────────────────────┘
```

#### CLI Commands für Screens

```bash
# Einen Screen installieren
npx mcellui add screens/auth/screen-login

# Alle Auth Screens
npx mcellui add screens/auth

# Screen mit Anpassungen
npx mcellui add screens/main/screen-home-dashboard --name HomeScreen
```

## Form Integration

Forms nutzen `react-hook-form` + `zod` für Validierung:

```typescript
// Empfohlenes Pattern für Forms
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Field, Input, Button } from '@/components/ui';

const schema = z.object({
  email: z.string().email('Ungültige Email'),
  password: z.string().min(8, 'Mindestens 8 Zeichen'),
});

export function LoginForm() {
  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <>
      <Field
        control={control}
        name="email"
        label="Email"
        error={formState.errors.email?.message}
      >
        <Input
          placeholder="deine@email.de"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </Field>

      <Field
        control={control}
        name="password"
        label="Passwort"
        error={formState.errors.password?.message}
      >
        <Input
          placeholder="••••••••"
          secureTextEntry
        />
      </Field>

      <Button onPress={handleSubmit(onSubmit)}>
        Einloggen
      </Button>
    </>
  );
}
```

## Tablet & iPad Support

### Device Detection Hook

```typescript
import { useWindowDimensions } from 'react-native';

export function useDeviceType() {
  const { width, height } = useWindowDimensions();

  return {
    isPhone: width < 768,
    isTablet: width >= 768,
    isLandscape: width > height,
    breakpoint: width < 768 ? 'sm' : width < 1024 ? 'md' : 'lg',
  };
}
```

### Responsive Layouts

```typescript
// Split View für Tablets
export function MasterDetailLayout({ master, detail }) {
  const { isTablet } = useDeviceType();

  if (isTablet) {
    return (
      <View style={styles.splitView}>
        <View style={styles.master}>{master}</View>
        <View style={styles.detail}>{detail}</View>
      </View>
    );
  }

  // Auf Phone: Navigation Stack
  return <Stack>{/* ... */}</Stack>;
}
```

### iPad-spezifische Patterns

| Pattern | Beschreibung |
|---------|--------------|
| Split View | Master-Detail mit resizable divider |
| Sidebar | Persistent Navigation (wie macOS) |
| Popovers | Statt Fullscreen Modals |
| Multi-Column | 2-3 Spalten für Content |
| Slide Over | Overlay Panel von rechts |

## Mobile-spezifische Komponenten

| Name | Description |
|------|-------------|
| action-sheet | iOS-style Action Sheet |
| segmented-control | iOS Segmented Control |
| navigation-bar | Top Navigation |
| tab-bar | Bottom Tab Navigation |
| pull-to-refresh | Pull to Refresh |
| swipeable | Swipe Actions |
| haptic-tab | Tab with Haptic Feedback |
| blur-view | Glassmorphism Container |
| safe-area | Safe Area Wrapper |
| keyboard-avoiding | Keyboard Avoiding Wrapper |

## Beispiel: Button

```tsx
import { forwardRef } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Spinner } from './spinner';
import { tokens } from '../tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  haptic?: boolean;
  onPress?: () => void;
}

export const Button = forwardRef<typeof Pressable, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', disabled, loading, haptic = true, onPress }, ref) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
    };

    const handlePressOut = () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    };

    const handlePress = () => {
      if (haptic) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress?.();
    };

    return (
      <AnimatedPressable
        ref={ref}
        style={[styles.base, styles[variant], styles[`size_${size}`], animatedStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
      >
        {loading ? (
          <Spinner size={size === 'sm' ? 16 : 20} />
        ) : (
          <Text style={[styles.text, styles[`text_${variant}`]]}>{children}</Text>
        )}
      </AnimatedPressable>
    );
  }
);
```

## Registry Format

```json
{
  "name": "button",
  "type": "ui",
  "description": "A pressable button with variants and animations",
  "dependencies": ["react-native-reanimated", "expo-haptics"],
  "registryDependencies": ["spinner"],
  "files": [
    { "name": "button.tsx", "content": "..." },
    { "name": "button-group.tsx", "content": "..." }
  ],
  "examples": ["button-demo", "button-variants", "button-loading"]
}
```

## Core Dependencies

```json
{
  "dependencies": {
    "react-native-reanimated": "^3.x",
    "react-native-gesture-handler": "^2.x",
    "expo-blur": "latest",
    "expo-haptics": "latest",
    "expo-linear-gradient": "latest",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  },
  "optionalDependencies": {
    "@gorhom/bottom-sheet": "^4.x",
    "burnt": "latest",
    "zeego": "latest",
    "victory-native": "^41.x",
    "react-native-svg": "^15.x"
  }
}
```

## Icons

### Strategie: Platform-Native + Custom

```tsx
// nativeui Icon Component - wrapped für beide Platforms
import { Icon } from '@/components/ui/icon';

// Automatisch: SF Symbols auf iOS, Material Icons auf Android
<Icon name="chevron-right" size={24} color="gray.500" />
<Icon name="heart" size={24} filled />
<Icon name="settings" size={24} />
```

### Platform-Adaptive Icons

```tsx
// Manche Icons sollten platform-spezifisch sein
const platformIcons = {
  share: {
    ios: 'square.and.arrow.up',      // SF Symbol
    android: 'share',                 // Material
  },
  back: {
    ios: 'chevron.left',
    android: 'arrow-back',
  },
};

// Usage
<Icon name="share" />  // Automatisch richtig je nach Platform
```

### Icon Registry

```
icons/
├── ui/                    # UI Icons (beide Platforms)
│   ├── chevron-right
│   ├── chevron-left
│   ├── check
│   ├── x
│   ├── plus
│   ├── minus
│   ├── search
│   ├── menu
│   └── ...
├── actions/               # Action Icons
│   ├── share
│   ├── edit
│   ├── delete
│   ├── copy
│   ├── download
│   └── ...
├── status/                # Status Icons
│   ├── success
│   ├── error
│   ├── warning
│   ├── info
│   └── ...
└── social/                # Social Icons
    ├── apple
    ├── google
    ├── facebook
    └── ...
```

### CLI

```bash
# Icons werden mit Components installiert
npx mcellui add button  # Inkludiert benötigte Icons

# Oder einzeln
npx mcellui add icons/ui
npx mcellui add icons/social
```

## Illustrations

### Built-in Illustrations für Empty States

```
illustrations/
├── empty/
│   ├── empty-inbox.svg        # Leerer Posteingang
│   ├── empty-cart.svg         # Leerer Warenkorb
│   ├── empty-search.svg       # Keine Suchergebnisse
│   ├── empty-favorites.svg    # Keine Favoriten
│   └── empty-notifications.svg
├── error/
│   ├── error-generic.svg      # Allgemeiner Fehler
│   ├── error-network.svg      # Kein Internet
│   ├── error-server.svg       # Server Error
│   └── error-404.svg          # Nicht gefunden
├── success/
│   ├── success-payment.svg    # Zahlung erfolgreich
│   ├── success-order.svg      # Bestellung erfolgreich
│   └── success-signup.svg     # Registrierung erfolgreich
└── onboarding/
    ├── onboarding-01.svg
    ├── onboarding-02.svg
    └── onboarding-03.svg
```

### Illustration Component

```tsx
import { Illustration } from '@/components/ui/illustration';

<Illustration
  name="empty-inbox"
  size={200}
  // Passt sich automatisch an Theme an (Light/Dark)
/>

// Mit Animation
<Illustration
  name="success-payment"
  animated  // Lottie-like entrance animation
/>
```

### Customization

```tsx
// Farben aus Theme
<Illustration
  name="empty-search"
  primaryColor="primary.500"
  secondaryColor="gray.300"
/>
```

## Skeleton Patterns

Fertige Skeleton-Layouts für häufige Use Cases.

```tsx
// Einzelne Skeletons
<Skeleton width={100} height={20} />
<Skeleton.Circle size={48} />
<Skeleton.Text lines={3} />

// Fertige Patterns
<Skeleton.Card />
<Skeleton.ListItem />
<Skeleton.Profile />
<Skeleton.Feed count={5} />
<Skeleton.Article />
<Skeleton.Product />
```

### Skeleton Patterns Übersicht

```
┌─────────────────────────────────┐
│ Skeleton.Card                   │
│ ┌───────────────────────────┐  │
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  │
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  │
│ └───────────────────────────┘  │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓              │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     │
│ ▓▓▓▓▓▓▓▓▓▓                     │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Skeleton.ListItem               │
│ ┌────┐ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓         │
│ │ ▓▓ │ ▓▓▓▓▓▓▓▓▓▓              │
│ └────┘                          │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Skeleton.Profile                │
│         ┌──────┐                │
│         │  ▓▓  │                │
│         └──────┘                │
│      ▓▓▓▓▓▓▓▓▓▓▓▓              │
│       ▓▓▓▓▓▓▓▓▓▓                │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
└─────────────────────────────────┘
```

### Usage mit Loading State

```tsx
function ProductCard({ product, isLoading }) {
  if (isLoading) {
    return <Skeleton.Card />;
  }

  return (
    <Card>
      <ProductContent product={product} />
    </Card>
  );
}
```

## Gesture Components

### Swipeable Row

```tsx
import { SwipeableRow } from '@/components/ui/swipeable-row';

<SwipeableRow
  leftActions={[
    {
      icon: 'archive',
      color: 'blue.500',
      onPress: () => archiveItem(item.id),
    },
  ]}
  rightActions={[
    {
      icon: 'trash',
      color: 'red.500',
      onPress: () => deleteItem(item.id),
      confirmable: true,  // Zweites Swipe zum Bestätigen
    },
  ]}
  onSwipeLeft={() => handleSwipeLeft()}
  onSwipeRight={() => handleSwipeRight()}
>
  <ListItem title={item.title} />
</SwipeableRow>
```

### Pull to Refresh

```tsx
import { RefreshableScrollView } from '@/components/ui/refreshable-scroll-view';

<RefreshableScrollView
  onRefresh={async () => {
    await refetch();
  }}
  refreshing={isRefetching}
  // Custom Indicator
  renderRefreshIndicator={({ progress }) => (
    <CustomSpinner progress={progress} />
  )}
>
  <Content />
</RefreshableScrollView>
```

### Infinite Scroll

```tsx
import { InfiniteList } from '@/components/ui/infinite-list';

<InfiniteList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
  onEndReached={fetchNextPage}
  hasMore={hasNextPage}
  isLoading={isFetchingNextPage}
  // Skeleton während laden
  loadingComponent={<Skeleton.ListItem />}
  loadingCount={3}
  // Empty State
  emptyComponent={
    <EmptyState
      illustration="empty-search"
      title="No results"
      description="Try a different search term"
    />
  }
/>
```

### Long Press Menu

```tsx
import { LongPressMenu } from '@/components/ui/long-press-menu';

<LongPressMenu
  items={[
    { label: 'Copy', icon: 'copy', onPress: handleCopy },
    { label: 'Share', icon: 'share', onPress: handleShare },
    { label: 'Delete', icon: 'trash', destructive: true, onPress: handleDelete },
  ]}
  haptic={true}
>
  <Card>{content}</Card>
</LongPressMenu>
```

## Error Boundaries

### Screen Error Boundary

```tsx
import { ScreenErrorBoundary } from '@/components/ui/error-boundary';

// In deinem Screen
export default function ProfileScreen() {
  return (
    <ScreenErrorBoundary
      fallback={({ error, retry }) => (
        <ErrorScreen
          title="Something went wrong"
          message={error.message}
          onRetry={retry}
        />
      )}
    >
      <ProfileContent />
    </ScreenErrorBoundary>
  );
}
```

### Component Error Boundary

```tsx
import { ComponentErrorBoundary } from '@/components/ui/error-boundary';

// Für einzelne Components
<ComponentErrorBoundary
  fallback={<Card><Text>Failed to load</Text></Card>}
>
  <RiskyComponent />
</ComponentErrorBoundary>
```

### Error Screens

```
error-screens/
├── error-generic/       # Allgemeiner Fehler + Retry
├── error-network/       # Keine Verbindung + Retry
├── error-permission/    # Berechtigung fehlt + Settings
├── error-maintenance/   # Server Wartung + Status
└── error-update/        # App Update erforderlich + Store
```

## Sound & Audio Feedback

Subtile Audio-Cues für bessere UX (optional, respektiert System-Settings).

### Sound System

```tsx
import { sounds } from '@/lib/sounds';

// Vordefinierte Sounds
sounds.tap();        // Subtiler Tap (für Buttons)
sounds.success();    // Erfolg (Cha-ching)
sounds.error();      // Fehler (Bonk)
sounds.notification(); // Notification
sounds.sent();       // Message Sent (Whoosh)
sounds.received();   // Message Received (Ding)
sounds.delete();     // Destructive Action (Crumple)
```

### Integration mit Components

```tsx
// Button mit Sound
<Button
  onPress={handleSubmit}
  sound="success"  // Spielt bei erfolgreichem Press
>
  Submit
</Button>

// Oder manuell
const handlePayment = async () => {
  await processPayment();
  sounds.success();  // Ka-ching!
};
```

### Respektiert System Settings

```tsx
// Automatisch: Kein Sound wenn...
// - Silent Mode aktiv
// - Do Not Disturb aktiv
// - System Sounds deaktiviert
// - User hat Sounds in App Settings deaktiviert

// Check
const { soundEnabled } = useSoundSettings();
```

### CLI

```bash
# Sounds sind optional
npx mcellui add sounds

# Installiert:
# - Sound files (mp3, klein)
# - Sound provider
# - Hooks
```

## Loading Patterns

### Strategien je nach Kontext

```tsx
// 1. Skeleton (Content wird geladen)
if (isLoading) return <Skeleton.Profile />;

// 2. Spinner (Action wird ausgeführt)
<Button loading={isSubmitting}>Submit</Button>

// 3. Progress (Upload/Download)
<ProgressBar progress={uploadProgress} />

// 4. Optimistic UI (Sofort zeigen, im Hintergrund synchen)
const { mutate } = useLikePost({
  onMutate: () => setLiked(true),  // Sofort
  onError: () => setLiked(false),  // Rollback
});
```

### Loading Screen

```tsx
import { LoadingScreen } from '@/components/screens/loading-screen';

// Für App Startup / Auth Check
<LoadingScreen
  logo={<AppLogo />}
  message="Loading your data..."
/>
```
