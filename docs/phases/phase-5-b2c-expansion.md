# Phase 5: B2C Expansion

**Status: PLANNED**

Expand nativeui from 27 components to a full B2C-ready library with 56+ items.

## Philosophy

- **General-purpose B2C** - Not vertical-specific, but optimized for consumer apps
- **"Alive" through design** - Playful/subtle themes, not special components
- **MCP-guided extensibility** - Help devs/Claude create new components following patterns
- **Think APP** - Horizontal scrolling, bottom nav, native patterns

---

## New Components (17)

### Core Inputs & Actions (8)

| Component | Description | Priority |
|-----------|-------------|----------|
| `search-input` | Input with search icon, clear button, loading state | High |
| `datetime-picker` | Date/time selection via bottom sheet | High |
| `icon-button` | Square/circular button with just an icon | High |
| `fab` | Floating Action Button - round button floating bottom-right | High |
| `action-sheet` | iOS-style bottom menu with cancel button | High |
| `list` | ListItem with left/right slots, chevron, dividers | High |
| `tooltip` | Small popup on long-press | Medium |
| `chip` | Selectable pill/tag for filters | High |

### Media (5)

| Component | Description | Priority |
|-----------|-------------|----------|
| `image` | Image with loading skeleton, error fallback, blur-up | High |
| `carousel` | Horizontal swipeable cards/images with pagination dots | High |
| `stories` | Circular avatar with gradient ring (Instagram-style) | Medium |
| `avatar-stack` | Overlapping avatars ("5 people liked this") | Medium |
| `image-gallery` | Grid of images, tap to fullscreen | Medium |

### Layout & Navigation (4)

| Component | Description | Priority |
|-----------|-------------|----------|
| `horizontal-list` | Snap-scroll horizontal container | High |
| `section-header` | Title + "See All" link for sections | High |
| `header` | Top nav with back button, title, actions | High |
| `rating` | Star rating display and input | Medium |

---

## New Blocks (8)

| Block | Description | Components Used |
|-------|-------------|-----------------|
| `notification-item` | Avatar, title, message, time, unread dot | avatar, list |
| `content-card` | Large image + title + subtitle + action | image, card |
| `feature-card` | Icon + title + description | icon-button, card |
| `stats-card` | Big number + label + trend indicator | - |
| `quick-actions-grid` | Grid of icon buttons (2x4 or 3x3) | icon-button |
| `hero-block` | Full-width image/gradient + title + CTA | image, button |
| `social-proof-bar` | Avatar stack + engagement text | avatar-stack |
| `search-header` | Search input + filter button + avatar | search-input, icon-button, avatar |

---

## New Screens (3)

| Screen | Description | Components Used |
|--------|-------------|-----------------|
| `onboarding-screen` | Swipeable carousel + dots + skip/get started | carousel, button |
| `forgot-password-screen` | Email input + submit + back to login | input, button, form |
| `otp-verification-screen` | 4-6 digit code input + resend + timer | input, button, form |

---

## Theme Enhancements

### Animation Presets

```ts
// nativeui.config.ts
export default defineConfig({
  theme: 'violet',
  radius: 'lg',
  animation: 'playful', // 'subtle' | 'playful'
});
```

| Preset | Characteristics |
|--------|-----------------|
| `subtle` | Minimal motion, quick transitions, professional feel |
| `playful` | Bouncy springs, overshoot, delightful micro-interactions |

### What Changes

| Property | Subtle | Playful |
|----------|--------|---------|
| Spring damping | 20 | 12 |
| Spring stiffness | 300 | 180 |
| Default radius | md | lg |
| Scale on press | 0.98 | 0.95 |
| Haptic feedback | selection | light + success |

---

## Implementation Order

### Batch 1: Core (Week 1)
1. `search-input`
2. `icon-button`
3. `list`
4. `image`
5. `horizontal-list`
6. `section-header`

### Batch 2: Navigation & Actions (Week 2)
1. `header`
2. `fab`
3. `action-sheet`
4. `chip`

### Batch 3: Media (Week 3)
1. `carousel`
2. `stories`
3. `avatar-stack`
4. `rating`
5. `datetime-picker`

### Batch 4: Blocks (Week 4)
1. `content-card`
2. `feature-card`
3. `notification-item`
4. `stats-card`
5. `hero-block`
6. `quick-actions-grid`
7. `social-proof-bar`
8. `search-header`

### Batch 5: Screens (Week 5)
1. `onboarding-screen`
2. `forgot-password-screen`
3. `otp-verification-screen`

### Batch 6: Polish
1. Animation presets (subtle/playful)
2. MCP component creation guide
3. Documentation updates

---

## Summary

| Category | Existing | New | Total |
|----------|----------|-----|-------|
| UI Components | 27 | 17 | 44 |
| Blocks | 6 | 8 | 14 |
| Screens | 0 | 3 | 3 |
| **Total** | **33** | **28** | **61** |

---

## MCP Enhancement (Future)

Add tooling to help Claude/developers create new components:

```
nativeui create component <name>
```

- Generates boilerplate following nativeui patterns
- Includes TypeScript types, theme integration, animation patterns
- MCP server provides context about existing components and conventions
