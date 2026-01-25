# Phase 10: Blocks - Content & Social - Research

**Researched:** 2026-01-25
**Domain:** React Native content and social blocks with card-based patterns
**Confidence:** HIGH

## Summary

This phase focuses on refining nine existing content and social blocks to meet the production-quality standards established in Phases 1-9. All blocks already exist in the codebase and work functionally. The primary work involves:

1. **Unified card patterns** - Product, Article, Event, and Review cards share consistent visual patterns (spacing, shadows, radius, typography)
2. **Interactive states** - Feed Post, Chat Bubble, Comment Item, and User List Item need comprehensive state coverage (loading, error, disabled, pressed, focused)
3. **Token alignment** - Replace any remaining hardcoded values with theme tokens for spacing, radius, typography, and colors
4. **Swipe action consistency** - Cart Item and User List Item use SwipeableRow with smooth animations and haptic feedback

Unlike Phase 9 (auth/settings blocks), these blocks are more diverse in structure. They split into two categories: **card blocks** (product, article, event, review) which share layout DNA, and **social blocks** (feed post, chat bubble, comment, user list item) which emphasize interaction states. Cart Item bridges both categories with swipe actions.

**Primary recommendation:** Audit each block for token usage, then systematically enhance interaction states. Card blocks need unified shadow/elevation, social blocks need comprehensive loading/disabled states, and swipeable blocks need gesture polish.

## Standard Stack

The project has already established its stack. This phase refines existing blocks using these tools:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React Native StyleSheet | Built-in | Styling | Native styling approach, better performance than CSS-in-JS |
| @metacells/mcellui-core | Internal | Theme system (spacing, colors, radius, shadows) | Project's established design token system |
| react-native-reanimated | ~4.1.1 | Animations | De facto standard for performant native animations on UI thread |
| react-native-gesture-handler | ~2.28.0 | Touch interactions | High-performance gesture recognition, required for SwipeableRow |
| react-native-svg | 15.12.1 | Icons | Vector graphics for all block icons (heart, share, cart, etc.) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Reanimated withSpring | Built-in | Spring animations | Card press states, swipe snapping, smooth transitions |
| Gesture Handler Pan | Built-in | Swipe gestures | Cart Item and User List Item swipe actions |
| haptic utility | Internal | Tactile feedback | Button presses, like actions, swipe triggers |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-native-reanimated | Animated API | Animated API runs on JS thread (choppy), Reanimated runs on UI thread (60fps+) |
| SwipeableRow component | react-native-swipeable-item | Custom SwipeableRow is already built, matches design system, no extra dependency |
| StyleSheet tokens | Styled Components | CSS-in-JS adds runtime overhead, harder to maintain consistent tokens |

**Installation:**
These dependencies are already installed in the project.

## Architecture Patterns

### Recommended Block Structure
```
packages/registry/blocks/
├── product-card.tsx         # E-commerce product with variants, rating
├── cart-item.tsx            # Shopping cart with quantity, swipe actions
├── article-card.tsx         # Blog post with author, read time, variants
├── event-card.tsx           # Calendar event with attendees, location
├── feed-post-card.tsx       # Social post with likes, comments, shares
├── user-list-item.tsx       # User row with follow button, swipe actions
├── chat-bubble.tsx          # Message with status indicators, grouping
├── comment-item.tsx         # Comment with nested replies, voting
└── review-card.tsx          # Product review with images, helpful votes
```

### Pattern 1: Unified Card Visual System
**What:** All card blocks (Product, Article, Event, Review) use identical shadow, radius, border, and spacing tokens
**When to use:** For any card-style block that displays structured content
**Example:**
```typescript
// Source: Project pattern from packages/registry/ui/card.tsx
import { useTheme } from '@metacells/mcellui-core';

function UnifiedCardBlock() {
  const { colors, componentRadius, platformShadow, spacing, components } = useTheme();
  const cardTokens = components.card; // Centralized card tokens

  return (
    <View style={[
      {
        backgroundColor: colors.card,
        borderRadius: componentRadius.card,      // ✅ Consistent radius
        borderWidth: cardTokens.borderWidth,     // ✅ Card tokens
        borderColor: colors.border,
      },
      platformShadow('sm'),                      // ✅ Unified shadow
      { padding: spacing[4] },                   // ✅ Spacing tokens
    ]}>
      {/* Card content */}
    </View>
  );
}
```

