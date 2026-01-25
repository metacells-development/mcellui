# Roadmap: mcellui Quality Refinement

## Overview

This milestone refines all 102 components (55 UI, 28 blocks, 19 screens) to match the quality of our gold standard components (Button and Card). Each phase takes a logical group of components and applies all quality standards: visual consistency (theme tokens), API consistency (prop patterns), state coverage (disabled/loading/error/focus), complete demos, and clean composition. By completion, every component feels like it was designed and built together.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Form Inputs** - Input, Textarea, Select, Slider, Stepper, Checkbox, Switch, Radio, Tag Input
- [x] **Phase 2: Buttons & Actions** - Button, Icon Button, FAB, Segmented Control, Action Sheet
- [x] **Phase 3: Feedback Components** - Toast, Dialog, Alert Dialog, Alert, Sheet, Popover, Tooltip
- [x] **Phase 4: Progress & Loading** - Spinner, Skeleton, Progress, Circular Progress, Pull to Refresh
- [x] **Phase 5: Data Display** - Card, Avatar, Avatar Stack, Badge, Chip, Label, Typography, Rating, Image
- [x] **Phase 6: Layout & Structure** - Separator, Row, Column, Screen, List, Horizontal List, Section Header
- [x] **Phase 7: Navigation & Interaction** - Tabs, Accordion, Collapsible, Carousel, Swipeable Row
- [ ] **Phase 8: Advanced Components** - Calendar, DateTime Picker, Image Gallery, Pagination, Stories, Search Input, Form
- [x] **Phase 9: Blocks - Auth & Settings** - Login, Signup, Profile, Settings List, Empty State, Error State
- [x] **Phase 10: Blocks - Content & Social** - Product Card, Cart Item, Article Card, Event Card, Feed Post, User List Item, Chat Bubble, Comment Item, Review Card
- [ ] **Phase 11: Blocks - E-commerce & Info** - Banner, Hero, Pricing Card, Stats Card, Feature Card, Content Card, Social Proof Bar, Media Item, Notification Item, Onboarding Slide, Order Item, Task Item, Search Header
- [ ] **Phase 12: Screens** - All 19 screen templates (Login, Signup, Profile, Settings, Feed, Cart, Checkout, etc.)

## Phase Details

### Phase 1: Form Inputs
**Goal**: All form input components have consistent styling, complete state coverage, and unified API patterns
**Depends on**: Nothing (first phase)
**Requirements**: VISUAL-01, VISUAL-02, VISUAL-03, VISUAL-04, VISUAL-05, API-01, API-02, API-03, API-05, STATE-01, STATE-03, STATE-04, DEMO-01, DEMO-02, COMPOSE-01
**Success Criteria** (what must be TRUE):
  1. All form inputs use spacing, radius, color, and typography tokens (no hardcoded values)
  2. All form inputs support consistent size prop (sm, md, lg) with matching dimensions
  3. All form inputs support disabled, error, and focused states with proper visual feedback
  4. All form inputs have focus rings for accessibility (VoiceOver/TalkBack tested)
  5. Demo shows all variants and states for each input type
**Plans**: 5 plans

Plans:
- [x] 01-01-PLAN.md - Extend token system with form input component tokens
- [x] 01-02-PLAN.md - Migrate Textarea and Select to token system with size prop
- [x] 01-03-PLAN.md - Migrate Slider, Stepper, Radio to centralized tokens
- [x] 01-04-PLAN.md - Migrate TagInput to centralized tokens
- [x] 01-05-PLAN.md - Enhance all 9 form input demos with comprehensive state coverage

