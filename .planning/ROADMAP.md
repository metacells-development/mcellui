# Roadmap: mcellui Quality Refinement

## Overview

This milestone refines all 102 components (55 UI, 28 blocks, 19 screens) to match the quality of our gold standard components (Button and Card). Each phase takes a logical group of components and applies all quality standards: visual consistency (theme tokens), API consistency (prop patterns), state coverage (disabled/loading/error/focus), complete demos, and clean composition. By completion, every component feels like it was designed and built together.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Form Inputs** - Input, Textarea, Select, Slider, Stepper, Checkbox, Switch, Radio, Tag Input
- [ ] **Phase 2: Buttons & Actions** - Button, Icon Button, FAB, Segmented Control, Action Sheet
- [ ] **Phase 3: Feedback Components** - Toast, Dialog, Alert Dialog, Alert, Sheet, Popover, Tooltip
- [ ] **Phase 4: Progress & Loading** - Spinner, Skeleton, Progress, Circular Progress, Pull to Refresh
- [ ] **Phase 5: Data Display** - Card, Avatar, Avatar Stack, Badge, Chip, Label, Typography, Rating, Image
- [ ] **Phase 6: Layout & Structure** - Separator, Row, Column, Screen, List, Horizontal List, Section Header
- [ ] **Phase 7: Navigation & Interaction** - Tabs, Accordion, Collapsible, Carousel, Swipeable Row
- [ ] **Phase 8: Advanced Components** - Calendar, DateTime Picker, Image Gallery, Pagination, Stories, Search Input, Form
- [ ] **Phase 9: Blocks - Auth & Settings** - Login, Signup, Profile, Settings List, Empty State, Error State
- [ ] **Phase 10: Blocks - Content & Social** - Product Card, Cart Item, Article Card, Event Card, Feed Post, User List Item, Chat Bubble, Comment Item, Review Card
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
**Plans**: TBD

Plans:
- [ ] TBD

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
**Plans**: TBD

Plans:
- [ ] TBD

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
**Plans**: TBD

Plans:
- [ ] TBD

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
**Plans**: TBD

Plans:
- [ ] TBD

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
**Plans**: TBD

Plans:
- [ ] TBD

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
**Plans**: TBD

Plans:
- [ ] TBD

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
**Plans**: TBD

Plans:
- [ ] TBD

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
**Plans**: TBD

Plans:
- [ ] TBD

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
**Plans**: TBD

Plans:
- [ ] TBD

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
**Plans**: TBD

Plans:
- [ ] TBD

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
**Plans**: TBD

Plans:
- [ ] TBD

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
**Plans**: TBD

Plans:
- [ ] TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Form Inputs | 0/TBD | Not started | - |
| 2. Buttons & Actions | 0/TBD | Not started | - |
| 3. Feedback Components | 0/TBD | Not started | - |
| 4. Progress & Loading | 0/TBD | Not started | - |
| 5. Data Display | 0/TBD | Not started | - |
| 6. Layout & Structure | 0/TBD | Not started | - |
| 7. Navigation & Interaction | 0/TBD | Not started | - |
| 8. Advanced Components | 0/TBD | Not started | - |
| 9. Blocks - Auth & Settings | 0/TBD | Not started | - |
| 10. Blocks - Content & Social | 0/TBD | Not started | - |
| 11. Blocks - E-commerce & Info | 0/TBD | Not started | - |
| 12. Screens | 0/TBD | Not started | - |