**Why this matters:** Card blocks (Product, Article, Event, Review) currently have slight inconsistencies in shadow depth, border width, and inner padding. Unified visual system means:
- ProductCard with shadow 'sm' looks identical to ArticleCard with shadow 'sm'
- componentRadius.card is the same value across all cards
- Inner padding uses spacing[4] consistently (not spacing[3] in one, spacing[4] in another)

### Pattern 2: Interactive State Layers
**What:** Social blocks support disabled, loading, and pressed states with visual feedback
**When to use:** Feed Post, Comment Item, Chat Bubble, User List Item - any interactive social block
**Example:**
```typescript
// Source: Established pattern from Phase 8-9 components
import { useState } from 'react';
import { Pressable, ActivityIndicator } from 'react-native';

function InteractiveSocialBlock({ onLike, disabled = false }) {
  const { colors, spacing } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    setLoading(true);
    try {
      await onLike();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handleLike}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? colors.secondary : colors.background,
          opacity: disabled ? 0.5 : 1,          // ✅ Disabled state
          padding: spacing[2],
        }
      ]}
    >
      {loading ? (                              // ✅ Loading state
        <ActivityIndicator size="small" color={colors.foregroundMuted} />
      ) : (
        <HeartIcon filled={liked} />
      )}
    </Pressable>
  );
}
```

### Pattern 3: Swipe Action Composition
**What:** Cart Item and User List Item wrap content with SwipeableRow for consistent swipe behavior
**When to use:** Any block that needs swipe-to-reveal actions (delete, archive, save)
**Example:**
```typescript
// Source: packages/registry/blocks/cart-item.tsx
import { SwipeableRow, SwipeAction } from '../ui/swipeable-row';

function SwipeableBlock({ onRemove, onSave }) {
  const { colors } = useTheme();

  const rightActions: SwipeAction[] = [
    {
      label: 'Save',
      color: colors.primary,
      icon: <HeartIcon />,
      onPress: onSave,
    },
    {
      label: 'Remove',
      color: colors.destructive,
      icon: <TrashIcon />,
      onPress: onRemove,
    },
  ];

  const content = (
    <View style={{ padding: spacing[4] }}>
      {/* Block content */}
    </View>
  );

  return (
    <SwipeableRow rightActions={rightActions}>
      {content}
    </SwipeableRow>
  );
}
```

**Key principles:**
- SwipeableRow handles gesture detection, animation, snap points
- Block only defines actions array and content
- Consistent haptic feedback on swipe and action press
- Action width, resistance, and full-swipe threshold are standardized

### Pattern 4: Responsive Card Variants
**What:** Cards offer multiple layout variants (vertical, horizontal, compact, featured) for different contexts
**When to use:** Product, Article, Event cards that appear in grids, lists, or featured sections
**Example:**
```typescript
// Source: packages/registry/blocks/article-card.tsx
export interface ArticleCardProps {
  variant?: 'default' | 'horizontal' | 'featured';
  // ...
}

export function ArticleCard({ variant = 'default', article }) {
  if (variant === 'horizontal') {
    // Horizontal layout: 80x80 image on left, content on right
    return (
      <View style={{ flexDirection: 'row', padding: spacing[3] }}>
        <Image style={{ width: 80, height: 80 }} />
        <View style={{ flex: 1, marginLeft: spacing[3] }}>
          <Text>{article.title}</Text>
        </View>
      </View>
    );
  }

  if (variant === 'featured') {
    // Featured: Large image with overlay text
    return (
      <View style={{ height: 280 }}>
        <Image style={StyleSheet.absoluteFill} />
        <View style={{ position: 'absolute', bottom: 0, padding: spacing[4] }}>
          <Text style={{ color: '#fff', fontSize: 22 }}>{article.title}</Text>
        </View>
      </View>
    );
  }

  // Default: Vertical card with image on top
  return (
    <Card>
      <Image style={{ height: 180 }} />
      <View style={{ padding: spacing[4] }}>
        <Text>{article.title}</Text>
      </View>
    </Card>
  );
}
```

