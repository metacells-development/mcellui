# @nativeui/registry

Component registry for nativeui - 27 UI components and 6 screen blocks.

## UI Components (27)

### Inputs & Forms (11)

| Component | Description | Dependencies |
|-----------|-------------|--------------|
| `button` | Pressable button with variants (default, secondary, destructive, outline, ghost) and sizes | - |
| `input` | Text input with label, placeholder, error states | - |
| `textarea` | Multiline input with auto-grow and character count | reanimated |
| `checkbox` | Animated checkbox with indeterminate state | reanimated |
| `switch` | iOS-style toggle with smooth animations | reanimated |
| `radio-group` | Single selection from multiple options | reanimated |
| `select` | Bottom sheet picker with search support | reanimated, sheet |
| `slider` | Value slider with gesture support and steps | reanimated, gesture-handler |
| `stepper` | Quantity input with +/- buttons and haptics | reanimated |
| `label` | Form label with required indicator | - |
| `form` | Form system with react-hook-form + Zod | react-hook-form, zod |

### Data Display (7)

| Component | Description | Dependencies |
|-----------|-------------|--------------|
| `card` | Container with shadow, supports Header/Title/Description/Content/Footer | - |
| `badge` | Status indicator with color variants | - |
| `avatar` | Profile picture with fallback initials | - |
| `separator` | Horizontal/vertical divider | - |
| `skeleton` | Loading shimmer placeholder | reanimated |
| `spinner` | Activity indicator (sm/md/lg/xl) | - |
| `progress` | Animated progress bar with indeterminate mode | reanimated |

### Overlays & Feedback (4)

| Component | Description | Dependencies |
|-----------|-------------|--------------|
| `dialog` | Centered modal with backdrop and scale animation | reanimated |
| `sheet` | Bottom sheet with snap points and gestures | reanimated, gesture-handler |
| `alert-dialog` | Confirmation modal with action/cancel buttons | reanimated |
| `toast` | Notification system with ToastProvider, 4 variants | reanimated, safe-area-context |

### Navigation (3)

| Component | Description | Dependencies |
|-----------|-------------|--------------|
| `tabs` | Tabbed navigation with animated sliding indicator | reanimated |
| `accordion` | Collapsible sections, single/multiple mode | reanimated |
| `segmented-control` | iOS-style segment picker (sm/md/lg) | reanimated |

### Mobile Patterns (2)

| Component | Description | Dependencies |
|-----------|-------------|--------------|
| `pull-to-refresh` | RefreshControl wrapper with custom indicator | reanimated |
| `swipeable-row` | Swipe-to-reveal actions, full swipe support | reanimated, gesture-handler |

---

## Screen Blocks (6)

Ready-to-use screen templates. Copy-paste and customize.

### Authentication

| Block | Description | Uses |
|-------|-------------|------|
| `login-block` | Email/password form + social login buttons | button, input, form |
| `signup-block` | Name/email/password + terms checkbox | button, input, checkbox, form |

### Profile & Settings

| Block | Description | Uses |
|-------|-------------|------|
| `profile-block` | Avatar, name, stats (posts/followers/following), action buttons | avatar, button |
| `settings-list-block` | Grouped settings with Switch toggles and navigation items | switch, separator |

### Feedback States

| Block | Description | Uses |
|-------|-------------|------|
| `empty-state-block` | Icon, title, description, CTA button | button |
| `error-state-block` | Error icon, message, error code, retry button | button |

---

## Installation

```bash
# Add a component
npx nativeui add button

# Add a block
npx nativeui add login-block

# Add multiple
npx nativeui add button card input form
```

## Dependencies

Most components require these peer dependencies (installed by `nativeui init`):

```json
{
  "react-native-reanimated": "~3.x",
  "react-native-gesture-handler": "~2.x",
  "react-native-safe-area-context": "~4.x"
}
```

Form components additionally require:

```json
{
  "react-hook-form": "^7.50.0",
  "@hookform/resolvers": "^3.3.0",
  "zod": "^3.22.0"
}
```

---

## Component Status

All components are currently in `beta` status:
- Tested on iOS 17+
- Dark mode supported
- TypeScript strict (no `any`)
- Android 13+ testing pending
- Accessibility (VoiceOver/TalkBack) pending

---

## Categories Summary

| Category | Count |
|----------|-------|
| Inputs & Forms | 11 |
| Data Display | 7 |
| Overlays & Feedback | 4 |
| Navigation | 3 |
| Mobile Patterns | 2 |
| **UI Components Total** | **27** |
| Screen Blocks | 6 |
| **Grand Total** | **33** |