### Phase 2: Buttons & Actions
**Goal**: All button-like components have consistent variants, sizes, and interaction states
**Depends on**: Phase 1
**Requirements**: VISUAL-01, VISUAL-02, VISUAL-03, VISUAL-04, VISUAL-05, API-01, API-02, API-03, API-05, STATE-01, STATE-02, STATE-04, DEMO-01, DEMO-02, COMPOSE-01
**Success Criteria** (what must be TRUE):
  1. All buttons use theme tokens for colors, spacing, radius, and typography
  2. All buttons support consistent variant prop (default, secondary, destructive, ghost, outline)
  3. All buttons support size prop (sm, md, lg) with consistent scaling
  4. All buttons support disabled and loading states with proper animations
  5. Demo shows all variants, sizes, and states for each button type
**Plans**: 6 plans

Plans:
- [x] 02-01-PLAN.md - Add centralized tokens for IconButton, FAB, SegmentedControl, ActionSheet
- [x] 02-02-PLAN.md - Migrate IconButton to centralized tokens with accessibility
- [x] 02-03-PLAN.md - Migrate FAB to centralized tokens with accessibility
- [x] 02-04-PLAN.md - Migrate SegmentedControl to centralized tokens
- [x] 02-05-PLAN.md - Migrate ActionSheet to centralized tokens
- [x] 02-06-PLAN.md - Enhance demos for Button, IconButton, ActionSheet

### Phase 3: Feedback Components
**Goal**: All user feedback components have unified appearance and behavior patterns
**Depends on**: Phase 2
**Requirements**: VISUAL-01, VISUAL-02, VISUAL-03, VISUAL-04, VISUAL-05, API-01, API-04, API-05, STATE-01, DEMO-01, DEMO-02, COMPOSE-01
**Success Criteria** (what must be TRUE):
  1. All feedback components use theme tokens for visual consistency
  2. Complex feedback components use compound pattern (Dialog.Title, Dialog.Content, etc.)
  3. All feedback components support variants (info, success, warning, error) where applicable
  4. All modal-style components handle backdrop, gestures, and keyboard consistently
  5. Demo shows all feedback types and interaction patterns
**Plans**: 6 plans

Plans:
- [x] 03-01-PLAN.md - Extend token system with feedback component constants
- [x] 03-02-PLAN.md - Migrate Dialog, AlertDialog, Sheet to overlayTypography tokens
- [x] 03-03-PLAN.md - Migrate Alert to ALERT_CONSTANTS
- [x] 03-04-PLAN.md - Migrate Popover and Tooltip to centralized constants
- [x] 03-05-PLAN.md - Enhance Dialog, Sheet, Popover, Tooltip demos
- [x] 03-06-PLAN.md - Fix AlertDialog buttonText hardcoded typography (gap closure)

### Phase 4: Progress & Loading
**Goal**: All loading and progress components have smooth animations and consistent visual language
**Depends on**: Phase 3
**Requirements**: VISUAL-01, VISUAL-02, VISUAL-03, VISUAL-04, VISUAL-05, API-01, API-03, API-05, STATE-02, DEMO-01, DEMO-02, COMPOSE-01
**Success Criteria** (what must be TRUE):
  1. All progress components use theme tokens and consistent sizing
  2. All loading indicators use Reanimated for smooth 60fps animations
  3. All progress components support determinate and indeterminate modes where applicable
  4. Loading states are accessible with proper screen reader announcements
  5. Demo shows all progress types and states with animation examples
**Plans**: 4 plans

Plans:
- [x] 04-01-PLAN.md - Add Spinner, Skeleton, Progress, CircularProgress tokens to core
- [x] 04-02-PLAN.md - Migrate Spinner and Skeleton to centralized tokens
- [x] 04-03-PLAN.md - Migrate Progress and CircularProgress to tokens with reduce-motion
- [x] 04-04-PLAN.md - Enhance demos for all progress components