### Pattern 5: Block-Level Token Grouping
**What:** Group related styling values into block-specific token objects for consistency
**When to use:** When a block has multiple sub-sections that share semantic spacing/sizing
**Example:**
```typescript
// Conceptual pattern (not yet implemented in project)
// If blocks need componentRadius like cards do:
const productCardTokens = {
  image: {
    aspectRatio: 1,
    backgroundColor: colors.secondary,
  },
  header: {
    padding: spacing[3],
    gap: spacing[1],
  },
  pricing: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  actions: {
    marginTop: spacing[3],
    gap: spacing[2],
  },
} as const;
```

**Note:** Currently blocks use general tokens directly (spacing[4], radius.lg). Only add block-specific tokens if customization requirements emerge.

### Anti-Patterns to Avoid

- **Inconsistent shadows:** ProductCard uses `platformShadow('md')`, ArticleCard uses `platformShadow('sm')` - pick ONE shadow depth for all cards
- **Hardcoded interaction delays:** Don't use `setTimeout(250)` for loading states - use actual loading state from async handlers
- **Missing disabled states:** Social action buttons (like, comment, share) MUST disable during loading to prevent double-submissions
- **Duplicate gesture logic:** Don't reimplement pan gesture handling - use SwipeableRow component which handles edge cases
- **Inconsistent icon sizes:** Feed Post uses 24px icons, Comment uses 20px icons - standardize to iconSize tokens (sm: 16, md: 20, lg: 24)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Swipe-to-delete list items | Custom pan gesture with useState | SwipeableRow component | Handles edge cases: resistance, velocity detection, snap points, simultaneous swipes, haptic timing |
| Card press animation | Custom Animated.Value with timing | Reanimated withSpring | Runs on UI thread (no dropped frames), cancellable mid-animation, spring physics feel natural |
| Social post timestamps | Custom date formatting logic | Existing formatDate utilities | Handles edge cases: "Just now", "2h ago", "Yesterday", locale support |
| Image placeholders | Hardcoded View with color | ImagePlaceholderIcon component | Consistent icon across all blocks, matches design system colors |
| Interactive state management | Multiple useState hooks | Established loading/disabled pattern | Prevents race conditions, consistent disabled appearance, proper keyboard handling |
| Star rating display | Custom star rendering loop | Rating component | Handles half-stars, disabled state, sizes (sm/md/lg), accessibility labels |

**Key insight:** Content and social blocks compose heavily from existing UI primitives (Avatar, Button, Rating, Badge, Stepper). The block's value is in the data structure and layout pattern, not in reimplementing primitives. If a block needs star ratings, use the Rating component. If it needs quantity controls, use Stepper. Don't rebuild.

## Common Pitfalls

### Pitfall 1: Inconsistent Card Elevation
**What goes wrong:** Some cards use `platformShadow('sm')`, others use `platformShadow('md')`, creating visual inconsistency in feeds
**Why it happens:** Developer copies card pattern from one component but tweaks shadow "to look better" without consulting design system
**How to avoid:**
- Audit ALL card blocks: `grep -r "platformShadow" packages/registry/blocks/`
- Standardize: Card blocks use 'sm', Featured variants use 'md', Dialogs use 'lg'
- Document: Add comment `// All card blocks use shadow 'sm' for consistency`
**Warning signs:** User feedback that cards "look different", shadow depths vary when switching between screens

### Pitfall 2: Missing Loading States on Social Actions
**What goes wrong:** User taps "Like" button, API request takes 500ms, user taps again, double-like fires
**Why it happens:** No visual feedback during async operation, button remains clickable
**How to avoid:**
```typescript
const [liking, setLiking] = useState(false);

const handleLike = async () => {
  setLiking(true);
  try {
    await api.likePost(postId);
  } finally {
    setLiking(false);  // Always reset, even on error
  }
};

<IconButton
  icon={<HeartIcon />}
  onPress={handleLike}
  disabled={liking}               // ✅ Disable during request
  loading={liking}                // ✅ Show spinner
/>
```
**Warning signs:** Users report "liked twice", "unfollowed then followed again", analytics show duplicate events

### Pitfall 3: Swipe Gesture Conflicts
**What goes wrong:** Cart screen has SwipeableRow items inside a horizontal ScrollView, swipe gestures fight
**Why it happens:** Pan gesture from SwipeableRow competes with scroll gesture from parent ScrollView
**How to avoid:**
- Use SwipeableRow `activeOffsetX` to require 10px horizontal movement before capturing gesture
- FlatList in parent should use `scrollEnabled={!swipeOpen}` to disable scroll when item is swiped open
- Avoid horizontal ScrollView as direct parent of swipeable items
**Warning signs:** Users can't scroll list vertically, or can't swipe items horizontally