### Phase 5: Data Display
**Goal**: All data display components have consistent styling and compose cleanly
**Depends on**: Phase 4
**Requirements**: VISUAL-01, VISUAL-02, VISUAL-03, VISUAL-04, VISUAL-05, API-01, API-03, API-05, STATE-01, DEMO-01, DEMO-02, COMPOSE-01
**Success Criteria** (what must be TRUE):
  1. All data display components use theme tokens for colors, spacing, and radius
  2. Typography component supports all token-based text styles
  3. Avatar, Badge, and Chip have consistent size scales matching design system
  4. Card component serves as gold standard reference (already high quality)
  5. Demo shows all variants, sizes, and composition examples
**Plans**: 5 plans

Plans:
- [x] 05-01-PLAN.md - Extend token system with data display component tokens
- [x] 05-02-PLAN.md - Migrate Chip and Label to centralized tokens
- [x] 05-03-PLAN.md - Migrate Rating and AvatarStack to centralized tokens
- [x] 05-04-PLAN.md - Add h5/h6 typography presets, migrate Image to componentRadius
- [x] 05-05-PLAN.md - Enhance demos for Chip, Label, Rating, AvatarStack, Image, Typography

### Phase 6: Layout & Structure
**Goal**: All layout primitives have consistent spacing and compose predictably
**Depends on**: Phase 5
**Requirements**: VISUAL-01, VISUAL-02, VISUAL-04, VISUAL-05, API-01, API-05, DEMO-01, DEMO-02, COMPOSE-01
**Success Criteria** (what must be TRUE):
  1. All layout components use spacing tokens (no magic numbers)
  2. Row, Column primitives support consistent gap/spacing props
  3. Screen component provides standard layout patterns with theme integration
  4. List components use optimized FlatList/SectionList patterns
  5. Demo shows layout composition patterns and spacing examples
**Plans**: 5 plans

Plans:
- [x] 06-01-PLAN.md - Add LIST_CONSTANTS and listTokens to core theme
- [x] 06-02-PLAN.md - Migrate List and SectionHeader to centralized tokens
- [x] 06-03-PLAN.md - Migrate shared Section demo component to tokens
- [x] 06-04-PLAN.md - Verify Row/Column/Screen token compliance, migrate demos
- [x] 06-05-PLAN.md - Migrate Separator, List, SectionHeader, HorizontalList demos to tokens

### Phase 7: Navigation & Interaction
**Goal**: All navigation components have smooth animations and consistent interaction patterns
**Depends on**: Phase 6
**Requirements**: VISUAL-01, VISUAL-02, VISUAL-03, VISUAL-04, VISUAL-05, API-01, API-04, API-05, STATE-01, DEMO-01, DEMO-02, COMPOSE-01
**Success Criteria** (what must be TRUE):
  1. All navigation components use theme tokens and Reanimated animations
  2. Tabs and Accordion use compound pattern for child components
  3. All interactive components support disabled state and keyboard navigation
  4. Gesture-based components (Swipeable Row, Carousel) handle edge cases smoothly
  5. Demo shows all navigation patterns with transition animations
**Plans**: 5 plans

Plans:
- [x] 07-01-PLAN.md - Add navigation component tokens (Tabs, Accordion, Collapsible, Carousel, SwipeableRow)
- [x] 07-02-PLAN.md - Migrate Tabs to centralized tokens with componentRadius
- [x] 07-03-PLAN.md - Migrate Accordion and Collapsible to centralized tokens
- [x] 07-04-PLAN.md - Migrate Carousel and SwipeableRow to centralized tokens
- [x] 07-05-PLAN.md - Enhance all navigation demos with comprehensive coverage

### Phase 8: Advanced Components
**Goal**: Complex components have complete functionality and consistent integration
**Depends on**: Phase 7
**Requirements**: VISUAL-01, VISUAL-02, VISUAL-03, VISUAL-04, VISUAL-05, API-01, API-04, API-05, STATE-01, STATE-02, STATE-03, STATE-04, DEMO-01, DEMO-02, COMPOSE-01
**Success Criteria** (what must be TRUE):
  1. Calendar and DateTime Picker use theme tokens and support all interactive states
  2. Form component integrates cleanly with react-hook-form and Zod validation
  3. Search Input supports loading and error states with proper feedback
  4. Image Gallery handles async loading with skeleton states
  5. Demo shows complete workflows for each advanced component
**Plans**: 7 plans

Plans:
- [x] 08-01-PLAN.md - Add centralized tokens for Calendar, DateTimePicker, Form, ImageGallery, Pagination, Stories, SearchInput
- [x] 08-02-PLAN.md - Migrate Calendar and DateTimePicker to token system
- [x] 08-03-PLAN.md - Migrate Form compound components to formTokens
- [x] 08-04-PLAN.md - Migrate ImageGallery, Pagination, Stories to token system
- [x] 08-05-PLAN.md - Migrate SearchInput to token system
- [x] 08-06-PLAN.md - Enhance all 7 advanced component demos
- [x] 08-07-PLAN.md - Gap closure: Add async loading states to ImageGallery

### Phase 9: Blocks - Auth & Settings
**Goal**: Authentication and settings blocks are production-ready with complete state coverage
**Depends on**: Phase 8
**Requirements**: VISUAL-01, VISUAL-02, VISUAL-03, VISUAL-04, VISUAL-05, API-01, API-05, STATE-01, STATE-02, STATE-03, STATE-04, DEMO-01, DEMO-02, COMPOSE-01
**Success Criteria** (what must be TRUE):
  1. All auth blocks (Login, Signup) use consistent form patterns and validation
  2. Profile and Settings blocks use theme tokens and compose from base components
  3. Empty State and Error State blocks support customization props
  4. All blocks support loading states during async operations
  5. Demo shows complete workflows with all states (empty, loading, error, success)
**Plans**: 6 plans

Plans:
- [x] 09-01-PLAN.md - Add auth, state, profile, settings block tokens to core
- [x] 09-02-PLAN.md - Migrate LoginBlock and SignupBlock to authBlockTokens
- [x] 09-03-PLAN.md - Migrate ProfileBlock and SettingsListBlock to tokens
- [x] 09-04-PLAN.md - Migrate EmptyStateBlock and ErrorStateBlock to stateBlockTokens
- [x] 09-05-PLAN.md - Enhance blocks demo with comprehensive state coverage
- [x] 09-06-PLAN.md - ProfileBlock demo integration gap closure

### Phase 10: Blocks - Content & Social
**Goal**: Content and social blocks have consistent card patterns and interaction states
**Depends on**: Phase 9
**Requirements**: VISUAL-01, VISUAL-02, VISUAL-03, VISUAL-04, VISUAL-05, API-01, API-05, STATE-01, DEMO-01, DEMO-02, COMPOSE-01
**Success Criteria** (what must be TRUE):
  1. All card blocks (Product, Article, Event, Review) use unified visual patterns
  2. Social blocks (Feed Post, Chat Bubble, Comment) support interactive states
  3. All blocks use spacing and radius tokens consistently
  4. User List Item and Cart Item support swipe actions with smooth animations
  5. Demo shows all block variants with interaction examples
**Plans**: 6 plans

Plans:
- [x] 10-01-PLAN.md - Add cardBlockTokens, socialBlockTokens, productBlockTokens to core theme
- [x] 10-02-PLAN.md - Migrate ProductCard, ArticleCard, EventCard, ReviewCard to cardBlockTokens
- [x] 10-03-PLAN.md - Add loading/disabled states to FeedPostCard, ChatBubble, CommentItem
- [x] 10-04-PLAN.md - Enhance UserListItem and CartItem with loading states and swipe actions
- [x] 10-05-PLAN.md - Enhance card block demos with variants and states
- [x] 10-06-PLAN.md - Enhance social/swipeable block demos with loading indicators