### Pitfall 4: Accessibility Labels for Icons
**What goes wrong:** VoiceOver reads "Button" for like button, user doesn't know what it does
**Why it happens:** IconButton has no `accessibilityLabel` prop provided
**How to avoid:**
```typescript
<IconButton
  icon={<HeartIcon />}
  accessibilityLabel={liked ? "Unlike post" : "Like post"}  // ✅ Descriptive label
  accessibilityRole="button"
  onPress={handleLike}
/>
```
- Test with VoiceOver (iOS) AND TalkBack (Android) - they behave differently
- Add `accessibilityHint` for complex actions: "Double tap to like this post"
- Ensure touch targets are minimum 44x44pt (iOS HIG requirement)
**Warning signs:** App Store rejection for accessibility violations, user complaints about screen reader support

### Pitfall 5: Hardcoded Typography in Cards
**What goes wrong:** ProductCard title uses `fontSize: 14`, ReviewCard title uses `fontSize: 15`, visual hierarchy is inconsistent
**Why it happens:** Developer eyeballs font size instead of using typography tokens
**How to avoid:**
- ALWAYS use typography tokens: `fontSize.base`, `fontSize.lg`, `fontWeight.semibold`
- Card titles: `fontSize.lg` + `fontWeight.semibold` (18px, 600 weight)
- Card descriptions: `fontSize.base` + color `foregroundMuted` (14px, muted)
- Card metadata: `fontSize.sm` + color `foregroundMuted` (12px, muted)
**Warning signs:** Text sizes vary between similar elements, design review catches inconsistencies

### Pitfall 6: Image Loading States
**What goes wrong:** Card shows empty gray box while image loads, then suddenly pops in (jarring)
**Why it happens:** No skeleton or fade-in animation for Image component
**How to avoid:**
```typescript
const [imageLoaded, setImageLoaded] = useState(false);

<View style={styles.imageContainer}>
  {!imageLoaded && <ImagePlaceholderIcon />}  // Show placeholder
  <Image
    source={{ uri: imageUrl }}
    onLoad={() => setImageLoaded(true)}       // Track load state
    style={[
      styles.image,
      { opacity: imageLoaded ? 1 : 0 }        // Fade in when loaded
    ]}
  />
</View>
```
- Consider using `react-native-fast-image` for better caching
- Add error state: `onError={() => setImageError(true)}`
**Warning signs:** Images "pop" into view, user sees flash of empty state

### Pitfall 7: Swipe Action Icon Color Contrast
**What goes wrong:** Red "Delete" action uses light text on red background, hard to read
**Why it happens:** Not considering WCAG contrast requirements for swipe action labels
**How to avoid:**
- Destructive actions (red background): Use white text `textColor: '#fff'`
- Primary actions (brand color background): Use contrasting foreground color
- Test contrast ratio: Minimum 4.5:1 for WCAG AA compliance
**Warning signs:** Users struggle to read swipe action labels, accessibility audit fails

## Code Examples

Verified patterns from project codebase:

### Card Block with Unified Visual System
```typescript
// Source: packages/registry/blocks/product-card.tsx
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

export function ProductCard({ title, price, image, onPress }) {
  const { colors, spacing, radius, platformShadow } = useTheme();

  const handlePress = () => {
    haptic('light');
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.background,
          borderRadius: radius.lg,              // ✅ Token
          borderWidth: 1,
          borderColor: colors.border,           // ✅ Token
          opacity: pressed ? 0.9 : 1,           // ✅ Press state
        },
        platformShadow('sm'),                   // ✅ Unified shadow
      ]}
    >
      {/* Image section */}
      <View style={[
        styles.imageContainer,
        {
          backgroundColor: colors.secondary,    // ✅ Token
          borderTopLeftRadius: radius.lg - 1,  // Inner radius
          borderTopRightRadius: radius.lg - 1,
        }
      ]}>
        {image ? (
          <Image source={image} style={styles.image} />
        ) : (
          <ImagePlaceholderIcon size={48} color={colors.foregroundMuted} />
        )}
      </View>

      {/* Content section */}
      <View style={{ padding: spacing[3] }}>  {/* ✅ Token */}
        <Text style={[
          styles.title,
          { color: colors.foreground }          // ✅ Token
        ]}>
          {title}
        </Text>
        <Text style={[
          styles.price,
          { color: colors.foreground }          // ✅ Token
        ]}>
          ${price.toFixed(2)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  imageContainer: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
});
```