### Phase 11: Blocks - E-commerce & Info
**Goal**: E-commerce and informational blocks are visually polished and functionally complete
**Depends on**: Phase 10
**Requirements**: VISUAL-01, VISUAL-02, VISUAL-03, VISUAL-04, VISUAL-05, API-01, API-05, STATE-01, STATE-02, DEMO-01, DEMO-02, COMPOSE-01
**Success Criteria** (what must be TRUE):
  1. Banner and Hero blocks use theme tokens for dramatic visual impact
  2. Pricing Card and Stats Card have consistent number formatting and layout
  3. All blocks support loading states where async data is expected
  4. Onboarding Slide and Feature Card support image loading with skeletons
  5. Demo shows all blocks in realistic layouts
**Plans**: 6 plans

Plans:
- [ ] 11-01-PLAN.md - Add ecommerceBlockTokens and infoBlockTokens to core theme
- [ ] 11-02-PLAN.md - Migrate BannerBlock and HeroBlock to ecommerceBlockTokens
- [ ] 11-03-PLAN.md - Migrate PricingCard and StatsCard to ecommerceBlockTokens
- [ ] 11-04-PLAN.md - Migrate FeatureCard, ContentCard, OnboardingSlide, SocialProofBar to infoBlockTokens
- [ ] 11-05-PLAN.md - Migrate NotificationItem, MediaItem, OrderItem, TaskItem, SearchHeader to infoBlockTokens
- [ ] 11-06-PLAN.md - Enhance blocks demo with all 13 Phase 11 block demos

### Phase 12: Screens
**Goal**: All screen templates are production-ready examples with complete flows
**Depends on**: Phase 11
**Requirements**: VISUAL-01, VISUAL-02, VISUAL-03, VISUAL-04, VISUAL-05, API-01, API-05, STATE-01, STATE-02, STATE-03, DEMO-01, DEMO-02, COMPOSE-01
**Success Criteria** (what must be TRUE):
  1. All 19 screens use theme tokens and compose from refined components/blocks
  2. All screens support loading, error, and empty states appropriately
  3. All screens follow platform navigation conventions (iOS/Android)
  4. Authentication flows (Login, Signup, OTP) demonstrate form validation patterns
  5. Demo app showcases all screens with realistic data and navigation
**Plans**: 6 plans

Plans:
- [ ] 12-01-PLAN.md - Add screen tokens to core, migrate auth screens (Login, Signup, OTP)
- [ ] 12-02-PLAN.md - Migrate Profile, Settings, Account screens to theme tokens
- [ ] 12-03-PLAN.md - Migrate Feed, Chat, Notifications, Comments screens to theme tokens
- [ ] 12-04-PLAN.md - Migrate Cart, Checkout, ProductDetail, OrderHistory screens to theme tokens
- [ ] 12-05-PLAN.md - Migrate Home, Search, Followers, Onboarding, Help screens to theme tokens
- [ ] 12-06-PLAN.md - Enhance screens demo with actual registry components and state coverage

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10 -> 11 -> 12

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Form Inputs | 5/5 | Complete | 2026-01-24 |
| 2. Buttons & Actions | 6/6 | Complete | 2026-01-24 |
| 3. Feedback Components | 6/6 | Complete | 2026-01-25 |
| 4. Progress & Loading | 4/4 | ✓ Complete | 2026-01-25 |
| 5. Data Display | 5/5 | ✓ Complete | 2026-01-25 |
| 6. Layout & Structure | 5/5 | ✓ Complete | 2026-01-25 |
| 7. Navigation & Interaction | 5/5 | ✓ Complete | 2026-01-25 |
| 8. Advanced Components | 7/7 | ✓ Complete | 2026-01-25 |
| 9. Blocks - Auth & Settings | 6/6 | ✓ Complete | 2026-01-25 |
| 10. Blocks - Content & Social | 6/6 | ✓ Complete | 2026-01-25 |
| 11. Blocks - E-commerce & Info | 0/6 | Planned | - |
| 12. Screens | 0/6 | Planned | - |