### Social Block with Interactive States
```typescript
// Source: packages/registry/blocks/feed-post-card.tsx
import { useState } from 'react';
import { IconButton } from '../ui/icon-button';

export function FeedPostCard({ post, onLike, onComment }) {
  const { colors, spacing } = useTheme();
  const [liking, setLiking] = useState(false);
  const [liked, setLiked] = useState(post.liked);

  const handleLike = async () => {
    setLiking(true);
    try {
      await onLike(post.id);
      setLiked(!liked);
    } finally {
      setLiking(false);
    }
  };

  return (
    <View style={{ padding: spacing[4] }}>
      {/* Post header */}
      <View style={{ flexDirection: 'row', gap: spacing[3] }}>
        <Avatar source={post.user.avatar} size="md" />
        <View>
          <Text style={{ color: colors.foreground }}>
            {post.user.name}
          </Text>
          <Text style={{ color: colors.foregroundMuted }}>
            {post.time}
          </Text>
        </View>
      </View>

      {/* Post content */}
      <Text style={{ color: colors.foreground, marginTop: spacing[3] }}>
        {post.content}
      </Text>

      {/* Actions with loading states */}
      <View style={{ flexDirection: 'row', marginTop: spacing[3], gap: spacing[4] }}>
        {/* Like button with loading state */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
          <IconButton
            icon={<HeartIcon filled={liked} activeColor={colors.destructive} />}
            variant="ghost"
            size="sm"
            onPress={handleLike}
            disabled={liking}                           // ✅ Disable during request
            loading={liking}                            // ✅ Show spinner
            accessibilityLabel={liked ? 'Unlike post' : 'Like post'}
          />
          {post.likes > 0 && (
            <Text style={{ color: colors.foregroundMuted }}>
              {post.likes}
            </Text>
          )}
        </View>

        {/* Comment button */}
        <IconButton
          icon={<CommentIcon />}
          variant="ghost"
          size="sm"
          onPress={onComment}
          accessibilityLabel="Comment on post"
        />
      </View>
    </View>
  );
}
```

### Swipeable Block with Consistent Actions
```typescript
// Source: packages/registry/blocks/cart-item.tsx
import { SwipeableRow, SwipeAction } from '../ui/swipeable-row';

export function CartItem({ product, quantity, onQuantityChange, onRemove, onSave }) {
  const { colors, spacing, radius } = useTheme();

  // Define swipe actions
  const rightActions: SwipeAction[] = [
    {
      label: 'Save',
      color: colors.primary,
      icon: <HeartIcon />,
      onPress: () => {
        haptic('light');
        onSave?.();
      },
    },
    {
      label: 'Remove',
      color: colors.destructive,
      icon: <TrashIcon />,
      onPress: () => {
        haptic('medium');
        onRemove?.();
      },
    },
  ];

  // Content to display
  const content = (
    <View style={{ flexDirection: 'row', padding: spacing[4] }}>
      {/* Product image */}
      <View style={{
        width: 80,
        height: 80,
        backgroundColor: colors.secondary,
        borderRadius: radius.md,
      }}>
        <Image source={product.image} style={{ width: '100%', height: '100%' }} />
      </View>

      {/* Product info */}
      <View style={{ flex: 1, marginLeft: spacing[3] }}>
        <Text style={{ color: colors.foreground }}>
          {product.name}
        </Text>
        <Text style={{ color: colors.foreground, marginTop: spacing[1] }}>
          ${product.price.toFixed(2)}
        </Text>

        {/* Quantity stepper */}
        <Stepper
          value={quantity}
          min={1}
          max={99}
          onValueChange={onQuantityChange}
          size="sm"
          style={{ marginTop: spacing[2] }}
        />
      </View>
    </View>
  );

  // Wrap with SwipeableRow
  return (
    <SwipeableRow rightActions={rightActions}>
      {content}
    </SwipeableRow>
  );
}
```

### Responsive Card Variants
```typescript
// Source: packages/registry/blocks/article-card.tsx
export function ArticleCard({ article, variant = 'default', onPress }) {
  const { colors, spacing, radius } = useTheme();

  // Horizontal variant for lists
  if (variant === 'horizontal') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          {
            flexDirection: 'row',
            padding: spacing[3],
            backgroundColor: pressed ? colors.secondary : colors.background,
            borderRadius: radius.lg,
          }
        ]}
      >
        {/* Small 80x80 image on left */}
        <View style={{
          width: 80,
          height: 80,
          backgroundColor: colors.secondary,
          borderRadius: radius.md,
        }}>
          <Image source={article.image} style={{ width: '100%', height: '100%' }} />
        </View>

        {/* Content on right */}
        <View style={{ flex: 1, marginLeft: spacing[3] }}>
          <Text style={{ color: colors.foreground, fontSize: 15 }} numberOfLines={2}>
            {article.title}
          </Text>
          <Text style={{ color: colors.foregroundMuted, fontSize: 12, marginTop: spacing[1] }}>
            {formatDate(article.publishedAt)} · {article.readTime} min
          </Text>
        </View>
      </Pressable>
    );
  }

  // Featured variant for hero sections
  if (variant === 'featured') {
    return (
      <Pressable
        onPress={onPress}
        style={{
          height: 280,
          borderRadius: radius.lg,
          overflow: 'hidden',
        }}
      >
        {/* Full-size background image */}
        <Image
          source={article.image}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        {/* Dark overlay */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />

        {/* Text overlay at bottom */}
        <View style={{ position: 'absolute', bottom: 0, padding: spacing[4] }}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>
            {article.title}
          </Text>
          {article.excerpt && (
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: spacing[1] }}>
              {article.excerpt}
            </Text>
          )}
        </View>
      </Pressable>
    );
  }

  // Default vertical card
  return (
    <Card onPress={onPress}>
      <Image source={article.image} style={{ width: '100%', height: 180 }} />
      <View style={{ padding: spacing[4] }}>
        <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '700' }}>
          {article.title}
        </Text>
        {article.excerpt && (
          <Text style={{ color: colors.foregroundMuted, fontSize: 14, marginTop: spacing[2] }}>
            {article.excerpt}
          </Text>
        )}
      </View>
    </Card>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Animated API for cards | Reanimated withSpring | 2022-2023 | Card press animations run on UI thread, no dropped frames on slower devices |
| Custom pan gestures | react-native-gesture-handler | 2021-2022 | Better gesture recognition, platform-native feel, works with reanimated |
| Hardcoded card spacing | Design token system | Phase 1-3 (2026) | Consistent spacing, easy theme customization, faster iteration |
| Per-component shadows | platformShadow utility | Phase 2-3 (2026) | Platform-specific shadows (iOS: shadowOffset, Android: elevation), consistent depth |
| Manual loading states | Established loading pattern | Phase 4-9 (2026) | Consistent loading UX, prevents double-submissions, proper disabled appearance |
| Inline card components | Composable block system | Phase 10 (2026) | Blocks compose from primitives (Avatar, Button, Rating), less code duplication |

**Deprecated/outdated:**
- **react-native-swipeable (0.6.x)**: Deprecated library, doesn't work with gesture handler v2. Use SwipeableRow component instead.
- **Custom image caching**: React Native Image has built-in caching. Don't build custom cache logic unless proven bottleneck.
- **Hard-coded "2 hours ago" logic**: Use utility functions that handle edge cases (just now, yesterday, locale formatting).
- **Tinder-style swipe cards for product browsing**: User testing shows vertical scrolling is preferred for e-commerce (source: 2025+ UX research).

## Open Questions

Things that couldn't be fully resolved:

1. **Block-Specific Component Tokens**
   - What we know: Cards have `components.card` tokens, buttons have `buttonTokens`
   - What's unclear: Should blocks like ProductCard have `productCardTokens` or use general card tokens?
   - Recommendation: Start with general tokens (spacing, radius, colors). Only add block tokens if multiple blocks share specialized values (e.g., "all e-commerce cards use specific image aspect ratio").

2. **Image Aspect Ratios**
   - What we know: ProductCard uses 1:1 (square), ArticleCard uses ~16:9 (landscape)
   - What's unclear: Should this be configurable via props or locked to design system?
   - Recommendation: Lock to design system for consistency. Product images are always square (better for grid layout), article images are always 16:9 (better for horizontal scroll). Add `aspectRatio` prop only if user explicitly requests it.

3. **Social Action Debouncing**
   - What we know: Like/comment/share actions trigger async API calls
   - What's unclear: Should debouncing be built into IconButton or handled per-block?
   - Recommendation: Handle per-block with loading state. Debouncing can hide intentional double-taps (user likes, unlikes, likes again). Better to disable button during request.

4. **Comment Nesting Depth**
   - What we know: CommentItem supports nested replies
   - What's unclear: How many levels deep should nesting go before flattening?
   - Recommendation: Max 3 levels (comment → reply → reply to reply). Beyond that, flatten with "View more replies" link. Deeper nesting breaks mobile layout (too narrow).

5. **Chat Bubble Grouping Logic**
   - What we know: ChatBubble has `isFirst` and `isLast` props for visual grouping
   - What's unclear: What time threshold groups messages? (5 seconds? 1 minute?)
   - Recommendation: Group messages within 1 minute from same sender. Add "timestamp divider" for gaps > 10 minutes. Document this in block usage guide.

## Sources

### Primary (HIGH confidence)
- Project codebase:
  - packages/registry/blocks/product-card.tsx (card pattern example)
  - packages/registry/blocks/article-card.tsx (variant pattern example)
  - packages/registry/blocks/feed-post-card.tsx (social interaction pattern)
  - packages/registry/blocks/cart-item.tsx (swipeable pattern example)
  - packages/registry/blocks/user-list-item.tsx (list item pattern)
  - packages/registry/blocks/chat-bubble.tsx (messaging pattern)
  - packages/registry/blocks/comment-item.tsx (nested content pattern)
  - packages/registry/blocks/review-card.tsx (review pattern)
  - packages/registry/blocks/event-card.tsx (calendar pattern)
  - packages/registry/ui/swipeable-row.tsx (gesture implementation)
  - packages/registry/ui/card.tsx (unified card system)
  - packages/core/src/theme/components.ts (design tokens)

### Secondary (MEDIUM confidence)
- [React Native Activity Feed Tutorial](https://getstream.io/react-native-activity-feed/tutorial/) - Social feed patterns and engagement features
- [React Native Gesture Handler - Swipeable](https://docs.swmansion.com/react-native-gesture-handler/docs/components/swipeable/) - Official gesture documentation
- [React Native Reanimated & Gesture Handler Apple Wallet Tutorial](https://www.notjust.dev/projects/apple-wallet) - Advanced card animations
- [LogRocket: Build ecommerce app with React Native](https://blog.logrocket.com/build-ecommerce-app-from-scratch-with-react-native/) - E-commerce card patterns
- [React Native Accessibility Documentation](https://reactnative.dev/docs/accessibility) - VoiceOver and TalkBack requirements
- [DEV Community: Building Production-Ready E-Commerce App](https://dev.to/nadim_ch0wdhury/building-a-production-ready-e-commerce-app-with-react-native-expo-2kao) - Production patterns for 2026

### Tertiary (LOW confidence)
- [Medium: Complete Guide Camera & Gallery in React Native (Jan 2026)](https://medium.com/@shovonroy2003/complete-guide-implementing-camera-gallery-in-react-native-social-media-app-77cb228081ae) - Recent social media patterns
- [UXPin: Design Tokens in React](https://www.uxpin.com/studio/blog/what-are-design-tokens-in-react/) - Design token architecture
- WebSearch findings on React Native card best practices 2026 - General ecosystem trends

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in use, versions confirmed in package.json
- Architecture: HIGH - Patterns extracted from existing project code (9 blocks already exist)
- Pitfalls: HIGH - Combination of codebase analysis, prior phase learnings, and verified community patterns
- Token alignment: HIGH - Design token system is established and consistent across project

**Research date:** 2026-01-25
**Valid until:** ~30 days (stable domain - card/social patterns don't change rapidly, but check for library updates)

**Key findings:**
1. All 9 blocks already exist and work - this is refinement, not net-new development
2. Blocks split into 2 categories: card blocks (need visual consistency) and social blocks (need interaction states)
3. SwipeableRow is already built and working - Cart Item and User List Item use it correctly
4. Primary work is token migration (spacing, typography, colors, radius) + interaction state coverage
5. Card blocks should standardize on single shadow depth ('sm') for consistency
6. Social blocks need systematic loading/disabled state verification for all interactive elements
7. Accessibility labels are partially implemented but need audit (VoiceOver/TalkBack testing)
